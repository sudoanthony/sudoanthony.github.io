#!/usr/bin/env node
/* ================================================================
   check-site.js  -  pre-publish checker for sudoanthony.github.io
   ----------------------------------------------------------------
   Run from the repo root:      node check-site.js
   Treat warnings as errors:    node check-site.js --strict
   Plain output (no colour):    node check-site.js --no-color

   Exit code 0 = safe to publish, 1 = something needs fixing.

   What it checks
     1. data.js actually parses (a trailing comma blanks the whole site)
     2. Every WRITEUPS field is present and uses a known value
     3. WRITEUPS is newest-first, no duplicate titles or urls
     4. Every referenced page and icon exists on disk
     5. Orphan writeup-*.html pages not listed in WRITEUPS
     6. tags[] <-> VULNS ids, and the uses[] back-references, both ways
     7. No unredacted flags anywhere in the HTML
     8. Each writeup page has the standard sections and sane heading order
     9. Local hrefs / srcs point at files that exist
   ================================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const STRICT = ARGS.includes('--strict');
const NO_COLOR = ARGS.includes('--no-color') || !!process.env.NO_COLOR;

/* ---------- known-good values -------------------------------- */

const DIFFICULTIES = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Insane', 'Practice'];
const PLATFORMS    = ['TryHackMe', 'HackTheBox', 'Mobile'];
const TEAMS        = ['red', 'blue'];
const SEVERITIES   = ['crit', 'high', 'med', 'low'];
const WRITEUP_FIELDS = ['title', 'url', 'platform', 'team', 'difficulty', 'os',
                        'category', 'icon', 'date', 'summary', 'tags'];

// Sections every finished writeup should have. Matched case-insensitively
// against the <h2> text, so "Privilege escalation to root" satisfies "privileg".
const REQUIRED_SECTIONS = [
  { label: 'Enumeration',            test: /enumerat/i },
  { label: 'Foothold',               test: /foothold/i },
  { label: 'Privilege escalation',   test: /privileg/i },
  { label: 'Root cause & remediation', test: /root cause/i },
  { label: 'Takeaways',              test: /takeaway/i },
];

/* ---------- reporting ---------------------------------------- */

const C = NO_COLOR
  ? { red: s => s, yellow: s => s, green: s => s, dim: s => s, bold: s => s, cyan: s => s }
  : {
      red:    s => `\x1b[31m${s}\x1b[0m`,
      yellow: s => `\x1b[33m${s}\x1b[0m`,
      green:  s => `\x1b[32m${s}\x1b[0m`,
      dim:    s => `\x1b[2m${s}\x1b[0m`,
      bold:   s => `\x1b[1m${s}\x1b[0m`,
      cyan:   s => `\x1b[36m${s}\x1b[0m`,
    };

const errors = [];
const warnings = [];
const notes = [];

const err  = (where, msg, fix) => errors.push({ where, msg, fix });
const warn = (where, msg, fix) => warnings.push({ where, msg, fix });
const note = msg => notes.push(msg);

/* ---------- helpers ------------------------------------------ */

const exists = rel => fs.existsSync(path.join(ROOT, rel));

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// Line number of the first occurrence of a string, for pointing at data.js
function lineOf(haystack, needle) {
  const i = haystack.indexOf(needle);
  if (i === -1) return null;
  return haystack.slice(0, i).split('\n').length;
}

function stripTags(s) {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&rarr;/g, '->')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .trim();
}

/* ================================================================
   1. Parse data.js
   ================================================================ */

if (!exists('data.js')) {
  err('data.js', 'File not found - are you running this from the repo root?');
  report();
}

const dataSrc = read('data.js');
let WRITEUPS, VULNS;

try {
  const sandbox = {};
  vm.createContext(sandbox);
  // data.js uses top-level `const`, which does not become a context property,
  // so hand the two arrays back explicitly.
  vm.runInContext(
    dataSrc + '\n;this.__W = typeof WRITEUPS !== "undefined" ? WRITEUPS : null;' +
              '\n;this.__V = typeof VULNS !== "undefined" ? VULNS : null;',
    sandbox,
    { filename: 'data.js', timeout: 5000 }
  );
  WRITEUPS = sandbox.__W;
  VULNS = sandbox.__V;
} catch (e) {
  err('data.js', `Syntax error - the site will render blank: ${e.message}`,
      'Usually a trailing comma, a missing } or ], or a smart quote pasted from notes.');
  report();
}

if (!Array.isArray(WRITEUPS)) err('data.js', 'WRITEUPS is missing or not an array');
if (!Array.isArray(VULNS))    err('data.js', 'VULNS is missing or not an array');
if (errors.length) report();

note(`data.js parsed - ${WRITEUPS.length} writeups, ${VULNS.length} vulns`);

/* ================================================================
   2 & 3. WRITEUPS schema, ordering, duplicates
   ================================================================ */

const seenTitles = new Map();
const seenUrls = new Map();
const imagesDirPresent = exists('images');

if (!imagesDirPresent) {
  note('no images/ directory here - icon existence checks skipped');
}

WRITEUPS.forEach((w, i) => {
  const at = `WRITEUPS[${i}] ${w && w.title ? `"${w.title}"` : '(untitled)'}`;

  if (!w || typeof w !== 'object') {
    err(at, 'Not an object');
    return;
  }

  for (const f of WRITEUP_FIELDS) {
    const optional = f === 'difficulty';   // difficulty is optional (e.g. training apps aren't rated)
    if (!(f in w)) { if (!optional) err(at, `Missing field: ${f}`); continue; }
    const v = w[f];
    const empty = f === 'tags' ? !Array.isArray(v) || v.length === 0
                               : typeof v !== 'string' || v.trim() === '';
    if (empty && !optional) err(at, `Field "${f}" is empty${f === 'tags' ? ' or not an array' : ''}`);
  }

  const extra = Object.keys(w).filter(k => !WRITEUP_FIELDS.includes(k));
  if (extra.length) warn(at, `Unexpected field(s): ${extra.join(', ')}`,
                             'Harmless, but the templates ignore them.');

  if (w.platform && !PLATFORMS.includes(w.platform))
    err(at, `platform "${w.platform}" is not one of: ${PLATFORMS.join(', ')}`,
            'Platform drives the pink/green colour and the logo grouping.');

  if (w.team && !TEAMS.includes(w.team))
    err(at, `team "${w.team}" is not one of: ${TEAMS.join(', ')}`);

  if (w.difficulty && !DIFFICULTIES.includes(w.difficulty))
    err(at, `difficulty "${w.difficulty}" is not one of: ${DIFFICULTIES.join(', ')}`,
            'Difficulty drives the badge colour; an unknown value renders uncoloured.');

  if (w.date && !/^\d{4}-\d{2}-\d{2}$/.test(w.date)) {
    err(at, `date "${w.date}" is not YYYY-MM-DD`);
  } else if (w.date) {
    const d = new Date(w.date + 'T00:00:00Z');
    if (isNaN(d.getTime())) err(at, `date "${w.date}" is not a real date`);
    else if (d.getTime() > Date.now() + 864e5)
      warn(at, `date "${w.date}" is in the future - this box will sit at the top as "latest"`);
  }

  if (w.url && !/^writeup-[a-z0-9-]+\.html$/.test(w.url))
    warn(at, `url "${w.url}" does not look like writeup-<box>.html`);

  if (w.summary && w.summary.length > 320)
    warn(at, `summary is ${w.summary.length} chars - long for a hover card`);

  // duplicates
  if (w.title) {
    if (seenTitles.has(w.title))
      err(at, `Duplicate title - also at WRITEUPS[${seenTitles.get(w.title)}]`);
    else seenTitles.set(w.title, i);
  }
  if (w.url) {
    if (seenUrls.has(w.url))
      err(at, `Duplicate url "${w.url}" - also at WRITEUPS[${seenUrls.get(w.url)}]`);
    else seenUrls.set(w.url, i);
  }

  // referenced files
  if (w.url && !exists(w.url))
    err(at, `Page "${w.url}" does not exist`,
            'Create the page before adding the data.js entry, or the card 404s.');

  if (w.icon && imagesDirPresent && !exists(w.icon))
    warn(at, `Icon "${w.icon}" not found - the card will fall back to a letter`);
});

// newest-first ordering
for (let i = 1; i < WRITEUPS.length; i++) {
  const prev = WRITEUPS[i - 1], cur = WRITEUPS[i];
  if (!prev || !cur || !prev.date || !cur.date) continue;
  if (cur.date > prev.date) {
    err(`WRITEUPS[${i}] "${cur.title}"`,
        `Out of order: ${cur.date} is newer than "${prev.title}" (${prev.date}) above it`,
        'New boxes go at the TOP of WRITEUPS.');
  }
}

/* ================================================================
   4. VULNS schema
   ================================================================ */

const vulnById = new Map();

VULNS.forEach((v, i) => {
  const at = `VULNS[${i}] ${v && v.id ? `"${v.id}"` : '(no id)'}`;

  if (!v || typeof v !== 'object') { err(at, 'Not an object'); return; }
  if (!v.id)    err(at, 'Missing id - this is what tags[] matches against');
  if (!v.name)  err(at, 'Missing name');
  if (!v.blurb) warn(at, 'Empty blurb - the vuln index row will look bare');
  if (!Array.isArray(v.uses)) { err(at, 'uses[] is missing or not an array'); return; }

  if (v.sev && !SEVERITIES.includes(v.sev))
    err(at, `sev "${v.sev}" is not one of: ${SEVERITIES.join(', ')}`);

  if (v.id) {
    if (vulnById.has(v.id)) err(at, `Duplicate id "${v.id}"`);
    else vulnById.set(v.id, v);
  }

  if (v.uses.length === 0)
    warn(at, 'No uses[] entries - this vuln shows up with no boxes under it');

  const seenUse = new Set();
  v.uses.forEach((u, j) => {
    const uat = `${at} uses[${j}]`;
    if (!u || !u.writeup) { err(uat, 'Missing writeup name'); return; }

    if (seenUse.has(u.writeup)) warn(uat, `Lists "${u.writeup}" twice`);
    seenUse.add(u.writeup);

    const w = WRITEUPS.find(x => x && x.title === u.writeup);
    if (!w) {
      err(uat, `Names "${u.writeup}", which is not a title in WRITEUPS`,
               'Titles must match exactly, including case.');
    } else if (u.url && u.url !== w.url) {
      err(uat, `url "${u.url}" disagrees with WRITEUPS entry ("${w.url}")`);
    }
    if (!u.url) warn(uat, 'Missing url - the row will not link anywhere');
    if (!u.ctx) warn(uat, 'Missing ctx - the one-line "how it was used" note');
  });
});

/* ================================================================
   5. tags[] <-> VULNS.uses[] in both directions
   ================================================================ */

WRITEUPS.forEach((w, i) => {
  if (!w || !Array.isArray(w.tags)) return;
  const at = `WRITEUPS[${i}] "${w.title}"`;

  const seen = new Set();
  w.tags.forEach(tag => {
    if (seen.has(tag)) warn(at, `Duplicate tag "${tag}"`);
    seen.add(tag);

    const v = vulnById.get(tag);
    if (!v) {
      err(at, `tag "${tag}" has no matching id in VULNS`,
              `Add a VULNS entry with id: "${tag}", or fix the typo.`);
      return;
    }
    const listed = (v.uses || []).some(u => u && u.writeup === w.title);
    if (!listed) {
      err(at, `tagged "${tag}" but VULNS["${tag}"].uses[] does not list "${w.title}"`,
              `Step 3 of publishing - add { writeup: "${w.title}", url: "${w.url}", ctx: "..." } to that vuln.`);
    }
  });
});

// reverse: a vuln claims a box that does not tag it back
VULNS.forEach(v => {
  if (!v || !v.id || !Array.isArray(v.uses)) return;
  v.uses.forEach(u => {
    if (!u || !u.writeup) return;
    const w = WRITEUPS.find(x => x && x.title === u.writeup);
    if (!w || !Array.isArray(w.tags)) return;
    if (!w.tags.includes(v.id)) {
      err(`VULNS["${v.id}"]`,
          `Lists "${u.writeup}", but that entry's tags[] does not include "${v.id}"`,
          `Add "${v.id}" to WRITEUPS "${u.writeup}" tags[], or drop the uses[] entry.`);
    }
  });
});

// vulns nobody references
const usedIds = new Set(WRITEUPS.flatMap(w => (w && w.tags) || []));
[...vulnById.keys()].filter(id => !usedIds.has(id)).forEach(id => {
  warn(`VULNS["${id}"]`, 'No writeup tags this vuln', 'It will render with an empty box list.');
});

/* ================================================================
   6. Orphan writeup pages
   ================================================================ */

const onDisk = fs.readdirSync(ROOT).filter(f => /^writeup-.+\.html$/i.test(f));
const referenced = new Set(WRITEUPS.map(w => w && w.url).filter(Boolean));

onDisk.filter(f => !referenced.has(f)).forEach(f => {
  warn(f, 'Page exists but no WRITEUPS entry points at it - invisible on the site',
          'Either add the data.js entry, or leave it if the box is still in progress.');
});

/* ================================================================
   7. Unredacted flags
   ================================================================ */

const REDACTED = /^\s*(\[?redacted\]?|\.{3}|x+|snip+(ed)?|removed)\s*$/i;

// Things like THM{...}, flag{...}, helmet_key{...}
const BRACE_FLAG = /\b([A-Za-z][A-Za-z0-9_]{1,20})\{([^}<\n]{0,120})\}/g;
// Bare long hashes - often legitimate writeup content, so only a warning
const BARE_HASH = /\b[0-9a-f]{32,64}\b/gi;
// Anything that reads like a printed flag file
const FLAG_FILE = /\b(user|root|local|proof)\.txt\b\s*[:=]?\s*([0-9a-f]{16,})/gi;

const htmlFiles = fs.readdirSync(ROOT).filter(f => /\.html$/i.test(f));

htmlFiles.forEach(f => {
  const src = read(f);
  const lines = src.split('\n');

  lines.forEach((line, n) => {
    const where = `${f}:${n + 1}`;
    let flagged = false; // avoid reporting the same string as both error and warning

    let m;
    BRACE_FLAG.lastIndex = 0;
    while ((m = BRACE_FLAG.exec(line))) {
      const [full, label, body] = m;
      // CSS/JS braces and template syntax slip through the regex occasionally
      if (/^(if|for|while|function|return|else|catch|try|and|or|the)$/i.test(label)) continue;
      if (body.includes(':') && /[a-z-]+\s*:/.test(body)) continue; // css rule
      if (body === '' || REDACTED.test(body)) continue;
      flagged = true;
      err(where, `Looks like a live flag: ${full.slice(0, 70)}`,
                 'Replace the value with [redacted] before publishing.');
    }

    FLAG_FILE.lastIndex = 0;
    while ((m = FLAG_FILE.exec(line))) {
      flagged = true;
      err(where, `Flag-file contents printed: ${m[0].slice(0, 60)}`,
                 'Redact the hash.');
    }

    if (!flagged) {
      BARE_HASH.lastIndex = 0;
      while ((m = BARE_HASH.exec(line))) {
        warn(where, `Long hex string (${m[0].length} chars): ${m[0].slice(0, 24)}...`,
                    'Fine if it is a hash you are demonstrating; not fine if it is a flag.');
      }
    }
  });
});

/* ================================================================
   8. Page structure
   ================================================================ */

const inProgress = new Set(); // pages we only warn about

WRITEUPS.forEach(w => {
  if (!w || !w.url || !exists(w.url)) return;
  const src = read(w.url);
  const at = w.url;

  const h1s = [...src.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => stripTags(m[1]));
  if (h1s.length === 0) err(at, 'No <h1> - the box title is the top of the size hierarchy');
  else if (h1s.length > 1) warn(at, `${h1s.length} <h1> elements - expected exactly one`);
  else if (w.title && !h1s[0].toLowerCase().includes(w.title.toLowerCase()))
    warn(at, `<h1> is "${h1s[0]}" but data.js title is "${w.title}"`);

  const h2s = [...src.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => stripTags(m[1]));
  const joined = h2s.join(' | ');

  const missing = REQUIRED_SECTIONS.filter(s => !s.test.test(joined));
  if (missing.length) {
    warn(at, `Missing section(s): ${missing.map(s => s.label).join(', ')}`,
             'Expected if the box is not rooted yet; fix before publishing.');
    inProgress.add(at);
  }

  // heading order: no h3 before the first h2
  const firstH2 = src.search(/<h2[^>]*>/i);
  const firstH3 = src.search(/<h3[^>]*>/i);
  if (firstH3 !== -1 && (firstH2 === -1 || firstH3 < firstH2))
    warn(at, '<h3> appears before any <h2> - heading levels skipped');

  // numbered section prefixes should run 01, 02, 03...
  const nums = [...src.matchAll(/<h2[^>]*>\s*<span class="num">\s*(\d+)\s*<\/span>/gi)]
                  .map(m => parseInt(m[1], 10));
  if (nums.length) {
    nums.forEach((n, i) => {
      if (n !== i + 1)
        warn(at, `Section numbers out of sequence: got ${String(n).padStart(2, '0')} where ${String(i + 1).padStart(2, '0')} was expected`);
    });
  }
});

/* ================================================================
   9. Local links and assets
   ================================================================ */

const missingAssets = new Map(); // rel -> [where]

htmlFiles.forEach(f => {
  const src = read(f);
  const lines = src.split('\n');
  lines.forEach((line, n) => {
    const re = /(?:href|src)\s*=\s*["']([^"'#?]+)["']/gi;
    let m;
    while ((m = re.exec(line))) {
      const target = m[1].trim();
      if (!target) continue;
      if (/^(https?:|mailto:|data:|javascript:|\/\/|#)/i.test(target)) continue;
      if (target.startsWith('/')) continue; // absolute site paths; skip
      if (!imagesDirPresent && /^images\//i.test(target)) continue;
      if (exists(target)) continue;
      const key = target;
      if (!missingAssets.has(key)) missingAssets.set(key, []);
      missingAssets.get(key).push(`${f}:${n + 1}`);
    }
  });
});

missingAssets.forEach((wheres, target) => {
  const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(target);
  const msg = `Missing local file "${target}" - referenced by ${wheres.slice(0, 3).join(', ')}${wheres.length > 3 ? ` +${wheres.length - 3} more` : ''}`;
  if (isImage) warn(target, msg, 'Broken image on the live page.');
  else err(target, msg);
});

/* ================================================================
   report
   ================================================================ */

report();

function report() {
  const line = '-'.repeat(64);
  console.log('');
  console.log(C.bold('  sudoanthony.github.io - pre-publish check'));
  console.log(C.dim(`  ${ROOT}`));
  console.log(C.dim(`  ${line}`));

  notes.forEach(n => console.log(`  ${C.dim('·')} ${C.dim(n)}`));
  if (notes.length) console.log('');

  const show = (list, colour, tag) => {
    list.forEach(({ where, msg, fix }) => {
      console.log(`  ${colour(tag)} ${C.cyan(where)}`);
      console.log(`      ${msg}`);
      if (fix) console.log(`      ${C.dim('-> ' + fix)}`);
    });
    if (list.length) console.log('');
  };

  show(errors, C.red, 'ERROR');
  show(warnings, C.yellow, 'WARN ');

  console.log(C.dim(`  ${line}`));

  const e = errors.length, w = warnings.length;
  if (e === 0 && w === 0) {
    console.log(`  ${C.green('PASS')}  nothing to fix - safe to publish`);
  } else if (e === 0) {
    console.log(`  ${STRICT ? C.red('FAIL') : C.green('PASS')}  ${w} warning${w === 1 ? '' : 's'}, 0 errors${STRICT ? ' (--strict: warnings count as failures)' : ''}`);
  } else {
    console.log(`  ${C.red('FAIL')}  ${e} error${e === 1 ? '' : 's'}, ${w} warning${w === 1 ? '' : 's'}`);
  }
  console.log('');

  process.exit(e > 0 || (STRICT && w > 0) ? 1 : 0);
}

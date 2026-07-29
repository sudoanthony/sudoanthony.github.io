/* ================================================================
   data.js  —  THE ONLY FILE YOU EDIT WHEN YOU PUBLISH A WRITEUP
   ----------------------------------------------------------------
   Two lists live here:
     WRITEUPS  drives the home page (latest + random) and writeups.html
     VULNS     drives vulns.html (the big index) automatically

   NOTE: the VULNS entries below are GENERIC EXAMPLES so you can see how
   the index renders. They are NOT Hammer's solution. Delete them and add
   your own real techniques after you solve and write up each box.

   To publish a new writeup:
     1. Write writeup-<name>.html from the template.
     2. Add ONE object to the TOP of WRITEUPS (newest first).
     3. For each technique the box used, add the writeup to that vuln's
        `uses` array in VULNS — or add a new vuln object if it's new.
     4. Make each tag chip in the writeup link to vulns.html#<that-id>.

   Severity: "crit" | "high" | "med" | "low"
   Category: "web" | "auth" | "priv-esc" | "ad" | "network" | "crypto"
   ================================================================ */

const WRITEUPS = [
  {
    title:      "Hammer",
    url:        "writeup-hammer.html",
    platform:   "TryHackMe",
    difficulty: "Medium",
    date:       "2026-07-29",              // YYYY-MM-DD — controls "latest"
    summary:    "Writeup in progress — solving it myself, notes to follow.",
    tags:       []                          // add technique ids here after you finish
  }
  // ,{  next writeup goes here, at the TOP for newest-first
  //   title:"", url:"", platform:"", difficulty:"", date:"", summary:"", tags:[]
  // }
];

/* ---- EXAMPLE VULNS (delete these once you have real ones) ----
   They exist only to show you the layout: severity ordering, the filter
   chips, the "deep dive" link state, and the per-writeup `uses` list. */
const VULNS = [
  {
    id:    "example-sqli",
    name:  "SQL injection",
    cat:   "web",
    sev:   "crit",
    ext:   "CWE-89",                        // optional grey reference id
    blurb: "EXAMPLE ENTRY — user input concatenated into a SQL query, letting an attacker read or alter the database.",
    deepdive: "",                           // "" = heading is plain text (no article yet)
                                            // later: "vuln-example-sqli.html" makes it a link
    uses: [
      { writeup: "Example Box", url: "#", ctx: "EXAMPLE — replace with a real writeup + how it was used" }
    ]
  },
  {
    id:    "example-privesc",
    name:  "Privilege escalation via misconfigured sudo",
    cat:   "priv-esc",
    sev:   "high",
    ext:   "",
    blurb: "EXAMPLE ENTRY — a sudo rule that allows running a binary in a way that spawns a root shell.",
    deepdive: "",
    uses: [
      { writeup: "Example Box", url: "#", ctx: "EXAMPLE — replace me" }
    ]
  }
];

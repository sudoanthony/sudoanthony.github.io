---
box: ""
platform: TryHackMe        # TryHackMe | HackTheBox
team: red                  # red | blue
difficulty: Medium         # Easy | Medium | Hard | Insane
date: 2026-01-01
ip: ""
time_spent: ""
tags: []                   # technique slugs — these become the writeup tag chips + vuln index ids
---

# <Box Name>

> **HOW TO USE THIS FILE**
> 1. Copy it per box: `boxes/<name>/notes.md`. Keep it open the whole time.
> 2. Start a terminal log FIRST so you never lose a command:
>    `script -q boxes/<name>/terminal.log`
> 3. Point Flameshot auto-save at `boxes/<name>/screenshots/` and capture liberally.
> 4. Every `##` heading below maps 1:1 to a section in `writeup-<name>.html`.
>    Fill them live. When you're done, curate and paste across — the writeup is
>    already 90% written because your notes are in its shape.

---

## LOOT
> Fill the INSTANT you find anything. In chained boxes the key for step A hides in step G —
> this table is how you stop scrolling back through everything.

| what              | value | where found |
|-------------------|-------|-------------|
| creds             |       |             |
| hash / key        |       |             |
| flag (redact later)|      |             |
| useful URL / port |       |             |

## SCREENSHOT LOG
> Over-capture now, curate to the best 3–5 later. Note what each shot proves so
> future-you isn't guessing. "keep?" = is this writeup-worthy or just working evidence.

| file            | shows                    | keep? |
|-----------------|--------------------------|-------|
| 01-nmap.png     | open ports               |       |
|                 |                          |       |

---

## TL;DR
> Write this LAST. 2–3 sentences, the whole chain at a high level.  → writeup: TL;DR block
-

## 01 · Enumeration
> → writeup: **§01 Enumeration**

**Port scan**
```
$ nmap -p- --min-rate 1000 -T4 <ip>
$ nmap -p <ports> -sVC <ip>

# open:
```
- what stood out / first hypothesis:
- why:

## 02 · Service & web enumeration
> → writeup: **§02 (recon continued)** — split into more `##` sections if the box is big (e.g. "the web app", "the crests")

- directories / vhosts / source-code hints:
```
$ 
```
- interesting finds:
- **why this matters:**

## 03 · Foothold
> → writeup: **§ Foothold** — how you got the FIRST shell / first real access

- the obstacle:
- the idea:
- the step that worked:
```
$ 
```
- first access as user: `______`

## 04 · Privilege escalation
> → writeup: **§ Privilege escalation**

- enumeration that revealed the path (sudo -l, SUID, cron, service, kernel…):
```
$ sudo -l
$ 
```
- the escalation step:
```
$ 
```
- root confirmed:
```
$ id
```

## 05 · Root cause & remediation
> → writeup: **§ Root cause & remediation**. Fill one row per weakness as you go —
> this is the section that makes your writeup read like a report, not a walkthrough.

| weakness | how you'd fix it |
|----------|------------------|
|          |                  |
|          |                  |

## 06 · Takeaways
> → writeup: **§ Takeaways**

- what was new to me:
- what I'd do faster next time:
- real-world echo (where does this bug show up in production?):
- the one charming/honest detail worth keeping (the detour, the facepalm, the "aha"):

---

## → WRITEUP TRANSFER CHECKLIST
> Run this when you sit down to build `writeup-<name>.html`.

- [ ] Copy `writeup-biohazard.html` → `writeup-<name>.html`
- [ ] Fill meta badges from the front matter above (platform / team / difficulty / date)
- [ ] Paste each `##` section's content into the matching writeup section
- [ ] **Redact every `flag{...}` value** — method public, answer redacted
- [ ] Pick best 3–5 screenshots, annotate them, drop in `images/`, swap the `SCREENSHOT` boxes for `<figure>`
- [ ] Write the TL;DR last
- [ ] Add tag chips in the writeup → each `href="vulns.html#<id>"` must match a `tags:` slug
- [ ] Register it in `data.js`: add to `WRITEUPS` (top), and add this box to each technique's `uses[]` in `VULNS`
- [ ] Push, hard-refresh, confirm it shows on the home page + writeups + vuln index

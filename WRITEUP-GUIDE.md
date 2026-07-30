# The golden writeup — what I learned from comparing the field

I read across the published Hammer writeups and the general CTF-writeup norm to
build your template. Here's the short version of what separates the strong ones
from the forgettable ones, so you know *why* the template is shaped the way it is.

## What the average writeup does (and why it's forgettable)

Most writeups — including several popular Hammer ones — are a **command dump with
screenshots**. `nmap`, screenshot, `ffuf`, screenshot, flag. They prove you *did*
the box. They do **not** prove you *understand* it, and that's the only thing an
employer is reading for. Common flaws:

- **No root cause.** They show the exploit but never say why the bug exists.
- **No remediation.** Almost none explain how they'd fix it. This is the single
  biggest, easiest gap to beat.
- **Flags pasted in plaintext.** Looks careless and invites copyright takedowns.
- **Screenshot walls.** 15 images, no narration. The reader can't follow the logic.
- **No voice.** Interchangeable with every other writeup of the same box.

## What the strong ones do

- **A real TL;DR** at the top — the whole chain in 2–3 sentences.
- **They teach the mechanism**, in their own words, at each step.
- **They admit the detours** — where they got stuck and what unstuck them.
- **A root-cause + fix section** that reads like a mini pentest report.
- **A short reflection** that ties the bug to the real world.

The template (`writeup-hammer.html`) bakes all of this into the structure. You
mostly just fill in prompts.

---

## Where to add YOUR charm (marked in teal in the template)

Voice is what makes a hiring manager remember *you* and not the box. Five spots,
each a couple of sentences — no more:

1. **The hook** (top) — why this box, or the idea that made it click.
2. **The honest detour** (recon) — the moment you got stuck. Relatability + realism.
3. **Teach the mechanism** (foothold) — explain `X-Forwarded-For` like you're
   teaching a junior. This is the "I understand it" signal.
4. **The "why it works" box** (priv-esc) — connect the two design mistakes that
   combine into game-over.
5. **The reflection** (end) — what was new, what you'd do faster, real-world tie-in.

Keep charm **short and specific**. A single true sentence ("I burned 20 minutes
before I checked the page source") beats a paragraph of personality. Don't force
jokes; dry and honest reads better than trying-hard.

## Two hard rules

- **Never paste flag values.** Say "recovered the user flag" or blur it. Method
  public, answer redacted.
- **Only publish retired / permitted content.** TryHackMe writeups for its rooms
  are fine and common (Hammer included). For Hack The Box, *retired machines only* —
  active-machine writeups violate their ToS.

---

## Adding a new writeup — the mechanical loop

1. `writeup-hammer.html` → **Save As** `writeup-<box>.html`. Delete every blue
   `.note` (those are reminders), rewrite the grey prompts, keep the structure.
2. In `data.js`, add one object to the **top** of `WRITEUPS` (newest first):
   ```js
   { title:"Box", url:"writeup-box.html", platform:"TryHackMe",
     difficulty:"Easy", date:"2026-08-05", summary:"one line", tags:["jwt-forgery"] }
   ```
3. For each technique, add your writeup to that vuln's `uses` in `VULNS`. New
   technique? Add a new vuln object (copy an existing one, change the fields).
   Make sure each tag chip in your writeup links to `vulns.html#<that-id>`.

That's the whole system. Everything else updates itself.

# sudoanthony — security writeups site

A dark, static portfolio for pentest / CTF writeups. No build step, no
dependencies, no server. Every page is plain HTML that reads its data from
`data.js`, so publishing a new writeup means editing one file.

---

## What's in this folder

| File | What it is | Do you edit it? |
|------|------------|-----------------|
| `index.html` | Landing page (name, latest writeup, about, contact) | **Yes** — your about blurb + contact links |
| `writeups.html` | Auto-generated list of all writeups | No |
| `vulns.html` | The vulnerability index (the "big web") | No |
| `writeup-hammer.html` | Your first writeup + the golden template | **Yes** — fill it in |
| `data.js` | The one data file that drives everything | **Yes** — every new writeup |
| `style.css` | The whole design. Change colors/fonts at the top | Optional |
| `WRITEUP-GUIDE.md` | How to write a strong writeup + how to add one | Read it |
| `profile-README.md` | For your github.com **profile** (separate repo) | **Yes** |

---

## Part A — get the site live on GitHub Pages (~10 min)

You have two good options for the URL.

### Option 1 (recommended): username.github.io
Gives you the clean address **`sudoanthony.github.io`**.

1. On GitHub, click **New repository**.
2. Name it **exactly** `sudoanthony.github.io` (your username + `.github.io`).
3. Set it **Public**. Create it.
4. Upload every file in this folder **except** the two `.md` guide files
   and `profile-README.md`:
   - Click **Add file -> Upload files**, drag in `index.html`, `writeups.html`,
     `vulns.html`, `writeup-hammer.html`, `data.js`, `style.css`.
   - Commit.
5. Go to **Settings -> Pages**. Under "Build and deployment", Source =
   **Deploy from a branch**, Branch = **main** / **/(root)**. Save.
6. Wait ~1 minute, then visit **https://sudoanthony.github.io**. Done.

### Option 2: a project repo (e.g. /writeups)
If you'd rather keep your username repo for something else, make a normal repo
called `writeups`, upload the same files, enable Pages the same way. Your URL
becomes `sudoanthony.github.io/writeups/`. Everything still works because
all links are relative.

> **Local preview:** just double-click `index.html`. Because the data lives in
> `data.js` (not a fetched JSON file), the whole site works straight off your
> disk with no server.

---

## Part B — make your GitHub *profile* point at the site (~3 min)

The page at github.com/sudoanthony is controlled by a special repo with the
**same name as your username**. It only renders Markdown, so the move is a short
intro plus a big link to your real site.

1. New repository named **`sudoanthony`** (exactly your username), Public.
   GitHub will show a note: *"You found a secret! This is a special repository..."* —
   that confirms you've got the right name.
2. Add a file named `README.md`.
3. Paste the contents of **`profile-README.md`** from this folder (edit the links first).
4. Commit. Your profile now shows it.

---

## Part C — publish your next writeup (the whole loop)

1. Duplicate `writeup-hammer.html`, rename to `writeup-<box>.html`, write it
   (see `WRITEUP-GUIDE.md`).
2. Open `data.js`. Add one object to the **top** of `WRITEUPS`.
3. For each technique the box used, add your writeup to that vuln's `uses` list
   in `VULNS` (or add a new vuln if it's a technique you haven't catalogued).
4. Upload the new/changed files. The home page, writeups list, and vuln index
   all update themselves.

---

## Turning on the extras later

- **Stat counters** ("N writeups") on the home page — uncomment the two marked
  blocks in `index.html` once the numbers look good (~8+ writeups).
- **Deep-dive articles** — when you write a full explainer for a technique,
  create `vuln-<id>.html` and set that filename as `deepdive` on the vuln in
  `data.js`. Its heading in the index turns into a link automatically.
- **The node graph** — deliberately left out for now; it looks empty with few
  writeups. Ask me to add it once you have a dozen or so and it'll read from the
  same `data.js`.

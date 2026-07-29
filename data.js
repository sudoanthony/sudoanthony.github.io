/* ================================================================
   data.js  —  THE ONLY FILE YOU EDIT WHEN YOU PUBLISH A WRITEUP
   ----------------------------------------------------------------
   WRITEUPS  drives the home page + the writeups.html card grid
   VULNS     drives vulns.html (the big index) automatically

   ADD A NEW BOX  → copy the block below, put it at the TOP of WRITEUPS:
     {
       title:      "Box Name",
       url:        "writeup-boxname.html",     // the page you wrote
       platform:   "HackTheBox",               // "TryHackMe" (pink) | "HackTheBox" (green)
       team:       "red",                      // "red" | "blue"
       difficulty: "Medium",                   // Easy | Medium | Hard | Insane
       os:         "Linux",                    // Linux | Windows | ...
       category:   "Web",                      // Web | SMB | AD | Crypto | ...
       icon:       "images/icons/boxname.png", // your icon (falls back to a letter if missing)
       date:       "2026-08-01",               // YYYY-MM-DD — controls order + "latest"
       summary:    "One or two sentences shown on hover.",
       tags:       ["some-technique"]          // must match ids in VULNS below
     },
   Then add this box to each technique's `uses[]` in VULNS (or add a new vuln).
   ================================================================ */

const WRITEUPS = [
  {
    title:      "Abducted",
    url:        "writeup-abducted.html",
    platform:   "HackTheBox",
    team:       "red",
    difficulty: "Medium",
    os:         "Linux",
    category:   "SMB",
    icon:       "images/icons/abducted.png",
    date:       "2026-07-30",
    summary:    "Unauthenticated Samba print command injection (CVE-2026-4480) to a foothold, then credential reuse and wide-link abuse to pivot users, and a systemd/polkit misconfig to root.",
    tags:       ["command-injection", "exposed-credentials", "priv-esc"]
  },
  {
    title:      "Biohazard",
    url:        "writeup-biohazard.html",
    platform:   "TryHackMe",
    team:       "red",
    difficulty: "Medium",
    os:         "Linux",
    category:   "Web",
    icon:       "images/icons/biohazard.png",
    date:       "2026-07-29",
    summary:    "A Resident Evil themed box: layered Base32/64/58 + Vigenère chains leak FTP creds, three images hide key fragments, and medals + a final Vigenère lead through SSH to root.",
    tags:       ["data-obfuscation", "steganography", "exposed-credentials", "priv-esc"]
  }
];

const VULNS = [
  {
    id:    "command-injection",
    name:  "OS command injection",
    cat:   "web",
    sev:   "crit",
    ext:   "CWE-78",
    blurb: "Unescaped, client-controlled input passed into a shell command — here, Samba's print subsystem (CVE-2026-4480) executing a crafted print-job name.",
    deepdive: "",
    uses: [
      { writeup: "Abducted", url: "writeup-abducted.html", ctx: "CVE-2026-4480 — %J print-job name reaches the shell unescaped -> reverse shell as nobody" }
    ]
  },
  {
    id:    "priv-esc",
    name:  "Privilege escalation to root",
    cat:   "priv-esc",
    sev:   "crit",
    ext:   "",
    blurb: "Turning a foothold user into root through a local misconfiguration.",
    deepdive: "",
    uses: [
      { writeup: "Abducted", url: "writeup-abducted.html", ctx: "writable systemd drop-in dir + polkit rule to restart smbd -> ExecStartPre SetUID bash" },
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "operator re-auths to root with a reused password" }
    ]
  },
  {
    id:    "exposed-credentials",
    name:  "Exposed / reused credentials",
    cat:   "auth",
    sev:   "high",
    ext:   "CWE-522",
    blurb: "Credentials recoverable by a low-priv user and reused across accounts — obfuscated configs, key files, shared passwords.",
    deepdive: "",
    uses: [
      { writeup: "Abducted", url: "writeup-abducted.html", ctx: "rclone-obfuscated backup password revealed and reused for scott's SSH" },
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "creds hidden behind an encoding chain, then key files on FTP" }
    ]
  },
  {
    id:    "steganography",
    name:  "Steganography — data hidden in files",
    cat:   "forensics",
    sev:   "med",
    ext:   "",
    blurb: "Secrets concealed inside otherwise-normal files: embedded in image data, or archives appended to a JPEG.",
    deepdive: "",
    uses: [
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "empty-passphrase steghide, appended data, and an embedded file across three key images" }
    ]
  },
  {
    id:    "data-obfuscation",
    name:  "Obfuscation mistaken for encryption",
    cat:   "crypto",
    sev:   "med",
    ext:   "",
    blurb: "Encodings (Base32/64/58) and classical ciphers (Vigenère, ROT13) used to 'protect' data — all reversible with no secret, identified by their alphabets.",
    deepdive: "",
    uses: [
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "layered Base32 -> Vigenère -> Base64/Base32 -> Base58 chain guarding FTP creds" }
    ]
  }
];

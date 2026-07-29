/* ================================================================
   data.js  —  THE ONLY FILE YOU EDIT WHEN YOU PUBLISH A WRITEUP
   ----------------------------------------------------------------
   WRITEUPS  drives the home page (latest + random) and writeups.html
   VULNS     drives vulns.html (the big index) automatically

   To publish a new writeup:
     1. Write writeup-<name>.html from writeup-biohazard.html (your template).
     2. Add ONE object to the TOP of WRITEUPS (newest first).
     3. For each technique the box used, add the writeup to that vuln's
        `uses` array in VULNS — or add a new vuln object if it's new.
     4. Make each tag chip in the writeup link to vulns.html#<that-id>.

   Severity: "crit" | "high" | "med" | "low"
   Category: "web" | "auth" | "priv-esc" | "crypto" | "forensics" | "network"
   ================================================================ */

const WRITEUPS = [
  {
    title:      "Biohazard",
    url:        "writeup-biohazard.html",
    platform:   "TryHackMe",                // "TryHackMe" (pink) | "HackTheBox" (green)
    team:       "red",                      // "red" | "blue"
    difficulty: "Medium",                   // Easy | Medium | Hard | Insane
    date:       "2026-07-29",               // YYYY-MM-DD — controls "latest"
    summary:    "A Resident Evil themed box: a layered Base32/64/58 + Vigenère chain leaks FTP creds, three images hide key fragments (empty-passphrase steghide, appended data, an embedded file) that rebuild the GPG passphrase and helmet key, and medals + a final Vigenère lead through SSH to root.",
    tags:       ["data-obfuscation", "steganography", "exposed-credentials", "priv-esc"]
  }
  // ,{  next writeup goes here, at the TOP for newest-first
  //   title:"", url:"", platform:"TryHackMe", team:"red", difficulty:"", date:"", summary:"", tags:[]
  // }
];

const VULNS = [
  {
    id:    "exposed-credentials",
    name:  "Exposed credentials",
    cat:   "auth",
    sev:   "high",
    ext:   "CWE-522",
    blurb: "Credentials recoverable by an unauthenticated user — here, buried in web content and reachable over FTP.",
    deepdive: "",                          // "" = plain heading. Set "vuln-exposed-credentials.html" later to link it.
    uses: [
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "creds hidden behind an encoding chain, then key files sitting on FTP" }
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
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "fill in the exact vector once your section 05 is written" }
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
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "empty-passphrase steghide, an appended ZIP, and a TAR across three key images" }
    ]
  },
  {
    id:    "data-obfuscation",
    name:  "Obfuscation mistaken for encryption",
    cat:   "crypto",
    sev:   "med",
    ext:   "",
    blurb: "Encodings (Base32/64/58) and classical ciphers (Vigenère) used to 'protect' data — all reversible with no secret, identified by their alphabets.",
    deepdive: "",                          // strong candidate for your first deep-dive article later
    uses: [
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "layered Base32 -> Vigenère -> Base64/Base32 -> Base58 chain guarding FTP creds" }
    ]
  }
];

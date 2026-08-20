/* ================================================================
   data.js  -  THE ONLY FILE YOU EDIT WHEN YOU PUBLISH A WRITEUP
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
       date:       "2026-08-01",               // YYYY-MM-DD - controls order + "latest"
       summary:    "One or two sentences shown on hover.",
       tags:       ["some-technique"]          // must match ids in VULNS below
     },
   Then add this box to each technique's `uses[]` in VULNS (or add a new vuln).
   ================================================================ */

const WRITEUPS = [
  {
    title:      "OWASP Mobile Top 10: Android",
    url:        "writeup-allsafe.html",
    platform:   "Mobile",
    team:       "red",
    difficulty: "Practice",
    os:         "Android",
    category:   "App Pentest",
    icon:       "images/icons/allsafe.png",
    date:       "2026-07-31",
    summary:    "Featuring AllSafe, with help from InsecureBankv2 and AndroGoat. A mobile penetration testing methodology that works all three Android targets to demonstrate each risk of the OWASP Mobile Top 10 (2024) - worked examples with screenshots, plus a severity-rated report for every vulnerability found.",
    tags:       ["hardcoded-secret", "insecure-logging", "exported-component", "insecure-storage"]
  },
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
    id:    "hardcoded-secret",
    name:  "Hardcoded secret in app resources",
    cat:   "mobile",
    sev:   "low",
    ext:   "CWE-798 · MASVS-STORAGE · M8",
    blurb: "A secret compiled into the APK (strings.xml / resources / smali) - recoverable by anyone with the binary. Severity depends on what the secret authorizes; a challenge-gate key is Low, a live API key is not.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10: Android", url: "writeup-allsafe.html", ctx: "UUID in strings.xml gates a deep link - found via the R.string.key reference, not a keyword grep" }
    ]
  },
  {
    id:    "insecure-logging",
    name:  "Sensitive data written to logcat",
    cat:   "mobile",
    sev:   "low",
    ext:   "CWE-532 · MASVS-STORAGE · M9",
    blurb: "App logs that leak URIs, tokens, or PII to logcat. The pattern is the finding - it would leak any future secret carried through the same code path.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10: Android", url: "writeup-allsafe.html", ctx: "full deep-link Uri (with query string) concatenated into a Log.d call" }
    ]
  },
  {
    id:    "exported-component",
    name:  "Exported component / BROWSABLE deep link",
    cat:   "mobile",
    sev:   "med",
    ext:   "CWE-926 · MASVS-PLATFORM · M8",
    blurb: "An activity exported with a VIEW + BROWSABLE intent filter is reachable from any web page - an unauthenticated entry point into app internals.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10: Android", url: "writeup-allsafe.html", ctx: "exported activity + BROWSABLE deep link invokable from an arbitrary web page" }
    ]
  },
  {
    id:    "insecure-storage",
    name:  "Sensitive data stored in cleartext on the device",
    cat:   "mobile",
    sev:   "low",
    ext:   "CWE-312 · MASVS-STORAGE · M9",
    blurb: "Credentials or tokens written to the app sandbox in plaintext - SharedPreferences XML, a SQLite row, a file. The sandbox only stops other apps at runtime; root, a backup, or forensic access reads it straight off the device. The fix is the Android Keystore (EncryptedSharedPreferences). Severity tracks reachability: worse on world-readable external storage than inside /data/data.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10: Android", url: "writeup-allsafe.html", ctx: "credentials written to shared_prefs/user.xml in plaintext - no encryption, no Keystore; sandbox swept and /sdcard empty" }
    ]
  },
  {
    id:    "command-injection",
    name:  "OS command injection",
    cat:   "web",
    sev:   "crit",
    ext:   "CWE-78",
    blurb: "Unescaped, client-controlled input passed into a shell command - here, Samba's print subsystem (CVE-2026-4480) executing a crafted print-job name.",
    deepdive: "",
    uses: [
      { writeup: "Abducted", url: "writeup-abducted.html", ctx: "CVE-2026-4480 - %J print-job name reaches the shell unescaped -> reverse shell as nobody" }
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
    blurb: "Credentials recoverable by a low-priv user and reused across accounts - obfuscated configs, key files, shared passwords.",
    deepdive: "",
    uses: [
      { writeup: "Abducted", url: "writeup-abducted.html", ctx: "rclone-obfuscated backup password revealed and reused for scott's SSH" },
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "creds hidden behind an encoding chain, then key files on FTP" }
    ]
  },
  {
    id:    "steganography",
    name:  "Steganography - data hidden in files",
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
    blurb: "Encodings (Base32/64/58) and classical ciphers (Vigenère, ROT13) used to 'protect' data - all reversible with no secret, identified by their alphabets.",
    deepdive: "",
    uses: [
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "layered Base32 -> Vigenère -> Base64/Base32 -> Base58 chain guarding FTP creds" }
    ]
  }
];

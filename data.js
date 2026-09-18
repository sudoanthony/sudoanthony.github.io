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
    title:      "OWASP Web Top 10: 2025",
    subtitle:   "Juice Shop Web App Pentest",
    url:        "writeup-juiceshop.html",
    platform:   "Web",
    team:       "red",
    difficulty: "Practice",
    os:         "Linux",
    category:   "Web",
    icon:       "images/icons/juice.png",
    date:       "2026-09-18",
    summary:    "OWASP Juice Shop (Angular + Node/Express) worked against the OWASP Top 10: 2025. Basket IDOR (A01), SQLi auth bypass and DOM XSS (A05), and verbose error handling (A10) - each with Burp replication, root-cause breakdown, and a severity-rated finding.",
    tags:       ["broken-access-control", "sql-injection", "dom-xss", "improper-error-handling"]
  },
  {
    title:      "Nexus",
    url:        "writeup-nexus.html",
    platform:   "HackTheBox",
    team:       "red",
    difficulty: "Easy",
    os:         "Linux",
    category:   "Web",
    icon:       "images/icons/nexus.png",
    date:       "2026-09-14",
    summary:    "Krayin CRM file-upload RCE gets a foothold; DB password reuse pivots to jones; internal Gitea running CVE-2026-60004 gives a shell as git; a root systemd timer exploited via symlink attack writes an SSH key into /root/.ssh for root access.",
    tags:       ["file-upload-rce", "exposed-credentials", "gitea-hook-rce", "symlink-write", "priv-esc"]
  },
  {
    title:      "OWASP Mobile Top 10 2024",
    subtitle:   "Android App Pentest",
    url:        "writeup-allsafe.html",
    platform:   "Mobile",
    team:       "red",
    difficulty: "Practice",
    os:         "Windows PowerShell",
    category:   "Android",
    icon:       "images/icons/allsafe.png",
    date:       "2026-07-31",
    summary:    "Featuring AllSafe, with help from InsecureBankv2 and AndroGoat. A mobile penetration testing methodology that works all three Android targets to demonstrate each risk of the OWASP Mobile Top 10 (2024) - worked examples with screenshots, plus a severity-rated report for every vulnerability found.",
    tags:       ["hardcoded-secret", "insecure-logging", "exported-component", "insecure-storage", "broken-crypto", "auth-bypass", "credential-usage", "sql-injection", "insecure-deserialization", "binary-protections"]
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
    id:    "broken-access-control",
    name:  "Broken access control (IDOR)",
    cat:   "web",
    sev:   "high",
    ext:   "CWE-639 · CWE-284 · OWASP A01:2025",
    blurb: "The server acts on a client-supplied object reference (an ID in the URL, body, or storage) without checking the requester is authorized for it. Swap the ID and you read or change another user's data. SSRF folds into this category as of the 2025 Top 10. Fix is server-side authorization on every object access, keyed to the session, not the supplied ID.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Web Top 10: 2025", url: "writeup-juiceshop.html", ctx: "/rest/basket/{id} returns any basket by ID with no ownership check - View Basket solved via the bid in session storage and replicated in Burp Repeater" }
    ]
  },
  {
    id:    "dom-xss",
    name:  "DOM-based cross-site scripting",
    cat:   "web",
    sev:   "high",
    ext:   "CWE-79 · OWASP A05:2025",
    blurb: "Front-end JavaScript reads attacker-controlled input (URL param, search box) and writes it into the DOM without escaping - the payload never touches the server. In Angular it means calling bypassSecurityTrustHtml on untrusted input, switching off the framework's default auto-escaping. Fix is to never bypass the sanitizer and let the framework encode output.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Web Top 10: 2025", url: "writeup-juiceshop.html", ctx: "search reads the q URL param (source) and passes it to sanitizer.bypassSecurityTrustHtml (sink); an iframe javascript: URI fires since <script> won't run via innerHTML" }
    ]
  },
  {
    id:    "improper-error-handling",
    name:  "Mishandling of exceptional conditions",
    cat:   "web",
    sev:   "low",
    ext:   "CWE-209 · CWE-755 · OWASP A10:2025",
    blurb: "The app fails to catch and normalize errors, returning raw exception objects, stack traces, or SQL messages to the client - free reconnaissance (file paths, frameworks, DB engine, internal structure). A new dedicated category in the 2025 Top 10; verbose errors previously lived under Security Misconfiguration. Fix is catch-all handling that logs details internally and returns a generic message.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Web Top 10: 2025", url: "writeup-juiceshop.html", ctx: "a single quote in the Juice Shop login email returns an unhandled [object Object] error instead of a graceful message" }
    ]
  },
  {
    id:    "hardcoded-secret",
    name:  "Hardcoded secret in app resources",
    cat:   "mobile",
    sev:   "low",
    ext:   "CWE-798 · MASVS-STORAGE · M8",
    blurb: "A secret compiled into the APK (strings.xml / resources / smali) - recoverable by anyone with the binary. Severity depends on what the secret authorizes; a challenge-gate key is Low, a live API key is not.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "UUID in strings.xml gates a deep link - found via the R.string.key reference, not a keyword grep" }
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
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "full deep-link Uri (with query string) concatenated into a Log.d call" }
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
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "exported activity + BROWSABLE deep link invokable from an arbitrary web page" }
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
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "credentials written to shared_prefs/user.xml in plaintext - no encryption, no Keystore; sandbox swept and /sdcard empty" }
    ]
  },
  {
    id:    "broken-crypto",
    name:  "Weak / improperly implemented cryptography",
    cat:   "crypto",
    sev:   "med",
    ext:   "CWE-327 · CWE-916 · MASVS-CRYPTO · M10",
    blurb: "Crypto that looks encrypted but isn't sound: fast unsalted hashes for secrets (MD5/SHA-1), hardcoded keys, ECB mode, static IVs, home-rolled schemes. If the key sits next to the ciphertext it's obfuscation, not encryption - read the code, take the key, decrypt offline. Severity tracks what the recovered plaintext authorizes.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "AndroGoat hashes the access-control PIN with unsalted MD5 into shared_prefs - recovered offline via a rainbow table / brute force" }
    ]
  },
  {
    id:    "auth-bypass",
    name:  "Client-side authentication bypass",
    cat:   "auth",
    sev:   "med",
    ext:   "CWE-287 · MASVS-AUTH · M3",
    blurb: "A login / PIN / biometric gate enforced on the device and trusted by the app itself. On a device the attacker controls it's just code - hook the deciding method (or reroute the failure callback into success) and the protected screen opens with no valid credential. Real only when the gate is cosmetic; a Keystore-bound gate that releases a key on success defeats it.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "AndroGoat's biometric gate is cosmetic (no CryptoObject) - Frida reroutes onAuthenticationFailed/Error into onAuthenticationSucceeded, no fingerprint needed" }
    ]
  },
  {
    id:    "credential-usage",
    name:  "Improper credential usage",
    cat:   "auth",
    sev:   "med",
    ext:   "CWE-522 · CWE-798 · MASVS-AUTH · M1",
    blurb: "Credentials mishandled anywhere in their lifecycle: cached to disk recoverably, hardcoded into the binary, sent in cleartext, or never rotated. Base64 and hardcoded-key ciphers are not protection. Severity tracks what the credential authorizes - a live cloud key is critical, a lab value is not.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "InsecureBankv2 caches creds in shared_prefs (Base64 username + hardcoded-key AES password); AndroGoat ships a hardcoded AWS secret access key" }
    ]
  },
  {
    id:    "sql-injection",
    name:  "SQL injection",
    cat:   "web",
    sev:   "high",
    ext:   "CWE-89 · MASVS-CODE · M4",
    blurb: "Attacker input concatenated into a SQL query and run as code instead of data. Tautologies bypass filters and logins; UNION plus the metadata table (sqlite_master / information_schema) reads arbitrary tables. On mobile the sink is a local SQLite DB or an exported content provider. Fix is parameterized queries; severity tracks reach - a local search box is lower than a cross-app exported provider.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "AllSafe login rawQuery bypassed with a tautology and full user dump; InsecureBankv2's exported provider read via UNION on sqlite_master" },
      { writeup: "OWASP Web Top 10: 2025", url: "writeup-juiceshop.html", ctx: "Juice Shop login bypassed with ' OR 1=1-- to authenticate as admin, and targeted specific users with email'-- ; input concatenated into the query instead of parameterized" }
    ]
  },
  {
    id:    "insecure-deserialization",
    name:  "Insecure deserialization",
    cat:   "web",
    sev:   "med",
    ext:   "CWE-502 · MASVS-CODE · M4",
    blurb: "The app rebuilds an object from bytes an attacker can modify, then trusts the result. Tampering a stored or transmitted serialized object (like flipping a role field) bypasses checks; on some platforms crafted objects reach code execution via gadget chains. Fix is to not deserialize untrusted data, sign or validate it, and enforce authorization server-side.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "AllSafe serializes a User object to external storage; editing the role field to ROLE_EDITOR escalates privilege on load" }
    ]
  },
  {
    id:    "binary-protections",
    name:  "Insufficient binary protections",
    cat:   "mobile",
    sev:   "low",
    ext:   "CWE-693 · MASVS-RESILIENCE · M7",
    blurb: "Client-side self-defense - root/jailbreak detection, anti-debug, anti-Frida, integrity checks, obfuscation - defeated on a device the attacker controls by hooking (Frida) or by patching and re-signing the app. Defense-in-depth only: absent or weak protections are Low/Informational on their own, rising only when they gate a real bug.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Mobile Top 10 2024", url: "writeup-allsafe.html", ctx: "AllSafe: RootBeer root check hooked with Frida, Smali Patch repackaged and re-signed (no integrity check), native password recovered in Ghidra, and FLAG_SECURE stripped to defeat anti-screenshot" }
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
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "operator re-auths to root with a reused password" },
      { writeup: "Nexus", url: "writeup-nexus.html", ctx: "symlink planted in user-writable staging dir; root systemd timer follows it and writes SSH key into /root/.ssh/authorized_keys" }
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
      { writeup: "Biohazard", url: "writeup-biohazard.html", ctx: "creds hidden behind an encoding chain, then key files on FTP" },
      { writeup: "Nexus", url: "writeup-nexus.html", ctx: "DB password in git commit history reused for SSH and Gitea login; live .env password reused by jones for system login" }
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
    id:    "file-upload-rce",
    name:  "Authenticated file-upload RCE",
    cat:   "web",
    sev:   "high",
    ext:   "CWE-434",
    blurb: "An upload handler that validates only the stated MIME type allows a PHP webshell labeled image/jpeg to slip through. The file is stored in a web-accessible, PHP-executable directory - visit the URL and the server runs the command. Severity is often high because it gives server-side code execution; authenticated-only lowers the bar only if the credential bar is also low.",
    deepdive: "",
    uses: [
      { writeup: "Nexus", url: "writeup-nexus.html", ctx: "Krayin CRM TinyMCE upload endpoint (CVE-2026-38526) - PHP shell uploaded as image/jpeg, executed by visiting the stored file path" }
    ]
  },
  {
    id:    "gitea-hook-rce",
    name:  "Gitea diffpatch git-hook RCE",
    cat:   "web",
    sev:   "crit",
    ext:   "CWE-77 · CVE-2026-60004",
    blurb: "CVE-2026-60004 (GHSA-rcr6-4jqh-j84m) affects Gitea 1.17–1.27.0. A user with repository write access can smuggle attacker-controlled content into a server-side git hook via the diffpatch endpoint. The hook fires on the next receive/commit event and executes as the Gitea OS service account. Fixed in 1.27.1.",
    deepdive: "",
    uses: [
      { writeup: "Nexus", url: "writeup-nexus.html", ctx: "Internal Gitea 1.26.0 - hook injected via diffpatch API as jones, hook fires and returns a shell as the git OS user" }
    ]
  },
  {
    id:    "symlink-write",
    name:  "Symlink attack on privileged file write",
    cat:   "priv-esc",
    sev:   "high",
    ext:   "CWE-61 · CWE-59",
    blurb: "A privileged process writes files to a path inside a directory the attacker controls. By pre-placing a symlink at the expected path, the process follows the link and writes into a root-only location instead. Classic pattern: world-writable /tmp or user-owned home dir with a root-run script that doesn't check for symlinks (O_NOFOLLOW). Combine with any predictable root-written filename (authorized_keys, cron entries) for full escalation.",
    deepdive: "",
    uses: [
      { writeup: "Nexus", url: "writeup-nexus.html", ctx: "Root systemd timer runs template-sync.py writing into /home/git/template-staging (git-owned). Symlink /home/git/template-staging/jones/test -> /root/.ssh causes root to write authorized_keys there." }
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

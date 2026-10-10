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
    title:      "Baby",
    url:        "writeup-baby.html",
    platform:   "HackTheBox",
    team:       "red",
    difficulty: "Easy",
    os:         "Windows",
    category:   "AD",
    icon:       "images/icons/baby.png",
    date:       "2026-10-10",
    summary:    "Windows Active Directory box: anonymous LDAP leaks an initial password in a user's description field; a forced password change gives a WinRM foothold; SeBackupPrivilege (Backup Operators) is abused via a Volume Shadow Copy to extract NTDS.dit, then secretsdump and Pass-the-Hash land Administrator.",
    tags:       ["ldap-anon-enum", "exposed-credentials", "password-must-change", "sebackupprivilege", "pass-the-hash", "priv-esc"]
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
    date:       "2026-09-20",
    summary:    "Unauthenticated Samba print command injection (CVE-2026-4480) to a foothold as nobody, then rclone credential reuse to scott, wide-link + force-user abuse to pivot to marcus, and a group-writable systemd drop-in plus a loose polkit rule to root.",
    tags:       ["command-injection", "exposed-credentials", "priv-esc"]
  },
  {
    title:      "OWASP Top 10:2025",
    subtitle:   "Juice Shop Web App Pentest",
    url:        "writeup-juiceshop.html",
    platform:   "Web",
    team:       "red",
    difficulty: "Practice",
    os:         "Linux",
    category:   "Web",
    icon:       "images/icons/juice.png",
    date:       "2026-09-18",
    summary:    "OWASP Juice Shop (Angular + Node/Express) worked end-to-end against the complete OWASP Top 10:2025 - all ten categories, from basket IDOR and SQLi/DOM XSS to an alg:none JWT forgery and exposed access logs. Each exploited by hand through Burp, root-caused, and written up as a severity-rated finding.",
    tags:       ["broken-access-control", "security-misconfiguration", "vulnerable-components", "sensitive-data-exposure", "sql-injection", "dom-xss", "insecure-design", "auth-failures", "broken-jwt", "improper-error-handling"]
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
    summary:    "Featuring AllSafe, with help from InsecureBankv2 and AndroGoat. A mobile penetration testing methodology that works all three Android targets to demonstrate each risk of the OWASP Mobile Top 10 2024 - worked examples with screenshots, plus a severity-rated report for every vulnerability found.",
    tags:       ["hardcoded-secret", "insecure-logging", "exported-component", "insecure-storage", "broken-crypto", "auth-bypass", "credential-usage", "sql-injection", "insecure-deserialization", "binary-protections"]
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
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "/rest/basket/{id} returns any basket by ID with no ownership check - View Basket solved via the bid in session storage and replicated in Burp Repeater" }
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
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "search reads the q URL param (source) and passes it to sanitizer.bypassSecurityTrustHtml (sink); an iframe javascript: URI fires since <script> won't run via innerHTML" }
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
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "a single quote in the Juice Shop login email returns an unhandled [object Object] error instead of a graceful message" }
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
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "Juice Shop login bypassed with ' OR 1=1-- to authenticate as admin, and targeted specific users with email'-- ; input concatenated into the query instead of parameterized" }
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
    blurb: "Turning a foothold user into root, Administrator, or SYSTEM through a local misconfiguration or over-privileged right.",
    deepdive: "",
    uses: [
      { writeup: "Baby", url: "writeup-baby.html", ctx: "SeBackupPrivilege (Backup Operators) used to shadow-copy and read NTDS.dit, then Pass-the-Hash as Administrator" },
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
    blurb: "Credentials recoverable by a low-priv user and reused across accounts - obfuscated configs, key files, shared passwords, directory attributes.",
    deepdive: "",
    uses: [
      { writeup: "Baby", url: "writeup-baby.html", ctx: "anonymous LDAP read exposes an initial password stored in a user's AD description field" },
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
  },
  {
    id:    "security-misconfiguration",
    name:  "Security misconfiguration",
    cat:   "web",
    sev:   "med",
    ext:   "CWE-16 · OWASP A02:2025",
    blurb: "Insecure defaults, unnecessary features, or deprecated interfaces left enabled - each one is extra attack surface the app never needed to expose. Fix is to harden defaults, disable unused features fully (not just hide them from the UI), and enforce allow-lists server-side.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "a deprecated XML B2B upload interface, pulled from the UI but still live on the backend - the File Complaint form accepts an .xml file and processes it" }
    ]
  },
  {
    id:    "vulnerable-components",
    name:  "Components with known vulnerabilities",
    cat:   "web",
    sev:   "high",
    ext:   "CWE-1035 · CWE-937 · OWASP A03:2025",
    blurb: "Shipping a third-party dependency at a version with a public CVE - the flaw isn't in your code, it's in something you installed and never updated. Fix is automated dependency scanning (npm audit, Dependabot, retire.js) in CI and a patching cadence.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "sanitize-html 1.4.2 - a direct dependency frozen several major versions behind; triaged 19 npm-audit highs down with npm outdated to the biggest version gaps" }
    ]
  },
  {
    id:    "sensitive-data-exposure",
    name:  "Sensitive data exposure",
    cat:   "crypto",
    sev:   "med",
    ext:   "CWE-538 · CWE-200 · OWASP A04:2025",
    blurb: "Sensitive files or data reachable without access control - served straight off a browsable directory rather than gated behind an authenticated, authorization-checked route. Severity tracks what the data actually is: placeholder content is Medium, real material non-public info is High.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "a confidential acquisitions.md served from the browsable /ftp directory to any unauthenticated user" }
    ]
  },
  {
    id:    "insecure-design",
    name:  "Insecure design (client-trusted validation)",
    cat:   "web",
    sev:   "low",
    ext:   "CWE-602 · CWE-20 · OWASP A06:2025",
    blurb: "A security control placed where the attacker sits - validation enforced only in the browser, so intercepting the request past the client checks bypasses it. The design flaw is trusting the client; the fix is to enforce every check server-side.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "registration accepts an empty email/password (and a mismatched passwordRepeat) once the client-side form checks are bypassed in Burp" }
    ]
  },
  {
    id:    "auth-failures",
    name:  "Authentication failures",
    cat:   "auth",
    sev:   "high",
    ext:   "CWE-521 · CWE-640 · OWASP A07:2025",
    blurb: "Weak login, credential, or recovery handling: guessable passwords with no lockout, or a password reset gated behind an OSINT-able security question. Fix is a strong password policy, rate-limiting/lockout, MFA, and reset tokens over a verified channel instead of knowledge questions.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "admin's weak password brute-forced with ffuf (no lockout); Jim's password reset via a security question answered from OSINT (a Star Trek reference in his reviews)" }
    ]
  },
  {
    id:    "broken-jwt",
    name:  "JWT signature not verified (alg:none)",
    cat:   "auth",
    sev:   "crit",
    ext:   "CWE-347 · OWASP A08:2025",
    blurb: "The server trusts the client-supplied alg header. Setting it to none tells the server the token is unsigned, so it skips signature verification and accepts any payload - full identity forgery. Fix is to pin the expected algorithm server-side and reject anything else; never honor alg:none.",
    deepdive: "",
    uses: [
      { writeup: "OWASP Top 10:2025", url: "writeup-juiceshop.html", ctx: "forged an alg:none JWT with an empty signature, base64url-encoded by hand, impersonating the non-existent user jwtn3d@juice-sh.op" }
    ]
  },
  {
    id:    "ldap-anon-enum",
    name:  "Anonymous LDAP enumeration",
    cat:   "auth",
    sev:   "med",
    ext:   "CWE-200",
    blurb: "A domain controller that allows unauthenticated (anonymous) LDAP binds lets anyone on the network dump the directory - users, groups, and attribute values. World-readable fields like description routinely leak secrets. Fix: disable anonymous binds and audit attributes for sensitive data.",
    deepdive: "",
    uses: [
      { writeup: "Baby", url: "writeup-baby.html", ctx: "anonymous ldapsearch against baby.vl dumps all users; Teresa Bell's description field holds an initial password" }
    ]
  },
  {
    id:    "password-must-change",
    name:  "Known password + forced-change bypass",
    cat:   "auth",
    sev:   "med",
    ext:   "CWE-620",
    blurb: "An account flagged 'user must change password at next logon' returns STATUS_PASSWORD_MUST_CHANGE, which confirms the supplied password is correct. The flag blocks login but not a network password change (SMB/kpasswd), so an attacker who knows the current password can set a new one and authenticate. Fix: use unique, random initial passwords with short expiry.",
    deepdive: "",
    uses: [
      { writeup: "Baby", url: "writeup-baby.html", ctx: "Caroline.Robinson returns PASSWORD_MUST_CHANGE with the leaked password; smbpasswd -r sets a new one for a WinRM foothold" }
    ]
  },
  {
    id:    "sebackupprivilege",
    name:  "SeBackupPrivilege / Backup Operators to DC compromise",
    cat:   "priv-esc",
    sev:   "crit",
    ext:   "CWE-250 · CWE-269",
    blurb: "SeBackupPrivilege grants read access to any file regardless of ACL. On a domain controller that includes NTDS.dit (every domain hash) and the SYSTEM hive (its boot key). A Volume Shadow Copy unlocks the live database, robocopy /b reads it in backup mode, and secretsdump recovers the hashes offline. Backup Operators effectively equals Domain Admin. Fix: keep standard users out of Backup Operators and restrict backup rights to dedicated, monitored accounts.",
    deepdive: "",
    uses: [
      { writeup: "Baby", url: "writeup-baby.html", ctx: "Backup Operators member creates a shadow copy with diskshadow and copies NTDS.dit + SYSTEM out in backup mode, then secretsdump" }
    ]
  },
  {
    id:    "pass-the-hash",
    name:  "Pass-the-Hash (NTLM)",
    cat:   "auth",
    sev:   "crit",
    ext:   "CWE-294 · CWE-522",
    blurb: "NTLM authentication proves knowledge of a password via its NT hash and never needs the plaintext, so an attacker holding a recovered NT hash can authenticate as that user directly, no cracking required. Fix: protect hash material (LSASS, NTDS.dit), limit privileged logons, and prefer Kerberos with modern protections.",
    deepdive: "",
    uses: [
      { writeup: "Baby", url: "writeup-baby.html", ctx: "Administrator NT hash from NTDS.dit used with evil-winrm -H for an Administrator shell, no password" }
    ]
  }
];

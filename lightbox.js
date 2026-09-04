/* ================================================================
   lightbox.js  -  click any figure image to view it near full-screen
   ----------------------------------------------------------------
   Drop <script src="lightbox.js"></script> before </body> on any page
   with images. Every image inside <main> or a concept page becomes
   clickable: click to enlarge on a dark backdrop, click again or press
   Esc to close. No configuration, no dependencies.
   ================================================================ */
(function () {
  function build() {
    var imgs = document.querySelectorAll('main img, .concept-content img');
    if (!imgs.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    var big = document.createElement('img');
    big.alt = '';
    overlay.appendChild(big);
    document.body.appendChild(overlay);

    function open(src, alt) {
      big.src = src;
      big.alt = alt || '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      big.src = '';
    }

    imgs.forEach(function (im) {
      // Skip images that are inside a link (e.g. writeup grid icon-cards):
      // let the click follow the link instead of opening the lightbox.
      if (im.closest('a')) return;
      im.classList.add('zoomable');
      im.addEventListener('click', function () {
        open(im.currentSrc || im.src, im.alt);
      });
    });

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

/* ================================================================
   Syntax highlighting - colorize every <pre><code> block.
   Loads highlight.js from cdnjs and applies it site-wide. The color
   theme lives in style.css (the .hljs-* rules), tuned to match the
   site palette. Shell-looking blocks are hinted as bash so commands
   colorize cleanly instead of being mis-detected.
   ================================================================ */
(function () {
  function run() {
    if (!window.hljs) return;
    var shell = /^(adb|frida|sqlite3|python|pm |content query|am |jadx|apktool|keytool|openssl|nmap|curl|wget|sudo|cd |ls |cat |rm |grep|findstr|\$ |# |emulator|Get-|\[IO|\[System)/;
    document.querySelectorAll('pre code').forEach(function (c) {
      if (c.className && /language-|nohighlight|hljs/.test(c.className)) return;
      var first = (c.textContent || '').trim().split('\n')[0];
      if (shell.test(first)) c.classList.add('language-bash');
    });
    try { hljs.highlightAll(); } catch (e) {}
  }
  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
  s.onload = run;
  document.head.appendChild(s);
})();

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

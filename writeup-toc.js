/* ================================================================
   writeup-toc.js  -  auto-built left table of contents for writeups
   ----------------------------------------------------------------
   Drop <script src="writeup-toc.js"></script> before </body> on any
   writeup page. It reads every <h2> inside <main>, builds a sticky
   left-gutter nav, highlights the section you're currently reading as
   you scroll, and smooth-scrolls when a link is clicked.

   Nothing to configure. Add or remove <h2> sections and the TOC
   follows automatically. Styling lives in style.css (.wtoc).
   ================================================================ */
(function () {
  function slugify(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")   // drop punctuation
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section";
  }

  // Text of an <h2>, minus the little "01" .num span the writeups use.
  function headingText(h) {
    var clone = h.cloneNode(true);
    clone.querySelectorAll(".num").forEach(function (n) { n.remove(); });
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  function build() {
    var main = document.querySelector("main");
    if (!main) return;

    var heads = Array.prototype.slice.call(main.querySelectorAll("h2"));
    if (heads.length < 2) return;   // not worth a TOC

    var used = {};
    var links = [];

    heads.forEach(function (h) {
      var text = headingText(h);
      if (!h.id) {
        var base = slugify(text), id = base, i = 2;
        while (used[id] || document.getElementById(id)) { id = base + "-" + i++; }
        h.id = id;
      }
      used[h.id] = true;

      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = text;
      a.dataset.target = h.id;
      links.push(a);
    });

    var aside = document.createElement("aside");
    aside.className = "wtoc";
    var label = document.createElement("div");
    label.className = "wtoc-label";
    label.textContent = "On this page";
    var nav = document.createElement("nav");
    links.forEach(function (a) { nav.appendChild(a); });
    aside.appendChild(label);
    aside.appendChild(nav);
    document.body.appendChild(aside);

    // ---- scroll-spy: highlight the heading nearest the top of the viewport
    var ticking = false;
    function sync() {
      ticking = false;
      var offset = 100;               // account for the sticky nav
      var current = heads[0].id;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top <= offset) current = heads[i].id;
        else break;
      }
      // near the bottom of the page, force-select the last section
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = heads[heads.length - 1].id;
      }
      links.forEach(function (a) {
        a.classList.toggle("active", a.dataset.target === current);
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(sync); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();

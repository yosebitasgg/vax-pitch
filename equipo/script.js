(function () {
  "use strict";

  const sections = Array.from(document.querySelectorAll("section.block"));
  const allDetails = Array.from(document.querySelectorAll("section.block > details"));

  function goToSection(idx) {
    const target = sections[idx];
    if (!target) return;
    const det = target.querySelector("details");
    if (det && !det.open) det.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function expandAll() {
    document.querySelectorAll("details").forEach((d) => (d.open = true));
  }

  function collapseAll() {
    document.querySelectorAll("details").forEach((d) => (d.open = false));
  }

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    const key = e.key;

    if (/^[1-8]$/.test(key)) {
      e.preventDefault();
      goToSection(parseInt(key, 10) - 1);
      return;
    }
    if (key === "e" || key === "E") {
      e.preventDefault();
      expandAll();
      return;
    }
    if (key === "c" || key === "C") {
      e.preventDefault();
      collapseAll();
      return;
    }
  });

  // Smooth-scroll for nav anchors (avoid the default jump)
  document.querySelectorAll(".nav a").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const idx = parseInt(href.slice(2), 10) - 1;
      if (!Number.isNaN(idx)) {
        goToSection(idx);
        history.pushState(null, "", href);
      }
    });
  });

  // Open the section from the hash on load
  if (location.hash) {
    const m = location.hash.match(/^#s(\d)$/);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      setTimeout(() => goToSection(idx), 80);
    }
  }
})();

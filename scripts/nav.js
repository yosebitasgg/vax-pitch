(function () {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressEl = document.getElementById("progress");
  let current = 0;
  let isTransitioning = false;

  function renderProgress() {
    if (!progressEl) return;
    progressEl.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === current ? " is-active" : "");
      dot.setAttribute("aria-label", `Ir al capítulo ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      progressEl.appendChild(dot);
    });
  }

  function updateProgress() {
    if (!progressEl) return;
    progressEl.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === current);
    });
  }

  function go(index) {
    if (isTransitioning) return;
    if (index < 0 || index >= slides.length) return;
    if (index === current) return;

    isTransitioning = true;
    const prev = slides[current];
    const next = slides[index];

    prev.classList.remove("is-active");
    prev.classList.add("is-leaving");

    window.VAX.timeline.resetSlide(next.id);

    setTimeout(() => { prev.classList.remove("is-leaving"); }, 800);
    setTimeout(() => {
      next.classList.add("is-active");
      window.VAX.timeline.play(next.id);
      current = index;
      updateProgress();
      isTransitioning = false;
    }, 220);
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case " ":
      case "PageDown":
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home":
        e.preventDefault(); go(0); break;
      case "End":
        e.preventDefault(); go(slides.length - 1); break;
      case "f":
      case "F":
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
        break;
    }
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest(".progress, .dot, button, a, kbd, .hint")) return;
    if (e.clientX > window.innerWidth * 0.5) next();
    else prev();
  });

  window.VAX = window.VAX || {};
  window.VAX.nav = { go, next, prev, current: () => current, total: () => slides.length };

  renderProgress();
})();

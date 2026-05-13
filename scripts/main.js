(function () {
  "use strict";

  // ============ 16:9 SCALING ============
  // Canvas is fixed at 1920x1080. Scale uniformly to fit viewport.

  const CANVAS_W = 1920;
  const CANVAS_H = 1080;

  function fit() {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / CANVAS_W, vh / CANVAS_H);
    const scaledW = CANVAS_W * scale;
    const scaledH = CANVAS_H * scale;
    const offsetX = (vw - scaledW) / 2;
    const offsetY = (vh - scaledH) / 2;
    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  // Debounced resize
  let resizeFrame = null;
  function onResize() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(fit);
  }

  // ============ BAND POINTS (scatter near band-mid) ============
  function renderBandPoints() {
    const layer = document.getElementById("band-pts");
    if (!layer) return;
    layer.innerHTML = "";
    const rng = mulberry32(42);
    const NS = "http://www.w3.org/2000/svg";
    for (let x = 6; x <= 196; x += 7) {
      const baseY = 30 - 4 * (x / 196);
      const y = baseY + (rng() - 0.5) * 8;
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", x.toFixed(2));
      dot.setAttribute("cy", y.toFixed(2));
      dot.setAttribute("r", "0.9");
      dot.setAttribute("fill", "#1A0D35");
      dot.setAttribute("opacity", (0.4 + rng() * 0.3).toFixed(2));
      layer.appendChild(dot);
    }
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ============ INIT ============
  function init() {
    fit();
    window.addEventListener("resize", onResize, { passive: true });

    // Pre-split typewriter text
    if (window.VAX && window.VAX.typewriter) window.VAX.typewriter.preSplit();

    // Generate band points
    renderBandPoints();

    // Reset all slides
    document.querySelectorAll(".slide").forEach((slide) => {
      if (!slide.classList.contains("is-active")) {
        window.VAX.timeline.resetSlide(slide.id);
      }
    });

    // Play first slide after a tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.VAX.timeline.play("s1"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

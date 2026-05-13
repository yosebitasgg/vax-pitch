(function () {
  "use strict";

  function format(v, decimals) {
    const n = Number(v);
    if (Number.isNaN(n)) return "0";
    if (decimals > 0) return n.toFixed(decimals);
    return Math.round(n).toLocaleString("es-MX");
  }

  function animate(el) {
    if (!el || el.dataset.animated === "true") return null;
    const from = parseFloat(el.dataset.from || "0");
    const to = parseFloat(el.dataset.to || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = parseFloat(el.dataset.duration || "1.2");
    const obj = { v: from };
    el.dataset.animated = "true";
    el.textContent = format(from, decimals);
    return window.gsap.to(obj, {
      v: to,
      duration: duration,
      ease: "power3.out",
      onUpdate: () => { el.textContent = format(obj.v, decimals); },
      onComplete: () => { el.textContent = format(to, decimals); }
    });
  }

  function reset(el) {
    if (!el) return;
    const from = parseFloat(el.dataset.from || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    el.textContent = format(from, decimals);
    el.dataset.animated = "false";
  }

  window.VAX = window.VAX || {};
  window.VAX.counters = { animate, reset };
})();

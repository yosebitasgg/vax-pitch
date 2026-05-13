(function () {
  "use strict";

  function parseText(raw) {
    const tokens = [];
    const re = /\|em\|(.*?)\|\/em\|/g;
    let last = 0;
    let m;
    while ((m = re.exec(raw))) {
      if (m.index > last) tokens.push({ text: raw.slice(last, m.index), italic: false });
      tokens.push({ text: m[1], italic: true });
      last = re.lastIndex;
    }
    if (last < raw.length) tokens.push({ text: raw.slice(last), italic: false });
    return tokens;
  }

  function makeWord(text, italic) {
    const word = document.createElement("span");
    word.className = "word";
    word.style.whiteSpace = "nowrap";
    word.style.display = "inline-block";
    if (italic) {
      word.style.fontStyle = "italic";
      word.style.color = "var(--purple)";
    }
    const chars = [];
    [...text].forEach((c) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = c;
      word.appendChild(span);
      chars.push(span);
    });
    return { node: word, chars };
  }

  function split(el) {
    if (!el || el.dataset.tw === "ready") return [];
    const raw = el.dataset.twText || el.textContent;
    el.textContent = "";
    const tokens = parseText(raw);
    const chars = [];

    tokens.forEach((t) => {
      // Split tokens by whitespace; keep words bound (nowrap) so they don't break mid-word.
      const parts = t.text.split(/(\s+)/);
      parts.forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) {
          const sp = document.createElement("span");
          sp.className = "char space";
          sp.textContent = p;
          el.appendChild(sp);
          chars.push(sp);
        } else {
          const w = makeWord(p, t.italic);
          el.appendChild(w.node);
          chars.push(...w.chars);
        }
      });
    });

    el.dataset.tw = "ready";
    return chars;
  }

  function reveal(el, opts) {
    if (!el) return null;
    const chars = el.dataset.tw === "ready"
      ? Array.from(el.querySelectorAll(".char"))
      : split(el);
    const stagger = (opts && opts.stagger) || 0.028;
    const duration = (opts && opts.duration) || 0.18;
    const delay = (opts && opts.delay) || 0;
    return window.gsap.to(chars, {
      opacity: 1, y: 0, duration, stagger, delay, ease: "power2.out"
    });
  }

  function resetAll() {
    document.querySelectorAll("[data-tw]").forEach((el) => {
      window.gsap.set(el.querySelectorAll(".char"), { opacity: 0, y: "0.08em" });
    });
  }

  function preSplit() {
    document.querySelectorAll(".tw[data-tw-text]").forEach(split);
  }

  window.VAX = window.VAX || {};
  window.VAX.typewriter = { split, reveal, resetAll, preSplit };
})();

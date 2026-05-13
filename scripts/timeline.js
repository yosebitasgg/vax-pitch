(function () {
  "use strict";

  const gsap = window.gsap;
  const ease = "power3.out";

  function $all(root, sel) { return Array.from(root.querySelectorAll(sel)); }
  function setIfAny(targets, props) { if (targets && targets.length) gsap.set(targets, props); }

  function setupDrawLine(elements) {
    if (!elements || !elements.length) return;
    elements.forEach((el) => {
      let len = 0;
      try {
        if (el.getTotalLength) len = el.getTotalLength();
        else if (el.tagName === "circle") {
          const r = parseFloat(el.getAttribute("r") || 0);
          len = 2 * Math.PI * r;
        } else if (el.tagName === "rect") {
          const w = parseFloat(el.getAttribute("width") || 0);
          const h = parseFloat(el.getAttribute("height") || 0);
          len = 2 * (w + h);
        }
      } catch (e) { len = 200; }
      if (!len || len < 1) len = 200;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.setAttribute("data-len", len);
    });
  }

  function drawLines(elements, opts) {
    if (!elements || !elements.length) return null;
    const duration = (opts && opts.duration) || 1.2;
    const stagger = (opts && opts.stagger) || 0.06;
    return gsap.to(elements, {
      strokeDashoffset: 0,
      duration,
      stagger,
      ease: "power2.inOut"
    });
  }

  // ============ SLIDE BUILDERS ============

  function buildCover(slide) {
    const tl = gsap.timeline({ defaults: { ease } });
    const fades = $all(slide, ".r-fade");
    const rises = $all(slide, ".r-rise, .r-rise-soft");
    const ink = $all(slide, ".r-ink");

    setupDrawLine($all(slide, ".cover-routes path"));

    tl.to(fades, { opacity: 1, duration: 0.6, stagger: 0.1 }, 0);
    tl.to(rises, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.1);
    tl.to(ink, { opacity: 1, y: 0, filter: "blur(0)", duration: 0.7, stagger: 0.08 }, 0.1);

    // Typewriter on title
    const title = slide.querySelector(".title.tw");
    if (title) tl.add(() => window.VAX.typewriter.reveal(title, { stagger: 0.038, duration: 0.16 }), 0.6);

    // Draw routes
    const routes = $all(slide, ".cover-routes path");
    if (routes.length) {
      tl.to(routes, {
        strokeDashoffset: 0,
        duration: 1.6,
        stagger: 0.18,
        ease: "power2.inOut"
      }, 1.4);
    }

    // Delayed hand annotations
    slide.querySelectorAll("[data-delay]").forEach((el) => {
      const d = parseFloat(el.dataset.delay);
      tl.to(el, { opacity: 1, duration: 0.5 }, d);
    });

    return tl;
  }

  function buildPain(slide) {
    const tl = gsap.timeline({ defaults: { ease } });

    tl.to($all(slide, ".r-fade"), { opacity: 1, duration: 0.6, stagger: 0.08 }, 0);
    tl.to($all(slide, ".r-rise"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.1);
    tl.to($all(slide, ".r-rise-soft"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.2);
    tl.to($all(slide, ".r-ink"), { opacity: 1, y: 0, filter: "blur(0)", duration: 0.7, stagger: 0.2 }, 0.4);

    $all(slide, ".count-up").forEach((el, i) => {
      tl.add(() => window.VAX.counters.animate(el), 0.5 + i * 0.25);
    });

    // Underline draw
    const ul = slide.querySelector(".underline-stroke");
    if (ul) {
      setupDrawLine([ul]);
      tl.to(ul, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, 1.6);
    }

    slide.querySelectorAll("[data-delay]").forEach((el) => {
      const d = parseFloat(el.dataset.delay);
      tl.to(el, { opacity: 1, duration: 0.6 }, d);
    });

    return tl;
  }

  function buildInsight(slide) {
    const tl = gsap.timeline({ defaults: { ease } });

    tl.to($all(slide, ".r-fade"), { opacity: 1, duration: 0.6, stagger: 0.06 }, 0);
    tl.to($all(slide, ".r-rise"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.1);
    tl.to($all(slide, ".r-rise-soft"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.3);

    // Map base outline draws first
    const baseStrokes = $all(slide, ".map-base path");
    setupDrawLine(baseStrokes);
    tl.to(baseStrokes, { strokeDashoffset: 0, duration: 2.0, ease: "power2.inOut", stagger: 0.15 }, 0.5);

    // Then routes draw on top
    const routes = $all(slide, "#routes-svg path");
    setupDrawLine(routes);
    tl.to(routes, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.12 }, 2.0);

    // Then endpoint dots + labels
    tl.to("#route-dots", { opacity: 1, duration: 0.5 }, 2.6);
    tl.to("#route-labels", { opacity: 1, duration: 0.6 }, 3.0);

    slide.querySelectorAll("[data-delay]").forEach((el) => {
      const d = parseFloat(el.dataset.delay);
      tl.to(el, { opacity: 1, duration: 0.6 }, d);
    });

    return tl;
  }

  function buildSolution(slide) {
    const tl = gsap.timeline({ defaults: { ease } });

    tl.to($all(slide, ".r-fade"), { opacity: 1, duration: 0.7, stagger: 0.08 }, 0);
    tl.to($all(slide, ".r-rise"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.1);
    tl.to($all(slide, ".r-rise-soft"), { opacity: 1, y: 0, duration: 0.65, stagger: 0.06 }, 0.3);

    // Draw arrows
    const arrowPaths = $all(slide, ".arrow .draw-line");
    setupDrawLine(arrowPaths);
    tl.to(arrowPaths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.18, ease: "power2.inOut" }, 0.8);

    return tl;
  }

  function buildResults(slide) {
    const tl = gsap.timeline({ defaults: { ease } });

    tl.to($all(slide, ".r-fade"), { opacity: 1, duration: 0.55, stagger: 0.06 }, 0);
    tl.to($all(slide, ".r-rise"), { opacity: 1, y: 0, duration: 0.75, stagger: 0.08 }, 0.1);
    tl.to($all(slide, ".r-rise-soft"), { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 }, 0.25);
    tl.to($all(slide, ".r-ink"), { opacity: 1, y: 0, filter: "blur(0)", duration: 0.7, stagger: 0.15 }, 0.4);

    // Band area
    const bandUpper = slide.querySelector("#band-upper");
    const bandMid = slide.querySelector("#band-mid");
    if (bandUpper) {
      gsap.set(bandUpper, { opacity: 0 });
      tl.to(bandUpper, { opacity: 1, duration: 1.0 }, 0.8);
    }
    if (bandMid) {
      setupDrawLine([bandMid]);
      tl.to(bandMid, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 1.0);
    }

    // Counters
    $all(slide, ".count-up").forEach((el, i) => {
      tl.add(() => window.VAX.counters.animate(el), 0.6 + i * 0.25);
    });

    // Band points
    tl.to("#band-pts", { opacity: 1, duration: 0.6 }, 2.4);

    return tl;
  }

  function buildRigor(slide) {
    const tl = gsap.timeline({ defaults: { ease } });

    tl.to($all(slide, ".r-fade"), { opacity: 1, duration: 0.6, stagger: 0.08 }, 0);
    tl.to($all(slide, ".r-rise"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.1);
    tl.to($all(slide, ".r-rise-soft"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.4);

    // Draw step icons
    const icons = $all(slide, ".step .icon .draw-line");
    setupDrawLine(icons);
    tl.to(icons, { strokeDashoffset: 0, duration: 1.0, stagger: 0.15, ease: "power2.inOut" }, 0.8);

    return tl;
  }

  function buildRoadmap(slide) {
    const tl = gsap.timeline({ defaults: { ease } });

    tl.to($all(slide, ".r-fade"), { opacity: 1, duration: 0.6, stagger: 0.08 }, 0);
    tl.to($all(slide, ".r-rise"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.1);
    tl.to($all(slide, ".r-rise-soft"), { opacity: 1, y: 0, duration: 0.75, stagger: 0.15 }, 0.3);

    return tl;
  }

  function buildClose(slide) {
    const tl = gsap.timeline({ defaults: { ease } });

    tl.to($all(slide, ".r-fade"), { opacity: 1, duration: 0.8, stagger: 0.18 }, 0);

    // Ornaments draw
    const orn = $all(slide, ".ornament-top .draw-line, .ornament-bot .draw-line");
    setupDrawLine(orn);
    tl.to(orn, { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: "power2.inOut" }, 0.4);

    // Typewriter on tagline
    const tagline = slide.querySelector(".tagline.tw");
    if (tagline) tl.add(() => window.VAX.typewriter.reveal(tagline, { stagger: 0.04, duration: 0.18 }), 0.8);

    slide.querySelectorAll("[data-delay]").forEach((el) => {
      const d = parseFloat(el.dataset.delay);
      tl.to(el, { opacity: 1, duration: 0.6 }, d);
    });

    return tl;
  }

  const builders = {
    s1: buildCover,
    s2: buildPain,
    s3: buildInsight,
    s4: buildSolution,
    s5: buildResults,
    s6: buildRigor,
    s7: buildRoadmap,
    s8: buildClose
  };

  function play(slideId) {
    const slide = document.getElementById(slideId);
    if (!slide) return null;
    const builder = builders[slideId];
    return builder ? builder(slide) : null;
  }

  function resetSlide(slideId) {
    const slide = document.getElementById(slideId);
    if (!slide) return;
    setIfAny(slide.querySelectorAll(".r-fade"), { opacity: 0 });
    setIfAny(slide.querySelectorAll(".r-rise"), { opacity: 0, y: 18 });
    setIfAny(slide.querySelectorAll(".r-rise-soft"), { opacity: 0, y: 10 });
    setIfAny(slide.querySelectorAll(".r-ink"), { opacity: 0, y: 6, filter: "blur(1.5px)" });
    setIfAny(slide.querySelectorAll("[data-delay]"), { opacity: 0 });

    // Reset typewriter
    slide.querySelectorAll(".tw").forEach((el) => {
      setIfAny(el.querySelectorAll(".char"), { opacity: 0, y: "0.08em" });
    });

    // Reset counters
    slide.querySelectorAll(".count-up").forEach((el) => window.VAX.counters.reset(el));

    // Reset draw-line strokes
    slide.querySelectorAll(".draw-line").forEach((el) => {
      const len = parseFloat(el.getAttribute("data-len") || "0");
      if (len > 0) {
        el.style.strokeDashoffset = len;
      }
    });

    // Specific resets
    const rD = slide.querySelector("#route-dots");
    if (rD) gsap.set(rD, { opacity: 0 });
    const rL = slide.querySelector("#route-labels");
    if (rL) gsap.set(rL, { opacity: 0 });
    const bp = slide.querySelector("#band-pts");
    if (bp) gsap.set(bp, { opacity: 0 });
    const bu = slide.querySelector("#band-upper");
    if (bu) gsap.set(bu, { opacity: 0 });
  }

  window.VAX = window.VAX || {};
  window.VAX.timeline = { play, resetSlide };
})();

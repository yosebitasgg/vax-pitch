const { chromium } = require("playwright");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const URL = "http://127.0.0.1:4173/final/index.html";
const TOTAL_SLIDES = 8;
const OUT = path.join(__dirname, "final", "vax-final.pdf");
const TMP_DIR = path.join(__dirname, "final", ".pdf-shots");

const VIEWPORT = { width: 1920, height: 1080 };

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    fs.unlinkSync(path.join(dir, file));
  }
}

async function waitForSlide(page, index) {
  await page.evaluate((i) => window.VAX.nav.go(i), index);
  await page.waitForFunction((i) => window.VAX.nav.current() === i, index, {
    timeout: 10000,
  });

  // The deck has staggered GSAP reveals and typewriter titles. Waiting after
  // current() avoids capturing the outgoing slide; this delay captures the
  // final, fully revealed state.
  const isTypewriterHeavy = index === 0 || index === TOTAL_SLIDES - 1;
  await page.waitForTimeout(isTypewriterHeavy ? 5200 : 3300);
}

(async () => {
  ensureDir(TMP_DIR);
  cleanDir(TMP_DIR);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForFunction(() => window.VAX?.nav?.total?.() === 8, {
    timeout: 10000,
  });

  const shots = [];
  for (let i = 0; i < TOTAL_SLIDES; i += 1) {
    await waitForSlide(page, i);

    const activeId = await page.evaluate(
      () => document.querySelector(".slide.is-active")?.id
    );
    const expectedId = `s${i + 1}`;
    if (activeId !== expectedId) {
      throw new Error(`Expected ${expectedId}, got ${activeId || "none"}`);
    }

    const file = path.join(TMP_DIR, `slide-${String(i + 1).padStart(2, "0")}.jpg`);
    await page.screenshot({
      path: file,
      type: "jpeg",
      quality: 88,
      fullPage: false,
    });
    shots.push(file);
    console.log(`Captured ${expectedId}`);
  }

  await browser.close();

  if (consoleErrors.length) {
    throw new Error(`Console/page errors:\n${consoleErrors.join("\n")}`);
  }

  const doc = new PDFDocument({
    size: [VIEWPORT.width, VIEWPORT.height],
    margin: 0,
    compress: true,
    autoFirstPage: false,
  });

  doc.pipe(fs.createWriteStream(OUT));

  for (const shot of shots) {
    doc.addPage({ size: [VIEWPORT.width, VIEWPORT.height], margin: 0 });
    doc.image(shot, 0, 0, {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
    });
  }

  await new Promise((resolve) => {
    doc.on("end", resolve);
    doc.end();
  });

  cleanDir(TMP_DIR);
  fs.rmdirSync(TMP_DIR);

  console.log(`PDF generado: ${OUT}`);
})();

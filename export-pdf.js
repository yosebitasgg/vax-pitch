const { chromium } = require('playwright');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const URL = 'https://yosebitasgg.github.io/vax-pitch/';
const TOTAL_SLIDES = 8;
const OUT = 'vax-pitch-compressed.pdf';

(async () => {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: {
      width: 1920,
      height: 1080
    },
    deviceScaleFactor: 1
  });

  await page.goto(URL, {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForTimeout(2500);

  const shots = [];

  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    await page.waitForTimeout(1200);

    const file = path.join(
      __dirname,
      `slide-${String(i).padStart(2, '0')}.jpg`
    );

    await page.screenshot({
      path: file,
      type: 'jpeg',
      quality: 70,
      fullPage: false
    });

    shots.push(file);

    if (i < TOTAL_SLIDES) {
      await page.keyboard.press('ArrowRight');
    }
  }

  await browser.close();

  const doc = new PDFDocument({
    size: [1920, 1080],
    margin: 0,
    compress: true
  });

  doc.pipe(fs.createWriteStream(OUT));

  shots.forEach((shot, index) => {
    if (index > 0) {
      doc.addPage({
        size: [1920, 1080],
        margin: 0
      });
    }

    doc.image(shot, 0, 0, {
      width: 1920,
      height: 1080
    });
  });

  doc.end();

  console.log(`PDF generado: ${OUT}`);

  // limpiar imágenes temporales
  shots.forEach(file => {
    fs.unlinkSync(file);
  });

})();
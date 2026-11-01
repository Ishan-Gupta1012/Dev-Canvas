import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

for (const target of [0.02, 0.15, 0.3, 0.55]) {
  await page.evaluate((t) => {
    const home = document.querySelector('#home');
    const scrollable = home.offsetHeight - window.innerHeight;
    window.scrollTo(0, home.offsetTop + scrollable * t);
  }, target);
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const frags = [...document.querySelectorAll('#home [class*="cursor-grab"]')];
    const outer = frags.map((f) => {
      const el = f.closest('[class*="absolute"]');
      return el ? +getComputedStyle(el).opacity : null;
    });
    return { p: +window.__coreDbg?.p?.get?.()?.toFixed(2), outerOpacities: outer };
  });
  console.log(`p=${r.p}: fragment opacities = ${r.outerOpacities.join(', ')}`);
}
await browser.close();

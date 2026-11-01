import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.__animLogs = [];
  const orig = Element.prototype.animate;
  Element.prototype.animate = function (k, o) {
    const a = orig.call(this, k, o);
    try {
      const ks = JSON.stringify(k);
      if (ks.includes('opacity')) {
        window.__animLogs.push({
          t: Date.now(),
          stack: (new Error('anim').stack || '').split('\n').slice(1, 8).join(' | '),
          keys: ks.slice(0, 240),
          opts: JSON.stringify(o)?.slice(0, 240),
          cls: (this.className || '').toString().slice(0, 80),
        });
      }
    } catch {}
    return a;
  };
});
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const cur = await page.evaluate(() => window.scrollY);
const dest = await page.evaluate(() => {
  const home = document.querySelector('#home');
  return home.offsetTop + (home.offsetHeight - window.innerHeight) * 0.55;
});
for (let i = 1; i <= 24; i++) {
  await page.evaluate((v) => window.scrollTo(0, v), cur + ((dest - cur) * i) / 24);
  await page.waitForTimeout(45);
}
await page.waitForTimeout(900);

const logs = await page.evaluate(() => (window.__animLogs || []).slice(0, 6));
console.log(JSON.stringify(logs, null, 1));
console.log('total:', await page.evaluate(() => window.__animLogs?.length));
await browser.close();

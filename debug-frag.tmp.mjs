import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

for (const y of [0, 600, 1235, 2100, 2900]) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    const frags = [...document.querySelectorAll('.select-none.cursor-grab')];
    const section = document.querySelector('#home');
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const scrolled = -r.top;
    return {
      heroP: total > 0 ? +(scrolled / total).toFixed(3) : 0,
      scrollY: window.scrollY,
      frags: frags.map((f) => {
        const outer = f.parentElement;
        return +parseFloat(getComputedStyle(outer).opacity).toFixed(2);
      }),
    };
  });
  console.log(JSON.stringify(info));
}
await browser.close();

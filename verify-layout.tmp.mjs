import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const home = document.querySelector('#home');
  const cs = getComputedStyle(home);
  const r = home.getBoundingClientRect();
  return {
    cls: home.className,
    height: cs.height,
    inlineHeight: home.style.height,
    rectHeight: r.height,
    docHeight: document.documentElement.scrollHeight,
    vh: window.innerHeight,
    offsetTop: home.offsetTop,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

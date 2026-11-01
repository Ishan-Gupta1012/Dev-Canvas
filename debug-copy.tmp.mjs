import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

for (const pTarget of [0.0, 0.25, 0.5, 0.85]) {
  const y = await page.evaluate((pt) => {
    const home = document.querySelector('#home');
    const top = home.getBoundingClientRect().top + window.scrollY;
    const range = home.offsetHeight - window.innerHeight;
    window.scrollTo(0, top + range * pt);
    return top + range * pt;
  }, pTarget);
  await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    const stack = document.querySelector('#home .lg\\:col-span-5 > div');
    const blocks = [...stack.children];
    return {
      scrollY: window.scrollY,
      blocks: blocks.map((b) => ({
        opacity: getComputedStyle(b).opacity,
        transform: getComputedStyle(b).transform.slice(0, 30),
        pointerEvents: getComputedStyle(b).pointerEvents,
        text: b.innerText.slice(0, 24).replace(/\n/g, ' '),
      })),
    };
  });
  console.log('p=' + pTarget, JSON.stringify(info, null, 1));
}
await browser.close();

import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

for (const p of [0.02, 0.2, 0.3, 0.5, 0.65, 0.8, 0.95]) {
  await page.evaluate((target) => {
    const home = document.querySelector('#home');
    const scrollable = home.offsetHeight - window.innerHeight; // 5040-900
    window.scrollTo(0, home.offsetTop + scrollable * target);
  }, p);
  await page.waitForTimeout(900);
  const res = await page.evaluate(() => {
    const home = document.querySelector('#home');
    const stack = home.querySelector('div > div > div');
    const blocks = [...stack.children].filter((c) => c.querySelector('h1,h2'));
    const active = blocks.map((b) => ({
      op: +getComputedStyle(b).opacity,
      pe: getComputedStyle(b).pointerEvents,
      txt: b.innerText.slice(0, 12).replace(/\n/g, ' '),
    }));
    return { activeIdx: active.findIndex((b) => b.pe === 'auto'), active };
  });
  const vis = res.active.filter((b) => b.op > 0.05).map((b) => `${b.txt}(${b.op})`);
  console.log(`p=${p}: active#${res.activeIdx} visible=${vis.length} -> ${vis.join(' | ')}`);
}
await browser.close();

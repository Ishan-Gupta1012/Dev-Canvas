import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const readPhase = () => page.evaluate(() => {
  const home = document.querySelector('#home');
  const stack = home.querySelector('div > div > div');
  const blocks = [...stack.children].filter((c) => c.querySelector('h1,h2'));
  const active = blocks.findIndex((b) => getComputedStyle(b).pointerEvents === 'auto');
  return { active, frac: +(window.scrollY / (home.offsetHeight - window.innerHeight)).toFixed(2) };
});

// Wheel-driven scroll in steps through the pinned range.
const homeTop = await page.evaluate(() => document.querySelector('#home').offsetTop);
await page.evaluate((y) => window.scrollTo(0, y), homeTop);
await page.waitForTimeout(300);
await page.mouse.move(720, 450);
for (let i = 0; i < 40; i++) {
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(120);
  if (i % 8 === 0) console.log('wheel', JSON.stringify(await readPhase()));
}
console.log('final', JSON.stringify(await readPhase()));
await browser.close();

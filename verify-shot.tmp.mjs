import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

for (const target of [0.02, 0.3, 0.55, 0.85]) {
  await page.evaluate((t) => {
    const home = document.querySelector('#home');
    const scrollable = home.offsetHeight - window.innerHeight;
    window.scrollTo(0, home.offsetTop + scrollable * t);
  }, target);
  await page.waitForTimeout(1000);
  // Use window.__coreDbg.phase (verified correct) and screenshot to see truth.
  const phase = await page.evaluate(() => window.__coreDbg?.phase);
  const tag = `p${String(target).replace('.', '_')}_phase${phase}`;
  await page.screenshot({ path: `/tmp/core_${tag}.png` });
  console.log(`target=${target} phase=${phase} -> /tmp/core_${tag}.png`);
}
await browser.close();

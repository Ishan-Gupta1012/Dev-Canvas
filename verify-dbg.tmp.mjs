import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

for (const target of [0.02, 0.2, 0.3, 0.5, 0.65, 0.8, 0.95]) {
  await page.evaluate((t) => {
    const home = document.querySelector('#home');
    const scrollable = home.offsetHeight - window.innerHeight;
    window.scrollTo(0, home.offsetTop + scrollable * t);
  }, target);
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const d = window.__coreDbg;
    if (!d) return { err: 'no dbg' };
    const mv = d.p;
    return {
      mvGet: typeof mv?.get === 'function' ? mv.get() : 'no-get',
      dbgP: d.dbgP,
      phase: d.phase,
    };
  });
  console.log(`target=${target}: p.get()=${r.mvGet} dbgP=${r.dbgP} phase=${r.phase}`);
}
await browser.close();

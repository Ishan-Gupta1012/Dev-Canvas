import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

async function settleAt(target) {
  // Wheel-scroll gradually to the target so the pinned compositor keeps up,
  // then wait for it to fully settle before screenshotting.
  const cur = await page.evaluate(() => window.scrollY);
  const dest = await page.evaluate((t) => {
    const home = document.querySelector('#home');
    return home.offsetTop + (home.offsetHeight - window.innerHeight) * t;
  }, target);
  const steps = 24;
  for (let i = 1; i <= steps; i++) {
    const y = cur + ((dest - cur) * i) / steps;
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(1200);
}

for (const [target, name] of [[0.3, 'phase1'], [0.55, 'phase2'], [0.85, 'phase4']]) {
  await settleAt(target);
  const p = await page.evaluate(() => +window.__coreDbg?.p?.get?.()?.toFixed(3));
  await page.screenshot({ path: `/tmp/settle_${name}_p${p}.png` });
  console.log(`${name}: p=${p} -> /tmp/settle_${name}_p${p}.png`);
}
await browser.close();

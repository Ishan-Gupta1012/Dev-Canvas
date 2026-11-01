import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

async function settleAt(target) {
  const cur = await page.evaluate(() => window.scrollY);
  const dest = await page.evaluate((t) => {
    const home = document.querySelector('#home');
    return home.offsetTop + (home.offsetHeight - window.innerHeight) * t;
  }, target);
  const steps = 30;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((v) => window.scrollTo(0, v), cur + ((dest - cur) * i) / steps);
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(1000);
}

await settleAt(0.85);
const r = await page.evaluate(() => {
  const op = (sel) => {
    const el = document.querySelector(sel);
    return el ? +getComputedStyle(el).opacity : null;
  };
  // The three stage layers are direct children under the pinned stage wrapper.
  const stage = document.querySelector('#home .lg\\:col-span-7 .relative.w-full');
  const layers = stage ? [...stage.children].map((c) => ({
    op: +getComputedStyle(c).opacity,
    cls: (c.className || '').toString().slice(0, 60),
  })) : [];
  return { p: +window.__coreDbg?.p?.get?.()?.toFixed(3), layers, op };
});
console.log('p =', r.p);
r.layers.forEach((l, i) => console.log(`  layer ${i}: opacity=${l.op}  [${l.cls}]`));
await browser.close();

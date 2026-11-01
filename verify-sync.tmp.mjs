import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

async function settleAt(target) {
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

for (const t of [0.02, 0.3, 0.55, 0.85, 0.95]) {
  await settleAt(t);
  const info = await page.evaluate(() => {
    const p = window.__coreDbg?.p?.get?.();
    const stage = document.querySelector('#home .lg\\:col-span-7 > div');
    const layers = [...stage.children].map((el, i) => {
      const inner = el.firstElementChild;
      return {
        i,
        outer: +getComputedStyle(el).opacity.slice(0, 6),
        inner: inner && getComputedStyle(inner).opacity !== '1'
          ? +getComputedStyle(inner).opacity.slice(0, 6)
          : inner ? 1 : null,
        cls: el.className.slice(0, 34),
      };
    });
    const frags = [...document.querySelectorAll('#home [class*="pointer-events-auto"] .cursor-grab')]
      .map((g) => +getComputedStyle(g.parentElement).opacity.slice(0, 6));
    return { p: +p?.toFixed(3), phase: window.__coreDbg?.phase, layers, frags };
  });
  console.log(JSON.stringify(info));
  await page.screenshot({ path: `/tmp/sync_p${info.p}.png` });
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();

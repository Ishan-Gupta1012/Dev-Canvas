import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

async function settleAt(target) {
  const cur = await page.evaluate(() => window.scrollY);
  const dest = await page.evaluate((t) => {
    const home = document.querySelector('#home');
    return home.offsetTop + (home.offsetHeight - window.innerHeight) * t;
  }, target);
  for (let i = 1; i <= 24; i++) {
    await page.evaluate((v) => window.scrollTo(0, v), cur + ((dest - cur) * i) / 24);
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(1100);
}

for (const t of [0.3, 0.55, 0.85]) {
  await settleAt(t);
  const out = await page.evaluate(() => {
    const p = +window.__coreDbg?.p?.get?.()?.toFixed(3);
    const stage = document.querySelector('#home .lg\\:col-span-7 > div');
    const frag = document.querySelector('#home .pointer-events-auto.absolute') ||
      [...document.querySelectorAll('#home [class*="pointer-events-auto"]')].find((e) => e.className.includes('absolute'));
    const grab = frag?.querySelector('.cursor-grab');
    const coreInner = stage?.children?.[0]?.firstElementChild;
    const web = stage?.children?.[3];
    const doc = stage?.children?.[2];
    const read = (el, label) => el ? {
      label,
      inline: el.style.opacity || '(none)',
      computed: getComputedStyle(el).opacity,
      syncv: el.dataset.syncv ?? '(none)',
      mounted: el.dataset.syncMounted ?? '(none)',
      n: el.dataset.syncN ?? '(none)',
    } : { label, missing: true };
    return {
      p,
      frag: read(frag, 'frag'),
      core: read(coreInner, 'core'),
      doc: read(doc, 'doc'),
      web: read(web, 'web'),
      dbgKeys: Object.keys(window.__coreDbg || {}),
    };
  });
  console.log(JSON.stringify(out, null, 1));
}
await browser.close();

import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const cur = await page.evaluate(() => window.scrollY);
const dest = await page.evaluate(() => {
  const home = document.querySelector('#home');
  return home.offsetTop + (home.offsetHeight - window.innerHeight) * 0.55;
});
for (let i = 1; i <= 24; i++) {
  await page.evaluate((v) => window.scrollTo(0, v), cur + ((dest - cur) * i) / 24);
  await page.waitForTimeout(45);
}
await page.waitForTimeout(1100);

const out = await page.evaluate(() => {
  const el = [...document.querySelectorAll('#home [class*="pointer-events-auto"]')]
    .find((e) => e.className.includes('absolute'));
  const anims = el.getAnimations().map((a) => ({
    name: a.animationName ?? a.id ?? a.constructor.name,
    playState: a.playState,
    currentTime: a.currentTime,
    timing: JSON.stringify(a.effect?.getTiming?.() ?? null),
    frames: a.effect?.getKeyframes?.().map((f) => ({ o: f.opacity, t: f.transform, e: f.easing, off: f.offset })),
  }));
  const matched = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    const walk = (rs) => {
      for (const r of rs) {
        if (r.cssRules) { walk(r.cssRules); continue; }
        if (!r.selectorText) continue;
        try {
          if (el.matches(r.selectorText) && /opacity/.test(r.cssText)) {
            matched.push({ sel: r.selectorText, css: r.cssText.slice(0, 220) });
          }
        } catch {}
      }
    };
    walk(rules);
  }
  return {
    inline: el.getAttribute('style'),
    computed: getComputedStyle(el).opacity,
    anims,
    matched,
    p: window.__coreDbg?.p?.get?.(),
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();

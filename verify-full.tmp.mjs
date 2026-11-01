import { chromium } from 'playwright';

const URL = 'http://localhost:3100';
const browser = await chromium.launch();
const errors = [];
const attach = (page, tag) => {
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
};

const overflow = (page) =>
  page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }));

async function settleAt(page, selector, t) {
  const cur = await page.evaluate(() => window.scrollY);
  const dest = await page.evaluate(([sel, tt]) => {
    const el = document.querySelector(sel);
    return el.offsetTop + Math.max(0, el.offsetHeight - window.innerHeight) * tt;
  }, [selector, t]);
  const steps = Math.max(8, Math.min(44, Math.round(Math.abs(dest - cur) / 55)));
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((v) => window.scrollTo(0, v), cur + ((dest - cur) * i) / steps);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(1000);
}

const shot = async (page, name) => {
  const o = await overflow(page);
  await page.screenshot({ path: `/tmp/full_${name}.png` });
  console.log(`shot ${name} (sw=${o.sw} iw=${o.iw}${o.sw > o.iw + 1 ? ' OVERFLOW!' : ''})`);
};

/* ── Desktop pass ── */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
attach(page, 'desktop');
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

await settleAt(page, '#home', 0.02); await shot(page, 'd1_intro');
await settleAt(page, '#home', 0.3);  await shot(page, 'd2_profile');
await settleAt(page, '#home', 0.55); await shot(page, 'd3_resume');
await settleAt(page, '#home', 0.85); await shot(page, 'd4_portfolio');
await settleAt(page, '#home', 0.99); await shot(page, 'd5_handoff');
await settleAt(page, '#how-it-works', 0.55); await shot(page, 'd6_workflow');
await settleAt(page, '#growth', 0.6); await shot(page, 'd7_growth');
await page.evaluate(() => document.querySelector('#finale').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(900); await shot(page, 'd8_finale');
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900); await shot(page, 'd9_footer');

/* Reverse pass back up through the pinned core (reversibility) */
for (const [sel, t, name] of [['#growth', 0.3, 'r1_growth_up'], ['#how-it-works', 0.3, 'r2_workflow_up']]) {
  await settleAt(page, sel, t); await shot(page, name);
}
for (const t of [0.85, 0.55, 0.3, 0.05]) {
  await settleAt(page, '#home', t);
  const info = await page.evaluate(() => {
    const p = +window.__coreDbg.p.get().toFixed(3);
    const stage = document.querySelector('#home .lg\\:col-span-7 > div');
    const o = (el) => +getComputedStyle(el).opacity.slice(0, 5);
    return {
      p,
      core: o(stage.children[0].firstElementChild),
      doc: o(stage.children[2]),
      web: o(stage.children[3]),
    };
  });
  console.log('reverse core:', JSON.stringify(info));
}
await shot(page, 'r3_intro_back');

/* Fast jump to bottom and back — then anchor navigation + CTAs */
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(700);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
await shot(page, 'f1_after_fast_jump');

await page.click('nav >> text=How It Works');
await page.waitForTimeout(900);
const anchor = await page.evaluate(() => {
  const el = document.querySelector('#how-it-works');
  const r = el.getBoundingClientRect();
  return { hash: location.hash, inView: r.top < window.innerHeight && r.bottom > 0 };
});
console.log('anchor how-it-works:', JSON.stringify(anchor));
const ctas = await page.evaluate(() => ({
  hero: [...document.querySelectorAll('#home button')].map((b) => b.textContent.trim()).slice(0, 3),
  header: [...document.querySelectorAll('header a, nav a')].map((a) => a.getAttribute('href')).slice(0, 8),
}));
console.log('ctas:', JSON.stringify(ctas));

/* Drag a fragment and confirm spring-back */
await settleAt(page, '#home', 0.02);
const drag = await page.evaluate(async () => {
  const grab = document.querySelector('#home .pointer-events-auto.absolute .cursor-grab');
  const r = grab.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, before: grab.style.transform || 'none' };
});
await page.mouse.move(drag.x, drag.y);
await page.mouse.down();
for (let i = 1; i <= 8; i++) {
  await page.mouse.move(drag.x + (60 * i) / 8, drag.y + (40 * i) / 8);
  await page.waitForTimeout(30);
}
const mid = await page.evaluate(() => {
  const grab = document.querySelector('#home .pointer-events-auto.absolute .cursor-grab');
  return grab.style.transform;
});
await page.mouse.up();
await page.waitForTimeout(1300);
const after = await page.evaluate(() => {
  const grab = document.querySelector('#home .pointer-events-auto.absolute .cursor-grab');
  return grab.style.transform;
});
console.log('drag mid:', mid, '| after release:', after);
await shot(page, 'f2_after_drag');
await page.close();

/* ── Mobile pass ── */
const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
attach(mob, 'mobile');
await mob.goto(URL, { waitUntil: 'networkidle' });
await mob.waitForTimeout(1200);
await settleAt(mob, '#home', 0.02); await shot(mob, 'm1_intro');
await settleAt(mob, '#home', 0.3);  await shot(mob, 'm2_profile');
await settleAt(mob, '#home', 0.55); await shot(mob, 'm3_resume');
await settleAt(mob, '#home', 0.85); await shot(mob, 'm4_portfolio');
await settleAt(mob, '#how-it-works', 0.55); await shot(mob, 'm5_workflow');
await settleAt(mob, '#growth', 0.6); await shot(mob, 'm6_growth');
await mob.evaluate(() => document.querySelector('#finale').scrollIntoView({ block: 'center' }));
await mob.waitForTimeout(900); await shot(mob, 'm7_finale');
await mob.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await mob.waitForTimeout(900); await shot(mob, 'm8_footer');
await mob.close();

/* ── Reduced motion: DOM assertions (headless RM screenshots are blank by env artifact) ── */
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
attach(rm, 'reduced');
await rm.goto(URL, { waitUntil: 'networkidle' });
await rm.waitForTimeout(1200);
const rmCheck = await rm.evaluate(() => {
  const vis = (el) => {
    if (!el) return false;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return +s.opacity > 0 && r.width > 0 && r.height > 0 && s.visibility !== 'hidden';
  };
  return {
    h1: vis(document.querySelector('#home h1')),
    heroCta: vis(document.querySelector('#home button')),
    sections: ['#home', '#how-it-works', '#growth', '#finale'].every((s) => !!document.querySelector(s)),
    stageCores: !!document.querySelector('#home .lg\\:col-span-7'),
  };
});
console.log('reduced-motion:', JSON.stringify(rmCheck));
await rm.close();

console.log('ERRORS:', errors.length ? JSON.stringify(errors, null, 1) : 'none');
await browser.close();

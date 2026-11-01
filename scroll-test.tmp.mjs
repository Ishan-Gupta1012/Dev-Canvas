import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:3100';
const DIR = '/private/var/folders/07/yvxrsjr11nj53qw3lfzd4yz80000gn/T/opencode/shots2';
fs.mkdirSync(DIR, { recursive: true });

const errors = [];
const notes = [];

const browser = await chromium.launch();

async function stopsForHome(page, ps) {
  return page.evaluate((ps) => {
    const home = document.querySelector('#home');
    const top = home.getBoundingClientRect().top + window.scrollY;
    const range = home.offsetHeight - window.innerHeight;
    return ps.map((p) => top + range * p);
  }, ps);
}

async function shoot(page, name) {
  await page.screenshot({ path: `${DIR}/${name}.png` });
}

/* ── Desktop ── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e)));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const metrics = await page.evaluate(() => ({
    scrollHeight: document.body.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  notes.push('desktop metrics: ' + JSON.stringify(metrics));
  if (metrics.scrollWidth > metrics.innerWidth + 1) {
    errors.push(`horizontal overflow: ${metrics.scrollWidth} > ${metrics.innerWidth}`);
  }

  await shoot(page, 'd01-hero-loose');

  const homeStops = await stopsForHome(page, [0.06, 0.13, 0.2, 0.27, 0.33, 0.4, 0.46, 0.55, 0.62, 0.7, 0.78, 0.88, 0.97]);
  const names = ['d02-assembly-mid', 'd03-assembled', 'd04-story-copy', 'd05-core-exit', 'd06-resume-forming', 'd07-resume-chip', 'd08-resume-exit', 'd09-browser-enter', 'd10-portfolio-fill', 'd11-portfolio-mid', 'd12-portfolio-done', 'd13-portfolio-end', 'd14-home-end'];
  for (let i = 0; i < homeStops.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), homeStops[i]);
    await page.waitForTimeout(800);
    await shoot(page, names[i]);
  }

  /* Workflow */
  await page.evaluate(() => document.querySelector('#how-it-works').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(900);
  await shoot(page, 'd15-workflow');
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(900);
  await shoot(page, 'd16-workflow-preview');

  /* Growth */
  const growthStops = await page.evaluate(() => {
    const el = document.querySelector('#growth');
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    return [top + range * 0.35, top + range * 0.9].map((v) => Math.max(0, v));
  });
  await page.evaluate((y) => window.scrollTo(0, y), growthStops[0]);
  await page.waitForTimeout(900);
  await shoot(page, 'd17-growth-incoming');
  await page.evaluate((y) => window.scrollTo(0, y), growthStops[1]);
  await page.waitForTimeout(900);
  await shoot(page, 'd18-growth-updated');

  /* Finale + footer */
  await page.evaluate(() => document.querySelector('#finale').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(900);
  await shoot(page, 'd19-finale');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await shoot(page, 'd20-footer');

  /* Reverse: jump back into the pinned story mid-resume */
  await page.evaluate((y) => window.scrollTo(0, y), homeStops[5]);
  await page.waitForTimeout(1200);
  await shoot(page, 'd21-reverse-resume');

  /* Slow wheel through the core→resume handoff */
  await page.evaluate((y) => window.scrollTo(0, y), homeStops[3]);
  await page.waitForTimeout(600);
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 160);
    await page.waitForTimeout(110);
  }
  await shoot(page, 'd22-slow-scroll-handoff');

  /* Anchor navigation */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.click('a[href="#how-it-works"]');
  await page.waitForTimeout(1200);
  const anchorOk = await page.evaluate(() => {
    const r = document.querySelector('#how-it-works').getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  });
  notes.push('anchor #how-it-works works: ' + anchorOk);
  if (!anchorOk) errors.push('anchor navigation to #how-it-works failed');

  await ctx.close();
}

/* ── Reduced motion: DOM assertions (headless paint is unreliable here) ── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const rm = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const cs = h1 ? getComputedStyle(h1) : null;
    return {
      h1Visible: !!h1 && cs.opacity !== '0' && cs.visibility === 'visible',
      h1Text: h1 ? h1.innerText.slice(0, 30) : null,
      sections: ['#home', '#how-it-works', '#growth', '#finale'].map((s) => !!document.querySelector(s)),
    };
  });
  notes.push('reduced-motion DOM: ' + JSON.stringify(rm));
  if (!rm.h1Visible || rm.sections.includes(false)) errors.push('reduced-motion content missing');
  await ctx.close();
}

/* ── Mobile ── */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('pageerror(mobile): ' + String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  notes.push('mobile horizontal overflow px: ' + overflow);
  if (overflow > 1) errors.push('mobile horizontal overflow: ' + overflow);
  await shoot(page, 'm01-hero');

  const homeStops = await stopsForHome(page, [0.13, 0.28, 0.55, 0.88]);
  const names = ['m02-assembled', 'm03-resume', 'm04-browser-enter', 'm05-portfolio'];
  for (let i = 0; i < homeStops.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), homeStops[i]);
    await page.waitForTimeout(800);
    await shoot(page, names[i]);
  }
  await page.evaluate(() => document.querySelector('#how-it-works').scrollIntoView());
  await page.waitForTimeout(800);
  await shoot(page, 'm06-workflow');
  await page.evaluate(() => document.querySelector('#growth').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(800);
  await shoot(page, 'm07-growth');
  await page.evaluate(() => document.querySelector('#finale').scrollIntoView());
  await page.waitForTimeout(800);
  await shoot(page, 'm08-finale');
  await ctx.close();
}

await browser.close();

console.log('--- NOTES ---');
notes.forEach((n) => console.log(n));
console.log('--- ERRORS (' + errors.length + ') ---');
errors.slice(0, 20).forEach((e) => console.log(e));

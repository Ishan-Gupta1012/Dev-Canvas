import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
page.on('console', (m) => console.log('console:', m.type(), m.text().slice(0, 200)));
page.on('pageerror', (e) => console.log('pageerror:', String(e).slice(0, 300)));
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  return {
    bodyTextLen: document.body.innerText.length,
    scrollY: window.scrollY,
    h1: h1 ? { text: h1.innerText.slice(0, 40), opacity: getComputedStyle(h1.parentElement).opacity, rect: h1.getBoundingClientRect().toJSON() } : null,
    headerRect: header ? header.getBoundingClientRect().toJSON() : null,
    mainRect: main ? main.getBoundingClientRect().toJSON() : null,
    mainChildren: main ? main.children.length : 0,
    htmlBg: getComputedStyle(document.body).backgroundColor,
    firstSection: document.querySelector('#home')?.getBoundingClientRect().toJSON(),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

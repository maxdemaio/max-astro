import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const out = process.argv[2];
const variants = { 'og-home.png': '', 'og-blog.png': '/blog', 'og-projects.png': '/projects' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve('og.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
for (const [file, seg] of Object.entries(variants)) {
  await page.evaluate((seg) => { document.getElementById('mark').innerHTML = 'maxdemaio.com' + (seg ? '<b>' + seg + '</b>' : ''); }, seg);
  await page.locator('#og').screenshot({ path: path.join(out, file) });
}
await browser.close();

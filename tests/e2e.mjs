// E2E checks of the demo homepage on the production build (dist/), Playwright from the VEON tools.
// Run: npm run build && npm run test
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const studio = process.env.VEON_WEB_STUDIO || path.join(os.homedir(), "Desktop", "VEON-WEB-STUDIO");
const { loadPlaywright, launchAttempts } = await import(pathToFileURL(path.join(studio, "quality", "scripts", "veon_pw.mjs")).href);
const { chromium } = loadPlaywright();

const PORT = 4329;
const URL = `http://localhost:${PORT}/`;
const server = spawn(process.execPath, ["node_modules/astro/astro.js", "preview", "--port", String(PORT)], { stdio: "ignore" });
let failed = 0;
const ok = (cond, name) => { console.log(`${cond ? "PASS" : "FAIL"} ${name}`); if (!cond) failed++; };

try {
  for (let i = 0; i < 40; i++) { try { if ((await fetch(URL)).ok) break; } catch { /* starting */ } await wait(250); }
  let browser;
  for (const o of [{}, ...launchAttempts()]) { try { browser = await chromium.launch({ headless: true, ...o }); break; } catch { /* next */ } }

  // Desktop 1440
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: "networkidle" });
  ok((await page.locator("h1").count()) === 1, "one H1");
  ok((await page.locator("h1").innerText()).replace(/\s+/g, " ") === "Сімейна стоматологія в Ужгороді", "H1 text");
  const ids = await page.$$eval("main > section", (s) => s.map((x) => x.id));
  ok(ids.join(",") === "hero,directions,kids,care,doctors,cost,visit", `sections order: ${ids.join(",")}`);
  const tels = await page.$$eval('a[href^="tel:"]', (a) => [...new Set(a.map((x) => x.getAttribute("href")))]);
  ok(tels.every((t) => /^tel:\+3809[357]4414114$/.test(t)), `only Uzhhorod numbers: ${tels.join(" ")}`);
  const hrefs = await page.$$eval("a[href]", (a) => a.map((x) => x.getAttribute("href")));
  ok(!hrefs.some((h) => /mistodent\.com\.ua/.test(h)), "no links to the current client site");
  ok(hrefs.every((h) => /^(#|tel:|mailto:|https:\/\/maps\.app\.goo\.gl|https:\/\/www\.instagram\.com\/home\.clinic_mistodent)/.test(h)), "only allowed link targets");
  ok(await page.locator('header a[href^="tel:"]').first().isVisible(), "call button visible in header");
  ok((await page.locator(".future-link[aria-disabled=true]").count()) >= 10, "FutureLinks are inactive");
  ok(await page.locator(".request button").isDisabled(), "request button is disabled");
  ok((await page.locator("text=Вигода до 18").count()) === 0 && (await page.locator("text=18 000").count()) === 0, "expired implant promotion is not shown");
  // directions: second situation opens and the first closes
  await page.locator("#sit-bolyt").click();
  ok((await page.locator("#sit-bolyt").getAttribute("aria-expanded")) === "true" && await page.locator("#sit-bolyt-panel").isVisible(), "situation switch opens its panel");
  ok(!(await page.locator("#sit-dytyni-panel").isVisible()), "previous situation panel closes");
  // anchor navigation
  await page.locator('.header__nav a[href="#cost"]').click();
  await wait(900);
  const top = await page.locator("#cost").evaluate((e) => e.getBoundingClientRect().top);
  ok(top >= 0 && top < 200, `anchor #cost lands under the header (${Math.round(top)}px)`);
  ok((await page.locator('script[type="application/ld+json"]').count()) === 1, "JSON-LD present");
  ok((await page.locator('meta[name="robots"][content="noindex"]').count()) === 1, "noindex");
  await page.close();

  // Phones and tablets: no horizontal scroll, key elements inside the screen
  for (const w of [320, 375, 390, 768, 1024]) {
    const p = await browser.newPage({ viewport: { width: w, height: 800 } });
    await p.goto(URL, { waitUntil: "networkidle" });
    const { sw, cw } = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    ok(sw <= cw, `${w}px no horizontal scroll (${sw}/${cw})`);
    const box = await p.locator("#hero .btn").first().boundingBox();
    ok(box && box.x >= 0 && box.x + box.width <= w, `${w}px hero call button inside the screen`);
    if (w < 1024) {
      await p.locator('header button[popovertarget="menu"]').first().click();
      ok(await p.locator("#menu").isVisible(), `${w}px menu opens`);
      await p.locator('#menu a[href="#visit"]').click();
      await wait(300);
      ok(!(await p.locator("#menu").isVisible()), `${w}px menu closes after an anchor`);
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await wait(500);
      ok(await p.locator("[data-mbar]").isVisible(), `${w}px bottom call bar after the hero`);
    }
    await p.close();
  }

  // Reduced motion: content in place
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 800 } });
  const rp = await ctx.newPage();
  await rp.goto(URL, { waitUntil: "networkidle" });
  const op = await rp.locator(".kids__figure").evaluate((e) => getComputedStyle(e).opacity);
  ok(op === "1", "reduced motion: revealed content visible");
  await ctx.close();
  await browser.close();
} finally {
  server.kill();
}
console.log(failed ? `RESULT: FAIL (${failed})` : "RESULT: PASS");
process.exit(failed ? 1 : 0);

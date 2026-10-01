// Visual QA: node scripts/qa/screens.mjs <outDir> [path...]
import { chromium } from "playwright";

const out = process.argv[2] ?? "qa-shots";
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ["/"];
const base = process.env.BASE_URL ?? "http://localhost:3000";
const viewports = (process.env.VIEWPORTS ?? "1440x900,390x844").split(",").map((v) => v.split("x").map(Number));
const full = process.env.FULL === "1";

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
for (const [w, h] of viewports) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(Number(process.env.WAIT ?? 2500));
    if (full) {
      // Scroll through so viewport-triggered reveals run, then return to top.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 300));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(1500);
    }
    const name = `${out}/${p.replace(/\W+/g, "_") || "home"}-${w}.png`;
    await page.screenshot({ path: name, fullPage: full });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(name, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : "ok");
  }
  if (errors.length) console.log(`console errors @${w}:`, errors.slice(0, 8));
  await page.close();
}
await browser.close();

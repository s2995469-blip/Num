// Browser smoke test of the real flows. Requires the app running and an admin
// login: ADMIN_EMAIL / ADMIN_PASSWORD env vars. node scripts/qa/e2e.mjs
import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const step = (s) => console.log("✓", s);

// 1. Service CTA pre-fills the booking form
await page.goto(`${base}/services/career-counselling`);
await page.locator(`main a[href="/book-session?service=career-counselling"]`).first().click();
await page.waitForURL(/book-session\?service=career-counselling/);
assert.equal(await page.locator("#service").inputValue(), "career-counselling");
step("service pre-filled from CTA");

// 2. Client validation: submit empty
await page.locator("#service").selectOption("");
await page.getByRole("button", { name: /Send enquiry/ }).click();
assert.ok(await page.locator("#name-error").isVisible());
assert.equal(await page.locator("#name").getAttribute("aria-invalid"), "true");
assert.equal(await page.evaluate(() => document.activeElement?.id), "name");
step("field errors shown and first invalid field focused");

// 3. Valid submission
const email = `e2e-${Date.now()}@example.com`;
await page.locator("#name").fill("E2E Visitor");
await page.locator("#email").fill(email);
await page.locator("#service").selectOption("reiki-healing");
const d = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
await page.locator("#preferredDate").fill(d);
await page.locator("#preferredTime").selectOption("afternoon");
await page.locator("#privacyConsent").check();
await page.waitForTimeout(2600); // the API rejects implausibly fast submissions
await page.getByRole("button", { name: /Send enquiry/ }).click();
await page.getByText("This is an enquiry, not yet a confirmed appointment.").waitFor();
const ref = (await page.locator("strong", { hasText: /^PH-/ }).textContent()).trim();
step(`enquiry submitted, reference ${ref}`);

// 4. Mobile navigation drawer
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(`${base}/`);
await m.getByRole("button", { name: "Open menu" }).click();
const dialog = m.getByRole("dialog", { name: "Menu" });
await dialog.waitFor();
assert.equal(await m.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Close menu");
await m.keyboard.press("Escape");
assert.ok(await dialog.isHidden());
assert.equal(await m.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Open menu");
await m.getByRole("button", { name: "Open menu" }).click();
await dialog.getByRole("link", { name: /^Insights/ }).click();
await m.waitForURL(/\/insights$/);
step("mobile drawer: focus, Escape, return focus, navigation");
await m.close();

// 5. Admin: protected, login, view, confirm
await page.goto(`${base}/admin`);
await page.waitForURL(/\/admin\/login/);
await page.locator("#email").fill(process.env.ADMIN_EMAIL);
await page.locator("#password").fill("wrong-password-123");
await page.getByRole("button", { name: "Sign in" }).click();
await page.getByText("wasn't recognised").waitFor();
await page.locator("#password").fill(process.env.ADMIN_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL(`${base}/admin`);
step("admin login rejects bad password, accepts good one");

const listHtml = await page.content();
assert.ok(!listHtml.includes(email), "list view must not expose email addresses");
await page.goto(`${base}/admin?service=reiki-healing&status=new`);
await page.getByRole("link", { name: ref }).click();
await page.waitForURL(/\/admin\/enquiries\//);
assert.ok((await page.content()).includes(email));
await page.locator("#status").selectOption("confirmed");
await page.locator("#adminNotes").fill("Confirmed by phone");
await page.getByRole("button", { name: "Save changes" }).click();
await page.getByText("Changes saved.").waitFor();
assert.equal(await page.locator("#status").inputValue(), "confirmed");
step("filtered list → detail (contact shown) → status set to Confirmed");

await page.getByRole("button", { name: "Sign out" }).click();
await page.waitForURL(/\/admin\/login/);
await page.goto(`${base}/admin`);
await page.waitForURL(/\/admin\/login/);
step("logout ends the session");

assert.deepEqual(errors, [], "no uncaught page errors");
step("no uncaught page errors");
await browser.close();

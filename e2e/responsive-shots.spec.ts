import { test, expect, Page, BrowserContext } from "@playwright/test";
import * as fs from "fs";

// Responsive screenshot suite: captures the same set of routes in MOBILE
// (iPhone 13, 390x844) and DESKTOP (1440x900) viewports. Best-effort: every
// capture is wrapped in try/catch so a single failure does not block the rest.

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 900 },
} as const;

type Variant = keyof typeof VIEWPORTS;

function ensureDirs() {
  for (const variant of Object.keys(VIEWPORTS) as Variant[]) {
    fs.mkdirSync(`screenshots/${variant}`, { recursive: true });
  }
}

async function safeShot(page: Page, variant: Variant, name: string, waitMs = 2500) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(waitMs);
    await page.screenshot({
      path: `screenshots/${variant}/${name}.png`,
      fullPage: true,
    });
    console.log(`[shot:${variant}] captured ${name}`);
  } catch (err) {
    console.error(`[shot:${variant}] FAILED ${name}:`, (err as Error).message);
  }
}

async function safeGoto(page: Page, url: string) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  } catch (err) {
    console.error(`[goto] FAILED ${url}:`, (err as Error).message);
  }
}

async function login(page: Page, email: string, password: string) {
  await safeGoto(page, "/login");
  await page.waitForTimeout(500);
  try {
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    await emailInput.fill(email, { timeout: 5000 });
    await passwordInput.fill(password, { timeout: 5000 });
    const submit = page.locator('button[type="submit"]').first();
    await submit.click({ timeout: 5000 });
    // Wait for navigation away from /login
    await page
      .waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 10000 })
      .catch(() => {});
    await page.waitForTimeout(1500);
  } catch (err) {
    console.error(`[login] FAILED for ${email}:`, (err as Error).message);
  }
}

async function logout(page: Page, context: BrowserContext) {
  try {
    await context.clearCookies();
  } catch {}
  try {
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {}
    });
  } catch {}
}

async function runVariant(page: Page, context: BrowserContext, variant: Variant) {
  await page.setViewportSize(VIEWPORTS[variant]);

  // a) Sin login — login screen
  await safeGoto(page, "/login");
  await safeShot(page, variant, "login-screen");

  // b) Sin login — microsite público
  await safeGoto(page, "/microsites/cocina-33");
  await safeShot(page, variant, "microsite");

  // c) Login como turista
  await login(page, "seed_turista_023@xitty.local", "xitty-seed-2026");

  await safeGoto(page, "/");
  await safeShot(page, variant, "home");

  await safeGoto(page, "/places");
  await safeShot(page, variant, "places");

  await safeGoto(page, "/places/cocina-33");
  await safeShot(page, variant, "place-detail");

  await safeGoto(page, "/experiences");
  await safeShot(page, variant, "experiences");

  await safeGoto(page, "/reservations");
  await safeShot(page, variant, "reservations");

  await safeGoto(page, "/profile");
  await safeShot(page, variant, "profile");

  // d) Logout y login como dueño — dashboard
  await logout(page, context);
  await login(page, "seed_dueno_001@xitty.local", "xitty-seed-2026");

  await safeGoto(page, "/dashboard");
  await safeShot(page, variant, "dashboard");

  await safeGoto(page, "/dashboard/metrics");
  await safeShot(page, variant, "metrics");
}

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  ensureDirs();
});

test("mobile", async ({ page, context }) => {
  test.setTimeout(180_000);
  await runVariant(page, context, "mobile");
  expect(true).toBe(true);
});

test("desktop", async ({ page, context }) => {
  test.setTimeout(180_000);
  await runVariant(page, context, "desktop");
  expect(true).toBe(true);
});

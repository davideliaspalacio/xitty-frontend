import { test, expect, Page } from "@playwright/test";

// Best-effort screenshot suite. Each step is wrapped in try/catch so a single
// failure does not block subsequent captures.

const SCREENSHOTS_DIR = "screenshots";

async function safeShot(page: Page, name: string, waitMs = 1500) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(waitMs);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${name}`, fullPage: true });
    // eslint-disable-next-line no-console
    console.log(`[shot] captured ${name}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[shot] FAILED ${name}:`, (err as Error).message);
  }
}

async function safeGoto(page: Page, url: string) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[goto] FAILED ${url}:`, (err as Error).message);
  }
}

async function login(page: Page, email: string, password: string) {
  await safeGoto(page, "/login");
  await page.waitForTimeout(500);
  try {
    // Try common selectors for email/password inputs.
    const emailInput = page.locator('input[type="email"], input[name="email"], input[id="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[id="password"]').first();
    await emailInput.fill(email, { timeout: 5000 });
    await passwordInput.fill(password, { timeout: 5000 });
    const submit = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Entrar"), button:has-text("Login")').first();
    await submit.click({ timeout: 5000 });
    // Wait for navigation away from /login
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[login] FAILED for ${email}:`, (err as Error).message);
  }
}

async function logout(page: Page) {
  try {
    // Try direct route, then clearing storage as a fallback.
    await safeGoto(page, "/logout");
    await page.waitForTimeout(500);
  } catch {}
  try {
    await page.context().clearCookies();
    await page.evaluate(() => {
      try { localStorage.clear(); sessionStorage.clear(); } catch {}
    });
  } catch {}
}

test.describe.configure({ mode: "serial" });

test("xitty screenshots — best effort", async ({ page }) => {
  test.setTimeout(300_000);

  // a) Sin login
  await safeGoto(page, "/login");
  await safeShot(page, "login-screen.png");

  await safeGoto(page, "/register");
  await safeShot(page, "register-screen.png");

  // b) Login como turista
  await login(page, "seed_turista_023@xitty.local", "xitty-seed-2026");

  await safeGoto(page, "/");
  await safeShot(page, "home-tourist.png", 2500);

  await safeGoto(page, "/places");
  await safeShot(page, "places-list.png");

  await safeGoto(page, "/places/cocina-33");
  await safeShot(page, "place-detail.png");

  await safeGoto(page, "/experiences");
  await safeShot(page, "experiences-list.png");

  await safeGoto(page, "/favorites");
  await safeShot(page, "favorites.png");

  await safeGoto(page, "/reservations");
  await safeShot(page, "reservations.png");

  await safeGoto(page, "/profile");
  await safeShot(page, "profile.png");

  // c) Logout y login como dueño
  await logout(page);
  await login(page, "seed_dueno_001@xitty.local", "xitty-seed-2026");

  await safeGoto(page, "/dashboard");
  await safeShot(page, "dashboard.png");

  await safeGoto(page, "/dashboard/metrics");
  await safeShot(page, "dashboard-metrics.png");

  await safeGoto(page, "/dashboard/place");
  await safeShot(page, "dashboard-place.png");

  // d) Logout y login como admin
  await logout(page);
  await login(page, "seed_admin_001@xitty.local", "xitty-seed-2026");

  await safeGoto(page, "/admin/sponsorships");
  await safeShot(page, "admin-sponsorships.png");

  // e) Sin login — microsite público
  await logout(page);
  await safeGoto(page, "/microsites/cocina-33");
  await safeShot(page, "microsite.png");

  // Test passes regardless: this is best-effort capture.
  expect(true).toBe(true);
});

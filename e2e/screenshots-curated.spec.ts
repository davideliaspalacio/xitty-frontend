import { test, expect, Page } from "@playwright/test";

// Best-effort screenshot suite for the new curated + admin scraping flows.
// Each step is wrapped in try/catch so a single failure does not block
// subsequent captures.

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
    const emailInput = page
      .locator('input[type="email"], input[name="email"], input[id="email"]')
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"], input[id="password"]')
      .first();
    await emailInput.fill(email, { timeout: 5000 });
    await passwordInput.fill(password, { timeout: 5000 });
    const submit = page
      .locator(
        'button[type="submit"], button:has-text("Iniciar"), button:has-text("Entrar"), button:has-text("Login")',
      )
      .first();
    await submit.click({ timeout: 5000 });
    await page
      .waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 10000 })
      .catch(() => {});
    await page.waitForTimeout(1500);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[login] FAILED for ${email}:`, (err as Error).message);
  }
}

test.describe.configure({ mode: "serial" });

test("xitty curated + admin scraping screenshots — best effort", async ({ page }) => {
  test.setTimeout(300_000);

  // 1) Sin login: home y scroll a la seccion curada
  await safeGoto(page, "/");
  await page.waitForTimeout(2000);

  try {
    const curatedHeading = page
      .getByRole("heading", { name: /descubre lo nuevo en barranquilla/i })
      .first();
    await curatedHeading.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(800);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[scroll] curated heading not found:", (err as Error).message);
  }
  await safeShot(page, "curated-section.png", 1500);

  // 2) Login como admin y captura de /admin/scraping
  await login(page, "seed_admin_001@xitty.local", "xitty-seed-2026");

  await safeGoto(page, "/admin/scraping");
  await safeShot(page, "admin-scraping-overview.png", 2500);

  // Click en la tab "Moderación"
  try {
    const moderationTab = page
      .getByRole("tab", { name: /moderaci/i })
      .first();
    await moderationTab.click({ timeout: 5000 });
    await page.waitForTimeout(1500);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[tab] moderacion click failed:", (err as Error).message);
  }
  await safeShot(page, "admin-scraping-moderation.png", 1500);

  // Click en un item (boton Editar abre el ItemEditor modal con el detalle).
  try {
    const editBtn = page
      .getByRole("button", { name: /editar/i })
      .first();
    await editBtn.click({ timeout: 5000 });
    await page.waitForTimeout(1500);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[item-detail] click failed:", (err as Error).message);
  }
  await safeShot(page, "admin-scraping-item-detail.png", 1500);

  expect(true).toBe(true);
});

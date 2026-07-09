import { test, Page } from "@playwright/test";

/**
 * Capturas de las features del pivot (Fases 1-3) que faltaban en el PDF:
 * chat, "vale la pena hoy", ads hero, chips de modalidad, selector de idioma,
 * botón SOS y safety badge (con geo mockeada).
 *
 * Best-effort: cada paso en try/catch para que un fallo no bloquee el resto.
 */

const DIR = "screenshots";
const TURISTA = { email: "seed_turista_023@xitty.local", password: "xitty-seed-2026" };

async function safeShot(page: Page, name: string, waitMs = 1800) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(waitMs);
    await page.screenshot({ path: `${DIR}/${name}`, fullPage: true });
    console.log(`[shot] OK ${name}`);
  } catch (err) {
    console.error(`[shot] FAIL ${name}:`, (err as Error).message);
  }
}

async function login(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(600);
  try {
    await page.locator('input[type="email"], input[name="email"]').first().fill(TURISTA.email, { timeout: 6000 });
    await page.locator('input[type="password"], input[name="password"]').first().fill(TURISTA.password, { timeout: 6000 });
    await page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Entrar")').first().click({ timeout: 6000 });
    await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
  } catch (err) {
    console.error("[login] FAIL:", (err as Error).message);
  }
}

// ---- Capturas sin geo: home, chat, idioma, SOS ----
test.describe("pivot features", () => {
  test("home + interacciones", async ({ page }) => {
    test.setTimeout(150_000);
    await login(page);

    // Home completo: ads hero + "vale la pena hoy" + chips + carruseles
    await page.goto("/", { waitUntil: "domcontentloaded" }).catch(() => {});
    await safeShot(page, "pivot-home.png", 3500);

    // Chat: abrir el FAB y capturar el panel (empty state con quick replies)
    try {
      await page.getByRole("button", { name: /asistente xi/i }).click({ timeout: 6000 });
      await page.waitForTimeout(1200);
      await safeShot(page, "pivot-chat.png", 1000);
    } catch (err) {
      console.error("[chat] FAIL:", (err as Error).message);
    }

    // Selector de idioma: recargar home (estado limpio, sin overlay del chat)
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);
      await page.getByRole("button", { name: /cambiar idioma/i }).first().click({ timeout: 6000 });
      await page.waitForTimeout(800);
      await safeShot(page, "pivot-language.png", 600);
    } catch (err) {
      console.error("[language] FAIL:", (err as Error).message);
    }

    // Botón SOS: recargar home y abrir el modal de emergencia
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);
      await page.getByRole("button", { name: /llamar emergencia/i }).first().click({ timeout: 6000 });
      await page.waitForTimeout(800);
      await safeShot(page, "pivot-sos.png", 600);
    } catch (err) {
      console.error("[sos] FAIL:", (err as Error).message);
    }
  });
});

// ---- Captura con geo mockeada: safety badge ----
test.describe("pivot con ubicacion", () => {
  test.use({
    geolocation: { latitude: 11.005, longitude: -74.808 }, // El Prado, Barranquilla
    permissions: ["geolocation"],
  });

  test("home con zona segura", async ({ page }) => {
    await login(page);
    await page.goto("/", { waitUntil: "domcontentloaded" }).catch(() => {});
    // Dar tiempo a que el heartbeat capture la posición y cargue /suggestions/context
    await page.waitForTimeout(5000);
    await safeShot(page, "pivot-safety.png", 1500);
  });
});

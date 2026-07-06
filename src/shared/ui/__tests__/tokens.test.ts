import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Tokens test: verifies that the warm product design tokens are declared in
 * globals.css. We read the CSS source rather than relying on jsdom's
 * getComputedStyle, since jsdom's CSS variable resolution from stylesheet
 * imports is unreliable.
 */
describe("design tokens (warm product system)", () => {
  const globalsPath = resolve(__dirname, "../../../app/globals.css");
  const css = readFileSync(globalsPath, "utf8");

  it("declares warm, mint, and sky surface tokens", () => {
    expect(css).toContain("--surface-warm:");
    expect(css).toContain("--surface-mint:");
    expect(css).toContain("--surface-sky:");
  });

  it("declares --ink under :root", () => {
    expect(css).toContain("--ink:");
    expect(css).toMatch(/--ink:\s*#14212b/i);
  });

  it("declares --shadow-flat using the ink var for sticker cards", () => {
    expect(css).toContain("--shadow-flat:");
    expect(css).toMatch(/--shadow-flat:\s*3px\s+3px\s+0\s+var\(--ink\)/);
  });

  it("exposes warm surfaces and ink as Tailwind utilities via @theme inline", () => {
    expect(css).toMatch(/--color-surface-warm:\s*var\(--surface-warm\)/);
    expect(css).toMatch(/--color-surface-mint:\s*var\(--surface-mint\)/);
    expect(css).toMatch(/--color-surface-sky:\s*var\(--surface-sky\)/);
    expect(css).toMatch(/--color-ink:\s*var\(--ink\)/);
  });

  it("exposes shadow-flat as a Tailwind utility via @theme inline", () => {
    expect(css).toMatch(/--shadow-flat:\s*var\(--shadow-flat\)/);
  });
});

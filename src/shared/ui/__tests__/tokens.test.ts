import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Tokens test: verifies that the new design tokens (cream, ink, shadow-flat)
 * are declared in globals.css. We read the CSS source rather than relying on
 * jsdom's getComputedStyle, since jsdom's CSS variable resolution from
 * stylesheet imports is unreliable.
 */
describe("design tokens (cream + ink)", () => {
  const globalsPath = resolve(__dirname, "../../../app/globals.css");
  const css = readFileSync(globalsPath, "utf8");

  it("declares --cream under :root with the brand value", () => {
    expect(css).toContain("--cream:");
    expect(css).toMatch(/--cream:\s*#FFF4E8/i);
  });

  it("declares --cream-fg under :root", () => {
    expect(css).toContain("--cream-fg:");
    expect(css).toMatch(/--cream-fg:\s*#1a1a1a/i);
  });

  it("declares --ink under :root with the brand value", () => {
    expect(css).toContain("--ink:");
    expect(css).toMatch(/--ink:\s*#1a1a1a/i);
  });

  it("declares --shadow-flat using the accent var for sticker cards", () => {
    expect(css).toContain("--shadow-flat:");
    expect(css).toMatch(/--shadow-flat:\s*4px\s+4px\s+0\s+var\(--accent\)/);
  });

  it("exposes cream and ink as Tailwind utilities via @theme inline", () => {
    expect(css).toMatch(/--color-cream:\s*var\(--cream\)/);
    expect(css).toMatch(/--color-ink:\s*var\(--ink\)/);
  });

  it("exposes shadow-flat as a Tailwind utility via @theme inline", () => {
    expect(css).toMatch(/--shadow-flat:\s*var\(--shadow-flat\)/);
  });
});

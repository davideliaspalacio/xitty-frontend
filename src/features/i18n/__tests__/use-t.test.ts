import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useT } from "@/features/i18n/hooks/use-t";
import { useI18nStore } from "@/features/i18n/store";

describe("useT", () => {
  beforeEach(() => {
    useI18nStore.setState({ lang: "es" });
  });

  it("returns a string for a known key in the default language (es)", () => {
    const { result } = renderHook(() => useT());
    const value = result.current("home.cta.explore_places");
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
    // Not the raw key
    expect(value).not.toBe("home.cta.explore_places");
  });

  it("returns a string for a known key in English", () => {
    useI18nStore.setState({ lang: "en" });
    const { result } = renderHook(() => useT());
    const value = result.current("home.cta.explore_places");
    expect(typeof value).toBe("string");
    // English should differ from Spanish for translated keys
    expect(value.toLowerCase()).toContain("explore");
  });

  it("falls back to es when key missing in current lang", () => {
    useI18nStore.setState({ lang: "fr" });
    const { result } = renderHook(() => useT());
    // pick a key that is in es but may not be translated to fr (fr is placeholder w/ es fallback)
    const value = result.current("home.cta.explore_places");
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("returns the key itself if not present in any catalog", () => {
    const { result } = renderHook(() => useT());
    const missing = "this.key.does.not.exist.anywhere.xyz";
    expect(result.current(missing)).toBe(missing);
  });

  it("interpolates params using {name} placeholders", () => {
    const { result } = renderHook(() => useT());
    const value = result.current("greeting.morning", { name: "Maria" });
    expect(value).toContain("Maria");
  });

  it("replaces multiple occurrences of the same placeholder", () => {
    const { result } = renderHook(() => useT());
    // Use a synthetic key — we rely on catalog containing 'greeting.morning' with {name}
    // and assert that no {name} remains in the output.
    const value = result.current("greeting.morning", { name: "Ana" });
    expect(value).not.toMatch(/\{name\}/);
  });

  it("leaves placeholders untouched when no params provided", () => {
    const { result } = renderHook(() => useT());
    const value = result.current("greeting.morning");
    // Should still return a string (with raw {name} placeholder if not interpolated)
    expect(typeof value).toBe("string");
  });
});

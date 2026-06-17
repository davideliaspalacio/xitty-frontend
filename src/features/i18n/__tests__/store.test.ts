import { describe, it, expect, beforeEach } from "vitest";
import { useI18nStore, I18N_STORAGE_KEY } from "@/features/i18n/store";

describe("i18n store", () => {
  beforeEach(() => {
    // Reset persisted state between tests
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(I18N_STORAGE_KEY);
    }
    // Reset Zustand store to default state
    useI18nStore.setState({ lang: "es" });
  });

  it("defaults to 'es'", () => {
    expect(useI18nStore.getState().lang).toBe("es");
  });

  it("setLang updates the lang value", () => {
    useI18nStore.getState().setLang("en");
    expect(useI18nStore.getState().lang).toBe("en");

    useI18nStore.getState().setLang("fr");
    expect(useI18nStore.getState().lang).toBe("fr");
  });

  it("persists lang to localStorage when changed", () => {
    useI18nStore.getState().setLang("pt");

    const stored = localStorage.getItem(I18N_STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    // Zustand persist wraps state under `state`
    expect(parsed.state.lang).toBe("pt");
  });

  it("accepts all four supported languages", () => {
    const langs = ["es", "en", "fr", "pt"] as const;
    for (const l of langs) {
      useI18nStore.getState().setLang(l);
      expect(useI18nStore.getState().lang).toBe(l);
    }
  });
});

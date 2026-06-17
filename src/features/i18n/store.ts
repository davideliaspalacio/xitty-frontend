"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Lang = "es" | "en" | "fr" | "pt";

export const SUPPORTED_LANGS: readonly Lang[] = ["es", "en", "fr", "pt"];

export const I18N_STORAGE_KEY = "xitty-i18n";

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: "es",
      setLang: (lang) => set({ lang }),
    }),
    {
      name: I18N_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lang: state.lang }),
    },
  ),
);

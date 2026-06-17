"use client";

import { useCallback } from "react";
import { useI18nStore } from "@/features/i18n/store";
import { catalogs, DEFAULT_LANG } from "@/features/i18n/catalog";

/**
 * Replaces `{placeholder}` tokens in the template with the matching value
 * from `params`. Unknown placeholders are left untouched.
 */
function interpolate(template: string, params?: Record<string, string>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(params, key) ? params[key] : match,
  );
}

export type TFunction = (
  key: string,
  params?: Record<string, string>,
) => string;

/**
 * Returns a stable `t(key, params?)` translator function tied to the
 * current language in the i18n store. Falls back to the default language
 * (es) when a key is missing, and returns the key itself if both lookups
 * miss.
 */
export function useT(): TFunction {
  const lang = useI18nStore((s) => s.lang);

  return useCallback(
    (key: string, params?: Record<string, string>) => {
      const current = catalogs[lang] as Record<string, string | undefined>;
      const fallback = catalogs[DEFAULT_LANG] as Record<
        string,
        string | undefined
      >;
      const raw = current[key] ?? fallback[key] ?? key;
      return interpolate(raw, params);
    },
    [lang],
  );
}

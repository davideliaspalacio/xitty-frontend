import type { Lang } from "@/features/i18n/store";
import type { Catalog, CatalogKey } from "@/features/i18n/catalog/es";
import { es } from "@/features/i18n/catalog/es";
import { en } from "@/features/i18n/catalog/en";
import { fr } from "@/features/i18n/catalog/fr";
import { pt } from "@/features/i18n/catalog/pt";

export const catalogs: Record<Lang, Catalog> = {
  es,
  en,
  fr,
  pt,
};

export const DEFAULT_LANG: Lang = "es";

export type { Catalog, CatalogKey };

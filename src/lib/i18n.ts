export const locales = ["en", "ht", "fr", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ht: "Kreyòl Ayisyen",
  fr: "Français",
  es: "Español",
};

/** Short label used in the compact switcher. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  ht: "HT",
  fr: "FR",
  es: "ES",
};

/** BCP 47 tags for html lang and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en",
  ht: "ht",
  fr: "fr",
  es: "es",
};

/**
 * Country to locale routing used at the edge.
 * Haiti and the diaspora hubs get Kreyòl. Francophone Africa, France and the
 * French Caribbean get French. Spain, Latin America and the Dominican Republic
 * get Spanish. Everyone else gets English.
 */
export const countryLocale: Record<string, Locale> = {
  HT: "ht",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  LU: "fr",
  MC: "fr",
  CA: "en",
  SN: "fr",
  CI: "fr",
  ML: "fr",
  BF: "fr",
  NE: "fr",
  TG: "fr",
  BJ: "fr",
  GA: "fr",
  CM: "fr",
  CD: "fr",
  CG: "fr",
  MG: "fr",
  GN: "fr",
  TD: "fr",
  GP: "fr",
  MQ: "fr",
  GF: "fr",
  ES: "es",
  DO: "es",
  MX: "es",
  AR: "es",
  CL: "es",
  CO: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  GT: "es",
  CU: "es",
  BO: "es",
  HN: "es",
  PY: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  UY: "es",
  PR: "es",
};

/** Presentment currency shown alongside giving amounts. */
export const countryCurrency: Record<string, { code: string; symbol: string }> = {
  HT: { code: "USD", symbol: "$" },
  CA: { code: "CAD", symbol: "CA$" },
  FR: { code: "EUR", symbol: "€" },
  BE: { code: "EUR", symbol: "€" },
  ES: { code: "EUR", symbol: "€" },
  GB: { code: "GBP", symbol: "£" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Pick the best locale from an Accept-Language header. */
export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const entries = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of entries) {
    const base = tag.split("-")[0];
    if (base === "ht" || tag.startsWith("ht")) return "ht";
    if (base === "fr") return "fr";
    if (base === "es") return "es";
    if (base === "en") return "en";
  }
  return null;
}

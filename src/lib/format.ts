import type { Locale } from "@/i18n/routing";

const intlLocales: Record<Locale, string> = {
  en: "en-GB",
  kg: "ky-KG",
  ru: "ru-RU",
  fr: "fr-FR"
};

export function intlLocale(locale: Locale): string {
  return intlLocales[locale];
}

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocales[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(amount);
}

/** `isoDate` is a plain `YYYY-MM-DD` string, so it is parsed as UTC on purpose. */
export function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocales[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatRating(rating: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocales[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(rating);
}

import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  kg: "ky_KG",
  ru: "ru_RU",
  fr: "fr_FR"
};

/**
 * `path` is the route below the locale segment, e.g. `/tours/kel-suu-expedition`
 * (empty string for the home page).
 */
export function localeAlternates(locale: Locale, path = "") {
  const languages = routing.locales.reduce<Record<string, string>>(
    (alternates, alternate) => {
      alternates[alternate] = `/${alternate}${path}`;
      return alternates;
    },
    {}
  );

  return { canonical: `/${locale}${path}`, languages };
}

type PageMetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  siteName: string;
  image?: { src: string; alt: string };
};

export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  siteName,
  image
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title,
      description,
      siteName,
      url: `/${locale}${path}`,
      locale: ogLocales[locale],
      alternateLocale: routing.locales
        .filter((alternate) => alternate !== locale)
        .map((alternate) => ogLocales[alternate]),
      type: "website",
      images: image
        ? [{ url: image.src, width: 1200, height: 630, alt: image.alt }]
        : undefined
    }
  };
}

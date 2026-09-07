import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { ogLocales, localeAlternates } from "@/lib/metadata";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap"
});

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL("https://go_kyrgyzstan.travel"),
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: t("siteName"),
      url: `/${locale}`,
      locale: ogLocales[locale],
      alternateLocale: routing.locales
        .filter((alternate) => alternate !== locale)
        .map((alternate) => ogLocales[alternate]),
      type: "website",
      images: [
        {
          url: "/images/hero-yurts.png",
          width: 1200,
          height: 630,
          alt: t("ogAlt")
        }
      ]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const htmlLang = locale === "kg" ? "ky" : locale;

  return (
    <html lang={htmlLang}>
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { getSiteContent } from "@/lib/api";
import type { Locale } from "@/i18n/routing";

import { Footer } from "./Footer";
import { Header } from "./Header";

type PageShellProps = {
  children: ReactNode;
  /** `overlay` is only used by the home page, whose hero sits under the header. */
  variant?: "overlay" | "solid";
};

export async function PageShell({ children, variant = "solid" }: PageShellProps) {
  const locale = (await getLocale()) as Locale;
  const site = await getSiteContent(locale);

  return (
    <>
      <Header contact={site.contact} variant={variant} />
      <main>{children}</main>
      <Footer contact={site.contact} />
    </>
  );
}

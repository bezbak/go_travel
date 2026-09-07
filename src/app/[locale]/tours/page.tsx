import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { ToursExplorer } from "@/components/tours/ToursExplorer";
import { Container } from "@/components/ui/Container";
import { images } from "@/data/images";
import { tours } from "@/data/tours";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

type ToursPageProps = {
  params: Promise<{ locale: string }>;
};

function resolveLocale(requested: string): Locale {
  return hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
}

export async function generateMetadata({
  params
}: ToursPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = resolveLocale(requested);
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/tours",
    title: t("toursPage.meta.title"),
    description: t("toursPage.meta.description"),
    siteName: t("metadata.siteName"),
    image: { src: images.songKol.src, alt: t(images.songKol.altKey) }
  });
}

export default async function ToursPage({ params }: ToursPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell>
      <ToursPageContent />
    </PageShell>
  );
}

function ToursPageContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("navigation.tours") }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={t("toursPage.heroDescription")}
        eyebrow={t("toursPage.heroEyebrow")}
        image={images.songKol}
        imageAlt={t(images.songKol.altKey)}
        title={t("toursPage.heroTitle")}
      />

      <div className="bg-[#faf8f2] py-[46px] 2xl:py-[62px]">
        <Container compact>
          <ToursExplorer tours={tours} />
        </Container>
      </div>
    </>
  );
}

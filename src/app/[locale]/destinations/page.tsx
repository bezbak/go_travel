import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { destinations } from "@/data/destinations";
import { images } from "@/data/images";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

type DestinationsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params
}: DestinationsPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/destinations",
    title: t("destinationsPage.meta.title"),
    description: t("destinationsPage.meta.description"),
    siteName: t("metadata.siteName"),
    image: { src: images.alpineLake.src, alt: t(images.alpineLake.altKey) }
  });
}

export default async function DestinationsPage({ params }: DestinationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell>
      <DestinationsPageContent />
    </PageShell>
  );
}

function DestinationsPageContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("navigation.destinations") }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={t("destinationsPage.heroDescription")}
        eyebrow={t("destinationsPage.heroEyebrow")}
        image={images.alpineLake}
        imageAlt={t(images.alpineLake.altKey)}
        title={t("destinationsPage.heroTitle")}
      />

      <Section className="bg-[#faf8f2]" id="all-destinations">
        <div className="grid gap-[22px] sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { routing } from "@/i18n/routing";
import {
  getDestinations,
  getPhotos,
  type DestinationSummary,
  type PhotoLibrary
} from "@/lib/api";
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
  const [t, photos] = await Promise.all([
    getTranslations({ locale }),
    getPhotos(locale)
  ]);
  const cover = photos.alpineLake;

  return pageMetadata({
    locale,
    path: "/destinations",
    title: t("destinationsPage.meta.title"),
    description: t("destinationsPage.meta.description"),
    siteName: t("metadata.siteName"),
    image: cover ? { src: cover.src, alt: cover.alt } : undefined
  });
}

export default async function DestinationsPage({ params }: DestinationsPageProps) {
  const { locale: requested } = await params;
  setRequestLocale(requested);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [destinations, photos] = await Promise.all([
    getDestinations(locale),
    getPhotos(locale)
  ]);

  return (
    <PageShell>
      <DestinationsPageContent destinations={destinations} photos={photos} />
    </PageShell>
  );
}

function DestinationsPageContent({
  destinations,
  photos
}: {
  destinations: DestinationSummary[];
  photos: PhotoLibrary;
}) {
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
        image={photos.alpineLake ?? null}
        imageAlt={photos.alpineLake?.alt ?? ""}
        title={t("destinationsPage.heroTitle")}
      />

      <Section className="bg-[#faf8f2]" id="all-destinations">
        <div className="grid grid-cols-2 gap-[var(--grid-gap)] xl:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </Section>
    </>
  );
}

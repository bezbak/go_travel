import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { ToursExplorer } from "@/components/tours/ToursExplorer";
import { Container } from "@/components/ui/Container";
import { routing, type Locale } from "@/i18n/routing";
import {
  getDestinations,
  getPhotos,
  getTours,
  type DestinationSummary,
  type PhotoLibrary,
  type TourSummary
} from "@/lib/api";
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
  const [t, photos] = await Promise.all([
    getTranslations({ locale }),
    getPhotos(locale)
  ]);
  const cover = photos.songKol;

  return pageMetadata({
    locale,
    path: "/tours",
    title: t("toursPage.meta.title"),
    description: t("toursPage.meta.description"),
    siteName: t("metadata.siteName"),
    image: cover ? { src: cover.src, alt: cover.alt } : undefined
  });
}

export default async function ToursPage({ params }: ToursPageProps) {
  const { locale: requested } = await params;
  setRequestLocale(requested);
  const locale = resolveLocale(requested);

  const [tours, destinations, photos] = await Promise.all([
    getTours(locale),
    getDestinations(locale),
    getPhotos(locale)
  ]);

  return (
    <PageShell>
      <ToursPageContent destinations={destinations} photos={photos} tours={tours} />
    </PageShell>
  );
}

function ToursPageContent({
  tours,
  destinations,
  photos
}: {
  tours: TourSummary[];
  destinations: DestinationSummary[];
  photos: PhotoLibrary;
}) {
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
        image={photos.songKol ?? null}
        imageAlt={photos.songKol?.alt ?? ""}
        title={t("toursPage.heroTitle")}
      />

      <div className="bg-[#faf8f2] py-[46px] 2xl:py-[62px]">
        <Container compact>
          <ToursExplorer destinations={destinations} tours={tours} />
        </Container>
      </div>
    </>
  );
}

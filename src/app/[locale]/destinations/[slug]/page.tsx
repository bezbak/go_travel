import { CalendarRange, Car, Mountain } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { TourCard } from "@/components/tours/TourCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { Section } from "@/components/ui/Section";
import {
  destinationSlugs,
  getDestination,
  type Destination
} from "@/data/destinations";
import { getToursByDestination } from "@/data/tours";
import { routing } from "@/i18n/routing";
import { rawList } from "@/lib/messages";
import { pageMetadata } from "@/lib/metadata";

type DestinationDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return destinationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: DestinationDetailPageProps): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const destination = getDestination(slug);

  if (!destination) {
    return {};
  }

  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: `/destinations/${destination.slug}`,
    title: t("destinationDetail.meta.title", {
      name: t(`destinations.${destination.slug}.name`)
    }),
    description: t(`destinations.${destination.slug}.summary`),
    siteName: t("metadata.siteName"),
    image: {
      src: destination.heroImage.src,
      alt: t(destination.heroImage.altKey)
    }
  });
}

export default async function DestinationDetailPage({
  params
}: DestinationDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const destination = getDestination(slug);

  if (!destination) {
    notFound();
  }

  return (
    <PageShell>
      <DestinationDetailContent destination={destination} />
    </PageShell>
  );
}

function DestinationDetailContent({
  destination
}: {
  destination: Destination;
}) {
  const t = useTranslations();
  const name = t(`destinations.${destination.slug}.name`);
  const body = rawList<string>(t, `destinations.${destination.slug}.body`);
  const highlights = rawList<string>(
    t,
    `destinations.${destination.slug}.highlights`
  );
  const relatedTours = getToursByDestination(destination.slug);

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("navigation.destinations"), href: "/destinations" },
          { label: name }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={t(`destinations.${destination.slug}.summary`)}
        eyebrow={t("destinationDetail.eyebrow")}
        image={destination.heroImage}
        imageAlt={t(destination.heroImage.altKey)}
        size="lg"
        title={name}
      />

      <section className="border-b border-[#e8e5df] bg-white py-[24px]">
        <Container compact>
          <dl className="grid grid-cols-3 gap-[var(--grid-gap)]">
            <Fact
              icon={<Mountain aria-hidden="true" className="size-[clamp(13px,1.4vw,18px)]" />}
              label={t("common.altitudeLabel")}
              value={t("common.altitude", { value: destination.altitudeM })}
            />
            <Fact
              icon={<Car aria-hidden="true" className="size-[clamp(13px,1.4vw,18px)]" />}
              label={t("destinationDetail.driveLabel")}
              value={
                destination.driveHours === 0
                  ? t("destinationDetail.driveBase")
                  : t("destinationDetail.driveValue", {
                      hours: destination.driveHours
                    })
              }
            />
            <Fact
              icon={<CalendarRange aria-hidden="true" className="size-[clamp(13px,1.4vw,18px)]" />}
              label={t("common.bestSeason")}
              value={t(`destinations.${destination.slug}.bestTime`)}
            />
          </dl>
        </Container>
      </section>

      <Section className="bg-[#faf8f2]" id="destination-intro">
        <div className="grid grid-cols-1 items-start gap-[clamp(18px,2.6vw,34px)] md:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-[14px]">
            {body.map((paragraph, index) => (
              <p
                key={index}
                className="text-[14px] font-medium leading-[1.75] text-[#4f4f4f] 2xl:text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-[18px] border border-[#e7e2d9] bg-white p-[24px]">
            <h2 className="font-display text-[15px] font-black uppercase tracking-[0.02em] text-[#171717]">
              {t("destinationDetail.highlightsTitle")}
            </h2>
            <ul className="mt-[16px] grid gap-[12px]">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full bg-[#6a9d17] font-display text-[10px] font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-[13px] font-medium leading-[1.6] text-[#4f4f4f]">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink className="mt-[22px] w-full" href="/contact" internal size="sm">
              {t("destinationDetail.planCta")}
            </ButtonLink>
          </div>
        </div>

        <div className="mt-[34px]">
          <PhotoGrid images={destination.gallery} />
        </div>
      </Section>

      {relatedTours.length > 0 ? (
        <Section
          className="bg-white"
          description={t("destinationDetail.toursDescription", { name })}
          id="destination-tours"
          title={t("destinationDetail.toursTitle", { name })}
        >
          <div className="grid grid-cols-2 gap-[var(--grid-gap)] xl:grid-cols-3">
            {relatedTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function Fact({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
      <span className="grid size-[clamp(28px,3vw,40px)] shrink-0 place-items-center rounded-full bg-[#eef2e6] text-[#6a9d17]">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[length:var(--fs-3xs)] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
          {label}
        </dt>
        <dd className="mt-0.5 font-display text-[length:var(--fs-3xs)] font-black uppercase leading-tight text-[#171717]">
          {value}
        </dd>
      </div>
    </div>
  );
}

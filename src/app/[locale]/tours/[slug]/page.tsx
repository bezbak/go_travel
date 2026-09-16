import { Check, Clock, Mountain, Star, Users, X } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { hasLocale, useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { RelatedTours } from "@/components/tours/RelatedTours";
import { TourBookingCard } from "@/components/tours/TourBookingCard";
import { TourItinerary } from "@/components/tours/TourItinerary";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  getBuildSlugs,
  getSiteContent,
  getTour,
  getTours,
  type SiteContent,
  type Tour,
  type TourSummary
} from "@/lib/api";
import { formatPrice, formatRating } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

type TourDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getBuildSlugs("tours");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: TourDetailPageProps): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const tour = await getTour(locale, slug);

  if (!tour) {
    return {};
  }

  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: `/tours/${tour.slug}`,
    title: t("tourDetail.meta.title", { name: tour.name }),
    description: tour.summary,
    siteName: t("metadata.siteName"),
    image: tour.heroImage
      ? { src: tour.heroImage.src, alt: tour.heroImage.alt }
      : undefined
  });
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale: requested, slug } = await params;
  setRequestLocale(requested);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [tour, allTours, site] = await Promise.all([
    getTour(locale, slug),
    getTours(locale),
    getSiteContent(locale)
  ]);

  if (!tour) {
    notFound();
  }

  const regionSlugs = new Set(tour.destinations.map((region) => region.slug));
  const related = allTours
    .filter(
      (item) =>
        item.slug !== tour.slug &&
        item.destinations.some((region) => regionSlugs.has(region.slug))
    )
    .slice(0, 3);

  return (
    <PageShell>
      <TourDetailContent contact={site.contact} tour={tour} tours={allTours} />
      <RelatedTours tours={related} />
    </PageShell>
  );
}

function TourDetailContent({
  tour,
  tours,
  contact
}: {
  tour: Tour;
  tours: TourSummary[];
  contact: SiteContent["contact"];
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const name = tour.name;
  const days = tour.days;
  const { overview, highlights, included, excluded, notes } = tour;

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("navigation.tours"), href: "/tours" },
          { label: name }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={tour.tagline}
        eyebrow={tour.destinations[0]?.name}
        image={tour.heroImage}
        imageAlt={tour.heroImage?.alt ?? ""}
        size="lg"
        title={name}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone="green">{t("common.days", { count: days })}</Badge>
          <Badge tone="dark">{t(`common.style.${tour.style}`)}</Badge>
          <Badge tone="dark">
            {t(`common.difficultyLevel.${tour.difficulty}`)}
          </Badge>
          <Badge tone="dark">
            {t("common.maxPeople", { count: tour.groupSizeMax })}
          </Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-[12px] py-[5px] font-display text-[11px] font-black uppercase leading-none text-[#171717]">
            <Star aria-hidden="true" className="size-[13px] fill-[#f5a524] text-[#f5a524]" />
            {formatRating(tour.rating, locale)}
            <span className="font-semibold text-[#7a7a7a]">
              ({tour.reviewCount})
            </span>
          </span>
        </div>
      </PageHero>

      <section className="border-b border-[#e8e5df] bg-white py-[24px]">
        <Container compact>
          <dl className="grid grid-cols-4 gap-[var(--grid-gap)]">
            <Fact
              icon={<Clock aria-hidden="true" className="size-[clamp(13px,1.4vw,18px)]" />}
              label={t("common.duration")}
              value={t("common.daysNights", { days, nights: days - 1 })}
            />
            <Fact
              icon={<Users aria-hidden="true" className="size-[clamp(13px,1.4vw,18px)]" />}
              label={t("common.groupSize")}
              value={t("common.maxPeople", { count: tour.groupSizeMax })}
            />
            <Fact
              icon={<Mountain aria-hidden="true" className="size-[clamp(13px,1.4vw,18px)]" />}
              label={t("common.difficulty")}
              value={t(`common.difficultyLevel.${tour.difficulty}`)}
            />
            <Fact
              icon={<Star aria-hidden="true" className="size-[clamp(13px,1.4vw,18px)]" />}
              label={t("common.bestSeason")}
              value={tour.seasons
                .map((season) => t(`common.seasons.${season}`))
                .join(", ")}
            />
          </dl>
        </Container>
      </section>

      <div className="bg-[#faf8f2] py-[48px] 2xl:py-[64px]">
        <Container compact className="grid grid-cols-1 items-start gap-[clamp(18px,2.6vw,48px)] lg:grid-cols-[1fr_minmax(280px,390px)]">
          <div className="min-w-0">
            <ContentBlock title={t("tourDetail.overviewTitle")}>
              <div className="grid gap-[14px]">
                {overview.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[14px] font-medium leading-[1.75] text-[#4f4f4f] 2xl:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {highlights.length > 0 ? (
                <ul className="mt-[22px] grid grid-cols-2 gap-[10px]">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid size-[20px] shrink-0 place-items-center rounded-full bg-[#6a9d17] text-white">
                        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-[13px] font-semibold leading-[1.5] text-[#2f2f2f]">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </ContentBlock>

            <ContentBlock
              description={t("tourDetail.itineraryDescription")}
              title={t("tourDetail.itineraryTitle")}
            >
              <TourItinerary tour={tour} />
            </ContentBlock>

            <ContentBlock title={t("tourDetail.inclusionsTitle")}>
              <div className="grid grid-cols-2 gap-[var(--grid-gap)]">
                <InclusionList
                  items={included}
                  title={t("tourDetail.includedTitle")}
                  tone="included"
                />
                <InclusionList
                  items={excluded}
                  title={t("tourDetail.excludedTitle")}
                  tone="excluded"
                />
              </div>
            </ContentBlock>

            {notes.length > 0 ? (
              <ContentBlock title={t("tourDetail.goodToKnowTitle")}>
                <div className="grid grid-cols-2 gap-[var(--grid-gap)]">
                  {notes.map((note, index) => (
                    <div
                      key={index}
                      className="rounded-[14px] border border-[#e7e2d9] bg-white p-[18px]"
                    >
                      <h3 className="font-display text-[13px] font-black uppercase tracking-[0.02em] text-[#171717]">
                        {note.title}
                      </h3>
                      <p className="mt-2 text-[13px] font-medium leading-[1.6] text-[#5f5f5f]">
                        {note.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ContentBlock>
            ) : null}

            <ContentBlock title={t("tourDetail.galleryTitle")}>
              <PhotoGrid images={tour.gallery} />
            </ContentBlock>

            <ContentBlock
              description={t("tourDetail.inquiryDescription")}
              id="inquiry"
              title={t("tourDetail.inquiryTitle")}
            >
              <InquiryForm
                defaultTour={tour.slug}
                tourOptions={tours.map((option) => ({
                  value: option.slug,
                  label: option.name
                }))}
              />
            </ContentBlock>
          </div>

          <aside className="xl:sticky xl:top-[104px]">
            {contact ? <TourBookingCard contact={contact} tour={tour} /> : null}

            <div className="mt-[18px] rounded-[18px] border border-[#e7e2d9] bg-white p-[22px]">
              <h3 className="font-display text-[12px] font-black uppercase tracking-[0.04em] text-[#171717]">
                {t("tourDetail.regionsTitle")}
              </h3>
              <ul className="mt-[12px] grid gap-2">
                {tour.destinations.map((region) => (
                  <li key={region.slug}>
                    <Link
                      className="flex items-center justify-between gap-3 rounded-[10px] border border-[#eeebe3] bg-[#faf8f2] px-[13px] py-[10px] text-[13px] font-bold text-[#171717] transition duration-200 hover:border-[#c9dda3] hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17]"
                      href={`/destinations/${region.slug}`}
                    >
                      {region.name}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-[14px] text-[12px] font-medium leading-[1.6] text-[#7a7a7a]">
                {t("tourDetail.priceNote", {
                  price: formatPrice(tour.priceEur, locale)
                })}
              </p>
            </div>
          </aside>
        </Container>
      </div>
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

function ContentBlock({
  id,
  title,
  description,
  children
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section
      aria-labelledby={headingId}
      className="mb-[36px] scroll-mt-[110px] last:mb-0 2xl:mb-[48px]"
      id={id}
    >
      <h2
        className="font-display text-[24px] font-black uppercase leading-[1.1] tracking-[0] text-[#171717] 2xl:text-[28px]"
        id={headingId}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-[8px] max-w-[640px] text-[13px] font-medium leading-[1.65] text-[#6f6f6f]">
          {description}
        </p>
      ) : null}
      <div className="mt-[20px]">{children}</div>
    </section>
  );
}

function InclusionList({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "included" | "excluded";
}) {
  const included = tone === "included";

  return (
    <div className="rounded-[14px] border border-[#e7e2d9] bg-white p-[20px]">
      <h3 className="font-display text-[13px] font-black uppercase tracking-[0.02em] text-[#171717]">
        {title}
      </h3>
      <ul className="mt-[14px] grid gap-[10px]">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <span
              className={
                included
                  ? "mt-0.5 grid size-[19px] shrink-0 place-items-center rounded-full bg-[#eef2e6] text-[#6a9d17]"
                  : "mt-0.5 grid size-[19px] shrink-0 place-items-center rounded-full bg-[#f6e9e6] text-[#c0392b]"
              }
            >
              {included ? (
                <Check aria-hidden="true" className="size-3" strokeWidth={3} />
              ) : (
                <X aria-hidden="true" className="size-3" strokeWidth={3} />
              )}
            </span>
            <span className="text-[13px] font-medium leading-[1.55] text-[#4f4f4f]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

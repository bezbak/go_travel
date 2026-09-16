import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { DestinationsPreview } from "@/components/home/DestinationsPreview";
import { FeaturedTours } from "@/components/home/FeaturedTours";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { Testimonials } from "@/components/home/Testimonials";
import { TourProgram } from "@/components/home/TourProgram";
import { WhyTravelWithUs } from "@/components/home/WhyTravelWithUs";
import { PageShell } from "@/components/layout/PageShell";
import { routing } from "@/i18n/routing";
import {
  getDestinations,
  getFeaturedTours,
  getHomeTour,
  getSiteContent,
  getTours
} from "@/lib/api";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: requested } = await params;
  setRequestLocale(requested);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [site, featured, destinations, homeTour, allTours] = await Promise.all([
    getSiteContent(locale),
    getFeaturedTours(locale),
    getDestinations(locale),
    getHomeTour(locale),
    getTours(locale)
  ]);

  // Testimonials name the tour they belong to, which the API sends as a slug.
  const tourNames = Object.fromEntries(allTours.map((tour) => [tour.slug, tour.name]));

  return (
    <PageShell variant="overlay">
      <Hero
        featuredTourSlug={homeTour?.slug ?? null}
        image={site.heroImage}
      />
      <BenefitsStrip />
      <FeaturedTours tours={featured.slice(0, 3)} />
      {homeTour ? <TourProgram tour={homeTour} /> : null}
      <WhyTravelWithUs
        backdropImage={site.heroImage}
        featureImage={site.featureImage}
      />
      <DestinationsPreview destinations={destinations} />
      <Testimonials testimonials={site.testimonials} tourNames={tourNames} />
      <Gallery images={site.gallery} />
      <Newsletter />
    </PageShell>
  );
}

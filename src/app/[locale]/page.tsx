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

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell variant="overlay">
      <Hero />
      <BenefitsStrip />
      <FeaturedTours />
      <TourProgram />
      <WhyTravelWithUs />
      <DestinationsPreview />
      <Testimonials />
      <Gallery />
      <Newsletter />
    </PageShell>
  );
}

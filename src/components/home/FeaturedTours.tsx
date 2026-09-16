import { useTranslations } from "next-intl";

import { TourCard } from "@/components/tours/TourCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { TourSummary } from "@/lib/api";

type FeaturedToursProps = {
  tours: TourSummary[];
};

export function FeaturedTours({ tours }: FeaturedToursProps) {
  const t = useTranslations("featuredTours");

  return (
    <Section
      action={
        <ButtonLink href="/tours" internal size="sm" variant="dark">
          {t("cta")}
        </ButtonLink>
      }
      align="left"
      className="bg-[#faf8f2]"
      description={t("description")}
      eyebrow={t("eyebrow")}
      id="featured-tours"
      title={
        <>
          {t("titleDark")} <span className="text-[#669a17]">{t("titleGreen")}</span>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-[var(--grid-gap)] xl:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
    </Section>
  );
}

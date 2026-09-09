import { useTranslations } from "next-intl";

import { Section } from "@/components/ui/Section";
import { getRelatedTours, type Tour } from "@/data/tours";

import { TourCard } from "./TourCard";

type RelatedToursProps = {
  tour: Tour;
};

export function RelatedTours({ tour }: RelatedToursProps) {
  const t = useTranslations("tourDetail");
  const related = getRelatedTours(tour, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <Section
      className="bg-[#faf8f2]"
      description={t("relatedDescription")}
      id="related-tours"
      title={t("relatedTitle")}
    >
      <div className="grid grid-cols-2 gap-[var(--grid-gap)] xl:grid-cols-3">
        {related.map((item) => (
          <TourCard key={item.slug} tour={item} />
        ))}
      </div>
    </Section>
  );
}

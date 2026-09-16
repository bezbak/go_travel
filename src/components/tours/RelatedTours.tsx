import { useTranslations } from "next-intl";

import { Section } from "@/components/ui/Section";
import type { TourSummary } from "@/lib/api";

import { TourCard } from "./TourCard";

type RelatedToursProps = {
  tours: TourSummary[];
};

export function RelatedTours({ tours }: RelatedToursProps) {
  const t = useTranslations("tourDetail");
  const related = tours;

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

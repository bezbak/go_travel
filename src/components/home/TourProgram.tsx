import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Tour } from "@/lib/api";

import { TourDayCard } from "./TourDayCard";

type TourProgramProps = {
  tour: Tour;
};

export function TourProgram({ tour }: TourProgramProps) {
  const t = useTranslations();
  const days = tour.itinerary;

  return (
    <section
      aria-labelledby="tour-program-title"
      className="bg-white py-[var(--section-py)]"
      id="tours"
    >
      <Container compact>
        <div className="text-center">
          <h2
            className="font-display text-[length:var(--h2-lg)] font-black uppercase leading-none tracking-[0] text-[#171717]"
            id="tour-program-title"
          >
            {t("tourProgram.titleDark")}{" "}
            <span className="text-[#669a17]">{t("tourProgram.titleGreen")}</span>
          </h2>
          <p className="mt-[12px] text-[length:var(--fs-xs)] font-medium text-[#71717a]">
            {t("tourProgram.subtitle")}
          </p>
        </div>

        <div className="mt-[clamp(20px,2.6vw,38px)]">
          <div className="grid grid-cols-3 gap-[var(--grid-gap)] xl:grid-cols-6">
            {days.map((day) => (
              <TourDayCard
                key={day.number}
                dayNumber={day.number}
                description={day.description}
                image={day.image}
                title={day.title}
              />
            ))}
          </div>
        </div>

        <div className="mt-[clamp(22px,2.6vw,38px)] flex flex-wrap justify-center gap-[clamp(8px,1vw,14px)]">
          <ButtonLink href={`/tours/${tour.slug}`} internal size="md">
            {t("tourProgram.cta")}
          </ButtonLink>
          <ButtonLink href="/tours" internal size="md" variant="outline">
            {t("tourProgram.secondaryCta")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

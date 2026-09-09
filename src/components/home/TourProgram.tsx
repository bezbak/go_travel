import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { homeTour } from "@/data/tours";
import { rawList } from "@/lib/messages";

import { TourDayCard } from "./TourDayCard";

type ItineraryDay = {
  title: string;
  description: string;
};

export function TourProgram() {
  const t = useTranslations();
  const days = rawList<ItineraryDay>(t, `tours.${homeTour.slug}.days`);

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
            {days.map((day, index) => (
              <TourDayCard
                key={`${homeTour.slug}-${index}`}
                dayNumber={index + 1}
                description={day.description}
                image={
                  homeTour.dayImages[index] ??
                  homeTour.dayImages[homeTour.dayImages.length - 1]
                }
                title={day.title}
              />
            ))}
          </div>
        </div>

        <div className="mt-[clamp(22px,2.6vw,38px)] flex flex-wrap justify-center gap-[clamp(8px,1vw,14px)]">
          <ButtonLink href={`/tours/${homeTour.slug}`} internal size="md">
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

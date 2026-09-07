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
      className="bg-white py-[62px] 2xl:py-[66px]"
      id="tours"
    >
      <Container compact>
        <div className="text-center">
          <h2
            className="font-display text-[32px] font-black uppercase leading-none tracking-[0] text-[#171717] sm:text-[42px] 2xl:text-[48px]"
            id="tour-program-title"
          >
            {t("tourProgram.titleDark")}{" "}
            <span className="text-[#669a17]">{t("tourProgram.titleGreen")}</span>
          </h2>
          <p className="mt-[12px] text-[13px] font-medium text-[#71717a] 2xl:text-[14px]">
            {t("tourProgram.subtitle")}
          </p>
        </div>

        <div className="no-scrollbar -mx-5 mt-[34px] overflow-x-auto px-5 sm:-mx-8 sm:px-8 xl:mx-0 xl:overflow-visible xl:px-0 2xl:mt-[38px]">
          <div className="grid grid-flow-col auto-cols-[244px] gap-[18px] xl:grid-flow-row xl:auto-cols-auto xl:grid-cols-6 xl:gap-[14px] 2xl:gap-[20px]">
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

        <div className="mt-[38px] flex flex-wrap justify-center gap-[14px]">
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

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import type { Tour } from "@/lib/api";

type TourItineraryProps = {
  tour: Tour;
};

export function TourItinerary({ tour }: TourItineraryProps) {
  const t = useTranslations();

  const items: AccordionItem[] = tour.itinerary.map((day, index) => {
    const image = day.image;

    return {
      id: `day-${index + 1}`,
      header: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="rounded-full bg-[#6a9d17] px-[11px] py-[4px] font-display text-[10px] font-black uppercase leading-none tracking-[0.04em] text-white">
            {t("common.dayNumber", { number: day.number })}
          </span>
          <span className="font-display text-[15px] font-black uppercase leading-tight tracking-[0] text-[#171717] sm:text-[17px]">
            {day.title}
          </span>
        </span>
      ),
      content: (
        <div className="grid grid-cols-[minmax(96px,200px)_1fr] items-start gap-[var(--grid-gap)]">
          <div className="relative h-[140px] overflow-hidden rounded-[12px] bg-[#ece8de] sm:h-[132px]">
            <Image
              fill
              alt={image?.alt ?? ""}
              className="object-cover"
              sizes="(min-width: 640px) 200px, 90vw"
              src={image?.src ?? ""}
            />
          </div>
          <p className="text-[13px] font-medium leading-[1.7] text-[#4f4f4f] 2xl:text-[14px]">
            {day.description}
          </p>
        </div>
      )
    };
  });

  if (items.length === 0) {
    return null;
  }

  return <Accordion items={items} />;
}

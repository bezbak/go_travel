import Image from "next/image";
import { useTranslations } from "next-intl";

import type { ApiImage } from "@/lib/api";

type TourDayCardProps = {
  dayNumber: number;
  title: string;
  description: string;
  image: ApiImage | null;
};

export function TourDayCard({
  dayNumber,
  title,
  description,
  image
}: TourDayCardProps) {
  const t = useTranslations();

  return (
    <article className="group flex h-full flex-col rounded-[18px] border border-[#e7e2d9] bg-white p-[clamp(6px,0.8vw,12px)] shadow-[0_8px_28px_rgba(23,23,23,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(23,23,23,0.09)]">
      <div className="grid justify-items-center">
        <span className="rounded-full bg-[#6a9d17] px-[clamp(7px,1vw,14px)] py-[3px] font-display text-[length:var(--fs-3xs)] font-black uppercase leading-none tracking-[0] text-white">
          {t("common.dayNumber", { number: dayNumber })}
        </span>
        <h3 className="mt-[10px] line-clamp-2 max-w-full text-center font-display text-[length:var(--fs-lg)] font-black uppercase leading-[1.05] tracking-[0] text-[#171717]">
          {title}
        </h3>
      </div>

      <div className="relative mt-[7px] h-[clamp(78px,13vw,248px)] overflow-hidden rounded-[12px] bg-[#ece8de]">
        <Image
          fill
          alt={image?.alt ?? ""}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1280px) 16vw, 33vw"
          src={image?.src ?? ""}
        />
      </div>

      <p className="mt-[clamp(8px,1.2vw,17px)] line-clamp-5 px-[3px] text-[length:var(--fs-2xs)] font-medium leading-[1.55] text-[#4f4f4f]">
        {description}
      </p>
    </article>
  );
}

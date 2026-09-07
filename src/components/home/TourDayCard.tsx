import Image from "next/image";
import { useTranslations } from "next-intl";

import type { ImageAsset } from "@/data/images";

type TourDayCardProps = {
  dayNumber: number;
  title: string;
  description: string;
  image: ImageAsset;
};

export function TourDayCard({
  dayNumber,
  title,
  description,
  image
}: TourDayCardProps) {
  const t = useTranslations();

  return (
    <article className="group flex h-[390px] min-w-[244px] flex-col rounded-[18px] border border-[#e7e2d9] bg-white p-[11px] shadow-[0_8px_28px_rgba(23,23,23,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(23,23,23,0.09)] xl:h-[372px] xl:min-w-0 2xl:h-[458px] 2xl:p-[12px]">
      <div className="grid justify-items-center">
        <span className="rounded-full bg-[#6a9d17] px-[14px] py-[3px] font-display text-[10px] font-black uppercase leading-none tracking-[0] text-white 2xl:text-[12px]">
          {t("common.dayNumber", { number: dayNumber })}
        </span>
        <h3 className="mt-[10px] line-clamp-2 h-[42px] max-w-full text-center font-display text-[17px] font-black uppercase leading-[1.05] tracking-[0] text-[#171717] 2xl:text-[22px]">
          {title}
        </h3>
      </div>

      <div className="relative mt-[7px] h-[176px] overflow-hidden rounded-[12px] bg-[#ece8de] 2xl:h-[248px]">
        <Image
          fill
          alt={t(image.altKey)}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1536px) 280px, (min-width: 1280px) 170px, 244px"
          src={image.src}
        />
      </div>

      <p className="mt-[14px] line-clamp-5 px-[3px] text-[12px] font-medium leading-[1.55] text-[#4f4f4f] 2xl:mt-[17px] 2xl:text-[14px]">
        {description}
      </p>
    </article>
  );
}

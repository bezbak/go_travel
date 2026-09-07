import { ArrowUpRight, Mountain } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Destination } from "@/data/destinations";
import { getToursByDestination } from "@/data/tours";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type DestinationCardProps = {
  destination: Destination;
  className?: string;
};

export function DestinationCard({ destination, className }: DestinationCardProps) {
  const t = useTranslations();
  const tourCount = getToursByDestination(destination.slug).length;

  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[18px] bg-[#1d1d1d] p-[22px] 2xl:min-h-[340px]",
        className
      )}
    >
      <Image
        fill
        alt={t(destination.cardImage.altKey)}
        className="-z-10 object-cover transition duration-500 group-hover:scale-[1.06]"
        sizes="(min-width: 1280px) 400px, (min-width: 640px) 46vw, 90vw"
        src={destination.cardImage.src}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.1)_0%,rgba(10,10,10,0.35)_52%,rgba(10,10,10,0.86)_100%)]" />

      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.06em] text-white/75">
        <Mountain aria-hidden="true" className="size-[14px] text-[#bede82]" />
        {t("common.altitude", { value: destination.altitudeM })}
      </div>

      <h3 className="mt-[8px] font-display text-[22px] font-black uppercase leading-[1.05] tracking-[0] text-white 2xl:text-[25px]">
        <Link
          className="transition duration-200 after:absolute after:inset-0 after:content-[''] hover:text-[#bede82] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bede82]"
          href={`/destinations/${destination.slug}`}
        >
          {t(`destinations.${destination.slug}.name`)}
        </Link>
      </h3>

      <p className="mt-[8px] line-clamp-2 text-[13px] font-medium leading-[1.55] text-white/80">
        {t(`destinations.${destination.slug}.summary`)}
      </p>

      <div className="mt-[14px] flex items-center justify-between gap-3 border-t border-white/15 pt-[13px]">
        <span className="text-[12px] font-bold text-white/85">
          {t("common.tourCount", { count: tourCount })}
        </span>
        <span
          aria-hidden="true"
          className="grid size-[32px] place-items-center rounded-full bg-white/90 text-[#171717] transition duration-200 group-hover:bg-[#6a9d17] group-hover:text-white"
        >
          <ArrowUpRight className="size-[16px]" strokeWidth={2.6} />
        </span>
      </div>
    </article>
  );
}

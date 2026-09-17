import { ArrowUpRight, Mountain } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { DestinationSummary } from "@/lib/api";
import { cn } from "@/lib/utils";

type DestinationCardProps = {
  destination: DestinationSummary;
  className?: string;
};

export function DestinationCard({ destination, className }: DestinationCardProps) {
  const t = useTranslations();

  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[clamp(158px,21vw,340px)] flex-col justify-end overflow-hidden rounded-[18px] bg-[#1d1d1d] p-[clamp(11px,1.5vw,22px)] shadow-[0_0_50px_-6px_rgba(245,165,36,0.4)] transition duration-300 hover:shadow-[0_0_65px_-4px_rgba(245,165,36,0.55)]",
        className
      )}
    >
      <Image
        fill
        alt={destination.cardImage?.alt ?? ""}
        className="-z-10 object-cover transition duration-500 group-hover:scale-[1.06]"
        sizes="(min-width: 1280px) 33vw, 50vw"
        src={destination.cardImage?.src ?? ""}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.1)_0%,rgba(10,10,10,0.35)_52%,rgba(10,10,10,0.86)_100%)]" />

      <div className="flex items-center gap-2 text-[length:var(--fs-3xs)] font-bold uppercase tracking-[0.06em] text-white/75">
        <Mountain aria-hidden="true" className="size-[14px] text-[#bede82]" />
        {t("common.altitude", { value: destination.altitudeM })}
      </div>

      <h3 className="mt-[8px] font-display text-[length:var(--fs-2xl)] font-black uppercase leading-[1.05] tracking-[0] text-white">
        <Link
          className="transition duration-200 after:absolute after:inset-0 after:content-[''] hover:text-[#bede82] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bede82]"
          href={`/destinations/${destination.slug}`}
        >
          {destination.name}
        </Link>
      </h3>

      <p className="mt-[8px] line-clamp-2 text-[length:var(--fs-2xs)] font-medium leading-[1.55] text-white/80">
        {destination.summary}
      </p>

      <div className="mt-[clamp(9px,1.2vw,14px)] flex items-center justify-between gap-2 border-t border-white/15 pt-[clamp(8px,1vw,13px)]">
        <span className="text-[length:var(--fs-3xs)] font-bold text-white/85">
          {t("common.tourCount", { count: destination.tourCount })}
        </span>
        <span
          aria-hidden="true"
          className="grid size-[clamp(22px,2.2vw,32px)] shrink-0 place-items-center rounded-full bg-white/90 text-[#171717] transition duration-200 group-hover:bg-[#6a9d17] group-hover:text-white"
        >
          <ArrowUpRight className="size-[16px]" strokeWidth={2.6} />
        </span>
      </div>
    </article>
  );
}

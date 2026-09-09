import { Clock, MapPin, Star, Users } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/Badge";
import { tourDuration, type Tour } from "@/data/tours";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatPrice, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";

type TourCardProps = {
  tour: Tour;
  className?: string;
  /** Grid cards fill their column; rail cards keep a fixed width for scrolling. */
  layout?: "grid" | "rail";
};

export function TourCard({ tour, className, layout = "grid" }: TourCardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const days = tourDuration(tour);
  const region = tour.destinations[0];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[18px] border border-[#e7e2d9] bg-white shadow-[0_8px_28px_rgba(23,23,23,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(23,23,23,0.1)]",
        layout === "rail" && "min-w-[290px]",
        className
      )}
    >
      <div className="relative h-[clamp(104px,14.5vw,236px)] shrink-0 overflow-hidden bg-[#e7e2d9]">
        <Image
          fill
          alt={t(tour.cardImage.altKey)}
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
          sizes="(min-width: 1280px) 33vw, 50vw"
          src={tour.cardImage.src}
        />
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-1.5 p-[clamp(7px,1vw,14px)]">
          <Badge tone="green">{t(`common.style.${tour.style}`)}</Badge>
          {tour.oldPriceEur ? (
            <Badge tone="orange">{t("common.deal")}</Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-[clamp(10px,1.5vw,24px)]">
        <div className="flex flex-wrap items-center gap-x-2 text-[length:var(--fs-3xs)] font-semibold text-[#7a7a7a]">
          <MapPin aria-hidden="true" className="size-[14px] text-[#6a9d17]" />
          <span>{t(`destinations.${region}.name`)}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-[#171717]">
            <Star
              aria-hidden="true"
              className="size-[13px] fill-[#f5a524] text-[#f5a524]"
            />
            {formatRating(tour.rating, locale)}
            <span className="font-medium text-[#7a7a7a]">({tour.reviewCount})</span>
          </span>
        </div>

        <h3 className="mt-[10px] font-display text-[length:var(--fs-xl)] font-black uppercase leading-[1.1] tracking-[0] text-[#171717]">
          <Link
            className="transition duration-200 after:absolute after:inset-0 after:content-[''] hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a9d17]"
            href={`/tours/${tour.slug}`}
          >
            {t(`tours.${tour.slug}.name`)}
          </Link>
        </h3>

        <p className="mt-[10px] text-[length:var(--fs-xs)] font-medium leading-[1.6] text-[#5f5f5f]">
          {t(`tours.${tour.slug}.summary`)}
        </p>

        <dl className="mt-[16px] flex flex-wrap items-center gap-x-[clamp(8px,1.2vw,18px)] gap-y-2 text-[length:var(--fs-3xs)] font-semibold text-[#4f4f4f]">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">{t("common.duration")}</dt>
            <Clock aria-hidden="true" className="size-[14px] text-[#6a9d17]" />
            <dd>{t("common.days", { count: days })}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">{t("common.groupSize")}</dt>
            <Users aria-hidden="true" className="size-[14px] text-[#6a9d17]" />
            <dd>{t("common.maxPeople", { count: tour.groupSizeMax })}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">{t("common.difficulty")}</dt>
            <dd>{t(`common.difficultyLevel.${tour.difficulty}`)}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-t border-[#eeebe3] pt-[clamp(10px,1.2vw,18px)]">
          <div>
            <p className="text-[length:var(--fs-3xs)] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
              {t("common.from")}
            </p>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[length:var(--fs-2xl)] font-black leading-none text-[#171717]">
                {formatPrice(tour.priceEur, locale)}
              </span>
              {tour.oldPriceEur ? (
                <span className="text-[length:var(--fs-2xs)] font-semibold text-[#a0a0a0] line-through">
                  {formatPrice(tour.oldPriceEur, locale)}
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 text-[length:var(--fs-3xs)] font-medium text-[#8a8a8a]">
              {t("common.perPerson")}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="font-display text-[length:var(--fs-3xs)] font-extrabold uppercase text-[#669a17]"
          >
            {t("common.viewTour")}
          </span>
        </div>
      </div>
    </article>
  );
}

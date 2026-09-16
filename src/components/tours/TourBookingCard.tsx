import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import type { SiteContent, Tour } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

type TourBookingCardProps = {
  tour: Tour;
  contact: NonNullable<SiteContent["contact"]>;
};

export function TourBookingCard({ tour, contact }: TourBookingCardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <div className="rounded-[18px] border border-[#e7e2d9] bg-white p-[22px] shadow-[0_16px_44px_rgba(23,23,23,0.07)] 2xl:p-[26px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
        {t("common.from")}
      </p>
      <p className="mt-1 flex items-baseline gap-2.5">
        <span className="font-display text-[34px] font-black leading-none text-[#171717]">
          {formatPrice(tour.priceEur, locale)}
        </span>
        {tour.oldPriceEur ? (
          <span className="text-[15px] font-semibold text-[#a0a0a0] line-through">
            {formatPrice(tour.oldPriceEur, locale)}
          </span>
        ) : null}
      </p>
      <p className="mt-1 text-[12px] font-medium text-[#7a7a7a]">
        {t("common.perPerson")} · {t("common.days", { count: tour.days })}
      </p>

      <div className="mt-[20px] border-t border-[#eeebe3] pt-[18px]">
        <h3 className="flex items-center gap-2 font-display text-[12px] font-black uppercase tracking-[0.04em] text-[#171717]">
          <CalendarDays aria-hidden="true" className="size-[15px] text-[#6a9d17]" />
          {t("tourDetail.departuresTitle")}
        </h3>

        <ul className="mt-[14px] grid gap-[10px]">
          {tour.departures.map((departure) => (
            <li
              key={departure.date}
              className="flex items-center justify-between gap-3 rounded-[10px] border border-[#eeebe3] bg-[#faf8f2] px-[13px] py-[11px]"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#171717]">
                  {formatDate(departure.date, locale)}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-[#7a7a7a]">
                  {departure.seatsLeft <= 4
                    ? t("tourDetail.seatsLeft", { count: departure.seatsLeft })
                    : t("tourDetail.available")}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-[15px] font-black text-[#171717]">
                  {formatPrice(departure.priceEur, locale)}
                </p>
                {departure.seatsLeft <= 4 ? (
                  <Badge className="mt-1" tone="orange">
                    {t("tourDetail.almostFull")}
                  </Badge>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[20px] grid gap-[10px]">
        <ButtonLink className="w-full" href="#inquiry" size="md">
          {t("tourDetail.requestBooking")}
        </ButtonLink>
        <ButtonLink
          className="w-full"
          href={contact.whatsappHref}
          rel="noreferrer noopener"
          size="md"
          target="_blank"
          variant="dark"
        >
          <MessageCircle aria-hidden="true" className="size-[16px]" />
          {t("tourDetail.askOnWhatsapp")}
        </ButtonLink>
      </div>

      <a
        className="mt-[18px] flex items-center justify-center gap-2 text-[13px] font-bold text-[#4f4f4f] transition duration-200 hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a9d17]"
        href={contact.phoneHref}
      >
        <Phone aria-hidden="true" className="size-[14px] text-[#6a9d17]" />
        {contact.phone}
      </a>
    </div>
  );
}

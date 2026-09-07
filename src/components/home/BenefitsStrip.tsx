import {
  BadgeCheck,
  CalendarDays,
  Home,
  UserRoundCheck
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/Container";

const icons = [CalendarDays, UserRoundCheck, Home, BadgeCheck] as const;

export function BenefitsStrip() {
  const t = useTranslations();

  return (
    <section className="border-y border-[#ece8de] bg-white/92">
      <Container compact className="py-0">
        <div className="grid min-h-[118px] grid-cols-2 xl:grid-cols-4">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="relative flex items-center gap-[10px] border-b border-[#ece8de] px-3 py-4 odd:border-r odd:border-r-[#ece8de] [&:nth-child(n+3)]:border-b-0 sm:gap-[16px] sm:px-6 xl:border-b-0 xl:border-r-0 xl:px-[42px]"
            >
              {index > 0 ? (
                <span className="absolute left-0 top-1/2 hidden h-[56px] w-px -translate-y-1/2 bg-[#dedbd3] xl:block" />
              ) : null}
              <span className="grid size-[42px] shrink-0 place-items-center rounded-full bg-[#6a9d17] text-white shadow-[0_10px_24px_rgba(106,157,23,0.2)] sm:size-[54px]">
                <Icon aria-hidden="true" className="size-[20px] sm:size-[25px]" strokeWidth={2.2} />
              </span>
              <span>
                <span className="block font-display text-[10px] font-black uppercase leading-tight tracking-[0] text-[#171717] sm:text-[13px]">
                  {t(`benefits.items.${index}.title`)}
                </span>
                <span className="mt-1 block text-[10px] font-medium leading-snug text-[#5d5d5d] sm:text-[12px]">
                  {t(`benefits.items.${index}.description`)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

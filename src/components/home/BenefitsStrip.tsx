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
        <div className="grid min-h-[clamp(92px,9vw,118px)] grid-cols-4">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center gap-[8px] px-[clamp(6px,1.2vw,42px)] py-4 text-center sm:flex-row sm:items-center sm:gap-[16px] sm:text-left"
            >
              {index > 0 ? (
                <span className="absolute left-0 top-1/2 h-[56px] w-px -translate-y-1/2 bg-[#dedbd3]" />
              ) : null}
              <span className="grid size-[clamp(30px,3.6vw,54px)] shrink-0 place-items-center rounded-full bg-[#6a9d17] text-white shadow-[0_10px_24px_rgba(106,157,23,0.2)]">
                <Icon aria-hidden="true" className="size-[clamp(15px,1.7vw,25px)]" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 max-w-full">
                <span className="block font-display text-[length:var(--fs-3xs)] font-black uppercase leading-tight tracking-[0] text-[#171717]">
                  {t(`benefits.items.${index}.title`)}
                </span>
                <span className="mt-1 hidden text-[length:var(--fs-3xs)] font-medium leading-snug text-[#5d5d5d] sm:block">
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

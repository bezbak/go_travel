import Image from "next/image";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { homeTour } from "@/data/tours";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative h-[clamp(380px,44vw,875px)] overflow-hidden bg-[#f4f1e8]"
    >
      <Image
        fill
        priority
        alt={t("imageAlt")}
        className="object-cover object-center"
        sizes="100vw"
        src="/images/hero-yurts.png"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.78)_22%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0)_74%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_28%,rgba(255,255,255,0.02)_72%,rgba(244,241,232,0.46)_100%)]" />

      <Container className="relative z-10 flex h-full items-center pt-[clamp(60px,5.6vw,86px)]">
        <div className="w-full max-w-[min(62%,820px)] lg:ml-[58px] 2xl:ml-[68px]">
          <h1
            id="hero-title"
            className="font-display text-[clamp(26px,6.6vw,98px)] font-black uppercase leading-[0.93] tracking-[0] text-[#171717]"
          >
            <span className="block drop-shadow-[0_6px_8px_rgba(0,0,0,0.14)]">
              {t("titleLine1")}
            </span>
            <span className="block text-[#669a17] drop-shadow-[0_4px_6px_rgba(0,0,0,0.08)]">
              {t("titleLine2")}
            </span>
            <span className="block text-[#669a17] drop-shadow-[0_4px_6px_rgba(0,0,0,0.08)]">
              {t("titleLine3")}
            </span>
          </h1>
          <p className="mt-[clamp(12px,2vw,28px)] max-w-[470px] text-[length:var(--fs-sm)] font-medium leading-[1.65] text-[#373737]">
            {t("body")}
          </p>
          <div className="mt-[clamp(14px,2.4vw,34px)] flex flex-wrap gap-[clamp(8px,1.3vw,18px)]">
            <ButtonLink href="/tours" internal size="sm">
              {t("primaryCta")}
            </ButtonLink>
            <ButtonLink
              href={`/tours/${homeTour.slug}`}
              internal
              size="sm"
              variant="outline"
            >
              {t("secondaryCta")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

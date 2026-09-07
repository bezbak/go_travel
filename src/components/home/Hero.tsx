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
      className="relative h-[640px] overflow-hidden bg-[#f4f1e8] sm:h-[700px] lg:h-[clamp(640px,42.5vw,875px)]"
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

      <Container className="relative z-10 flex h-full items-center pt-[76px] lg:pt-[86px]">
        <div className="w-full max-w-[620px] lg:ml-[58px] 2xl:ml-[68px] 2xl:max-w-[820px]">
          <h1
            id="hero-title"
            className="font-display text-[48px] font-black uppercase leading-[0.93] tracking-[0] text-[#171717] sm:text-[62px] md:text-[72px] lg:text-[82px] 2xl:text-[98px]"
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
          <p className="mt-[28px] max-w-[470px] text-[15px] font-medium leading-[1.65] text-[#373737] sm:text-[16px]">
            {t("body")}
          </p>
          <div className="mt-[34px] flex flex-wrap gap-[18px]">
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

import { Leaf, MapPinned, Mountain, UsersRound } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/Container";
import { featureImage } from "@/data/tours";

const featureIcons = [Mountain, MapPinned, UsersRound, Leaf] as const;

export function WhyTravelWithUs() {
  const t = useTranslations();

  return (
    <section
      id="why-travel"
      aria-labelledby="why-travel-title"
      className="topographic-pattern relative isolate overflow-hidden bg-[#f3efe5] py-[70px] 2xl:py-[86px]"
    >
      <div className="absolute bottom-0 left-0 hidden h-[82%] w-[48%] opacity-45 lg:block">
        <Image
          fill
          alt=""
          className="soft-section-fade object-cover object-left-bottom"
          sizes="48vw"
          src="/images/hero-yurts.png"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,246,239,0.28)_0%,rgba(248,246,239,0.88)_44%,rgba(248,246,239,0.96)_100%)]" />

      <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[260px] lg:min-h-[380px]">
          <div className="mx-auto w-[86%] max-w-[520px] rotate-[-4deg] rounded-[18px] bg-white p-[15px] shadow-[0_24px_55px_rgba(43,38,28,0.22)] lg:absolute lg:left-[40px] lg:top-[10px] 2xl:left-[58px] 2xl:max-w-[560px] 2xl:p-[18px]">
            <div className="relative h-[230px] overflow-hidden rounded-[12px] bg-[#d9d4c8] sm:h-[300px] 2xl:h-[328px]">
              <Image
                fill
                alt={t(featureImage.altKey)}
                className="object-cover"
                sizes="(min-width: 1536px) 560px, (min-width: 1024px) 520px, 86vw"
                src={featureImage.src}
              />
            </div>
          </div>
        </div>

        <div className="lg:pl-[18px] 2xl:pl-[34px]">
          <h2
            id="why-travel-title"
            className="font-display text-[32px] font-black uppercase leading-[1.04] tracking-[0] text-[#171717] sm:text-[42px] 2xl:text-[48px]"
          >
            {t("whyTravel.titleDark")}{" "}
            <span className="text-[#669a17]">{t("whyTravel.titleGreen")}</span>
          </h2>

          <div className="mt-[42px] grid gap-x-[70px] gap-y-[38px] md:grid-cols-2 2xl:mt-[52px]">
            {featureIcons.map((Icon, index) => (
              <div key={index} className="flex gap-[17px]">
                <span className="grid size-[42px] shrink-0 place-items-center rounded-full bg-[#6a9d17] text-white shadow-[0_10px_24px_rgba(106,157,23,0.16)]">
                  <Icon aria-hidden="true" className="size-[21px]" strokeWidth={2.2} />
                </span>
                <span>
                  <span className="block font-display text-[14px] font-black uppercase leading-tight tracking-[0] text-[#171717] 2xl:text-[16px]">
                    {t(`whyTravel.items.${index}.title`)}
                  </span>
                  <span className="mt-[7px] block max-w-[270px] text-[13px] font-medium leading-[1.45] text-[#5f5f5f] 2xl:text-[14px]">
                    {t(`whyTravel.items.${index}.description`)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

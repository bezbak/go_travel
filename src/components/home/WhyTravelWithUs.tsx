import { Leaf, MapPinned, Mountain, UsersRound } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/Container";
import type { ApiImage } from "@/lib/api";

const featureIcons = [Mountain, MapPinned, UsersRound, Leaf] as const;

type WhyTravelWithUsProps = {
  featureImage: ApiImage | null;
  backdropImage: ApiImage | null;
};

export function WhyTravelWithUs({ featureImage, backdropImage }: WhyTravelWithUsProps) {
  const t = useTranslations();

  return (
    <section
      id="why-travel"
      aria-labelledby="why-travel-title"
      className="topographic-pattern relative isolate overflow-hidden bg-[#f3efe5] py-[var(--section-py)]"
    >
      <div className="absolute bottom-0 left-0 h-[82%] w-[48%] opacity-45">
        <Image
          fill
          alt=""
          className="soft-section-fade object-cover object-left-bottom"
          sizes="48vw"
          src={backdropImage?.src ?? ""}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,246,239,0.28)_0%,rgba(248,246,239,0.88)_44%,rgba(248,246,239,0.96)_100%)]" />

      <Container className="relative z-10 grid grid-cols-[0.92fr_1.08fr] items-center gap-[clamp(14px,2.6vw,48px)]">
        <div className="relative min-h-[clamp(150px,24vw,380px)]">
          <div className="mx-auto w-[94%] max-w-[560px] rotate-[-4deg] rounded-[18px] bg-white p-[clamp(6px,1vw,18px)] shadow-[0_24px_55px_rgba(43,38,28,0.22)] lg:absolute lg:left-[40px] lg:top-[10px] 2xl:left-[58px]">
            <div className="relative h-[clamp(120px,21vw,328px)] overflow-hidden rounded-[12px] bg-[#d9d4c8]">
              <Image
                fill
                alt={featureImage?.alt ?? ""}
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 45vw"
                src={featureImage?.src ?? ""}
              />
            </div>
          </div>
        </div>

        <div className="lg:pl-[18px] 2xl:pl-[34px]">
          <h2
            id="why-travel-title"
            className="font-display text-[length:var(--h2-lg)] font-black uppercase leading-[1.04] tracking-[0] text-[#171717]"
          >
            {t("whyTravel.titleDark")}{" "}
            <span className="text-[#669a17]">{t("whyTravel.titleGreen")}</span>
          </h2>

          <div className="mt-[clamp(16px,3.4vw,52px)] grid grid-cols-2 gap-x-[clamp(10px,4.6vw,70px)] gap-y-[clamp(14px,2.6vw,38px)]">
            {featureIcons.map((Icon, index) => (
              <div key={index} className="flex flex-col gap-[8px] sm:flex-row sm:gap-[17px]">
                <span className="grid size-[clamp(28px,2.9vw,42px)] shrink-0 place-items-center rounded-full bg-[#6a9d17] text-white shadow-[0_10px_24px_rgba(106,157,23,0.16)]">
                  <Icon aria-hidden="true" className="size-[clamp(14px,1.5vw,21px)]" strokeWidth={2.2} />
                </span>
                <span>
                  <span className="block font-display text-[length:var(--fs-2xs)] font-black uppercase leading-tight tracking-[0] text-[#171717]">
                    {t(`whyTravel.items.${index}.title`)}
                  </span>
                  <span className="mt-[7px] block max-w-[270px] text-[length:var(--fs-2xs)] font-medium leading-[1.45] text-[#5f5f5f]">
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

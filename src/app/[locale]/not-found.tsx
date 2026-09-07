import { useTranslations } from "next-intl";

import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <PageShell>
      <div className="topographic-pattern bg-[#faf8f2] py-[90px] 2xl:py-[120px]">
        <Container compact>
          <div className="mx-auto max-w-[620px] text-center">
            <p className="font-display text-[74px] font-black leading-none text-[#669a17] 2xl:text-[96px]">
              404
            </p>
            <h1 className="mt-[14px] font-display text-[28px] font-black uppercase leading-[1.08] text-[#171717] sm:text-[36px]">
              {t("title")}
            </h1>
            <p className="mt-[14px] text-[14px] font-medium leading-[1.7] text-[#5f5f5f]">
              {t("body")}
            </p>
            <div className="mt-[26px] flex flex-wrap justify-center gap-[12px]">
              <ButtonLink href="/" internal size="sm">
                {t("home")}
              </ButtonLink>
              <ButtonLink href="/tours" internal size="sm" variant="dark">
                {t("tours")}
              </ButtonLink>
              <ButtonLink href="/contact" internal size="sm" variant="outline">
                {t("contact")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}

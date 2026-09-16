import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { routing } from "@/i18n/routing";
import {
  getPhotos,
  getSiteContent,
  type PhotoLibrary,
  type SiteContent
} from "@/lib/api";
import { pageMetadata } from "@/lib/metadata";

type FaqPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const [t, photos] = await Promise.all([
    getTranslations({ locale }),
    getPhotos(locale)
  ]);
  const cover = photos.yurtsSunset;

  return pageMetadata({
    locale,
    path: "/faq",
    title: t("faq.meta.title"),
    description: t("faq.meta.description"),
    siteName: t("metadata.siteName"),
    image: cover ? { src: cover.src, alt: cover.alt } : undefined
  });
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale: requested } = await params;
  setRequestLocale(requested);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [site, photos] = await Promise.all([
    getSiteContent(locale),
    getPhotos(locale)
  ]);

  return (
    <PageShell>
      <FaqPageContent faq={site.faq} photos={photos} />
    </PageShell>
  );
}

function FaqPageContent({
  faq,
  photos
}: {
  faq: SiteContent["faq"];
  photos: PhotoLibrary;
}) {
  const t = useTranslations();

  const items: AccordionItem[] = faq.map((entry) => ({
    id: entry.key,
    header: (
      <span className="font-display text-[14px] font-black uppercase leading-tight tracking-[0] text-[#171717] sm:text-[16px]">
        {entry.question}
      </span>
    ),
    content: (
      <p className="text-[13px] font-medium leading-[1.7] text-[#4f4f4f] 2xl:text-[14px]">
        {entry.answer}
      </p>
    )
  }));

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("navigation.faq") }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={t("faq.heroDescription")}
        eyebrow={t("faq.heroEyebrow")}
        image={photos.yurtsSunset ?? null}
        imageAlt={photos.yurtsSunset?.alt ?? ""}
        title={t("faq.heroTitle")}
      />

      <Section className="bg-[#faf8f2]" id="faq-list">
        <div className="mx-auto max-w-[900px]">
          <Accordion allowMultiple items={items} />

          <div className="mt-[32px] rounded-[18px] border border-[#e7e2d9] bg-white p-[28px] text-center cursor-pointer">
            <h2 className="font-display text-[20px] font-black uppercase leading-tight text-[#171717]">
              {t("faq.ctaTitle")}
            </h2>
            <p className="mx-auto mt-[10px] max-w-[520px] text-[13px] font-medium leading-[1.65] text-[#5f5f5f]">
              {t("faq.ctaBody")}
            </p>
            <div className="mt-[20px] flex flex-wrap justify-center gap-[12px]">
              <ButtonLink href="/contact" internal size="sm">
                {t("faq.ctaPrimary")}
              </ButtonLink>
              <ButtonLink href="/tours" internal size="sm" variant="dark">
                {t("faq.ctaSecondary")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

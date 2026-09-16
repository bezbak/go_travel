import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { routing } from "@/i18n/routing";
import { getPhotos, type PhotoLibrary } from "@/lib/api";
import { rawList } from "@/lib/messages";
import { pageMetadata } from "@/lib/metadata";

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

const sections = ["booking", "privacy", "terms"] as const;

export async function generateMetadata({
  params
}: LegalPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const [t, photos] = await Promise.all([
    getTranslations({ locale }),
    getPhotos(locale)
  ]);
  const cover = photos.bishkekRoad;

  return pageMetadata({
    locale,
    path: "/legal",
    title: t("legal.meta.title"),
    description: t("legal.meta.description"),
    siteName: t("metadata.siteName"),
    image: cover ? { src: cover.src, alt: cover.alt } : undefined
  });
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale: requested } = await params;
  setRequestLocale(requested);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const photos = await getPhotos(locale);

  return (
    <PageShell>
      <LegalPageContent photos={photos} />
    </PageShell>
  );
}

function LegalPageContent({ photos }: { photos: PhotoLibrary }) {
  const t = useTranslations();

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("legal.heroTitle") }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={t("legal.heroDescription")}
        eyebrow={t("legal.heroEyebrow")}
        image={photos.bishkekRoad ?? null}
        imageAlt={photos.bishkekRoad?.alt ?? ""}
        title={t("legal.heroTitle")}
      />

      <div className="bg-[#faf8f2] py-[52px] 2xl:py-[68px]">
        <Container compact>
          <div className="grid grid-cols-1 gap-[clamp(18px,2.6vw,48px)] md:grid-cols-[minmax(140px,220px)_1fr]">
            <nav aria-label={t("legal.navLabel")} className="lg:sticky lg:top-[110px] lg:self-start">
              <ul className="grid gap-2">
                {sections.map((section) => (
                  <li key={section}>
                    <a
                      className="block rounded-[10px] border border-[#e7e2d9] bg-white px-[14px] py-[11px] text-[13px] font-bold text-[#171717] transition duration-200 hover:border-[#c9dda3] hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17]"
                      href={`#${section}`}
                    >
                      {t(`legal.sections.${section}.title`)}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-[16px] text-[12px] font-medium leading-[1.6] text-[#8a8a8a]">
                {t("legal.updated")}
              </p>
            </nav>

            <div className="grid gap-[32px]">
              {sections.map((section) => (
                <section
                  key={section}
                  aria-labelledby={`${section}-title`}
                  className="scroll-mt-[110px] rounded-[18px] border border-[#e7e2d9] bg-white p-[24px] sm:p-[32px]"
                  id={section}
                >
                  <h2
                    className="font-display text-[22px] font-black uppercase leading-[1.1] text-[#171717] 2xl:text-[26px]"
                    id={`${section}-title`}
                  >
                    {t(`legal.sections.${section}.title`)}
                  </h2>
                  <div className="mt-[16px] grid gap-[13px]">
                    {rawList<string>(t, `legal.sections.${section}.body`).map(
                      (paragraph, index) => (
                        <p
                          key={index}
                          className="text-[13px] font-medium leading-[1.75] text-[#4f4f4f] 2xl:text-[14px]"
                        >
                          {paragraph}
                        </p>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

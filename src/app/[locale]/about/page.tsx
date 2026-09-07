import { Compass, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Testimonials } from "@/components/home/Testimonials";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { images } from "@/data/images";
import { companyStats, team } from "@/data/site";
import { routing } from "@/i18n/routing";
import { rawList } from "@/lib/messages";
import { pageMetadata } from "@/lib/metadata";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

const valueIcons = [Compass, HeartHandshake, ShieldCheck, Leaf] as const;

export async function generateMetadata({
  params
}: AboutPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/about",
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    siteName: t("metadata.siteName"),
    image: { src: images.heroYurts.src, alt: t(images.heroYurts.altKey) }
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell>
      <AboutPageContent />
      <Testimonials />
    </PageShell>
  );
}

function AboutPageContent() {
  const t = useTranslations();
  const story = rawList<string>(t, "about.story");
  const values = rawList<{ title: string; description: string }>(
    t,
    "about.values"
  );

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("navigation.about") }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={t("about.heroDescription")}
        eyebrow={t("about.heroEyebrow")}
        image={images.heroYurts}
        imageAlt={t(images.heroYurts.altKey)}
        title={t("about.heroTitle")}
      />

      <Section align="left" className="bg-white" id="story" title={t("about.storyTitle")}>
        <div className="grid items-center gap-[36px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-[14px]">
            {story.map((paragraph, index) => (
              <p
                key={index}
                className="text-[14px] font-medium leading-[1.75] text-[#4f4f4f] 2xl:text-[15px]"
              >
                {paragraph}
              </p>
            ))}
            <ButtonLink className="mt-[10px] w-fit" href="/tours" internal size="sm">
              {t("about.storyCta")}
            </ButtonLink>
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-[18px] bg-[#e7e2d9] lg:h-[400px]">
            <Image
              fill
              alt={t(images.kyzartHorses.altKey)}
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 90vw"
              src={images.kyzartHorses.src}
            />
          </div>
        </div>
      </Section>

      <section className="topographic-pattern bg-[#f3efe5] py-[42px]">
        <Container compact>
          <dl className="grid grid-cols-2 gap-[24px] lg:grid-cols-4">
            {companyStats.map((stat) => (
              <div key={stat.key} className="text-center">
                <dt className="order-2 mt-2 block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6f6f6f]">
                  {t(`about.stats.${stat.key}`)}
                </dt>
                <dd className="order-1 font-display text-[34px] font-black leading-none text-[#669a17] 2xl:text-[42px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section
        className="bg-white"
        description={t("about.valuesDescription")}
        id="values"
        title={t("about.valuesTitle")}
      >
        <div className="grid gap-[22px] sm:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => {
            const Icon = valueIcons[index % valueIcons.length];

            return (
              <div
                key={value.title}
                className="rounded-[18px] border border-[#e7e2d9] bg-[#faf8f2] p-[24px]"
              >
                <span className="grid size-[46px] place-items-center rounded-full bg-[#6a9d17] text-white shadow-[0_10px_24px_rgba(106,157,23,0.18)]">
                  <Icon aria-hidden="true" className="size-[22px]" strokeWidth={2.2} />
                </span>
                <h3 className="mt-[16px] font-display text-[15px] font-black uppercase leading-tight text-[#171717]">
                  {value.title}
                </h3>
                <p className="mt-[8px] text-[13px] font-medium leading-[1.6] text-[#5f5f5f]">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        className="bg-[#faf8f2]"
        description={t("about.teamDescription")}
        id="team"
        title={t("about.teamTitle")}
      >
        <div className="grid gap-[22px] sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <figure
              key={member.key}
              className="overflow-hidden rounded-[18px] border border-[#e7e2d9] bg-white"
            >
              <div className="relative h-[220px] bg-[#e7e2d9]">
                <Image
                  fill
                  alt={t(member.image.altKey)}
                  className="object-cover"
                  sizes="(min-width: 1280px) 300px, (min-width: 640px) 46vw, 90vw"
                  src={member.image.src}
                />
              </div>
              <figcaption className="p-[20px]">
                <p className="font-display text-[15px] font-black uppercase leading-tight text-[#171717]">
                  {member.name}
                </p>
                <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.04em] text-[#669a17]">
                  {t(`about.team.${member.key}.role`)}
                </p>
                <p className="mt-[10px] text-[13px] font-medium leading-[1.6] text-[#5f5f5f]">
                  {t(`about.team.${member.key}.bio`)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}

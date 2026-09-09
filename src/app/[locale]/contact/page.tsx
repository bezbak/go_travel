import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { images } from "@/data/images";
import { bookingSteps, contact } from "@/data/site";
import { tours } from "@/data/tours";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params
}: ContactPageProps): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/contact",
    title: t("contactPage.meta.title"),
    description: t("contactPage.meta.description"),
    siteName: t("metadata.siteName"),
    image: { src: images.bishkekSunset.src, alt: t(images.bishkekSunset.altKey) }
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell>
      <ContactPageContent />
    </PageShell>
  );
}

function ContactPageContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        crumbs={[
          { label: t("common.breadcrumbHome"), href: "/" },
          { label: t("navigation.contact") }
        ]}
        crumbsLabel={t("common.breadcrumbLabel")}
        description={t("contactPage.heroDescription")}
        eyebrow={t("contactPage.heroEyebrow")}
        image={images.bishkekSunset}
        imageAlt={t(images.bishkekSunset.altKey)}
        title={t("contactPage.heroTitle")}
      />

      <Section align="left" className="bg-[#faf8f2]" id="contact-form">
        <div className="grid grid-cols-1 items-start gap-[clamp(18px,2.4vw,32px)] md:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-[14px]">
            <h2 className="font-display text-[26px] font-black uppercase leading-[1.08] text-[#171717] 2xl:text-[32px]">
              {t("contactPage.detailsTitle")}
            </h2>
            <p className="text-[14px] font-medium leading-[1.7] text-[#5f5f5f]">
              {t("contactPage.detailsBody")}
            </p>

            <ul className="mt-[6px] grid gap-[12px]">
              <ContactRow
                href={contact.phoneHref}
                icon={<Phone aria-hidden="true" className="size-[17px]" />}
                label={t("contactPage.phoneLabel")}
                value={contact.phone}
              />
              <ContactRow
                external
                href={contact.whatsappHref}
                icon={<MessageCircle aria-hidden="true" className="size-[17px]" />}
                label={t("contactPage.whatsappLabel")}
                value={contact.whatsapp}
              />
              <ContactRow
                href={contact.emailHref}
                icon={<Mail aria-hidden="true" className="size-[17px]" />}
                label={t("contactPage.emailLabel")}
                value={contact.email}
              />
              <ContactRow
                icon={<MapPin aria-hidden="true" className="size-[17px]" />}
                label={t("contactPage.officeLabel")}
                value={contact.addressLines.join(", ")}
              />
              <ContactRow
                icon={<Clock aria-hidden="true" className="size-[17px]" />}
                label={t("contactPage.hoursLabel")}
                value={t("contactPage.hoursValue")}
              />
            </ul>

            <div className="mt-[10px] overflow-hidden rounded-[18px] border border-[#e7e2d9]">
              <iframe
                allowFullScreen
                className="block h-[260px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  contact.mapQuery
                )}&output=embed`}
                title={t("contactPage.mapTitle")}
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-[26px] font-black uppercase leading-[1.08] text-[#171717] 2xl:text-[32px]">
              {t("contactPage.formTitle")}
            </h2>
            <p className="mt-[10px] max-w-[620px] text-[14px] font-medium leading-[1.7] text-[#5f5f5f]">
              {t("contactPage.formBody")}
            </p>
            <InquiryForm
              className="mt-[20px]"
              tourOptions={[
                { value: "general", label: t("contactPage.generalEnquiry") },
                ...tours.map((tour) => ({
                  value: tour.slug,
                  label: t(`tours.${tour.slug}.name`)
                }))
              ]}
            />
          </div>
        </div>
      </Section>

      <Section
        className="bg-white"
        description={t("contactPage.stepsDescription")}
        id="booking-steps"
        title={t("contactPage.stepsTitle")}
      >
        <ol className="grid grid-cols-2 gap-[var(--grid-gap)] xl:grid-cols-4">
          {bookingSteps.map((step, index) => (
            <li
              key={step}
              className="rounded-[18px] border border-[#e7e2d9] bg-[#faf8f2] p-[24px]"
            >
              <span className="grid size-[42px] place-items-center rounded-full bg-[#6a9d17] font-display text-[16px] font-black text-white">
                {index + 1}
              </span>
              <h3 className="mt-[16px] font-display text-[15px] font-black uppercase leading-tight text-[#171717]">
                {t(`contactPage.steps.${step}.title`)}
              </h3>
              <p className="mt-[8px] text-[13px] font-medium leading-[1.6] text-[#5f5f5f]">
                {t(`contactPage.steps.${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="grid size-[40px] shrink-0 place-items-center rounded-full bg-[#eef2e6] text-[#6a9d17]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
          {label}
        </span>
        <span className="mt-0.5 block text-[14px] font-bold text-[#171717]">
          {value}
        </span>
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          className="flex items-center gap-3 rounded-[12px] border border-transparent p-2 transition duration-200 hover:border-[#e7e2d9] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17]"
          href={href}
          rel={external ? "noreferrer noopener" : undefined}
          target={external ? "_blank" : undefined}
        >
          {content}
        </a>
      ) : (
        <span className="flex items-center gap-3 p-2">{content}</span>
      )}
    </li>
  );
}

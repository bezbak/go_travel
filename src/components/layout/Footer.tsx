import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

import { InstagramIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { Container } from "@/components/ui/Container";
import { footerCompanyNav, footerInformationNav, mainNav } from "@/data/navigation";
import { contact, social } from "@/data/site";
import { Link } from "@/i18n/navigation";

import { Logo } from "./Logo";

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  whatsapp: WhatsappIcon
};

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-[#181818] pt-[clamp(30px,3.4vw,52px)] pb-[34px] text-white">
      <Container className="grid grid-cols-2 items-start gap-[clamp(20px,3vw,48px)] lg:grid-cols-[1.4fr_0.7fr_0.8fr_1fr]">
        <div className="grid gap-5">
          <Logo
            homeAria={t("brand.homeAria")}
            inverted
            logoText={t("brand.logoText")}
            name={t("brand.name")}
            small
          />
          <p className="max-w-[320px] text-[length:var(--fs-2xs)] font-medium leading-[1.6] text-white/58">
            {t("footer.blurb")}
          </p>
          <div className="flex gap-3">
            {social.map((item) => {
              const Icon = socialIcons[item.key];

              return (
                <a
                  key={item.key}
                  aria-label={t(`footer.social.${item.key}`)}
                  className="grid size-[34px] place-items-center rounded-full bg-white/88 text-[#181818] transition duration-200 hover:bg-[#669a17] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#669a17]"
                  href={item.href}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <Icon className="size-[17px]" />
                </a>
              );
            })}
          </div>
        </div>

        <FooterColumn
          links={mainNav.map((item) => ({
            href: item.href,
            label: t(item.labelKey)
          }))}
          title={t("footer.exploreTitle")}
        />
        <FooterColumn
          links={footerCompanyNav.map((item) => ({
            href: item.href,
            label: t(item.labelKey)
          }))}
          title={t("footer.companyTitle")}
        />

        <div className="grid gap-6">
          <FooterColumn
            links={footerInformationNav.map((item) => ({
              href: item.href,
              label: t(item.labelKey)
            }))}
            title={t("footer.informationTitle")}
          />

          <ul className="grid gap-3 text-[length:var(--fs-2xs)] font-medium text-white/68">
            <li className="flex items-start gap-2.5">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#8fbc4a]" />
              <span>
                {contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone aria-hidden="true" className="size-4 shrink-0 text-[#8fbc4a]" />
              <a
                className="transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#669a17]"
                href={contact.phoneHref}
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail aria-hidden="true" className="size-4 shrink-0 text-[#8fbc4a]" />
              <a
                className="break-all transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#669a17]"
                href={contact.emailHref}
              >
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="mt-10 border-t border-white/10 pt-6">
        <p className="text-[length:var(--fs-3xs)] font-medium text-white/52">
          {t("footer.copyright")}
        </p>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="font-display text-[length:var(--fs-3xs)] font-black uppercase tracking-[0.06em] text-white">
        {title}
      </h2>
      <ul className="mt-4 grid gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="text-[length:var(--fs-2xs)] font-medium text-white/68 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#669a17]"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

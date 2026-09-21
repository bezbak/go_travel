import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/data/navigation";
import type { Locale } from "@/i18n/routing";
import type { SiteContent } from "@/lib/api";
import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MobileMenu, type NavItem } from "./MobileMenu";
import { NavLink } from "./NavLink";

type HeaderProps = {
  contact: SiteContent["contact"];
  /**
   * `overlay` floats the header on top of the home hero; `solid` gives inner
   * pages an opaque bar that still sits above the page hero image.
   */
  variant?: "overlay" | "solid";
};

export function Header({ contact, variant = "overlay" }: HeaderProps) {
  const t = useTranslations();
  const navItems: NavItem[] = mainNav.map((item) => ({
    href: item.href,
    label: t(item.labelKey)
  }));
  const languageShort = {
    en: t("languageSwitcher.short.en"),
    kg: t("languageSwitcher.short.kg"),
    ru: t("languageSwitcher.short.ru"),
    fr: t("languageSwitcher.short.fr"),
    de: t("languageSwitcher.short.de"),
    es: t("languageSwitcher.short.es")
  } satisfies Record<Locale, string>;
  const languageNames = {
    en: t("languageSwitcher.names.en"),
    kg: t("languageSwitcher.names.kg"),
    ru: t("languageSwitcher.names.ru"),
    fr: t("languageSwitcher.names.fr"),
    de: t("languageSwitcher.names.de"),
    es: t("languageSwitcher.names.es")
  } satisfies Record<Locale, string>;
  const brand = {
    homeAria: t("brand.homeAria"),
    logoText: t("brand.logoText"),
    name: t("brand.name"),
    tagline: t("brand.tagline")
  };
  const solid = variant === "solid";

  return (
    <header
      className={cn(
        "z-40",
        solid
          ? "sticky top-0 border-b border-[#e8e5df] bg-white/92 backdrop-blur-md"
          : "absolute inset-x-0 top-0"
      )}
    >
      <Container className="flex h-[clamp(60px,5.6vw,86px)] items-center justify-between gap-5">
        <Logo {...brand} />

        <nav
          aria-label={t("header.menuTitle")}
          className="hidden items-center gap-[38px] xl:flex 2xl:gap-[46px]"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              className="whitespace-nowrap font-display text-[12px] font-extrabold uppercase tracking-[0] text-[#111111] transition duration-200 hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a9d17]"
              href={item.href}
              label={item.label}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-[22px] xl:flex">
          <LanguageSwitcher
            ariaLabel={t("languageSwitcher.ariaLabel")}
            labels={languageShort}
            names={languageNames}
          />
          <a
            aria-label={t("header.phoneAria")}
            className="flex items-center gap-2 whitespace-nowrap font-display text-[12px] font-bold text-[#151515] transition duration-200 hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a9d17]"
            href={contact?.phoneHref ?? "#"}
          >
            <Phone aria-hidden="true" className="size-[14px]" strokeWidth={2.4} />
            <span>{contact?.phone}</span>
          </a>
          <ButtonLink
            className="h-[50px] rounded-[13px] px-[30px] 2xl:h-[54px] 2xl:px-[35px]"
            href="/contact"
            internal
          >
            {t("header.book")}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher
            ariaLabel={t("languageSwitcher.ariaLabel")}
            labels={languageShort}
            names={languageNames}
          />
          <MobileMenu
            brand={brand}
            phoneHref={contact?.phoneHref ?? "#"}
            labels={{
              book: t("header.book"),
              phone: contact?.phone ?? "",
              phoneAria: t("header.phoneAria"),
              openMenu: t("header.openMenu"),
              closeMenu: t("header.closeMenu"),
              menuTitle: t("header.menuTitle"),
              languageAria: t("languageSwitcher.ariaLabel"),
              languageShort,
              languageNames
            }}
            navItems={navItems}
          />
        </div>
      </Container>
    </header>
  );
}

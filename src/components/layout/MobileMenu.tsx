"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ButtonLink } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";

export type NavItem = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  navItems: NavItem[];
  phoneHref: string;
  brand: {
    homeAria: string;
    logoText: string;
    name: string;
    tagline: string;
  };
  labels: {
    book: string;
    phone: string;
    phoneAria: string;
    openMenu: string;
    closeMenu: string;
    menuTitle: string;
    languageAria: string;
    languageShort: Record<Locale, string>;
    languageNames: Record<Locale, string>;
  };
};

export function MobileMenu({ navItems, brand, labels, phoneHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        aria-expanded={open}
        aria-label={open ? labels.closeMenu : labels.openMenu}
        className="grid size-[40px] place-items-center rounded-full border border-black/10 bg-white/35 text-[#181818] transition duration-200 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17] sm:size-[44px]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <X aria-hidden="true" className="size-5" strokeWidth={2.5} />
        ) : (
          <Menu aria-hidden="true" className="size-5" strokeWidth={2.5} />
        )}
      </button>

      {/*
        * The overlay is portalled to the body: the solid header carries
        * `backdrop-blur`, which makes it the containing block for fixed
        * descendants, so an in-place overlay collapses to the header's height.
        */}
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50 overflow-y-auto bg-[#fbfaf5] px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <Logo {...brand} small />
                <div className="flex items-center gap-2">
                  <LanguageSwitcher
                    ariaLabel={labels.languageAria}
                    labels={labels.languageShort}
                    names={labels.languageNames}
                  />
                  <button
                    aria-label={labels.closeMenu}
                    className="grid size-[40px] place-items-center rounded-full border border-black/10 bg-white text-[#181818] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17] sm:size-[44px]"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    <X aria-hidden="true" className="size-5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="mt-12">
                <p className="font-display text-[12px] font-extrabold uppercase text-[#669a17]">
                  {labels.menuTitle}
                </p>
                <nav aria-label={labels.menuTitle} className="mt-5 grid gap-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      className="border-b border-[#e8e5df] py-4 font-display text-[26px] font-black uppercase leading-none text-[#181818] transition duration-200 hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17]"
                      href={item.href}
                      label={item.label}
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                </nav>

                <div className="mt-10 grid gap-4 pb-6">
                  <a
                    aria-label={labels.phoneAria}
                    className="flex items-center gap-3 font-display text-[14px] font-bold text-[#181818]"
                    href={phoneHref}
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-[#669a17] text-white">
                      <Phone aria-hidden="true" className="size-4" />
                    </span>
                    {labels.phone}
                  </a>
                  <ButtonLink
                    className="w-full"
                    href="/contact"
                    internal
                    onClick={() => setOpen(false)}
                  >
                    {labels.book}
                  </ButtonLink>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

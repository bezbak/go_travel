export type NavLinkItem = {
  href: string;
  labelKey: string;
};

export const mainNav: NavLinkItem[] = [
  { href: "/tours", labelKey: "navigation.tours" },
  { href: "/destinations", labelKey: "navigation.destinations" },
  { href: "/about", labelKey: "navigation.about" },
  { href: "/faq", labelKey: "navigation.faq" },
  { href: "/contact", labelKey: "navigation.contact" }
];

export const footerCompanyNav: NavLinkItem[] = [
  { href: "/about", labelKey: "footer.company.about" },
  { href: "/about#team", labelKey: "footer.company.team" },
  { href: "/about#reviews", labelKey: "footer.company.reviews" },
  { href: "/contact", labelKey: "footer.company.contact" }
];

export const footerInformationNav: NavLinkItem[] = [
  { href: "/faq", labelKey: "footer.information.faq" },
  { href: "/legal#booking", labelKey: "footer.information.booking" },
  { href: "/legal#privacy", labelKey: "footer.information.privacy" },
  { href: "/legal#terms", labelKey: "footer.information.terms" }
];

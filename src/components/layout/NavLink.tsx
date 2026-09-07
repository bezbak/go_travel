"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
};

/**
 * Locale-aware nav link that marks itself current when the visitor is on that
 * branch of the site (`/tours` stays active on `/tours/kel-suu-expedition`).
 */
export function NavLink({
  href,
  label,
  className,
  activeClassName = "text-[#669a17]",
  onNavigate
}: NavLinkProps) {
  const pathname = usePathname();
  const target = href.split("#")[0] || "/";
  const active =
    target === "/" ? pathname === "/" : pathname === target || pathname.startsWith(`${target}/`);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(className, active && activeClassName)}
      href={href}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}

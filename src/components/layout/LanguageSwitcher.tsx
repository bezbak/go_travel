"use client";

import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  ariaLabel: string;
  labels: Record<Locale, string>;
  names: Record<Locale, string>;
  inverted?: boolean;
};

export function LanguageSwitcher({
  ariaLabel,
  labels,
  names,
  inverted
}: LanguageSwitcherProps) {
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }}
    >
      <button
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex h-[36px] items-center gap-1 rounded-full border px-2 font-display text-[11px] font-extrabold uppercase tracking-[0] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17] sm:h-[38px] sm:px-3",
          inverted
            ? "border-white/14 bg-white/8 text-white hover:bg-white/14"
            : "border-black/10 bg-white/28 text-[#181818] hover:bg-white/75"
        )}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        {labels[activeLocale]}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3 transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={2.4}
        />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute right-0 top-[46px] z-50 min-w-[128px] overflow-hidden rounded-[14px] border py-1 shadow-[0_18px_45px_rgba(0,0,0,0.12)]",
            inverted
              ? "border-white/12 bg-[#202020] text-white"
              : "border-[#e8e5df] bg-white text-[#181818]"
          )}
        >
          {locales.map((locale) => (
            <Link
              key={locale}
              className={cn(
                "block px-4 py-2.5 text-[12px] font-bold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#6a9d17]",
                locale === activeLocale
                  ? "text-[#669a17]"
                  : inverted
                    ? "text-white/72 hover:bg-white/8 hover:text-white"
                    : "text-[#242424] hover:bg-[#f8f6ef]"
              )}
              href={pathname || "/"}
              locale={locale}
              onClick={() => setOpen(false)}
            >
              <span className="mr-2 font-display">{labels[locale]}</span>
              <span>{names[locale]}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

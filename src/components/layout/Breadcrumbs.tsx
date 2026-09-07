import { ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  ariaLabel: string;
  items: Crumb[];
  inverted?: boolean;
};

export function Breadcrumbs({ ariaLabel, items, inverted }: BreadcrumbsProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  className={cn(
                    "text-[12px] font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17]",
                    inverted
                      ? "text-white/70 hover:text-white"
                      : "text-[#6b6b6b] hover:text-[#669a17]"
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "text-[12px] font-bold",
                    inverted ? "text-white" : "text-[#171717]"
                  )}
                >
                  {item.label}
                </span>
              )}

              {last ? null : (
                <ChevronRight
                  aria-hidden="true"
                  className={cn(
                    "size-3",
                    inverted ? "text-white/45" : "text-[#a9a9a9]"
                  )}
                  strokeWidth={2.6}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Container } from "./Container";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  align?: "center" | "left";
  className?: string;
  containerClassName?: string;
};

/**
 * Standard heading + body block used by every section below a page hero. The
 * heading is wired to `aria-labelledby` when an `id` is supplied.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
  align = "center",
  className,
  containerClassName
}: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn("py-[var(--section-py)]", className)}
      id={id}
    >
      <Container compact className={containerClassName}>
        {title ? (
          <div
            className={cn(
              "flex flex-row flex-wrap items-end justify-between gap-[clamp(12px,2vw,20px)]",
              align === "center" && "flex-col items-center text-center"
            )}
          >
            <div className={cn("max-w-[720px]", align === "center" && "mx-auto")}>
              {eyebrow ? (
                <p className="font-display text-[length:var(--fs-2xs)] font-black uppercase tracking-[0.08em] text-[#669a17]">
                  {eyebrow}
                </p>
              ) : null}
              <h2
                className="mt-[10px] font-display text-[length:var(--h2)] font-black uppercase leading-[1.05] tracking-[0] text-[#171717]"
                id={headingId}
              >
                {title}
              </h2>
              {description ? (
                <p className="mt-[12px] text-[length:var(--fs-sm)] font-medium leading-[1.65] text-[#5f5f5f]">
                  {description}
                </p>
              ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
        ) : null}

        <div className={cn(title ? "mt-[clamp(20px,3vw,46px)]" : undefined)}>
          {children}
        </div>
      </Container>
    </section>
  );
}

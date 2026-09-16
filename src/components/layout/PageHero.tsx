import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import type { ApiImage } from "@/lib/api";
import { cn } from "@/lib/utils";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type PageHeroProps = {
  image: ApiImage | null;
  imageAlt: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  crumbs: Crumb[];
  crumbsLabel: string;
  children?: ReactNode;
  size?: "sm" | "lg";
};

/** Shared masthead for every page below the home page. */
export function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  crumbs,
  crumbsLabel,
  children,
  size = "sm"
}: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className={cn(
        "relative isolate flex items-end overflow-hidden bg-[#1d1d1d]",
        size === "lg"
          ? "min-h-[520px] pt-[120px] pb-[46px] lg:min-h-[620px]"
          : "min-h-[380px] pt-[120px] pb-[42px] lg:min-h-[440px]"
      )}
    >
      <Image
        fill
        priority
        alt={imageAlt}
        className="-z-10 object-cover object-center"
        sizes="100vw"
        src={image?.src ?? ""}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(12,12,12,0.72)_0%,rgba(12,12,12,0.35)_45%,rgba(12,12,12,0.82)_100%)]" />

      <Container compact className="relative">
        <Breadcrumbs ariaLabel={crumbsLabel} inverted items={crumbs} />

        <div className="mt-[18px] max-w-[860px]">
          {eyebrow ? (
            <p className="font-display text-[12px] font-black uppercase tracking-[0.1em] text-[#bede82]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="mt-[10px] font-display text-[34px] font-black uppercase leading-[1.02] tracking-[0] text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)] sm:text-[46px] lg:text-[58px] 2xl:text-[66px]"
            id="page-hero-title"
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-[16px] max-w-[620px] text-[14px] font-medium leading-[1.65] text-white/85 sm:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>

        {children ? <div className="mt-[26px]">{children}</div> : null}
      </Container>
    </section>
  );
}

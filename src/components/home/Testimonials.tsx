import { Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Section } from "@/components/ui/Section";
import type { SiteContent } from "@/lib/api";
import { cn } from "@/lib/utils";

type TestimonialsProps = {
  testimonials: SiteContent["testimonials"];
  tourNames: Record<string, string>;
  id?: string;
  className?: string;
};

export function Testimonials({
  testimonials,
  tourNames,
  id = "reviews",
  className
}: TestimonialsProps) {
  const t = useTranslations();

  return (
    <Section
      className={cn("bg-white", className)}
      description={t("testimonialsSection.description")}
      eyebrow={t("testimonialsSection.eyebrow")}
      id={id}
      title={
        <>
          {t("testimonialsSection.titleDark")}{" "}
          <span className="text-[#669a17]">
            {t("testimonialsSection.titleGreen")}
          </span>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-[var(--grid-gap)] xl:grid-cols-4">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.key}
            className="flex h-full flex-col rounded-[18px] border border-[#e7e2d9] bg-[#faf8f2] p-[22px] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_40px_rgba(23,23,23,0.07)]"
          >
            <Quote
              aria-hidden="true"
              className="size-[26px] shrink-0 text-[#c9dda3]"
              strokeWidth={2}
            />

            <div
              aria-label={t("common.ratingOutOfFive", { rating: testimonial.rating })}
              className="mt-[14px] flex gap-0.5"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  aria-hidden="true"
                  className={cn(
                    "size-[14px]",
                    star <= testimonial.rating
                      ? "fill-[#f5a524] text-[#f5a524]"
                      : "text-[#d8d3c7]"
                  )}
                />
              ))}
            </div>

            <blockquote className="mt-[12px] flex-1 text-[13px] font-medium leading-[1.65] text-[#4f4f4f]">
              {testimonial.quote}
            </blockquote>

            <figcaption className="mt-[18px] border-t border-[#e4e0d6] pt-[14px]">
              <p className="font-display text-[13px] font-black uppercase tracking-[0] text-[#171717]">
                {testimonial.name}
              </p>
              <p className="mt-1 text-[12px] font-medium text-[#7a7a7a]">
                {testimonial.country}
                {testimonial.tourSlug ? ` · ${tourNames[testimonial.tourSlug] ?? ""}` : ""}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

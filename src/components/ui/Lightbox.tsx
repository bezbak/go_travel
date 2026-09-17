"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { ApiImage } from "@/lib/api";
import { cn } from "@/lib/utils";

export type LightboxLabels = {
  /** e.g. "Open photo {index} of {total}" */
  open: string;
  close: string;
  previous: string;
  next: string;
  counter: string;
};

type LightboxProps = {
  images: ApiImage[];
  labels: LightboxLabels;
  className?: string;
  /**
   * `feature` makes the first photo span two columns and two rows, `strip` is
   * the shorter home-page row, `even` keeps every tile the same size.
   */
  layout?: "even" | "feature" | "strip";
};

/**
 * A photo grid whose tiles open full screen with keyboard and swipe paging.
 *
 * The overlay is portalled to the body so it is never trapped by a parent that
 * establishes a containing block (a `transform`, `filter` or `backdrop-filter`
 * ancestor would otherwise shrink a `fixed` overlay to that parent's box).
 */
export function Lightbox({ images, labels, className, layout = "feature" }: LightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft") {
        step(-1);
      } else if (event.key === "ArrowRight") {
        step(1);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (images.length === 0) {
    return null;
  }

  const active = openIndex === null ? null : images[openIndex];

  return (
    <>
      <div
        className={cn(
          "grid gap-[var(--grid-gap)]",
          layout === "strip"
            ? "grid-cols-3 xl:grid-cols-5"
            : "grid-cols-2 lg:grid-cols-4",
          className
        )}
      >
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            aria-label={labels.open
              .replace("{index}", String(index + 1))
              .replace("{total}", String(images.length))}
            className={cn(
              "group relative cursor-zoom-in overflow-hidden bg-[#e7e2d9] shadow-[0_0_28px_-6px_rgba(245,165,36,0.35)] transition duration-300 hover:shadow-[0_0_40px_-4px_rgba(245,165,36,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17]",
              layout === "strip"
                ? "h-[clamp(74px,10.5vw,170px)] rounded-[8px]"
                : "h-[180px] rounded-[14px] 2xl:h-[210px]",
              layout === "feature" &&
                index === 0 &&
                "sm:col-span-2 sm:row-span-2 sm:h-full sm:min-h-[374px] 2xl:min-h-[434px]"
            )}
            type="button"
            onClick={() => setOpenIndex(index)}
          >
            <Image
              fill
              alt={image.alt}
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              sizes={
                layout === "strip"
                  ? "(min-width: 1280px) 20vw, 33vw"
                  : layout === "feature" && index === 0
                    ? "(min-width: 640px) 50vw, 90vw"
                    : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
              }
              src={image.src}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[#171717]/0 transition duration-300 group-hover:bg-[#171717]/12"
            />
          </button>
        ))}
      </div>

      {active
        ? createPortal(
            <div
              aria-label={labels.counter
                .replace("{index}", String((openIndex ?? 0) + 1))
                .replace("{total}", String(images.length))}
              aria-modal="true"
              className="fixed inset-0 z-[100] flex items-center justify-center gap-2 bg-[#101010]/94 px-3 py-4 sm:gap-4 sm:px-6"
              role="dialog"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  close();
                }
              }}
            >
              <button
                aria-label={labels.close}
                className="absolute right-3 top-3 z-10 grid size-[44px] place-items-center rounded-full bg-white/14 text-white transition duration-200 hover:bg-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
                type="button"
                onClick={close}
              >
                <X aria-hidden="true" className="size-5" strokeWidth={2.4} />
              </button>

              {images.length > 1 ? (
                <button
                  aria-label={labels.previous}
                  className="z-10 grid size-[40px] shrink-0 place-items-center rounded-full bg-white/14 text-white transition duration-200 hover:bg-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-[52px]"
                  type="button"
                  onClick={() => step(-1)}
                >
                  <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={2.4} />
                </button>
              ) : null}

              <figure className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3">
                {/*
                  * Sized from the payload rather than `fill`: a filled image
                  * needs a parent with a definite height, which a centred flex
                  * column does not have.
                  */}
                <Image
                  priority
                  alt={active.alt}
                  className="max-h-[74vh] w-auto max-w-full object-contain"
                  height={active.height}
                  sizes="92vw"
                  src={active.src}
                  width={active.width}
                />
                <figcaption className="max-w-[760px] text-center text-[13px] font-medium leading-[1.5] text-white/78">
                  {active.alt}
                  {images.length > 1 ? (
                    <span className="mt-1 block text-[12px] font-semibold tracking-[0.06em] text-white/55">
                      {labels.counter
                        .replace("{index}", String((openIndex ?? 0) + 1))
                        .replace("{total}", String(images.length))}
                    </span>
                  ) : null}
                </figcaption>
              </figure>

              {images.length > 1 ? (
                <button
                  aria-label={labels.next}
                  className="z-10 grid size-[40px] shrink-0 place-items-center rounded-full bg-white/14 text-white transition duration-200 hover:bg-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-[52px]"
                  type="button"
                  onClick={() => step(1)}
                >
                  <ChevronRight aria-hidden="true" className="size-6" strokeWidth={2.4} />
                </button>
              ) : null}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

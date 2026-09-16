import { useTranslations } from "next-intl";

import { Lightbox } from "@/components/ui/Lightbox";
import type { ApiImage } from "@/lib/api";

type PhotoGridProps = {
  images: ApiImage[];
  className?: string;
  /** `feature` makes the first photo span two columns and two rows. */
  layout?: "even" | "feature";
};

/** Photo grid whose tiles open a full-screen gallery. */
export function PhotoGrid({ images, className, layout = "feature" }: PhotoGridProps) {
  const t = useTranslations("lightbox");

  if (images.length === 0) {
    return null;
  }

  return (
    <Lightbox
      className={className}
      images={images}
      labels={{
        open: t.raw("open") as string,
        close: t.raw("close") as string,
        previous: t.raw("previous") as string,
        next: t.raw("next") as string,
        counter: t.raw("counter") as string
      }}
      layout={layout}
    />
  );
}

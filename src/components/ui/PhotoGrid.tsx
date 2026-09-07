import Image from "next/image";
import { useTranslations } from "next-intl";

import type { ImageAsset } from "@/data/images";
import { cn } from "@/lib/utils";

type PhotoGridProps = {
  images: ImageAsset[];
  className?: string;
  /** `feature` makes the first photo span two columns and two rows. */
  layout?: "even" | "feature";
};

export function PhotoGrid({ images, className, layout = "feature" }: PhotoGridProps) {
  const t = useTranslations();

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-[14px] sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={cn(
            "relative h-[180px] overflow-hidden rounded-[14px] bg-[#e7e2d9] 2xl:h-[210px]",
            layout === "feature" &&
              index === 0 &&
              "sm:col-span-2 sm:row-span-2 sm:h-full sm:min-h-[374px] 2xl:min-h-[434px]"
          )}
        >
          <Image
            fill
            alt={t(image.altKey)}
            className="object-cover transition duration-500 hover:scale-[1.04]"
            sizes={
              layout === "feature" && index === 0
                ? "(min-width: 640px) 50vw, 90vw"
                : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
            }
            src={image.src}
          />
        </div>
      ))}
    </div>
  );
}

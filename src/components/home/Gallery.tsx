import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/Container";
import { galleryImages } from "@/data/tours";

export function Gallery() {
  const t = useTranslations();

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-white py-[clamp(26px,3.2vw,48px)]">
      <Container compact>
        <h2
          id="gallery-title"
          className="text-center font-display text-[length:var(--h2)] font-black uppercase leading-none tracking-[0] text-[#171717]"
        >
          {t("gallery.title")}
        </h2>

        <div className="mt-[clamp(18px,2vw,28px)]">
          <div className="grid grid-cols-3 gap-[var(--grid-gap)] xl:grid-cols-5">
            {galleryImages.map((image) => (
              <div
                key={image.src}
                className="group relative h-[clamp(74px,10.5vw,170px)] overflow-hidden rounded-[8px] bg-[#e7e2d9] shadow-[0_8px_24px_rgba(23,23,23,0.05)]"
              >
                <Image
                  fill
                  alt={t(image.altKey)}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 1280px) 20vw, 33vw"
                  src={image.src}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

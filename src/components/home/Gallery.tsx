import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/Container";
import { galleryImages } from "@/data/tours";

export function Gallery() {
  const t = useTranslations();

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-white py-[44px] 2xl:py-[48px]">
      <Container compact>
        <h2
          id="gallery-title"
          className="text-center font-display text-[30px] font-black uppercase leading-none tracking-[0] text-[#171717] 2xl:text-[36px]"
        >
          {t("gallery.title")}
        </h2>

        <div className="no-scrollbar -mx-5 mt-[28px] overflow-x-auto px-5 sm:-mx-8 sm:px-8 xl:mx-0 xl:overflow-visible xl:px-0">
          <div className="grid grid-flow-col auto-cols-[270px] gap-[24px] xl:grid-flow-row xl:grid-cols-5 xl:auto-cols-auto xl:gap-[28px]">
            {galleryImages.map((image) => (
              <div
                key={image.src}
                className="group relative h-[150px] overflow-hidden rounded-[8px] bg-[#e7e2d9] shadow-[0_8px_24px_rgba(23,23,23,0.05)] 2xl:h-[170px]"
              >
                <Image
                  fill
                  alt={t(image.altKey)}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 1536px) 305px, (min-width: 1280px) 220px, 270px"
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

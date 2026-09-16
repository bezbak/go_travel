import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/Container";
import { Lightbox } from "@/components/ui/Lightbox";
import type { ApiImage } from "@/lib/api";

type GalleryProps = {
  images: ApiImage[];
};

export function Gallery({ images }: GalleryProps) {
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

        <Lightbox
          className="mt-[clamp(18px,2vw,28px)]"
          images={images}
          labels={{
            open: t.raw("lightbox.open") as string,
            close: t.raw("lightbox.close") as string,
            previous: t.raw("lightbox.previous") as string,
            next: t.raw("lightbox.next") as string,
            counter: t.raw("lightbox.counter") as string
          }}
          layout="strip"
        />
      </Container>
    </section>
  );
}

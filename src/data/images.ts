export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  altKey: string;
};

/**
 * Every photo used across the site lives here once, so alt text only has to be
 * translated a single time per image instead of once per tour or gallery.
 */
export const images = {
  heroYurts: {
    src: "/images/hero-yurts.png",
    width: 1672,
    height: 941,
    altKey: "imageAlts.heroYurts"
  },
  yurtsSunset: {
    src: "/images/gallery-yurts-sunset.png",
    width: 1672,
    height: 940,
    altKey: "imageAlts.yurtsSunset"
  },
  alpineLake: {
    src: "/images/gallery-alpine-lake.png",
    width: 1672,
    height: 941,
    altKey: "imageAlts.alpineLake"
  },
  yurtNight: {
    src: "/images/gallery-yurt-night.png",
    width: 1672,
    height: 941,
    altKey: "imageAlts.yurtNight"
  },
  kelSuu: {
    src: "/images/kel-suu-lake.png",
    width: 1672,
    height: 941,
    altKey: "imageAlts.kelSuu"
  },
  songKol: {
    src: "/images/song-kol-yurts.png",
    width: 1536,
    height: 1024,
    altKey: "imageAlts.songKol"
  },
  kyzartHorses: {
    src: "/images/kyzart-horses.png",
    width: 1536,
    height: 1024,
    altKey: "imageAlts.kyzartHorses"
  },
  kilemche: {
    src: "/images/kilemche-valley.png",
    width: 1536,
    height: 1024,
    altKey: "imageAlts.kilemche"
  },
  bishkekSunset: {
    src: "/images/bishkek-sunset.png",
    width: 1536,
    height: 1024,
    altKey: "imageAlts.bishkekSunset"
  },
  bishkekRoad: {
    src: "/images/bishkek-road.png",
    width: 1536,
    height: 1024,
    altKey: "imageAlts.bishkekRoad"
  }
} satisfies Record<string, ImageAsset>;

export type ImageName = keyof typeof images;

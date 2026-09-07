import { images, type ImageAsset } from "./images";

export type Destination = {
  slug: string;
  /** Metres above sea level, shown in the quick-facts strip. */
  altitudeM: number;
  /** Driving hours from Bishkek. */
  driveHours: number;
  bestMonths: string;
  heroImage: ImageAsset;
  cardImage: ImageAsset;
  gallery: ImageAsset[];
};

export const destinations: Destination[] = [
  {
    slug: "song-kol",
    altitudeM: 3016,
    driveHours: 6,
    bestMonths: "06-09",
    heroImage: images.songKol,
    cardImage: images.songKol,
    gallery: [
      images.songKol,
      images.yurtsSunset,
      images.yurtNight,
      images.kyzartHorses
    ]
  },
  {
    slug: "kel-suu",
    altitudeM: 3514,
    driveHours: 11,
    bestMonths: "07-09",
    heroImage: images.kelSuu,
    cardImage: images.kelSuu,
    gallery: [
      images.kelSuu,
      images.alpineLake,
      images.kilemche,
      images.heroYurts
    ]
  },
  {
    slug: "issyk-kul",
    altitudeM: 1607,
    driveHours: 4,
    bestMonths: "05-10",
    heroImage: images.alpineLake,
    cardImage: images.alpineLake,
    gallery: [
      images.alpineLake,
      images.yurtsSunset,
      images.bishkekSunset,
      images.kyzartHorses
    ]
  },
  {
    slug: "jeti-oguz",
    altitudeM: 2200,
    driveHours: 6,
    bestMonths: "05-10",
    heroImage: images.kilemche,
    cardImage: images.kilemche,
    gallery: [
      images.kilemche,
      images.kyzartHorses,
      images.alpineLake,
      images.heroYurts
    ]
  },
  {
    slug: "bishkek",
    altitudeM: 800,
    driveHours: 0,
    bestMonths: "04-10",
    heroImage: images.bishkekSunset,
    cardImage: images.bishkekSunset,
    gallery: [
      images.bishkekSunset,
      images.bishkekRoad,
      images.alpineLake,
      images.heroYurts
    ]
  },
  {
    slug: "osh-and-pamir",
    altitudeM: 3600,
    driveHours: 12,
    bestMonths: "06-09",
    heroImage: images.heroYurts,
    cardImage: images.bishkekRoad,
    gallery: [
      images.bishkekRoad,
      images.heroYurts,
      images.kilemche,
      images.yurtNight
    ]
  }
];

export const destinationSlugs = destinations.map(
  (destination) => destination.slug
);

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}

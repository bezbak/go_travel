import { images, type ImageAsset } from "./images";

export type TourDifficulty = "easy" | "moderate" | "challenging";
export type TourStyle = "group" | "private" | "expedition";
export type TourSeason = "spring" | "summer" | "autumn" | "winter";

export type Departure = {
  /** Plain `YYYY-MM-DD`; rendered with `formatDate` so it stays locale aware. */
  date: string;
  seatsLeft: number;
  priceEur: number;
};

export type Tour = {
  slug: string;
  featured: boolean;
  /** Slugs from `destinations.ts`; the first one is the main region. */
  destinations: string[];
  groupSizeMax: number;
  difficulty: TourDifficulty;
  style: TourStyle;
  seasons: TourSeason[];
  priceEur: number;
  oldPriceEur?: number;
  rating: number;
  reviewCount: number;
  heroImage: ImageAsset;
  cardImage: ImageAsset;
  /** One image per itinerary day — the array length is the tour duration. */
  dayImages: ImageAsset[];
  gallery: ImageAsset[];
  departures: Departure[];
};

export const tours: Tour[] = [
  {
    slug: "heart-of-kyrgyzstan",
    featured: true,
    destinations: ["bishkek", "song-kol", "kel-suu"],
    groupSizeMax: 12,
    difficulty: "moderate",
    style: "group",
    seasons: ["summer", "autumn"],
    priceEur: 890,
    oldPriceEur: 1040,
    rating: 4.9,
    reviewCount: 128,
    heroImage: images.heroYurts,
    cardImage: images.songKol,
    dayImages: [
      images.bishkekSunset,
      images.kyzartHorses,
      images.kilemche,
      images.songKol,
      images.kelSuu,
      images.bishkekRoad
    ],
    gallery: [
      images.yurtsSunset,
      images.kyzartHorses,
      images.alpineLake,
      images.yurtNight,
      images.heroYurts
    ],
    departures: [
      { date: "2026-09-19", seatsLeft: 4, priceEur: 890 },
      { date: "2026-10-03", seatsLeft: 9, priceEur: 850 },
      { date: "2027-05-22", seatsLeft: 12, priceEur: 890 },
      { date: "2027-06-12", seatsLeft: 11, priceEur: 930 }
    ]
  },
  {
    slug: "song-kol-nomad-life",
    featured: true,
    destinations: ["song-kol", "bishkek"],
    groupSizeMax: 10,
    difficulty: "easy",
    style: "group",
    seasons: ["summer"],
    priceEur: 560,
    rating: 4.8,
    reviewCount: 94,
    heroImage: images.songKol,
    cardImage: images.yurtsSunset,
    dayImages: [
      images.bishkekSunset,
      images.kyzartHorses,
      images.songKol,
      images.bishkekRoad
    ],
    gallery: [
      images.songKol,
      images.yurtNight,
      images.kyzartHorses,
      images.yurtsSunset,
      images.kilemche
    ],
    departures: [
      { date: "2026-09-14", seatsLeft: 2, priceEur: 560 },
      { date: "2026-09-28", seatsLeft: 7, priceEur: 540 },
      { date: "2027-06-07", seatsLeft: 10, priceEur: 580 }
    ]
  },
  {
    slug: "kel-suu-expedition",
    featured: true,
    destinations: ["kel-suu", "song-kol", "bishkek"],
    groupSizeMax: 8,
    difficulty: "challenging",
    style: "expedition",
    seasons: ["summer"],
    priceEur: 1290,
    rating: 4.9,
    reviewCount: 61,
    heroImage: images.kelSuu,
    cardImage: images.kelSuu,
    dayImages: [
      images.bishkekSunset,
      images.kilemche,
      images.songKol,
      images.bishkekRoad,
      images.kelSuu,
      images.alpineLake,
      images.heroYurts
    ],
    gallery: [
      images.kelSuu,
      images.alpineLake,
      images.yurtNight,
      images.kilemche,
      images.heroYurts
    ],
    departures: [
      { date: "2026-09-21", seatsLeft: 3, priceEur: 1290 },
      { date: "2027-07-05", seatsLeft: 8, priceEur: 1290 },
      { date: "2027-08-02", seatsLeft: 6, priceEur: 1340 }
    ]
  },
  {
    slug: "issyk-kul-and-jeti-oguz",
    featured: false,
    destinations: ["issyk-kul", "jeti-oguz", "bishkek"],
    groupSizeMax: 14,
    difficulty: "easy",
    style: "group",
    seasons: ["spring", "summer", "autumn"],
    priceEur: 740,
    oldPriceEur: 820,
    rating: 4.7,
    reviewCount: 152,
    heroImage: images.alpineLake,
    cardImage: images.alpineLake,
    dayImages: [
      images.bishkekSunset,
      images.alpineLake,
      images.kilemche,
      images.kyzartHorses,
      images.bishkekRoad
    ],
    gallery: [
      images.alpineLake,
      images.kilemche,
      images.yurtsSunset,
      images.bishkekSunset,
      images.kyzartHorses
    ],
    departures: [
      { date: "2026-09-12", seatsLeft: 6, priceEur: 740 },
      { date: "2026-10-10", seatsLeft: 14, priceEur: 690 },
      { date: "2027-05-08", seatsLeft: 14, priceEur: 740 }
    ]
  },
  {
    slug: "silk-road-osh-and-pamir",
    featured: false,
    destinations: ["osh-and-pamir", "bishkek", "song-kol"],
    groupSizeMax: 8,
    difficulty: "challenging",
    style: "expedition",
    seasons: ["summer", "autumn"],
    priceEur: 1680,
    rating: 4.8,
    reviewCount: 43,
    heroImage: images.kilemche,
    cardImage: images.kilemche,
    dayImages: [
      images.bishkekSunset,
      images.songKol,
      images.kilemche,
      images.alpineLake,
      images.bishkekRoad,
      images.heroYurts,
      images.yurtsSunset,
      images.kelSuu,
      images.yurtNight
    ],
    gallery: [
      images.kilemche,
      images.bishkekRoad,
      images.heroYurts,
      images.kelSuu,
      images.alpineLake
    ],
    departures: [
      { date: "2026-09-26", seatsLeft: 2, priceEur: 1680 },
      { date: "2027-07-17", seatsLeft: 8, priceEur: 1680 },
      { date: "2027-08-21", seatsLeft: 8, priceEur: 1720 }
    ]
  },
  {
    slug: "winter-eagle-hunters",
    featured: false,
    destinations: ["issyk-kul", "bishkek"],
    groupSizeMax: 6,
    difficulty: "moderate",
    style: "private",
    seasons: ["winter"],
    priceEur: 820,
    rating: 4.9,
    reviewCount: 37,
    heroImage: images.yurtNight,
    cardImage: images.yurtNight,
    dayImages: [
      images.bishkekSunset,
      images.kyzartHorses,
      images.alpineLake,
      images.yurtNight,
      images.bishkekRoad
    ],
    gallery: [
      images.yurtNight,
      images.kyzartHorses,
      images.alpineLake,
      images.bishkekSunset,
      images.yurtsSunset
    ],
    departures: [
      { date: "2027-01-16", seatsLeft: 4, priceEur: 820 },
      { date: "2027-02-06", seatsLeft: 6, priceEur: 820 },
      { date: "2027-02-27", seatsLeft: 6, priceEur: 790 }
    ]
  }
];

export const tourSlugs = tours.map((tour) => tour.slug);

export function getTour(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug);
}

export function tourDuration(tour: Tour): number {
  return tour.dayImages.length;
}

export function getFeaturedTours(limit = 3): Tour[] {
  return tours.filter((tour) => tour.featured).slice(0, limit);
}

export function getToursByDestination(destinationSlug: string): Tour[] {
  return tours.filter((tour) => tour.destinations.includes(destinationSlug));
}

/**
 * Tours sharing a region with `tour`, topped up with the remaining tours so the
 * related rail is never short.
 */
export function getRelatedTours(tour: Tour, limit = 3): Tour[] {
  const others = tours.filter((candidate) => candidate.slug !== tour.slug);
  const sameRegion = others.filter((candidate) =>
    candidate.destinations.some((slug) => tour.destinations.includes(slug))
  );
  const rest = others.filter((candidate) => !sameRegion.includes(candidate));

  return [...sameRegion, ...rest].slice(0, limit);
}

export const priceRange = {
  min: Math.min(...tours.map((tour) => tour.priceEur)),
  max: Math.max(...tours.map((tour) => tour.priceEur))
};

/** The itinerary teased on the home page comes from the flagship tour. */
export const homeTour = tours[0];

export const galleryImages: ImageAsset[] = [
  images.yurtsSunset,
  images.kyzartHorses,
  images.alpineLake,
  images.yurtNight,
  images.heroYurts
];

export const featureImage: ImageAsset = images.kelSuu;

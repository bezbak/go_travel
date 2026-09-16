/**
 * Content loader for the Django backend.
 *
 * Every payload arrives already translated into one locale, so components take
 * plain strings instead of message keys. Photo `src` values come back relative
 * to the backend (`/media/...`) and are made absolute here, because `next/image`
 * has to fetch them from the API host.
 */

import type { Locale } from "@/i18n/routing";

/** Where Django runs. Override with API_BASE_URL in the environment. */
export const apiOrigin = (
  process.env.API_BASE_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

/** Editor changes show up within this many seconds without a rebuild. */
const REVALIDATE_SECONDS = 60;

export type ApiImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type TourRegion = {
  slug: string;
  name: string;
};

export type TourSummary = {
  slug: string;
  featured: boolean;
  name: string;
  tagline: string;
  summary: string;
  destinations: TourRegion[];
  groupSizeMax: number;
  difficulty: "easy" | "moderate" | "challenging";
  style: "group" | "private" | "expedition";
  seasons: string[];
  priceEur: number;
  oldPriceEur: number | null;
  rating: number;
  reviewCount: number;
  days: number;
  cardImage: ApiImage | null;
};

export type ItineraryDay = {
  number: number;
  title: string;
  description: string;
  image: ApiImage | null;
};

export type Departure = {
  date: string;
  seatsLeft: number;
  priceEur: number;
};

export type TourNote = {
  title: string;
  description: string;
};

export type Tour = TourSummary & {
  heroImage: ApiImage | null;
  overview: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  notes: TourNote[];
  itinerary: ItineraryDay[];
  gallery: ApiImage[];
  departures: Departure[];
};

export type DestinationSummary = {
  slug: string;
  name: string;
  summary: string;
  altitudeM: number;
  driveHours: number;
  bestMonths: string;
  bestTime: string;
  tourCount: number;
  cardImage: ApiImage | null;
};

export type Destination = DestinationSummary & {
  heroImage: ApiImage | null;
  body: string[];
  highlights: string[];
  gallery: ApiImage[];
};

export type SiteContent = {
  contact: {
    phone: string;
    phoneHref: string;
    whatsapp: string;
    whatsappHref: string;
    instagramHref: string;
    email: string;
    addressLines: string[];
    mapQuery: string;
  } | null;
  heroImage: ApiImage | null;
  featureImage: ApiImage | null;
  stats: {
    years: string;
    travellers: string;
    tours: string;
    rating: string;
  } | null;
  gallery: ApiImage[];
  team: Array<{
    key: string;
    name: string;
    role: string;
    bio: string;
    image: ApiImage | null;
  }>;
  testimonials: Array<{
    key: string;
    name: string;
    country: string;
    tourSlug: string | null;
    rating: number;
    quote: string;
  }>;
  faq: Array<{ key: string; question: string; answer: string }>;
};

export type PhotoLibrary = Record<string, ApiImage>;

function absolute(image: ApiImage | null): ApiImage | null {
  if (!image) {
    return null;
  }

  return image.src.startsWith("http")
    ? image
    : { ...image, src: `${apiOrigin}${image.src}` };
}

/** Walks a payload and rewrites every image `src` to an absolute URL. */
function resolveImages<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => resolveImages(item)) as T;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.src === "string" && typeof record.width === "number") {
      return absolute(record as unknown as ApiImage) as T;
    }

    return Object.fromEntries(
      Object.entries(record).map(([key, item]) => [key, resolveImages(item)])
    ) as T;
  }

  return value;
}

/**
 * A production build renders ~80 pages across parallel workers, which is more
 * than Django's development server accepts at once; a short retry smooths over
 * the refused connections instead of failing the whole build.
 */
async function fetchWithRetry(url: string, attempts = 4): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw lastError;
}

async function get<T>(path: string, locale: Locale): Promise<T> {
  const separator = path.includes("?") ? "&" : "?";
  const url = `${apiOrigin}/api${path}${separator}locale=${locale}`;
  const response = await fetchWithRetry(url);

  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`);
  }

  return resolveImages((await response.json()) as T);
}

/** Returns `null` instead of throwing when the record is not in the CMS. */
async function getOrNull<T>(path: string, locale: Locale): Promise<T | null> {
  try {
    return await get<T>(path, locale);
  } catch (error) {
    if (error instanceof Error && error.message.includes("responded 404")) {
      return null;
    }

    throw error;
  }
}

export function getTours(locale: Locale) {
  return get<TourSummary[]>("/tours/", locale);
}

export function getFeaturedTours(locale: Locale) {
  return get<TourSummary[]>("/tours/?featured=1", locale);
}

export function getTour(locale: Locale, slug: string) {
  return getOrNull<Tour>(`/tours/${slug}/`, locale);
}

export function getDestinations(locale: Locale) {
  return get<DestinationSummary[]>("/destinations/", locale);
}

export function getDestination(locale: Locale, slug: string) {
  return getOrNull<Destination>(`/destinations/${slug}/`, locale);
}

export function getSiteContent(locale: Locale) {
  return get<SiteContent>("/site/", locale);
}

export function getPhotos(locale: Locale) {
  return get<PhotoLibrary>("/photos/", locale);
}

/**
 * Deduplicates the slug lookup within one build without surviving it.
 *
 * `unstable_cache` would persist to `.next/cache` and hand the next build the
 * previous list, so a tour added in the admin would not be prerendered until
 * the entry expired — the pages worked, but only by rendering on demand. A
 * plain module-level map gives the same one-request-per-kind saving and starts
 * empty in every build process.
 */
const buildSlugCache = new Map<string, Promise<string[]>>();

/**
 * Slugs for `generateStaticParams`. A build with the backend down still has to
 * succeed, so an unreachable API yields no prerendered paths and the pages are
 * rendered on demand instead.
 */
export function getBuildSlugs(kind: "tours" | "destinations") {
  const cached = buildSlugCache.get(kind);

  if (cached) {
    return cached;
  }

  const pending = (async () => {
    try {
      const response = await fetch(`${apiOrigin}/api/${kind}/?locale=en`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      const items = (await response.json()) as Array<{ slug: string }>;
      return items.map((item) => item.slug);
    } catch {
      console.warn(
        `[api] ${apiOrigin} unreachable — /${kind} pages will render on demand.`
      );
      buildSlugCache.delete(kind);
      return [];
    }
  })();

  buildSlugCache.set(kind, pending);
  return pending;
}

/** The tour whose itinerary the home page showcases. */
export async function getHomeTour(locale: Locale): Promise<Tour | null> {
  const featured = await getFeaturedTours(locale);
  const first = featured[0];

  return first ? getTour(locale, first.slug) : null;
}

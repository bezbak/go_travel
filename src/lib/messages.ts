type RawReader = {
  raw: (key: string) => unknown;
};

/**
 * next-intl exposes array messages through `t.raw`, which is untyped. Every
 * list on the site (highlights, itinerary days, included items…) goes through
 * this helper so a missing or malformed key renders an empty list instead of
 * throwing during a static build.
 */
export function rawList<T>(t: RawReader, key: string): T[] {
  let value: unknown;

  try {
    value = t.raw(key);
  } catch {
    return [];
  }

  return Array.isArray(value) ? (value as T[]) : [];
}

"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { destinationSlugs } from "@/data/destinations";
import { tourDuration, type Tour } from "@/data/tours";

import { TourCard } from "./TourCard";

const difficulties = ["easy", "moderate", "challenging"] as const;
const styles = ["group", "private", "expedition"] as const;
const durations = ["short", "medium", "long"] as const;
const sorts = ["recommended", "priceAsc", "priceDesc", "durationAsc"] as const;

type DurationBucket = (typeof durations)[number];
type SortKey = (typeof sorts)[number];

const ANY = "any";

function matchesDuration(days: number, bucket: string): boolean {
  if (bucket === ANY) {
    return true;
  }

  const value = bucket as DurationBucket;

  if (value === "short") {
    return days <= 4;
  }

  if (value === "medium") {
    return days >= 5 && days <= 7;
  }

  return days >= 8;
}

type ToursExplorerProps = {
  tours: Tour[];
};

export function ToursExplorer({ tours }: ToursExplorerProps) {
  const t = useTranslations();
  const [destination, setDestination] = useState<string>(ANY);
  const [difficulty, setDifficulty] = useState<string>(ANY);
  const [style, setStyle] = useState<string>(ANY);
  const [duration, setDuration] = useState<string>(ANY);
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = useMemo(() => {
    const result = tours.filter((tour) => {
      if (destination !== ANY && !tour.destinations.includes(destination)) {
        return false;
      }

      if (difficulty !== ANY && tour.difficulty !== difficulty) {
        return false;
      }

      if (style !== ANY && tour.style !== style) {
        return false;
      }

      return matchesDuration(tourDuration(tour), duration);
    });

    const sorted = [...result];

    if (sort === "priceAsc") {
      sorted.sort((a, b) => a.priceEur - b.priceEur);
    } else if (sort === "priceDesc") {
      sorted.sort((a, b) => b.priceEur - a.priceEur);
    } else if (sort === "durationAsc") {
      sorted.sort((a, b) => tourDuration(a) - tourDuration(b));
    } else {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }

    return sorted;
  }, [tours, destination, difficulty, style, duration, sort]);

  const filtersActive =
    destination !== ANY || difficulty !== ANY || style !== ANY || duration !== ANY;

  function resetFilters() {
    setDestination(ANY);
    setDifficulty(ANY);
    setStyle(ANY);
    setDuration(ANY);
  }

  return (
    <div>
      <div className="rounded-[18px] border border-[#e7e2d9] bg-white p-[18px] shadow-[0_10px_30px_rgba(23,23,23,0.04)] sm:p-[22px]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" className="size-[16px] text-[#6a9d17]" />
          <h2 className="font-display text-[13px] font-black uppercase tracking-[0.04em] text-[#171717]">
            {t("toursPage.filtersTitle")}
          </h2>
        </div>

        <div className="mt-[16px] grid gap-[14px] sm:grid-cols-2 xl:grid-cols-5">
          <FilterSelect
            id="filter-destination"
            label={t("toursPage.filters.destination")}
            options={[
              { value: ANY, label: t("toursPage.filters.anyDestination") },
              ...destinationSlugs.map((slug) => ({
                value: slug,
                label: t(`destinations.${slug}.name`)
              }))
            ]}
            value={destination}
            onChange={setDestination}
          />
          <FilterSelect
            id="filter-duration"
            label={t("toursPage.filters.duration")}
            options={[
              { value: ANY, label: t("toursPage.filters.anyDuration") },
              ...durations.map((bucket) => ({
                value: bucket,
                label: t(`toursPage.filters.durationOptions.${bucket}`)
              }))
            ]}
            value={duration}
            onChange={setDuration}
          />
          <FilterSelect
            id="filter-difficulty"
            label={t("toursPage.filters.difficulty")}
            options={[
              { value: ANY, label: t("toursPage.filters.anyDifficulty") },
              ...difficulties.map((level) => ({
                value: level,
                label: t(`common.difficultyLevel.${level}`)
              }))
            ]}
            value={difficulty}
            onChange={setDifficulty}
          />
          <FilterSelect
            id="filter-style"
            label={t("toursPage.filters.style")}
            options={[
              { value: ANY, label: t("toursPage.filters.anyStyle") },
              ...styles.map((item) => ({
                value: item,
                label: t(`common.style.${item}`)
              }))
            ]}
            value={style}
            onChange={setStyle}
          />
          <FilterSelect
            id="filter-sort"
            label={t("toursPage.filters.sort")}
            options={sorts.map((item) => ({
              value: item,
              label: t(`toursPage.filters.sortOptions.${item}`)
            }))}
            value={sort}
            onChange={(value) => setSort(value as SortKey)}
          />
        </div>
      </div>

      <div className="mt-[24px] flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-[13px] font-semibold text-[#4f4f4f]">
          {t("toursPage.resultCount", { count: filtered.length })}
        </p>
        {filtersActive ? (
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-[#dcd7cb] px-[14px] py-[7px] text-[12px] font-bold text-[#4f4f4f] transition duration-200 hover:border-[#6a9d17] hover:text-[#669a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17]"
            type="button"
            onClick={resetFilters}
          >
            <X aria-hidden="true" className="size-3.5" />
            {t("toursPage.clearFilters")}
          </button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-[22px] grid gap-[22px] sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="mt-[22px] rounded-[18px] border border-dashed border-[#d8d3c7] bg-[#faf8f2] px-6 py-[54px] text-center">
          <p className="font-display text-[18px] font-black uppercase text-[#171717]">
            {t("toursPage.emptyTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-[420px] text-[13px] font-medium text-[#5f5f5f]">
            {t("toursPage.emptyBody")}
          </p>
          <Button className="mt-6" size="sm" type="button" onClick={resetFilters}>
            {t("toursPage.clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}

type FilterSelectProps = {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
};

function FilterSelect({ id, label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="grid gap-1.5">
      <label
        className="font-display text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#7a7a7a]"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        className="h-[46px] w-full rounded-[10px] border border-[#ded9cd] bg-[#faf8f2] px-3 text-[13px] font-semibold text-[#171717] transition duration-200 focus:border-[#6a9d17] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6a9d17]"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

import seed from "@/data/seed/days-2026.json";
import coverage from "@/data/seed/coverage-2026.json";
import type {
  DayDetail,
  DaySummary,
  Locale,
  LocalizedString,
} from "@/lib/types";

const SEED_YEAR = 2026;

type SeedDay = {
  date: string;
  title: LocalizedString;
  subtitle: LocalizedString | null;
  rank: DayDetail["rank"];
  fasting: DayDetail["fasting"];
  civilHoliday: boolean;
  roNational?: boolean;
  iconUrl: string | null;
  synaxar: LocalizedString;
  readings: DayDetail["readings"];
  weddingsAllowed: boolean;
  memorialsAllowed: boolean;
  sourceRevision: string;
  meta?: {
    titleSource?: string;
    major?: boolean;
    provisionalSynaxar?: boolean;
    provisionalReadings?: boolean;
  };
};

const DAYS = (seed as { days: SeedDay[] }).days;

function pickLocalized(s: LocalizedString, locale: Locale): string {
  return s[locale];
}

function toDetail(d: SeedDay): DayDetail {
  return {
    date: d.date,
    title: d.title,
    subtitle: d.subtitle,
    rank: d.rank,
    fasting: d.fasting,
    civilHoliday: d.civilHoliday,
    iconUrl: d.iconUrl,
    synaxar: d.synaxar,
    readings: d.readings,
    weddingsAllowed: d.weddingsAllowed,
    memorialsAllowed: d.memorialsAllowed,
    sourceRevision: d.sourceRevision,
  };
}

let cache: DayDetail[] | null = null;

export function getSeedYear(): number {
  return SEED_YEAR;
}

export function getPaschaDate(): string {
  return (seed as { pascha: string }).pascha;
}

export function getCoverage() {
  return coverage;
}

export function getAllDays(): DayDetail[] {
  if (cache) return cache;
  cache = DAYS.map(toDetail);
  return cache;
}

export function getDay(iso: string): DayDetail | null {
  if (!iso.startsWith(String(SEED_YEAR))) return null;
  const found = DAYS.find((d) => d.date === iso);
  return found ? toDetail(found) : null;
}

export function getMonthDays(yearMonth: string): DaySummary[] {
  return DAYS.filter((d) => d.date.startsWith(yearMonth)).map((d) => ({
    date: d.date,
    title: d.title,
    rank: d.rank,
    fasting: d.fasting,
    civilHoliday: d.civilHoliday,
    iconUrl: d.iconUrl,
  }));
}

export function localizeDaySummary(
  day: DaySummary,
  locale: Locale
): Omit<DaySummary, "title"> & { title: string } {
  return {
    ...day,
    title: pickLocalized(day.title, locale),
  };
}

export function localizeDayDetail(
  day: DayDetail,
  locale: Locale
): Omit<DayDetail, "title" | "subtitle" | "synaxar" | "readings"> & {
  title: string;
  subtitle: string | null;
  synaxar: string;
  readings: Array<{
    type: DayDetail["readings"][number]["type"];
    citation: string;
  }>;
} {
  return {
    date: day.date,
    title: pickLocalized(day.title, locale),
    subtitle: day.subtitle ? pickLocalized(day.subtitle, locale) : null,
    rank: day.rank,
    fasting: day.fasting,
    civilHoliday: day.civilHoliday,
    iconUrl: day.iconUrl,
    synaxar: pickLocalized(day.synaxar, locale),
    readings: day.readings.map((r) => ({
      type: r.type,
      citation: pickLocalized(r.citation, locale),
    })),
    weddingsAllowed: day.weddingsAllowed,
    memorialsAllowed: day.memorialsAllowed,
    sourceRevision: day.sourceRevision,
  };
}

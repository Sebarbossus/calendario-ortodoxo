export type Locale = "es" | "pt" | "en";

/** Feast rank color hierarchy (BOR-aligned visual cue). */
export type FeastRank = "red" | "blue" | "black" | "sunday";

/** Fasting labels (Romanian Post / Harți glossed for ES/PT/EN). */
export type FastingKind =
  | "none"
  | "fast"
  | "dairy"
  | "fish"
  | "wine_oil"
  | "strict";

export interface LocalizedString {
  es: string;
  pt: string;
  en: string;
}

export interface ReadingCitation {
  type: "epistle" | "gospel" | "matins";
  citation: LocalizedString;
}

export interface DaySummary {
  date: string; // YYYY-MM-DD
  title: LocalizedString;
  rank: FeastRank;
  fasting: FastingKind;
  civilHoliday: boolean;
  iconUrl: string | null;
}

export interface DayDetail extends DaySummary {
  subtitle: LocalizedString | null;
  synaxar: LocalizedString;
  readings: ReadingCitation[];
  weddingsAllowed: boolean;
  memorialsAllowed: boolean;
  sourceRevision: string;
}

export interface MonthPayload {
  locale: Locale;
  yearMonth: string; // YYYY-MM
  days: DaySummary[];
}

export interface DayPayload {
  locale: Locale;
  day: DayDetail;
}

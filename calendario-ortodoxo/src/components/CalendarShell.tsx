"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DayDetailDrawer,
  type LocalizedDayDetail,
} from "@/components/DayDetailDrawer";
import type { FastingKind, FeastRank } from "@/lib/types";
import styles from "./CalendarShell.module.css";

interface MonthDay {
  date: string;
  title: string;
  rank: FeastRank;
  fasting: FastingKind;
  civilHoliday: boolean;
  iconUrl: string | null;
}

interface Props {
  initialYear: number;
  initialMonth: number; // 1-12
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function yearMonth(year: number, month: number): string {
  return `${year}-${pad(month)}`;
}

function weekdayShort(iso: string, localeTag: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(localeTag, {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

const LOCALE_TAGS: Record<string, string> = {
  es: "es-ES",
  pt: "pt-PT",
  en: "en-GB",
};

export function CalendarShell({ initialYear, initialMonth }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const localeTag = LOCALE_TAGS[locale] ?? "es-ES";

  const [year] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [days, setDays] = useState<MonthDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LocalizedDayDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const ym = useMemo(() => yearMonth(year, month), [year, month]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/v1/${locale}/months/${ym}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setDays(data.days ?? []);
      })
      .catch(() => {
        if (!cancelled) setDays([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale, ym]);

  const openDay = useCallback(
    async (date: string) => {
      const res = await fetch(`/api/v1/${locale}/days/${date}`);
      if (!res.ok) return;
      const data = await res.json();
      setSelected(data.day as LocalizedDayDetail);
      setDrawerOpen(true);
    },
    [locale]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const goToday = useCallback(() => {
    const now = new Date();
    const y = now.getFullYear();
    if (y === year) {
      setMonth(now.getMonth() + 1);
      void openDay(
        `${y}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
      );
    }
  }, [openDay, year]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={styles.shell}>
      <aside className={styles.rail} aria-label={t("calendar.selectMonth")}>
        <div className={styles.yearLabel}>{t("calendar.year", { year })}</div>
        <ul className={styles.monthList}>
          {months.map((m) => (
            <li key={m}>
              <button
                type="button"
                className={styles.monthBtn}
                data-active={m === month ? "true" : "false"}
                onClick={() => setMonth(m)}
              >
                {t(`months.${m}`)}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.main}>
        <div className={styles.pills} aria-label={t("calendar.selectMonth")}>
          {months.map((m) => (
            <button
              key={m}
              type="button"
              className={styles.pill}
              data-active={m === month ? "true" : "false"}
              onClick={() => setMonth(m)}
            >
              {t(`months.${m}`)}
            </button>
          ))}
        </div>

        <div className={styles.monthHeading}>
          <h1>
            {t(`months.${month}`)} {year}
          </h1>
          <button type="button" className={styles.todayBtn} onClick={goToday}>
            {t("calendar.today")}
          </button>
        </div>

        {loading ? (
          <p className={styles.stub}>…</p>
        ) : (
          <ul className={styles.dayList}>
            {days.map((day) => (
              <li key={day.date}>
                <button
                  type="button"
                  className={styles.dayRow}
                  data-selected={
                    selected?.date === day.date && drawerOpen ? "true" : "false"
                  }
                  onClick={() => void openDay(day.date)}
                  aria-label={`${day.date}: ${day.title}`}
                >
                  <span className={styles.dayDate}>
                    <strong>{Number(day.date.slice(8))}</strong>
                    {weekdayShort(day.date, localeTag)}
                  </span>
                  <span className={styles.dayTitle} data-rank={day.rank}>
                    {day.title}
                  </span>
                  <span className={styles.badges}>
                    {day.fasting !== "none" ? (
                      <span className={styles.badge} data-tone="fast">
                        {t(`fasting.${day.fasting}`)}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.stub}>{t("calendar.stubNote")}</p>
      </div>

      <DayDetailDrawer
        open={drawerOpen}
        day={selected}
        onClose={closeDrawer}
      />
    </div>
  );
}

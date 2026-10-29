"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { FastingKind, FeastRank } from "@/lib/types";
import styles from "./DayDetailDrawer.module.css";

const LOCALE_TAGS: Record<string, string> = {
  es: "es-ES",
  pt: "pt-PT",
  en: "en-GB",
};

export interface LocalizedDayDetail {
  date: string;
  title: string;
  subtitle: string | null;
  rank: FeastRank;
  fasting: FastingKind;
  civilHoliday: boolean;
  iconUrl: string | null;
  synaxar: string;
  readings: Array<{ type: "epistle" | "gospel" | "matins"; citation: string }>;
  weddingsAllowed: boolean;
  memorialsAllowed: boolean;
  sourceRevision: string;
}

interface Props {
  open: boolean;
  day: LocalizedDayDetail | null;
  onClose: () => void;
}

function formatLongDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function DayDetailDrawer({ open, day, onClose }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const htmlLang = LOCALE_TAGS[locale] ?? "es-ES";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={styles.backdrop}
        data-open={open ? "true" : "false"}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={styles.drawer}
        data-open={open ? "true" : "false"}
        role="dialog"
        aria-modal="true"
        aria-label={day?.title ?? t("calendar.openDay")}
        aria-hidden={!open}
      >
        {day ? (
          <>
            <div className={styles.head}>
              <div>
                <div className={styles.dateLabel}>
                  {formatLongDate(day.date, htmlLang)}
                </div>
                <h2 className={styles.title} data-rank={day.rank}>
                  {day.title}
                </h2>
              </div>
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label={t("calendar.close")}
              >
                ×
              </button>
            </div>
            <div className={styles.body}>
              {day.iconUrl ? (
                <div className={styles.iconWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={day.iconUrl} alt={t("calendar.iconAlt")} width={88} height={88} />
                </div>
              ) : null}

              <dl className={styles.meta}>
                <div className={styles.metaRow}>
                  <dt>{t("calendar.rank")}</dt>
                  <dd>{t(`rank.${day.rank}`)}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>{t("calendar.fasting")}</dt>
                  <dd>{t(`fasting.${day.fasting}`)}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>{t("calendar.weddings")}</dt>
                  <dd>
                    {day.weddingsAllowed
                      ? t("calendar.allowed")
                      : t("calendar.notAllowed")}
                  </dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>{t("calendar.memorials")}</dt>
                  <dd>
                    {day.memorialsAllowed
                      ? t("calendar.allowed")
                      : t("calendar.notAllowed")}
                  </dd>
                </div>
              </dl>

              <section className={styles.section}>
                <h3>{t("calendar.synaxar")}</h3>
                <p>{day.synaxar}</p>
              </section>

              <section className={styles.section}>
                <h3>{t("calendar.readings")}</h3>
                <ul>
                  {day.readings.map((r) => (
                    <li key={`${r.type}-${r.citation}`}>
                      <strong>{r.type}:</strong> {r.citation}
                    </li>
                  ))}
                </ul>
              </section>

              <p className={styles.note}>{t("calendar.stubNote")}</p>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}

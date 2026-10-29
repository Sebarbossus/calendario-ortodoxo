"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "./SiteHeader.module.css";

const LOCALES = ["es", "pt", "en"] as const;

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandName}>{t("meta.title")}</span>
        <span className={styles.brandTag}>{t("disclaimer.short")}</span>
      </Link>
      <nav className={styles.nav} aria-label="Primary">
        <Link href="/" data-active={pathname === "/" ? "true" : "false"}>
          {t("nav.calendar")}
        </Link>
        <Link
          href="/about"
          data-active={pathname.startsWith("/about") ? "true" : "false"}
        >
          {t("nav.about")}
        </Link>
        <div className={styles.locales} aria-label={t("locale.label")}>
          {LOCALES.map((loc) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              data-active={locale === loc ? "true" : "false"}
              hrefLang={loc}
            >
              {loc.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

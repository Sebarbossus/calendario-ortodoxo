import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import styles from "./about.module.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <article className={styles.article}>
      <h1>{t("about.title")}</h1>
      <p>{t("about.body")}</p>
      <p className={styles.disclaimer}>{t("disclaimer.long")}</p>
    </article>
  );
}

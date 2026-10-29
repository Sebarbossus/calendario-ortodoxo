import { getTranslations } from "next-intl/server";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const t = await getTranslations();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.mark}>{t("meta.title")}</p>
        <p className={styles.disclaimer}>{t("disclaimer.long")}</p>
      </div>
    </footer>
  );
}

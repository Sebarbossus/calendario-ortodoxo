import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Libre_Baskerville, Source_Sans_3, DM_Sans } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { routing } from "@/i18n/routing";
import "../globals.css";

const display = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-loaded",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-loaded",
  display: "swap",
});

const ui = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-ui-loaded",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale === "es" ? "es-ES" : locale === "pt" ? "pt-PT" : "en"}
      className={`${display.variable} ${body.variable} ${ui.variable}`}
    >
      <body
        style={
          {
            "--font-display": "var(--font-display-loaded), 'Palatino Linotype', Palatino, serif",
            "--font-body": "var(--font-body-loaded), 'Segoe UI', sans-serif",
            "--font-ui": "var(--font-ui-loaded), 'Segoe UI', sans-serif",
          } as CSSProperties
        }
      >
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

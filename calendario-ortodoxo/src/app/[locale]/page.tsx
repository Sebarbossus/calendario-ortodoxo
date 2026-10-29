import { setRequestLocale } from "next-intl/server";
import { CalendarShell } from "@/components/CalendarShell";
import { getSeedYear } from "@/data/calendar-data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const seedYear = getSeedYear();
  const now = new Date();
  const month =
    now.getFullYear() === seedYear ? now.getMonth() + 1 : 1;

  return <CalendarShell initialYear={seedYear} initialMonth={month} />;
}

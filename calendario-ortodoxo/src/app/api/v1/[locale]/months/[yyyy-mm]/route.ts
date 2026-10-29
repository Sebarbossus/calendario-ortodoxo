import { NextResponse } from "next/server";
import {
  getMonthDays,
  getSeedYear,
  localizeDaySummary,
} from "@/data/calendar-data";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/types";

type Params = { params: Promise<{ locale: string; "yyyy-mm": string }> };

function isLocale(v: string): v is Locale {
  return (routing.locales as readonly string[]).includes(v);
}

export async function GET(_req: Request, { params }: Params) {
  const { locale, "yyyy-mm": yearMonth } = await params;

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
    return NextResponse.json(
      { error: "Invalid year-month; expected YYYY-MM" },
      { status: 400 }
    );
  }

  const year = Number(yearMonth.slice(0, 4));
  if (year !== getSeedYear()) {
    return NextResponse.json(
      {
        error: `Only seeded year ${getSeedYear()} is available in Phase 0`,
        seedYear: getSeedYear(),
      },
      { status: 404 }
    );
  }

  const days = getMonthDays(yearMonth).map((d) =>
    localizeDaySummary(d, locale)
  );

  return NextResponse.json(
    {
      locale,
      yearMonth,
      days,
      meta: {
        sourceRevision: "seed-2026-full-v1",
        titlesCurated: true,
        synaxarProvisional: true,
        disclaimer:
          "Follows BOR calendar usage; not an official Romanian Patriarchate product.",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    }
  );
}

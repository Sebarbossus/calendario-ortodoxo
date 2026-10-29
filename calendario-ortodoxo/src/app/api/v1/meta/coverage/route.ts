import { NextResponse } from "next/server";
import { getCoverage, getPaschaDate, getSeedYear } from "@/data/calendar-data";

export async function GET() {
  return NextResponse.json({
    seedYear: getSeedYear(),
    pascha: getPaschaDate(),
    coverage: getCoverage(),
  });
}

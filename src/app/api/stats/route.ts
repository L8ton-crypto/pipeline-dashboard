import { NextResponse } from "next/server";
import { getStats } from "@/lib/db";
import { APP_COUNT } from "@/data/apps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ ...stats, appsShipped: APP_COUNT });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    // Soft fail: return zeros so the page can still render.
    return NextResponse.json({
      totalRuns: 0,
      shipped: 0,
      shippedLast7: 0,
      shippedLast30: 0,
      reviewed: 0,
      reviewPassed: 0,
      lastRunDate: null,
      appsShipped: APP_COUNT,
      error: msg,
    });
  }
}

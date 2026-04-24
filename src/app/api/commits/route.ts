import { NextResponse } from "next/server";
import { recentCommits } from "@/lib/github";

export const runtime = "nodejs";
// Cache the response at edge for 5 minutes via the underlying fetch revalidate.
export const revalidate = 300;

export async function GET() {
  try {
    const commits = await recentCommits();
    return NextResponse.json({ commits });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg, commits: [] }, { status: 200 });
  }
}

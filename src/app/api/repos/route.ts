import { NextResponse } from "next/server";
import { listRepos } from "@/lib/github";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  try {
    const repos = await listRepos();
    return NextResponse.json({ repos });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg, repos: [] }, { status: 200 });
  }
}

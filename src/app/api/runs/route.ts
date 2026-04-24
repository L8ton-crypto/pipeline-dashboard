import { NextResponse } from "next/server";
import { listRuns, insertRun } from "@/lib/db";
import { checkBearer } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "60", 10) || 60, 1), 200);
  try {
    const runs = await listRuns(limit);
    return NextResponse.json({ runs });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

type Body = {
  task_id?: string;
  task_title?: string;
  status?: string;
  app_name?: string;
  vercel_url?: string;
  repo_url?: string;
  commit_sha?: string;
  review_passed?: boolean;
  notes?: string;
  run_date?: string;
};

const ALLOWED_STATUS = new Set(["shipped", "blocked", "in-progress"]);

export async function POST(req: Request) {
  const auth = checkBearer(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
  }
  if (!body.task_title || typeof body.task_title !== "string") {
    return NextResponse.json({ error: "task_title is required" }, { status: 400 });
  }
  const status = (body.status || "shipped").toLowerCase();
  if (!ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ error: `status must be one of: ${[...ALLOWED_STATUS].join(", ")}` }, { status: 400 });
  }
  try {
    const run = await insertRun({
      task_id: body.task_id ?? null,
      task_title: body.task_title.slice(0, 500),
      status,
      app_name: body.app_name?.slice(0, 200) ?? null,
      vercel_url: body.vercel_url?.slice(0, 500) ?? null,
      repo_url: body.repo_url?.slice(0, 500) ?? null,
      commit_sha: body.commit_sha?.slice(0, 80) ?? null,
      review_passed: typeof body.review_passed === "boolean" ? body.review_passed : null,
      notes: body.notes?.slice(0, 2000) ?? null,
      run_date: body.run_date ?? null,
    });
    return NextResponse.json({ run }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

// Lazy SQL handle so build-time evaluation does not crash if the env var is
// missing. Only fail at call time, in a route, where the error is surfaced.
function getSql() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(connectionString);
}

let initPromise: Promise<void> | null = null;

export async function ensureDb(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS pipeline_runs (
          id SERIAL PRIMARY KEY,
          run_date DATE NOT NULL DEFAULT CURRENT_DATE,
          task_id TEXT,
          task_title TEXT NOT NULL,
          status TEXT NOT NULL,
          app_name TEXT,
          vercel_url TEXT,
          repo_url TEXT,
          commit_sha TEXT,
          review_passed BOOLEAN,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_pipeline_runs_date ON pipeline_runs (run_date DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs (status)`;
    })().catch((e) => {
      // Reset so a retry can occur on the next request.
      initPromise = null;
      throw e;
    });
  }
  return initPromise;
}

export type PipelineRun = {
  id: number;
  run_date: string;
  task_id: string | null;
  task_title: string;
  status: "shipped" | "blocked" | "in-progress" | string;
  app_name: string | null;
  vercel_url: string | null;
  repo_url: string | null;
  commit_sha: string | null;
  review_passed: boolean | null;
  notes: string | null;
  created_at: string;
};

export async function listRuns(limit = 60): Promise<PipelineRun[]> {
  await ensureDb();
  const sql = getSql();
  const rows = await sql`
    SELECT id, run_date, task_id, task_title, status, app_name, vercel_url,
           repo_url, commit_sha, review_passed, notes, created_at
      FROM pipeline_runs
      ORDER BY run_date DESC, id DESC
      LIMIT ${limit}
  `;
  return rows as unknown as PipelineRun[];
}

export type RunInput = {
  task_id?: string | null;
  task_title: string;
  status: string;
  app_name?: string | null;
  vercel_url?: string | null;
  repo_url?: string | null;
  commit_sha?: string | null;
  review_passed?: boolean | null;
  notes?: string | null;
  run_date?: string | null;
};

export async function insertRun(input: RunInput): Promise<PipelineRun> {
  await ensureDb();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO pipeline_runs (
      run_date, task_id, task_title, status, app_name, vercel_url,
      repo_url, commit_sha, review_passed, notes
    ) VALUES (
      COALESCE(${input.run_date ?? null}::date, CURRENT_DATE),
      ${input.task_id ?? null},
      ${input.task_title},
      ${input.status},
      ${input.app_name ?? null},
      ${input.vercel_url ?? null},
      ${input.repo_url ?? null},
      ${input.commit_sha ?? null},
      ${input.review_passed ?? null},
      ${input.notes ?? null}
    )
    RETURNING id, run_date, task_id, task_title, status, app_name, vercel_url,
              repo_url, commit_sha, review_passed, notes, created_at
  `;
  return rows[0] as unknown as PipelineRun;
}

export async function getStats() {
  await ensureDb();
  const sql = getSql();
  const totalRows = await sql`SELECT COUNT(*)::int AS c FROM pipeline_runs`;
  const shippedRows = await sql`SELECT COUNT(*)::int AS c FROM pipeline_runs WHERE status = 'shipped'`;
  const last7Rows = await sql`
    SELECT COUNT(*)::int AS c FROM pipeline_runs
    WHERE status = 'shipped' AND run_date >= CURRENT_DATE - INTERVAL '6 days'
  `;
  const last30Rows = await sql`
    SELECT COUNT(*)::int AS c FROM pipeline_runs
    WHERE status = 'shipped' AND run_date >= CURRENT_DATE - INTERVAL '29 days'
  `;
  const reviewRows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE review_passed IS NOT NULL)::int AS reviewed,
      COUNT(*) FILTER (WHERE review_passed = true)::int AS passed
    FROM pipeline_runs
  `;
  const lastRunRows = await sql`SELECT MAX(run_date)::text AS last_date FROM pipeline_runs`;

  return {
    totalRuns: totalRows[0].c as number,
    shipped: shippedRows[0].c as number,
    shippedLast7: last7Rows[0].c as number,
    shippedLast30: last30Rows[0].c as number,
    reviewed: (reviewRows[0].reviewed ?? 0) as number,
    reviewPassed: (reviewRows[0].passed ?? 0) as number,
    lastRunDate: (lastRunRows[0].last_date ?? null) as string | null,
  };
}

# Pipeline Dashboard

Public, live readout of L8's autonomous overnight build pipeline. Surfaces GitHub commits across `L8ton-crypto`, pipeline run history (logged from the overnight task), and the catalog of shipped apps.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind 4, dark mode, mobile-first
- Neon Postgres via `@neondatabase/serverless` (lazy `ensureDb()` pattern)
- `@vercel/analytics` + `@vercel/speed-insights`
- `next/og` for LinkedIn-shareable preview image at `/og`

## Routes

- `GET /` - dashboard
- `GET /og` - dynamic OG image with the headline stats
- `GET /api/runs?limit=N` - pipeline run history
- `POST /api/runs` - log a new run, requires `Authorization: Bearer $PIPELINE_API_KEY`
- `GET /api/commits` - latest commits across L8ton-crypto repos (cached 5 min)
- `GET /api/repos` - L8ton-crypto repo list (cached 5 min)
- `GET /api/stats` - aggregated stats

## Env vars

Set in Vercel project settings:

- `DATABASE_URL` - Neon pooled connection string
- `GITHUB_TOKEN` - PAT (read-only is fine) for higher GitHub rate limits
- `GITHUB_USERNAME` - defaults to `L8ton-crypto`
- `PIPELINE_API_KEY` - Bearer token for `POST /api/runs`. The overnight task uses this.
- `NEXT_PUBLIC_SITE_URL` - canonical site URL, used for OG metadata

## Logging a run from the overnight task

```bash
curl -X POST https://<deployed>/api/runs \
  -H "Authorization: Bearer $PIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "task-85",
    "task_title": "Overnight Pipeline Dashboard",
    "status": "shipped",
    "app_name": "Pipeline Dashboard",
    "vercel_url": "https://pipeline-dashboard.vercel.app",
    "commit_sha": "abc1234",
    "review_passed": true,
    "notes": "First build."
  }'
```

`status` must be one of `shipped`, `blocked`, `in-progress`. All other fields are optional. `run_date` defaults to today (UTC).

## Schema

Single table:

```sql
CREATE TABLE pipeline_runs (
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
);
```

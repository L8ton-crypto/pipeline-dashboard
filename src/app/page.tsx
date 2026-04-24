import { listRuns, getStats } from "@/lib/db";
import { recentCommits } from "@/lib/github";
import { APPS, APP_COUNT, type ShippedApp } from "@/data/apps";
import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { relTime, shortSha } from "@/lib/format";

export const dynamic = "force-dynamic";

type LoadedData = {
  runs: Awaited<ReturnType<typeof listRuns>>;
  commits: Awaited<ReturnType<typeof recentCommits>>;
  stats: Awaited<ReturnType<typeof getStats>>;
};

async function loadData(): Promise<LoadedData> {
  const [runsR, commitsR, statsR] = await Promise.allSettled([
    listRuns(50),
    recentCommits(),
    getStats(),
  ]);

  return {
    runs: runsR.status === "fulfilled" ? runsR.value : [],
    commits: commitsR.status === "fulfilled" ? commitsR.value : [],
    stats:
      statsR.status === "fulfilled"
        ? statsR.value
        : {
            totalRuns: 0,
            shipped: 0,
            shippedLast7: 0,
            shippedLast30: 0,
            reviewed: 0,
            reviewPassed: 0,
            lastRunDate: null,
          },
  };
}

export default async function Page() {
  const { runs, commits, stats } = await loadData();
  const reviewRate =
    stats.reviewed > 0 ? Math.round((stats.reviewPassed / stats.reviewed) * 100) : null;

  const lastRun = stats.lastRunDate ? new Date(stats.lastRunDate) : null;
  const lastRunRel = lastRun ? relTime(lastRun) : "no runs yet";

  const groupedApps = APPS.reduce<Record<string, ShippedApp[]>>((acc, app) => {
    (acc[app.category] ||= []).push(app);
    return acc;
  }, {});
  const categoryOrder: Array<keyof typeof groupedApps> = [
    "dev-tool",
    "family",
    "business",
    "client",
    "globe",
    "monitoring",
    "dashboard",
    "finance",
    "work",
    "games",
    "other",
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 pulse-dot" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">
            Pipeline live
          </span>
          <span className="ml-auto text-xs text-gray-500">last run: {lastRunRel}</span>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
          The portfolio <span className="text-emerald-400">IS</span> the product.
        </h1>
        <p className="max-w-2xl text-sm text-gray-400 sm:text-base">
          Live readout of the autonomous overnight build pipeline. Every night Opus picks the
          top kanban task, architects, builds, code-reviews, ships to Vercel, and reports.
          What you see below are the receipts.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Apps shipped" value={APP_COUNT} accent />
        <StatCard
          label="Shipped (7d)"
          value={stats.shippedLast7}
          sub={`of ${stats.totalRuns} total runs`}
        />
        <StatCard label="Shipped (30d)" value={stats.shippedLast30} />
        <StatCard
          label="Review pass rate"
          value={reviewRate === null ? "-" : `${reviewRate}%`}
          sub={stats.reviewed === 0 ? "no reviews logged" : `${stats.reviewed} reviewed`}
        />
      </section>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Recent pipeline runs
          </h2>
          {runs.length === 0 ? (
            <EmptyState
              title="No runs logged yet"
              body="The overnight task posts here when a build ships. The dashboard will fill in fast."
            />
          ) : (
            <ol className="space-y-3">
              {runs.slice(0, 12).map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 fade-in"
                >
                  <div className="flex items-start gap-3">
                    <StatusPill status={r.status} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-100">
                        {r.task_title}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span>{new Date(r.run_date).toISOString().slice(0, 10)}</span>
                        {r.app_name ? <span className="text-gray-400">{r.app_name}</span> : null}
                        {r.commit_sha ? (
                          <span className="font-mono">{shortSha(r.commit_sha)}</span>
                        ) : null}
                        {r.review_passed === true ? (
                          <span className="text-emerald-400">review pass</span>
                        ) : r.review_passed === false ? (
                          <span className="text-red-400">review fail</span>
                        ) : null}
                      </div>
                      {r.vercel_url ? (
                        <a
                          href={r.vercel_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs text-emerald-300 hover:text-emerald-200"
                        >
                          {r.vercel_url.replace(/^https?:\/\//, "")} -&gt;
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Latest commits
          </h2>
          {commits.length === 0 ? (
            <EmptyState
              title="No public commits returned"
              body="Either the GitHub API is rate-limited or no public repos were found."
            />
          ) : (
            <ol className="space-y-2">
              {commits.slice(0, 14).map((c) => (
                <li
                  key={`${c.repo}-${c.sha}`}
                  className="rounded-lg border border-gray-800 bg-gray-900/40 p-3"
                >
                  <a href={c.url} target="_blank" rel="noreferrer" className="block group">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-mono text-emerald-300 group-hover:text-emerald-200">
                        {c.repo}
                      </span>
                      <span className="text-gray-500">{relTime(c.date)}</span>
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm text-gray-200 group-hover:text-white">
                      {c.message}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-gray-500">
                      {shortSha(c.sha)}
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Apps in the portfolio ({APP_COUNT})
        </h2>
        <div className="space-y-6">
          {categoryOrder
            .filter((cat) => groupedApps[cat]?.length)
            .map((cat) => (
              <div key={cat}>
                <div className="mb-2 text-[11px] uppercase tracking-wider text-gray-500">
                  {cat.replace("-", " ")}
                </div>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedApps[cat]!.map((app) => (
                    <li key={app.slug}>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col gap-1 rounded-lg border border-gray-800 bg-gray-900/30 p-3 transition hover:border-emerald-500/40 hover:bg-gray-900/60"
                      >
                        <span className="text-sm font-semibold text-gray-100">{app.name}</span>
                        <span className="text-xs text-gray-400">{app.description}</span>
                        <span className="mt-1 truncate text-[11px] text-emerald-300/80">
                          {app.url.replace(/^https?:\/\//, "")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-gray-900 pt-6 text-center text-xs text-gray-600">
        Built by L8 - <a className="text-emerald-400 hover:text-emerald-300" href="https://github.com/L8ton-crypto" target="_blank" rel="noreferrer">github.com/L8ton-crypto</a>
        <span className="mx-2 text-gray-700">|</span>
        AI architect available for consulting -{" "}
        <a className="text-emerald-400 hover:text-emerald-300" href="https://www.linkedin.com" target="_blank" rel="noreferrer">linkedin</a>
      </footer>
    </main>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/20 p-6 text-center">
      <div className="text-sm font-medium text-gray-300">{title}</div>
      <div className="mt-1 text-xs text-gray-500">{body}</div>
    </div>
  );
}

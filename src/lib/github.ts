// Server-side GitHub helpers. Token never leaves the server.

const GH_USER = process.env.GITHUB_USERNAME || "L8ton-crypto";
const GH_TOKEN = process.env.GITHUB_TOKEN;

const baseHeaders: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}),
};

export type GhRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  stargazers_count: number;
  language: string | null;
  archived: boolean;
  private: boolean;
};

export type GhCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
  repo: string;
};

async function ghFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: baseHeaders,
    // Cache at edge for 5 minutes; the dashboard does not need real-time.
    next: { revalidate: 300 },
  });
}

export async function listRepos(): Promise<GhRepo[]> {
  const url = `https://api.github.com/users/${encodeURIComponent(GH_USER)}/repos?per_page=100&sort=pushed`;
  const r = await ghFetch(url);
  if (!r.ok) {
    return [];
  }
  const data = (await r.json()) as GhRepo[];
  return data
    .filter((repo) => !repo.private)
    .map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      pushed_at: repo.pushed_at,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      archived: repo.archived,
      private: repo.private,
    }));
}

// Recent commits across all repos. Caps at MAX_REPOS to keep request count low.
const MAX_REPOS = 12;

export async function recentCommits(perRepo = 3): Promise<GhCommit[]> {
  const repos = await listRepos();
  const targets = repos.filter((r) => !r.archived).slice(0, MAX_REPOS);

  const results = await Promise.allSettled(
    targets.map(async (repo) => {
      const r = await ghFetch(
        `https://api.github.com/repos/${repo.full_name}/commits?per_page=${perRepo}`,
      );
      if (!r.ok) return [];
      const list = (await r.json()) as Array<{
        sha: string;
        commit: { message: string; author: { date: string } };
        html_url: string;
      }>;
      return list.map<GhCommit>((c) => ({
        sha: c.sha,
        message: (c.commit.message || "").split("\n")[0],
        date: c.commit.author.date,
        url: c.html_url,
        repo: repo.name,
      }));
    }),
  );

  const all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  all.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
  return all.slice(0, 30);
}

import { githubFetch } from "./client";
import type { RepositoryOwner, RepositoryStats, RepositorySummary } from "@/types/repository";

interface RawGitHubRepo {
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
  };
  description: string | null;
  html_url: string;
  default_branch: string;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  topics?: string[];
}

export async function fetchRepositoryMetadata(
  owner: string,
  repo: string
): Promise<{ summary: RepositorySummary; stats: RepositoryStats }> {
  const raw = await githubFetch<RawGitHubRepo>(`/repos/${owner}/${repo}`);

  const ownerData: RepositoryOwner = {
    login: raw.owner.login,
    avatarUrl: raw.owner.avatar_url,
    htmlUrl: raw.owner.html_url,
    type: raw.owner.type,
  };

  const summary: RepositorySummary = {
    name: raw.name,
    fullName: raw.full_name,
    owner: ownerData,
    description: raw.description,
    htmlUrl: raw.html_url,
    defaultBranch: raw.default_branch,
    language: raw.language,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,
    topics: raw.topics || [],
  };

  const createdDate = new Date(raw.created_at);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - createdDate.getTime());
  const projectAgeDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const projectAgeYears = Number((projectAgeDays / 365.25).toFixed(1));

  const stats: RepositoryStats = {
    stargazersCount: raw.stargazers_count,
    forksCount: raw.forks_count,
    openIssuesCount: raw.open_issues_count,
    sizeKb: raw.size,
    projectAgeDays,
    projectAgeYears,
  };

  return { summary, stats };
}

import { githubFetch } from "./client";
import type { CommitItem } from "@/types/repository";

interface RawGitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      email?: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  stats?: {
    additions?: number;
    deletions?: number;
    total?: number;
  };
  files?: Array<unknown>;
}

export async function fetchCommitHistory(
  owner: string,
  repo: string,
  perPage = 30,
  page = 1
): Promise<CommitItem[]> {
  const rawList = await githubFetch<RawGitHubCommit[]>(
    `/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`
  );

  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList.map((item) => ({
    sha: item.sha,
    shortSha: item.sha.substring(0, 7),
    message: item.commit.message,
    author: {
      name: item.commit.author.name,
      email: item.commit.author.email,
      date: item.commit.author.date,
      login: item.author?.login ?? null,
      avatarUrl: item.author?.avatar_url ?? null,
    },
    url: item.html_url,
    additions: item.stats?.additions,
    deletions: item.stats?.deletions,
    changedFiles: item.files?.length,
  }));
}

import { githubFetch } from "./client";
import type { ContributorItem } from "@/types/repository";

interface RawGitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export async function fetchContributors(
  owner: string,
  repo: string,
  perPage = 30
): Promise<ContributorItem[]> {
  try {
    const rawList = await githubFetch<RawGitHubContributor[]>(
      `/repos/${owner}/${repo}/contributors?per_page=${perPage}`
    );

    if (!Array.isArray(rawList)) {
      return [];
    }

    return rawList
      .filter((c) => c.type !== "Bot")
      .map((item) => ({
        login: item.login,
        avatarUrl: item.avatar_url,
        contributions: item.contributions,
        htmlUrl: item.html_url,
      }));
  } catch {
    // If contributors endpoint fails or is disabled for very large repos, return empty array safely
    return [];
  }
}

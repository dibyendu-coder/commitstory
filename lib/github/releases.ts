import { githubFetch } from "./client";
import type { ReleaseItem } from "@/types/repository";

interface RawGitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string | null;
  created_at: string;
  html_url: string;
  prerelease: boolean;
  body: string | null;
}

export async function fetchReleases(
  owner: string,
  repo: string,
  perPage = 20
): Promise<ReleaseItem[]> {
  try {
    const rawList = await githubFetch<RawGitHubRelease[]>(
      `/repos/${owner}/${repo}/releases?per_page=${perPage}`
    );

    if (!Array.isArray(rawList)) {
      return [];
    }

    return rawList.map((item) => ({
      id: item.id,
      tagName: item.tag_name,
      name: item.name,
      publishedAt: item.published_at,
      createdAt: item.created_at,
      htmlUrl: item.html_url,
      isPrerelease: item.prerelease,
      body: item.body,
    }));
  } catch {
    // Gracefully handle repos with no releases or 404 on releases endpoint
    return [];
  }
}

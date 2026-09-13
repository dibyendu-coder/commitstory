import type { GitHubApiError } from "@/types/repository";

export interface GitHubClientOptions {
  headers?: Record<string, string>;
  revalidate?: number;
}

export class GitHubFetchError extends Error {
  code: GitHubApiError["error"]["code"];
  status?: number;

  constructor(
    code: GitHubApiError["error"]["code"],
    message: string,
    status?: number
  ) {
    super(message);
    this.name = "GitHubFetchError";
    this.code = code;
    this.status = status;
  }
}

export function getGitHubToken(): string | undefined {
  return process.env.GITHUB_TOKEN;
}

export async function githubFetch<T>(
  endpoint: string,
  options: GitHubClientOptions = {}
): Promise<T> {
  const token = getGitHubToken();

  if (!token) {
    throw new GitHubFetchError(
      "MISSING_TOKEN",
      "CommitStory isn't configured with a GitHub token. Please set GITHUB_TOKEN in your environment or .env.local file.",
      401
    );
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `https://api.github.com${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "CommitStory-App",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: options.revalidate ?? 300 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new GitHubFetchError(
          "NOT_FOUND",
          "We couldn't find that public repository. Please check the repository owner and name.",
          404
        );
      }
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
        if (rateLimitRemaining === "0") {
          throw new GitHubFetchError(
            "RATE_LIMITED",
            "GitHub temporarily limited requests. Please try again shortly.",
            403
          );
        }
        throw new GitHubFetchError(
          "FORBIDDEN",
          "Access to this repository is restricted or forbidden.",
          403
        );
      }

      throw new GitHubFetchError(
        "UNEXPECTED_ERROR",
        `GitHub API returned status ${response.status}.`,
        response.status
      );
    }

    const data = await response.json();
    return data as T;
  } catch (err: unknown) {
    if (err instanceof GitHubFetchError) {
      throw err;
    }

    throw new GitHubFetchError(
      "UNEXPECTED_ERROR",
      "Failed to communicate with GitHub API. Please check your network connection.",
      500
    );
  }
}

const GITHUB_REPOSITORY_URL_PATTERN =
  /^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(\.git)?\/?$/i;

export function isValidGitHubRepositoryUrl(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  return GITHUB_REPOSITORY_URL_PATTERN.test(value.trim());
}

export function parseGitHubUrl(value: string): { owner: string; repo: string } | null {
  if (!value || typeof value !== "string") return null;
  const match = value.trim().match(GITHUB_REPOSITORY_URL_PATTERN);
  if (!match || !match[2] || !match[3]) return null;

  return {
    owner: match[2],
    repo: match[3],
  };
}

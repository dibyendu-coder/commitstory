const GITHUB_REPOSITORY_URL_PATTERN =
  /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

export function isValidGitHubRepositoryUrl(value: string): boolean {
  return GITHUB_REPOSITORY_URL_PATTERN.test(value.trim());
}

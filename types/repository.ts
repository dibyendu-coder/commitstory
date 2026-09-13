import type { AnalysisResult } from "@/lib/analysis/types";

export interface RepositoryInputState {
  url: string;
  isLoading: boolean;
  message: string | null;
  isError: boolean;
}

export interface RepositoryOwner {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  type: string;
}

export interface RepositorySummary {
  name: string;
  fullName: string;
  owner: RepositoryOwner;
  description: string | null;
  htmlUrl: string;
  defaultBranch: string;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
}

export interface RepositoryStats {
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  sizeKb: number;
  projectAgeYears: number;
  projectAgeDays: number;
  totalCommitsEstimate?: number;
  contributorsCount?: number;
  releasesCount?: number;
}

export interface CommitItem {
  sha: string;
  shortSha: string;
  message: string;
  author: {
    name: string;
    email?: string;
    date: string;
    login: string | null;
    avatarUrl: string | null;
  };
  url: string;
  additions?: number;
  deletions?: number;
  changedFiles?: number;
}

export interface ContributorItem {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
}

export interface ReleaseItem {
  id: number;
  tagName: string;
  name: string | null;
  publishedAt: string | null;
  createdAt: string;
  htmlUrl: string;
  isPrerelease: boolean;
  body: string | null;
}

export interface BaseRepositoryData {
  summary: RepositorySummary;
  stats: RepositoryStats;
  commits: CommitItem[];
  contributors: ContributorItem[];
  releases: ReleaseItem[];
  analyzedAt: string;
}

export interface RepositoryAnalysisData extends BaseRepositoryData {
  intelligence: AnalysisResult;
}

export interface RepositoryAnalysisResponse {
  success: true;
  data: RepositoryAnalysisData;
}

export interface GitHubApiError {
  success: false;
  error: {
    code: "MISSING_TOKEN" | "NOT_FOUND" | "RATE_LIMITED" | "INVALID_URL" | "FORBIDDEN" | "UNEXPECTED_ERROR";
    message: string;
    status?: number;
  };
}

export type AnalysisApiResponse = RepositoryAnalysisResponse | GitHubApiError;

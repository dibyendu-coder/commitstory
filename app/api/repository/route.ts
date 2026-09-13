import { NextResponse } from "next/server";
import { isValidGitHubRepositoryUrl, parseGitHubUrl } from "@/lib/repository-url";
import {
  fetchRepositoryMetadata,
  fetchCommitHistory,
  fetchContributors,
  fetchReleases,
  GitHubFetchError,
} from "@/lib/github";
import type { AnalysisApiResponse, RepositoryAnalysisData } from "@/types/repository";

export async function GET(request: Request): Promise<NextResponse<AnalysisApiResponse>> {
  const { searchParams } = new URL(request.url);
  let owner = searchParams.get("owner");
  let repo = searchParams.get("repo");
  const urlParam = searchParams.get("url");

  if (urlParam) {
    const parsed = parseGitHubUrl(urlParam);
    if (!parsed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_URL",
            message: "Please enter a valid public GitHub repository URL, e.g. https://github.com/owner/repo",
            status: 400,
          },
        },
        { status: 400 }
      );
    }
    owner = parsed.owner;
    repo = parsed.repo;
  }

  if (!owner || !repo) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_URL",
          message: "Repository owner and repo parameters are required.",
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  // Validate owner/repo format against injection/bad input
  const testUrl = `https://github.com/${owner}/${repo}`;
  if (!isValidGitHubRepositoryUrl(testUrl)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_URL",
          message: "Invalid repository format specified.",
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  try {
    const [metaResult, commits, contributors, releases] = await Promise.all([
      fetchRepositoryMetadata(owner, repo),
      fetchCommitHistory(owner, repo, 30),
      fetchContributors(owner, repo, 30),
      fetchReleases(owner, repo, 20),
    ]);

    const baseData = {
      summary: metaResult.summary,
      stats: {
        ...metaResult.stats,
        totalCommitsEstimate: commits.length,
        contributorsCount: contributors.length,
        releasesCount: releases.length,
      },
      commits,
      contributors,
      releases,
      analyzedAt: new Date().toISOString(),
    };

    const { analyzeRepository } = await import("@/lib/analysis");
    const intelligence = analyzeRepository(baseData);

    const data: RepositoryAnalysisData = {
      ...baseData,
      intelligence,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    if (err instanceof GitHubFetchError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.code,
            message: err.message,
            status: err.status,
          },
        },
        { status: err.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred while analyzing the repository.",
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}

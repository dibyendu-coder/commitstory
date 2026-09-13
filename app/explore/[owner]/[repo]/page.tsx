import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { RepoHeader } from "@/components/repository/repo-header";
import { RepoDna } from "@/components/repository/repo-dna";
import { RepoContributors } from "@/components/repository/repo-contributors";
import { RepoTimeline } from "@/components/repository/repo-timeline";
import {
  fetchRepositoryMetadata,
  fetchCommitHistory,
  fetchContributors,
  fetchReleases,
  GitHubFetchError,
} from "@/lib/github";
import type { RepositoryAnalysisData } from "@/types/repository";

import { StorySoFar } from "@/components/story/story-so-far";
import { analyzeRepository } from "@/lib/analysis";

interface ExplorePageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export async function generateMetadata({ params }: ExplorePageProps) {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo} — CommitStory`,
    description: `Interactive historical timeline and codebase story for ${owner}/${repo}`,
  };
}

export default async function ExplorePage({ params }: ExplorePageProps) {
  const { owner, repo } = await params;

  let data: RepositoryAnalysisData | null = null;
  let errorMessage: string | null = null;
  let errorCode: string | null = null;

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

    const intelligence = analyzeRepository(baseData);

    data = {
      ...baseData,
      intelligence,
    };
  } catch (err: unknown) {
    if (err instanceof GitHubFetchError) {
      errorMessage = err.message;
      errorCode = err.code;
    } else {
      errorMessage = "An unexpected error occurred while analyzing this repository.";
      errorCode = "UNEXPECTED_ERROR";
    }
  }

  if (!data || errorMessage) {
    return (
      <AppShell>
        <div className="section-wrap max-w-2xl mx-auto text-center space-y-6">
          <div className="surface-card p-8 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 font-mono text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-foreground font-mono">
              {errorCode === "MISSING_TOKEN"
                ? "GitHub Token Missing"
                : errorCode === "NOT_FOUND"
                ? "Repository Not Found"
                : errorCode === "RATE_LIMITED"
                ? "Rate Limit Exceeded"
                : "Unable to Analyze Repository"}
            </h1>
            <p className="text-sm text-muted leading-relaxed font-mono">
              {errorMessage}
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-input)] bg-accent text-slate-950 font-medium px-6 text-sm hover:bg-accent-strong transition"
              >
                ← Back to search
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground transition"
          >
            ← Search another repository
          </Link>
          <span className="text-[11px] font-mono text-muted">
            Analyzed at {new Date(data.analyzedAt).toLocaleTimeString()}
          </span>
        </div>

        <RepoHeader summary={data.summary} />
        <RepoDna stats={data.stats} />
        {data.intelligence && <StorySoFar intelligence={data.intelligence} />}
        <RepoContributors contributors={data.contributors} />
        <RepoTimeline commits={data.commits} releases={data.releases} />
      </div>
    </AppShell>
  );
}

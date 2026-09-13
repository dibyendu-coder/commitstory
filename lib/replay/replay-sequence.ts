import type { RepositoryAnalysisData } from "@/types/repository";
import type { ReplaySequence, ReplayStep } from "./replay-types";
import { calculateStepDurationMs } from "./replay-timing";

export function buildReplaySequence(data: RepositoryAnalysisData): ReplaySequence {
  const { summary, stats, commits, intelligence } = data;
  const { turningPoints, chapters } = intelligence;

  const minTimeMs = commits.length > 0
    ? new Date(commits[commits.length - 1].author.date).getTime()
    : new Date(summary.createdAt).getTime();

  const maxTimeMs = new Date(summary.pushedAt).getTime();
  const lifetimeSpanMs = Math.max(1, maxTimeMs - minTimeMs);

  const rawSteps: Omit<ReplayStep, "stepNumber" | "totalSteps">[] = [];

  // Convert turning points to replay steps
  turningPoints.forEach((tp) => {
    const tpTimeMs = new Date(tp.date).getTime();
    const lifetimePercent = Math.min(
      100,
      Math.max(0, Math.round(((tpTimeMs - minTimeMs) / lifetimeSpanMs) * 100))
    );

    // Find matching chapter
    const matchingChapter = chapters.find((ch) => {
      const startMs = new Date(ch.startDate).getTime();
      const endMs = new Date(ch.endDate).getTime();
      return tpTimeMs >= startMs && tpTimeMs <= endMs;
    }) || chapters[0];

    const formattedDate = new Date(tp.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const durationMs = calculateStepDurationMs(tp.type, tp.significance, tp.summary.length);

    rawSteps.push({
      id: `step-${tp.id}`,
      date: tp.date,
      formattedDate,
      title: tp.title,
      chapterTitle: matchingChapter?.title,
      chapterSubtitle: matchingChapter?.subtitle,
      type: tp.type,
      significance: tp.significance,
      summary: tp.summary,
      classification: tp.classification,
      confidence: tp.confidence,
      durationMs,
      turningPointId: tp.id,
      metrics: tp.evidence.metrics || [],
      commits: (tp.evidence.commits || []).map((c) => ({
        sha: c.sha,
        shortSha: c.shortSha,
        message: c.message,
        author: c.author,
        date: c.date,
      })),
      releases: tp.evidence.releases || [],
      contributors: tp.evidence.contributors || [],
      lifetimePercent,
    });
  });

  // Final Step: "Today — The Present State"
  const todayDateStr = new Date(summary.pushedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  rawSteps.push({
    id: "step-today",
    date: summary.pushedAt,
    formattedDate: todayDateStr,
    title: "TODAY — The Codebase Continuation",
    chapterTitle: "PRESENT ERA",
    chapterSubtitle: "Active Repository State",
    type: "today",
    significance: "high",
    summary: `The repository stands at ${stats.stargazersCount.toLocaleString()} stars and ${stats.forksCount.toLocaleString()} forks. The project story continues.`,
    classification: "fact",
    confidence: 100,
    durationMs: 5000,
    metrics: [
      { label: "Total Commits", value: String(stats.totalCommitsEstimate || commits.length) },
      { label: "Contributors", value: String(stats.contributorsCount || 1) },
      { label: "Releases", value: String(stats.releasesCount || 0) },
      { label: "Age", value: `${(stats.projectAgeDays / 365.25).toFixed(1)} years` },
    ],
    commits: [],
    releases: [],
    contributors: [],
    lifetimePercent: 100,
  });

  const totalSteps = rawSteps.length;
  const steps: ReplayStep[] = rawSteps.map((s, idx) => ({
    ...s,
    stepNumber: idx + 1,
    totalSteps,
  }));

  const totalDurationMs = steps.reduce((acc, s) => acc + s.durationMs, 0);

  return {
    steps,
    totalDurationMs,
    repositoryName: summary.fullName,
  };
}

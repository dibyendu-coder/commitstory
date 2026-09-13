import type { BaseRepositoryData } from "@/types/repository";
import type { ProjectDnaIntelligence, DevelopmentPattern } from "./types";

export function analyzeProjectDna(data: BaseRepositoryData): ProjectDnaIntelligence {
  const { summary, stats, commits, contributors, releases } = data;

  const ageInDays = Math.max(1, stats.projectAgeDays);
  const weeksCount = Math.max(1, ageInDays / 7);
  const totalCommits = commits.length;
  const commitVelocityPerWeek = Number((totalCommits / Math.min(weeksCount, 12)).toFixed(1)); // Recent window velocity

  // Top contributor concentration share
  let topContributorSharePercent = 0;
  if (contributors.length > 0) {
    const totalContribs = contributors.reduce((acc, c) => acc + c.contributions, 0);
    if (totalContribs > 0) {
      topContributorSharePercent = Math.round((contributors[0].contributions / totalContribs) * 100);
    }
  }

  // Activity level determination
  let activityLevel: "low" | "medium" | "high" = "medium";
  if (commitVelocityPerWeek > 5) {
    activityLevel = "high";
  } else if (commitVelocityPerWeek < 0.8) {
    activityLevel = "low";
  }

  // Development pattern determination
  let developmentPattern: DevelopmentPattern = "steady";

  if (totalCommits < 5) {
    developmentPattern = "unknown";
  } else if (ageInDays < 180 && totalCommits >= 15 && contributors.length >= 2) {
    developmentPattern = "rapid-growth";
  } else if (ageInDays > 730 && activityLevel === "low") {
    developmentPattern = "maintenance-heavy";
  } else if (releases.length === 0 && totalCommits >= 20) {
    developmentPattern = "experimental";
  } else {
    // Check distribution variance of commit dates
    const timestamps = commits.map((c) => new Date(c.author.date).getTime()).sort((a, b) => a - b);
    if (timestamps.length > 3) {
      const intervals: number[] = [];
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
      const stdDevDays = Math.sqrt(variance) / (1000 * 60 * 60 * 24);

      if (stdDevDays > 14) {
        developmentPattern = "bursty";
      }
    }
  }

  const primaryLanguages: string[] = [];
  if (summary.language) {
    primaryLanguages.push(summary.language);
  }

  return {
    ageInDays,
    totalCommits,
    contributorCount: contributors.length,
    releaseCount: releases.length,
    primaryLanguages,
    activityLevel,
    developmentPattern,
    commitVelocityPerWeek,
    topContributorSharePercent,
  };
}

import type { BaseRepositoryData } from "@/types/repository";
import type { DetectedSignal, TurningPoint } from "./types";

export function generateTurningPoints(
  data: BaseRepositoryData,
  signals: DetectedSignal[]
): TurningPoint[] {
  const { commits, releases, contributors } = data;
  const turningPoints: TurningPoint[] = [];

  if (commits.length === 0) {
    return turningPoints;
  }

  const sortedCommits = [...commits].sort(
    (a, b) => new Date(a.author.date).getTime() - new Date(b.author.date).getTime()
  );

  // 1. Birth Turning Point (Always Present if commits > 0)
  const firstCommit = sortedCommits[0];
  turningPoints.push({
    id: "tp-birth",
    date: firstCommit.author.date,
    title: "Project Origins & Genesis",
    type: "birth",
    significance: "high",
    score: 95,
    summary: `Development commenced with initial commit by ${firstCommit.author.login || firstCommit.author.name}.`,
    classification: "fact",
    confidence: 99,
    evidence: {
      commits: [
        {
          sha: firstCommit.sha,
          shortSha: firstCommit.shortSha,
          message: firstCommit.message.split("\n")[0],
          date: firstCommit.author.date,
          author: firstCommit.author.login || firstCommit.author.name,
        },
      ],
      metrics: [
        { label: "Initial Commit", value: firstCommit.shortSha },
        { label: "Author", value: firstCommit.author.login || firstCommit.author.name },
      ],
    },
  });

  // 2. Process Detected Signals into Turning Points
  signals.forEach((sig) => {
    if (sig.type === "activity-spike") {
      const relatedCommit = commits.find((c) => c.sha === sig.relatedSha);
      const spikeMultiplier = (sig.metrics?.multiplier as string) || "3x";
      const count = sig.metrics?.commitCount || 10;

      turningPoints.push({
        id: `tp-spike-${sig.id}`,
        date: sig.date,
        title: "Development Activity Surge",
        type: "growth",
        significance: Number(count) > 15 ? "high" : "medium",
        score: Math.min(92, 50 + Number(count) * 2),
        summary: `Commit activity increased to ${spikeMultiplier} above baseline, indicating a period of intensive features or sprint work.`,
        classification: "inference",
        confidence: 88,
        evidence: {
          commits: relatedCommit
            ? [
                {
                  sha: relatedCommit.sha,
                  shortSha: relatedCommit.shortSha,
                  message: relatedCommit.message.split("\n")[0],
                  date: relatedCommit.author.date,
                  author: relatedCommit.author.login || relatedCommit.author.name,
                },
              ]
            : [],
          metrics: [
            { label: "Activity Multiplier", value: spikeMultiplier },
            { label: "Observed Commits", value: String(count) },
            { label: "Baseline Velocity", value: `${sig.metrics?.baseline || 1} commits/week` },
          ],
        },
      });
    } else if (sig.type === "release-milestone") {
      const rel = releases.find((r) => r.tagName === sig.relatedTag);
      turningPoints.push({
        id: `tp-rel-${sig.id}`,
        date: sig.date,
        title: `Release Milestone ${sig.relatedTag}`,
        type: "release",
        significance: "high",
        score: 85,
        summary: `Tagged official version release ${sig.relatedTag} published to users.`,
        classification: "fact",
        confidence: 100,
        evidence: {
          releases: rel ? [rel.tagName] : [sig.relatedTag || "Release"],
          metrics: [
            { label: "Tag Name", value: sig.relatedTag || "" },
            { label: "Prerelease", value: rel?.isPrerelease ? "Yes" : "No" },
          ],
        },
      });
    } else if (sig.type === "revival") {
      const relatedCommit = commits.find((c) => c.sha === sig.relatedSha);
      const gap = sig.metrics?.gapDays || 30;

      turningPoints.push({
        id: `tp-revival-${sig.id}`,
        date: sig.date,
        title: "Project Development Revival",
        type: "revival",
        significance: Number(gap) > 90 ? "high" : "medium",
        score: Math.min(88, 40 + Number(gap) / 2),
        summary: `Active development resumed following a ${gap}-day period of inactivity.`,
        classification: "fact",
        confidence: 94,
        evidence: {
          commits: relatedCommit
            ? [
                {
                  sha: relatedCommit.sha,
                  shortSha: relatedCommit.shortSha,
                  message: relatedCommit.message.split("\n")[0],
                  date: relatedCommit.author.date,
                  author: relatedCommit.author.login || relatedCommit.author.name,
                },
              ]
            : [],
          metrics: [{ label: "Inactivity Gap", value: `${gap} days` }],
        },
      });
    } else if (sig.type === "tech-config-change") {
      const relatedCommit = commits.find((c) => c.sha === sig.relatedSha);
      if (relatedCommit) {
        turningPoints.push({
          id: `tp-tech-${sig.id}`,
          date: sig.date,
          title: "Configuration & Tech Dependency Change",
          type: "architecture",
          significance: "medium",
          score: 62,
          summary: `Modification of configuration or build dependencies detected (${sig.title.replace("Configuration Signal: ", "")}).`,
          classification: "fact",
          confidence: 90,
          evidence: {
            commits: [
              {
                sha: relatedCommit.sha,
                shortSha: relatedCommit.shortSha,
                message: relatedCommit.message.split("\n")[0],
                date: relatedCommit.author.date,
                author: relatedCommit.author.login || relatedCommit.author.name,
              },
            ],
            metrics: [{ label: "Target File", value: sig.title.replace("Configuration Signal: ", "") }],
          },
        });
      }
    }
  });

  // 3. Contributor Wave Turning Point (if contributors > 1)
  if (contributors.length >= 2) {
    turningPoints.push({
      id: "tp-contributors",
      date: sortedCommits[Math.floor(sortedCommits.length / 2)].author.date,
      title: "Contributor Collaboration Era",
      type: "contributors",
      significance: contributors.length >= 5 ? "high" : "medium",
      score: Math.min(85, 45 + contributors.length * 5),
      summary: `Project expanded to a multi-contributor workflow with ${contributors.length} active committers.`,
      classification: "fact",
      confidence: 95,
      evidence: {
        contributors: contributors.slice(0, 5).map((c) => c.login),
        metrics: [
          { label: "Active Contributors", value: String(contributors.length) },
          { label: "Lead Contributor Share", value: `${data.stats.stargazersCount ? "Shared" : "Distributed"}` },
        ],
      },
    });
  }

  // Deduplicate by ID and sort chronologically (oldest to newest)
  const uniqueMap = new Map<string, TurningPoint>();
  turningPoints.forEach((tp) => uniqueMap.set(tp.id, tp));

  return Array.from(uniqueMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

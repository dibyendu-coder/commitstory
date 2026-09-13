import type { BaseRepositoryData } from "@/types/repository";
import type { DetectedSignal } from "./types";

const TECH_CONFIG_KEYWORDS = [
  "package.json",
  "dockerfile",
  "docker-compose",
  "go.mod",
  "cargo.toml",
  "pyproject.toml",
  "requirements.txt",
  "tsconfig.json",
  "tailwind.config",
  "next.config",
  "vite.config",
  "eslint",
  "webpack",
];

const DIRECTORY_KEYWORDS = [
  "src/",
  "app/",
  "api/",
  "components/",
  "pages/",
  "lib/",
  "server/",
  "client/",
  "services/",
  "modules/",
];

export function detectSignals(data: BaseRepositoryData): DetectedSignal[] {
  const { commits, releases, contributors } = data;
  const signals: DetectedSignal[] = [];

  if (commits.length === 0) {
    return signals;
  }

  // Sort commits chronologically (oldest first)
  const sortedCommits = [...commits].sort(
    (a, b) => new Date(a.author.date).getTime() - new Date(b.author.date).getTime()
  );

  // 1. Initial Birth Signal (earliest commit)
  const firstCommit = sortedCommits[0];
  signals.push({
    id: `sig-birth-${firstCommit.sha}`,
    type: "large-change",
    date: firstCommit.author.date,
    title: "Initial Repository Commit",
    description: `Project history begins with commit by ${firstCommit.author.login || firstCommit.author.name}`,
    relatedSha: firstCommit.sha,
  });

  // 2. Weekly Baseline Calculation for Activity Spikes & Drops
  const weeksMap: Map<string, number> = new Map();
  sortedCommits.forEach((c) => {
    const d = new Date(c.author.date);
    // Year-Week key (YYYY-WW)
    const yearWeek = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6) / 7)}`;
    weeksMap.set(yearWeek, (weeksMap.get(yearWeek) || 0) + 1);
  });

  const weeklyCounts = Array.from(weeksMap.values());
  const avgWeeklyCommits =
    weeklyCounts.length > 0 ? weeklyCounts.reduce((a, b) => a + b, 0) / weeklyCounts.length : 1;

  // Detect spikes (weeks with > 3x average commits)
  weeksMap.forEach((count, yearWeek) => {
    if (count >= 4 && count >= avgWeeklyCommits * 2.8) {
      const multiplier = Number((count / Math.max(1, avgWeeklyCommits)).toFixed(1));
      // Find representative commit in that week
      const sampleCommit = sortedCommits.find((c) => {
        const d = new Date(c.author.date);
        return `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6) / 7)}` === yearWeek;
      });

      if (sampleCommit) {
        signals.push({
          id: `sig-spike-${yearWeek}`,
          type: "activity-spike",
          date: sampleCommit.author.date,
          title: `Activity Spike (${multiplier}× Baseline)`,
          description: `${count} commits were recorded during week ${yearWeek}, exceeding the repository baseline of ${avgWeeklyCommits.toFixed(1)} commits/week.`,
          metrics: {
            commitCount: count,
            multiplier: `${multiplier}x`,
            baseline: Number(avgWeeklyCommits.toFixed(1)),
          },
          relatedSha: sampleCommit.sha,
        });
      }
    }
  });

  // 3. Inactivity Gaps and Revivals (> 45 days gap between commits)
  for (let i = 1; i < sortedCommits.length; i++) {
    const prevDate = new Date(sortedCommits[i - 1].author.date).getTime();
    const currDate = new Date(sortedCommits[i].author.date).getTime();
    const gapDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (gapDays >= 45) {
      signals.push({
        id: `sig-inactivity-${sortedCommits[i - 1].sha}`,
        type: "inactivity-period",
        date: sortedCommits[i - 1].author.date,
        title: `Inactivity Period (${gapDays} Days)`,
        description: `Development paused for ${gapDays} days after this commit.`,
        metrics: { gapDays },
        relatedSha: sortedCommits[i - 1].sha,
      });

      signals.push({
        id: `sig-revival-${sortedCommits[i].sha}`,
        type: "revival",
        date: sortedCommits[i].author.date,
        title: "Development Resumed",
        description: `Commit activity resumed after a ${gapDays}-day pause.`,
        metrics: { gapDays },
        relatedSha: sortedCommits[i].sha,
      });
    }
  }

  // 4. Technology & Directory Signals from commit messages
  sortedCommits.forEach((c) => {
    const msg = c.message.toLowerCase();

    // Tech/config signal check
    for (const kw of TECH_CONFIG_KEYWORDS) {
      if (msg.includes(kw)) {
        signals.push({
          id: `sig-tech-${c.sha}`,
          type: "tech-config-change",
          date: c.author.date,
          title: `Configuration Signal: ${kw}`,
          description: `Commit referenced dependency or configuration file (${kw}).`,
          relatedSha: c.sha,
        });
        break;
      }
    }

    // Directory structure signal check
    for (const dir of DIRECTORY_KEYWORDS) {
      if (msg.includes(dir)) {
        signals.push({
          id: `sig-dir-${c.sha}`,
          type: "new-directory",
          date: c.author.date,
          title: `Structure Signal: ${dir}`,
          description: `Commit referenced major directory structure (${dir}).`,
          relatedSha: c.sha,
        });
        break;
      }
    }
  });

  // 5. Release Milestones
  releases.forEach((r) => {
    signals.push({
      id: `sig-rel-${r.id}`,
      type: "release-milestone",
      date: r.publishedAt || r.createdAt,
      title: `Tagged Release: ${r.tagName}`,
      description: r.name && r.name !== r.tagName ? `${r.tagName} (${r.name})` : `Version release ${r.tagName}`,
      relatedTag: r.tagName,
    });
  });

  // 6. Contributor Waves
  if (contributors.length >= 3) {
    signals.push({
      id: "sig-contrib-wave",
      type: "contributor-wave",
      date: sortedCommits[Math.floor(sortedCommits.length / 2)]?.author.date || firstCommit.author.date,
      title: "Multi-Contributor Expansion",
      description: `${contributors.length} contributors participated in project development.`,
      metrics: { contributorCount: contributors.length },
    });
  }

  // Deduplicate and sort chronologically (oldest to newest)
  return signals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

import Image from "next/image";
import type { RepositorySummary, RepositoryStats } from "@/types/repository";

interface StoryHeaderProps {
  summary: RepositorySummary;
  stats: RepositoryStats;
  firstCommitDate?: string;
  onStartReplay?: () => void;
}

export function StoryHeader({ summary, stats, firstCommitDate, onStartReplay }: StoryHeaderProps) {
  const createdYear = firstCommitDate
    ? new Date(firstCommitDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : new Date(summary.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const pushedYear = new Date(summary.pushedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <header className="surface-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {summary.owner.avatarUrl && (
              <Image
                src={summary.owner.avatarUrl}
                alt={summary.owner.login}
                width={36}
                height={36}
                className="rounded-full border border-border"
              />
            )}
            <span className="text-sm font-mono text-muted">
              {summary.owner.login} /
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
              {summary.name}
            </h1>
          </div>

          {summary.description && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base font-mono">
              {summary.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent font-medium">
              📅 {createdYear} → {pushedYear}
            </span>
            {summary.language && (
              <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted">
                {summary.language}
              </span>
            )}
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted">
              ★ {stats.stargazersCount.toLocaleString()} stars
            </span>
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted">
              ⑂ {stats.forksCount.toLocaleString()} forks
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStartReplay}
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-input)] bg-accent text-slate-950 px-4 text-xs font-mono font-bold shadow-md hover:bg-accent-strong transition"
          >
            ▶ Replay History
          </button>
          <a
            href={summary.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-input)] border border-border bg-surface-2 px-4 text-xs font-mono font-medium text-foreground transition hover:bg-surface hover:border-accent/40"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </header>
  );
}

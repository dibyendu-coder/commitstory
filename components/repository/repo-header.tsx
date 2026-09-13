import Image from "next/image";
import type { RepositorySummary } from "@/types/repository";

interface RepoHeaderProps {
  summary: RepositorySummary;
}

export function RepoHeader({ summary }: RepoHeaderProps) {
  const createdDateStr = new Date(summary.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const pushedDateStr = new Date(summary.pushedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="surface-card p-6 sm:p-8">
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {summary.name}
            </h1>
          </div>

          {summary.description && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              {summary.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
            {summary.language && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-accent">
                {summary.language}
              </span>
            )}
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted">
              Branch: {summary.defaultBranch}
            </span>
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted">
              Created {createdDateStr}
            </span>
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted">
              Pushed {pushedDateStr}
            </span>
          </div>

          {summary.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {summary.topics.slice(0, 6).map((topic) => (
                <span
                  key={topic}
                  className="rounded border border-border/50 bg-background/50 px-2 py-0.5 text-[11px] font-mono text-muted"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={summary.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-input)] border border-border bg-surface-2 px-4 text-xs font-mono font-medium text-foreground transition hover:bg-surface hover:border-accent/40"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>
    </header>
  );
}

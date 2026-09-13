"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { CommitItem, ReleaseItem } from "@/types/repository";

interface RepoTimelineProps {
  commits: CommitItem[];
  releases: ReleaseItem[];
}

type TimelineFilter = "all" | "commits" | "releases";

export function RepoTimeline({ commits, releases }: RepoTimelineProps) {
  const [filter, setFilter] = useState<TimelineFilter>("all");

  // Merge commits and releases into a single chronological array
  const timelineEvents = [
    ...commits.map((c) => ({
      id: `commit-${c.sha}`,
      type: "commit" as const,
      date: new Date(c.author.date),
      data: c,
    })),
    ...releases.map((r) => ({
      id: `release-${r.id}`,
      type: "release" as const,
      date: new Date(r.publishedAt || r.createdAt),
      data: r,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredEvents = timelineEvents.filter((event) => {
    if (filter === "commits") return event.type === "commit";
    if (filter === "releases") return event.type === "release";
    return true;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
            EARLY TIMELINE
          </h2>
          <p className="mt-1 text-xs text-muted font-mono">
            Historical sequence of releases & commit records ({filteredEvents.length} events)
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1 text-xs font-mono">
          {(["all", "commits", "releases"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded px-3 py-1 capitalize transition ${
                filter === f
                  ? "bg-accent/20 text-accent font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-border/60 space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="surface-card p-6 text-center text-sm font-mono text-muted">
            No events match the selected filter.
          </div>
        ) : (
          filteredEvents.map((event, idx) => {
            const dateStr = event.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = event.date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            if (event.type === "release") {
              const release = event.data as ReleaseItem;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  className="relative group"
                >
                  {/* Timeline indicator node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-background" />

                  <div className="surface-card border-accent/40 bg-accent/5 p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-accent uppercase">
                          {release.isPrerelease ? "PRE-RELEASE" : "RELEASE"}
                        </span>
                        <h3 className="text-base font-bold font-mono text-foreground">
                          {release.tagName}
                          {release.name && release.name !== release.tagName ? ` — ${release.name}` : ""}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-muted">
                        {dateStr} at {timeStr}
                      </span>
                    </div>

                    {release.body && (
                      <p className="text-xs text-muted/90 font-mono line-clamp-3 leading-relaxed whitespace-pre-wrap">
                        {release.body}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-xs font-mono">
                      <a
                        href={release.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline inline-flex items-center gap-1"
                      >
                        Release notes ↗
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            }

            const commit = event.data as CommitItem;
            const firstLineMessage = commit.message.split("\n")[0];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                className="relative group"
              >
                {/* Timeline node */}
                <div className="absolute -left-[29px] sm:-left-[37px] top-3 h-3 w-3 rounded-full border border-border bg-surface-2 group-hover:border-accent transition-colors" />

                <div className="surface-card p-4 hover:border-border/80 transition space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {commit.author.avatarUrl ? (
                        <Image
                          src={commit.author.avatarUrl}
                          alt={commit.author.name}
                          width={20}
                          height={20}
                          className="rounded-full border border-border"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[10px] font-mono text-muted">
                          {commit.author.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-mono text-foreground/90 font-medium">
                        {commit.author.login || commit.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-muted">{dateStr}</span>
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-accent hover:border-accent/50"
                      >
                        {commit.shortSha}
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/90 font-mono leading-relaxed">
                    {firstLineMessage}
                  </p>

                  {(commit.additions !== undefined || commit.deletions !== undefined) && (
                    <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-muted">
                      {commit.additions !== undefined && (
                        <span className="text-emerald-400">+{commit.additions}</span>
                      )}
                      {commit.deletions !== undefined && (
                        <span className="text-rose-400">-{commit.deletions}</span>
                      )}
                      {commit.changedFiles !== undefined && (
                        <span>{commit.changedFiles} files changed</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}

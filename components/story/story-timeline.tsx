"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { RepositoryAnalysisData } from "@/types/repository";
import type { TurningPoint } from "@/lib/analysis/types";
import { EvidencePanel } from "./evidence-panel";

interface StoryTimelineProps {
  data: RepositoryAnalysisData;
}

export function StoryTimeline({ data }: StoryTimelineProps) {
  const [selectedTurningPoint, setSelectedTurningPoint] = useState<TurningPoint | null>(null);

  const { commits, summary, intelligence } = data;
  const { turningPoints, chapters, hasSufficientData, lowDataReason } = intelligence;

  const minDateMs = commits.length > 0
    ? new Date(commits[commits.length - 1].author.date).getTime()
    : new Date(summary.createdAt).getTime();

  const maxDateMs = new Date(summary.pushedAt).getTime();
  const totalLifetimeMs = Math.max(1, maxDateMs - minDateMs);

  // Group turning points by chapter
  const turningPointsByChapter = new Map<string, TurningPoint[]>();
  chapters.forEach((ch) => {
    turningPointsByChapter.set(ch.id, []);
  });

  // Assign turning points to matching chapters or default
  turningPoints.forEach((tp) => {
    const tpTime = new Date(tp.date).getTime();
    let assigned = false;
    for (const ch of chapters) {
      const startMs = new Date(ch.startDate).getTime();
      const endMs = new Date(ch.endDate).getTime();
      if (tpTime >= startMs && tpTime <= endMs) {
        turningPointsByChapter.get(ch.id)?.push(tp);
        assigned = true;
        break;
      }
    }
    if (!assigned && chapters.length > 0) {
      turningPointsByChapter.get(chapters[0].id)?.push(tp);
    }
  });

  return (
    <section className="space-y-8">
      {!hasSufficientData ? (
        <div className="surface-card p-8 text-center space-y-3">
          <div className="text-2xl">📜</div>
          <h3 className="text-base font-bold font-mono text-foreground">
            Sparse Historical Activity
          </h3>
          <p className="text-xs text-muted font-mono max-w-md mx-auto">
            {lowDataReason || "This repository does not contain enough historical signals to identify major turning points yet."}
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-border/70 pl-6 sm:pl-10 space-y-12 ml-3 sm:ml-6">
          {chapters.map((ch) => {
            const chPoints = turningPointsByChapter.get(ch.id) || [];
            const chStartDateStr = new Date(ch.startDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            const chEndDateStr = new Date(ch.endDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });

            return (
              <div key={ch.id} id={ch.id} className="space-y-6 pt-4 scroll-mt-24">
                {/* CHAPTER MARKER */}
                <div className="relative">
                  {/* Node on line */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 h-5 w-5 rounded-full border-4 border-background bg-accent" />

                  <div className="flex flex-wrap items-baseline justify-between border-b border-border/80 pb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-mono font-bold tracking-widest text-accent uppercase">
                        {ch.title}
                      </span>
                      <h3 className="text-lg font-bold font-mono text-foreground">
                        {ch.subtitle}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-muted">
                      {chStartDateStr} — {chEndDateStr}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-mono text-muted/90">
                    {ch.summary}
                  </p>
                </div>

                {/* TURNING POINTS & EVENTS IN CHAPTER */}
                <div className="space-y-6 pl-1 sm:pl-2">
                  {chPoints.length === 0 ? (
                    <div className="text-xs font-mono text-muted italic">
                      No key turning points isolated in this window.
                    </div>
                  ) : (
                    chPoints.map((tp, idx) => {
                      const tpTimeMs = new Date(tp.date).getTime();
                      const lifetimePercent = Math.min(
                        100,
                        Math.max(0, Math.round(((tpTimeMs - minDateMs) / totalLifetimeMs) * 100))
                      );
                      const isFact = tp.classification === "fact";
                      const isSelected = selectedTurningPoint?.id === tp.id;

                      const dateStr = new Date(tp.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <motion.div
                          key={tp.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                          className="relative group"
                        >
                          {/* LEVEL 3 TURNING POINT NODE ON TIMELINE */}
                          <div
                            className={`absolute -left-[27px] sm:-left-[43px] top-4 h-3.5 w-3.5 rounded-full border-2 transition-all ${
                              isSelected
                                ? "border-accent bg-accent ring-4 ring-accent/20"
                                : tp.significance === "high"
                                ? "border-accent bg-background group-hover:bg-accent"
                                : "border-amber-400 bg-background group-hover:bg-amber-400"
                            }`}
                          />

                          {/* STORY CARD */}
                          <div
                            onClick={() => setSelectedTurningPoint(tp)}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedTurningPoint(tp);
                              }
                            }}
                            className={`surface-card p-5 sm:p-6 space-y-4 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                              isSelected
                                ? "border-accent shadow-[0_0_25px_rgba(122,162,255,0.25)] bg-surface"
                                : "hover:border-accent/60"
                            }`}
                          >
                            {/* "YOU ARE HERE" LIFETIME CONTEXT STRIP */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                                <span>PROJECT LIFETIME</span>
                                <span>{lifetimePercent}% timeline point</span>
                              </div>
                              <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${lifetimePercent}%` }}
                                  className="h-full bg-accent rounded-full transition-all"
                                />
                              </div>
                            </div>

                            {/* CARD CONTENT */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    tp.significance === "high"
                                      ? "bg-accent"
                                      : tp.significance === "medium"
                                      ? "bg-amber-400"
                                      : "bg-muted"
                                  }`}
                                />
                                <h4 className="text-base font-bold font-mono text-foreground group-hover:text-accent transition">
                                  {tp.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="text-muted">{dateStr}</span>
                                <span
                                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    isFact
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                      : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                                  }`}
                                >
                                  {tp.classification}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs font-mono text-muted/90 leading-relaxed">
                              {tp.summary}
                            </p>

                            {/* METRIC BADGES / EVIDENCE SNAPSHOT */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/60 text-xs font-mono">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="text-accent font-medium">
                                  Confidence: {tp.confidence}%
                                </span>
                                {tp.evidence.metrics?.slice(0, 2).map((m) => (
                                  <span
                                    key={m.label}
                                    className="rounded border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted"
                                  >
                                    {m.label}: {m.value}
                                  </span>
                                ))}
                              </div>

                              <span className="text-accent group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-xs">
                                Inspect evidence →
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}

          {/* LEVEL 1 BACKGROUND HISTORY PREVIEW (Normal Commit List) */}
          <div className="pt-8 space-y-4">
            <h3 className="text-xs font-mono uppercase text-muted tracking-wider">
              RAW HISTORICAL COMMIT STREAM ({commits.length} commits)
            </h3>
            <div className="space-y-2">
              {commits.slice(0, 8).map((c) => (
                <div
                  key={c.sha}
                  className="surface-card p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono hover:border-border/80 transition"
                >
                  <div className="flex items-center gap-2">
                    {c.author.avatarUrl ? (
                      <Image
                        src={c.author.avatarUrl}
                        alt={c.author.name}
                        width={18}
                        height={18}
                        className="rounded-full border border-border"
                      />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[9px] font-mono text-muted">
                        {c.author.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-foreground font-medium">{c.author.login || c.author.name}</span>
                    <span className="text-muted/80 truncate max-w-sm">{c.message.split("\n")[0]}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-muted">
                      {new Date(c.author.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-border bg-surface-2 px-2 py-0.5 text-accent hover:border-accent/40"
                    >
                      {c.shortSha}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE SLIDE-OVER PANEL */}
      <EvidencePanel
        turningPoint={selectedTurningPoint}
        onClose={() => setSelectedTurningPoint(null)}
        repoHtmlUrl={summary.htmlUrl}
      />
    </section>
  );
}

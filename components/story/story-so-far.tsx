"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { AnalysisResult, TurningPoint } from "@/lib/analysis/types";
import { EvidencePanel } from "./evidence-panel";

interface StorySoFarProps {
  intelligence: AnalysisResult;
}

export function StorySoFar({ intelligence }: StorySoFarProps) {
  const [selectedTurningPoint, setSelectedTurningPoint] = useState<TurningPoint | null>(null);

  const { dna, chapters, turningPoints, hasSufficientData, lowDataReason } = intelligence;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
            THE STORY SO FAR
          </h2>
          <p className="mt-1 text-xs text-muted font-mono">
            Deterministic historical analysis & turning points ({turningPoints.length} key moments)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <span>Pattern:</span>
          <span className="rounded border border-border bg-surface-2 px-2.5 py-0.5 capitalize text-foreground">
            {dna.developmentPattern.replace("-", " ")}
          </span>
        </div>
      </div>

      {!hasSufficientData ? (
        <div className="surface-card p-8 text-center space-y-3">
          <div className="text-2xl">📜</div>
          <h3 className="text-base font-bold font-mono text-foreground">
            Sparse Historical Activity
          </h3>
          <p className="text-xs text-muted font-mono max-w-md mx-auto">
            {lowDataReason || "Not enough historical activity to identify major turning points yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Historical Chapters */}
          {chapters.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase text-muted tracking-wider">
                HISTORICAL CHAPTERS
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {chapters.map((ch) => (
                  <div
                    key={ch.id}
                    className="surface-card p-5 space-y-2 border-accent/20 hover:border-accent/40 transition"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-accent font-bold">{ch.title}</span>
                      <span className="text-[10px] text-muted font-mono uppercase border border-border px-1.5 py-0.5 rounded">
                        {ch.classification}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold font-mono text-foreground">
                      {ch.subtitle}
                    </h4>
                    <p className="text-xs text-muted font-mono leading-relaxed line-clamp-2">
                      {ch.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Turning Points List */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-mono uppercase text-muted tracking-wider">
              PIVOTAL TURNING POINTS
            </h3>
            <div className="space-y-3">
              {turningPoints.map((tp, idx) => {
                const dateStr = new Date(tp.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                });
                const isFact = tp.classification === "fact";

                return (
                  <motion.div
                    key={tp.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                    onClick={() => setSelectedTurningPoint(tp)}
                    className="surface-card p-5 hover:border-accent/50 cursor-pointer transition group space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
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

                      <div className="flex items-center gap-3 text-xs font-mono">
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
                        <span className="text-accent group-hover:translate-x-1 transition-transform">
                          Inspect evidence →
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-muted/90 leading-relaxed pl-5">
                      {tp.summary}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Evidence Panel Slide-Over */}
      <EvidencePanel
        turningPoint={selectedTurningPoint}
        onClose={() => setSelectedTurningPoint(null)}
      />
    </section>
  );
}

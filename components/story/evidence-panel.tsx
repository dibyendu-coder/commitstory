"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TurningPoint } from "@/lib/analysis/types";

interface EvidencePanelProps {
  turningPoint: TurningPoint | null;
  onClose: () => void;
  repoHtmlUrl?: string;
}

export function EvidencePanel({ turningPoint, onClose, repoHtmlUrl }: EvidencePanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (turningPoint) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [turningPoint, onClose]);

  if (!turningPoint) return null;

  const isFact = turningPoint.classification === "fact";
  const dateStr = new Date(turningPoint.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm">
        {/* Backdrop click */}
        <motion.div
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Slide-over panel */}
        <motion.div
          className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-border bg-surface shadow-2xl p-6 sm:p-8 overflow-y-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-5 mb-6">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-accent tracking-widest">
                  WHY COMMITSTORY MARKED THIS
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">
                {turningPoint.title}
              </h2>
              <span className="text-xs font-mono text-muted">{dateStr}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface-2 p-2 text-xs font-mono text-muted hover:text-foreground hover:border-accent/40 transition"
              aria-label="Close evidence panel"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-6 text-sm">
            {/* Classification & Confidence Bar */}
            <div className="surface-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted uppercase">CLASSIFICATION</span>
                <span
                  className={`rounded px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider uppercase ${
                    isFact
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                  }`}
                >
                  {turningPoint.classification}
                </span>
              </div>
              <p className="text-xs text-muted/90 leading-relaxed font-mono">
                {isFact
                  ? "Directly supported by recorded GitHub historical data."
                  : "Statistical baseline inference derived from historical commit patterns."}
              </p>

              <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono text-muted uppercase">HEURISTIC CONFIDENCE</span>
                <span className="text-sm font-bold font-mono text-accent">
                  {turningPoint.confidence}%
                </span>
              </div>
              <p className="text-[11px] text-muted/70 font-mono italic">
                Note: Confidence score reflects detection heuristic accuracy, not developer intention.
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-muted tracking-wider">
                EVIDENCE SUMMARY
              </h3>
              <p className="text-sm font-mono text-foreground/90 leading-relaxed bg-surface-2 p-4 rounded-xl border border-border">
                {turningPoint.summary}
              </p>
            </div>

            {/* Supporting Metrics */}
            {turningPoint.evidence.metrics && turningPoint.evidence.metrics.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-muted tracking-wider">
                  KEY METRICS
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {turningPoint.evidence.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="surface-card p-3 flex flex-col justify-between"
                    >
                      <span className="text-[10px] font-mono text-muted uppercase">
                        {m.label}
                      </span>
                      <span className="text-base font-bold font-mono text-foreground mt-1">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supporting Commits */}
            {turningPoint.evidence.commits && turningPoint.evidence.commits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-muted tracking-wider">
                  SUPPORTING COMMITS
                </h3>
                <div className="space-y-2">
                  {turningPoint.evidence.commits.map((c) => (
                    <div
                      key={c.sha}
                      className="surface-card p-3 space-y-1 hover:border-border/90 transition"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        {repoHtmlUrl ? (
                          <a
                            href={`${repoHtmlUrl}/commit/${c.sha}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent font-medium hover:underline inline-flex items-center gap-1"
                          >
                            {c.shortSha} ↗
                          </a>
                        ) : (
                          <span className="text-accent font-medium">{c.shortSha}</span>
                        )}
                        <span className="text-muted">{c.author}</span>
                      </div>
                      <p className="text-xs font-mono text-foreground/90">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supporting Releases */}
            {turningPoint.evidence.releases && turningPoint.evidence.releases.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-muted tracking-wider">
                  SUPPORTING RELEASES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {turningPoint.evidence.releases.map((rel) => (
                    <span
                      key={rel}
                      className="rounded border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-mono text-accent"
                    >
                      🏷️ {rel}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

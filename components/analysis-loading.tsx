"use client";

import { motion } from "framer-motion";

export interface AnalysisStage {
  id: string;
  label: string;
  status: "pending" | "active" | "completed";
}

interface AnalysisLoadingProps {
  stages: AnalysisStage[];
  repoName?: string;
}

export function AnalysisLoading({ stages, repoName }: AnalysisLoadingProps) {
  return (
    <div className="surface-card w-full p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            ANALYZING REPOSITORY
          </span>
          {repoName && (
            <h3 className="mt-1 text-lg font-semibold text-foreground font-mono">
              {repoName}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="text-xs font-mono text-muted">Processing</span>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => {
          const isCompleted = stage.status === "completed";
          const isActive = stage.status === "active";

          return (
            <motion.div
              key={stage.id}
              className="flex items-center gap-3.5 text-sm font-mono"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-5 flex justify-center">
                {isCompleted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-emerald-400 font-bold"
                  >
                    ✓
                  </motion.span>
                )}
                {isActive && (
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                    className="text-accent font-bold"
                  >
                    ●
                  </motion.span>
                )}
                {stage.status === "pending" && (
                  <span className="text-muted/40">○</span>
                )}
              </div>

              <span
                className={
                  isCompleted
                    ? "text-foreground"
                    : isActive
                    ? "text-accent font-medium"
                    : "text-muted/50"
                }
              >
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

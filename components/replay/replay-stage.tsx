"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RepositoryAnalysisData } from "@/types/repository";
import { buildReplaySequence } from "@/lib/replay/replay-sequence";
import type { ReplayStep } from "@/lib/replay/replay-types";
import { ReplayControls } from "./replay-controls";

interface ReplayStageProps {
  data: RepositoryAnalysisData;
  isOpen: boolean;
  onClose: () => void;
  onExploreTurningPoint?: (turningPointId: string) => void;
}

export function ReplayStage({
  data,
  isOpen,
  onClose,
  onExploreTurningPoint,
}: ReplayStageProps) {
  const sequence = useMemo(() => (data ? buildReplaySequence(data) : null), [data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleNext = useCallback(() => {
    clearTimer();
    if (!sequence) return;
    if (currentIndex < sequence.steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [clearTimer, sequence, currentIndex]);

  const handlePrevious = useCallback(() => {
    clearTimer();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [clearTimer, currentIndex]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleRestart = useCallback(() => {
    clearTimer();
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [clearTimer]);

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying || !sequence) {
      clearTimer();
      return;
    }

    const currentStep = sequence.steps[currentIndex];
    if (!currentStep) return;

    timerRef.current = setTimeout(() => {
      handleNext();
    }, currentStep.durationMs);

    return () => clearTimer();
  }, [isOpen, isPlaying, sequence, currentIndex, handleNext, clearTimer]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleTogglePlay, handleNext, handlePrevious]);

  if (!isOpen || !sequence || sequence.steps.length === 0) {
    return null;
  }

  const currentStep: ReplayStep = sequence.steps[currentIndex];
  const isFact = currentStep.classification === "fact";

  const handleExploreClick = () => {
    setIsPlaying(false);
    onClose();
    if (currentStep.turningPointId && onExploreTurningPoint) {
      onExploreTurningPoint(currentStep.turningPointId);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md overflow-hidden text-foreground">
        {/* TOP BAR */}
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-accent uppercase">
              REPLAY HISTORY MODE — {sequence.repositoryName}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-muted">
              Event {currentStep.stepNumber} of {currentStep.totalSteps}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-muted hover:text-foreground hover:border-accent/40 transition"
              aria-label="Exit replay mode"
            >
              ✕ Exit Replay
            </button>
          </div>
        </header>

        {/* STEP DURATION PROGRESS BAR */}
        <div className="w-full bg-surface-2 h-1 overflow-hidden">
          <motion.div
            key={`${currentStep.id}-${isPlaying}`}
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: isPlaying ? "100%" : "0%" }}
            transition={{
              duration: isPlaying ? currentStep.durationMs / 1000 : 0,
              ease: "linear",
            }}
          />
        </div>

        {/* MAIN REPLAY STAGE CENTER AREA */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-4xl mx-auto w-full text-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="surface-card w-full p-8 sm:p-12 space-y-6 border-accent/30 shadow-2xl relative"
            >
              {/* DATE & CHAPTER HEADER */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-[0.22em] text-accent">
                  {currentStep.formattedDate}
                </span>
                {currentStep.chapterTitle && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-mono text-muted mx-auto block">
                    <span className="font-bold text-accent">{currentStep.chapterTitle}</span>
                    {currentStep.chapterSubtitle && <span>— {currentStep.chapterSubtitle}</span>}
                  </div>
                )}
              </div>

              {/* EVENT TITLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-2xl font-bold font-mono text-foreground sm:text-3xl">
                    {currentStep.title}
                  </h2>
                  <span
                    className={`rounded px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider uppercase ${
                      isFact
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {currentStep.classification}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-mono text-muted leading-relaxed max-w-2xl mx-auto">
                  {currentStep.summary}
                </p>
              </div>

              {/* EVIDENCE METRICS SNAPSHOT */}
              {currentStep.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-xl mx-auto pt-2">
                  {currentStep.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-border/80 bg-surface-2/80 p-3 space-y-1"
                    >
                      <span className="text-[10px] font-mono text-muted uppercase block">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold font-mono text-foreground block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* "YOU ARE HERE" LIFETIME PROGRESS INDICATOR */}
              <div className="space-y-1.5 pt-4 border-t border-border/60 max-w-lg mx-auto">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>PROJECT GENESIS</span>
                  <span>{currentStep.lifetimePercent}% lifetime mark</span>
                  <span>PRESENT ERA</span>
                </div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${currentStep.lifetimePercent}%` }}
                    className="h-full bg-accent rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* PLAYER CONTROLS */}
          <ReplayControls
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onRestart={handleRestart}
            onExit={onClose}
            onExploreMoment={handleExploreClick}
            hasTurningPoint={Boolean(currentStep.turningPointId)}
          />
        </main>
      </div>
    </AnimatePresence>
  );
}

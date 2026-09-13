"use client";

interface ReplayControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  onExit: () => void;
  onExploreMoment?: () => void;
  hasTurningPoint?: boolean;
}

export function ReplayControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  onRestart,
  onExit,
  onExploreMoment,
  hasTurningPoint,
}: ReplayControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
      {/* Explore Moment Action */}
      {hasTurningPoint && onExploreMoment && (
        <button
          type="button"
          onClick={onExploreMoment}
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-mono font-medium text-accent hover:bg-accent/20 transition group"
        >
          <span>Explore this moment in timeline</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}

      {/* Main Buttons Strip */}
      <div className="surface-card flex items-center justify-between p-2 sm:p-3 w-full border-border/80 shadow-2xl">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-mono text-muted hover:text-foreground hover:bg-surface-2 transition"
          aria-label="Previous step"
        >
          ‹ Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex h-10 px-6 items-center justify-center rounded-lg bg-accent text-slate-950 font-mono text-xs font-bold shadow-md hover:bg-accent-strong transition"
          >
            {isPlaying ? "Pause ❚❚" : "Play ▶"}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-10 px-3 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground text-xs font-mono transition"
            title="Restart replay from beginning"
          >
            ↺ Restart
          </button>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex h-10 px-3 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground text-xs font-mono transition"
            title="Exit replay mode"
          >
            ✕ Exit
          </button>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-mono text-muted hover:text-foreground hover:bg-surface-2 transition"
          aria-label="Next step"
        >
          Next ›
        </button>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-mono text-muted/70">
        <span>Space: Play/Pause</span>
        <span>← / →: Nav</span>
        <span>Esc: Exit</span>
      </div>
    </div>
  );
}

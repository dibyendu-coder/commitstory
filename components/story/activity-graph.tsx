import type { CommitItem } from "@/types/repository";

interface ActivityGraphProps {
  commits: CommitItem[];
}

export function ActivityGraph({ commits }: ActivityGraphProps) {
  if (commits.length === 0) return null;

  // Group commits into 24 temporal bins
  const sortedCommits = [...commits].sort(
    (a, b) => new Date(a.author.date).getTime() - new Date(b.author.date).getTime()
  );

  const minTime = new Date(sortedCommits[0].author.date).getTime();
  const maxTime = new Date(sortedCommits[sortedCommits.length - 1].author.date).getTime();
  const timeSpan = Math.max(1, maxTime - minTime);

  const BINS_COUNT = 24;
  const bins = new Array<number>(BINS_COUNT).fill(0);

  sortedCommits.forEach((c) => {
    const t = new Date(c.author.date).getTime();
    const ratio = Math.min(1, Math.max(0, (t - minTime) / timeSpan));
    const binIdx = Math.min(BINS_COUNT - 1, Math.floor(ratio * BINS_COUNT));
    bins[binIdx] += 1;
  });

  const maxCount = Math.max(1, ...bins);

  const startYear = new Date(minTime).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const endYear = new Date(maxTime).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <div className="surface-card p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-muted">
        <span className="uppercase tracking-widest text-accent">HISTORICAL ACTIVITY DENSITY</span>
        <span>{startYear} → {endYear}</span>
      </div>

      <div className="flex items-end gap-1 h-12 pt-2">
        {bins.map((count, idx) => {
          const heightPercent = Math.max(8, Math.round((count / maxCount) * 100));
          const isSpike = count === maxCount && count > 1;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end h-full group relative"
            >
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t transition-all ${
                  isSpike
                    ? "bg-accent shadow-[0_0_12px_rgba(122,162,255,0.6)]"
                    : count > 0
                    ? "bg-accent/40 group-hover:bg-accent/70"
                    : "bg-surface-2"
                }`}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                <span className="rounded bg-surface-2 border border-border px-2 py-0.5 text-[10px] font-mono text-foreground whitespace-nowrap">
                  {count} commits
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { ProjectDnaIntelligence } from "@/lib/analysis/types";

interface ProjectDnaStripProps {
  dna: ProjectDnaIntelligence;
}

export function ProjectDnaStrip({ dna }: ProjectDnaStripProps) {
  const items = [
    { label: "PROJECT AGE", value: `${(dna.ageInDays / 365.25).toFixed(1)} yrs` },
    { label: "COMMITS", value: dna.totalCommits.toString() },
    { label: "CONTRIBUTORS", value: dna.contributorCount.toString() },
    { label: "RELEASES", value: dna.releaseCount.toString() },
    { label: "VELOCITY", value: `${dna.commitVelocityPerWeek} / wk` },
    { label: "PATTERN", value: dna.developmentPattern.replace("-", " ") },
  ];

  return (
    <div className="surface-card p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
          PROJECT DNA STRIP
        </h2>
        <span className="text-[11px] font-mono text-muted">
          Lead Contributor Share: {dna.topContributorSharePercent}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
              {item.label}
            </span>
            <span className="text-base font-bold font-mono text-foreground capitalize block">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { RepositoryStats } from "@/types/repository";

interface RepoDnaProps {
  stats: RepositoryStats;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function RepoDna({ stats }: RepoDnaProps) {
  const statItems = [
    {
      label: "PROJECT AGE",
      value: `${stats.projectAgeYears} yrs`,
      subtext: `${stats.projectAgeDays.toLocaleString()} days active`,
    },
    {
      label: "STARS",
      value: formatNumber(stats.stargazersCount),
      subtext: `${stats.stargazersCount.toLocaleString()} stargazers`,
    },
    {
      label: "FORKS",
      value: formatNumber(stats.forksCount),
      subtext: `${stats.forksCount.toLocaleString()} forks`,
    },
    {
      label: "RECENT COMMITS",
      value: stats.totalCommitsEstimate ? stats.totalCommitsEstimate.toString() : "30+",
      subtext: "Sampled history window",
    },
    {
      label: "CONTRIBUTORS",
      value: stats.contributorsCount ? stats.contributorsCount.toString() : "0",
      subtext: "Active contributors",
    },
    {
      label: "RELEASES",
      value: stats.releasesCount !== undefined ? stats.releasesCount.toString() : "0",
      subtext: "Tagged releases",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
          PROJECT DNA
        </h2>
        <span className="text-xs font-mono text-muted">Core Metrics</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="surface-card flex flex-col justify-between p-4 space-y-2"
          >
            <span className="text-[10px] font-mono tracking-wider text-muted uppercase">
              {item.label}
            </span>
            <div className="text-2xl font-bold font-mono text-foreground">
              {item.value}
            </div>
            <span className="text-[11px] text-muted truncate">
              {item.subtext}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

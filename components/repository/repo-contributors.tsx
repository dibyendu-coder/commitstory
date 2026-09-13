import Image from "next/image";
import type { ContributorItem } from "@/types/repository";

interface RepoContributorsProps {
  contributors: ContributorItem[];
}

export function RepoContributors({ contributors }: RepoContributorsProps) {
  if (contributors.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
          TOP CONTRIBUTOR MOMENTUM
        </h2>
        <span className="text-xs font-mono text-muted">
          {contributors.length} active contributors
        </span>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {contributors.slice(0, 16).map((c) => (
          <a
            key={c.login}
            href={c.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="surface-card flex items-center gap-2.5 p-2 px-3 hover:border-accent/40 transition group"
          >
            <Image
              src={c.avatarUrl}
              alt={c.login}
              width={24}
              height={24}
              className="rounded-full border border-border group-hover:border-accent"
            />
            <span className="text-xs font-mono text-foreground font-medium">
              {c.login}
            </span>
            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-muted">
              {c.contributions}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

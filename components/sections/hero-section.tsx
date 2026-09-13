import { MiniTimeline } from "@/components/mini-timeline";
import { RepositoryInput } from "@/components/repository-input";

export function HeroSection() {
  return (
    <section className="section-wrap">
      <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted">
        <span className="h-2 w-2 rounded-full bg-accent" /> CommitStory
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Every codebase has a <span className="text-gradient">story.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            CommitStory turns raw Git history into a cinematic evolution narrative so teams can
            quickly understand where a project started, how it changed, and what shaped it.
          </p>

          <div className="mt-8 max-w-2xl">
            <RepositoryInput />
          </div>
        </div>

        <MiniTimeline />
      </div>
    </section>
  );
}

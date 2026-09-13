import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="section-wrap max-w-xl mx-auto text-center space-y-6">
        <div className="surface-card p-8 sm:p-10 space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-mono text-xl font-bold">
            404
          </div>
          <h1 className="text-2xl font-bold text-foreground font-mono">
            Page Not Found
          </h1>
          <p className="text-sm text-muted leading-relaxed font-mono">
            The requested repository story or page could not be located.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-input)] bg-accent text-slate-950 font-medium px-6 text-sm hover:bg-accent-strong transition"
            >
              ← Return to CommitStory
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

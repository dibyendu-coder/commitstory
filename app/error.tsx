"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <div className="section-wrap max-w-xl mx-auto text-center space-y-6">
        <div className="surface-card p-8 sm:p-10 space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 font-mono text-xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold text-foreground font-mono">
            Something Went Wrong
          </h1>
          <p className="text-sm text-muted leading-relaxed font-mono">
            An unexpected error occurred while processing repository history. Please try again.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-input)] bg-accent text-slate-950 font-medium px-5 text-sm hover:bg-accent-strong transition"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-input)] border border-border bg-surface-2 text-foreground font-medium px-5 text-sm hover:bg-surface transition"
            >
              ← Search another repo
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

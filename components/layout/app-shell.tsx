import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="subtle-grid min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        {children}
      </main>
    </div>
  );
}

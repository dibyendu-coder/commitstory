import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[var(--radius-input)] border border-border bg-surface-2 px-3 text-sm text-foreground outline-none ring-accent/30 transition placeholder:text-muted focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}

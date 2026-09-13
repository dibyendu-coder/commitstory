interface InfoSectionProps {
  title: string;
  items: string[];
  variant: "steps" | "chips";
}

export function InfoSection({ title, items, variant }: InfoSectionProps) {
  return (
    <section className="section-wrap border-t border-border/60">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {variant === "steps" ? (
        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <li key={item} className="surface-card p-4 text-sm text-muted">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="text-foreground">{item}</p>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mt-5 flex flex-wrap gap-3">
          {items.map((item) => (
            <li key={item} className="rounded-full border border-border bg-surface px-4 py-2 text-sm">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

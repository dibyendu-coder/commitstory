"use client";

import { useState } from "react";
import type { HistoricalChapter } from "@/lib/analysis/types";

interface ChapterNavProps {
  chapters: HistoricalChapter[];
  onSelectChapter?: (chapterId: string) => void;
}

export function ChapterNav({ chapters, onSelectChapter }: ChapterNavProps) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id || "");

  if (chapters.length === 0) return null;

  const handleClick = (id: string) => {
    setActiveId(id);
    if (onSelectChapter) {
      onSelectChapter(id);
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-4 z-30 surface-card p-2 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono text-muted uppercase px-2 shrink-0">
          CHAPTERS:
        </span>
        {chapters.map((ch) => {
          const isActive = activeId === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleClick(ch.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-mono transition ${
                isActive
                  ? "bg-accent/20 text-accent font-medium border border-accent/40"
                  : "text-muted hover:text-foreground hover:bg-surface-2"
              }`}
            >
              {ch.title} — {ch.subtitle}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

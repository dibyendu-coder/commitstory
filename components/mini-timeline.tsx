"use client";

import { motion } from "framer-motion";

const points = ["Birth", "Growth", "Refactor", "Release"];

export function MiniTimeline() {
  return (
    <div className="surface-card overflow-hidden p-6">
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] text-muted">
        <span>Story pulse</span>
        <span>2020 → 2026</span>
      </div>
      <div className="relative mt-6">
        <div className="h-px w-full bg-border" />
        <motion.div
          className="absolute left-0 top-0 h-px bg-accent"
          initial={{ width: "8%" }}
          animate={{ width: ["8%", "68%", "43%", "92%"] }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {points.map((point, index) => (
            <motion.div
              key={point}
              className="rounded-xl border border-border bg-surface-2 p-3 text-xs"
              initial={{ opacity: 0.5, y: 6 }}
              animate={{ opacity: [0.6, 1, 0.6], y: [2, -3, 2] }}
              transition={{
                delay: index * 0.15,
                duration: 3.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {point}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

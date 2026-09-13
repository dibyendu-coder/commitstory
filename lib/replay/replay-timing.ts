import type { SignificanceLevel, TurningPointType } from "@/lib/analysis/types";

export function calculateStepDurationMs(
  type: TurningPointType | "today",
  significance: SignificanceLevel,
  summaryLength: number
): number {
  let baseMs = 4000;

  if (type === "birth" || type === "today") {
    baseMs = 5000;
  } else if (significance === "high") {
    baseMs = 5500;
  } else if (significance === "medium") {
    baseMs = 4500;
  } else {
    baseMs = 3500;
  }

  // Adjust slightly for text length
  if (summaryLength > 120) {
    baseMs += 1000;
  }

  return baseMs;
}

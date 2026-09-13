import type { BaseRepositoryData } from "@/types/repository";
import type { AnalysisResult } from "./types";
import { analyzeProjectDna } from "./project-dna";
import { detectSignals } from "./signals";
import { generateTurningPoints } from "./turning-points";
import { generateChapters } from "./chapters";

export function analyzeRepository(data: BaseRepositoryData): AnalysisResult {
  const dna = analyzeProjectDna(data);
  const signals = detectSignals(data);
  const turningPoints = generateTurningPoints(data, signals);
  const chapters = generateChapters(turningPoints);

  const hasSufficientData = data.commits.length >= 2;
  const lowDataReason = !hasSufficientData
    ? "Not enough historical activity to identify major turning points yet."
    : undefined;

  return {
    dna,
    signals,
    turningPoints,
    chapters,
    hasSufficientData,
    lowDataReason,
  };
}

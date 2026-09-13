import type { FactVsInference, SignificanceLevel, TurningPointType } from "@/lib/analysis/types";

export interface ReplayStepMetric {
  label: string;
  value: string;
}

export interface ReplayStepCommit {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  date: string;
}

export interface ReplayStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  date: string;
  formattedDate: string;
  title: string;
  chapterTitle?: string;
  chapterSubtitle?: string;
  type: TurningPointType | "today";
  significance: SignificanceLevel;
  summary: string;
  classification: FactVsInference;
  confidence: number;
  durationMs: number;
  turningPointId?: string;
  metrics: ReplayStepMetric[];
  commits: ReplayStepCommit[];
  releases: string[];
  contributors: string[];
  lifetimePercent: number;
}

export interface ReplaySequence {
  steps: ReplayStep[];
  totalDurationMs: number;
  repositoryName: string;
}

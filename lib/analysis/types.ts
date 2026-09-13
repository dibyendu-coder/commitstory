export type FactVsInference = "fact" | "inference";

export type SignificanceLevel = "low" | "medium" | "high";

export type TurningPointType =
  | "birth"
  | "growth"
  | "architecture"
  | "contributors"
  | "release"
  | "refactor"
  | "activity"
  | "revival"
  | "milestone";

export type DevelopmentPattern =
  | "steady"
  | "bursty"
  | "rapid-growth"
  | "experimental"
  | "maintenance-heavy"
  | "unknown";

export interface ProjectDnaIntelligence {
  ageInDays: number;
  totalCommits: number;
  contributorCount: number;
  releaseCount: number;
  primaryLanguages: string[];
  activityLevel: "low" | "medium" | "high";
  developmentPattern: DevelopmentPattern;
  commitVelocityPerWeek: number;
  topContributorSharePercent: number;
}

export interface DetectedSignal {
  id: string;
  type:
    | "activity-spike"
    | "activity-drop"
    | "contributor-wave"
    | "contributor-concentration"
    | "large-change"
    | "new-directory"
    | "tech-config-change"
    | "release-milestone"
    | "inactivity-period"
    | "revival";
  date: string;
  title: string;
  description: string;
  metrics?: Record<string, string | number>;
  relatedSha?: string;
  relatedTag?: string;
}

export interface TurningPointEvidence {
  commits?: Array<{
    sha: string;
    shortSha: string;
    message: string;
    date: string;
    author: string;
  }>;
  contributors?: string[];
  releases?: string[];
  files?: string[];
  metrics?: Array<{
    label: string;
    value: string;
  }>;
}

export interface TurningPoint {
  id: string;
  date: string;
  title: string;
  type: TurningPointType;
  significance: SignificanceLevel;
  score: number; // 0 - 100
  summary: string;
  classification: FactVsInference;
  confidence: number; // 0 - 100
  evidence: TurningPointEvidence;
}

export interface HistoricalChapter {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
  turningPointIds: string[];
  summary: string;
  classification: FactVsInference;
}

export interface AnalysisResult {
  dna: ProjectDnaIntelligence;
  signals: DetectedSignal[];
  turningPoints: TurningPoint[];
  chapters: HistoricalChapter[];
  hasSufficientData: boolean;
  lowDataReason?: string;
}

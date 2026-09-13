import type { TurningPoint, HistoricalChapter, FactVsInference } from "./types";

export function generateChapters(turningPoints: TurningPoint[]): HistoricalChapter[] {
  if (turningPoints.length === 0) {
    return [];
  }

  const sortedPoints = [...turningPoints].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chapters: HistoricalChapter[] = [];

  // Group turning points into 2-4 logical chapters based on chronology and types
  const birthPoint = sortedPoints.find((p) => p.type === "birth") || sortedPoints[0];
  const growthPoints = sortedPoints.filter((p) => p.type === "growth" || p.type === "activity" || p.type === "architecture");
  const releasePoints = sortedPoints.filter((p) => p.type === "release" || p.type === "milestone");
  const revivalPoints = sortedPoints.filter((p) => p.type === "revival");

  // Chapter 1: Genesis & Foundations
  const ch1End = growthPoints[0]?.date || sortedPoints[Math.min(1, sortedPoints.length - 1)].date;
  chapters.push({
    id: "chapter-01",
    title: "Chapter 01",
    subtitle: "Genesis & Foundations",
    startDate: birthPoint.date,
    endDate: ch1End,
    turningPointIds: [birthPoint.id],
    summary: `The project history begins with initial setup and initial repository commits.`,
    classification: "fact",
  });

  // Chapter 2: Growth & Expansion (if growth or contributor points exist)
  if (growthPoints.length > 0 || sortedPoints.length > 2) {
    const startPt = growthPoints[0] || sortedPoints[1];
    const endPt = releasePoints[0] || sortedPoints[sortedPoints.length - 1];
    chapters.push({
      id: "chapter-02",
      title: "Chapter 02",
      subtitle: "Growth & Feature Acceleration",
      startDate: startPt.date,
      endDate: endPt.date,
      turningPointIds: growthPoints.map((g) => g.id),
      summary: `Development momentum intensified with notable feature work and baseline commit surges.`,
      classification: "inference",
    });
  }

  // Chapter 3: Release Era or Current Era
  if (releasePoints.length > 0 || revivalPoints.length > 0 || chapters.length < 3) {
    const lastPoint = sortedPoints[sortedPoints.length - 1];
    const relStart = releasePoints[0]?.date || lastPoint.date;
    const subtitleName = releasePoints.length > 0 ? "Release & Production Milestones" : "Maturation & Continued History";
    const classification: FactVsInference = releasePoints.length > 0 ? "fact" : "inference";

    chapters.push({
      id: `chapter-0${chapters.length + 1}`,
      title: `Chapter 0${chapters.length + 1}`,
      subtitle: subtitleName,
      startDate: relStart,
      endDate: lastPoint.date,
      turningPointIds: [...releasePoints, ...revivalPoints].map((r) => r.id),
      summary: `Project progressed to tagged release milestones and ongoing codebase stability.`,
      classification,
    });
  }

  return chapters;
}

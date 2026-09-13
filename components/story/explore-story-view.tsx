"use client";

import { useState } from "react";
import type { RepositoryAnalysisData } from "@/types/repository";
import { StoryHeader } from "./story-header";
import { ProjectDnaStrip } from "./project-dna-strip";
import { ActivityGraph } from "./activity-graph";
import { ChapterNav } from "./chapter-nav";
import { StoryTimeline } from "./story-timeline";
import { RepoContributors } from "@/components/repository/repo-contributors";
import { ReplayStage } from "@/components/replay/replay-stage";

interface ExploreStoryViewProps {
  data: RepositoryAnalysisData;
}

export function ExploreStoryView({ data }: ExploreStoryViewProps) {
  const [isReplayOpen, setIsReplayOpen] = useState(false);

  const firstCommitDate = data.commits.length > 0
    ? data.commits[data.commits.length - 1].author.date
    : undefined;

  const handleExploreTurningPoint = (turningPointId: string) => {
    setIsReplayOpen(false);
    // Find turning point element in timeline or click card
    const element = document.getElementById(turningPointId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-8 pt-4">
      <StoryHeader
        summary={data.summary}
        stats={data.stats}
        firstCommitDate={firstCommitDate}
        onStartReplay={() => setIsReplayOpen(true)}
      />

      <ProjectDnaStrip dna={data.intelligence.dna} />
      <ActivityGraph commits={data.commits} />
      <ChapterNav chapters={data.intelligence.chapters} />
      <StoryTimeline data={data} />
      <RepoContributors contributors={data.contributors} />

      {/* FULLSCREEN REPLAY STAGE */}
      <ReplayStage
        key={isReplayOpen ? "replay-open" : "replay-closed"}
        data={data}
        isOpen={isReplayOpen}
        onClose={() => setIsReplayOpen(false)}
        onExploreTurningPoint={handleExploreTurningPoint}
      />
    </div>
  );
}

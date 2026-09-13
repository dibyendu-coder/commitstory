"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidGitHubRepositoryUrl, parseGitHubUrl } from "@/lib/repository-url";
import { AnalysisLoading, type AnalysisStage } from "@/components/analysis-loading";
import type { AnalysisApiResponse } from "@/types/repository";

const EXAMPLE_URL = "https://github.com/vercel/next.js";

const INITIAL_STAGES: AnalysisStage[] = [
  { id: "validate", label: "Validating repository", status: "pending" },
  { id: "connect", label: "Connecting to GitHub", status: "pending" },
  { id: "history", label: "Reading project history", status: "pending" },
  { id: "contributors", label: "Mapping contributors", status: "pending" },
  { id: "timeline", label: "Preparing timeline", status: "pending" },
];

export function RepositoryInput() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<AnalysisStage[]>(INITIAL_STAGES);
  const [parsedRepoName, setParsedRepoName] = useState<string>("");

  const runAnalysisFlow = async (targetUrl: string) => {
    const parsed = parseGitHubUrl(targetUrl);
    if (!parsed) {
      setIsError(true);
      setMessage(
        "Please enter a valid public GitHub repository URL, like https://github.com/owner/repo"
      );
      return;
    }

    const { owner, repo } = parsed;
    setParsedRepoName(`${owner}/${repo}`);
    setIsError(false);
    setMessage(null);
    setIsLoading(true);

    // Stage 1: Validate
    setStages([
      { id: "validate", label: "Validating repository", status: "completed" },
      { id: "connect", label: "Connecting to GitHub", status: "active" },
      { id: "history", label: "Reading project history", status: "pending" },
      { id: "contributors", label: "Mapping contributors", status: "pending" },
      { id: "timeline", label: "Preparing timeline", status: "pending" },
    ]);

    try {
      // Stage 2 & 3: Call API
      const res = await fetch(`/api/repository?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
      
      setStages([
        { id: "validate", label: "Validating repository", status: "completed" },
        { id: "connect", label: "Connecting to GitHub", status: "completed" },
        { id: "history", label: "Reading project history", status: "completed" },
        { id: "contributors", label: "Mapping contributors", status: "active" },
        { id: "timeline", label: "Preparing timeline", status: "pending" },
      ]);

      const json: AnalysisApiResponse = await res.json();

      if (!res.ok || !json.success) {
        const errorMsg = !json.success ? json.error.message : "Failed to analyze repository.";
        setIsLoading(false);
        setIsError(true);
        setMessage(errorMsg);
        return;
      }

      // Stage 4 & 5: Wrap up loading transition
      setStages([
        { id: "validate", label: "Validating repository", status: "completed" },
        { id: "connect", label: "Connecting to GitHub", status: "completed" },
        { id: "history", label: "Reading project history", status: "completed" },
        { id: "contributors", label: "Mapping contributors", status: "completed" },
        { id: "timeline", label: "Preparing timeline", status: "completed" },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 400));
      router.push(`/explore/${owner}/${repo}`);
    } catch {
      setIsLoading(false);
      setIsError(true);
      setMessage("Network connection error. Please try again.");
    }
  };

  const prefillExample = () => {
    setValue(EXAMPLE_URL);
    if (message) {
      setMessage(null);
      setIsError(false);
    }
    runAnalysisFlow(EXAMPLE_URL);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidGitHubRepositoryUrl(value)) {
      setIsError(true);
      setMessage(
        "Please enter a valid public GitHub repository URL, like https://github.com/owner/repo"
      );
      return;
    }

    await runAnalysisFlow(value);
  };

  if (isLoading) {
    return <AnalysisLoading stages={stages} repoName={parsedRepoName} />;
  }

  return (
    <form className="surface-card w-full p-4 sm:p-5" onSubmit={onSubmit} noValidate>
      <label className="mb-2 block text-sm text-muted" htmlFor="repository-url">
        Public GitHub repository URL
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          id="repository-url"
          name="repository-url"
          placeholder="https://github.com/owner/repo"
          value={value}
          autoComplete="off"
          onChange={(event) => {
            setValue(event.target.value);
            if (message) {
              setMessage(null);
              setIsError(false);
            }
          }}
        />
        <Button type="submit" className="md:min-w-44" disabled={isLoading}>
          {isLoading ? "Validating…" : "Explore the story"}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" variant="ghost" onClick={prefillExample} disabled={isLoading}>
          Use example repository
        </Button>
      </div>

      <motion.p
        className={isError ? "mt-3 text-sm text-rose-300" : "mt-3 text-sm text-muted"}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: message ? 1 : 0, y: message ? 0 : -4 }}
      >
        {message ?? "\u00A0"}
      </motion.p>
    </form>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidGitHubRepositoryUrl } from "@/lib/repository-url";

const EXAMPLE_URL = "https://github.com/vercel/next.js";

export function RepositoryInput() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const prefillExample = () => {
    setValue(EXAMPLE_URL);
    setIsError(false);
    setMessage("Example repository added. Ready when you are.");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidGitHubRepositoryUrl(value)) {
      setIsError(true);
      setMessage(
        "Please enter a valid public GitHub repository URL, like https://github.com/owner/repo",
      );
      return;
    }

    setIsError(false);
    setMessage(null);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    setIsLoading(false);
    setMessage(
      "Phase 0 preview complete. Analysis arrives in the next phase once GitHub integration is added.",
    );
  };

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

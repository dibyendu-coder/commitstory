import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/sections/hero-section";
import { InfoSection } from "@/components/sections/info-section";

const howItWorks = ["Paste repository URL", "Validate format", "Reveal timeline story"];

const discoveries = [
  "Project origins and early milestones",
  "Architecture shifts over time",
  "Growth periods and release cadence",
  "Contributor waves and momentum",
];

export default function Home() {
  return (
    <AppShell>
      <HeroSection />
      <InfoSection title="How it works" items={howItWorks} variant="steps" />
      <InfoSection
        title="What you can discover"
        items={discoveries}
        variant="chips"
      />
    </AppShell>
  );
}

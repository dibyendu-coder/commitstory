# CommitStory

> **GitHub shows what a repository looks like today. CommitStory shows the story of how it got here.**

CommitStory turns Git repository history into an interactive documentary narrative of turning points, contributor waves, releases, and codebase evolution.

---

## 🌟 Core Features

- **Project DNA Strip:** Analyzes repository age, commit velocity, contributor distribution, and development patterns (`bursty`, `steady`, `rapid-growth`, `experimental`, `maintenance-heavy`).
- **Deterministic Intelligence Engine:** Detects historical signals (activity spikes relative to repository baseline, inactivity gaps, revivals, technology/configuration changes, contributor expansion, release milestones) with zero fabricated claims.
- **Fact vs. Inference Trust Model:** Every turning point is strictly categorized as **FACT** (direct data proof) or **INFERENCE** (heuristic baseline analysis) with an explicit confidence score and evidence justification.
- **Interactive Story Timeline:** Multi-tier chronological timeline featuring 3 visual hierarchy levels (Background commit stream, Significant events, Turning Point story cards).
- **Chapter Navigation:** Chronological chapter breaks (*Genesis & Foundations*, *Growth & Feature Acceleration*, *Release Milestones*) with smooth scrolling navigation.
- **Replay History Simulation:** Interactive documentary replay stage allowing users to watch the project evolve step-by-step with player controls (Play/Pause, Next/Previous, Restart, Exit, and "Explore this moment →").
- **Evidence Panel:** Slide-over panel detailing *"WHY COMMITSTORY MARKED THIS"* with direct links to GitHub commits and releases.

---

## 🏗️ Architecture & Data Flow

```text
GitHub API (Server-Side Only)
            ↓
  Normalized GitHub Data
            ↓
Phase 2 Intelligence Engine
  ├── Project DNA Analyzer
  ├── Signal Detector
  ├── Turning Point Engine
  └── Chapter Generator
            ↓
Phase 3 Interactive Timeline
            ↓
Phase 4 Replay Simulation
```

---

## 🔐 Security & Credential Rules

- `GITHUB_TOKEN` is used **exclusively server-side** via `process.env.GITHUB_TOKEN`.
- No `NEXT_PUBLIC_GITHUB_TOKEN` variable exists anywhere in the application.
- `GITHUB_TOKEN` is never sent to the browser, stored in client state/storage, or printed in logs.
- `.env.local` is ignored in `.gitignore`.
- If `GITHUB_TOKEN` is missing, the application renders a friendly configuration state rather than crashing.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your GitHub Personal Access Token (classic or fine-grained) in `.env.local`:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```

### Installation & Local Server

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 🧪 Verification & Building

```bash
# Run ESLint check
npm run lint

# Run TypeScript type check
npm run typecheck

# Build for production
npm run build

# Start production server
npm run start
```

---

## 🎬 60-Second Demo Script

1. **Enter Repository:** Open home page and enter a public GitHub URL (e.g., `https://github.com/vercel/next.js` or click *Use example repository*).
2. **Analysis Progress:** Observe real-time validation and analysis stages (*Validating*, *Connecting*, *Reading history*, *Mapping contributors*, *Preparing timeline*).
3. **Explore Page:** Review Project DNA strip and commit density graph.
4. **Story Timeline:** Scroll through chapters, view Level 3 turning point cards with **FACT** / **INFERENCE** badges and confidence scores.
5. **Inspect Evidence:** Click a turning point to open the slide-over evidence panel showing supporting metrics and GitHub commit links.
6. **Replay History:** Click **▶ Replay History** at top to launch the interactive documentary simulation stage.
7. **Explore Moment:** Click *"Explore this moment →"* to transition seamlessly back to the timeline view.

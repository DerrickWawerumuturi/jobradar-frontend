# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

The working directory `jobradar(frontend)/` is only a wrapper; the Next.js app and the git repo both live in `jobradar/`. **Run every command from `jobradar/`, not from the wrapper.**

## Commands

```bash
cd jobradar
npm run dev     # dev server on http://localhost:3000
npm run build   # production build (also the only type-check gate — no `lint` or `test` script exists)
npm start       # serve the production build
```

There is no test runner, no ESLint config, and no `typecheck` script. To type-check without a full build: `npx tsc --noEmit`.

The app is useless without the backend: `api/api.ts` posts to a hardcoded `http://127.0.0.1:8000/analyze`, so a local FastAPI-style JobRadar backend must be running on port 8000 for anything past the upload dialog to work. The URL is not env-driven — change it in `api/api.ts` if the backend moves.

## Architecture

Next.js 16 App Router + React 19, TypeScript strict, Tailwind v4 (CSS-first — no `tailwind.config`; the theme lives entirely in `@theme inline` / `:root` / `.dark` blocks in `src/app/globals.css`).

Data flow, end to end:

1. `src/app/page.tsx` (server component) renders `Navbar` + `Hero`.
2. `Hero.tsx` (`'use client'`) owns **all** application state — the selected `File`, dialog open state, upload status, and the analysis result. There is no store, context, or server action anywhere.
3. `ui/FileUpload.tsx` inside a `Dialog` validates PDF-only, animates a fake progress bar (a `setInterval`, not real upload progress), and hands the `File` up via `setHandleCv`.
4. `Hero`'s effect fires when `cv && !open && uploadStatus === 'idle'` — i.e. **closing the dialog is what triggers the network call**, not the Upload button. Keep that invariant in mind when touching the dialog or the status state machine.
5. `api/api.ts` (`Analyze`) POSTs the file as multipart `FormData` and returns `JobRadarAnalysis`.
6. The result is set in state *and* mirrored to `localStorage["jobradar"]`, which is rehydrated on mount. Removing the CV clears both. `localStorage` is the only persistence layer.

`src/types/jobradar.ts` is the contract with the backend (`market` + `ranked_jobs`). Any backend response-shape change must be mirrored here first — it is the single source of truth for the UI.

`src/components/Market/` renders the analysis. `Market.tsx` currently only surfaces three `MarketCard` stats from `market.skill_coverage` / `jobs_analyzed`; `SkillDemandChart.tsx` is an empty stub and `ranked_jobs`, `skill_gaps`, `top_skills`, and `user_skill_presence` are fetched but not yet displayed. This is where the unfinished work is.

## UI components

`src/components/ui/` is shadcn (`components.json`, style `base-nova`, zinc base, lucide icons), but built on **`@base-ui/react`, not Radix**. Consequences when writing or regenerating components:

- Composition uses the `render` prop, not `asChild` — e.g. `<DialogTrigger render={(props) => <Button {...props}>…</Button>} />`.
- Parts are named `Backdrop`/`Popup` (not `Overlay`/`Content`); state variants are `data-open:` / `data-closed:`.
- Add components with `npx shadcn@latest add <name>` from `jobradar/`; merge generated code by hand rather than overwriting local edits (e.g. `dialog.tsx` has a customized `DialogFooter`).

Toasts are `sonner` — `<Toaster />` is mounted once in `src/app/layout.tsx`; call `toast.error(...)` from client components.

## Conventions

- Import via the `@/*` alias for anything under `src/`. `api/` sits **outside** `src/`, so it is imported by relative path (`../../api/api`).
- Feature components are default-exported PascalCase files under `src/components/<Feature>/`; `ui/` primitives are named exports.
- Font: `Space_Grotesk` loaded in `layout.tsx` as `--font-space-grotesk`, exposed to Tailwind as `font-space`.


# JobRadar Frontend Specification

## Purpose

The JobRadar frontend is a market-intelligence dashboard.

The user uploads their CV and receives an analysis of how their skills
compare with the current job market.

The frontend should NOT feel like a generic resume analyzer.

The main question the UI should answer is:

"Where do I stand in the current job market, and what should I work on next?"

---

# User Flow

The primary flow is:

Upload CV
↓
Backend analyzes CV
↓
JobRadarAnalysis returned
↓
Frontend stores analysis
↓
Market dashboard renders
↓
User explores their position in the market

The backend is responsible for producing the intelligence.

The frontend is responsible for presenting that intelligence clearly.

---

# Main Dashboard

The dashboard should contain several sections.

## 1. Market Overview

At the top, show a high-level summary.

Examples:

- Number of jobs analyzed
- Number of skills detected
- User skill coverage
- Most demanded skill
- Number of potential skill gaps

This should immediately tell the user what was analyzed.

---

# 2. Market Skill Demand

Question answered:

"What skills are most commonly requested by the jobs analyzed?"

Use a horizontal bar chart.

Example:

Python       ███████████████ 56%
React        ███████         28%
TypeScript   █████           22%
SQL          ████            18%

Use the existing `top_skills` / skill frequency data.

The visualization should show:

- skill name
- number of jobs
- percentage/frequency

Limit the initial visualization to the top 10–15 skills.

Provide a way to view more if appropriate.

---

# 3. My Skills in the Market

Question answered:

"How common are the skills I already have?"

Use the backend's `user_skill_presence`.

For example:

Python       56%
React        28%
TypeScript   22%
PyTorch       6%
TensorFlow    6%

This should visually distinguish:

USER SKILLS

from

GENERAL MARKET SKILLS.

The user should be able to immediately see which of their skills are
highly relevant to the market.

---

# 4. Skill Gaps

Question answered:

"What important skills does the market want that I don't currently have?"

Use the backend's skill-gap data.

Prioritize gaps by market demand.

For example:

HIGH PRIORITY

Docker          44%
AWS             39%
Kubernetes      31%

MEDIUM PRIORITY

Spark           18%
Airflow         15%

Each skill should communicate:

- skill
- number of jobs requesting it
- market frequency
- why it matters

Do not simply display a giant list.

---

# 5. Skill Coverage

Question answered:

"How much of the important market skillset do I already cover?"

Use:

skill_coverage

Example:

                    15%
              ┌────────────┐
              │            │
              │     15%    │
              │  COVERAGE  │
              │            │
              └────────────┘

Then explain:

"You currently have 3 of the top 20 skills appearing in this market."

This should be presented as a useful metric, NOT as a judgment of the
user's employability.

---

# 6. Job Matches

Question answered:

"Which individual jobs align most closely with my current profile?"

Display ranked jobs.

Example:

92%   Senior ML Engineer
Adobe

88%   AI Engineer
Company X

84%   Python Engineer
Company Y

Each job should be expandable/clickable.

When expanded, show:

- overall similarity
- title similarity
- skill similarity
- experience similarity
- location similarity
- relevant skills
- missing skills

The similarity score comes from the backend.

Do NOT calculate similarity again in the frontend.

---

# 7. Market Skill Landscape

This is an important visualization.

Eventually create a scatter/bubble visualization showing the relationship
between:

- market frequency
- user's skills
- market skills
- skill gaps

Conceptually:

                 MARKET DEMAND
                      ↑

                      ● Python
                ● SQL

        ● React

● TypeScript

                      ○ Kubernetes
                ○ Docker

                      ─────────────→
                       FREQUENCY

Where:

● = user's skill
○ = skill the user does not have

More frequently requested skills should appear more prominently.

This visualization should help users visually understand their position
rather than just reading numbers.

---

# Visual Design

The dashboard should feel like a modern data/AI analytics product.

Think:

- clean
- technical
- minimal
- professional
- information-dense without feeling cluttered

Avoid:

- generic AI gradients everywhere
- excessive animations
- huge cards for tiny pieces of information
- unnecessary decorative elements
- dashboard widgets that don't communicate useful information

Charts should be visually interesting but still readable.

---

# Chart Library

Use Recharts for standard charts unless there is a strong reason to use
another library.

Potential visualizations:

- BarChart → skill demand
- BarChart → skill gaps
- RadarChart → optional skill profile
- ScatterChart → market skill landscape
- Pie/Donut → skill coverage
- ranked list → job matches

Do not add another visualization library unless Recharts cannot reasonably
support the required visualization.

---

# Component Architecture

Keep visualization components separate.

Suggested structure:

components/
└── market/
├── Market.tsx
├── MarketOverview.tsx
├── SkillDemandChart.tsx
├── UserSkillPresence.tsx
├── SkillGapChart.tsx
├── SkillCoverage.tsx
├── JobMatches.tsx
└── SkillLandscape.tsx

The `Market` component should compose these components.

Do not put every visualization inside one large component.

---

# Data Flow

The frontend receives:

JobRadarAnalysis

Example:

JobRadarAnalysis
│
├── top_skills
├── user_skill_presence
├── skill_gaps
├── skill_coverage
└── ranked_jobs
│
↓
visualization
│
↓
charts/UI

The frontend may transform data into chart-friendly structures.

For example:

frequency:

0.5555

can become:

55.55

for display as a percentage.

But the frontend should not recreate the market-analysis logic.

---

# Important

Do NOT invent backend fields.

Before implementing a component:

1. Inspect the existing `JobRadarAnalysis` TypeScript type.
2. Inspect the actual API response.
3. Use the existing field names.
4. Adapt the visualization to the actual data structure.

If a visualization requires information that the backend does not provide,
tell me before changing the backend architecture.

---

# Development Order

Build the dashboard incrementally:

### Step 1
Market overview.

### Step 2
Skill demand chart.

### Step 3
User skill market presence.

### Step 4
Skill gap visualization.

### Step 5
Skill coverage visualization.

### Step 6
Job match ranking.

### Step 7
Market skill landscape / scatter plot.

### Step 8
Polish layout, responsiveness, animations and interactions.

Do not build everything at once.

Verify each visualization against the actual backend data before moving
to the next one.

---

# Product Principle

Every visualization must answer a question.

Do not create a chart simply because the backend contains numerical data.

The user should be able to look at the dashboard and understand:

1. What the market wants.
2. What I already have.
3. What I'm missing.
4. How common my skills are.
5. Which jobs fit me best.
6. What I should prioritize learning.


# Code Change Documentation

When modifying the codebase, maintain separate engineering documentation
under `/docs`.

Do NOT add explanatory comments to source files solely for the purpose of
explaining changes.

Do NOT create documentation for every individual line or trivial change.

Documentation should explain meaningful changes at the file/component/
architectural level.

For every meaningful implementation task, update the appropriate changelog
file under:

/docs/changelog/

Use the current date for the filename.

Example:

/docs/changelog/2026-08-19.md

---

## Change Documentation Format

For each meaningful file that was changed, document:

### File
`path/to/file.tsx`

### What changed

Briefly describe what was changed.

### Why

Explain the engineering/product reason for the change.

### How it works

Explain the important implementation details.

### Before → After

Only include this when it helps explain the change.

### Dependencies / relationships

Explain how this file interacts with other important parts of the system.

### Design decisions

Explain any non-obvious technical decisions.

### Learning notes

Explain the important engineering concept demonstrated by the change.

---

## Documentation Rules

Keep documentation concise.

Do not document:

- formatting-only changes
- import ordering
- trivial variable renaming
- generated files
- dependency lockfile changes unless important
- obvious code changes that require no architectural explanation

Prioritize:

- architecture changes
- new components
- new functions/classes
- changes to data flow
- changes to API contracts
- changes to state management
- changes to ML/AI logic
- changes to database interaction
- significant UI/UX changes
- performance changes
- bug fixes where the underlying cause is non-obvious

The documentation should help a developer understand the codebase,
not reproduce every Git diff.

---

# Example

If `Hero.tsx` is redesigned, document it like:

### File
`frontend/components/Hero.tsx`

### What changed

Redesigned the CV upload section and separated the upload state from the
market analysis display.

### Why

The previous implementation mixed CV upload state, API interaction and
market rendering in the same UI flow. This made the component harder to
reason about and caused unnecessary rendering.

### How it works

The component now maintains:

- CV selection state
- upload state
- analysis state

After the API returns `JobRadarAnalysis`, the analysis is stored and passed
to the market dashboard.

### Engineering reasoning

The component represents the entry point into the application, so its
responsibility should primarily be handling user input and initiating the
analysis flow rather than performing market-analysis logic itself.

### Learning note

This demonstrates separation of concerns: UI state and orchestration
belong in the frontend component, while market intelligence remains a
backend responsibility.


## Component Responsibilities

### QueryInterpreter

Converts raw CV/user information into a structured ParsedQuery.

### SearchEngine

Uses the structured query to retrieve relevant jobs.

### SkillExtractor

Extracts normalized skills from job descriptions.

### SentenceEmbedder

Creates vector representations of user/job attributes.

### SimilarityEngine

Computes user → job similarity.

### MarketAnalyzer

Aggregates information across jobs to understand market demand.

### Frontend

Visualizes JobRadarAnalysis.
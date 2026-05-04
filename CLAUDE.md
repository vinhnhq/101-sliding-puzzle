# 101 Sliding Puzzle

> A mobile-friendly sliding-tile puzzle (8/15/24-puzzle) built on TanStack Start, demoing React's experimental `<ViewTransition>` for tile slides and stable `<Activity>` for preserving in-progress games across difficulty switches.

**Build reference:** [`README.md`](README.md) is the canonical step-by-step guide (originally `summary.md`). Read it for the full architecture: scaffold, React experimental setup, game logic, components, mobile polish, deploy.

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Vite dev server on http://localhost:3000 |
| `bun run build` | Production build (vite build + tsc --noEmit) |
| `bun run preview` | Serve the production build locally |
| `bun run start` | Start the production Nitro server |
| `bun run lint` | Biome check (lint + format diff, no writes) |
| `bun run format` | Biome check --write (auto-fix what it can) |

## Non-Obvious Conventions

- **Bun, not pnpm.** The README's `summary` references pnpm; this project runs on Bun for house-stack consistency. React experimental version is pinned exactly in `package.json` dependencies (no separate overrides needed under Bun in this stack).
- **Filename convention: kebab-case** (enforced by Biome `useFilenamingConvention`). Exceptions baked into `biome.json` for TanStack Router framework files (`__root.tsx`, `_pathlessLayout`, `*.$param.tsx`, `[*]*.ts` static-file routes), and `routeTree.gen.ts` is generated.
- **No UI library.** Board is `<button>` elements in CSS Grid. Difficulty tabs use semantic `role="tab"`. Per README, Radix/Base UI's `Tabs` would actively conflict with the `<Activity>` pattern (their `<Tabs.Content>` unmounts inactive tabs).
- **`<ViewTransition>` is `unstable_*` import.** From `react`, not `react-dom`. See README §6.

## Installed Skills

Mirror of `skills-lock.json` (8 skills, all GitHub-sourced from `vercel-labs/*`). Update both together.

| Skill | Purpose |
|-------|---------|
| `find-skills` | Discover other skills by domain |
| `web-design-guidelines` | UI / visual design rules |
| `deploy-to-vercel` | One-shot deploy script + conventions |
| `vercel-cli-with-tokens` | CLI auth + token management |
| `vercel-composition-patterns` | Compound components, lift state, no boolean props |
| `vercel-react-best-practices` | Performance + correctness rules (rendering, async, bundle, server) |
| `vercel-react-native-skills` | Cross-platform UX patterns (kept for future) |
| `vercel-react-view-transitions` | Matches README §6 ViewTransition usage exactly |

Materialized at `.agents/skills/<name>/`, symlinked from `.claude/skills/<name>/`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| _(none yet — Vercel env vars come in §13)_ | | |

## Process

For any non-trivial feature or change, follow `dev-workflow.md`. Stack-specific conventions live in this file (`CLAUDE.md`) for now since no `dev-workflow-tanstack-start.md` preset has been written.

```
PROVISION → SPEC → PLAN → IMPLEMENT → TEST → REVIEW → RELEASE
```

Sprint work lives under `__project__/tasks/sprint-NN-<name>/` with three files:
- `plan.md` — objective, scope, locked decisions, acceptance criteria
- `tasks.md` — task checklist (T01..Tn) ticked off during build
- `retro.md` — outcome metrics, process retro, actions

Master index: `__project__/tasks/README.md`.

### Slash commands (from `.claude/commands/`)

| Command | Phase | When to Use |
|---------|-------|-------------|
| `/spec` | Spec | Before writing any code — generate a structured PRD |
| `/plan` | Plan | Break spec into small verifiable tasks |
| `/build` | Implement | Implement one task at a time, thin vertical slices |
| `/test` | Test | TDD — failing test first, then implement |
| `/review` | Review | Five-axis code review before merge |
| `/code-simplify` | Review | Reduce complexity without changing behavior |
| `/ship` | Release | Pre-launch checklist + ship to production |

Trivial changes (typos, config tweaks): lint + typecheck + push. No spec/plan needed.

## Notes

- **Scaffold cruft to clean up:** `src/components/{DefaultCatchBoundary,NotFound,PostError,UserError}.tsx` and `src/utils/loggingMiddleware.tsx` violate kebab-case. They came from the TanStack Start example and most of the example routes (`/posts`, `/users`, `/route-a`, `/deferred`) will be stripped before the puzzle build starts. Renames or deletions handled in a follow-up commit.
- **Plugin install required (one-time, per machine):** in Claude Code, run `/plugin install agent-skills@anthropic` to install the plugin our `.claude/commands/*.md` invoke. The settings.json declares it; the harness has to actually install it.

# Todo: Sprint 01 — Core Puzzle Build

Status legend: ✓ done · → in progress · · backlog · ↷ stretch · ⏸ blocked

## Committed (must finish to release)

- [x] ✓ **T101** · Game logic module (`src/lib/puzzle.ts`)
- [x] ✓ **T102** · Mobile-responsive game styles (`src/styles/app.css`)
- [x] ✓ **T103** · `Tile` component (`src/components/tile.tsx`)
- [x] ✓ **T104** · `Board` component (`src/components/board.tsx`)
- [x] ✓ **T105** · `Game` component (`src/components/game.tsx`)
- [x] ✓ **T106** · `Puzzle` Activity switcher (`src/components/puzzle.tsx`)
- [x] ✓ **T107** · Wire home route (`src/routes/index.tsx`)
- [x] ✓ **T108** · Mobile QA pass — SSR verified clean; manual real-device confirmation pending (see retro)

## Stretch (pick up if capacity allows)

- [x] ✓ **T109** · Vercel deploy — live at https://101-sliding-puzzle.vercel.app (promoted directly to prod on first deploy via `vercel deploy --yes`)

## Blocked (waiting on external dependency)

_(none)_

---

## Ordering notes

T101 first — pure logic with no dependencies, lets every later task reason about the public API. T102 can run in parallel with T101 (no overlap). T103–T107 are strictly sequential (each imports the previous). T108 is the verification gate; T109 only after T108 is green.

## Build commands (per CLAUDE.md)

| Step | Command |
|------|---------|
| Dev server | `bun run dev` |
| Type + build | `bun run build` |
| Lint | `bun run lint` |
| Format | `bun run format` |

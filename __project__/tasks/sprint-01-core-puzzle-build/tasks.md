# Todo: Sprint 01 — Core Puzzle Build

Status legend: ✓ done · → in progress · · backlog · ↷ stretch · ⏸ blocked

## Committed (must finish to release)

- [ ] **T101** · Game logic module (`src/lib/puzzle.ts`) · ~20m
- [ ] **T102** · Mobile-responsive game styles (`src/styles/app.css`) · ~20m
- [ ] **T103** · `Tile` component (`src/components/tile.tsx`) · ~10m
- [ ] **T104** · `Board` component (`src/components/board.tsx`) · ~20m
- [ ] **T105** · `Game` component (`src/components/game.tsx`) · ~15m
- [ ] **T106** · `Puzzle` Activity switcher (`src/components/puzzle.tsx`) · ~20m
- [ ] **T107** · Wire home route (`src/routes/index.tsx`) · ~5m
- [ ] **T108** · Mobile QA pass · ~30m

## Stretch (pick up if capacity allows)

- [ ] ↷ **T109** · Vercel deploy · ~20m · sprint demos on localhost; deploy is icing

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

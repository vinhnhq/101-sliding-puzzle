# Plan: Sprint 01 — Core Puzzle Build

## Context

The scaffold is in place: TanStack Start runs, React experimental is pinned, viewport meta + theme-color are wired, and route boundaries (`default-catch-boundary`, `not-found`) are kebab-cased. `src/routes/index.tsx` is still a placeholder — no game logic, no components, no styles for the board.

This sprint builds the playable puzzle end-to-end per `README.md` §5–§11, then mobile-QAs it per §12. After this sprint the home page renders a working 3×3 / 4×4 / 5×5 sliding-tile puzzle with `<ViewTransition>` tile animations and `<Activity>`-preserved difficulty tabs.

The sprint exists as a single vertical slice because every component below the page route depends on the one above it (Game → Board → Tile → puzzle.ts), and the demo is meaningless without the full chain wired together. Deploying to Vercel is held as Stretch — the must-have outcome is "works on a real phone over LAN," not "lives at a public URL."

## Spec source

The README is the canonical spec. This plan does not duplicate code or design choices — it tracks **what** lands and **how we know it's done**, deferring the **how** to the README sections cited per task.

## Device / viewport matrix

Mobile-first consumer game. Must work on:

- **iPhone SE (375 × 667)** — smallest supported; tile size on 5×5 is the tightest case
- **iPhone 14 / 15 (390 × 844)** — primary mobile target
- **Pixel 7 (412 × 915)** — Android Chrome
- **Desktop Chrome (≥1280 wide)** — secondary, but board caps at 420px

Test matrix: real iPhone over LAN (must), DevTools device emulation (sufficient for the rest).

## Acceptance criteria (sprint-level, binary)

- [ ] Tapping any tile adjacent to the empty cell slides it into that cell
- [ ] Tile movement is animated by `<ViewTransition>` (visibly slides, doesn't snap)
- [ ] Move counter increments on every legal move; resets on shuffle
- [ ] "Solved" banner appears when board is in `1..N²-1, 0` order
- [ ] Tabs switch between 3×3 / 4×4 / 5×5 instantly with no remount flash
- [ ] In-progress board + move count survive a tab switch and back (`<Activity>` working)
- [ ] On iPhone SE width (375px): board fits with no horizontal scroll
- [ ] On iPhone with notch: content not hidden by home indicator (safe-area working)
- [ ] No double-tap zoom on tile tap; no 300ms tap delay
- [ ] `bun run build` passes (vite build + tsc --noEmit)
- [ ] `bun run lint` passes (Biome clean)

## Out of scope

- Best-score tracking / `localStorage`
- Adjacency hints (highlighting movable tiles)
- Direction-aware transitions (`addTransitionType`)
- Image puzzle mode
- Keyboard controls
- Daily seed / streak tracking
- PWA manifest / Add-to-Home-Screen
- Unit tests for `puzzle.ts` (no test runner installed; deferred to a tooling sprint)
- All other §14 polish ideas

## Tasks

### T101 — Game logic module
**File:** `src/lib/puzzle.ts` (new)
**Change:** Add pure functions per README §5: `Board` type, `createSolved`, `isSolved`, `indexToRowCol`, `tryMove`, `shuffle`. No React, no DOM, no imports.
**Acceptance:** Module compiles. `tryMove` returns `null` for non-adjacent tiles. `shuffle(4)` returns a `Board` of length 16 with values `0..15`, each exactly once, that is `!isSolved`.

### T102 — Mobile-responsive game styles
**File:** `src/styles/app.css` (replace contents)
**Change:** Replace current Tailwind-only stylesheet with the README §6 CSS — CSS variables for colors and `--board-size`, `.page` / `.tabs` / `.stats` / `.win-banner` / `.board` / `.tile` / `.shuffle-btn` rules, view-transition timing, and `prefers-reduced-motion` override. Keep the Tailwind import lines if they're load-bearing for the existing scaffold pages (verify); otherwise remove.
**Acceptance:** `.board` width is `min(90vw, 420px)`, square via `aspect-ratio: 1`. Tile font-size scales with `--board-size` and `--size`. `::view-transition-group(*)` animation duration = 220ms. `prefers-reduced-motion: reduce` shrinks duration to 1ms.

### T103 — Tile component
**File:** `src/components/tile.tsx` (new)
**Change:** Per README §7. Wraps `<button>` in `unstable_ViewTransition as ViewTransition`, name=`tile-${number}`. Props: `number`, `row`, `col`, `onClick`. No layout in JS — `gridRow` / `gridColumn` only.
**Acceptance:** `import { unstable_ViewTransition as ViewTransition } from 'react'` resolves at runtime (proves React experimental is loaded). Component compiles with `aria-label="Tile N"`.

### T104 — Board component
**File:** `src/components/board.tsx` (new)
**Change:** Per README §8. Renders tiles by **number** (stable identity), not by index. Click handler wraps `tryMove` in `startTransition` so `<ViewTransition>` activates. Skips the empty slot in the render loop (`for n=1; n<size*size`).
**Acceptance:** Loop iterates `1..size²-1`; never renders a tile for `0`. Click on a non-adjacent tile is a no-op (no move, no animation). Click on adjacent tile triggers state update inside `startTransition`.

### T105 — Game component
**File:** `src/components/game.tsx` (new)
**Change:** Per README §9. Holds `board` + `moves` state. `useState(() => shuffle(size))` for lazy init. `handleMove` increments moves; `reshuffle` resets both. Renders stats / win banner / `<Board>` / shuffle button.
**Acceptance:** Initial render shows shuffled board (not solved). Solve state replaces stats with win banner. "Play again" button label appears when solved; "Shuffle" otherwise.

### T106 — Puzzle (Activity switcher)
**File:** `src/components/puzzle.tsx` (new)
**Change:** Per README §10. Tabs (`role="tab"`, `aria-selected`, `aria-controls`) for sizes 3/4/5. **All three `<Game>` instances are always rendered**, each wrapped in `<Activity mode={...}>`. Default active = 4.
**Acceptance:** Three `<Game>` instances mount on first paint (verify in React DevTools). Switching tabs flips `mode` between `'visible'` and `'hidden'` — no remount. In-progress board/move-count state survives a tab away + back.

### T107 — Wire home route
**File:** `src/routes/index.tsx` (replace body)
**Change:** Per README §11. Replace placeholder `<h1>Hello, sliding puzzle!</h1>` body with `.page` wrapper containing title, lede, and `<Puzzle />`.
**Acceptance:** `bun run dev` → `http://localhost:3000` renders the puzzle. No `Hello, sliding puzzle!` string anywhere.

### T108 — Mobile QA pass
**File:** _(none — verification task)_
**Change:** Run dev server, expose on LAN (`vite dev --host` or equivalent), open on a real iPhone, walk the §12 gotchas table:
1. Tap on tile — no zoom-in
2. iPhone SE width (DevTools) — board fits, no horizontal scroll
3. Address bar resize — layout doesn't jump
4. Tile feel on Android Chrome — animation isn't laggy
5. Notch device — content not hidden by home indicator
6. Tap targets — tabs and shuffle ≥ 44pt
7. Over-scroll — page doesn't rubber-band
**Acceptance:** All seven items pass on at least one real iOS device + DevTools emulation for Pixel 7. Any fails are filed as new tasks (or fixed inline if trivial).

### T109 — Vercel deploy ↷ stretch
**File:** _(none in repo — `vercel.json` only if needed)_
**Change:** Per README §13. `vercel deploy` (or `bun x vercel deploy --prod`). Verify framework auto-detects as Vite, build command works, output dir is correct. Confirm React experimental version installs in CI.
**Acceptance:** Public Vercel URL renders the puzzle, animations work, tab-switching preserves state — i.e. all sprint-level acceptance criteria pass against the deployed URL.

## Locked decisions

| Decision | Choice | Why |
|----------|--------|-----|
| CSS strategy | Pure CSS in `app.css` per README §6 | README is canonical; refactoring to Tailwind would diverge from the source of truth and add scope |
| Test coverage | No unit tests this sprint | No runner installed; pure logic is small; manual QA matrix covers behavior. Vitest setup deferred to a tooling sprint |
| Deploy | Stretch, not Committed | Sprint demo runs on `localhost`; public URL is icing, not the cake |
| Default difficulty tab | 4×4 | Matches README §10 (`useState<number>(4)`) and is the iconic 15-puzzle |
| Shuffle steps | 200 (default) | README default; visible scramble without crashing the animation |

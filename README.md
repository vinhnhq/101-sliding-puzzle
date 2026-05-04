# TanStack Start Sliding Puzzle — mobile-friendly ViewTransition + Activity demo

A weekend project: a deployable, mobile-friendly sliding-tile puzzle (8/15/24-puzzle) built on TanStack Start, using React's experimental `<ViewTransition>` for tile slides and stable `<Activity>` for preserving in-progress games across difficulty switches.

**About the game:** the 15-puzzle has a 4×4 grid with 15 numbered tiles and one empty cell. You slide adjacent tiles into the empty cell to arrange them in order 1→15. (It's not Sudoku — Sudoku is a static fill-in grid; this is a moving-tile rearrangement game.)

**Why this game for the demo:** every tile keeps a stable identity (its number) but changes grid position when you click it. That's the textbook shared-element transition. You write zero animation code — just re-render the new board state, and the browser animates every tile sliding to its new spot.

**API status (May 2026):**
- `<Activity>` — stable in React 19.2.
- `<ViewTransition>` — experimental. Needs `react@experimental` + `react-dom@experimental`. Imported as `unstable_ViewTransition`.

**No UI library.** The board is `<button>` elements in CSS Grid; difficulty tabs use semantic `role="tab"`. Radix/Base UI's Tabs would actively conflict with the Activity pattern (their `<Tabs.Content>` unmounts inactive tabs, which defeats Activity's whole point).

**Prereqs:** Node 20+, pnpm/npm, a Vercel account if you want to deploy.

---

## 1. Scaffold the project

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic puzzle
cd puzzle
pnpm install
pnpm dev
```

Open `http://localhost:3000` to confirm. Stop the server before continuing.

---

## 2. Install React experimental

```bash
pnpm add react@experimental react-dom@experimental --save-exact
```

If you're in a monorepo (Aletheia-style), add the override to your root `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom"
    }
  }
}
```

Verify:
```bash
cat node_modules/react/package.json | grep version
# Should show: "version": "0.0.0-experimental-..."
```

---

## 3. Vite config

`vite.config.ts` should already look like this (from the starter):

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    viteReact(), // must come AFTER tanstackStart
  ],
})
```

---

## 4. Mobile-friendly viewport meta

Open `src/routes/__root.tsx` and confirm the head includes a viewport meta with `viewport-fit=cover` (for iOS safe-area insets):

```ts
head: () => ({
  meta: [
    { charSet: 'utf-8' },
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, viewport-fit=cover',
    },
    { title: 'Sliding Puzzle' },
    { name: 'theme-color', content: '#0a0a0a' },
  ],
}),
```

The `theme-color` makes mobile browser chrome match your dark background — small detail, big polish.

---

## 5. Game logic (pure functions)

Create `src/lib/puzzle.ts`:

```ts
// Board is row-major. 0 represents the empty slot.
// 4x4 solved board: [1,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,0]
export type Board = number[]

export function createSolved(size: number): Board {
  const b: Board = []
  for (let i = 1; i < size * size; i++) b.push(i)
  b.push(0)
  return b
}

export function isSolved(board: Board): boolean {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false
  }
  return board[board.length - 1] === 0
}

export function indexToRowCol(idx: number, size: number) {
  return { row: Math.floor(idx / size), col: idx % size }
}

function neighborsOf(idx: number, size: number): number[] {
  const { row, col } = indexToRowCol(idx, size)
  const out: number[] = []
  if (row > 0) out.push(idx - size)
  if (row < size - 1) out.push(idx + size)
  if (col > 0) out.push(idx - 1)
  if (col < size - 1) out.push(idx + 1)
  return out
}

function swapped(board: Board, a: number, b: number): Board {
  const next = [...board]
  ;[next[a], next[b]] = [next[b], next[a]]
  return next
}

/** Try sliding the given tile into the empty slot. Returns null if illegal. */
export function tryMove(
  board: Board,
  tileNumber: number,
  size: number,
): Board | null {
  const tileIdx = board.indexOf(tileNumber)
  const emptyIdx = board.indexOf(0)
  if (!neighborsOf(emptyIdx, size).includes(tileIdx)) return null
  return swapped(board, tileIdx, emptyIdx)
}

/**
 * Shuffle by walking backwards from a solved state with random valid moves.
 * Guarantees solvability. The `lastEmpty` filter prevents immediate backtracks
 * (slide-left-then-right wastes a step).
 */
export function shuffle(size: number, steps = 200): Board {
  let board = createSolved(size)
  let lastEmpty = -1
  for (let i = 0; i < steps; i++) {
    const emptyIdx = board.indexOf(0)
    const choices = neighborsOf(emptyIdx, size).filter((n) => n !== lastEmpty)
    const pick = choices[Math.floor(Math.random() * choices.length)]
    board = swapped(board, emptyIdx, pick)
    lastEmpty = emptyIdx
  }
  return isSolved(board) ? shuffle(size, steps) : board
}
```

---

## 6. Mobile-responsive styles

Replace `src/styles.css` with this. The key idea: the board uses `width: min(90vw, 420px)` and `aspect-ratio: 1`, so tiles auto-size with `1fr` grid columns. No JS-side tile sizing needed — it just adapts to whatever screen.

```css
:root {
  --bg: #0a0a0a;
  --fg: #f5f5f5;
  --muted: #a3a3a3;
  --border: #262626;
  --accent: #3b82f6;

  /* Cap board size on desktop, fluid on mobile */
  --board-size: min(90vw, 420px);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  /* Prevent iOS rubber-band scroll past the page */
  overscroll-behavior-y: contain;
}

body {
  /* dvh handles iOS Safari address-bar resize without jumping */
  min-height: 100dvh;
  /* Respect iPhone home indicator */
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}

button {
  font-family: inherit;
  /* Eliminate the 300ms tap delay + double-tap zoom on tiles & buttons */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
  text-align: center;
}

.page h1 {
  font-size: clamp(24px, 6vw, 32px);
  margin: 0 0 8px;
}

.page .lede {
  color: var(--muted);
  font-size: clamp(14px, 3.5vw, 16px);
  margin: 0 0 24px;
}

/* Tabs ===================================================== */

.tabs {
  display: inline-flex;
  gap: 4px;
  background: #171717;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.tabs button {
  padding: 8px 14px;
  background: transparent;
  color: var(--muted);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  /* Bigger tap targets on mobile (iOS HIG: 44pt) */
  min-height: 40px;
  min-width: 56px;
}
.tabs button.active {
  background: var(--fg);
  color: var(--bg);
}

/* Stats / win banner ======================================== */

.stats {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 16px;
  font-variant-numeric: tabular-nums;
  color: var(--muted);
  font-size: 14px;
}
.stats strong { color: var(--fg); }

.win-banner {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 16px;
  font-size: 14px;
}

/* Board ===================================================== */

.board {
  display: grid;
  gap: 4px;
  background: #171717;
  padding: 6px;
  border-radius: 12px;
  margin: 0 auto 20px;
  width: var(--board-size);
  aspect-ratio: 1; /* keeps it square at any width */
  grid-template-columns: repeat(var(--size), 1fr);
  grid-template-rows: repeat(var(--size), 1fr);
}

.tile {
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 700;
  /* Font size scales with board size and tile count */
  font-size: clamp(16px, calc(var(--board-size) / var(--size) * 0.4), 36px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  transition: filter 100ms;
}
.tile:hover { filter: brightness(1.15); }
.tile:active { filter: brightness(0.9); }

.shuffle-btn {
  padding: 12px 24px;
  background: transparent;
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  min-height: 44px; /* iOS HIG min tap target */
}
.shuffle-btn:hover { border-color: #525252; }

/* View Transition timing
   ================================================
   220ms feels game-y. Bump to 350ms+ for showroom feel. */

::view-transition-group(*) {
  animation-duration: 220ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 1ms !important;
  }
}
```

Make sure `src/routes/__root.tsx` imports it: `import '../styles.css'`.

---

## 7. The Tile component

Create `src/components/Tile.tsx`. Each tile gets a unique `<ViewTransition name>` keyed to its number.

```tsx
import { unstable_ViewTransition as ViewTransition } from 'react'

type Props = {
  number: number
  row: number
  col: number
  onClick: () => void
}

export function Tile({ number, row, col, onClick }: Props) {
  return (
    <ViewTransition name={`tile-${number}`}>
      <button
        className="tile"
        style={{ gridRow: row + 1, gridColumn: col + 1 }}
        onClick={onClick}
        aria-label={`Tile ${number}`}
      >
        {number}
      </button>
    </ViewTransition>
  )
}
```

Note: no width/height/font-size in JS. CSS handles everything based on `--size` and `--board-size`.

---

## 8. The Board component

Create `src/components/Board.tsx`. **Key technique:** render tiles by *number*, not by board index — so each tile keeps a stable React `key` across re-renders. That's what lets ViewTransition pair the before/after snapshots.

```tsx
import { startTransition } from 'react'
import { Tile } from './Tile'
import {
  type Board as BoardType,
  indexToRowCol,
  tryMove,
} from '../lib/puzzle'

type Props = {
  size: number
  board: BoardType
  onMove: (next: BoardType) => void
}

export function Board({ size, board, onMove }: Props) {
  const handleClick = (n: number) => {
    const next = tryMove(board, n, size)
    if (!next) return
    // startTransition is what activates the ViewTransition.
    // Without it, the board updates instantly with no animation.
    startTransition(() => onMove(next))
  }

  // Build number → position map so we render by stable identity.
  const positions = new Map<number, { row: number; col: number }>()
  board.forEach((num, idx) => {
    if (num !== 0) positions.set(num, indexToRowCol(idx, size))
  })

  const tiles = []
  for (let n = 1; n < size * size; n++) {
    const pos = positions.get(n)!
    tiles.push(
      <Tile
        key={n}
        number={n}
        row={pos.row}
        col={pos.col}
        onClick={() => handleClick(n)}
      />,
    )
  }

  return (
    <div
      className="board"
      style={{ ['--size' as never]: size }}
    >
      {tiles}
    </div>
  )
}
```

---

## 9. A single game (board + stats + shuffle)

Create `src/components/Game.tsx`:

```tsx
import { useState } from 'react'
import { Board } from './Board'
import { type Board as BoardType, isSolved, shuffle } from '../lib/puzzle'

export function Game({ size }: { size: number }) {
  const [board, setBoard] = useState<BoardType>(() => shuffle(size))
  const [moves, setMoves] = useState(0)

  const solved = isSolved(board)

  const handleMove = (next: BoardType) => {
    setBoard(next)
    setMoves((m) => m + 1)
  }

  const reshuffle = () => {
    setBoard(shuffle(size))
    setMoves(0)
  }

  return (
    <div>
      {solved ? (
        <div className="win-banner">🎉 Solved in {moves} moves!</div>
      ) : (
        <div className="stats">
          <span>
            Moves: <strong>{moves}</strong>
          </span>
          <span>
            Size: <strong>{size}×{size}</strong>
          </span>
        </div>
      )}

      <Board size={size} board={board} onMove={handleMove} />

      <button className="shuffle-btn" onClick={reshuffle}>
        {solved ? 'Play again' : 'Shuffle'}
      </button>
    </div>
  )
}
```

---

## 10. Difficulty switcher with `<Activity>`

Create `src/components/Puzzle.tsx`:

```tsx
import { Activity, useState } from 'react'
import { Game } from './Game'

const SIZES = [3, 4, 5] as const

export function Puzzle() {
  const [active, setActive] = useState<number>(4)

  return (
    <div>
      <div className="tabs" role="tablist">
        {SIZES.map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={active === s}
            aria-controls={`game-${s}`}
            className={active === s ? 'active' : ''}
            onClick={() => setActive(s)}
          >
            {s}×{s}
          </button>
        ))}
      </div>

      {/*
        Each Game stays mounted but is hidden when its size isn't active.
        - Without Activity: switching tabs would unmount Game,
          losing your in-progress board and move count.
        - With Activity: state survives, effects unmount cleanly,
          updates inside hidden games are deferred.
      */}
      {SIZES.map((s) => (
        <Activity key={s} mode={active === s ? 'visible' : 'hidden'}>
          <div role="tabpanel" id={`game-${s}`}>
            <Game size={s} />
          </div>
        </Activity>
      ))}
    </div>
  )
}
```

---

## 11. Wire it into the home route

Replace `src/routes/index.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Puzzle } from '../components/Puzzle'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="page">
      <h1>Sliding Puzzle</h1>
      <p className="lede">
        Tap a tile next to the empty space to slide it. Get the numbers in order.
      </p>
      <Puzzle />
    </div>
  )
}
```

Run `pnpm dev` and verify on **both desktop and a real phone** (use your machine's LAN IP — e.g. `http://192.168.1.x:3000`). Things to check:

1. Tiles slide smoothly when clicked/tapped (ViewTransition working).
2. Switching between 3×3 / 4×4 / 5×5 preserves each board's state and move count (Activity working).
3. On mobile: no double-tap zoom, no 300ms tap delay, board scales to viewport.
4. On iPhone with notch: content not hidden under the home indicator (safe-area working).

---

## 12. Mobile polish: things that often go wrong

| Symptom | Fix |
|---|---|
| Tap on tile zooms the page in | `touch-action: manipulation` (already in CSS). Verify it's applied to the tile via DevTools. |
| Board overflows viewport on small phones | `width: var(--board-size)` is already responsive — but check there's no fixed-width parent. Open DevTools → toggle device toolbar → iPhone SE (375px) to test. |
| Address bar resize jumps the layout | Already using `100dvh` for body min-height. If still happening, check you're not using `100vh` anywhere else. |
| Tiles feel laggy on Android Chrome | Animation duration too long for small screens. Drop `--view-transition-group` to 180ms. |
| Pinch-zoom breaks the board layout | Set `user-scalable=no` in viewport meta — but only if accessibility isn't a concern. Better: leave zoom enabled and fix any layout that breaks. |
| Buttons too small to tap accurately | `min-height: 44px` is on tabs and shuffle button (iOS HIG). Tile size scales with board; on 5×5 / iPhone SE the tile is ~58px which is fine. |
| Page rubber-bands on iOS when over-scrolling | `overscroll-behavior-y: contain` on body (already set). |

---

## 13. Deploy to Vercel

```bash
git init
git add .
git commit -m "init: sliding puzzle"
gh repo create puzzle --public --source=. --push
```

On Vercel:
1. New Project → import the `puzzle` repo.
2. Framework auto-detects as Vite. Build command: `pnpm build`. Default output dir is fine.
3. Deploy.

CLI alternative:
```bash
pnpm dlx vercel deploy --prod
```

> **About `react@experimental` in production:** the `--save-exact` flag from step 2 + your committed lockfile pin the version. Vercel will install whatever's locked. If experimental builds get yanked from npm (rare but possible), CI will fail until you update. Acceptable for a hobby project; not acceptable for `human.`

---

## 14. Polish ideas (an hour each)

- **Best score per size in `localStorage`** — show "Best: 47" next to current count. Activity-preserved tabs make this satisfying because each size has its own record.
- **Adjacency hint** — slightly brighten tiles next to the empty slot so beginners know what's clickable. Just check `neighborsOf(emptyIdx)` and apply a class.
- **Direction-aware transitions** — `addTransitionType('slide-up' | ...)` based on which direction the tile moves, with custom CSS per direction.
- **Image puzzle mode** — replace numbers with slices of an uploaded image (CSS `background-position` per tile). The slide animation reassembling a picture is satisfying as hell.
- **Keyboard controls** — arrow keys move the empty slot. ViewTransition handles the animation either way.
- **Daily seed** — derive shuffle randomness from today's date. Same puzzle for everyone every day. Add streak tracking → Wordle-style daily ritual.
- **Add to Home Screen** — a quick `manifest.json` and you've got a tappable icon on the user's phone homescreen.

---

## 15. Common gotchas (game logic)

| Symptom | Cause / Fix |
|---|---|
| Tiles snap instead of slide | State update isn't inside a transition. Confirm `startTransition` wraps `setBoard` in `Board.tsx`. |
| `Two <ViewTransition name="tile-N"> mounted at the same time` | You're rendering a tile for the empty slot (number 0) or rendering by index instead of by number. Loop should be `for (n = 1; n < size*size; n++)`. |
| Animation looks chaotic on shuffle | All 24 tiles moved at once — browser snapshots can be hard to pair cleanly. Use fewer shuffle steps (`shuffle(size, 30)`) for visible motion, or accept instant reset. |
| Tab switch loses board state | `<Activity>` isn't wrapping `<Game>`, OR you're conditionally rendering `{active === s && <Game/>}` somewhere. With Activity, *always* render the Game; let `mode="hidden"` handle visibility. |
| `unstable_ViewTransition is undefined` | Not on `react@experimental`. Re-run step 2; verify `node_modules/react/package.json`. |

---

## 16. References

- React Labs: View Transitions, Activity, and more — `react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more`
- `<Activity>` reference — `react.dev/reference/react/Activity`
- `<ViewTransition>` reference — `react.dev/reference/react/ViewTransition`
- TanStack Start build-from-scratch — `tanstack.com/start/latest/docs/framework/react/build-from-scratch`
- Apple HIG tap target sizing — `developer.apple.com/design/human-interface-guidelines/buttons`
- View Transition pseudo-elements — `developer.mozilla.org/en-US/docs/Web/CSS/::view-transition`

Have fun. Test on a real phone, not just DevTools — touch latency and CSS quirks only show up on actual devices.

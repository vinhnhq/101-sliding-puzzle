# Retro: Sprint 01 — Core Puzzle Build

_Fill in at sprint close. Keep it brutally honest — the point is to learn, not to look good._

## Outcome

- **Started:** YYYY-MM-DD
- **Closed:** YYYY-MM-DD
- **Committed tasks done:** N / 8
- **Stretch tasks done:** N / 1
- **Acceptance criteria pass:** N / 11 (see `plan.md` checklist)
- **Build green at close?** yes / no
- **Deployed URL:** _(if T109 landed)_

## What shipped

_(One line per landed task. Reference commit shas where helpful.)_

- T101 — …
- T102 — …
- …

## What didn't ship and why

_(Demoted to Stretch, blocked, or descoped. Be specific about the cause.)_

- …

## What surprised me

_(Anything that took longer or shorter than expected, anything that broke in a non-obvious way, anything the README got wrong or omitted. These feed `__project__/docs/learnings.md`.)_

- **README §7 import name is stale.** `unstable_ViewTransition` no longer exists on `react@experimental` — it's plain `ViewTransition` now (same for `Activity`). Vite 8's SSR module-runner catches this loudly; the page silently fell back to client rendering with the error embedded in HTML. Logged to `learnings.md` 2026-05-04.
- **`@types/react` 19.0.x doesn't yet ship types for `ViewTransition` or `Activity`** even though both are in the runtime. Worked around with a 1-file module augmentation (`src/types/react-experimental.d.ts`).
- **Activity in `mode="hidden"` is deferred from SSR output.** Only the visible 4×4 tabpanel is in the streamed HTML; 3×3 and 5×5 mount on the client. This is correct React behavior but worth noting if anyone wonders why the SSR HTML is smaller than expected.

## Process retro

| Question | Answer |
|----------|--------|
| Was the spec (README) sufficient? | … |
| Did thin-slice commits work or feel like overhead? | … |
| Was the device matrix right, or did I test the wrong shapes? | … |
| Did `<Activity>` + `<ViewTransition>` behave as documented? | … |
| Anything that should become a CLAUDE.md rule? | … |

## Actions out

_(Concrete follow-ups, each with a destination — sprint folder, backlog file, ADR draft, or "drop".)_

- [ ] Action — destination
- [ ] Action — destination

## Knowledge ownership

_(Append rows to `__project__/docs/knowledge-ownership.md` for any task where the solution is non-obvious. Owner = `you` / `AI` / `collab`.)_

| Task | Solution | Owner | Notes |
|------|----------|-------|-------|
| | | | |

# Learnings — append on the fly

A continuous-improvement journal. Add entries the moment something surprises you (good or bad). Keep each entry tight — 1-3 sentences plus a **Promote?** verdict.

## Format

```
## YYYY-MM-DD · <short, specific title>

<1-3 sentences: what happened, what you learned. Concrete, not abstract.>

**Promote?** <yes / no / later> — <where it should go: ADR, dev-workflow.md, CLAUDE.md, code, or "drop">
```

## Promotion rules (review at start of every sprint)

| If an entry is | Action |
|----------------|--------|
| Marked **Promote? yes** + target exists | Apply it; mark entry **✓ promoted** with link |
| Marked **Promote? yes** but no target yet | Open ADR or doc draft; link from the entry |
| Marked **Promote? no** + >90 days old | Delete |
| Same lesson recurs 3+ times | Force promote — convention is missing |
| Marked **Promote? later** + no movement after 3 sprints | Delete by default |

The file is a buffer, not a destination. Without these rules it becomes a graveyard.

---

## Entries

## 2026-05-04 · React experimental dropped `unstable_` prefix on `ViewTransition`

README §7 imports `unstable_ViewTransition as ViewTransition` from `"react"`. The pinned `react@experimental 0.0.0-experimental-f4e0d4ed-20260429` actually exports it as plain `ViewTransition` (and `Activity` likewise). Vite 8's SSR module-runner caught this with a "Named export 'unstable_ViewTransition' not found" error and silently fell back to client rendering — easy to miss without inspecting `curl /` output.

**Promote?** yes — README needs a note that the API has moved past `unstable_`, since the README's §6/§7 still document the old name. Also worth a CLAUDE.md note that the `unstable_*` prefix in the README is stale relative to current React experimental exports.

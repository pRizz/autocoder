---
phase: 07-ts-bun-solid-parity-matrix-and-discrepancies
plan: 03
subsystem: planning
tags: [parity, discrepancy-ledger, migration-controls, phase-7]
requires:
  - phase: 07
    plan: 01
    provides: canonical ART-level parity matrix
provides:
  - Intended-vs-observed discrepancy ledger (`Q01`..`Q16`)
  - Parity/surface linkage and external-impact annotations
  - MIGR-03 and MIGR-04 acceptance checks
affects: [phase-07-04, phase-08-01]
tech-stack:
  added: [markdown]
  patterns: [discrepancy-first-migration-governance, explicit-disposition-tracking]
key-files:
  created:
    - .planning/specs/parity/INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md
key-decisions:
  - "Model discrepancy handling as deterministic units with explicit disposition states."
  - "Require per-entry parity/surface links and explicit external-surface impact notation."
patterns-established:
  - "Discrepancy entries are reconciled to parity rows before risk assignment."
  - "Acceptance gates enforce complete discrepancy coverage and linkage quality."
requirements-completed: ["MIGR-03", "MIGR-04"]
duration: 24 min
completed: 2026-02-28
---

# Phase 7 Plan 03 Summary

**Discrepancy governance is complete with a deterministic 16-unit ledger, parity/surface traceability, and objective MIGR-03/MIGR-04 gates.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-02-28T12:57:00Z
- **Completed:** 2026-02-28T13:21:00Z
- **Tasks:** 3 (+1 blocker fix)
- **Files modified:** 1

## Accomplishments

- Created `INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md` with 16 deterministic discrepancy units (`Q01`..`Q16`) and migration disposition values.
- Added parity/surface linkage coverage with explicit external-surface `1:1` impact notes per discrepancy.
- Added MIGR-03 and MIGR-04 acceptance checks for discrepancy count, disposition completeness, and linkage quality.
- Applied a blocker fix to normalize traceability row IDs (`LQ##`) so verification count checks remain deterministic at `16` discrepancy units.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build discrepancy inventory with deterministic IDs** - `ef418ac` (chore)
2. **Task 2: Link discrepancy entries to parity and surface anchors** - `cf4ba6d` (chore)
3. **Task 3: Add MIGR-03/MIGR-04 acceptance checks** - `a540bde` (chore)
4. **Auto-fix blocker: normalize traceability row IDs for deterministic verification** - `5c1fe41` (fix)

**Plan metadata:** pending

## Files Created/Modified

- `.planning/specs/parity/INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md` - discrepancy inventory, linkage model, and acceptance gates.

## Decisions Made

- Kept discrepancy inventory (`Q##`) distinct from linkage helper rows (`LQ##`) to preserve objective verification semantics.
- Enforced explicit external-impact notation for every discrepancy to avoid implicit behavior drift.

## Deviations from Plan

- Added one blocker correction commit to keep discrepancy count checks deterministic (`Q##` count equals 16).

## Issues Encountered

- Initial linkage-table row IDs collided with discrepancy count regex.
- Resolved by introducing `LQ##` linkage IDs while preserving one-to-one reference with `Q##` discrepancies.

## User Setup Required

None.

## Next Phase Readiness

- Plan `07-04` can now attach risk controls and final acceptance/index handoff wiring using discrepancy outputs.

---
*Phase: 07-ts-bun-solid-parity-matrix-and-discrepancies*
*Completed: 2026-02-28*

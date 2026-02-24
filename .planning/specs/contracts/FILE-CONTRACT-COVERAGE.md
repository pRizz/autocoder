# File Contract Coverage Ledger

**Status:** Active  
**Phase:** 04 (Full File-Level Contract Capture)  
**Generated:** 2026-02-24

## Canonical Reconciliation

- canonical_inventory_total: 237
- covered_ids: 237
- missing_ids: 0
- duplicate_ids: 0
- extra_ids_not_in_inventory: 0
- Coverage Ratio: 237/237
- Status: passed

## Lane Evidence

| Lane | Matrix Artifact | Matrix ID Rows | Contract Files | Status |
| --- | --- | ---: | ---: | --- |
| backend_runtime | `.planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md` | 56 | 56 | Pass |
| frontend_ui | `.planning/specs/contracts/FRONTEND-UI-MATRIX.md` | 93 | 93 | Pass |
| non_ts | `.planning/specs/contracts/NON-TS-MATRIX.md` | 88 | 88 | Pass |

## Category Coverage

| Category | Inventory IDs | Covered IDs | Status |
| --- | ---: | ---: | --- |
| BACKEND_SOURCE | 50 | 50 | Pass |
| CI_AUTOMATION | 1 | 1 | Pass |
| CONFIG_OR_MISC | 8 | 8 | Pass |
| DOCUMENTATION | 8 | 8 | Pass |
| FRONTEND_CONFIG | 8 | 8 | Pass |
| FRONTEND_SOURCE | 83 | 83 | Pass |
| OPERATIONS_SCRIPT | 7 | 7 | Pass |
| OPS_AUTOMATION | 26 | 26 | Pass |
| PLANNING_DOC | 38 | 38 | Pass |
| TEST | 8 | 8 | Pass |

## Gaps

missing_ids: 0

duplicate_ids: 0

extra_ids_not_in_inventory: 0

## Notes

- Canonical baseline for this phase is the current `.planning/specs/INVENTORY.md` ID set (237 IDs).
- Lane matrices are the canonical evidence sources for contract membership:
  - `.planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md`
  - `.planning/specs/contracts/FRONTEND-UI-MATRIX.md`
  - `.planning/specs/contracts/NON-TS-MATRIX.md`
- Reconciliation result is pass only when full coverage is 237/237 with zero missing and zero duplicate mappings.

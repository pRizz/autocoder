# Coverage Audit Report

**Status:** Active  
**Phase:** 02 (Coverage Validation & Classification)  
**Generated:** 2026-02-24

## Inputs

- Discovery rules: `.planning/specs/INVENTORY-RULES.md`
- Exclusion rationale: `.planning/specs/EXCLUSIONS.md`
- Inventory target: `.planning/specs/INVENTORY.md`

## Pre-Remediation Findings

- Discovery count: **237**
- Inventory count: **235**
- missing_from_inventory: **2**
- extra_in_inventory: **0**

Status: `needs_remediation` (pre-remediation delta detected)

### missing_from_inventory

| Path | Classification |
| --- | --- |
| `.planning/phases/02-coverage-validation-and-classification/02-02-SUMMARY.md` | PLANNING_DOC |
| `.planning/specs/COVERAGE-AUDIT.md` | PLANNING_DOC |

### extra_in_inventory

None

## Remediation

- Regenerated `INVENTORY.md` from deterministic discovery output in sorted order.
- Recomputed category totals and ART-#### rows from current in-scope set.
- Re-ran coverage diff check after inventory refresh.

## Post-Remediation Validation

- Discovery count: **237**
- Inventory count: **237**
- missing_from_inventory: **0**
- extra_in_inventory: **0**

Status: `passed`

## Reproducibility

1. Run the discovery command from `INVENTORY-RULES.md`.
2. Parse all `| ART-#### |` rows from `INVENTORY.md`.
3. Compute set diffs: `missing_from_inventory` and `extra_in_inventory`.
4. If gaps exist, regenerate inventory from sorted discovery output and rerun checks.
5. Confirm docs-only guardrails before completion.

## Exclusion Snapshot

| Exclusion class | Current count |
| --- | ---: |
| `venv/**` | 6186 |
| `*/__pycache__/** + *.pyc` | 4622 |
| `ui/node_modules/**` | 12060 |
| `ui/dist/**` | 4 |
| `*.log` | 1 |
| `lock files` | 2 |
| `*.tsbuildinfo` | 1 |

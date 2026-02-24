# Coverage Baseline (Phase 2)

**Status:** Active  
**Phase:** 02 (Coverage Validation & Classification)  
**Generated:** 2026-02-24

## Total in-scope

- Total in-scope artifacts: **237**
- Canonical source: `.planning/specs/INVENTORY.md`
- Audit reference: `.planning/specs/COVERAGE-AUDIT.md`

## By category

| Category | Count |
| --- | ---: |
| BACKEND_SOURCE | 50 |
| CI_AUTOMATION | 1 |
| CONFIG_OR_MISC | 8 |
| DOCUMENTATION | 8 |
| FRONTEND_CONFIG | 8 |
| FRONTEND_SOURCE | 83 |
| OPERATIONS_SCRIPT | 7 |
| OPS_AUTOMATION | 26 |
| PLANNING_DOC | 38 |
| TEST | 8 |

## Excluded

Excluded classes are intentionally omitted from inventory because they are generated/runtime artifacts rather than authored source-of-truth:

| Exclusion Class | Count (current workspace) | Rationale |
| --- | ---: | --- |
| `venv/**` | 6,186 files | Environment-local dependency/install output |
| `*/__pycache__/**` + `*.pyc` | 4,622 files | Interpreter-generated cache/bytecode |
| `ui/node_modules/**` | 12,060 files | Installed third-party dependency tree |
| `ui/dist/**` | 4 files | Build output artifact |
| `*.log` | 1 files | Runtime/debug emission |
| lock files (`package-lock.json`, etc.) | 2 files | Generated lock state; excluded by policy |
| `*.tsbuildinfo` | 1 files | TypeScript incremental build cache |

## Required evidence

- Coverage completeness claims must cite `.planning/specs/COVERAGE-AUDIT.md`.
- Exclusion rationale claims must cite `.planning/specs/EXCLUSIONS.md`.

## Reproducibility

1. Run discovery + exclusion filters from `INVENTORY-RULES.md`.
2. Recompute inventory and category totals.
3. Re-run coverage diff checks and compare to `COVERAGE-AUDIT.md`.
4. Confirm docs-only guardrail commands pass before completion.

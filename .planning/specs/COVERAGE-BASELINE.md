# Coverage Baseline (Phase 1)

**Status:** Active  
**Phase:** 01 (Scope Policy, Inventory, and Guardrails)  
**Generated:** 2026-02-24

## Total in-scope

- Total in-scope artifacts: **224**
- Canonical source: `.planning/specs/INVENTORY.md`

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
| PLANNING_DOC | 25 |
| TEST | 8 |

## Excluded

Excluded classes are intentionally omitted from inventory because they are generated/runtime artifacts rather than authored source-of-truth:

| Exclusion Class | Count (current workspace) | Rationale |
| --- | ---: | --- |
| `venv/**` | 6,186 files | Environment-local dependency/install output |
| `*/__pycache__/**` + `*.pyc` | 2,311 files | Interpreter-generated cache/bytecode |
| `ui/node_modules/**` | 12,060 files | Installed third-party dependency tree |
| `ui/dist/**` | 4 files | Build output artifact |
| `*.log` | 1 file | Runtime/debug emission |
| lock files (`package-lock.json`, etc.) | 2 files | Generated lock state; excluded by policy |
| `*.tsbuildinfo` | 1 file | TypeScript incremental build cache |

## Reproducibility

Baseline regeneration procedure:

1. Run the discovery command documented in `.planning/specs/INVENTORY-RULES.md`.
2. Confirm exclusion filters and category mapping rules are unchanged.
3. Regenerate `.planning/specs/INVENTORY.md` with sequential `ART-####` IDs.
4. Verify this baseline's `Total in-scope` and `By category` sections match regenerated outputs.
5. Run docs-only guardrail commands from `.planning/specs/GUARDRAILS.md`.

If totals differ, classify the delta as one of:
- legitimate repository change (add/remove/rename), or
- rule drift/regression requiring policy/rules updates.

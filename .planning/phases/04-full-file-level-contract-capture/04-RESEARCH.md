# Phase 4: Full File-Level Contract Capture - Research

**Researched:** 2026-02-24
**Domain:** Exhaustive file-level contract authoring at full repository scale
**Confidence:** HIGH

<user_constraints>
## User Constraints (from active project context)

- Do not modify implementation source files; outputs are markdown/spec artifacts only.
- Maintain regeneration-first fidelity: contracts must be executable by downstream rebuild agents.
- Preserve canonical inventory ID usage (`ART-####`) for traceability.
- Capture non-TypeScript artifacts (docs/workflows/scripts/config) with equivalent rigor.
</user_constraints>

<research_summary>
## Summary

Phase 4 is a scale-up phase: apply the finalized Phase 3 schema/conventions to the full canonical inventory and produce objective completeness evidence. The work should be split into parallelizable contract-authoring lanes by subsystem, then closed with a deterministic completeness + quality audit.

Current canonical inventory baseline is 237 artifacts, partitioned as:
- Backend/runtime + root backend tests: 56 targets (`BACKEND_SOURCE` + root `test_*.py`)
- Frontend/UI + UI tests: 93 targets (`FRONTEND_SOURCE`, `FRONTEND_CONFIG`, `ui/e2e/*`)
- Non-TypeScript + operations/planning/docs: 88 targets (`DOCUMENTATION`, `CI_AUTOMATION`, `OPERATIONS_SCRIPT`, `OPS_AUTOMATION`, `CONFIG_OR_MISC`, `PLANNING_DOC`)

**Primary recommendation:** Execute in three contract lanes (backend, frontend, non-TS/ops/docs) with dedicated matrices, then run a final global audit plan that proves 1:1 inventory coverage and section-level quality gates.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Tool | Purpose | Why |
|------|---------|-----|
| Markdown contract files | Canonical per-artifact specs | Human + agent readable, diff-friendly |
| `FILE-SPEC-SCHEMA.md` | Required section contract | Ensures consistency and executability |
| `FILE-SPEC-AUTHORING.md` | Naming/linkage/quality gate rules | Prevents drift during high-volume authoring |
| `rg`, `find`, shell checks | Deterministic verification | Fast, repeatable structure/completeness checks |

### Supporting
| Artifact | Purpose |
|----------|---------|
| Per-lane matrices | Proof of lane-level completeness and ownership |
| Global coverage ledger | Cross-lane 237/237 ID reconciliation |
| Quality audit report | Section-level pass/fail and remediation trace |

No new dependencies are required for Phase 4.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Lane-based contract sharding
Author contracts in separate directories by subsystem lane to reduce merge conflicts and support parallel execution:

```text
.planning/specs/contracts/
  backend-runtime/
  frontend-ui/
  non-ts/
```

### Pattern 2: Matrix-first traceability
Each lane publishes a matrix file mapping:
- `ART ID`
- `Inventory path`
- `Contract path`
- `Status`

This enables objective completeness checks before phase-final audit.

### Pattern 3: Global reconciliation gate
Final plan must join canonical inventory IDs against all lane matrices/contracts and explicitly report:
- covered IDs
- missing IDs
- duplicate IDs
- section quality failures
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Coverage confidence | Spot-checking random files | Full inventory-to-contract reconciliation |
| Section completeness | Informal prose review | Required heading checks for every contract file |
| Non-TS parity | Code-only detail standards | Same schema rigor across docs/workflows/scripts/config |

Key insight: scale requires deterministic audits, not narrative claims.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Inconsistent contract depth
Code contracts are detailed, but docs/workflow/script contracts become shallow.

**Avoid by:** requiring full schema sections (including side effects + error/edge behavior + acceptance checks) for all categories.

### Pitfall 2: ID/path drift during high-volume authoring
Large batches can mismatch contract file names, IDs, and inventory rows.

**Avoid by:** lane matrices as the canonical reconciliation layer and final global coverage audit.

### Pitfall 3: Completeness claim without executable evidence
Saying "all files covered" without machine-checkable pass/fail output.

**Avoid by:** explicit totals and zero-gap assertions in `FILE-CONTRACT-COVERAGE.md`.
</common_pitfalls>

<code_examples>
## Code Examples

### Required section presence check
```bash
rg -L '^## Purpose|^## Ownership|^## Inputs|^## Outputs|^## Side Effects|^## Direct Dependencies|^## Error and Edge Behavior|^## Acceptance Checks' .planning/specs/contracts/**/ART-*.md
```

### Lane count check
```bash
find .planning/specs/contracts/backend-runtime -maxdepth 1 -type f -name 'ART-*.md' | wc -l
```

### Docs-only guardrail check
```bash
git diff --name-only | rg -v '^\.planning/'
```
</code_examples>

<open_questions>
## Open Questions

1. Inventory drift handling: canonical inventory currently lags discovery by planning/spec additions. Phase 4 should treat `INVENTORY.md` as canonical for completion and explicitly report residual drift in final audit notes.
2. Contract granularity: one-file-per-artifact is heavier but aligns with naming conventions and traceability requirements; recommended for this phase.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/ROADMAP.md` (Phase 4 goal, requirements, success criteria)
- `.planning/REQUIREMENTS.md` (`FILE-03`, `FILE-04`, `FILE-05`)
- `.planning/specs/INVENTORY.md` (canonical artifact target set)
- `.planning/specs/FILE-SPEC-SCHEMA.md`
- `.planning/specs/FILE-SPEC-AUTHORING.md`
- `.planning/specs/FILE-SPEC-REVIEW.md`

### Secondary (MEDIUM confidence)
- `.planning/codebase/*.md` mapping docs for subsystem boundaries and routing

### Local validation snapshot
- Discovery count: 255
- Canonical inventory count: 237
- Immediate planning baseline for Phase 4 execution: canonical 237 IDs
</sources>

<metadata>
## Metadata

**Research scope:**
- Full-corpus contract capture execution shape
- Lane partitioning and wave strategy
- Deterministic completeness and quality verification

**Confidence breakdown:**
- Planning strategy: HIGH
- Verification approach: HIGH
- Drift risk handling: MEDIUM (requires explicit reporting discipline in execution)

**Research date:** 2026-02-24
**Valid until:** 2026-03-25
</metadata>

---

*Phase: 04-full-file-level-contract-capture*
*Research completed: 2026-02-24*
*Ready for planning: yes*

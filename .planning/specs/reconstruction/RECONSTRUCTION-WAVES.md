# Reconstruction Waves

**Status:** Active  
**Phase:** 08 (Reconstruction Checklist & Acceptance Gates)  
**Canonical completeness source for VERI-01**

## Wave Matrix

| Wave ID | Objective | Required Prerequisites | Produced Artifacts / Outcomes | blocker Criteria |
| --- | --- | --- | --- | --- |
| W01 | Establish empty-repo bootstrap and governance guardrails. | Scope policy + docs-only guardrails + inventory rules. | Deterministic initialization checklist and policy constraints. | blocker if scope or guardrail policy is undefined or contradictory. |
| W02 | Restore canonical inventory and coverage baseline. | W01 complete; inventory contracts available. | Full in-scope artifact baseline with stable IDs and exclusion rationale. | blocker if inventory coverage evidence is incomplete. |
| W03 | Rebuild file-contract scaffolding across backend/frontend/non-TS lanes. | W02 complete; file-spec schema + authoring conventions. | File-contract lane structure and canonical 237/237 reconciliation target context. | blocker if lane ownership or contract schema usage is ambiguous. |
| W04 | Reconstruct persistence, lifecycle, and security behavior foundations. | W03 complete; surface/data/process/security contract corpus. | Deterministic data + lifecycle + policy implementation sequence. | blocker if any SURF lane parity check is unresolved. |
| W05 | Reconstruct transport surface behavior (REST + WebSocket). | W04 complete; REST/WebSocket contract corpus + traceability. | API and realtime behavior build order with dependency-safe sequencing. | blocker if transport matrix-to-contract parity is unresolved. |
| W06 | Rebuild TS/Bun backend runtime with parity constraints. | W05 complete; parity matrix + implementation notes. | Bun/TypeScript runtime assembly order aligned to parity clusters. | blocker if MIGR mapping coverage is incomplete. |
| W07 | Rebuild SolidJS frontend parity flows. | W06 complete; frontend parity cluster direction + surface anchors. | Solid UI implementation wave order preserving user-visible workflows 1:1. | blocker if frontend protocol/flow parity anchors are missing. |
| W08 | Rebuild ops scripts, automation, and config precedence. | W06/W07 complete; non-TS parity mapping + risk register. | Operational parity sequence for scripts, CI, and config behaviors. | blocker if ops/config risk controls are unresolved. |
| W09 | Execute integrated acceptance verification sweep. | W01..W08 complete; surface + parity acceptance matrices. | Requirement-level verification execution order with evidence capture points. | blocker if any required acceptance gate fails. |
| W10 | Finalize readiness decision and regeneration handoff. | W09 complete; requirement traceability + scenario outcomes + ready gate rubric. | Objective go/no-go decision and handoff checklist. | blocker if final readiness criteria or blocker checks are unmet. |

## Dependency Rules

- Canonical prerequisite corpus is mandatory:
  - `.planning/specs/INDEX.md`
  - `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md`
  - `.planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md`
  - `.planning/specs/parity/PARITY-ACCEPTANCE-CHECKS.md`
  - `.planning/specs/parity/TS-BUN-SOLID-PARITY-MATRIX.md`
  - `.planning/specs/parity/INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md`
  - `.planning/specs/parity/PARITY-RISK-REGISTER.md`
- Wave progression rule: a wave is executable only when all listed prerequisites from prior waves are satisfied.
- Evidence rule: each wave must produce explicit outputs that can be tied to requirement-level acceptance evidence.
- Stop rule: any unresolved `blocker` condition halts progression to subsequent waves.
- Escalation rule: unresolved blockers require explicit remediation documentation before continuing.

## Acceptance Checks

**Requirement:** `VERI-01`

| Check ID | Requirement | Assertion | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| VERI-01-AC-01 | VERI-01 | Reconstruction wave count is exactly `10`. | Count `W##` rows in the wave matrix. | pass when row count is `10/10`; fail otherwise. |
| VERI-01-AC-02 | VERI-01 | Wave dependencies are explicit and complete. | Verify each wave row contains non-empty prerequisite definitions and objective outputs. | pass when every wave defines prerequisites + outputs; fail on missing dependency metadata. |
| VERI-01-AC-03 | VERI-01 | blocker criteria exist for every wave. | Verify each wave row includes explicit blocker criteria text. | pass when all `W01`..`W10` rows include blocker conditions; fail otherwise. |
| VERI-01-AC-04 | VERI-01 | Canonical prerequisite corpus is referenced for reconstruction control. | Verify dependency rules include INDEX + file/surface/parity acceptance anchors. | pass when all required canonical anchors are listed; fail otherwise. |

## References

- `.planning/specs/INDEX.md`
- `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md`
- `.planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md`
- `.planning/specs/parity/PARITY-ACCEPTANCE-CHECKS.md`

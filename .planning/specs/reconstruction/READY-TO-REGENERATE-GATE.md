# Ready-to-Regenerate Gate

**Status:** Active  
**Phase:** 08 (Reconstruction Checklist & Acceptance Gates)  
**Primary requirement:** `VERI-04`  
**Decision type:** Final go/no-go control for ready to regenerate

## Gate Objective

Define an objective pass/fail rubric that composes requirement traceability, scenario outcomes, discrepancy/risk posture, and docs-only guardrail compliance into one ready to regenerate decision.

## Go/No-Go Decision Matrix

| Gate Dimension | Required Evidence | pass/fail Threshold | blocker Condition |
| --- | --- | --- | --- |
| Requirement traceability completeness | `REQUIREMENT-ACCEPTANCE-TRACEABILITY.md` | pass when requirement coverage is `24/24` with no duplicate IDs and no empty evidence anchors. | blocker if any v1 requirement is missing, duplicated, or lacks evidence anchors. |
| Scenario parity completeness | `PARITY-E2E-SCENARIOS.md` + scenario execution evidence | pass when scenario coverage and execution are `12/12`. | blocker if any required scenario is missing or any critical scenario fails. |
| Discrepancy governance status | `INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md` | pass when all discrepancies have explicit disposition and no unresolved high-impact external-surface ambiguity. | blocker if any discrepancy is unresolved, contradictory, or ungoverned. |
| Risk mitigation status | `PARITY-RISK-REGISTER.md` + linked acceptance checks | pass when all critical and high risks have active mitigations and verification signals. | blocker if any critical mitigation is absent or failing. |
| Guardrail compliance | `GUARDRAILS.md` + clean docs-only git diff check | pass when all changes remain within `.planning/` and no source implementation files are modified. | blocker if docs-only execution guardrail is violated. |

## Blocker Rules

- Any single blocker condition produces an automatic no-go outcome.
- blocker resolution must be documented with explicit evidence updates before re-evaluating this gate.
- If discrepancy or risk blockers remain, the phase cannot declare ready to regenerate.
- If guardrail blockers occur, remediation must restore docs-only compliance before proceeding.

## Pass/Fail Decision Language

- **pass**: all gate dimensions satisfy their pass/fail thresholds and no blocker conditions are active; project state is ready to regenerate.
- **fail**: one or more gate dimensions fail threshold checks or any blocker condition is active; project state is not ready to regenerate.

## Acceptance Checks

| Check ID | Requirement | Assertion | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| VERI-03-AC-01 | VERI-03 | End-to-end scenario inventory is complete. | Count `E##` rows in `PARITY-E2E-SCENARIOS.md`. | pass when scenario count is `12/12`; fail otherwise. |
| VERI-03-AC-02 | VERI-03 | Scenario coverage spans core workflows and operational paths. | Validate scenario categories across API, WebSocket, data, process, security, ops, discrepancy, risk, and integrated readiness review. | pass when all required parity coverage classes are represented; fail otherwise. |
| VERI-03-AC-03 | VERI-03 | Scenario outcomes are evidence-anchored to canonical acceptance corpora. | Verify each scenario row references canonical evidence artifacts. | pass when all scenario rows contain non-empty evidence anchors; fail otherwise. |
| VERI-04-AC-01 | VERI-04 | Final go/no-go gate includes objective pass/fail thresholds. | Verify gate matrix includes explicit threshold language for each dimension. | pass when every gate dimension defines measurable pass/fail criteria; fail otherwise. |
| VERI-04-AC-02 | VERI-04 | blocker logic is explicit and decisive. | Verify blocker conditions and automatic no-go semantics are present. | pass when blockers are clearly defined and enforceable; fail otherwise. |
| VERI-04-AC-03 | VERI-04 | Ready decision composes requirement traceability and scenario outcomes. | Verify gate matrix links requirement traceability and scenario evidence into final decision criteria. | pass when both dimensions are mandatory and thresholded; fail otherwise. |
| VERI-04-AC-04 | VERI-04 | Guardrail and governance controls are part of final readiness decision. | Verify discrepancy, risk, and guardrail controls are included as go/no-go dimensions. | pass when all governance controls are represented with blocker semantics; fail otherwise. |

## References

- `.planning/specs/reconstruction/RECONSTRUCTION-WAVES.md`
- `.planning/specs/reconstruction/REQUIREMENT-ACCEPTANCE-TRACEABILITY.md`
- `.planning/specs/reconstruction/PARITY-E2E-SCENARIOS.md`
- `.planning/specs/parity/INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md`
- `.planning/specs/parity/PARITY-RISK-REGISTER.md`
- `.planning/specs/GUARDRAILS.md`

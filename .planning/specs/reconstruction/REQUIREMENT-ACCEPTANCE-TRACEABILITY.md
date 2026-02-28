# Requirement Acceptance Traceability

**Status:** Active  
**Phase:** 08 (Reconstruction Checklist & Acceptance Gates)  
**Canonical completeness source for VERI-02**

## Requirement-to-Acceptance Matrix

| Requirement ID | Requirement Statement | Canonical Acceptance Artifact / Check IDs | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| INVT-01 | Complete in-scope inventory exists. | `INVENTORY.md`, `FILE-CONTRACT-COVERAGE.md` | Compare inventory IDs vs coverage ledger totals. | pass when inventory and coverage reconcile with zero missing IDs. |
| INVT-02 | Inclusion/exclusion rules are explicit. | `POLICY.md`, `INVENTORY-RULES.md` | Verify in-scope/out-of-scope classes are explicitly listed. | pass when scope rules are explicit and non-contradictory. |
| INVT-03 | Exclusion rationale is documented. | `EXCLUSIONS.md`, `COVERAGE-AUDIT.md` | Verify excluded classes include rationale and examples. | pass when all exclusion classes include rationale evidence. |
| INVT-04 | Coverage checks prove full representation. | `COVERAGE-AUDIT.md`, `FILE-CONTRACT-COVERAGE.md` | Validate coverage totals and gap metrics. | pass when coverage shows zero unclassified/unmapped in-scope artifacts. |
| GARD-01 | Docs-only execution guardrail is enforced. | `GUARDRAILS.md` canonical checks | Run guardrail command triplet and inspect output. | pass when no non-`.planning/` changes are present. |
| FILE-01 | File specs capture purpose/ownership. | Phase 4 contract corpus | Sample contract sections for purpose and responsibility. | pass when purpose/ownership sections are present in all lane contracts. |
| FILE-02 | File specs capture I/O/side effects/dependencies. | Phase 4 contract corpus | Validate required schema sections in contracts. | pass when all contracts include I/O/side-effect/dependency data. |
| FILE-03 | File specs capture invariants/errors/edges. | `FILE-CONTRACT-QUALITY-AUDIT.md` | Validate required quality sections and audit outcomes. | pass when quality audit reports required sections present. |
| FILE-04 | Non-TS artifacts have equivalent contract detail. | `NON-TS-MATRIX.md`, `contracts/non-ts/` | Compare non-TS matrix entries to contract corpus. | pass when non-TS lane coverage and detail are complete. |
| FILE-05 | File specs include acceptance checks. | Phase 4 contracts + quality audit | Verify acceptance-check sections across lane contracts. | pass when acceptance checks are present for all contract files. |
| SURF-01 | REST/API contracts fully specified. | `SURFACE-ACCEPTANCE-CHECKS.md` (`SURF-01-*`) | Execute/inspect SURF-01 checks and route parity evidence. | pass when all SURF-01 checks pass. |
| SURF-02 | WebSocket contracts fully specified. | `SURFACE-ACCEPTANCE-CHECKS.md` (`SURF-02-*`) | Execute/inspect websocket parity and failure/ordering checks. | pass when all SURF-02 checks pass. |
| SURF-03 | Data/persistence contracts fully specified. | `SURFACE-ACCEPTANCE-CHECKS.md` (`SURF-03-*`) | Verify data matrix parity and lifecycle/migration checks. | pass when all SURF-03 checks pass. |
| SURF-04 | Process/lifecycle contracts fully specified. | `SURFACE-ACCEPTANCE-CHECKS.md` (`SURF-04-*`) | Verify lifecycle state/recovery/cleanup checks. | pass when all SURF-04 checks pass. |
| SURF-05 | Security/policy contracts fully specified. | `SURFACE-ACCEPTANCE-CHECKS.md` (`SURF-05-*`) | Verify policy/trust-boundary and test-anchor checks. | pass when all SURF-05 checks pass. |
| MIGR-01 | 1:1 parity matrix exists for all units. | `PARITY-ACCEPTANCE-CHECKS.md` (`MIGR-01-*`) | Verify parity row count and uniqueness checks. | pass when parity coverage is `237/237` with zero duplicates. |
| MIGR-02 | TS/Bun/Solid mapping notes exist for all areas. | `PARITY-ACCEPTANCE-CHECKS.md` (`MIGR-02-*`) | Verify cluster coverage and target-direction checks. | pass when all cluster direction checks pass. |
| MIGR-03 | Intended-vs-observed discrepancies are documented. | `PARITY-ACCEPTANCE-CHECKS.md` (`MIGR-03-*`) | Verify discrepancy count and disposition checks. | pass when discrepancy coverage is `16/16` with dispositions. |
| MIGR-04 | External surface preservation is explicit. | `PARITY-ACCEPTANCE-CHECKS.md` (`MIGR-04-*`) | Verify explicit 1:1 impact/preservation evidence. | pass when all MIGR-04 checks pass. |
| MIGR-05 | Migration risks/mitigations are attached. | `PARITY-ACCEPTANCE-CHECKS.md` (`MIGR-05-*`) | Verify risk register count and linkage checks. | pass when risk coverage is `12/12` with linkage evidence. |
| VERI-01 | Reconstruction waves are dependency-ordered. | `RECONSTRUCTION-WAVES.md` (`VERI-01-*`) | Verify wave count, dependencies, and blocker criteria. | pass when wave checklist satisfies VERI-01 gates. |
| VERI-02 | Acceptance checklist maps to every v1 requirement. | this matrix (`VERI-02-*`) | Verify 24-row requirement coverage and uniqueness. | pass when traceability coverage is `24/24`. |
| VERI-03 | E2E parity scenarios cover major workflows/ops. | `PARITY-E2E-SCENARIOS.md` + `READY-TO-REGENERATE-GATE.md` (`VERI-03-*`) | Verify scenario inventory and workflow/ops coverage evidence. | pass when scenario suite coverage criteria are met. |
| VERI-04 | Ready-to-regenerate gate is explicit/objective. | `READY-TO-REGENERATE-GATE.md` (`VERI-04-*`) | Verify go/no-go rubric and blocker criteria. | pass when readiness gate criteria are fully satisfied. |

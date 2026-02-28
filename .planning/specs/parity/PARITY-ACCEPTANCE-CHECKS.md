# Parity Acceptance Checks

**Status:** Active  
**Phase:** 07 (TS/Bun/Solid Parity Matrix & Discrepancies)  
**Purpose:** Requirement-linked pass/fail checks for Phase 7 parity closure (`MIGR-01`..`MIGR-05`).

## Scope Anchors

| Requirement | Canonical Artifacts |
| --- | --- |
| MIGR-01 | `TS-BUN-SOLID-PARITY-MATRIX.md` |
| MIGR-02 | `TS-BUN-SOLID-IMPLEMENTATION-NOTES.md` |
| MIGR-03 | `INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md` |
| MIGR-04 | `TS-BUN-SOLID-IMPLEMENTATION-NOTES.md`, `INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md` |
| MIGR-05 | `PARITY-RISK-REGISTER.md`, `TS-BUN-SOLID-PARITY-MATRIX.md`, `INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md` |

## Acceptance Matrix

| Check ID | Requirement | Assertion | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| MIGR-01-AC-01 | MIGR-01 | Parity matrix covers all canonical artifacts. | Count `ART-####` rows in parity matrix. | pass when count is `237/237`; fail otherwise. |
| MIGR-01-AC-02 | MIGR-01 | Parity mapping enforces one-row-per-ART uniqueness. | Check duplicate IDs in parity matrix. | pass when duplicate count is zero; fail otherwise. |
| MIGR-02-AC-01 | MIGR-02 | TS/Bun/Solid implementation direction exists for all clusters. | Verify cluster map `C01`..`C12` in implementation notes. | pass when all clusters are present with target direction; fail otherwise. |
| MIGR-03-AC-01 | MIGR-03 | Discrepancy ledger covers all planned discrepancy units. | Count `Q##` rows in discrepancy inventory. | pass when count is `16/16`; fail otherwise. |
| MIGR-03-AC-02 | MIGR-03 | Discrepancy entries have explicit dispositions. | Verify disposition value presence per `Q##` row. | pass when all rows include valid disposition values; fail otherwise. |
| MIGR-04-AC-01 | MIGR-04 | External surface preservation is explicit in migration notes. | Verify implementation notes and discrepancy ledger include explicit `1:1` impact constraints. | pass when all discrepancy rows include external impact notes and notes file includes preservation rules; fail otherwise. |
| MIGR-05-AC-01 | MIGR-05 | Risk register coverage is complete. | Count `R##` rows in risk register. | pass when count is `12/12`; fail otherwise. |
| MIGR-05-AC-02 | MIGR-05 | Risk linkage from parity + discrepancy artifacts is complete. | Verify parity matrix and discrepancy ledger include `R##` references. | pass when all mapped units/discrepancies have risk linkage fields; fail otherwise. |

## Execution Checklist

1. Run parity row-count and uniqueness checks (`237/237`).
2. Run discrepancy count checks (`16/16`) and disposition coverage checks.
3. Run risk coverage checks (`12/12`) and risk-linkage checks.
4. Confirm requirement-level pass/fail outcomes before phase verification closure.

## Current Status Snapshot

- MIGR-01: pending execution
- MIGR-02: pending execution
- MIGR-03: pending execution
- MIGR-04: pending execution
- MIGR-05: pending execution

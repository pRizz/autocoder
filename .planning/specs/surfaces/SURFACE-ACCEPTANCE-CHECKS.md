# Surface Acceptance Checks

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Purpose:** Requirement-linked pass/fail checks for transport + data + process + security surface completeness.

## Requirement Mapping

| Requirement | Scope | Primary Artifacts |
| --- | --- | --- |
| SURF-01 | REST/API route contracts | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` |
| SURF-02 | WebSocket message contracts | `WEBSOCKET-ENDPOINT-MATRIX.md`, `WEBSOCKET-CONTRACTS.md` |
| SURF-03 | Data/persistence contracts | `DATA-PERSISTENCE-MATRIX.md`, `DATA-PERSISTENCE-CONTRACTS.md` |
| SURF-04 | Process/session lifecycle contracts | `PROCESS-LIFECYCLE-MATRIX.md`, `PROCESS-LIFECYCLE-CONTRACTS.md` |
| SURF-05 | Security/policy contracts | `SECURITY-POLICY-MATRIX.md`, `SECURITY-POLICY-CONTRACTS.md` |

## Acceptance Matrix

| Check ID | Requirement | Assertion | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| SURF-01-AC-01 | SURF-01 | REST endpoint count is exactly `68`. | Count method rows in `REST-API-ENDPOINT-MATRIX.md`. | pass when row count is 68; fail otherwise. |
| SURF-01-AC-02 | SURF-01 | REST matrix-to-contract parity is `68/68`. | Match every matrix `(method,path)` entry to route rows in `REST-API-CONTRACTS.md`. | pass when no missing/extra route entries exist; fail on any delta. |
| SURF-01-AC-03 | SURF-01 | Every REST route specifies request/response schemas. | Verify non-empty request/response columns for all route rows. | pass when all routes have schema entries; fail if any row is blank/ambiguous. |
| SURF-01-AC-04 | SURF-01 | Every REST route specifies status/error behavior. | Verify each route row contains `Status Codes` and `Error Behavior`. | pass when all 68 routes include success + applicable status/error semantics; fail otherwise. |
| SURF-01-AC-05 | SURF-01 | Frontend REST parity is documented. | Compare consumed route methods/paths in `ART-0226` against REST contracts. | pass when consumed routes are represented and backend-only endpoints are still contracted; fail otherwise. |
| SURF-02-AC-01 | SURF-02 | WebSocket endpoint count is exactly `5`. | Count endpoint rows in `WEBSOCKET-ENDPOINT-MATRIX.md`. | pass when row count is 5; fail otherwise. |
| SURF-02-AC-02 | SURF-02 | WebSocket endpoint/message parity is `5/5`. | Match each matrix endpoint to a protocol section in `WEBSOCKET-CONTRACTS.md` with message sets. | pass when all endpoints and type sets match; fail on any mismatch. |
| SURF-02-AC-03 | SURF-02 | Ordering semantics exist for each websocket channel. | Verify each channel section includes `Ordering` rules. | pass when all five channel contracts provide ordering behavior; fail otherwise. |
| SURF-02-AC-04 | SURF-02 | Failure and close behavior exist for each websocket channel. | Verify each channel section includes `Failure Modes` and `Close Codes`. | pass when all five channels define failure handling and close behavior; fail otherwise. |
| SURF-02-AC-05 | SURF-02 | Frontend websocket parity is documented. | Compare project-updates message contracts against `ART-0225` and `ART-0229` types. | pass when consumed message types/fields are represented; fail otherwise. |
| SURF-03-AC-01 | SURF-03 | Data matrix count is exactly `12`. | Count `D##` rows in `DATA-PERSISTENCE-MATRIX.md`. | pass when row count is 12; fail otherwise. |
| SURF-03-AC-02 | SURF-03 | Data matrix-to-contract parity is `12/12`. | Map `D01`..`D12` matrix units to `DATA-PERSISTENCE-CONTRACTS.md` clauses. | pass when all 12 units are represented with no gaps; fail otherwise. |
| SURF-03-AC-03 | SURF-03 | Migration and lifecycle controls are explicit. | Verify coverage of in-place migrations, `feature_list.json` backup flow, `BEGIN IMMEDIATE`, `busy_timeout`, and journal mode behavior. | pass when all migration/lifecycle controls are present; fail otherwise. |
| SURF-04-AC-01 | SURF-04 | Process matrix count is exactly `12`. | Count `P##` rows in `PROCESS-LIFECYCLE-MATRIX.md`. | pass when row count is 12; fail otherwise. |
| SURF-04-AC-02 | SURF-04 | Process matrix-to-contract parity is `12/12`. | Map `P01`..`P12` matrix units to `PROCESS-LIFECYCLE-CONTRACTS.md` clauses. | pass when all 12 units are represented with no gaps; fail otherwise. |
| SURF-04-AC-03 | SURF-04 | Lifecycle transition/recovery/cleanup semantics are explicit. | Verify state-transition coverage for agent, scheduler retry+override behavior, and `kill_process_tree` cleanup semantics. | pass when transition + recovery + cleanup semantics are all present; fail otherwise. |
| SURF-05-AC-01 | SURF-05 | Security matrix count is exactly `15`. | Count `S##` rows in `SECURITY-POLICY-MATRIX.md`. | pass when row count is 15; fail otherwise. |
| SURF-05-AC-02 | SURF-05 | Security matrix-to-contract parity is `15/15`. | Map `S01`..`S15` matrix units to `SECURITY-POLICY-CONTRACTS.md` clauses. | pass when all 15 units are represented with no gaps; fail otherwise. |
| SURF-05-AC-03 | SURF-05 | Command/path/trust-boundary policies are explicit. | Verify command hierarchy + validator controls, `SENSITIVE_DIRECTORIES`/UNC path controls, and localhost/`ALLOW_REMOTE` trust boundary documentation. | pass when all three policy families are covered; fail otherwise. |
| SURF-05-AC-04 | SURF-05 | Security policy traceability is complete. | Verify phase 6 policy families are linked in `SURFACE-TRACEABILITY.md` and include test evidence anchors `ART-0141`..`ART-0144`. | pass when traceability links are complete; fail otherwise. |

## Cross-Contract Traceability Gate

- `SURFACE-TRACEABILITY.md` must include REST/WebSocket plus Data/Process/Security families.
- `SURFACE-CROSS-CONTRACT-CONSISTENCY.md` must report no blocker conditions.
- Any failed requirement check blocks phase completion.

## Execution Checklist

1. Run transport checks (`68/68`, `5/5`) and confirm status/error + ordering/failure coverage.
2. Run lane parity checks (`12/12`, `12/12`, `15/15`) for data, process, and security artifacts.
3. Confirm matrix-to-contract and traceability linkage coverage for all SURF requirements.
4. Record pass/fail outcomes in phase verification report before closure.

## Expected Result

- SURF-01: pass
- SURF-02: pass
- SURF-03: pass
- SURF-04: pass
- SURF-05: pass
- Any failed check blocks phase completion until corrected.

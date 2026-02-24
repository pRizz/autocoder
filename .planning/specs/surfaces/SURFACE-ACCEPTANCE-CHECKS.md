# Surface Acceptance Checks

**Status:** Active  
**Phase:** 05 (Surface Contracts: API + WebSocket)  
**Purpose:** Requirement-linked pass/fail checks for surface contract completeness and quality.

## Requirement Mapping

| Requirement | Scope | Primary Artifacts |
| --- | --- | --- |
| SURF-01 | REST/API route contracts | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` |
| SURF-02 | WebSocket message contracts | `WEBSOCKET-ENDPOINT-MATRIX.md`, `WEBSOCKET-CONTRACTS.md` |

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

## Execution Checklist

1. Run REST count/parity checks (`68`, `68/68`) and confirm status/error coverage.
2. Run websocket count/parity checks (`5`, `5/5`) and confirm ordering/failure coverage.
3. Validate frontend consumer parity references (`ART-0225`, `ART-0226`, `ART-0229`) remain present.
4. Record pass/fail outcomes in phase verification report before phase closure.

## Expected Result

- SURF-01: pass
- SURF-02: pass
- Any failed check blocks phase completion until corrected.

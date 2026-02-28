# Surface Cross-Contract Consistency

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)

## Purpose

Provide objective consistency checks across Phase 5 transport contracts and Phase 6 data/process/security contracts, with explicit blocker criteria.

## Canonical Inputs

- Transport surfaces:
  - `REST-API-CONTRACTS.md`
  - `WEBSOCKET-CONTRACTS.md`
- Phase 6 lane surfaces:
  - `DATA-PERSISTENCE-MATRIX.md`
  - `DATA-PERSISTENCE-CONTRACTS.md`
  - `PROCESS-LIFECYCLE-MATRIX.md`
  - `PROCESS-LIFECYCLE-CONTRACTS.md`
  - `SECURITY-POLICY-MATRIX.md`
  - `SECURITY-POLICY-CONTRACTS.md`
- Traceability and acceptance binders:
  - `SURFACE-TRACEABILITY.md`
  - `SURFACE-ACCEPTANCE-CHECKS.md`

## Lane Parity Snapshot

| Lane | Matrix Artifact | Contract Artifact | Expected Units | Observed Units | Parity Status |
| --- | --- | --- | ---: | ---: | --- |
| Data/Persistence | `DATA-PERSISTENCE-MATRIX.md` | `DATA-PERSISTENCE-CONTRACTS.md` | 12 (`D01`..`D12`) | 12 | pass |
| Process/Lifecycle | `PROCESS-LIFECYCLE-MATRIX.md` | `PROCESS-LIFECYCLE-CONTRACTS.md` | 12 (`P01`..`P12`) | 12 | pass |
| Security/Policy | `SECURITY-POLICY-MATRIX.md` | `SECURITY-POLICY-CONTRACTS.md` | 15 (`S01`..`S15`) | 15 | pass |

## Cross-Surface Consistency Checks

| Check ID | Assertion | Evidence | Status | blocker Criteria |
| --- | --- | --- | --- | --- |
| XCC-01 | Phase 6 units are complete and internally consistent. | Unit sets `D01..D12`, `P01..P12`, `S01..S15` documented in matrices and contract docs. | pass | blocker if any lane count mismatches expected total or any matrix unit has no contract clause. |
| XCC-02 | Transport contracts and lifecycle contracts do not contradict state semantics. | `REST-API-CONTRACTS.md` Agent/Schedules/DevServer/Terminal sections align with lifecycle state models in `PROCESS-LIFECYCLE-CONTRACTS.md`. | pass | blocker if endpoint semantics conflict with lifecycle state transitions or cleanup guarantees. |
| XCC-03 | Data contracts and transport contracts align on persistence entities. | `REST-API-CONTRACTS.md` Features/Schedules/Assistant sections align with `features`, `schedules`, `schedule_overrides`, `conversations`, `conversation_messages` in data contracts. | pass | blocker if surfaced persistence objects are undocumented or mismatched across layers. |
| XCC-04 | Security policy gates align with externally exposed command/path surfaces. | Devserver/filesystem/identifier behaviors in REST and websocket docs align with `SECURITY-POLICY-CONTRACTS.md`. | pass | blocker if policy-safe defaults or trust boundaries are missing or contradicted by surface contracts. |
| XCC-05 | Contract corpus remains tied to implementing artifacts. | `SURFACE-TRACEABILITY.md` references implementing `ART-####` anchors spanning data/process/security + transport families. | pass | blocker if any Phase 6 family lacks implementing ART linkage. |

## Implementing Artifact Coverage (Phase 6 Focus)

| Contract Family | Required ART Anchors |
| --- | --- |
| Data/Persistence | `ART-0075`, `ART-0077`, `ART-0118` |
| Process/Lifecycle | `ART-0104`, `ART-0111`, `ART-0114`, `ART-0117`, `ART-0120`, `ART-0122`, `ART-0124`, `ART-0125`, `ART-0126`, `ART-0128` |
| Security/Policy | `ART-0078`, `ART-0096`, `ART-0100`, `ART-0102`, `ART-0106`, `ART-0109`, `ART-0130`, `ART-0141`, `ART-0142`, `ART-0143`, `ART-0144` |

## Consistency Verdict

- Phase 6 lane parity checks: **pass**
- Cross-surface contradiction checks: **pass**
- Traceability continuity checks: **pass**

No blocker conditions were found in this consistency pass.

## Verification Commands

```bash
rg -n '^\| D[0-9]{2} \|' .planning/specs/surfaces/DATA-PERSISTENCE-MATRIX.md | wc -l
rg -n '^\| P[0-9]{2} \|' .planning/specs/surfaces/PROCESS-LIFECYCLE-MATRIX.md | wc -l
rg -n '^\| S[0-9]{2} \|' .planning/specs/surfaces/SECURITY-POLICY-MATRIX.md | wc -l
rg -n 'REST-API-CONTRACTS|WEBSOCKET-CONTRACTS|ART-' .planning/specs/surfaces/SURFACE-CROSS-CONTRACT-CONSISTENCY.md
```

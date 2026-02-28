# Roadmap: AutoForge 1:1 Regeneration Spec Initiative

## Overview

This roadmap delivers an execution-ready specification corpus that can regenerate the current product surface from an empty repository while targeting a pure TypeScript + Bun + SolidJS future implementation. The phases move from scope certainty, to exhaustive contract capture, to migration mapping, and finally to verification gates, ensuring every v1 requirement is covered exactly once and remains traceable while preserving a docs-only execution model (no source file edits).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Scope Policy, Inventory, and Guardrails** - Lock scope boundaries, docs-only execution guardrails, and canonical artifact inventory.
- [x] **Phase 2: Coverage Validation & Classification** - Prove full source+ops coverage and artifact classification.
- [x] **Phase 3: File Contract Framework & Pilot Pass** - Establish file-spec schema and complete a representative pilot set.
- [x] **Phase 4: Full File-Level Contract Capture** - Complete exhaustive per-file contracts across all in-scope artifacts.
- [x] **Phase 5: Surface Contracts (API + WebSocket)** - Specify all external API and realtime protocol behavior.
- [x] **Phase 6: Surface Contracts (Data + Process + Security)** - Specify persistence, orchestration lifecycle, and policy contracts.
- [x] **Phase 7: TS/Bun/Solid Parity Matrix & Discrepancies** - Map all current units to target stack with risk/discrepancy tracking.
- [ ] **Phase 8: Reconstruction Checklist & Acceptance Gates** - Create dependency-ordered implementation waves and final readiness gate.

## Phase Details

### Phase 1: Scope Policy, Inventory, and Guardrails
**Goal**: Establish immutable scope boundaries, docs-only execution constraints, and canonical inventory source for all subsequent specifications.
**Depends on**: Nothing (first phase)
**Requirements**: INVT-01, INVT-02, GARD-01
**Success Criteria** (what must be TRUE):
  1. In-scope vs excluded artifact policy is explicit and approved.
  2. Docs-only execution guardrail is codified and validated (no source-file edits allowed).
  3. Canonical inventory index exists for all source+ops artifacts.
  4. Every inventoried artifact has a stable identifier used by downstream specs.
**Plans**: 3 plans

Plans:
- [x] 01-01: Define and ratify scope inclusion/exclusion policy
- [x] 01-02: Define and enforce docs-only non-modification guardrails
- [x] 01-03: Generate baseline inventory index with stable IDs

### Phase 2: Coverage Validation & Classification
**Goal**: Validate that inventory coverage is complete and exclusions are justified.
**Depends on**: Phase 1
**Requirements**: INVT-03, INVT-04
**Success Criteria** (what must be TRUE):
  1. Generated/runtime exclusions are documented with rationale and examples.
  2. Coverage audit shows zero unclassified in-scope artifacts.
  3. Coverage report is reproducible and can be rerun after repo changes.
**Plans**: 2 plans

Plans:
- [x] 02-01: Document exclusion classes and rationale
- [x] 02-02: Produce repeatable coverage audit and gap remediation pass

### Phase 3: File Contract Framework & Pilot Pass
**Goal**: Create robust file-spec contract schema and verify it on representative modules.
**Depends on**: Phase 2
**Requirements**: FILE-01, FILE-02
**Success Criteria** (what must be TRUE):
  1. File-spec template enforces purpose, ownership, I/O, side effects, and dependencies.
  2. Pilot file specs across key subsystem types (code, docs, workflows, scripts) are complete.
  3. Pilot review confirms template is executable by regeneration agents.
**Plans**: 3 plans

Plans:
- [x] 03-01: Define file-spec schema and authoring conventions
- [x] 03-02: Apply schema to pilot artifacts across subsystem types
- [x] 03-03: Review pilot outputs and finalize template

### Phase 4: Full File-Level Contract Capture
**Goal**: Complete exhaustive file-level specs for every in-scope artifact.
**Depends on**: Phase 3
**Requirements**: FILE-03, FILE-04, FILE-05
**Success Criteria** (what must be TRUE):
  1. Every in-scope file has a completed contract entry.
  2. Non-TypeScript artifacts are specified with equivalent contract rigor.
  3. Every file spec includes explicit acceptance checks.
  4. File-level contract set passes completeness audit against inventory IDs.
**Plans**: 4 plans

Plans:
- [x] 04-01: Capture application/runtime source file contracts
- [x] 04-02: Capture UI and frontend contract set
- [x] 04-03: Capture docs/workflows/scripts/config contract set
- [x] 04-04: Run completeness and quality audit on all file specs

### Phase 5: Surface Contracts (API + WebSocket)
**Goal**: Specify all API and realtime protocol behavior as authoritative contracts.
**Depends on**: Phase 4
**Requirements**: SURF-01, SURF-02
**Success Criteria** (what must be TRUE):
  1. REST/API contracts include routes, payloads, status codes, and error behavior.
  2. WebSocket contracts include event schemas, ordering assumptions, and failure modes.
  3. Contracts are cross-linked to implementing file specs and acceptance tests.
**Plans**: 3 plans

Plans:
- [x] 05-01: Document REST/API endpoint contracts
- [x] 05-02: Document websocket/event stream contracts
- [x] 05-03: Link protocol contracts to file specs and checks

### Phase 6: Surface Contracts (Data + Process + Security)
**Goal**: Specify persistence, orchestration lifecycle, and security/policy behavior contracts.
**Depends on**: Phase 5
**Requirements**: SURF-03, SURF-04, SURF-05
**Success Criteria** (what must be TRUE):
  1. Data contracts capture schemas, migration behavior, and lifecycle rules.
  2. Process/session contracts capture start/stop/retry/lock/cleanup semantics.
  3. Security contracts capture command/path constraints and trust boundaries.
  4. Cross-cutting contracts are consistent with file specs and protocol contracts.
**Plans**: 4 plans

Plans:
- [x] 06-01: Document persistence/schema/migration contracts
- [x] 06-02: Document orchestration and process lifecycle contracts
- [x] 06-03: Document security/policy contracts
- [x] 06-04: Run cross-contract consistency check

### Phase 7: TS/Bun/Solid Parity Matrix & Discrepancies
**Goal**: Produce complete old-to-new mapping with explicit migration guidance and risk controls.
**Depends on**: Phase 6
**Requirements**: MIGR-01, MIGR-02, MIGR-03, MIGR-04, MIGR-05
**Success Criteria** (what must be TRUE):
  1. Every in-scope implementation unit maps to a target TS/Bun/Solid unit.
  2. Target mapping preserves intended external product/API/command surface 1:1.
  3. Intended-vs-observed discrepancy ledger exists for mapped areas.
  4. Migration risks and mitigations are attached to each parity cluster.
**Plans**: 4 plans

Plans:
- [x] 07-01: Build complete old-to-new parity matrix
- [x] 07-02: Author target implementation notes for TS/Bun/Solid
- [x] 07-03: Create intended-vs-observed discrepancy ledger
- [x] 07-04: Attach risk/mitigation annotations to mapped units

### Phase 8: Reconstruction Checklist & Acceptance Gates
**Goal**: Deliver executable regeneration sequence and final readiness criteria.
**Depends on**: Phase 7
**Requirements**: VERI-01, VERI-02, VERI-03, VERI-04
**Success Criteria** (what must be TRUE):
  1. Dependency-ordered reconstruction waves are documented from empty repo to parity.
  2. Every v1 requirement has linked acceptance checks.
  3. End-to-end parity scenarios cover core workflows and ops behavior.
  4. Final "ready to regenerate" gate is explicit and objective.
**Plans**: 3 plans

Plans:
- [ ] 08-01: Define ordered reconstruction waves and prerequisites
- [ ] 08-02: Map acceptance checks to every v1 requirement
- [ ] 08-03: Finalize parity scenarios and readiness gate

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scope Policy, Inventory, and Guardrails | 3/3 | Complete | 2026-02-24 |
| 2. Coverage Validation & Classification | 2/2 | Complete | 2026-02-24 |
| 3. File Contract Framework & Pilot Pass | 3/3 | Complete | 2026-02-24 |
| 4. Full File-Level Contract Capture | 4/4 | Complete | 2026-02-24 |
| 5. Surface Contracts (API + WebSocket) | 3/3 | Complete | 2026-02-24 |
| 6. Surface Contracts (Data + Process + Security) | 4/4 | Complete | 2026-02-28 |
| 7. TS/Bun/Solid Parity Matrix & Discrepancies | 4/4 | Complete | 2026-02-28 |
| 8. Reconstruction Checklist & Acceptance Gates | 0/3 | Not started | - |

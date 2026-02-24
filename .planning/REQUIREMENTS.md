# Requirements: AutoForge 1:1 Regeneration Spec Initiative

**Defined:** 2026-02-24
**Core Value:** From an empty repo, an implementation agent can systematically rebuild all intended capabilities of this codebase with no hidden context.

## v1 Requirements

### Inventory & Scope

- [x] **INVT-01**: Spec corpus contains a complete inventory of all in-scope source and ops artifacts in this repository.
- [x] **INVT-02**: Spec corpus defines explicit inclusion/exclusion rules (source + ops included, generated/runtime artifacts excluded).
- [x] **INVT-03**: Excluded generated/runtime artifacts are documented with rationale to prevent ambiguity.
- [x] **INVT-04**: Coverage checks prove every in-scope artifact is represented in the specification corpus.

### Execution Guardrails

- [x] **GARD-01**: No source implementation files are modified during this initiative; outputs are limited to markdown/spec artifacts.

### File-Level Contract Specs

- [x] **FILE-01**: Every in-scope file has a spec entry describing purpose and ownership/responsibility.
- [x] **FILE-02**: Every file spec captures inputs, outputs, side effects, and direct dependencies.
- [x] **FILE-03**: Every file spec captures invariants, error behavior, and edge-case expectations.
- [x] **FILE-04**: Non-TypeScript artifacts (docs, workflows, scripts, configs) are specified with equivalent contract detail.
- [x] **FILE-05**: Every file spec includes regeneration-focused acceptance checks.

### Cross-Cutting Surface Contracts

- [x] **SURF-01**: REST/API contracts are fully specified (routes, payload shapes, status/error behavior).
- [x] **SURF-02**: WebSocket and streaming message contracts are fully specified (event types, payloads, ordering assumptions).
- [ ] **SURF-03**: Data and persistence contracts are fully specified (schemas, migrations, lifecycle rules).
- [ ] **SURF-04**: Process/session/orchestration lifecycle contracts are fully specified (start/stop/retry/lock/cleanup semantics).
- [ ] **SURF-05**: Security and policy contracts are fully specified (command/path constraints, trust boundaries, safe defaults).

### TS/Bun/Solid Parity Mapping

- [ ] **MIGR-01**: A 1:1 old-to-new parity matrix exists for all in-scope implementation units.
- [ ] **MIGR-02**: Target mapping notes define pure TypeScript + Bun + SolidJS implementation direction for each mapped area.
- [ ] **MIGR-03**: Intended-vs-observed discrepancy entries are documented for mapped areas where behavior differs from intent.
- [ ] **MIGR-04**: Preserved external surface is explicit (APIs, workflows, commands, and core product behavior remain 1:1).
- [ ] **MIGR-05**: Migration risks and mitigations are attached to mapped units.

### Reconstruction Checklist & Verification

- [ ] **VERI-01**: Reconstruction checklist provides dependency-ordered implementation waves from an empty repository.
- [ ] **VERI-02**: Acceptance checklist maps to every v1 requirement.
- [ ] **VERI-03**: End-to-end parity validation scenarios cover major workflows and operational paths.
- [ ] **VERI-04**: "Ready to regenerate" completion gate is defined with explicit pass/fail criteria.

## v2 Requirements

### Governance & Automation

- **GOV-01**: Define ongoing spec maintenance workflow with ownership and update triggers.
- **GOV-02**: Define drift detection checks between specs and repository changes.
- **GOV-03**: Provide machine-readable export of spec corpus for automation pipelines.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Generated/build/runtime artifact parity (`ui/dist`, caches, lock files, `venv`, etc.) | Not stable product intent; high-noise artifacts would reduce regeneration quality |
| Behavior-breaking redesigns of product surface | Initiative is parity-first reconstruction, not product redesign |
| Immediate implementation rewrite | Current phase is specification and planning, not execution/migration |
| Preservation of accidental quirks as hard requirements | Fidelity target is intended behavior with discrepancies explicitly triaged |
| Source code edits to existing implementation files | Initiative scope is markdown/spec generation only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INVT-01 | Phase 1 | Complete |
| INVT-02 | Phase 1 | Complete |
| GARD-01 | Phase 1 | Complete |
| INVT-03 | Phase 2 | Complete |
| INVT-04 | Phase 2 | Complete |
| FILE-01 | Phase 3 | Complete |
| FILE-02 | Phase 3 | Complete |
| FILE-03 | Phase 4 | Complete |
| FILE-04 | Phase 4 | Complete |
| FILE-05 | Phase 4 | Complete |
| SURF-01 | Phase 5 | Complete |
| SURF-02 | Phase 5 | Complete |
| SURF-03 | Phase 6 | Pending |
| SURF-04 | Phase 6 | Pending |
| SURF-05 | Phase 6 | Pending |
| MIGR-01 | Phase 7 | Pending |
| MIGR-02 | Phase 7 | Pending |
| MIGR-03 | Phase 7 | Pending |
| MIGR-04 | Phase 7 | Pending |
| MIGR-05 | Phase 7 | Pending |
| VERI-01 | Phase 8 | Pending |
| VERI-02 | Phase 8 | Pending |
| VERI-03 | Phase 8 | Pending |
| VERI-04 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 after Phase 5 execution/verification*

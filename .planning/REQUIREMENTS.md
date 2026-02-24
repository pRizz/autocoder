# Requirements: AutoForge 1:1 Regeneration Spec Initiative

**Defined:** 2026-02-24
**Core Value:** From an empty repo, an implementation agent can systematically rebuild all intended capabilities of this codebase with no hidden context.

## v1 Requirements

### Inventory & Scope

- [ ] **INVT-01**: Spec corpus contains a complete inventory of all in-scope source and ops artifacts in this repository.
- [ ] **INVT-02**: Spec corpus defines explicit inclusion/exclusion rules (source + ops included, generated/runtime artifacts excluded).
- [ ] **INVT-03**: Excluded generated/runtime artifacts are documented with rationale to prevent ambiguity.
- [ ] **INVT-04**: Coverage checks prove every in-scope artifact is represented in the specification corpus.

### File-Level Contract Specs

- [ ] **FILE-01**: Every in-scope file has a spec entry describing purpose and ownership/responsibility.
- [ ] **FILE-02**: Every file spec captures inputs, outputs, side effects, and direct dependencies.
- [ ] **FILE-03**: Every file spec captures invariants, error behavior, and edge-case expectations.
- [ ] **FILE-04**: Non-TypeScript artifacts (docs, workflows, scripts, configs) are specified with equivalent contract detail.
- [ ] **FILE-05**: Every file spec includes regeneration-focused acceptance checks.

### Cross-Cutting Surface Contracts

- [ ] **SURF-01**: REST/API contracts are fully specified (routes, payload shapes, status/error behavior).
- [ ] **SURF-02**: WebSocket and streaming message contracts are fully specified (event types, payloads, ordering assumptions).
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

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INVT-01 | TBD | Pending |
| INVT-02 | TBD | Pending |
| INVT-03 | TBD | Pending |
| INVT-04 | TBD | Pending |
| FILE-01 | TBD | Pending |
| FILE-02 | TBD | Pending |
| FILE-03 | TBD | Pending |
| FILE-04 | TBD | Pending |
| FILE-05 | TBD | Pending |
| SURF-01 | TBD | Pending |
| SURF-02 | TBD | Pending |
| SURF-03 | TBD | Pending |
| SURF-04 | TBD | Pending |
| SURF-05 | TBD | Pending |
| MIGR-01 | TBD | Pending |
| MIGR-02 | TBD | Pending |
| MIGR-03 | TBD | Pending |
| MIGR-04 | TBD | Pending |
| MIGR-05 | TBD | Pending |
| VERI-01 | TBD | Pending |
| VERI-02 | TBD | Pending |
| VERI-03 | TBD | Pending |
| VERI-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 0
- Unmapped: 23 ⚠️

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 after initial definition*

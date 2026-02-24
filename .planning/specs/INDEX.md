# Spec Corpus Index

**Status:** Active  
**Canonical root for all regeneration specifications**

## Purpose

This file is the single navigation entrypoint for the repository regeneration spec corpus.

## Phase 1 Baseline Artifacts

- [Scope Policy](./POLICY.md)
- [Execution Guardrails](./GUARDRAILS.md)

## Inventory Contracts

- [Inventory Rules](./INVENTORY-RULES.md)
- [Canonical Inventory](./INVENTORY.md)
- [Coverage Baseline](./COVERAGE-BASELINE.md)
- [Coverage Audit](./COVERAGE-AUDIT.md)

## Exclusions

- [Exclusion Taxonomy](./EXCLUSIONS.md)
- Phase 2 coverage audit artifacts must cite `EXCLUSIONS.md` when reporting omitted classes.

## Phase 1 completion

Phase 1 completion required inputs for Phase 2+ work:
- [Scope Policy](./POLICY.md)
- [Execution Guardrails](./GUARDRAILS.md)
- [Inventory Rules](./INVENTORY-RULES.md)
- [Canonical Inventory](./INVENTORY.md)
- [Coverage Baseline](./COVERAGE-BASELINE.md)

## File and Surface Contract Sections (Planned)

- File-level contracts (Phase 3-4)
- API/WebSocket surface contracts (Phase 5)
- Data/process/security contracts (Phase 6)

## File Contract Framework

- [File Spec Schema](./FILE-SPEC-SCHEMA.md)
- [File Spec Authoring Guide](./FILE-SPEC-AUTHORING.md)
- These are required prerequisites for pilot contracts (Phase 3) and full file-level capture (Phase 4).

## Pilot File Specs

- [Pilot Matrix](./pilot/PILOT-MATRIX.md)
- Pilot contracts directory: `./pilot/`

## Phase 3 completion

Phase 3 completion required prerequisites for Phase 4 full capture:
- [File Spec Schema](./FILE-SPEC-SCHEMA.md)
- [File Spec Authoring Guide](./FILE-SPEC-AUTHORING.md)
- [Pilot Matrix](./pilot/PILOT-MATRIX.md)
- [File Spec Pilot Review](./FILE-SPEC-REVIEW.md)

## Phase 4 Full File Contracts

- [Backend Runtime Matrix](./contracts/BACKEND-RUNTIME-MATRIX.md)
- Backend runtime contract directory: `./contracts/backend-runtime/`
- These lane artifacts are canonical Phase 4 outputs for backend/runtime full file-level coverage.

## Full File Contract Corpus

- [Backend Runtime Matrix](./contracts/BACKEND-RUNTIME-MATRIX.md)
- [Frontend UI Matrix](./contracts/FRONTEND-UI-MATRIX.md)
- [Non-TS Matrix](./contracts/NON-TS-MATRIX.md)
- Backend contracts directory: `./contracts/backend-runtime/`
- Frontend contracts directory: `./contracts/frontend-ui/`
- Non-TS contracts directory: `./contracts/non-ts/`
- [File Contract Coverage Ledger](./contracts/FILE-CONTRACT-COVERAGE.md)
- [File Contract Quality Audit](./contracts/FILE-CONTRACT-QUALITY-AUDIT.md)

Phase 4 required prerequisites for Phase 5:
- Full File Contract Corpus lane matrices and directories
- `FILE-CONTRACT-COVERAGE.md` (canonical 237/237 reconciliation evidence)
- `FILE-CONTRACT-QUALITY-AUDIT.md` (required section quality evidence)

## Migration and Parity Sections (Planned)

- TS/Bun/Solid parity matrix (Phase 7)
- Intended-vs-observed discrepancy ledger (Phase 7)

## Verification and Reconstruction Sections (Planned)

- Reconstruction waves/checklist (Phase 8)
- Requirement-linked acceptance gates (Phase 8)

## Artifact ID Usage

All downstream specs must reference a canonical artifact ID (format: `ART-####`) rather than path-only references to preserve stable cross-links as docs evolve.

## Coverage Evidence

- `COVERAGE-AUDIT.md` is required evidence for completeness claims.

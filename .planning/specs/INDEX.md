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

## Migration and Parity Sections (Planned)

- TS/Bun/Solid parity matrix (Phase 7)
- Intended-vs-observed discrepancy ledger (Phase 7)

## Verification and Reconstruction Sections (Planned)

- Reconstruction waves/checklist (Phase 8)
- Requirement-linked acceptance gates (Phase 8)

## Artifact ID Usage

All downstream specs must reference a canonical artifact ID (format: `ART-####`) rather than path-only references to preserve stable cross-links as docs evolve.

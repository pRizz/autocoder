# Project Research Summary

**Project:** AutoForge 1:1 Regeneration Spec Initiative
**Domain:** Full-parity codebase specification and TS/Bun/Solid migration planning
**Researched:** 2026-02-24
**Confidence:** HIGH

## Executive Summary

This initiative is best treated as a contract-engineering project, not a generic documentation pass. The correct outcome is an executable specification corpus that can drive reconstruction from an empty repository while preserving intended behavior across APIs, orchestration, UI, data, security, and operations.

Research indicates the highest-leverage approach is dual-track: capture current behavior contracts from the existing codebase map and source files, then pair each contract with a TypeScript/Bun/Solid target mapping. This keeps migration intent explicit while preventing feature loss during stack transition.

The largest risks are incomplete artifact scope, overly abstract specs, and accidental preservation of bugs as parity requirements. These are mitigated by strict inventory-first scoping, per-file contract templates, discrepancy tracking for intended-vs-observed behavior, and a dependency-aware reconstruction checklist.

## Key Findings

### Recommended Stack

For the target rebuild, use TypeScript end-to-end on Bun with SolidJS for the UI, plus a TS-native HTTP/WS server layer and typed SQLite access. Keep runtime/tooling minimal and modular; do not split architecture into microservices during parity migration.

**Core technologies:**
- TypeScript: unified language for backend/orchestrator/tooling/UI — satisfies pure TS requirement
- Bun: runtime + package manager + test execution — reduces toolchain complexity
- SolidJS: UI framework for parity replacement of current React surface
- Hono/Elysia + SQLite ORM: preserves API/data behavior with TS-native contracts

### Expected Features

**Must have (table stakes):**
- Source+ops inventory and per-file behavior contracts
- API/WebSocket/data/process/security contract catalogs
- Old->new parity matrix and reconstruction acceptance checklist

**Should have (competitive):**
- Discrepancy ledger for intended-vs-observed behavior
- Risk register mapped to implementation checkpoints

**Defer (v2+):**
- Automated drift detection and machine-readable spec export

### Architecture Approach

Use a four-layer documentation architecture: (1) scope/index layer, (2) per-file and cross-cutting contract extraction layer, (3) migration mapping layer, and (4) verification/checklist layer. This separates stable intent from implementation progress while maintaining traceability from requirement to contract to parity item.

**Major components:**
1. Inventory index — defines and freezes in-scope artifacts
2. Contract corpus — captures detailed behavior per file and per protocol
3. Migration parity matrix — maps current modules to TS/Bun/Solid targets
4. Verification checklist — ordered build and acceptance criteria for regeneration

### Critical Pitfalls

1. **Incomplete scope coverage** — prevent with inventory-first gate
2. **Abstract/non-executable specs** — prevent with strict per-file contract schema
3. **Accidental bug preservation** — prevent with discrepancy triage
4. **Unordered parity execution** — prevent with dependency-aware reconstruction waves
5. **Post-creation drift** — prevent with update triggers and periodic audits

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Scope & Inventory Baseline
**Rationale:** Every downstream artifact depends on a complete, agreed scope.
**Delivers:** Scope policy + exhaustive inventory index.
**Addresses:** Table-stakes coverage and anti-scope drift risk.
**Avoids:** Pitfall #1 (incomplete artifact scope).

### Phase 2: Per-File Contract Capture
**Rationale:** Core value requires deterministic behavior contracts before migration mapping.
**Delivers:** File-level specs for all source + ops artifacts.
**Uses:** Existing codebase map + direct file audit.
**Implements:** Contract extraction layer.

### Phase 3: Cross-Cutting Contract Catalogs
**Rationale:** API/data/process/security contracts should be centralized to avoid duplication.
**Delivers:** Protocol and lifecycle catalogs linked to file specs.
**Implements:** Data flow and interface governance.

### Phase 4: TS/Bun/Solid Parity Matrix
**Rationale:** Migration intent must be explicit and auditable.
**Delivers:** 1:1 old->new mapping with dual-track notes and discrepancy handling.
**Uses:** Stack recommendations from STACK.md.

### Phase 5: Reconstruction Checklist & Acceptance Gates
**Rationale:** Final output must be executable by implementation agents.
**Delivers:** Ordered implementation waves with pass/fail criteria.
**Avoids:** Pitfall #4 (unordered execution) and #5 (maintenance drift).

### Phase Ordering Rationale

- Inventory precedes contracts because missing artifacts invalidate fidelity claims.
- Per-file contracts precede migration mapping so target design stays anchored to real behavior.
- Cross-cutting catalogs precede final checklist to prevent duplicated/conflicting criteria.
- Verification is last so all prior artifacts can be converted into execution gates.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4:** Bun compatibility for PTY/process-heavy modules and Windows behavior parity
- **Phase 5:** Practical acceptance automation strategy for large artifact counts

Phases with standard patterns (skip heavy additional research):
- **Phase 1-3:** Documentation and contract decomposition patterns are straightforward with current context

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Target stack is clear; subsystem compatibility details need phase-level verification |
| Features | HIGH | User intent and parity scope are explicit |
| Architecture | HIGH | Spec architecture is directly derived from initiative constraints |
| Pitfalls | HIGH | Risks are strongly evidenced by codebase scale/shape and migration constraints |

**Overall confidence:** HIGH

### Gaps to Address

- Validate Bun compatibility for process/PTY-heavy parity requirements before lock-in of migration plan.
- Define canonical template schema for per-file specs to keep quality consistent at scale.
- Establish drift governance (when and how specs are updated as repo changes).

## Sources

### Primary (HIGH confidence)
- `.planning/codebase/STACK.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `CONCERNS.md` — current system baseline
- User-scoped decisions captured in `.planning/PROJECT.md` — parity and migration constraints

### Secondary (MEDIUM confidence)
- Official stack docs: [bun.sh](https://bun.sh), [docs.solidjs.com](https://docs.solidjs.com), [typescriptlang.org](https://www.typescriptlang.org)

### Tertiary (LOW confidence)
- Ecosystem compatibility assumptions for edge subsystems (to be validated in planning)

---
*Research completed: 2026-02-24*
*Ready for roadmap: yes*

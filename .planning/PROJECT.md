# AutoForge 1:1 Regeneration Spec Initiative

## What This Is

This project is an AI-first, execution-ready specification system for regenerating the full product surface of this repository from an empty codebase. It captures current behavior contracts in detail and defines a parity-preserving target direction for a pure TypeScript + Bun + SolidJS implementation.

## Core Value

From an empty repo, an implementation agent can systematically rebuild all intended capabilities of this codebase with no hidden context.

## Current State

- **Milestone shipped:** v1.0 (2026-02-28)
- **Outcome:** Full v1 regeneration corpus is complete and archived.
- **Coverage:** 8 phases, 26 plans, 80 tasks, 24/24 v1 requirements complete.
- **Canonical archives:**
  - `.planning/milestones/v1.0-ROADMAP.md`
  - `.planning/milestones/v1.0-REQUIREMENTS.md`
  - `.planning/milestones/v1.0-MILESTONE-AUDIT.md`

## Requirements

### Validated

- ✓ Autonomous agent orchestration exists with initializer/coding/testing execution loops and parallel worker control — existing baseline
- ✓ Feature and schedule persistence exists via per-project SQLite schemas and migration paths — existing baseline
- ✓ FastAPI backend exposes project/feature/schedule/devserver/terminal/spec/assistant APIs and WebSocket streams — existing baseline
- ✓ React operational UI exists with real-time status, feature views, terminal integration, and agent controls — existing baseline
- ✓ Security controls exist for command allowlists, path restrictions, and guarded execution surfaces — existing baseline
- ✓ MCP feature tooling exists to mediate feature lifecycle operations for agents — existing baseline
- ✓ Cross-platform process/session management exists for macOS/Linux/Windows launch and PTY behavior — existing baseline
- ✓ Repo-level operational assets exist (docs, workflows, scripts, configs) that influence runtime and delivery — existing baseline
- ✓ Complete 1:1 file/responsibility specification corpus for source + ops artifacts (generated/runtime excluded) — v1.0
- ✓ Behavior contracts captured per scoped file/module (interfaces, side effects, dependencies, acceptance) — v1.0
- ✓ Full parity matrix mapping current units to TypeScript/Bun/Solid target units — v1.0
- ✓ Migration guidance preserves product/API/command surface behavior 1:1 during stack transition — v1.0
- ✓ AI-first deterministic checklists and execution-ready markdown corpus are published — v1.0
- ✓ Explicit non-goals, risks, and ambiguity handling are documented in canonical specs — v1.0
- ✓ No-source-modification guardrail enforced across milestone execution — v1.0

### Active

- [ ] GOV-01: Define ongoing spec maintenance workflow with ownership and update triggers.
- [ ] GOV-02: Define drift-detection checks between spec corpus and repository changes.
- [ ] GOV-03: Provide machine-readable export of the spec corpus for automation pipelines.
- [ ] Define v1.1 implementation bootstrap plan for TypeScript/Bun/Solid execution from the archived corpus.

### Out of Scope

- Generated/build/runtime artifact parity (`ui/dist`, caches, lock files, `venv`, transient artifacts)
- Behavior-breaking redesign of APIs/workflows/commands/core UX flows
- Preservation of accidental quirks/bugs as hard requirements
- Uncontrolled source edits that bypass the docs-first governance model

## Context

The v1.0 corpus now includes inventory governance, per-file contracts, cross-cutting surface contracts, migration parity/discrepancy/risk controls, and final reconstruction readiness gates. The codebase remains a brownfield implementation, while the planning corpus is now stable enough to drive a controlled regeneration effort and future governance milestone.

## Constraints

- **Target stack direction:** Pure TypeScript runtime on Bun with SolidJS UI
- **Fidelity:** Preserve intended external behavior and operational surface 1:1
- **Corpus discipline:** Keep specifications deterministic, auditable, and requirement-linked
- **Execution guardrail:** Continue avoiding direct source-file rewrites outside explicitly approved implementation milestones

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dual-track spec strategy (current behavior + target TS/Bun/Solid mapping) | Retain exact implementation intent while enabling structured migration | ✓ Adopted in v1.0 |
| Coverage includes source + ops; excludes generated artifacts | Capture stable product intent without volatile noise | ✓ Adopted in v1.0 |
| Fidelity target is intended behavior, not accidental quirks | Preserve expected behavior and triage discrepancies explicitly | ✓ Adopted in v1.0 |
| Spec audience is AI-first | Main deliverable is deterministic regeneration guidance | ✓ Adopted in v1.0 |
| Product/API/command surface remains 1:1 in target implementation | Minimize migration risk and regression scope | ✓ Adopted in v1.0 |
| Definition of done is full spec corpus + parity matrix + migration notes + acceptance checklist | Ensure execution-ready completeness | ✓ Achieved in v1.0 |
| No source files modified during spec initiative | Preserve docs-only scope and auditability | ✓ Enforced in v1.0 |

## Next Milestone Goals

1. Establish governance workflows and ownership for ongoing spec maintenance.
2. Introduce automated drift detection and machine-readable corpus outputs.
3. Prepare controlled implementation kickoff plans for TypeScript/Bun/Solid regeneration.

---
*Last updated: 2026-02-28 after v1.0 milestone completion*

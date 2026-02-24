# AutoForge 1:1 Regeneration Spec Initiative

## What This Is

This project creates an exhaustive, file-level markdown specification system for this repository so the full product can be recreated from an empty repository. It captures current implemented capabilities and operations in high detail, then pairs each area with a TypeScript/Bun/SolidJS target mapping for future reimplementation. The primary consumer is AI regeneration agents that need deterministic, checklist-driven implementation guidance.

## Core Value

From an empty repo, an implementation agent can systematically rebuild all intended capabilities of this codebase with no hidden context.

## Requirements

### Validated

- ✓ Autonomous agent orchestration exists with initializer/coding/testing execution loops and parallel worker control — existing
- ✓ Feature and schedule persistence exists via per-project SQLite schemas and migration paths — existing
- ✓ FastAPI backend exposes project/feature/schedule/devserver/terminal/spec/assistant APIs and WebSocket streams — existing
- ✓ React operational UI exists with real-time status, feature views, terminal integration, and agent controls — existing
- ✓ Security controls exist for command allowlists, path restrictions, and guarded execution surfaces — existing
- ✓ MCP feature tooling exists to mediate feature lifecycle operations for agents — existing
- ✓ Cross-platform process/session management exists for macOS/Linux/Windows launch and PTY behavior — existing
- ✓ Repo-level operational assets exist (docs, workflows, scripts, configs) that influence runtime and delivery — existing

### Active

- [ ] Produce a complete 1:1 file/responsibility specification corpus for all source + ops artifacts (excluding generated/build/runtime artifacts)
- [ ] For every scoped file/module, capture intended behavior contracts, interfaces, side effects, dependencies, and acceptance criteria
- [ ] Create a parity matrix mapping current implementation units to TypeScript/Bun/SolidJS target implementation units
- [ ] Document migration guidance that preserves current product/API/command surface behavior while changing implementation stack
- [ ] Encode the corpus in AI-first, deterministic checklists and execution-ready markdown structure
- [ ] Capture explicit non-goals, risk areas, and known behavior ambiguities to prevent incorrect regeneration assumptions

### Out of Scope

- Generated/build/runtime artifacts (`ui/dist`, caches, `venv`, dependency vendor dirs, transient logs/locks) — not part of stable product intent
- Behavior-breaking redesign of product surface (APIs, workflows, commands, core UX flows) — scope is parity-first regeneration
- Immediate code migration in this phase — this initiative defines specs/checklists for later implementation phases
- Preservation of accidental quirks/bugs solely because they currently exist — fidelity target is intended behavior, with discrepancies called out

## Context

This is a brownfield codebase with a completed `.planning/codebase/` map describing stack, architecture, structure, conventions, testing, integrations, and concerns. The current implementation spans Python backend/orchestration plus TypeScript React UI and operational scripts/docs. The desired future implementation stack is pure TypeScript on Bun with SolidJS UI, while preserving the existing product surface 1:1. The effort is explicitly spec-first: establish an authoritative reconstruction corpus before any full-stack rewrite.

## Constraints

- **Tech stack**: Future target must be pure TypeScript on Bun + SolidJS — eliminate Python runtime dependency in target implementation
- **Behavior fidelity**: Preserve intended current behavior and public surface 1:1 — enables safe drop-in regeneration equivalence
- **Coverage boundary**: Include source + ops artifacts, exclude generated artifacts — keeps corpus exhaustive yet stable and maintainable
- **Spec format**: AI-first checklists and explicit contracts — optimize for deterministic regeneration by autonomous agents
- **Migration framing**: Dual-track documentation (current behavior + target mapping) — prevents loss of implementation intent during stack transition

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dual-track spec strategy (current behavior + target TS/Bun/Solid mapping) | Retain exact implementation intent while enabling structured migration | — Pending |
| Coverage includes source + ops; excludes generated artifacts | Capture real product/operational behavior without volatile noise | — Pending |
| Fidelity target is intended behavior, not accidental quirks | Preserve what should exist, not bugs introduced by current stack details | — Pending |
| Spec audience is AI-first | Main deliverable is regeneration guidance for implementation agents | — Pending |
| Product/API/command surface remains 1:1 in target implementation | Minimize migration risk and regression scope | — Pending |
| Definition of done is full spec corpus + parity matrix + migration notes + acceptance checklist | Ensures execution-ready completeness instead of partial documentation | — Pending |

---
*Last updated: 2026-02-24 after initialization*

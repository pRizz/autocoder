# TS/Bun/Solid Implementation Notes

**Status:** Active  
**Phase:** 07 (TS/Bun/Solid Parity Matrix & Discrepancies)  
**Primary requirements:** `MIGR-02`, `MIGR-04`

`TS-BUN-SOLID-PARITY-MATRIX.md` is the canonical row-level mapping source. This document defines cluster-level implementation direction for a pure TypeScript runtime on Bun and a SolidJS frontend.

## Cluster Map

| Cluster ID | Cluster Name | Scope | Target Runtime Ownership | Target Direction |
| --- | --- | --- | --- | --- |
| C01 | Bun Backend Core | API routers/services and shared backend runtime flows | Bun + TypeScript backend modules | Replace Python runtime modules with Bun-native TypeScript service boundaries while keeping endpoint behavior stable. |
| C02 | Data Persistence Layer | feature/schedule/assistant storage contracts | Bun + TypeScript data layer | Implement schema/migration/access flows in TypeScript with Bun-compatible SQLite clients and deterministic lifecycle semantics. |
| C03 | Realtime Transport | websocket/session streaming contracts | Bun + TypeScript transport layer | Recreate websocket channels and message semantics with strict contract parity. |
| C04 | Process and Session Orchestration | process manager, scheduler, terminal lifecycle | Bun + TypeScript orchestration layer | Re-implement process/session state machines with equivalent transitions and cleanup semantics. |
| C05 | Backend Tests | backend and security regression suites | Bun test tooling + TypeScript test modules | Translate runtime/security tests to TypeScript while preserving contract assertions and failure behavior. |
| C06 | Security and Policy Enforcement | command/path/trust-boundary rules | Bun + TypeScript security middleware | Preserve policy hierarchy and validation outcomes with safe-default behavior. |
| C07 | Solid UI App | primary UI composition and interaction components | SolidJS app modules | Map React component behavior to SolidJS component boundaries without changing user-visible workflows. |
| C08 | Solid Frontend Tooling | frontend configs, build/test settings, linting | Bun tooling + TypeScript config | Align frontend build and typecheck flows around Bun and SolidJS conventions. |
| C09 | Solid Frontend Tests | e2e and frontend contract tests | Playwright + TypeScript test modules | Preserve test intent, selectors, and protocol expectations while updating implementation bindings. |
| C10 | Bun Ops and Automation | scripts, launch flows, CI automation glue | Bun script runtime | Replace Python-centric operational script steps with Bun/TypeScript execution where behavior is runtime-coupled. |
| C11 | Config and Environment Contracts | manifests, env templates, project/org config behavior | Repository config + Bun runtime assumptions | Maintain config semantics and precedence rules while removing Python runtime dependency. |
| C12 | Docs and Governance Corpus | planning/docs/spec contracts and workflow guides | Markdown/spec corpus | Keep specification corpus authoritative and synchronized with parity outputs and acceptance gates. |

## Cluster-to-Matrix Usage

- Use matrix `Target Module/Cluster` values as authoritative cluster assignment for every `ART-####` row.
- Cluster plans must remain compatible with lane mapping in `TS-BUN-SOLID-PARITY-MATRIX.md`.
- Any cluster change that reassigns external-surface ownership requires updating parity/discrepancy/risk artifacts together.

## External Surface Preservation Rules

- Migration target is strict `1:1` external behavior preservation, even when internal runtime implementation changes.
- `REST` behavior parity:
  - route set, method/path semantics, request/response shapes, and status/error behavior stay contract-equivalent to `REST-API-CONTRACTS.md`.
- `WebSocket` behavior parity:
  - channel paths, message types, ordering assumptions, heartbeat behavior, and close/error semantics stay contract-equivalent to `WEBSOCKET-CONTRACTS.md`.
- Data/process/security parity:
  - persistence, migration, and transaction behavior follow `DATA-PERSISTENCE-CONTRACTS.md`.
  - lifecycle transitions, retry rules, lock handling, and cleanup follow `PROCESS-LIFECYCLE-CONTRACTS.md`.
  - command and path policy behavior, trust boundary enforcement, and safe defaults follow `SECURITY-POLICY-CONTRACTS.md`.
- Command and policy controls:
  - command allow/block policy outcomes, command validators, and path restrictions must preserve policy behavior and user-visible failure semantics.
- Runtime change boundary:
  - remove Python runtime dependency from target implementation, but do not alter externally observable behavior.
  - every replacement should be documented as `no Python runtime` internal swap with parity-safe behavior constraints.

## References

- `TS-BUN-SOLID-PARITY-MATRIX.md`
- `REST-API-CONTRACTS.md`
- `WEBSOCKET-CONTRACTS.md`
- `DATA-PERSISTENCE-CONTRACTS.md`
- `PROCESS-LIFECYCLE-CONTRACTS.md`
- `SECURITY-POLICY-CONTRACTS.md`

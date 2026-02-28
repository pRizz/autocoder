# Intended vs Observed Discrepancy Ledger

**Status:** Active  
**Phase:** 07 (TS/Bun/Solid Parity Matrix & Discrepancies)  
**Primary requirements:** `MIGR-03`, `MIGR-04`

## Discrepancy Inventory

| Discrepancy ID | Related ART IDs | Domain | Intended Behavior | Observed Behavior | Migration Disposition |
| --- | --- | --- | --- | --- | --- |
| Q01 | `ART-0102`, `ART-0104`, `ART-0111` | Backend API lifecycle | Stable API contract behavior independent of runtime internals. | Python service-layer wiring is tightly coupled to module layout. | preserve |
| Q02 | `ART-0105`, `ART-0113`, `ART-0114`, `ART-0131` | WebSocket channel behavior | Channel semantics remain contract-first and deterministic. | Runtime channel handlers rely on Python async idioms not directly portable. | preserve |
| Q03 | `ART-0075`, `ART-0077`, `ART-0118` | Data migration behavior | Migration and backup flows must remain deterministic. | Migration orchestration mixes initialization and runtime concerns. | preserve |
| Q04 | `ART-0122`, `ART-0124`, `ART-0126` | Process/session lifecycle | Start/stop/retry/cleanup states remain externally stable. | Process supervision and cleanup logic are distributed across services. | preserve |
| Q05 | `ART-0100`, `ART-0106`, `ART-0109`, `ART-0130` | Security policy | Command/path policy outcomes remain strict and safe-by-default. | Enforcement points are split between shared utility and router-level checks. | preserve |
| Q06 | `ART-0078`, `ART-0096` | Auth and rate-limit handling | User-visible auth and rate-limit feedback remains consistent. | Error interpretation relies on Python exception handling patterns. | clarify |
| Q07 | `ART-0155`, `ART-0231`, `ART-0226` | Frontend app bootstrap | UI startup and API wiring behavior remains unchanged. | React-centric mount/state wiring must be translated to SolidJS primitives. | preserve |
| Q08 | `ART-0156`..`ART-0215` | Frontend component behavior | Component workflows and interaction outcomes remain 1:1. | Component implementation assumes React rendering/lifecycle semantics. | preserve |
| Q09 | `ART-0216`..`ART-0225` | Frontend hooks and streams | Hook-driven dataflow semantics remain functionally equivalent. | Hooks are React-based and require SolidJS signal/store re-expression. | preserve |
| Q10 | `ART-0146`, `ART-0147`, `ART-0151` | Frontend test harness | Existing e2e verification intent remains intact. | Playwright tests currently assume React-specific app timing patterns. | clarify |
| Q11 | `ART-0132`..`ART-0137` | Startup scripts | Operator startup command behavior remains predictable across OSes. | Startup flows include Python launch scripts in critical paths. | preserve |
| Q12 | `ART-0028`, `ART-0091`, `ART-0150` | CI/build tooling | CI and package workflows remain reproducible. | Toolchain assumptions are split between npm and Python-centric steps. | preserve |
| Q13 | `ART-0081`, `ART-0088`, `ART-0015`..`ART-0026` | Ops automation | Automation commands and expected outputs remain stable. | Some automation documentation assumes Python-backed command handlers. | clarify |
| Q14 | `ART-0027`, `ART-0086`, `ART-0087`, `ART-0123` | Config precedence | Config precedence/override behavior remains deterministic. | Runtime config loading currently relies on Python-specific parsing paths. | preserve |
| Q15 | `ART-0061`..`ART-0068`, `ART-0031`..`ART-0034` | Planning/spec governance | Spec corpus remains canonical and execution-safe during migration. | Planning artifacts currently describe mixed Python+TS implementation state. | defer-with-guardrail |
| Q16 | `ART-0071`, `ART-0072`, `ART-0070` | User/operator documentation | User-facing docs remain behavior-accurate for target stack. | Existing docs refer to Python components that will be replaced. | defer-with-guardrail |

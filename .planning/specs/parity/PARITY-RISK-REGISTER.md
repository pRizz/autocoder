# Parity Risk Register

**Status:** Active  
**Phase:** 07 (TS/Bun/Solid Parity Matrix & Discrepancies)  
**Primary requirement:** `MIGR-05`

## Risk Inventory

| Risk ID | Risk Area | Impacted Clusters / ART Span | Severity | Likelihood | Mitigation Strategy | Verification Signal |
| --- | --- | --- | --- | --- | --- | --- |
| R01 | Backend runtime translation drift | `C01`, `ART-0073`..`ART-0131` | High | Medium | Enforce parity-matrix row review + API/WebSocket contract gate checks before implementation milestones. | No unresolved parity deltas in MIGR acceptance checks. |
| R02 | Data migration behavior divergence | `C02`, `ART-0075`, `ART-0077`, `ART-0118` | High | Medium | Validate migration/backup semantics against data persistence contracts before cutover design. | Data parity checks pass for schema/migration controls. |
| R03 | WebSocket protocol mismatch | `C03`, `ART-0105`, `ART-0113`, `ART-0114`, `ART-0131`, `ART-0225` | High | Medium | Preserve endpoint/message/ordering schema as contract-locked migration requirements. | WebSocket parity checks remain green. |
| R04 | Process lifecycle semantics regression | `C04`, `ART-0120`, `ART-0122`, `ART-0124`, `ART-0126` | High | Medium | Keep lifecycle state transitions and cleanup guarantees contract-anchored during migration decomposition. | Lifecycle parity checks pass for start/stop/retry/cleanup semantics. |
| R05 | Security policy enforcement drift | `C06`, `ART-0100`, `ART-0106`, `ART-0109`, `ART-0130`, `ART-0141`..`ART-0144` | High | Medium | Keep command/path/trust-boundary outcomes fixed to security contract corpus and test anchors. | Security parity checks pass with explicit ART-0141..0144 linkage. |
| R06 | SolidJS component behavior mismatch | `C07`, `ART-0155`..`ART-0215` | Medium | Medium | Map component workflows to parity clusters and preserve user-visible interaction semantics. | UI parity checks show no behavior deltas in mapped flows. |
| R07 | Frontend reactive model mismatch | `C07`, `C09`, `ART-0216`..`ART-0225` | Medium | Medium | Define Solid signal/store migration notes per hook stream with protocol contract anchors. | Hook/websocket parity checks pass in acceptance matrix. |
| R08 | Test migration coverage loss | `C05`, `C09`, backend + frontend `TEST` artifacts | Medium | Medium | Preserve test intent mappings and explicitly track translated test ownership by parity row. | Test-related parity rows have mapped target ownership and no gaps. |
| R09 | Ops script migration breakage | `C10`, `ART-0081`, `ART-0088`, `ART-0132`..`ART-0137` | Medium | Medium | Convert runtime-coupled scripts with behavior-preserving wrappers and guardrail checks. | Ops parity checks pass and startup/automation behavior remains documented. |
| R10 | CI/tooling incompatibility | `C08`, `C10`, `ART-0028`, `ART-0091`, `ART-0150` | Medium | Low | Align toolchain assumptions around Bun and TypeScript while preserving workflow outputs. | CI/tooling parity rows mapped with explicit target notes and mitigations. |
| R11 | Config precedence drift | `C11`, `ART-0027`, `ART-0086`, `ART-0087`, `ART-0123` | Medium | Medium | Preserve config merge/precedence rules via explicit migration notes and discrepancy controls. | Config parity checks pass without unresolved precedence discrepancies. |
| R12 | Documentation/spec drift during migration | `C12`, planning/docs artifacts (`ART-0031`..`ART-0072`) | Low | Medium | Keep parity corpus and acceptance gates as canonical governance baseline for Phase 8 waves. | Phase 8 prerequisites resolve cleanly from INDEX and parity corpus. |

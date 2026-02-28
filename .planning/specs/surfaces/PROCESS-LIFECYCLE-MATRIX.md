# Process Lifecycle Matrix

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Canonical completeness source for SURF-04**

Total contract units: **12**

## Coverage Rules

- Covers start/stop/retry/lock/cleanup semantics across agent, scheduler, devserver, terminal, and chat session components.
- Captures lifecycle/state behavior anchored to backend runtime artifacts and router orchestration entry points.
- Excludes transport payload schema details already contracted in Phase 5 REST/WebSocket documents.

## Contract Unit Inventory

| Unit | Component | Source ART | State Model | Transition Triggers | Failure/Cleanup Guarantees |
| --- | --- | --- | --- | --- | --- |
| P01 | Agent process state machine | `ART-0122`, `ART-0104` | `stopped`, `running`, `paused`, `crashed`, `pausing`, `paused_graceful` | API start/stop/pause/resume/graceful endpoints and process exit events | Status callbacks fire on transition; terminal states reset runtime flags |
| P02 | Agent startup lifecycle | `ART-0122` | `stopped -> running` | `start(...)` validates lock, cleans stale state, builds orchestrator command, creates lock atomically | Failed lock creation kills just-started process to prevent duplicate agents |
| P03 | Agent pause/resume lifecycle | `ART-0122` | `running <-> paused`, `running -> pausing -> paused_graceful -> running` | `pause`, `resume`, `graceful_pause`, `graceful_resume` methods and drain signal file | Missing process promotes `crashed` and lock cleanup; drain file always removed on stop/crash |
| P04 | Agent stop/health lifecycle | `ART-0122`, `ART-0128` | `running/paused/* -> stopped|crashed` | explicit stop, poll-based healthcheck, process exit monitoring | Uses `kill_process_tree` for child cleanup; stale in-progress features reset on crash/stop |
| P05 | Agent lock lifecycle and orphan recovery | `ART-0122` | lock absent/present/stale | `_check_lock`, `_create_lock`, `_remove_lock`, startup orphan lock cleanup | PID + creation-time check prevents PID-reuse false positives; stale locks auto-removed |
| P06 | Scheduler runtime lifecycle | `ART-0124`, `ART-0102` | scheduler `started/stopped`; schedule window active/inactive | app lifespan startup/shutdown, scheduler service start/stop | Startup loads schedules and missed windows; shutdown stops scheduler before managers |
| P07 | Scheduled start/stop and override lifecycle | `ART-0124`, `ART-0111`, `ART-0075` | schedule window + manual override states | cron start/stop jobs, override records (`start`/`stop`), active-window checks | `latest stop wins` overlap handling; manual overrides prevent conflicting auto action |
| P08 | Scheduler crash-recovery lifecycle | `ART-0124`, `ART-0122` | crash retry count and restart backoff state | crash callback from manager status, `handle_crash_during_window` | Retry capped at 3; exponential backoff sequence 10s/30s/90s before restart attempts |
| P09 | Dev server process lifecycle | `ART-0120`, `ART-0106` | `stopped`, `running`, `crashed` | REST start/stop/status, output monitor exit detection | Lock-file guard prevents double-start; stop uses `kill_process_tree`; orphan lock cleanup on startup |
| P10 | Terminal PTY/session lifecycle | `ART-0126`, `ART-0114` | terminal metadata existence + session active/inactive | create/list/rename/delete terminal, websocket resize/input flow, per-session stop | Initial resize required before PTY start; session cleanup removes callbacks/tasks/process handles |
| P11 | Chat session lifecycle (assistant/spec/expand) | `ART-0117`, `ART-0125`, `ART-0121`, `ART-0105`, `ART-0113`, `ART-0107` | session map active/inactive, per-conversation status | websocket `start`/`message`/`answer` (and `done` for expand), router close/delete | Cleanup helpers close all active SDK clients on shutdown; protocol returns typed errors for invalid sequencing |
| P12 | Cross-process termination utility contract | `ART-0128`, `ART-0120`, `ART-0122` | kill result statuses `success`, `partial`, `failure` | stop flows invoke `kill_process_tree(proc, timeout)` | Child-first termination + force-kill fallback is deterministic and reported via `KillResult` counters |

## References

- Detailed lifecycle semantics: `PROCESS-LIFECYCLE-CONTRACTS.md`
- Data dependency companion: `DATA-PERSISTENCE-CONTRACTS.md`
- Policy constraints companion: `SECURITY-POLICY-CONTRACTS.md`

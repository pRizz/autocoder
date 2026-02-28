# Process Lifecycle Contracts

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Requirement:** `SURF-04`

`PROCESS-LIFECYCLE-MATRIX.md` is the canonical completeness source for this contract set (`12/12` units).

## Contract Scope

- Defines orchestration lifecycle behavior across agent, scheduler, dev server, terminal, and interactive chat session services.
- Captures start/stop/retry/lock/cleanup semantics as observable runtime contracts.
- Anchored to `ART-0122`, `ART-0124`, `ART-0120`, `ART-0126`, `ART-0128`, and related router/session artifacts.

## Agent Process Lifecycle

**Primary Artifacts:** `ART-0122`, `ART-0104`

### status model

- Enumerated status values: `stopped`, `running`, `paused`, `crashed`, `pausing`, `paused_graceful`.
- Status changes trigger async callbacks to websocket/observer consumers.

### start/stop lifecycle

- `start(...)` contract:
  - rejects launch if current status is already active.
  - validates project lock ownership via `_check_lock`.
  - performs stale cleanup before launching orchestrator process.
  - creates lock atomically (`O_CREAT|O_EXCL`) with PID + creation time.
- `stop(...)` contract:
  - cancels output stream task.
  - terminates entire process tree via `kill_process_tree`.
  - performs stale feature cleanup and lock removal.
  - resets runtime state fields (model, concurrency, ratios, status flags).

### pause/resume and graceful drain lifecycle

- Immediate pause path uses `psutil.suspend()/resume()` transitions (`running <-> paused`).
- Graceful path writes drain-signal file and transitions `running -> pausing`.
- Orchestrator output markers drive `pausing -> paused_graceful` and `paused_graceful -> running` transitions.
- Graceful resume clears drain signal file before returning to `running`.

### crash and healthcheck lifecycle

- Healthcheck treats terminated active process as `crashed`.
- Crash path guarantees lock cleanup, stale-feature reset, and drain-file cleanup.
- Exit monitoring distinguishes clean stop vs crash by return code and current status.

## Scheduler Lifecycle

**Primary Artifacts:** `ART-0124`, `ART-0111`, `ART-0075`

### scheduler service start/stop

- Startup (`start`) initializes scheduler in UTC, checks missed windows, and loads persisted schedules.
- Shutdown (`stop`) stops scheduling before manager cleanup to prevent new starts during teardown.

### UTC and midnight scheduling semantics

- Cron triggers are always built with `timezone=UTC`.
- Midnight-crossing schedules shift stop-day bitfield forward (`_shift_days_forward`).
- Active-window evaluation handles both same-day and cross-midnight windows.

### override and overlap semantics

- Manual `stop` override blocks scheduled start until override expiry.
- Manual `start` override blocks scheduled stop until override expiry.
- Overlap rule: if another enabled schedule window is still active, ending schedule does not stop agent (`latest stop wins`).

### crash retry lifecycle

- Crash callbacks from agent manager trigger `handle_crash_during_window(...)`.
- Retry policy uses capped backoff with `MAX_CRASH_RETRIES=3` and `CRASH_BACKOFF_BASE=10` (10s, 30s, 90s).
- Exceeded retry count prevents further automatic restarts in current window.

## Dev Server Lifecycle

**Primary Artifacts:** `ART-0120`, `ART-0106`

### status model

- Enumerated status values: `stopped`, `running`, `crashed`.
- URL discovery updates runtime `detected_url` from output stream regex match.

### command and process lifecycle

- Start rejects empty commands and blocked metacharacters/operators.
- Start rejects shell runners (e.g., sh/bash/cmd/powershell) and creates lock after process spawn.
- Stop cancels output stream and uses `kill_process_tree` for parent+children termination.
- Healthcheck transitions running process to `crashed` on unexpected exit and removes lock.

### lock and cleanup lifecycle

- Lock contract validates PID still running in same project directory to avoid PID-reuse false positives.
- Orphan lock cleanup scans registered projects and removes stale `.devserver.lock` artifacts.

## Terminal Lifecycle

**Primary Artifacts:** `ART-0126`, `ART-0114`

### metadata and session lifecycle

- Terminal metadata lifecycle supports create/list/rename/delete operations per project.
- Sessions are lazily created per `(project_name, terminal_id)`.
- Cleanup path stops all active sessions during server shutdown.

### PTY runtime lifecycle

- `start(cols, rows)` validates project path and selects platform-specific PTY backend.
- WebSocket contract requires initial `resize` before first PTY start for deterministic dimensions.
- Input/output uses byte streams (`base64` transport at websocket edge) with callback fan-out.
- `stop()` cancels output task and ensures platform-appropriate process termination and handle cleanup.

## Chat Session Lifecycle

**Primary Artifacts:** `ART-0117`, `ART-0125`, `ART-0121` and routers `ART-0105`, `ART-0113`, `ART-0107`

### shared chat session semantics

- Sessions are created on `start` and reused until explicit close/cleanup.
- Message sequencing contract: no `message`/`answer` before successful `start`.
- Responses are chunked and terminated with `response_done` markers.
- Rate-limited SDK errors are converted into typed error responses (no process crash).

### assistant/spec/expand differences

- Assistant session persists conversation history and supports structured question/answer loops.
- Spec session tracks file-write completion and only emits completion when required outputs are verified.
- Expand session tracks cumulative `features_created` and emits `expansion_complete` on `done`.

## Cross-Process Cleanup Contracts

- `kill_process_tree` contract returns `KillResult` with deterministic counters for children found/terminated/killed and parent force-kill status.
- App lifespan shutdown order: scheduler cleanup first, then agent/session/terminal/devserver cleanup.
- Global cleanup helpers clear manager/session registries to prevent stale in-memory state reuse.

## Error and Edge Behavior

- Lock conflicts return explicit failure messages instead of double-running process instances.
- Missing process during pause/resume transitions is normalized to `crashed` status.
- Invalid websocket sequencing (e.g., terminal input before start, chat message before start) produces typed errors and keeps connection policy-consistent.
- Scheduler startup tolerates missing project DB paths by skipping load rather than failing entire service.

## Cross-References

- Completeness inventory: `PROCESS-LIFECYCLE-MATRIX.md`
- Data contracts: `DATA-PERSISTENCE-CONTRACTS.md`
- Policy contracts: `SECURITY-POLICY-CONTRACTS.md`
- Transport behavior context: `REST-API-CONTRACTS.md`, `WEBSOCKET-CONTRACTS.md`

## Acceptance Checks

| Check ID | Requirement | Assertion | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| SURF-04-AC-01 | SURF-04 | Process lifecycle matrix count is exactly `12`. | Count `P##` rows in `PROCESS-LIFECYCLE-MATRIX.md`. | pass when 12 rows exist; fail otherwise. |
| SURF-04-AC-02 | SURF-04 | Matrix-to-contract parity is `12/12`. | Map each matrix unit (`P01`..`P12`) to lifecycle clauses in this document. | pass when all units are represented with no omissions; fail on any missing unit. |
| SURF-04-AC-03 | SURF-04 | Agent lifecycle state-transition coverage is explicit. | Verify contracts include `stopped`, `running`, `paused`, `crashed`, graceful pause/resume, and healthcheck transitions. | pass when all required agent states/transitions are documented; fail otherwise. |
| SURF-04-AC-04 | SURF-04 | Scheduler retry/override/UTC semantics are explicit. | Verify UTC scheduling, midnight handling, manual override rules, and crash retry behavior are documented. | pass when all four scheduler semantics are present; fail otherwise. |
| SURF-04-AC-05 | SURF-04 | Cleanup and termination behavior is deterministic across components. | Verify `kill_process_tree`, lock cleanup, session cleanup, and shutdown-order guarantees are documented. | pass when all cleanup mechanisms are covered; fail otherwise. |

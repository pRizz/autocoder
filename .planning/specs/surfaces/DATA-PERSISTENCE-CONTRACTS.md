# Data Persistence Contracts

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Requirement:** `SURF-03`

`DATA-PERSISTENCE-MATRIX.md` is the canonical completeness source for this contract set (`12/12` units).

## Contract Scope

- Defines persistence behavior for feature/schedule state and assistant conversation state.
- Captures schema, migration, transaction, and data lifecycle semantics required for reproducible regeneration.
- Anchored to implementation artifacts `ART-0075`, `ART-0077`, and `ART-0118`.

## Persistence Stores

| Store | Primary Path Contract | Core Tables/Objects | Primary ART |
| --- | --- | --- | --- |
| Project feature DB | per-project `features.db` path resolved through `autoforge_paths` helpers | `features`, `schedules`, `schedule_overrides` | `ART-0075` |
| Assistant DB | per-project `assistant.db` path resolved through `autoforge_paths` helpers | `conversations`, `conversation_messages` | `ART-0118` |
| JSON migration source | `feature_list.json` (legacy import source) | feature array payload + backup artifact | `ART-0077` |

## Schema Contracts

### features

- Identity: integer primary key `id`.
- Core backlog fields: `priority`, `category`, `name`, `description`, `steps`.
- Execution-state fields: `passes`, `in_progress`, `needs_human_input`.
- Coordination fields: `dependencies`, `human_input_request`, `human_input_response`.
- Query optimization: composite index on (`passes`, `in_progress`, `needs_human_input`).
- Serialization contract: `to_dict()` normalizes legacy NULL booleans to false and NULL dependencies to empty list.

### schedules

- Identity: integer primary key `id`, scoped by `project_name`.
- Timing model: `start_time` (`HH:MM`, UTC), `duration_minutes`, and `days_of_week` bitfield.
- Lifecycle/state fields: `enabled`, `yolo_mode`, optional `model`, `max_concurrency`, `crash_count`, `created_at`.
- Constraint contract (DB-enforced):
  - `duration_minutes >= 1 AND <= 1440`
  - `days_of_week >= 0 AND <= 127`
  - `max_concurrency >= 1 AND <= 5`
  - `crash_count >= 0`

### schedule_overrides

- Identity: integer primary key `id` with foreign key `schedule_id`.
- Override semantics: `override_type` (`start`/`stop`), `expires_at`, `created_at`.
- Lifecycle contract: cascade delete on schedule removal; scheduler cleanup removes expired rows.

### conversations and conversation_messages

- `conversations`: project-scoped thread record with optional title, created/updated timestamps.
- `conversation_messages`: ordered entries (`role`, `content`, `timestamp`) tied to `conversation_id`.
- Title derivation contract: first user message seeds conversation title (truncated).
- Message retrieval contract: ordered by timestamp ascending for deterministic replay.

## Migration Contracts

### In-place SQLite upgrades

- Startup migration helpers are idempotent and run after `Base.metadata.create_all(...)`.
- Column/table add operations are guarded by schema inspection and `PRAGMA table_info` checks.
- Supported upgrade paths include:
  - adding `in_progress`
  - repairing NULL boolean fields
  - adding `dependencies`
  - adding human-input fields
  - creating `schedules` and `schedule_overrides`
  - adding schedule columns `crash_count` and `max_concurrency` when absent

### JSON import/export lifecycle

- `migrate_json_to_sqlite(...)` runs only when:
  - `feature_list.json` exists, and
  - DB feature count is zero.
- Import behavior:
  - accepts old and new payload shapes with defaults.
  - commits all imported features in one DB transaction.
- Backup behavior:
  - source file is moved to `feature_list.json.backup.<timestamp>` after successful import.
  - backup move failure is warning-level and does not roll back imported DB data.
- Export behavior:
  - `export_to_json(...)` writes ordered feature snapshots to JSON for debugging/rollback workflows.

## Transaction and Lifecycle Contracts

### journal mode and filesystem safety

- Local filesystems default to `journal mode WAL`.
- Network-like filesystems use `journal mode DELETE` to avoid WAL corruption scenarios.
- Network detection includes Windows UNC/remote drive detection and Linux mount type checks (`nfs`, `nfs4`, `cifs`, `smbfs`, `fuse.sshfs`).

### locking and timeout semantics

- Connection hook disables pysqlite implicit transactions (`isolation_level = None`).
- Connection hook applies `PRAGMA busy_timeout=30000`.
- Transaction begin hook always emits `BEGIN IMMEDIATE` to acquire write lock early and avoid stale read-modify-write cycles.
- `atomic_transaction(...)` provides commit/rollback/close guarantees for concurrent update paths.

### engine/session lifecycle

- `create_database(project_dir)` caches `(engine, SessionLocal)` per project key.
- `dispose_engine(project_dir)` releases DB resources/locks and removes cache entry.
- `get_db()` dependency guarantees rollback-on-exception and always closes session.
- Assistant DB layer mirrors this with thread-safe engine caching and explicit disposal for file-lock release paths.

## Error and Edge Behavior

- Malformed `feature_list.json` payloads fail migration with explicit parse/read errors.
- Import failures rollback pending DB writes and return `False` from migration helper.
- Missing session-maker initialization in dependency path raises runtime error (no silent fallback).
- Missing conversation IDs in assistant DB operations return `None`/`False` (not hard crash) for route-level 404 handling.
- DB lock contention honors `busy_timeout` and then surfaces operational errors to callers.

## Cross-References

- Completeness inventory: `DATA-PERSISTENCE-MATRIX.md`
- Process coordination companion: `PROCESS-LIFECYCLE-CONTRACTS.md`
- Policy/security companion: `SECURITY-POLICY-CONTRACTS.md`
- Existing transport surfaces: `REST-API-CONTRACTS.md`, `WEBSOCKET-CONTRACTS.md`

## Acceptance Checks

Task 3 adds explicit SURF-03 pass/fail acceptance checks and matrix-to-contract verification steps.

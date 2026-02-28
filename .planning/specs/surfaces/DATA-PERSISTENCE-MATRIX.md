# Data Persistence Matrix

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Canonical completeness source for SURF-03**

Total contract units: **12**

## Coverage Rules

- Covers persistence schemas, migrations, transaction semantics, and data-lifecycle behavior from `ART-0075`, `ART-0077`, and `ART-0118`.
- Includes both primary feature/schedule storage (`features.db`) and assistant conversation storage (`assistant.db`).
- Excludes HTTP/WebSocket transport details (captured in Phase 5 surface contracts).

## Contract Unit Inventory

| Unit | Concern | Source ART | Persistence Objects | Invariants/Lifecycle Rules | Failure/Edge Behavior |
| --- | --- | --- | --- | --- | --- |
| D01 | Feature entity schema and status indexing | `ART-0075` | `features` table (`id`, `priority`, `category`, `name`, `description`, `steps`, `passes`, `in_progress`, `dependencies`, human-input fields) | Composite status index (`passes`, `in_progress`, `needs_human_input`) supports queue/status queries; boolean fields normalize NULL -> false in serialization | Malformed dependency payloads are normalized by `get_dependencies_safe`; NULL booleans repaired by migration helpers |
| D02 | Schedule entity schema and constraints | `ART-0075` | `schedules` table | `duration_minutes` 1..1440, `days_of_week` bitfield 0..127, `max_concurrency` 1..5, `crash_count >= 0` enforced by DB CHECK constraints | Invalid values fail at DB constraint boundary during insert/update |
| D03 | Schedule override persistence and cascade behavior | `ART-0075` | `schedule_overrides` table with FK `schedule_id` | Overrides are scoped to schedule windows; `ondelete="CASCADE"` removes orphan overrides when schedule is deleted | Expired overrides are deleted by scheduler flows; missing schedule rows resolve as no-op |
| D04 | Database path/url resolution contract | `ART-0075`, `ART-0079` | per-project `features.db` path and SQLAlchemy sqlite URL | Database lives under project `.autoforge` path helpers; URL uses `as_posix()` for cross-platform compatibility | Nonexistent parent directories are created before engine boot |
| D05 | Journal mode selection by filesystem type | `ART-0075` | SQLite PRAGMA `journal_mode` | Local filesystems default to `WAL`; network-like mounts (NFS/SMB/CIFS/SSHFS/UNC/remote drives) force `DELETE` mode to reduce corruption risk | Mount detection fallback errs toward safety; journal mode is set before event hooks start transactions |
| D06 | Transaction bootstrap and lock semantics | `ART-0075` | engine event hooks (`connect`, `begin`) | Connect hook sets `isolation_level=None` and `busy_timeout=30000`; begin hook always issues `BEGIN IMMEDIATE` | Prevents stale reads in read-modify-write paths; lock contention waits up to timeout then surfaces DB error |
| D07 | In-place schema upgrade migrations | `ART-0075` | `_migrate_add_in_progress_column`, `_migrate_add_dependencies_column`, `_migrate_add_human_input_columns`, schedule table/column upgrades | Migration helpers are idempotent (`PRAGMA table_info`/inspection checks before `ALTER TABLE`/create) | Missing columns/tables are added at startup; legacy/testing columns are tolerated by no-op migration |
| D08 | Startup ordering for persistence boot | `ART-0075` | `create_database(project_dir)` sequence | Boot sequence: ensure parent dir -> set PRAGMAs -> install hooks -> `create_all()` -> run migrations -> return cached `(engine, SessionLocal)` | Raw DBAPI acquisition failure aborts startup with runtime error |
| D09 | Session dependency and atomic transaction helpers | `ART-0075` | `set_session_maker`, `get_db`, `atomic_transaction` | `get_db` yields session with rollback on exception; `atomic_transaction` commits on success/rolls back on failure with guaranteed close | Uninitialized global session maker raises runtime error to prevent silent misconfiguration |
| D10 | JSON -> SQLite migration and backup lifecycle | `ART-0077` | `feature_list.json` import, `feature_list.json.backup.<timestamp>` | Migration runs only when JSON exists and DB feature count is zero; imported rows preserve legacy/new fields with defaults | Parse/read/import errors rollback and return false; backup move warnings do not undo successful import |
| D11 | SQLite -> JSON export support | `ART-0077` | `feature_list_export.json` (or caller-provided output path) | Export orders features by priority then id; uses `to_dict()` serialization contract | Session always closes; file write failures surface through standard IO exceptions |
| D12 | Assistant conversation persistence lifecycle | `ART-0118` | `assistant.db` tables `conversations`, `conversation_messages`; per-project engine cache | Engine cache keyed by resolved project path with thread-safe creation; conversation/message CRUD updates timestamps and derives title from first user message | `dispose_engine` releases file locks for deletion workflows; missing conversation operations return None/false instead of crashing |

## References

- Detailed contract semantics: `DATA-PERSISTENCE-CONTRACTS.md`
- Implementing file-contract anchors: `ART-0075`, `ART-0077`, `ART-0118`
- Related surface contracts: `PROCESS-LIFECYCLE-CONTRACTS.md`, `SECURITY-POLICY-CONTRACTS.md`

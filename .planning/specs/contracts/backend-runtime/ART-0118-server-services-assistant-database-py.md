# ART-0118: server-services-assistant-database-py

## Artifact Identity
- ART ID: ART-0118
- Path: server/services/assistant_database.py
- Category: BACKEND_SOURCE
- Contract Version: 1.0

## Purpose
Implements stateful backend service behavior in `server/services/assistant_database.py` for process/session/control-plane lifecycle operations. Primary symbols: Base, _utc_now, Conversation, ConversationMessage, get_db_path, get_engine, dispose_engine, get_session.

## Ownership
- Owns: stateful service coordination and lifecycle management for its domain.
- Does not own: HTTP route shape ownership and unrelated subsystem orchestration.

## Inputs
- Call-site parameters and in-process state provided by importing modules.
- Project configuration and environment variables consumed during runtime decisions.
- Domain entities/data exchanged with adjacent backend modules.

## Outputs
- Callable module behavior (functions/classes/routes/services) consumed by direct dependents.
- Deterministic state transitions or response payload structures defined by this module.

## Side Effects
- May read or mutate SQLite-backed project state via domain/database collaborators.
- Emits runtime logs, errors, or websocket-facing events consumed by operators.

## Direct Dependencies
- ART-0102 `server/main.py`: Service lifecycle integration.
- ART-0075 `api/database.py`: Persistent state and model access.

## Error and Edge Behavior
- Invalid configuration, missing collaborators, or malformed inputs must surface explicit errors instead of silent fallback.
- Unexpected exceptions should be propagated/logged so orchestrators and callers can apply retry, abort, or remediation paths deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0118` and `server/services/assistant_database.py` in `.planning/specs/INVENTORY.md`.
- [ ] Purpose and ownership boundaries are explicit enough to separate responsibilities from adjacent modules.
- [ ] Inputs/outputs/side effects describe observable behavior, not implementation guesses.
- [ ] Direct dependency list includes concrete `ART-####` references with rationale.
- [ ] Error and edge behavior documents failure handling expectations used by regeneration agents.

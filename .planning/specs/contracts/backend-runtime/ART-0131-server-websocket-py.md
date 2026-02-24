# ART-0131: server-websocket-py

## Artifact Identity
- ART ID: ART-0131
- Path: server/websocket.py
- Category: BACKEND_SOURCE
- Contract Version: 1.0

## Purpose
Implements websocket event fan-out and client synchronization behavior in `server/websocket.py` for live orchestration updates. Primary symbols: AgentTracker, OrchestratorTracker, _get_count_passing_tests, ConnectionManager, poll_progress, project_websocket.

## Ownership
- Owns: runtime behavior encapsulated by this module within backend orchestration.
- Does not own: cross-cutting responsibilities owned by other domain modules.

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
- ART-0075 `api/database.py`: Persistent state contract.
- ART-0100 `security.py`: Safety and validation controls.

## Error and Edge Behavior
- Invalid configuration, missing collaborators, or malformed inputs must surface explicit errors instead of silent fallback.
- Unexpected exceptions should be propagated/logged so orchestrators and callers can apply retry, abort, or remediation paths deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0131` and `server/websocket.py` in `.planning/specs/INVENTORY.md`.
- [ ] Purpose and ownership boundaries are explicit enough to separate responsibilities from adjacent modules.
- [ ] Inputs/outputs/side effects describe observable behavior, not implementation guesses.
- [ ] Direct dependency list includes concrete `ART-####` references with rationale.
- [ ] Error and edge behavior documents failure handling expectations used by regeneration agents.

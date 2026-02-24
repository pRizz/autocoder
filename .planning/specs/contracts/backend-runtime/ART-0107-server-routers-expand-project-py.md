# ART-0107: server-routers-expand-project-py

## Artifact Identity
- ART ID: ART-0107
- Path: server/routers/expand_project.py
- Category: BACKEND_SOURCE
- Contract Version: 1.0

## Purpose
Defines HTTP/WebSocket route behavior in `server/routers/expand_project.py` and translates API surface contracts into service-layer execution. Primary symbols: ExpandSessionStatus, list_expand_sessions_endpoint, get_expand_session_status, cancel_expand_session, expand_project_websocket.

## Ownership
- Owns: request validation/routing orchestration and HTTP error translation for this endpoint surface.
- Does not own: deep business logic and persistence internals delegated to service/domain modules.

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
- ART-0102 `server/main.py`: Router registration and lifecycle host.
- ART-0115 `server/schemas.py`: Request/response schema contracts.

## Error and Edge Behavior
- Invalid configuration, missing collaborators, or malformed inputs must surface explicit errors instead of silent fallback.
- Unexpected exceptions should be propagated/logged so orchestrators and callers can apply retry, abort, or remediation paths deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0107` and `server/routers/expand_project.py` in `.planning/specs/INVENTORY.md`.
- [ ] Purpose and ownership boundaries are explicit enough to separate responsibilities from adjacent modules.
- [ ] Inputs/outputs/side effects describe observable behavior, not implementation guesses.
- [ ] Direct dependency list includes concrete `ART-####` references with rationale.
- [ ] Error and edge behavior documents failure handling expectations used by regeneration agents.

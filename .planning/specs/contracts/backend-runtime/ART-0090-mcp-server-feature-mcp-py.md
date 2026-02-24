# ART-0090: mcp-server-feature-mcp-py

## Artifact Identity
- ART ID: ART-0090
- Path: mcp_server/feature_mcp.py
- Category: BACKEND_SOURCE
- Contract Version: 1.0

## Purpose
Exposes MCP tool-server behavior in `mcp_server/feature_mcp.py` so agent processes can query and mutate project feature state. Primary symbols: MarkPassingInput, SkipFeatureInput, MarkInProgressInput, ClearInProgressInput, RegressionInput, FeatureCreateItem, BulkCreateInput, server_lifespan.

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
- ART-0075 `api/database.py`: Feature and status persistence.
- ART-0092 `parallel_orchestrator.py`: Execution orchestration data flow.

## Error and Edge Behavior
- Invalid configuration, missing collaborators, or malformed inputs must surface explicit errors instead of silent fallback.
- Unexpected exceptions should be propagated/logged so orchestrators and callers can apply retry, abort, or remediation paths deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0090` and `mcp_server/feature_mcp.py` in `.planning/specs/INVENTORY.md`.
- [ ] Purpose and ownership boundaries are explicit enough to separate responsibilities from adjacent modules.
- [ ] Inputs/outputs/side effects describe observable behavior, not implementation guesses.
- [ ] Direct dependency list includes concrete `ART-####` references with rationale.
- [ ] Error and edge behavior documents failure handling expectations used by regeneration agents.

# ART-0079: autoforge-paths-py

## Artifact Identity
- ART ID: ART-0079
- Path: autoforge_paths.py
- Category: BACKEND_SOURCE
- Contract Version: 1.0

## Purpose
Implements backend runtime behavior in `autoforge_paths.py` as part of the AutoForge control-plane execution stack. Primary symbols: _resolve_path, _resolve_dir, get_autoforge_dir, ensure_autoforge_dir, get_features_db_path, get_assistant_db_path, get_agent_lock_path, get_devserver_lock_path.

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
- May read project configuration/environment state to determine runtime behavior.
- Emits process/output state used by orchestration, diagnostics, or downstream modules.

## Direct Dependencies
- ART-0097 `registry.py`: Direct runtime collaboration.
- ART-0133 `start.py`: Direct runtime collaboration.

## Error and Edge Behavior
- Invalid configuration, missing collaborators, or malformed inputs must surface explicit errors instead of silent fallback.
- Unexpected exceptions should be propagated/logged so orchestrators and callers can apply retry, abort, or remediation paths deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0079` and `autoforge_paths.py` in `.planning/specs/INVENTORY.md`.
- [ ] Purpose and ownership boundaries are explicit enough to separate responsibilities from adjacent modules.
- [ ] Inputs/outputs/side effects describe observable behavior, not implementation guesses.
- [ ] Direct dependency list includes concrete `ART-####` references with rationale.
- [ ] Error and edge behavior documents failure handling expectations used by regeneration agents.

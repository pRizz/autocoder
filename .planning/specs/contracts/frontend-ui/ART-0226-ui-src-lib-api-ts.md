# ART-0226: ui-src-lib-api-ts

## Artifact Identity
- ART ID: ART-0226
- Path: ui/src/lib/api.ts
- Category: FRONTEND_SOURCE
- Contract Version: 1.0

## Purpose
Provides shared frontend utility/API/type behavior in `ui/src/lib/api.ts` for component and hook contracts. Primary symbols: listProjects, createProject, getProject, deleteProject, getProjectPrompts, updateProjectPrompts, updateProjectSettings, resetProject.

## Ownership
- Owns: frontend module behavior encapsulated by this file.
- Does not own: cross-layer concerns owned by backend/runtime services.

## Inputs
- Props/state/context values and shared types consumed at runtime.
- API/websocket/client utility results from hook/lib collaborators.
- Theme/config/runtime values affecting rendering and interaction behavior.

## Outputs
- Renderable UI behavior, state transitions, and interaction affordances.
- Typed values/events consumed by dependent components/hooks and app shell modules.

## Side Effects
- May issue network requests or websocket interactions with backend APIs/event streams.
- Mutates client-side cache/state and triggers rerender paths in consuming components.

## Direct Dependencies
- ART-0229 `ui/src/lib/types.ts`: Type-level contract source of truth.
- ART-0225 `ui/src/hooks/useWebSocket.ts`: Runtime messaging and event wiring consumers.

## Error and Edge Behavior
- Missing runtime dependencies, malformed payloads, or invalid state assumptions must surface explicit errors or guarded fallback UI states.
- Unexpected failures should preserve diagnosable logs/events so regeneration and debugging workflows can reproduce behavior deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0226` and `ui/src/lib/api.ts` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects describe concrete observable UI/config/test behavior.
- [ ] Direct dependencies include concrete `ART-####` references with role rationale.
- [ ] Error and edge behavior covers failure handling and fallback expectations.
- [ ] Contract wording is specific enough for regeneration agents to reimplement intent.

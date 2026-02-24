# ART-0155: ui-src-app-tsx

## Artifact Identity
- ART ID: ART-0155
- Path: ui/src/App.tsx
- Category: FRONTEND_SOURCE
- Contract Version: 1.0

## Purpose
Defines frontend behavior in `ui/src/App.tsx` as part of the UI runtime and operator experience stack. Primary symbols: App, handleKeyDown.

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
- Mutates rendered UI state and interaction flow in response to user/system events.
- May trigger downstream hook calls, logging, or runtime utility execution.

## Direct Dependencies
- ART-0226 `ui/src/lib/api.ts`: Backend API contract client used by app shell.
- ART-0225 `ui/src/hooks/useWebSocket.ts`: Realtime updates for orchestration state.
- ART-0229 `ui/src/lib/types.ts`: Shared application-level type contracts.

## Error and Edge Behavior
- Missing runtime dependencies, malformed payloads, or invalid state assumptions must surface explicit errors or guarded fallback UI states.
- Unexpected failures should preserve diagnosable logs/events so regeneration and debugging workflows can reproduce behavior deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0155` and `ui/src/App.tsx` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects describe concrete observable UI/config/test behavior.
- [ ] Direct dependencies include concrete `ART-####` references with role rationale.
- [ ] Error and edge behavior covers failure handling and fallback expectations.
- [ ] Contract wording is specific enough for regeneration agents to reimplement intent.

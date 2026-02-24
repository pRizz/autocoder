# ART-0160: ui-src-components-agentcontrol-tsx

## Artifact Identity
- ART ID: ART-0160
- Path: ui/src/components/AgentControl.tsx
- Category: FRONTEND_SOURCE
- Contract Version: 1.0

## Purpose
Implements feature-facing UI behavior in `ui/src/components/AgentControl.tsx` for operator workflows, orchestration control, or status visualization. Primary symbols: AgentControl, handleStart, handleStop.

## Ownership
- Owns: UI rendering and interaction behavior encapsulated by this component.
- Does not own: backend persistence or unrelated domain orchestration concerns.

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
- ART-0155 `ui/src/App.tsx`: Primary composition and mounting context for component behavior.
- ART-0229 `ui/src/lib/types.ts`: Shared model/state types consumed by components.
- ART-0226 `ui/src/lib/api.ts`: API interaction contracts used by interactive components.

## Error and Edge Behavior
- Missing runtime dependencies, malformed payloads, or invalid state assumptions must surface explicit errors or guarded fallback UI states.
- Unexpected failures should preserve diagnosable logs/events so regeneration and debugging workflows can reproduce behavior deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0160` and `ui/src/components/AgentControl.tsx` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects describe concrete observable UI/config/test behavior.
- [ ] Direct dependencies include concrete `ART-####` references with role rationale.
- [ ] Error and edge behavior covers failure handling and fallback expectations.
- [ ] Contract wording is specific enough for regeneration agents to reimplement intent.

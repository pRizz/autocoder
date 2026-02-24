# ART-0216: ui-src-hooks-useassistantchat-ts

## Artifact Identity
- ART ID: ART-0216
- Path: ui/src/hooks/useAssistantChat.ts
- Category: FRONTEND_SOURCE
- Contract Version: 1.0

## Purpose
Implements reusable state/data-fetching/realtime hook behavior in `ui/src/hooks/useAssistantChat.ts` for frontend feature composition. Primary symbols: useAssistantChat, generateId, checkAndSend.

## Ownership
- Owns: state synchronization and side-effectful data/realtime behavior for a specific hook.
- Does not own: visual rendering concerns handled by components.

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
- ART-0226 `ui/src/lib/api.ts`: REST API request/response contract helpers.
- ART-0229 `ui/src/lib/types.ts`: Shared entity/event typing.
- ART-0225 `ui/src/hooks/useWebSocket.ts`: Realtime event stream integration.

## Error and Edge Behavior
- Missing runtime dependencies, malformed payloads, or invalid state assumptions must surface explicit errors or guarded fallback UI states.
- Unexpected failures should preserve diagnosable logs/events so regeneration and debugging workflows can reproduce behavior deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0216` and `ui/src/hooks/useAssistantChat.ts` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects describe concrete observable UI/config/test behavior.
- [ ] Direct dependencies include concrete `ART-####` references with role rationale.
- [ ] Error and edge behavior covers failure handling and fallback expectations.
- [ ] Contract wording is specific enough for regeneration agents to reimplement intent.

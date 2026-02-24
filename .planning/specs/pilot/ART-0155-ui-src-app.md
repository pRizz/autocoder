# ART-0155: ui-src-app

## Artifact Identity
- ART ID: ART-0155
- Path: ui/src/App.tsx
- Category: FRONTEND_SOURCE
- Contract Version: 1.0

## Purpose
Compose the primary AutoForge web UI shell, orchestrating project selection, feature views, realtime status integration, modal workflows, and keyboard shortcuts.

## Ownership
- Owns: root application layout, high-level state wiring, interaction orchestration across UI modules.
- Does not own: low-level API transport internals, backend persistence logic, individual component rendering details.

## Inputs
- React hook outputs (`useProjects`, `useFeatures`, `useAgentStatus`, `useProjectWebSocket`, etc.).
- User interactions (keyboard shortcuts, modal toggles, project selection).
- Local storage values for selected project and view mode persistence.

## Outputs
- Rendered root UI tree including header, board/graph views, controls, and modals.
- Triggered callbacks that invoke API/hook actions (start agent, toggle views, open dialogs).
- Persisted UI preference values written to browser local storage.

## Side Effects
- Registers and removes global keydown event listeners.
- Reads/writes local storage keys for project/view preferences.
- Drives periodic/reactive data fetching via query hooks and websocket updates.

## Direct Dependencies
- ART-0188 `ui/src/hooks/useProjects.ts`: project/feature/settings queries.
- ART-0196 `ui/src/hooks/useWebSocket.ts`: realtime state stream.
- ART-0172 `ui/src/components/KanbanBoard.tsx`: primary work visualization component.

## Error and Edge Behavior
- Guards local storage access with try/catch to handle browser restrictions.
- Handles absent project selection by disabling project-dependent actions.
- Closes stacked modals in escape-key priority order.

## Acceptance Checks
- [ ] Root orchestration responsibilities are documented separately from child component concerns.
- [ ] Input/output and side-effect sections capture persistence and event wiring behavior.
- [ ] Dependencies reference concrete hook/component artifacts used by the root app.

# ART-0147: ui-e2e-tooltip-spec-ts

## Artifact Identity
- ART ID: ART-0147
- Path: ui/e2e/tooltip.spec.ts
- Category: TEST
- Contract Version: 1.0

## Purpose
Defines end-to-end UI verification behavior in `ui/e2e/tooltip.spec.ts` to protect workflow parity and operator interactions. Primary symbols: selectProject.

## Ownership
- Owns: browser-level scenario assertions and test orchestration for targeted UI workflows.
- Does not own: production UI implementation logic.

## Inputs
- Playwright/browser context and configured test project runtime.
- User-flow fixtures, selectors, and backend responses visible to UI under test.
- Execution flags and environment supplied by test runners/CI.

## Outputs
- Pass/fail outcomes with scenario-level assertion evidence.
- Regression signal for operator-facing UI workflows and interactions.

## Side Effects
- Launches browser automation, drives UI flows, and records assertion outcomes.
- Emits test logs/traces used by CI and local regression workflows.

## Direct Dependencies
- ART-0151 `ui/playwright.config.ts`: Test runtime and browser project configuration.
- ART-0155 `ui/src/App.tsx`: Primary UI behavior under end-to-end test.

## Error and Edge Behavior
- Missing runtime dependencies, malformed payloads, or invalid state assumptions must surface explicit errors or guarded fallback UI states.
- Unexpected failures should preserve diagnosable logs/events so regeneration and debugging workflows can reproduce behavior deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0147` and `ui/e2e/tooltip.spec.ts` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects describe concrete observable UI/config/test behavior.
- [ ] Direct dependencies include concrete `ART-####` references with role rationale.
- [ ] Error and edge behavior covers failure handling and fallback expectations.
- [ ] Contract wording is specific enough for regeneration agents to reimplement intent.

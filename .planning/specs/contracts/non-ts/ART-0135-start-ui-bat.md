# ART-0135: start-ui-bat

## Artifact Identity
- ART ID: ART-0135
- Path: start_ui.bat
- Category: OPERATIONS_SCRIPT
- Contract Version: 1.0

## Purpose
Implements operational startup/control behavior in `start_ui.bat` for local runtime launch and environment preparation.

## Ownership
- Owns: operator startup orchestration and shell/python launcher control flow.
- Does not own: core API/UI business logic executed after startup.

## Inputs
- CLI args/shell environment and local tool availability checks.
- Project path/runtime configuration used to start backend/UI processes.
- Operator interaction and startup mode selections.

## Outputs
- Started/stopped runtime processes and operator-facing status output.
- Runtime environment setup effects used by backend/UI launch paths.

## Side Effects
- May spawn/terminate local processes and write startup status to terminal output.
- May create runtime setup artifacts or mutate environment-dependent launch state.

## Direct Dependencies
- ART-0133 `start.py`: Core launcher/runtime orchestration script.
- ART-0136 `start_ui.py`: UI startup and dev/prod backend startup flow.
- ART-0071 `README.md`: Operator-facing startup instructions and conventions.

## Error and Edge Behavior
- Missing files, invalid configuration, or stale references must be surfaced as explicit validation failures, not silent assumptions.
- Ambiguous policy/metadata states should be documented with deterministic fallback behavior so regeneration workflows remain reproducible.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0135` and `start_ui.bat` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects are concrete and category-appropriate for this artifact.
- [ ] Direct dependencies include concrete `ART-####` references with rationale.
- [ ] Error and edge behavior covers invalid-state handling and deterministic fallback expectations.
- [ ] Contract language is specific enough for regeneration workflows to reproduce intent.

# ART-0028: github-workflows-ci-yml

## Artifact Identity
- ART ID: ART-0028
- Path: .github/workflows/ci.yml
- Category: CI_AUTOMATION
- Contract Version: 1.0

## Purpose
Defines CI automation behavior in `.github/workflows/ci.yml` for repeatable lint/build/test verification flows.

## Ownership
- Owns: automation trigger/job/step semantics for CI validation workflows.
- Does not own: business logic implemented by runtime source files.

## Inputs
- Repository events (push/PR/manual triggers) and workflow environment context.
- Toolchain command definitions and test/lint/build scripts.
- Project files consumed by CI jobs and step conditions.

## Outputs
- Deterministic job execution outcomes (pass/fail) with workflow logs.
- Quality gate signal consumed by repository governance and release flow.

## Side Effects
- Triggers CI compute jobs and emits workflow logs/artifacts on repository events.
- Can block or permit merge/deploy flow based on quality gate outcomes.

## Direct Dependencies
- ART-0091 `package.json`: Root automation command and distribution scripts.
- ART-0150 `ui/package.json`: Frontend lint/build/test workflow commands.
- ART-0143 `test_security.py`: Backend test execution coverage in CI.

## Error and Edge Behavior
- Missing files, invalid configuration, or stale references must be surfaced as explicit validation failures, not silent assumptions.
- Ambiguous policy/metadata states should be documented with deterministic fallback behavior so regeneration workflows remain reproducible.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0028` and `.github/workflows/ci.yml` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects are concrete and category-appropriate for this artifact.
- [ ] Direct dependencies include concrete `ART-####` references with rationale.
- [ ] Error and edge behavior covers invalid-state handling and deterministic fallback expectations.
- [ ] Contract language is specific enough for regeneration workflows to reproduce intent.

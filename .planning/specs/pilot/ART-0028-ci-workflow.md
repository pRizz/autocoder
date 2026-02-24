# ART-0028: ci-workflow

## Artifact Identity
- ART ID: ART-0028
- Path: .github/workflows/ci.yml
- Category: CI_AUTOMATION
- Contract Version: 1.0

## Purpose
Define automated continuous integration checks for Python and UI subsystems on push/pull-request events.

## Ownership
- Owns: CI trigger definitions, job matrix boundaries, lint/test/build command execution in GitHub Actions.
- Does not own: local developer environment setup scripts or application runtime behavior.

## Inputs
- Repository events (`push`, `pull_request`) on `master`/`main` branches.
- Source files, dependency manifests, and toolchain versions in workflow steps.

## Outputs
- CI job pass/fail statuses for Python and UI pipelines.
- Lint/security/build verification results surfaced in GitHub checks.

## Side Effects
- Installs dependencies in ephemeral CI runners.
- Executes lint/test/build commands that may produce logs/artifacts within workflow runtime.
- Blocks merges when configured required checks fail.

## Direct Dependencies
- ART-0089 `requirements.txt`: python job dependency install source.
- ART-0150 `ui/package.json`: UI scripts invoked by lint/build steps.
- ART-0128 `test_security.py`: security test entrypoint executed in CI.

## Error and Edge Behavior
- Workflow failures can stem from upstream dependency/toolchain changes unrelated to code edits.
- Branch filter mismatches can prevent intended CI execution for new release branches.

## Acceptance Checks
- [ ] Trigger conditions and job boundaries are explicit.
- [ ] Inputs/outputs map to concrete repository artifacts and CI results.
- [ ] Side effects capture ephemeral install/test execution characteristics.

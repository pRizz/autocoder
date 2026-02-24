# ART-0139: test-client-py

## Artifact Identity
- ART ID: ART-0139
- Path: test_client.py
- Category: TEST
- Contract Version: 1.0

## Purpose
Defines backend regression and security assertions for `test_client.py` to protect behavior contracts during regeneration and migration. Primary symbols: TestConvertModelForVertex, TestExtraReadPathsBlocklist.

## Ownership
- Owns: test scenario definitions, fixtures, and assertions for targeted backend behaviors.
- Does not own: production runtime logic or API implementation decisions.

## Inputs
- Target module APIs invoked by test cases.
- Test fixtures, temporary filesystem state, and environment variable overrides.
- Pytest/unittest execution context and command-line flags.

## Outputs
- Pass/fail assertions and structured failure traces.
- Confidence signal for backend regression, safety, and contract correctness.

## Side Effects
- Executes assertions and may create temporary test data/filesystem state for isolated validation.
- Emits test runner output and failure traces consumed by CI/local workflows.

## Direct Dependencies
- ART-0082 `client.py`: Primary module under test.
- ART-0083 `env_constants.py`: Primary module under test.

## Error and Edge Behavior
- Invalid configuration, missing collaborators, or malformed inputs must surface explicit errors instead of silent fallback.
- Unexpected exceptions should be propagated/logged so orchestrators and callers can apply retry, abort, or remediation paths deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0139` and `test_client.py` in `.planning/specs/INVENTORY.md`.
- [ ] Purpose and ownership boundaries are explicit enough to separate responsibilities from adjacent modules.
- [ ] Inputs/outputs/side effects describe observable behavior, not implementation guesses.
- [ ] Direct dependency list includes concrete `ART-####` references with rationale.
- [ ] Error and edge behavior documents failure handling expectations used by regeneration agents.

# ART-0144: test-security-integration-py

## Artifact Identity
- ART ID: ART-0144
- Path: test_security_integration.py
- Category: TEST
- Contract Version: 1.0

## Purpose
Defines backend regression and security assertions for `test_security_integration.py` to protect behavior contracts during regeneration and migration. Primary symbols: temporary_home, test_blocked_command_via_hook, test_allowed_command_via_hook, test_non_allowed_command_via_hook, test_project_config_allows_command, test_pattern_matching, test_org_blocklist_enforcement, test_org_allowlist_inheritance.

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
- ART-0100 `security.py`: Primary module under test.
- ART-0078 `auth.py`: Primary module under test.

## Error and Edge Behavior
- Invalid configuration, missing collaborators, or malformed inputs must surface explicit errors instead of silent fallback.
- Unexpected exceptions should be propagated/logged so orchestrators and callers can apply retry, abort, or remediation paths deterministically.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0144` and `test_security_integration.py` in `.planning/specs/INVENTORY.md`.
- [ ] Purpose and ownership boundaries are explicit enough to separate responsibilities from adjacent modules.
- [ ] Inputs/outputs/side effects describe observable behavior, not implementation guesses.
- [ ] Direct dependency list includes concrete `ART-####` references with rationale.
- [ ] Error and edge behavior documents failure handling expectations used by regeneration agents.

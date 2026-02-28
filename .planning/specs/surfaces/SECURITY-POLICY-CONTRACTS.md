# Security Policy Contracts

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Requirement:** `SURF-05`

`SECURITY-POLICY-MATRIX.md` is the canonical completeness source for this contract set (`15/15` units).

## Contract Scope

- Defines command/path policy controls, trust boundaries, and runtime-safe defaults.
- Binds policy claims to concrete enforcement artifacts and security-focused tests.
- Anchored to `ART-0100`, `ART-0102`, `ART-0106`, `ART-0109`, `ART-0120`, `ART-0130`, `ART-0078`, and `ART-0096`.

## Command Safety Policy

### baseline command policy sets

- `ALLOWED_COMMANDS` defines the default executable surface for agent-driven bash usage.
- `BLOCKED_COMMANDS` defines hard-deny commands that remain blocked regardless of project context.
- `DANGEROUS_COMMANDS` are currently treated as blocked until explicit approval flow exists.
- `COMMANDS_NEEDING_EXTRA_VALIDATION` routes `pkill`, `chmod`, `init.sh`, and `playwright-cli` through stricter validators.

### hierarchical command resolution

- Effective command policy is derived from `get_effective_commands(project_dir)`:
  1. hardcoded blocked commands
  2. org-level blocked commands
  3. org-level allowed commands
  4. project-level allowed commands
- Blocked policy always wins over allowed policy.
- Bare wildcard (`*`) is rejected in pattern validation and command matching.

### command-specific validator contracts

- `validate_pkill_command(...)`: only allows default and configured process names, with strict token parsing.
- `validate_chmod_command(...)`: only permits execute-bit grant (`+x`) and disallows recursive flags.
- `validate_init_script(...)`: only permits `./init.sh` or explicit `.../init.sh` forms.
- `validate_playwright_command(...)`: blocks `playwright-cli run-code` and `playwright-cli eval`.

### hook enforcement behavior

- `bash_security_hook(...)` is the pre-tool-use policy gate.
- Every extracted command must satisfy both:
  - effective allowlist check (`is_command_allowed`), and
  - command-specific validator (when applicable).
- Any failed check returns `decision: block` with explicit reason; command execution is denied.

## Dev Server Policy Contracts

### structural dev command validation

- `validate_custom_command_strict(...)` enforces an allowlist of runners and safe command shapes.
- `BLOCKED_SHELLS` (`sh`, `bash`, `zsh`, `cmd`, `powershell`, `pwsh`, `cmd.exe`) are rejected.
- For Python commands:
  - `python -c` is blocked.
  - only approved module forms (`-m uvicorn/flask/gunicorn/http.server`) or script invocation are allowed.
- npm/pnpm/yarn commands are constrained to approved script names.

### runtime injection hardening

- Dev server manager rejects dangerous operators (`&&`, `||`, `;`, `|`, `` ` ``, `$(`, `&`, `>`, `<`, `^`, `%`).
- Newline and carriage-return injection are blocked.
- Commands execute via parsed argv with `shell=False`; direct shell runner invocations are rejected.

## Filesystem and Path Boundary Contracts

### sensitive and blocked path policy

- `SENSITIVE_DIRECTORIES` is canonical shared policy between filesystem browsing and command read-path validation.
- Platform blocked roots (Windows/macOS/Linux) plus sensitive home-relative paths are treated as restricted.
- Hidden credential-like name patterns (`.env`, `*.key`, `*.pem`, credentials/secrets patterns) are filtered in browsing.

### UNC/network path policy

- UNC/network paths are denied (`UNC` restrictions) for list/validate/create endpoints.
- Blocked path access returns explicit forbidden responses (`403` style semantics in router behavior).

## Identifier and Trust-Boundary Contracts

### project name validation

- `_PROJECT_NAME_RE` enforces `[a-zA-Z0-9_-]{1,50}`.
- REST handlers use `validate_project_name(...)` (HTTP 400 on violation).
- WebSocket handlers use boolean validation + explicit close behavior for invalid identifiers.

### localhost and remote-mode boundary

- `ALLOW_REMOTE` is opt-in via `AUTOFORGE_ALLOW_REMOTE` env setting.
- When `ALLOW_REMOTE` is false:
  - HTTP middleware requires localhost client origins.
  - CORS is limited to localhost UI origins.
- When `ALLOW_REMOTE` is true:
  - broader CORS is enabled and warning-level logging calls out increased exposure.

## Auth and Rate-Limit Policy Contracts

### auth detection and guidance

- `AUTH_ERROR_PATTERNS` detect login/authentication failures in CLI output.
- `is_auth_error(...)` normalizes case and pattern checks.
- Help messages (`AUTH_ERROR_HELP_*`) provide deterministic remediation guidance (`claude login`).

### rate limit detection and backoff policy

- `RATE_LIMIT_REGEX_PATTERNS` detect rate-limit semantics while avoiding known false positives.
- `parse_retry_after(...)` parses retry windows in second-based formats.
- `calculate_rate_limit_backoff(...)` applies exponential backoff with jitter.
- `calculate_error_backoff(...)` handles non-rate-limit retry intervals.
- `clamp_retry_delay(...)` bounds retry delays to safe runtime range.

## Security Test Evidence Contracts

- `ART-0141` (`test_devserver_security.py`) validates strict runner policy, injection blocking, and security constant sets.
- `ART-0142` (`test_rate_limit_utils.py`) validates rate-limit parsing, false-positive resistance, and backoff bounds.
- `ART-0143` (`test_security.py`) validates command parsing, policy hierarchy, validator behavior, and config loading constraints.
- `ART-0144` (`test_security_integration.py`) validates end-to-end hook behavior with real config contexts.

## Error and Edge Behavior

- Malformed command payloads and config structures fail safely (block/None return) instead of default-allow behavior.
- Invalid policy config entries are ignored/rejected with warning logs and do not expand allowed command scope.
- Path-resolution failures are treated as blocked access in filesystem guard paths.
- Policy violations return explicit reasons/messages for operator triage.

## Cross-References

- Completeness inventory: `SECURITY-POLICY-MATRIX.md`
- Lifecycle contracts: `PROCESS-LIFECYCLE-CONTRACTS.md`
- Data contracts: `DATA-PERSISTENCE-CONTRACTS.md`
- Existing transport context: `REST-API-CONTRACTS.md`, `WEBSOCKET-CONTRACTS.md`

## Acceptance Checks

| Check ID | Requirement | Assertion | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| SURF-05-AC-01 | SURF-05 | Security policy matrix count is exactly `15`. | Count `S##` rows in `SECURITY-POLICY-MATRIX.md`. | pass when 15 rows exist; fail otherwise. |
| SURF-05-AC-02 | SURF-05 | Matrix-to-contract parity is `15/15`. | Map each unit (`S01`..`S15`) to concrete policy clauses in this document. | pass when all units are represented with no omissions; fail on missing coverage. |
| SURF-05-AC-03 | SURF-05 | Command policy controls are complete. | Verify `ALLOWED_COMMANDS`, `BLOCKED_COMMANDS`, `DANGEROUS_COMMANDS`, command hierarchy, and validator clauses (`pkill`, `chmod`, `playwright-cli`, devserver strict validation). | pass when all command policy controls are documented; fail otherwise. |
| SURF-05-AC-04 | SURF-05 | Path and trust-boundary controls are complete. | Verify `SENSITIVE_DIRECTORIES`, `UNC` handling, project-name policy, and localhost/`ALLOW_REMOTE` trust-boundary behavior are documented. | pass when all path/boundary controls are explicit; fail otherwise. |
| SURF-05-AC-05 | SURF-05 | Security test linkage is explicit and complete. | Verify this contract references `ART-0141`, `ART-0142`, `ART-0143`, and `ART-0144` as evidence anchors. | pass when all four test anchors are linked; fail otherwise. |

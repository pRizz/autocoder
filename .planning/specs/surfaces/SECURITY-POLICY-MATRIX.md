# Security Policy Matrix

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Canonical completeness source for SURF-05**

Total contract units: **15**

## Coverage Rules

- Covers command/path constraints, trust boundaries, and safety defaults from policy/enforcement modules.
- Includes both policy-definition artifacts and enforcement/test evidence anchors.
- Excludes generic API payload contracts already captured in Phase 5 surface docs.

## Contract Unit Inventory

| Unit | Policy Concern | Enforcement Artifacts | Default Behavior | Escalation/Block Behavior | Test Evidence |
| --- | --- | --- | --- | --- | --- |
| S01 | Command extraction and segmentation | `ART-0100` | `extract_commands` + `split_command_segments` parse shell chains/pipes/operators | Unparseable command payloads are blocked fail-safe | `ART-0143`, `ART-0144` |
| S02 | Global command allow/block defaults | `ART-0100` | `ALLOWED_COMMANDS` baseline enables expected dev operations | `BLOCKED_COMMANDS` and `DANGEROUS_COMMANDS` cannot execute | `ART-0143`, `ART-0144` |
| S03 | Org/project command hierarchy | `ART-0100` | Hierarchy merges global + org + project policies | Blocklist precedence removes blocked commands from effective allowlist | `ART-0143`, `ART-0144` |
| S04 | Command pattern matching constraints | `ART-0100` | Exact and prefix patterns allowed (`swift*` style) | Bare wildcard `*` rejected as security risk | `ART-0143`, `ART-0144` |
| S05 | pkill target restriction policy | `ART-0100` | `DEFAULT_PKILL_PROCESSES` plus validated org/project `pkill_processes` | Non-allowed process names rejected; regex metacharacters disallowed | `ART-0143` |
| S06 | chmod scope restriction policy | `ART-0100` | Only `+x` mode variants for explicit file targets are allowed | Recursive/other mode operations are blocked | `ART-0143` |
| S07 | init script execution policy | `ART-0100` | Only `./init.sh` (or explicit init.sh path) is permitted | Alternate script execution paths rejected | `ART-0143` |
| S08 | playwright-cli subcommand policy | `ART-0100` | Safe playwright-cli subcommands remain available | `run-code` and `eval` blocked to prevent arbitrary code execution | `ART-0143` |
| S09 | Bash pre-tool-use enforcement | `ART-0100` | `bash_security_hook` evaluates every extracted command with hierarchy + extra validation | Any failed command check blocks whole command request with reason | `ART-0144` |
| S10 | Devserver command structure policy | `ART-0106` | `validate_custom_command_strict` enforces known runners and allowed script/module forms | Shell runners, `python -c`, disallowed npm scripts/modules/flags rejected | `ART-0141` |
| S11 | Devserver runtime command injection policy | `ART-0120` | Commands parsed as argv with `shell=False` | Dangerous operators/newlines/shell runners blocked before process spawn | `ART-0141` |
| S12 | Filesystem path boundary policy | `ART-0109`, `ART-0100` | Uses platform blocked roots + `SENSITIVE_DIRECTORIES` + hidden credential patterns | UNC/network paths and blocked directories return 403-style rejection | `ART-0143`, `ART-0144` |
| S13 | Project identifier policy | `ART-0130` | `_PROJECT_NAME_RE` allows `[a-zA-Z0-9_-]{1,50}` | Invalid names raise HTTP 400 (REST) or websocket close with policy code | `ART-0143` |
| S14 | Localhost trust boundary policy | `ART-0102` | Default mode restricts CORS + HTTP middleware to localhost clients | Non-local clients rejected when `ALLOW_REMOTE` is disabled; remote mode explicitly opt-in | `ART-0144` |
| S15 | Auth and rate-limit resilience policy | `ART-0078`, `ART-0096` | Auth errors detected via pattern matching; rate-limit parsing/backoff avoids aggressive retries | Auth issues produce guided remediation messaging; rate-limit delays clamp to safe bounds | `ART-0142`, `ART-0143` |

## References

- Detailed policy contracts: `SECURITY-POLICY-CONTRACTS.md`
- Lifecycle companion: `PROCESS-LIFECYCLE-CONTRACTS.md`
- Data companion: `DATA-PERSISTENCE-CONTRACTS.md`

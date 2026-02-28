# Phase 6: Surface Contracts (Data + Process + Security) - Research

**Researched:** 2026-02-24
**Domain:** Persistence, orchestration lifecycle, and security/policy surface specification
**Confidence:** HIGH

<user_constraints>
## User Constraints (active project context)

- Generate markdown/spec artifacts only; do not edit source implementation files.
- Preserve 1:1 behavioral parity intent for current runtime behavior.
- Keep traceability anchored to canonical inventory IDs (`ART-####`).
- Maintain downstream migration framing (pure TypeScript + Bun + SolidJS target) without changing current-surface truth capture.
</user_constraints>

<research_summary>
## Summary

Phase 6 should capture the non-HTTP/non-WebSocket behavioral surface that still defines product parity:
1. Persistence/data contracts (schemas, migrations, transaction/lifecycle rules)
2. Process/session orchestration contracts (start/stop/retry/lock/cleanup semantics)
3. Security/policy contracts (command/path constraints, trust boundaries, safe defaults)

Observed implementation anchors:
- Data/persistence:
  - `api/database.py` (`ART-0075`) defines `features`, `schedules`, `schedule_overrides`, migrations, journal-mode selection (`WAL` vs `DELETE`), `busy_timeout`, and `BEGIN IMMEDIATE` transaction hooks.
  - `api/migration.py` (`ART-0077`) defines JSON->SQLite migration/backup behavior.
  - `server/services/assistant_database.py` (`ART-0118`) defines per-project assistant persistence (`conversations`, `conversation_messages`) with engine cache/disposal lifecycle.
- Process/lifecycle:
  - `server/services/process_manager.py` (`ART-0122`) defines agent lifecycle states (`stopped`, `running`, `paused`, `crashed`, `pausing`, `paused_graceful`), lock behavior, graceful pause/resume, and stale-work cleanup.
  - `server/services/scheduler_service.py` (`ART-0124`) defines UTC schedule start/stop jobs, midnight-crossing handling, manual overrides, and crash retry/backoff.
  - `server/services/dev_server_manager.py` (`ART-0120`) and `server/services/terminal_manager.py` (`ART-0126`) define devserver and PTY lifecycle semantics.
  - Session services (`ART-0117`, `ART-0121`, `ART-0125`) define conversational lifecycle behavior for assistant/spec/expand flows.
- Security/policy:
  - `security.py` (`ART-0100`) defines allowlist/blocklist policy hierarchy, command parsing, and command-specific validators.
  - `server/routers/devserver.py` (`ART-0106`) and `server/services/dev_server_manager.py` (`ART-0120`) enforce strict dev command policy and metacharacter blocking.
  - `server/routers/filesystem.py` (`ART-0109`) applies path/UNC/sensitive-directory restrictions.
  - `server/main.py` (`ART-0102`) defines localhost trust boundary behavior when remote mode is disabled.
  - `auth.py` (`ART-0078`), `rate_limit_utils.py` (`ART-0096`), `server/utils/validation.py` (`ART-0130`) provide auth-error, rate-limit, and naming policy primitives.

**Primary recommendation:** execute Phase 6 in three parallel contract lanes (data/process/security), then close with a consistency pass that updates traceability + acceptance + index artifacts and binds SURF-03/04/05 to objective pass/fail checks.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Artifact/Tool | Purpose | Why |
|---------------|---------|-----|
| Surface matrix docs (lane-specific) | Deterministic inventory of contract units | Prevents omissions and enables row-count parity checks |
| Lane contract docs | Authoritative behavior/spec semantics | Regeneration-grade source of truth |
| `rg` + shell assertions | Fast structural verification | Reproducible pass/fail for execution agents |

### Supporting
| Artifact | Purpose |
|----------|---------|
| `.planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md` | Canonical ART mapping source for linkage |
| `.planning/specs/surfaces/SURFACE-TRACEABILITY.md` | Existing Phase 5 linkage baseline |
| `.planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md` | Existing requirement-linked gate baseline |
| Security and lifecycle tests (`ART-0141`..`ART-0144`, `ART-0142`) | Objective policy behavior evidence |

No new runtime dependencies are needed for Phase 6 planning/execution.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Matrix-first lane capture
For each lane, create a canonical matrix before narrative contracts:
- Data lane: schema + migration + transaction/lifecycle units
- Process lane: component lifecycle/state-machine units
- Security lane: policy/enforcement/trust-boundary units

### Pattern 2: Behavior-first contracts
Document observable guarantees, not code internals:
- input validation constraints
- state transition semantics
- failure/edge behavior
- cleanup/recovery rules

### Pattern 3: Contract unit parity checks
Each lane should include explicit matrix-to-contract parity checks:
- data lane target: 12/12 units
- process lane target: 12/12 units
- security lane target: 15/15 units

### Pattern 4: Cross-surface closure
Final pass should tie Phase 6 outputs to:
- Phase 5 API/WebSocket contracts
- Phase 4 file contracts (`ART-####`)
- SURF-03/04/05 pass/fail acceptance criteria
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Data contract fidelity | Generic database summaries | Explicit schema/migration/transaction lifecycle contract units |
| Process lifecycle clarity | Route-only descriptions | Service-level lifecycle and state-transition contracts |
| Security confidence | Policy claims without evidence | Policy docs tied to enforcement points + tests |
| Phase closure | Isolated lane docs | Cross-contract consistency + acceptance-link updates |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Treating persistence as only table schemas
Migration triggers, transaction mode (`BEGIN IMMEDIATE`), journal mode selection, and backup behavior are also part of the persistence surface.

### Pitfall 2: Missing graceful/exception lifecycle paths
Process surfaces include crash, lock cleanup, drain-mode pause/resume, and orphan lock handling, not only start/stop happy paths.

### Pitfall 3: Security policy detached from runtime gates
Policy documents must point to concrete enforcement points (router/service validation, middleware boundaries, filesystem guards) and tests.

### Pitfall 4: No cross-surface consistency gate
Without a final consistency pass, Phase 6 can drift from Phase 5 traceability/acceptance structures and reduce downstream executability.
</common_pitfalls>

<code_examples>
## Code Examples

### Data/persistence anchor discovery
```bash
rg -n "class (Feature|Schedule|ScheduleOverride)|BEGIN IMMEDIATE|journal_mode|busy_timeout|ALTER TABLE|feature_list.json" api/database.py api/migration.py
rg -n "class (Conversation|ConversationMessage)|get_engine|dispose_engine|get_session|create_conversation|add_message" server/services/assistant_database.py
```

### Process lifecycle anchor discovery
```bash
rg -n "status|start\\(|stop\\(|pause\\(|resume\\(|graceful|healthcheck|lock|cleanup|crash" server/services/process_manager.py server/services/dev_server_manager.py server/services/scheduler_service.py server/services/terminal_manager.py
```

### Security/policy anchor discovery
```bash
rg -n "ALLOWED_COMMANDS|BLOCKED_COMMANDS|DANGEROUS_COMMANDS|validate_|bash_security_hook|SENSITIVE_DIRECTORIES" security.py
rg -n "validate_custom_command_strict|validate_dev_command|BLOCKED_SHELLS" server/routers/devserver.py
rg -n "is_path_blocked|is_unc_path|SENSITIVE_DIRECTORIES|require_localhost|ALLOW_REMOTE" server/routers/filesystem.py server/main.py
```

### Docs-only guardrail
```bash
git diff --name-only | rg -v '^\.planning/'
```
</code_examples>

<open_questions>
## Open Questions

1. Should process lane contracts include chat-session prompt/skill details, or only lifecycle/cleanup semantics? Recommendation: include lifecycle/cleanup semantics as must-have, treat prompt content as supporting context.
2. Should security lane include both policy logic and test assertions in one contract corpus? Recommendation: yes; test anchors are required evidence for safe-default claims.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/ROADMAP.md` (Phase 6 goal/requirements/plans)
- `.planning/REQUIREMENTS.md` (`SURF-03`, `SURF-04`, `SURF-05`)
- `.planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md`
- `api/database.py` (`ART-0075`)
- `api/migration.py` (`ART-0077`)
- `server/services/assistant_database.py` (`ART-0118`)
- `server/services/process_manager.py` (`ART-0122`)
- `server/services/scheduler_service.py` (`ART-0124`)
- `server/services/dev_server_manager.py` (`ART-0120`)
- `server/services/terminal_manager.py` (`ART-0126`)
- `security.py` (`ART-0100`)
- `server/routers/devserver.py` (`ART-0106`)
- `server/routers/filesystem.py` (`ART-0109`)
- `server/main.py` (`ART-0102`)
- `auth.py` (`ART-0078`)
- `rate_limit_utils.py` (`ART-0096`)
- `server/utils/validation.py` (`ART-0130`)
- `test_devserver_security.py` (`ART-0141`)
- `test_rate_limit_utils.py` (`ART-0142`)
- `test_security.py` (`ART-0143`)
- `test_security_integration.py` (`ART-0144`)

### Secondary (MEDIUM confidence)
- `.planning/specs/surfaces/SURFACE-TRACEABILITY.md` (Phase 5 baseline)
- `.planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md` (Phase 5 gate baseline)
</sources>

<metadata>
## Metadata

**Research scope:**
- Persistence/schema/migration/lifecycle contract boundaries
- Process/session orchestration lifecycle boundaries
- Security/policy/trust-boundary contract boundaries
- Cross-contract closure strategy for SURF-03/04/05

**Confidence breakdown:**
- Data lane planning confidence: HIGH
- Process lane planning confidence: HIGH
- Security lane planning confidence: HIGH
- Cross-contract closure confidence: HIGH

**Research date:** 2026-02-24
**Valid until:** 2026-03-25
</metadata>

---

*Phase: 06-surface-contracts-data-process-security*
*Research completed: 2026-02-24*
*Ready for planning: yes*

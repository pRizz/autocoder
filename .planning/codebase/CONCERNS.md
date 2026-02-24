# Codebase Concerns

**Analysis Date:** 2026-02-24

## Tech Debt

**Large Multi-Responsibility Modules:**
- Issue: Several critical files are very large and combine orchestration + policy + IO concerns.
- Files: `parallel_orchestrator.py` (~1870 lines), `security.py` (~996), `server/websocket.py` (~939), `server/services/process_manager.py` (~829), `server/routers/features.py` (~821), `prompts.py` (~818).
- Impact: Onboarding and safe refactoring are harder; behavior changes can have wide side effects.
- Fix approach: Extract domain-specific helpers (state transitions, persistence adapters, message formatting, command parsing) into smaller modules with tighter tests.

**Import Boundary Workarounds:**
- Issue: `sys.path` mutation appears in multiple modules for runtime compatibility.
- Files: `client.py`, `server/services/process_manager.py`, `server/routers/devserver.py`, `mcp_server/feature_mcp.py`.
- Impact: Packaging/import behavior is fragile and harder to reason about across execution contexts.
- Fix approach: Normalize package layout and invocation paths to remove path injection.

## Known Bugs

**No Confirmed Reproducible Product Bugs Recorded In-Repo:**
- Observation: Repository does not maintain a dedicated known-issues list; existing tests focus on prevention of prior classes of failures.
- Risk: Operational issues may be rediscovered without a centralized bug ledger.
- Suggested action: Maintain a tracked issue list (or `.planning` concern register) tied to test coverage additions.

## Security Considerations

**Remote Exposure Switch Is High-Risk By Design:**
- Risk: `AUTOFORGE_ALLOW_REMOTE` disables localhost-only restriction and opens terminal WebSocket surface to remote clients.
- Files: `server/main.py`, terminal endpoint in `server/routers/terminal.py`.
- Current mitigation: Explicit warning logs, command allowlist, filesystem blocklists.
- Recommendation: Keep default local-only posture and pair remote mode with network-level controls (VPN/firewall/reverse proxy auth).

**Command Validation Complexity:**
- Risk: Command allowlist logic is broad and evolving; regressions could allow unsafe command forms.
- Files: `security.py`, `server/routers/devserver.py`, tests `test_security*.py`, `test_devserver_security.py`.
- Recommendation: Continue aggressive negative-case testing and consider policy simplification by command family.

## Performance Bottlenecks

**SQLite Contention Under Parallel Activity:**
- Problem: Multiple managers/processes and schedule handlers share SQLite files during concurrent orchestration.
- Files: `api/database.py`, `registry.py`, `parallel_orchestrator.py`, `server/services/scheduler_service.py`.
- Symptoms: Potential lock retries and throughput ceilings under high concurrency.
- Improvement path: Keep transaction windows tight, expand lock/retry telemetry, and consider DB backend abstraction if scaling beyond local workloads.

**High-Volume WebSocket/Event Traffic:**
- Problem: Frequent logs/status updates can create noisy streams and UI rendering overhead.
- Files: `server/websocket.py`, `ui/src/hooks/useWebSocket.ts`, `ui/src/components/DebugLogViewer.tsx`.
- Improvement path: Coalesce updates, add sampling/rate controls for verbose channels, and persist only actionable summaries.

## Fragile Areas

**Lock File + PID Lifecycle Handling:**
- Why fragile: Correct behavior depends on cross-platform process inspection, PID reuse checks, and cleanup timing.
- Files: `server/services/process_manager.py`, `server/services/dev_server_manager.py`, `autoforge_paths.py`.
- Failure mode: Stale locks can block starts or orphan process resources.

**Schema Migration in Long-Lived Projects:**
- Why fragile: Live project data needs safe migration across legacy file layouts and incremental DB schema changes.
- Files: `api/database.py`, `api/migration.py`, `autoforge_paths.py`, `registry.py`.
- Failure mode: Partial migrations or silent fallback behavior can mask structural drift.

## Scaling Limits

**Control Plane Capacity:**
- Current profile: Designed for local/operator-managed projects with small-to-moderate concurrency (1-5 coding agents + optional testing ratio).
- Limit symptoms: Increased DB locks, WebSocket saturation, and degraded UI responsiveness as projects and agent streams grow.
- Scaling path: Externalized queue/storage/telemetry and process isolation beyond single-host assumptions.

## Dependencies at Risk

**Fast-Moving Upstream SDK/Model Surface:**
- Risk: `claude-agent-sdk` and model IDs/providers evolve quickly; CLI/SDK protocol changes can affect session parsing and auth flows.
- Files: `requirements*.txt`, `agent.py`, `client.py`, `registry.py`.
- Mitigation: Maintain compatibility tests for message parsing, model validation, and provider env forwarding.

**Frontend Dependency Breadth:**
- Risk: Large set of UI libraries (Radix, graphing, terminal, markdown) increases update and bundle-risk surface.
- Files: `ui/package.json`, `ui/vite.config.ts`.
- Mitigation: Keep dependency review discipline and monitor bundle chunk growth.

## Missing Critical Features

**No First-Class API/Router Integration Test Harness:**
- Problem: Many route/service interactions are not covered by end-to-end backend tests through FastAPI app boundaries.
- Impact: Regressions in serialization, status codes, and service wiring may slip past targeted unit tests.
- Complexity: Medium (requires shared fixtures + test app lifecycle setup).

**Limited Automated Coverage For Orchestrator Happy/Failure Paths:**
- Problem: Orchestrator behavior is complex but mostly validated indirectly.
- Impact: Concurrency/race regressions can be hard to catch before runtime.
- Complexity: Medium-high (needs deterministic fixtures and subprocess/test doubles).

## Test Coverage Gaps

**WebSocket Contract Robustness:**
- Untested area: End-to-end validation of event ordering, reconnection behavior, and high-volume message handling.
- Risk: UI state drift or dropped events in edge conditions.
- Priority: High.

**Terminal/Devserver Interactive Flows:**
- Untested area: Full lifecycle across create/connect/input/resize/disconnect/reconnect sequences.
- Risk: Session leaks and inconsistent terminal UX.
- Priority: Medium-high.

**Scheduler Window/Override Edge Cases:**
- Untested area: DST boundaries, overlapping windows, and crash-recovery retries across restart boundaries.
- Risk: Unexpected auto-start/stop behavior.
- Priority: Medium.

---

*Concerns audit: 2026-02-24*
*Update as debt is reduced, gaps are tested, and operational limits evolve*

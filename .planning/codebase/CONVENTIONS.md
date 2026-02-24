# Coding Conventions

**Analysis Date:** 2026-02-24

## Naming Patterns

**Files:**
- Python modules are `snake_case.py` (`server/services/process_manager.py`, `api/dependency_resolver.py`).
- React components are `PascalCase.tsx` (`ui/src/components/ProjectSelector.tsx`).
- React hooks follow `useXxx.ts` naming (`ui/src/hooks/useWebSocket.ts`).

**Functions/Methods:**
- Python functions and methods use `snake_case`; async handlers are explicit with `async def` in routers/services.
- TypeScript functions use `camelCase`; React handlers tend to use `handleX` style.

**Types/Classes:**
- Python classes use `PascalCase` (`AgentProcessManager`, `SchedulerService`).
- TS interfaces/types use `PascalCase` in `ui/src/lib/types.ts`.

## Code Style

**Python:**
- Ruff line-length configured at 120 (`pyproject.toml`).
- Type hints are common in newer modules, but mixed strictness across legacy files.
- Extensive module/class/function docstrings are used throughout core Python files.

**TypeScript/React:**
- Functional components + hooks pattern.
- Existing code style favors no semicolons and 2-space indentation in UI files.
- ESLint + TypeScript rules configured in `ui/eslint.config.js`.

## Import Organization

**Python Import Pattern:**
- Standard library first, then third-party, then project-local imports.
- Several modules intentionally modify `sys.path` for cross-module import compatibility in subprocess contexts (`client.py`, `server/services/*`, `mcp_server/feature_mcp.py`).

**TypeScript Import Pattern:**
- External packages first, then local relative/alias imports.
- Alias `@` resolves to `ui/src` via `ui/vite.config.ts`.

## Error Handling

**Patterns:**
- Router boundaries convert expected failures to `HTTPException` and log unexpected failures.
- Long-running managers use broad `try/except Exception` to keep control plane alive.
- Retry/backoff behavior is centralized for rate-limit and transient failures (`rate_limit_utils.py`).

**Tradeoff:**
- High resiliency during long sessions, but broad catches can hide root causes unless logs are inspected.

## Logging

**Framework:**
- Python `logging` module with per-module loggers (`logger = logging.getLogger(__name__)`).

**Patterns:**
- State transition and subprocess lifecycle logs in managers/orchestrator.
- Warnings for recoverable faults; exceptions logged with stack traces in error paths.
- UI consumes streamed logs via WebSocket rather than writing browser-side log files.

## Comments

**When Comments Are Used:**
- Why-focused comments around security constraints, migration behavior, and platform-specific branches.
- Docstring-heavy public APIs and modules in Python.

**Inline Comment Density:**
- Moderate to high in orchestration/service code where race conditions or platform constraints exist.
- Low in many UI files where component logic is self-describing.

## Function Design

**Observed Patterns:**
- Boundary functions in routers/services are small-to-medium and delegate to helpers/managers.
- Core orchestrator/session modules contain large multi-responsibility functions (`parallel_orchestrator.py`, `agent.py`).
- Guard clauses are common in validation-heavy paths (router input checks, command validation).

## Module Design

**Current Structure:**
- Clear domain split between `server/routers` (transport), `server/services` (stateful logic), and `api` (shared persistence/domain).
- Shared schema contracts are centralized in `server/schemas.py`.
- Frontend uses hook + component layering with shared API/types modules.

**Known Deviations:**
- Some root-level utility modules (`security.py`, `registry.py`, `prompts.py`) are cross-cutting and large.
- `sys.path` mutation indicates packaging/import boundaries are pragmatic rather than strict.

---

*Convention analysis: 2026-02-24*
*Update when lint rules, module boundaries, or coding patterns materially change*

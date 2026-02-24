# Architecture

**Analysis Date:** 2026-02-24

## Pattern Overview

**Overall:** Local-first monolithic control plane with autonomous agent workers.

**Key Characteristics:**
- Python core orchestrates lifecycle, concurrency, scheduling, and persistence.
- FastAPI backend exposes REST + WebSocket APIs for UI and control surfaces.
- React SPA provides operational dashboard, terminal access, scheduling UI, and assistant/chat tooling.
- Agent execution uses subprocess isolation and MCP tool contracts rather than in-process plugin calls.

## Layers

**Launcher/Bootstrap Layer:**
- Purpose: Environment checks, venv/npm setup, startup mode selection.
- Key files: `start.py`, `start_ui.py`, `start.sh`, `start_ui.sh`, `bin/autoforge.js`.
- Depends on: registry, prompt scaffolding, subprocess shell commands.

**Orchestration Layer:**
- Purpose: Autonomous run loop, parallel feature execution, assignment, retries, and session control.
- Key files: `parallel_orchestrator.py`, `agent.py`, `autonomous_agent_demo.py`.
- Depends on: feature DB, process managers, prompt generation, Claude SDK client.

**Persistence & Domain Layer:**
- Purpose: Feature/schedule/conversation models plus dependency resolution and migrations.
- Key files: `api/database.py`, `api/dependency_resolver.py`, `api/migration.py`, `registry.py`, `server/services/assistant_database.py`.
- Depends on: SQLite + SQLAlchemy.

**API/Service Layer:**
- Purpose: Project/feature/schedule/devserver/terminal/assistant/spec/expand endpoints and long-lived service managers.
- Key files: `server/main.py`, `server/routers/*.py`, `server/services/*.py`, `server/websocket.py`.
- Depends on: orchestration + persistence layers.

**UI Layer:**
- Purpose: Operator UX for controlling projects and observing autonomous activity.
- Key files: `ui/src/App.tsx`, `ui/src/hooks/*`, `ui/src/components/*`, `ui/src/lib/api.ts`.
- Depends on: REST/WebSocket endpoints and typed schemas.

## Data Flow

**Primary UI-Controlled Execution Flow:**
1. User starts backend via `start_ui.py` (optionally plus Vite dev server).
2. Frontend selects a project and calls REST routes under `/api/projects/...`.
3. `server/routers/agent.py` delegates process lifecycle to `server/services/process_manager.py`.
4. Subprocess launches `autonomous_agent_demo.py`, which enters orchestration/agent loop.
5. Agent processes interact with feature state through MCP tools (`mcp_server/feature_mcp.py`) and SQLite.
6. Progress/log/state events are broadcast by `server/websocket.py` to UI hooks.

**CLI-Only Flow:**
1. `start.py` scaffolds/loads project, prompts, and registration.
2. CLI launches `autonomous_agent_demo.py` directly.
3. Progress and retries happen in terminal output without web UI requirements.

## Key Abstractions

**Process Managers:**
- `AgentProcessManager` and `DevServerProcessManager` encapsulate subprocess lifecycle, callbacks, lock files, and sanitization (`server/services/process_manager.py`, `server/services/dev_server_manager.py`).

**ParallelOrchestrator:**
- Core control object coordinating coding/testing workers, batches, feature claiming, and result handling (`parallel_orchestrator.py`).

**Feature Domain + Dependency Graph:**
- `Feature` model, `Schedule` models, and dependency utilities govern work ordering and blocking (`api/database.py`, `api/dependency_resolver.py`).

**Session Managers:**
- Dedicated chat session services for assistant/spec/expand workflows manage Claude SDK clients and streaming (`server/services/assistant_chat_session.py`, `server/services/spec_chat_session.py`, `server/services/expand_chat_session.py`).

## Entry Points

**CLI Entry:**
- npm bin: `bin/autoforge.js` and bootstrap `lib/cli.js`.
- Python CLI menu: `start.py`.

**Backend Entry:**
- FastAPI app: `server/main.py`.

**Agent Runtime Entry:**
- Autonomous process: `autonomous_agent_demo.py`.

**MCP Tooling Entry:**
- Feature tool server: `mcp_server/feature_mcp.py`.

**Frontend Entry:**
- React mount: `ui/src/main.tsx`.

## Error Handling

**Strategy:** Catch and recover at subsystem boundaries, escalate user-facing errors via HTTP/WebSocket messages.

**Patterns:**
- Router-level `HTTPException` for validation/not-found and generic 500 fallback in catch blocks.
- Extensive `try/except Exception` usage in long-running process/session services to keep server alive.
- Retry/backoff helpers for rate limiting and transient failures (`rate_limit_utils.py`).

## Cross-Cutting Concerns

**Security:**
- Command allowlist and shell validation in `security.py`.
- Filesystem and path restrictions in `server/routers/filesystem.py` and `client.py`.
- Explicit warning path when enabling remote access (`AUTOFORGE_ALLOW_REMOTE`) in `server/main.py`.

**Path Compatibility/Migration:**
- Tri-path support and migration from legacy `.autocoder`/root layouts to `.autoforge` (`autoforge_paths.py`).

**Observability:**
- Centralized logging plus WebSocket activity feed/orchestrator status events (`server/websocket.py`, `ui/src/hooks/useWebSocket.ts`).

---

*Architecture analysis: 2026-02-24*
*Update when orchestration pattern, API boundaries, or lifecycle flow changes*

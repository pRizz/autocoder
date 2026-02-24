# Technology Stack

**Analysis Date:** 2026-02-24

## Languages

**Primary:**
- Python 3.11+ for orchestration, backend API, CLI launchers, MCP tools, and persistence logic (`agent.py`, `parallel_orchestrator.py`, `server/main.py`, `mcp_server/feature_mcp.py`).
- TypeScript for the web UI and browser-side integration code (`ui/src/App.tsx`, `ui/src/hooks/*.ts`, `ui/src/components/*.tsx`).

**Secondary:**
- JavaScript (ESM) for npm CLI bootstrap and packaging (`bin/autoforge.js`, `lib/cli.js`, root `package.json`).
- YAML/Markdown/XML-like spec documents for workflow and prompt assets (`.claude/`, `examples/`, generated `.autoforge/prompts/app_spec.txt`).

## Runtime

**Environment:**
- Node.js >=20 required by CLI packaging and UI toolchain (root `package.json`, `ui/package.json`).
- Python 3.11 required by backend/runtime checks (`README.md`, `pyproject.toml`, `requirements*.txt`).
- Browser runtime for React SPA served by Vite in dev and FastAPI static files in production (`ui/vite.config.ts`, `server/main.py`).

**Package Managers:**
- npm for Node/UI dependencies and distribution workflows (`package.json`, `ui/package-lock.json`).
- pip for Python dependencies; no lockfile currently in repo (`requirements.txt`, `requirements-prod.txt`).

## Frameworks

**Backend/Core:**
- FastAPI + Pydantic for REST/WebSocket API and schema validation (`server/main.py`, `server/routers/*.py`, `server/schemas.py`).
- SQLAlchemy for SQLite ORM and migrations (`api/database.py`, `registry.py`, `server/services/assistant_database.py`).
- APScheduler for scheduled start/stop orchestration (`server/services/scheduler_service.py`).

**Autonomous Agent Layer:**
- `claude-agent-sdk` for agent and chat sessions (`agent.py`, `client.py`, `server/services/*_chat_session.py`).
- FastMCP for feature tool server (`mcp_server/feature_mcp.py`).

**Frontend:**
- React 19 + TypeScript + Vite (`ui/src/main.tsx`, `ui/vite.config.ts`).
- TanStack Query for client-side data fetching/state (`ui/src/hooks/useProjects.ts`, `ui/src/hooks/useSchedules.ts`).
- Radix UI primitives + Tailwind-based styling stack (`ui/src/components/ui/*`, `ui/src/styles/globals.css`).

## Key Dependencies

**Critical Runtime Dependencies:**
- `claude-agent-sdk` for all Claude session interactions and tool use.
- `fastapi`, `uvicorn`, `websockets` for backend API/WebSocket surface.
- `sqlalchemy` for project/feature/schedule/conversation persistence.
- `apscheduler` for automated schedule windows and crash-recovery scheduling.
- `psutil` for process control and lock/PID lifecycle handling.

**Critical Frontend Dependencies:**
- `react`, `react-dom`, `@tanstack/react-query` for app shell/data updates.
- `@xyflow/react` + `dagre` for dependency graph rendering.
- `@xterm/xterm` + addons for terminal streaming in UI.
- `@playwright/test` for UI e2e coverage (`ui/e2e/*`).

## Configuration

**Environment:**
- API/provider and model overrides are env-driven and centrally whitelisted (`env_constants.py`, `.env.example`, `registry.py`).
- Security/behavior toggles include `AUTOFORGE_ALLOW_REMOTE`, `EXTRA_READ_PATHS`, and provider/model vars.

**Tooling Configuration:**
- Python lint/type configs in `pyproject.toml` (Ruff + mypy).
- UI lint/build/test config in `ui/eslint.config.js`, `ui/vite.config.ts`, `ui/playwright.config.ts`.
- CI workflow in `.github/workflows/ci.yml`.

## Platform Requirements

**Development:**
- macOS/Linux/Windows supported with explicit platform branches for shell/PTY/path handling (`start_ui.py`, `server/services/terminal_manager.py`, `server/routers/filesystem.py`).
- Local Claude CLI auth is expected for default mode (`auth.py`, `start.py`, `README.md`).

**Production/Distribution:**
- Published as npm package `autoforge-ai` with bundled Python/JS assets (`package.json` `files` list).
- Runtime is single-host, process-managed architecture with per-project SQLite databases, not a distributed service.

---

*Stack analysis: 2026-02-24*
*Update after runtime, framework, or dependency changes*

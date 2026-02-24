# Codebase Structure

**Analysis Date:** 2026-02-24

## Directory Layout

```text
autocoder/
├── api/                    # Shared DB models, dependency logic, migrations
├── server/                 # FastAPI app, routers, services, websocket layer
│   ├── routers/
│   ├── services/
│   └── utils/
├── mcp_server/             # Feature MCP tool server
├── ui/                     # React/Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   ├── e2e/
│   └── public/
├── .claude/                # Claude commands, templates, local skills/agents
├── bin/                    # npm CLI entrypoint wrappers
├── lib/                    # npm bootstrap helper(s)
├── examples/               # Example config files
├── start.py                # CLI launcher
├── start_ui.py             # UI launcher/setup
├── autonomous_agent_demo.py
├── parallel_orchestrator.py
└── test_*.py               # Backend/unit/integration test files
```

## Directory Purposes

**api/**
- Purpose: Core persistence and dependency-domain logic shared by server, orchestrator, and MCP server.
- Key files: `api/database.py`, `api/dependency_resolver.py`, `api/migration.py`.

**server/routers/**
- Purpose: HTTP/WebSocket endpoint definitions grouped by domain.
- High-density modules: `server/routers/features.py` (feature CRUD/dependencies), `server/routers/projects.py` (project lifecycle).

**server/services/**
- Purpose: Long-running managers and stateful service abstractions.
- Key files: `process_manager.py`, `dev_server_manager.py`, `scheduler_service.py`, `terminal_manager.py`, chat session services.

**ui/src/components/**
- Purpose: Operational dashboard UI, assistant/spec/expand modals, terminal and graph views.
- Large components: `Terminal.tsx`, `DebugLogViewer.tsx`, `SpecCreationChat.tsx`, `SettingsModal.tsx`.

**ui/src/hooks/**
- Purpose: API query/mutation hooks and WebSocket connection state management.
- Core hooks: `useProjects.ts`, `useWebSocket.ts`, `useSpecChat.ts`, `useAssistantChat.ts`.

## Key File Locations

**Entry Points:**
- `start.py` - CLI-first workflow.
- `start_ui.py` - setup + backend launch + optional Vite dev mode.
- `server/main.py` - backend app initialization.
- `ui/src/main.tsx` - frontend bootstrap.

**Orchestration Core:**
- `parallel_orchestrator.py` - parallel worker strategy and loop.
- `agent.py` - Claude session loop and prompt selection.
- `autonomous_agent_demo.py` - argument parsing, mode routing, orchestration entry.

**Persistence & Configuration:**
- `api/database.py` - feature/schedule schema and migrations.
- `registry.py` - global project + settings registry in `~/.autoforge/registry.db`.
- `autoforge_paths.py` - location resolution/migration for per-project runtime files.

**Security & Validation:**
- `security.py` - command parsing/allowlist/hook logic.
- `server/routers/devserver.py` - strict dev command allowlist.
- `server/routers/filesystem.py` - blocked path/hide rules.

## Naming Conventions

**Python:**
- Modules and functions use `snake_case`.
- Classes use `PascalCase`.
- Top-level tests commonly use `test_*.py` at repository root.

**TypeScript/React:**
- Components use `PascalCase.tsx`.
- Hooks use `use*.ts`.
- Shared utilities/types in `ui/src/lib/`.

**Project Assets:**
- Prompt and command docs are markdown under `.claude/`.
- Runtime artifacts in `.autoforge/` (per project) are intentionally hidden files.

## Where to Add New Code

**New Backend API Domain:**
- Route definitions: `server/routers/{domain}.py`.
- Service manager logic: `server/services/{domain}_*.py`.
- Schema updates: `server/schemas.py`.

**New Feature Domain Logic:**
- Persistence or algorithm updates: `api/`.
- MCP tool exposure for agents: `mcp_server/feature_mcp.py` or new MCP server module.

**New Frontend Feature:**
- Data layer: `ui/src/hooks/` and `ui/src/lib/api.ts`.
- Presentation: `ui/src/components/`.
- Shared types: `ui/src/lib/types.ts`.

**New CLI/Bootstrap Behavior:**
- CLI script behavior: `start.py`, `start_ui.py`.
- npm command wrapper: `bin/autoforge.js`, `lib/cli.js`.

## Special Directories

**.autoforge/** (generated per managed project)
- Purpose: Runtime DBs, lock files, prompt files, temporary settings.
- Source: created/migrated by `autoforge_paths.py` and startup flows.
- Committed: No (runtime state).

**generations/**
- Purpose: Default workspace for generated user projects.
- Committed: No (gitignored).

**ui/dist/**
- Purpose: Built SPA artifacts served by FastAPI in production mode.
- Source: `npm --prefix ui run build`.
- Committed: No (gitignored).

**.claude/**
- Purpose: Agent commands, templates, and repo-local skills used by AutoForge workflows.
- Committed: Yes.

---

*Structure analysis: 2026-02-24*
*Update when directories, boundaries, or source-of-truth file locations change*

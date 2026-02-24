# External Integrations

**Analysis Date:** 2026-02-24

## APIs & External Services

**Claude / LLM Providers:**
- Claude CLI authentication and session execution is the default integration path (`start.py`, `auth.py`, `client.py`).
- `claude-agent-sdk` is used by coding/initializer/testing and assistant/spec/expand chat sessions (`agent.py`, `server/services/*_chat_session.py`).
- Optional provider routing via environment variables includes Anthropic-hosted, Azure Anthropic, GLM/Zhipu, Kimi, Ollama, and Vertex AI (`.env.example`, `env_constants.py`, `registry.py`).

**Project Tooling APIs:**
- MCP feature server exposes feature lifecycle tools to agents (`mcp_server/feature_mcp.py`).
- Web browser automation is integrated via Playwright in UI e2e and agent workflows (`ui/playwright.config.ts`, security validation paths in `security.py`).

**Notification/Automation:**
- Optional outbound webhook to n8n for progress updates (`progress.py`, env var `PROGRESS_N8N_WEBHOOK_URL`).

## Data Storage

**Databases:**
- Per-project SQLite features database (`features.db`) for feature queue, dependencies, human-input fields, and schedule tables (`api/database.py`, `autoforge_paths.py`).
- Global SQLite registry at `~/.autoforge/registry.db` for project paths and UI settings (`registry.py`).
- Per-project assistant conversation DB (`assistant.db`) for chat history (`server/services/assistant_database.py`).

**File Storage:**
- Project prompt/spec artifacts under `.autoforge/prompts/` (`prompts.py`, `start.py`).
- Runtime lock/signal/cache files under `.autoforge/` (`autoforge_paths.py`).

## Authentication & Identity

**Primary Auth Surface:**
- Claude CLI account login (`claude login`) for local agent execution (`auth.py`, `README.md`).

**API Credentialing:**
- Provider/API keys are environment-backed and forwarded in a controlled allowlist (`env_constants.py`, `client.py`, `registry.py`).
- No first-party user authentication service in AutoForge backend itself; project management is local-machine oriented.

## Monitoring & Observability

**Application Logging:**
- Python logging throughout routers/services/orchestrator/process managers (`server/*`, `parallel_orchestrator.py`).
- Debug/orchestration events are streamed to UI via WebSocket channels (`server/websocket.py`, `ui/src/hooks/useWebSocket.ts`).

**Error Visibility:**
- Errors are surfaced through HTTP responses, WebSocket error payloads, and log streams.
- No external APM/Sentry integration present in repository.

## CI/CD & Deployment

**CI Pipeline:**
- GitHub Actions workflow runs Python lint + security tests, plus UI lint/build (`.github/workflows/ci.yml`).

**Packaging/Distribution:**
- npm package publication builds UI bundle before publish (`package.json` `prepublishOnly`).
- Backend is typically launched locally via `start.py`/`start_ui.py` and bundled scripts.

## Environment Configuration

**Development:**
- Optional `.env` for local overrides; template is `.env.example`.
- Python dependencies split for dev/runtime (`requirements.txt` vs `requirements-prod.txt`).

**Runtime Behavior Flags:**
- `AUTOFORGE_ALLOW_REMOTE` alters CORS and host restrictions (`server/main.py`, `start_ui.py`).
- `EXTRA_READ_PATHS` extends read-only file access for agents with blocklist checks (`client.py`, `security.py`).

## Webhooks & Callbacks

**Incoming:**
- Real-time bidirectional channels use WebSocket endpoints for project status, assistant/spec/expand sessions, and terminal IO (`server/main.py`, `server/routers/*.py`).

**Outgoing:**
- Optional n8n webhook posts progress delta payloads (`progress.py`).
- No other outbound webhook providers are hardcoded.

---

*Integration audit: 2026-02-24*
*Update when adding/removing external services or credentials paths*

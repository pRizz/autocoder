# Backend Runtime Contract Matrix

**Status:** Active  
**Phase:** 04 (Full File-Level Contract Capture)  
**Lane:** Backend/runtime source + root backend tests

## Scope

- Canonical inventory source: `.planning/specs/INVENTORY.md`
- Included categories: `BACKEND_SOURCE` + root `test_*.py` (`TEST`)
- Expected targets: **56**

## Matrix

| ART ID | Inventory Path | Category | Contract Path | Status |
| --- | --- | --- | --- | --- |
| ART-0073 | `agent.py` | BACKEND_SOURCE | `backend-runtime/ART-0073-agent-py.md` | Complete |
| ART-0074 | `api/__init__.py` | BACKEND_SOURCE | `backend-runtime/ART-0074-api-init-py.md` | Complete |
| ART-0075 | `api/database.py` | BACKEND_SOURCE | `backend-runtime/ART-0075-api-database-py.md` | Complete |
| ART-0076 | `api/dependency_resolver.py` | BACKEND_SOURCE | `backend-runtime/ART-0076-api-dependency-resolver-py.md` | Complete |
| ART-0077 | `api/migration.py` | BACKEND_SOURCE | `backend-runtime/ART-0077-api-migration-py.md` | Complete |
| ART-0078 | `auth.py` | BACKEND_SOURCE | `backend-runtime/ART-0078-auth-py.md` | Complete |
| ART-0079 | `autoforge_paths.py` | BACKEND_SOURCE | `backend-runtime/ART-0079-autoforge-paths-py.md` | Complete |
| ART-0080 | `autonomous_agent_demo.py` | BACKEND_SOURCE | `backend-runtime/ART-0080-autonomous-agent-demo-py.md` | Complete |
| ART-0082 | `client.py` | BACKEND_SOURCE | `backend-runtime/ART-0082-client-py.md` | Complete |
| ART-0083 | `env_constants.py` | BACKEND_SOURCE | `backend-runtime/ART-0083-env-constants-py.md` | Complete |
| ART-0089 | `mcp_server/__init__.py` | BACKEND_SOURCE | `backend-runtime/ART-0089-mcp-server-init-py.md` | Complete |
| ART-0090 | `mcp_server/feature_mcp.py` | BACKEND_SOURCE | `backend-runtime/ART-0090-mcp-server-feature-mcp-py.md` | Complete |
| ART-0092 | `parallel_orchestrator.py` | BACKEND_SOURCE | `backend-runtime/ART-0092-parallel-orchestrator-py.md` | Complete |
| ART-0093 | `progress.py` | BACKEND_SOURCE | `backend-runtime/ART-0093-progress-py.md` | Complete |
| ART-0094 | `prompts.py` | BACKEND_SOURCE | `backend-runtime/ART-0094-prompts-py.md` | Complete |
| ART-0096 | `rate_limit_utils.py` | BACKEND_SOURCE | `backend-runtime/ART-0096-rate-limit-utils-py.md` | Complete |
| ART-0097 | `registry.py` | BACKEND_SOURCE | `backend-runtime/ART-0097-registry-py.md` | Complete |
| ART-0100 | `security.py` | BACKEND_SOURCE | `backend-runtime/ART-0100-security-py.md` | Complete |
| ART-0101 | `server/__init__.py` | BACKEND_SOURCE | `backend-runtime/ART-0101-server-init-py.md` | Complete |
| ART-0102 | `server/main.py` | BACKEND_SOURCE | `backend-runtime/ART-0102-server-main-py.md` | Complete |
| ART-0103 | `server/routers/__init__.py` | BACKEND_SOURCE | `backend-runtime/ART-0103-server-routers-init-py.md` | Complete |
| ART-0104 | `server/routers/agent.py` | BACKEND_SOURCE | `backend-runtime/ART-0104-server-routers-agent-py.md` | Complete |
| ART-0105 | `server/routers/assistant_chat.py` | BACKEND_SOURCE | `backend-runtime/ART-0105-server-routers-assistant-chat-py.md` | Complete |
| ART-0106 | `server/routers/devserver.py` | BACKEND_SOURCE | `backend-runtime/ART-0106-server-routers-devserver-py.md` | Complete |
| ART-0107 | `server/routers/expand_project.py` | BACKEND_SOURCE | `backend-runtime/ART-0107-server-routers-expand-project-py.md` | Complete |
| ART-0108 | `server/routers/features.py` | BACKEND_SOURCE | `backend-runtime/ART-0108-server-routers-features-py.md` | Complete |
| ART-0109 | `server/routers/filesystem.py` | BACKEND_SOURCE | `backend-runtime/ART-0109-server-routers-filesystem-py.md` | Complete |
| ART-0110 | `server/routers/projects.py` | BACKEND_SOURCE | `backend-runtime/ART-0110-server-routers-projects-py.md` | Complete |
| ART-0111 | `server/routers/schedules.py` | BACKEND_SOURCE | `backend-runtime/ART-0111-server-routers-schedules-py.md` | Complete |
| ART-0112 | `server/routers/settings.py` | BACKEND_SOURCE | `backend-runtime/ART-0112-server-routers-settings-py.md` | Complete |
| ART-0113 | `server/routers/spec_creation.py` | BACKEND_SOURCE | `backend-runtime/ART-0113-server-routers-spec-creation-py.md` | Complete |
| ART-0114 | `server/routers/terminal.py` | BACKEND_SOURCE | `backend-runtime/ART-0114-server-routers-terminal-py.md` | Complete |
| ART-0115 | `server/schemas.py` | BACKEND_SOURCE | `backend-runtime/ART-0115-server-schemas-py.md` | Complete |
| ART-0116 | `server/services/__init__.py` | BACKEND_SOURCE | `backend-runtime/ART-0116-server-services-init-py.md` | Complete |
| ART-0117 | `server/services/assistant_chat_session.py` | BACKEND_SOURCE | `backend-runtime/ART-0117-server-services-assistant-chat-session-py.md` | Complete |
| ART-0118 | `server/services/assistant_database.py` | BACKEND_SOURCE | `backend-runtime/ART-0118-server-services-assistant-database-py.md` | Complete |
| ART-0119 | `server/services/chat_constants.py` | BACKEND_SOURCE | `backend-runtime/ART-0119-server-services-chat-constants-py.md` | Complete |
| ART-0120 | `server/services/dev_server_manager.py` | BACKEND_SOURCE | `backend-runtime/ART-0120-server-services-dev-server-manager-py.md` | Complete |
| ART-0121 | `server/services/expand_chat_session.py` | BACKEND_SOURCE | `backend-runtime/ART-0121-server-services-expand-chat-session-py.md` | Complete |
| ART-0122 | `server/services/process_manager.py` | BACKEND_SOURCE | `backend-runtime/ART-0122-server-services-process-manager-py.md` | Complete |
| ART-0123 | `server/services/project_config.py` | BACKEND_SOURCE | `backend-runtime/ART-0123-server-services-project-config-py.md` | Complete |
| ART-0124 | `server/services/scheduler_service.py` | BACKEND_SOURCE | `backend-runtime/ART-0124-server-services-scheduler-service-py.md` | Complete |
| ART-0125 | `server/services/spec_chat_session.py` | BACKEND_SOURCE | `backend-runtime/ART-0125-server-services-spec-chat-session-py.md` | Complete |
| ART-0126 | `server/services/terminal_manager.py` | BACKEND_SOURCE | `backend-runtime/ART-0126-server-services-terminal-manager-py.md` | Complete |
| ART-0127 | `server/utils/__init__.py` | BACKEND_SOURCE | `backend-runtime/ART-0127-server-utils-init-py.md` | Complete |
| ART-0128 | `server/utils/process_utils.py` | BACKEND_SOURCE | `backend-runtime/ART-0128-server-utils-process-utils-py.md` | Complete |
| ART-0129 | `server/utils/project_helpers.py` | BACKEND_SOURCE | `backend-runtime/ART-0129-server-utils-project-helpers-py.md` | Complete |
| ART-0130 | `server/utils/validation.py` | BACKEND_SOURCE | `backend-runtime/ART-0130-server-utils-validation-py.md` | Complete |
| ART-0131 | `server/websocket.py` | BACKEND_SOURCE | `backend-runtime/ART-0131-server-websocket-py.md` | Complete |
| ART-0138 | `temp_cleanup.py` | BACKEND_SOURCE | `backend-runtime/ART-0138-temp-cleanup-py.md` | Complete |
| ART-0139 | `test_client.py` | TEST | `backend-runtime/ART-0139-test-client-py.md` | Complete |
| ART-0140 | `test_dependency_resolver.py` | TEST | `backend-runtime/ART-0140-test-dependency-resolver-py.md` | Complete |
| ART-0141 | `test_devserver_security.py` | TEST | `backend-runtime/ART-0141-test-devserver-security-py.md` | Complete |
| ART-0142 | `test_rate_limit_utils.py` | TEST | `backend-runtime/ART-0142-test-rate-limit-utils-py.md` | Complete |
| ART-0143 | `test_security.py` | TEST | `backend-runtime/ART-0143-test-security-py.md` | Complete |
| ART-0144 | `test_security_integration.py` | TEST | `backend-runtime/ART-0144-test-security-integration-py.md` | Complete |

## Verification

- Row count must equal 56.
- Each `Contract Path` must map to one `ART-####` contract file under `contracts/backend-runtime/`.

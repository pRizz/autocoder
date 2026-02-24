# REST API Endpoint Matrix

**Status:** Active  
**Phase:** 05 (Surface Contracts: API + WebSocket)  
**Canonical completeness source for SURF-01**

Total HTTP API endpoints: **68** (66 router-mounted + 2 main health/setup endpoints)

## Coverage Rules

- Includes all mounted HTTP routes under `/api/**` from backend router artifacts `ART-0104`..`ART-0114` plus `ART-0102` (`/api/health`, `/api/setup/status`).
- Excludes static SPA routes (`/`, `/{path:path}`) and all WebSocket endpoints (captured in `WEBSOCKET-ENDPOINT-MATRIX.md`).
- `Status Code Set` includes success code plus explicit application error codes raised by contract implementation.

## Endpoint Inventory

| Method | Path | Router/Module ART | Request Schema | Response Schema | Status Code Set | Contract Status |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/assistant/conversations/{project_name}` | `ART-0105` | `path {project_name:str}` | `list[ConversationSummary]` | `200, 400, 404` | Complete |
| POST | `/api/assistant/conversations/{project_name}` | `ART-0105` | `path {project_name:str}` | `ConversationSummary` | `200, 400, 404` | Complete |
| GET | `/api/assistant/conversations/{project_name}/{conversation_id}` | `ART-0105` | `path {project_name:str, conversation_id:int}` | `ConversationDetail` | `200, 400, 404` | Complete |
| DELETE | `/api/assistant/conversations/{project_name}/{conversation_id}` | `ART-0105` | `path {project_name:str, conversation_id:int}` | `object` | `200, 400, 404` | Complete |
| GET | `/api/assistant/sessions` | `ART-0105` | `none` | `list[str]` | `200` | Complete |
| GET | `/api/assistant/sessions/{project_name}` | `ART-0105` | `path {project_name:str}` | `SessionInfo` | `200, 400, 404` | Complete |
| DELETE | `/api/assistant/sessions/{project_name}` | `ART-0105` | `path {project_name:str}` | `object` | `200, 400, 404` | Complete |
| GET | `/api/expand/sessions` | `ART-0107` | `none` | `list[str]` | `200` | Complete |
| GET | `/api/expand/sessions/{project_name}` | `ART-0107` | `path {project_name:str}` | `ExpandSessionStatus` | `200, 404` | Complete |
| DELETE | `/api/expand/sessions/{project_name}` | `ART-0107` | `path {project_name:str}` | `object` | `200, 404` | Complete |
| POST | `/api/filesystem/create-directory` | `ART-0109` | `body CreateDirectoryRequest` | `object` | `200, 400, 403, 404, 409, 500` | Complete |
| GET | `/api/filesystem/drives` | `ART-0109` | `none` | `list[DriveInfo] | None` | `200` | Complete |
| GET | `/api/filesystem/home` | `ART-0109` | `none` | `object` | `200` | Complete |
| GET | `/api/filesystem/list` | `ART-0109` | `query {path:str | None, show_hidden:bool}` | `DirectoryListResponse` | `200, 400, 403, 404, 500` | Complete |
| POST | `/api/filesystem/validate` | `ART-0109` | `query {path:str}` | `PathValidationResponse` | `200` | Complete |
| GET | `/api/health` | `ART-0102` | `none` | `object` | `200` | Complete |
| GET | `/api/projects` | `ART-0110` | `none` | `list[ProjectSummary]` | `200` | Complete |
| POST | `/api/projects` | `ART-0110` | `body ProjectCreate` | `ProjectSummary` | `200, 400, 403, 409, 500` | Complete |
| GET | `/api/projects/{name}` | `ART-0110` | `path {name:str}` | `ProjectDetail` | `200, 404` | Complete |
| DELETE | `/api/projects/{name}` | `ART-0110` | `path {name:str}; query {delete_files:bool}` | `object` | `200, 404, 409, 500` | Complete |
| GET | `/api/projects/{name}/prompts` | `ART-0110` | `path {name:str}` | `ProjectPrompts` | `200, 404` | Complete |
| PUT | `/api/projects/{name}/prompts` | `ART-0110` | `path {name:str}; body ProjectPromptsUpdate` | `object` | `200, 404` | Complete |
| POST | `/api/projects/{name}/reset` | `ART-0110` | `path {name:str}; query {full_reset:bool}` | `object` | `200, 404, 409, 500` | Complete |
| PATCH | `/api/projects/{name}/settings` | `ART-0110` | `path {name:str}; body ProjectSettingsUpdate` | `ProjectDetail` | `200, 404, 500` | Complete |
| GET | `/api/projects/{name}/stats` | `ART-0110` | `path {name:str}` | `ProjectStats` | `200, 404` | Complete |
| POST | `/api/projects/{project_name}/agent/graceful-pause` | `ART-0104` | `path {project_name:str}` | `AgentActionResponse` | `200` | Complete |
| POST | `/api/projects/{project_name}/agent/graceful-resume` | `ART-0104` | `path {project_name:str}` | `AgentActionResponse` | `200` | Complete |
| POST | `/api/projects/{project_name}/agent/pause` | `ART-0104` | `path {project_name:str}` | `AgentActionResponse` | `200` | Complete |
| POST | `/api/projects/{project_name}/agent/resume` | `ART-0104` | `path {project_name:str}` | `AgentActionResponse` | `200` | Complete |
| POST | `/api/projects/{project_name}/agent/start` | `ART-0104` | `path {project_name:str}; body AgentStartRequest` | `AgentActionResponse` | `200` | Complete |
| GET | `/api/projects/{project_name}/agent/status` | `ART-0104` | `path {project_name:str}` | `AgentStatus` | `200` | Complete |
| POST | `/api/projects/{project_name}/agent/stop` | `ART-0104` | `path {project_name:str}` | `AgentActionResponse` | `200` | Complete |
| GET | `/api/projects/{project_name}/devserver/config` | `ART-0106` | `path {project_name:str}` | `DevServerConfigResponse` | `200` | Complete |
| PATCH | `/api/projects/{project_name}/devserver/config` | `ART-0106` | `path {project_name:str}; body DevServerConfigUpdate` | `DevServerConfigResponse` | `200, 400, 500` | Complete |
| POST | `/api/projects/{project_name}/devserver/start` | `ART-0106` | `path {project_name:str}; body DevServerStartRequest` | `DevServerActionResponse` | `200, 400` | Complete |
| GET | `/api/projects/{project_name}/devserver/status` | `ART-0106` | `path {project_name:str}` | `DevServerStatus` | `200` | Complete |
| POST | `/api/projects/{project_name}/devserver/stop` | `ART-0106` | `path {project_name:str}` | `DevServerActionResponse` | `200` | Complete |
| GET | `/api/projects/{project_name}/features` | `ART-0108` | `path {project_name:str}` | `FeatureListResponse` | `200, 404, 500` | Complete |
| POST | `/api/projects/{project_name}/features` | `ART-0108` | `path {project_name:str}; body FeatureCreate` | `FeatureResponse` | `200, 404, 500` | Complete |
| POST | `/api/projects/{project_name}/features/bulk` | `ART-0108` | `path {project_name:str}; body FeatureBulkCreate` | `FeatureBulkCreateResponse` | `200, 400, 404, 500` | Complete |
| GET | `/api/projects/{project_name}/features/graph` | `ART-0108` | `path {project_name:str}` | `DependencyGraphResponse` | `200, 404, 500` | Complete |
| GET | `/api/projects/{project_name}/features/{feature_id}` | `ART-0108` | `path {project_name:str, feature_id:int}` | `FeatureResponse` | `200, 404, 500` | Complete |
| PATCH | `/api/projects/{project_name}/features/{feature_id}` | `ART-0108` | `path {project_name:str, feature_id:int}; body FeatureUpdate` | `FeatureResponse` | `200, 400, 404, 500` | Complete |
| DELETE | `/api/projects/{project_name}/features/{feature_id}` | `ART-0108` | `path {project_name:str, feature_id:int}` | `object` | `200, 404, 500` | Complete |
| PUT | `/api/projects/{project_name}/features/{feature_id}/dependencies` | `ART-0108` | `path {project_name:str, feature_id:int}; body DependencyUpdate` | `object` | `200, 400, 404, 500` | Complete |
| POST | `/api/projects/{project_name}/features/{feature_id}/dependencies/{dep_id}` | `ART-0108` | `path {project_name:str, feature_id:int, dep_id:int}` | `object` | `200, 400, 404, 500` | Complete |
| DELETE | `/api/projects/{project_name}/features/{feature_id}/dependencies/{dep_id}` | `ART-0108` | `path {project_name:str, feature_id:int, dep_id:int}` | `object` | `200, 400, 404, 500` | Complete |
| POST | `/api/projects/{project_name}/features/{feature_id}/resolve-human-input` | `ART-0108` | `path {project_name:str, feature_id:int}; body HumanInputResponse` | `FeatureResponse` | `200, 400, 404, 500` | Complete |
| PATCH | `/api/projects/{project_name}/features/{feature_id}/skip` | `ART-0108` | `path {project_name:str, feature_id:int}` | `object` | `200, 404, 500` | Complete |
| GET | `/api/projects/{project_name}/schedules` | `ART-0111` | `path {project_name:str}` | `ScheduleListResponse` | `200` | Complete |
| POST | `/api/projects/{project_name}/schedules` | `ART-0111` | `path {project_name:str}; body ScheduleCreate` | `ScheduleResponse` | `201, 400` | Complete |
| GET | `/api/projects/{project_name}/schedules/next` | `ART-0111` | `path {project_name:str}` | `NextRunResponse` | `200` | Complete |
| GET | `/api/projects/{project_name}/schedules/{schedule_id}` | `ART-0111` | `path {project_name:str, schedule_id:int}` | `ScheduleResponse` | `200, 404` | Complete |
| PATCH | `/api/projects/{project_name}/schedules/{schedule_id}` | `ART-0111` | `path {project_name:str, schedule_id:int}; body ScheduleUpdate` | `ScheduleResponse` | `200, 404` | Complete |
| DELETE | `/api/projects/{project_name}/schedules/{schedule_id}` | `ART-0111` | `path {project_name:str, schedule_id:int}` | `object` | `204, 404` | Complete |
| GET | `/api/settings` | `ART-0112` | `none` | `SettingsResponse` | `200` | Complete |
| PATCH | `/api/settings` | `ART-0112` | `body SettingsUpdate` | `SettingsResponse` | `200` | Complete |
| GET | `/api/settings/models` | `ART-0112` | `none` | `ModelsResponse` | `200` | Complete |
| GET | `/api/settings/providers` | `ART-0112` | `none` | `ProvidersResponse` | `200` | Complete |
| GET | `/api/setup/status` | `ART-0102` | `none` | `SetupStatus` | `200` | Complete |
| GET | `/api/spec/sessions` | `ART-0113` | `none` | `list[str]` | `200` | Complete |
| GET | `/api/spec/sessions/{project_name}` | `ART-0113` | `path {project_name:str}` | `SpecSessionStatus` | `200, 400, 404` | Complete |
| DELETE | `/api/spec/sessions/{project_name}` | `ART-0113` | `path {project_name:str}` | `object` | `200, 400, 404` | Complete |
| GET | `/api/spec/status/{project_name}` | `ART-0113` | `path {project_name:str}` | `SpecFileStatus` | `200, 400, 404, 500` | Complete |
| GET | `/api/terminal/{project_name}` | `ART-0114` | `path {project_name:str}` | `list[TerminalInfoResponse]` | `200, 400, 404` | Complete |
| POST | `/api/terminal/{project_name}` | `ART-0114` | `path {project_name:str}; body CreateTerminalRequest` | `TerminalInfoResponse` | `200, 400, 404` | Complete |
| PATCH | `/api/terminal/{project_name}/{terminal_id}` | `ART-0114` | `path {project_name:str, terminal_id:str}; body RenameTerminalRequest` | `TerminalInfoResponse` | `200, 400, 404` | Complete |
| DELETE | `/api/terminal/{project_name}/{terminal_id}` | `ART-0114` | `path {project_name:str, terminal_id:str}` | `dict` | `200, 400, 404` | Complete |

## Domain Totals

| Domain | Endpoint Count |
| --- | ---: |
| Projects | 7 |
| Features | 12 |
| Agent | 7 |
| Schedules | 6 |
| DevServer | 5 |
| Filesystem | 5 |
| Settings | 4 |
| Assistant | 7 |
| Spec | 4 |
| Expand | 3 |
| Terminal | 4 |
| Health | 1 |
| Setup | 1 |
| **Total** | **66** |

## References

- Request/response shape anchors: `ART-0115`
- Frontend REST consumer parity anchor: `ART-0226`
- Detailed endpoint semantics: `REST-API-CONTRACTS.md`

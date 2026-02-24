# REST API Contracts

**Status:** Active  
**Phase:** 05 (Surface Contracts: API + WebSocket)  
**Requirement:** `SURF-01`

`REST-API-ENDPOINT-MATRIX.md` is the canonical completeness source for this contract set (68/68 HTTP endpoints).

## Contract Scope

- Scope includes all mounted HTTP routes under `/api/**` from `ART-0102`, `ART-0104`..`ART-0114`.
- Each route contract captures purpose, request shape, response shape, Status Codes, and Error Behavior.
- Payload type anchors are defined in `ART-0115` and consumed by frontend API client contract `ART-0226`.

## Status Codes and Error Behavior

- `200`: successful read/action response body.
- `201`: successful create with created resource payload.
- `204`: successful delete with no response body.
- `400`: request validation, malformed payload, or unsafe command/path rejection.
- `403`: permission/policy rejection (filesystem security boundaries).
- `404`: project/session/resource not found.
- `409`: conflict with current state (already exists, running/locked resource).
- `500`: internal storage/process/system failure while fulfilling a valid request.

## Projects

**Implementing Artifact:** `ART-0110`

Project registry lifecycle, prompt management, reset flows, and project-level settings.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/projects` | List all registered projects. | `none` | `list[ProjectSummary]` | `200` | Success: 200 |
| POST | `/api/projects` | Create a new project at the specified path. | `body ProjectCreate` | `ProjectSummary` | `200, 400, 403, 409, 500` | Success: 200; 400 validation or malformed input; 403 restricted by policy/permissions; 409 conflict with current state; 500 internal persistence/process failure |
| GET | `/api/projects/{name}` | Get detailed information about a project. | `path {name:str}` | `ProjectDetail` | `200, 404` | Success: 200; 404 project/resource/session not found |
| DELETE | `/api/projects/{name}` | Delete a project from the registry. | `path {name:str}; query {delete_files:bool}` | `object {success, message}` | `200, 404, 409, 500` | Success: 200; 404 project/resource/session not found; 409 conflict with current state; 500 internal persistence/process failure |
| GET | `/api/projects/{name}/prompts` | Get the content of project prompt files. | `path {name:str}` | `ProjectPrompts` | `200, 404` | Success: 200; 404 project/resource/session not found |
| PUT | `/api/projects/{name}/prompts` | Update project prompt files. | `path {name:str}; body ProjectPromptsUpdate` | `object {success, message}` | `200, 404` | Success: 200; 404 project/resource/session not found |
| POST | `/api/projects/{name}/reset` | Reset a project to its initial state. | `path {name:str}; query {full_reset:bool}` | `object {success, reset_type, deleted_files, message}` | `200, 404, 409, 500` | Success: 200; 404 project/resource/session not found; 409 conflict with current state; 500 internal persistence/process failure |
| PATCH | `/api/projects/{name}/settings` | Update project-level settings (concurrency, etc.). | `path {name:str}; body ProjectSettingsUpdate` | `ProjectDetail` | `200, 404, 500` | Success: 200; 404 project/resource/session not found; 500 internal persistence/process failure |
| GET | `/api/projects/{name}/stats` | Get current progress statistics for a project. | `path {name:str}` | `ProjectStats` | `200, 404` | Success: 200; 404 project/resource/session not found |

## Features

**Implementing Artifact:** `ART-0108`

Feature backlog CRUD, dependency management, and human-input resolution.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/projects/{project_name}/features` | List all features for a project organized by status. | `path {project_name:str}` | `FeatureListResponse` | `200, 404, 500` | Success: 200; 404 project/resource/session not found; 500 internal persistence/process failure |
| POST | `/api/projects/{project_name}/features` | Create a new feature/test case manually. | `path {project_name:str}; body FeatureCreate` | `FeatureResponse` | `200, 404, 500` | Success: 200; 404 project/resource/session not found; 500 internal persistence/process failure |
| POST | `/api/projects/{project_name}/features/bulk` | Create multiple features at once. | `path {project_name:str}; body FeatureBulkCreate` | `FeatureBulkCreateResponse` | `200, 400, 404, 500` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found; 500 internal persistence/process failure |
| GET | `/api/projects/{project_name}/features/graph` | Return dependency graph data for visualization. | `path {project_name:str}` | `DependencyGraphResponse` | `200, 404, 500` | Success: 200; 404 project/resource/session not found; 500 internal persistence/process failure |
| GET | `/api/projects/{project_name}/features/{feature_id}` | Get details of a specific feature. | `path {project_name:str, feature_id:int}` | `FeatureResponse` | `200, 404, 500` | Success: 200; 404 project/resource/session not found; 500 internal persistence/process failure |
| PATCH | `/api/projects/{project_name}/features/{feature_id}` | Update a feature's details. | `path {project_name:str, feature_id:int}; body FeatureUpdate` | `FeatureResponse` | `200, 400, 404, 500` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found; 500 internal persistence/process failure |
| DELETE | `/api/projects/{project_name}/features/{feature_id}` | Delete a feature and clean up references in other features' dependencies. | `path {project_name:str, feature_id:int}` | `object {success, message, affected_features}` | `200, 404, 500` | Success: 200; 404 project/resource/session not found; 500 internal persistence/process failure |
| PUT | `/api/projects/{project_name}/features/{feature_id}/dependencies` | Set all dependencies for a feature at once, replacing any existing. | `path {project_name:str, feature_id:int}; body DependencyUpdate` | `object {success, feature_id, dependencies}` | `200, 400, 404, 500` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found; 500 internal persistence/process failure |
| POST | `/api/projects/{project_name}/features/{feature_id}/dependencies/{dep_id}` | Add a dependency relationship between features. | `path {project_name:str, feature_id:int, dep_id:int}` | `object {success, feature_id, dependencies}` | `200, 400, 404, 500` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found; 500 internal persistence/process failure |
| DELETE | `/api/projects/{project_name}/features/{feature_id}/dependencies/{dep_id}` | Remove a dependency from a feature. | `path {project_name:str, feature_id:int, dep_id:int}` | `object {success, feature_id, dependencies}` | `200, 400, 404, 500` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found; 500 internal persistence/process failure |
| POST | `/api/projects/{project_name}/features/{feature_id}/resolve-human-input` | Resolve a human input request for a feature. | `path {project_name:str, feature_id:int}; body HumanInputResponse` | `FeatureResponse` | `200, 400, 404, 500` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found; 500 internal persistence/process failure |
| PATCH | `/api/projects/{project_name}/features/{feature_id}/skip` | Mark a feature as skipped by moving it to the end of the priority queue. | `path {project_name:str, feature_id:int}` | `object {success, message}` | `200, 404, 500` | Success: 200; 404 project/resource/session not found; 500 internal persistence/process failure |

## Agent

**Implementing Artifact:** `ART-0104`

Execution lifecycle controls for coding/test orchestration per project.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/projects/{project_name}/agent/graceful-pause` | Request a graceful pause (drain mode) - finish current work then pause. | `path {project_name:str}` | `AgentActionResponse` | `200` | Success: 200 |
| POST | `/api/projects/{project_name}/agent/graceful-resume` | Resume from a graceful pause. | `path {project_name:str}` | `AgentActionResponse` | `200` | Success: 200 |
| POST | `/api/projects/{project_name}/agent/pause` | Pause the agent for a project. | `path {project_name:str}` | `AgentActionResponse` | `200` | Success: 200 |
| POST | `/api/projects/{project_name}/agent/resume` | Resume a paused agent. | `path {project_name:str}` | `AgentActionResponse` | `200` | Success: 200 |
| POST | `/api/projects/{project_name}/agent/start` | Start the agent for a project. | `path {project_name:str}; body AgentStartRequest` | `AgentActionResponse` | `200` | Success: 200 |
| GET | `/api/projects/{project_name}/agent/status` | Get the current status of the agent for a project. | `path {project_name:str}` | `AgentStatus` | `200` | Success: 200 |
| POST | `/api/projects/{project_name}/agent/stop` | Stop the agent for a project. | `path {project_name:str}` | `AgentActionResponse` | `200` | Success: 200 |

## Schedules

**Implementing Artifact:** `ART-0111`

Recurring schedule CRUD and next-run introspection per project.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/projects/{project_name}/schedules` | Get all schedules for a project. | `path {project_name:str}` | `ScheduleListResponse` | `200` | Success: 200 |
| POST | `/api/projects/{project_name}/schedules` | Create a new schedule for a project. | `path {project_name:str}; body ScheduleCreate` | `ScheduleResponse` | `201, 400` | Success: 201 created; 400 validation or malformed input |
| GET | `/api/projects/{project_name}/schedules/next` | Calculate next scheduled run across all enabled schedules. | `path {project_name:str}` | `NextRunResponse` | `200` | Success: 200 |
| GET | `/api/projects/{project_name}/schedules/{schedule_id}` | Get a single schedule by ID. | `path {project_name:str, schedule_id:int}` | `ScheduleResponse` | `200, 404` | Success: 200; 404 project/resource/session not found |
| PATCH | `/api/projects/{project_name}/schedules/{schedule_id}` | Update an existing schedule. | `path {project_name:str, schedule_id:int}; body ScheduleUpdate` | `ScheduleResponse` | `200, 404` | Success: 200; 404 project/resource/session not found |
| DELETE | `/api/projects/{project_name}/schedules/{schedule_id}` | Delete a schedule. | `path {project_name:str, schedule_id:int}` | `object` | `204, 404` | Success: 204 no-content; 404 project/resource/session not found |

## DevServer

**Implementing Artifact:** `ART-0106`

Dev server status/start/stop/configuration with command policy enforcement.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/projects/{project_name}/devserver/config` | Get the dev server configuration for a project. | `path {project_name:str}` | `DevServerConfigResponse` | `200` | Success: 200 |
| PATCH | `/api/projects/{project_name}/devserver/config` | Update the dev server configuration for a project. | `path {project_name:str}; body DevServerConfigUpdate` | `DevServerConfigResponse` | `200, 400, 500` | Success: 200; 400 validation or malformed input; 500 internal persistence/process failure |
| POST | `/api/projects/{project_name}/devserver/start` | Start the dev server for a project. | `path {project_name:str}; body DevServerStartRequest` | `DevServerActionResponse` | `200, 400` | Success: 200; 400 validation or malformed input |
| GET | `/api/projects/{project_name}/devserver/status` | Get the current status of the dev server for a project. | `path {project_name:str}` | `DevServerStatus` | `200` | Success: 200 |
| POST | `/api/projects/{project_name}/devserver/stop` | Stop the dev server for a project. | `path {project_name:str}` | `DevServerActionResponse` | `200` | Success: 200 |

## Filesystem

**Implementing Artifact:** `ART-0109`

Safe directory browsing/validation/creation APIs with restricted-path controls.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/filesystem/create-directory` | Create a new directory inside a parent directory. | `body CreateDirectoryRequest` | `object {success, path, message}` | `200, 400, 403, 404, 409, 500` | Success: 200; 400 validation or malformed input; 403 restricted by policy/permissions; 404 project/resource/session not found; 409 conflict with current state; 500 internal persistence/process failure |
| GET | `/api/filesystem/drives` | List available drives (Windows only). | `none` | `list[DriveInfo] | None` | `200` | Success: 200 |
| GET | `/api/filesystem/home` | Get the user's home directory path. | `none` | `object {path, display_path}` | `200` | Success: 200 |
| GET | `/api/filesystem/list` | List contents of a directory. | `query {path:str | None, show_hidden:bool}` | `DirectoryListResponse` | `200, 400, 403, 404, 500` | Success: 200; 400 validation or malformed input; 403 restricted by policy/permissions; 404 project/resource/session not found; 500 internal persistence/process failure |
| POST | `/api/filesystem/validate` | Validate if a path is accessible and writable. | `query {path:str}` | `PathValidationResponse` | `200` | Success: 200 |

## Settings

**Implementing Artifact:** `ART-0112`

Global provider/model/runtime settings controls.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/settings` | Get current global settings. | `none` | `SettingsResponse` | `200` | Success: 200 |
| PATCH | `/api/settings` | Update global settings. | `body SettingsUpdate` | `SettingsResponse` | `200` | Success: 200 |
| GET | `/api/settings/models` | Get list of available models. | `none` | `ModelsResponse` | `200` | Success: 200 |
| GET | `/api/settings/providers` | Get list of available API providers. | `none` | `ProvidersResponse` | `200` | Success: 200 |

## Assistant

**Implementing Artifact:** `ART-0105`

Conversation/session management for assistant chat workflows.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/assistant/conversations/{project_name}` | List all conversations for a project. | `path {project_name:str}` | `list[ConversationSummary]` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| POST | `/api/assistant/conversations/{project_name}` | Create a new conversation for a project. | `path {project_name:str}` | `ConversationSummary` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| GET | `/api/assistant/conversations/{project_name}/{conversation_id}` | Get a specific conversation with all messages. | `path {project_name:str, conversation_id:int}` | `ConversationDetail` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| DELETE | `/api/assistant/conversations/{project_name}/{conversation_id}` | Delete a conversation. | `path {project_name:str, conversation_id:int}` | `object {success, message}` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| GET | `/api/assistant/sessions` | List all active assistant sessions. | `none` | `list[str]` | `200` | Success: 200 |
| GET | `/api/assistant/sessions/{project_name}` | Get information about an active session. | `path {project_name:str}` | `SessionInfo` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| DELETE | `/api/assistant/sessions/{project_name}` | Close an active session. | `path {project_name:str}` | `object {success, message}` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |

## Spec

**Implementing Artifact:** `ART-0113`

Spec-creation session/status APIs.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/spec/sessions` | List all active spec creation sessions. | `none` | `list[str]` | `200` | Success: 200 |
| GET | `/api/spec/sessions/{project_name}` | Get status of a spec creation session. | `path {project_name:str}` | `SpecSessionStatus` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| DELETE | `/api/spec/sessions/{project_name}` | Cancel and remove a spec creation session. | `path {project_name:str}` | `object {success, message}` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| GET | `/api/spec/status/{project_name}` | Get spec creation status by reading .spec_status.json from the project. | `path {project_name:str}` | `SpecFileStatus` | `200, 400, 404, 500` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found; 500 internal persistence/process failure |

## Expand

**Implementing Artifact:** `ART-0107`

Expansion-session management APIs for project feature expansion.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/expand/sessions` | List all active expansion sessions. | `none` | `list[str]` | `200` | Success: 200 |
| GET | `/api/expand/sessions/{project_name}` | Get status of an expansion session. | `path {project_name:str}` | `ExpandSessionStatus` | `200, 404` | Success: 200; 404 project/resource/session not found |
| DELETE | `/api/expand/sessions/{project_name}` | Cancel and remove an expansion session. | `path {project_name:str}` | `object {success, message}` | `200, 404` | Success: 200; 404 project/resource/session not found |

## Terminal

**Implementing Artifact:** `ART-0114`

Terminal metadata/session management APIs (paired with terminal websocket I/O).

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/terminal/{project_name}` | List all terminals for a project. | `path {project_name:str}` | `list[TerminalInfoResponse]` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| POST | `/api/terminal/{project_name}` | Create a new terminal for a project. | `path {project_name:str}; body CreateTerminalRequest` | `TerminalInfoResponse` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| PATCH | `/api/terminal/{project_name}/{terminal_id}` | Rename a terminal. | `path {project_name:str, terminal_id:str}; body RenameTerminalRequest` | `TerminalInfoResponse` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |
| DELETE | `/api/terminal/{project_name}/{terminal_id}` | Delete a terminal and stop its session. | `path {project_name:str, terminal_id:str}` | `object {message}` | `200, 400, 404` | Success: 200; 400 validation or malformed input; 404 project/resource/session not found |

## Health

**Implementing Artifact:** `ART-0102`

Service liveness endpoint.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/health` | Health check endpoint. | `none` | `object {status}` | `200` | Success: 200 |

## Setup

**Implementing Artifact:** `ART-0102`

Runtime dependency/setup availability endpoint.

| Method | Path | Purpose | Request Shape | Response Shape | Status Codes | Error Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/setup/status` | Check system setup status. | `none` | `SetupStatus` | `200` | Success: 200 |


## Cross-References

- Completeness inventory: `REST-API-ENDPOINT-MATRIX.md`
- Realtime protocol companion: `WEBSOCKET-CONTRACTS.md`
- Surface traceability binder: `SURFACE-TRACEABILITY.md`

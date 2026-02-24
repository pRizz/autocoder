# WebSocket Endpoint Matrix

**Status:** Active  
**Phase:** 05 (Surface Contracts: API + WebSocket)  
**Canonical completeness source for SURF-02**

Total WebSocket endpoints: **5**

## Coverage Rules

- Includes all mounted WebSocket routes from `ART-0102`, `ART-0105`, `ART-0107`, `ART-0113`, and `ART-0114`.
- Each row captures bidirectional message protocol, heartbeat behavior, and close/error semantics.
- HTTP API endpoints are out of scope here and are captured in `REST-API-ENDPOINT-MATRIX.md`.

## Endpoint Inventory

| Path | Implementing ART | Client -> Server Message Types | Server -> Client Message Types | Heartbeat Behavior | Close/Error Semantics |
| --- | --- | --- | --- | --- | --- |
| /ws/projects/{project_name} | `ART-0102` + `ART-0131` | `ping` (plus reserved future command messages ignored by server) | `progress`, `log`, `agent_status`, `agent_update`, `orchestrator_update`, `dev_log`, `dev_server_status`, `pong`, `error` | Client sends `ping`; server replies `pong`; progress poll emits every 2s on changes | Rejects invalid/missing project with `error` then close (`4000`, `4004`) |
| /api/assistant/ws/{project_name} | `ART-0105` | `start`, `message`, `answer`, `ping` | `conversation_created`, `text`, `tool_call`, `question`, `response_done`, `pong`, `error` | Client heartbeat via `ping`/`pong` | Rejects invalid/missing project with `error` then close (`4000`, `4004`); unknown message type returns `error` |
| /api/spec/ws/{project_name} | `ART-0113` | `start`, `message` (optional attachments), `answer`, `ping` | `text`, `question`, `spec_complete`, `file_written`, `response_done`, `complete`, `pong`, `error` | Client heartbeat via `ping`/`pong` | Rejects invalid/missing project with `error` then close (`4000`, `4004`); unknown/invalid JSON returns `error` |
| /api/expand/ws/{project_name} | `ART-0107` | `start`, `message` (optional attachments), `done`, `ping` | `text`, `features_created`, `expansion_complete`, `response_done`, `pong`, `error` | Client heartbeat via `ping`/`pong` | Rejects invalid/missing project/spec with `error` then close (`4000`, `4004`); unknown/invalid JSON returns `error` |
| /api/terminal/ws/{project_name}/{terminal_id} | `ART-0114` | `resize`, `input` (base64), `ping` | `output` (base64), `exit`, `pong`, `error` | Client may send `ping`; server returns `pong`; session output streams asynchronously | Rejects invalid identifiers/resources with `error` then close (`4000`, `4004`); start failure closes with `4500` |

## References

- Detailed protocol contracts: `WEBSOCKET-CONTRACTS.md`
- Frontend project-updates consumer anchor: `ART-0225`
- Frontend websocket type union anchor: `ART-0229`

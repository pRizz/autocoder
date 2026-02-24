# WebSocket Contracts

**Status:** Active  
**Phase:** 05 (Surface Contracts: API + WebSocket)  
**Requirement:** `SURF-02`

`WEBSOCKET-ENDPOINT-MATRIX.md` is the canonical endpoint/message completeness source for this protocol corpus (`5/5` endpoints).

## Protocol Conventions

- All endpoints accept the connection first, then validate identifiers/registry presence, then emit typed `error` payloads before policy close when needed.
- Message frames are JSON objects with a required `type` discriminator.
- Heartbeat behavior uses client `ping` and server `pong` across all channels.
- Payload schema anchors: backend `ART-0115`; frontend websocket consumer/type anchors `ART-0225` and `ART-0229`.

## Project Updates

**Endpoint:** `/ws/projects/{project_name}`  
**Implementing Artifacts:** `ART-0102`, `ART-0131`  
**Primary Frontend Consumer:** `ART-0225`

### Client -> Server

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `ping` | none | Keepalive request; server returns `pong`. |
| (reserved) | arbitrary JSON | Non-`ping` messages are currently ignored unless future command handling is added. |

### Server -> Client

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `progress` | `passing`, `in_progress`, `total`, `percentage`, `needs_human_input` | Snapshot update emitted at connect and then on state change (poll loop every 2s). |
| `agent_status` | `status` | Agent lifecycle state updates (`running`, `stopped`, `paused`, etc.). |
| `log` | `line`, `timestamp` (+ optional `featureId`, `agentIndex`) | Raw orchestrator/agent line stream with attribution metadata when available. |
| `agent_update` | `agentIndex`, `agentName`, `agentType`, `featureId`, `featureName`, `state`, `timestamp` (+ optional `thought`, `featureIds`, `synthetic`) | Mission-control per-agent state transition events. |
| `orchestrator_update` | `eventType`, `state`, `message`, `timestamp` (+ optional capacity/feature fields) | Scheduler/orchestrator decision telemetry stream. |
| `dev_log` | `line`, `timestamp` | Dev server output stream. |
| `dev_server_status` | `status`, `url` | Dev server lifecycle and detected URL updates. |
| `pong` | none | Heartbeat response. |
| `error` | `content` | Validation/connection failure surfaced before close. |

### Ordering

- Connection ordering is deterministic: `agent_status`, `dev_server_status`, and initial `progress` are emitted before steady-state stream processing.
- `progress` updates are monotonic snapshots (latest state wins) and may interleave with log/status events.
- `agent_update` and `orchestrator_update` ordering follows orchestrator output line order.

### Failure Modes

- Invalid JSON inbound payloads are ignored with warning log; channel remains open.
- Callback send failures are tolerated per-message to avoid tearing down the channel for transient write issues.
- On disconnect, poll task and callbacks are always canceled/unregistered in `finally` cleanup.

### Close Codes

- `4000`: invalid project name.
- `4004`: project missing from registry or missing directory.

## Assistant Chat

**Endpoint:** `/api/assistant/ws/{project_name}`  
**Implementing Artifact:** `ART-0105`

### Client -> Server

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `start` | optional `conversation_id` | Create or resume assistant session and stream opening response. |
| `message` | `content` | Send user message and stream assistant response chunks. |
| `answer` | `answers` | Resolve structured question prompts and continue stream. |
| `ping` | none | Heartbeat ping. |

### Server -> Client

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `conversation_created` | `conversation_id` | Emitted when a new conversation record is created. |
| `text` | `content` | Assistant response chunk stream. |
| `tool_call` | `tool`, `input` | Tool invocation telemetry for UI activity rendering. |
| `question` | `questions` | Structured question payload for UI answer form. |
| `response_done` | none | Marks completion of the current response stream. |
| `pong` | none | Heartbeat response. |
| `error` | `content` | Validation/session/protocol errors. |

### Ordering

- `start` precedes first streamed assistant chunks for new/resumed sessions.
- `question` may appear before `response_done`; client replies with `answer` to continue.
- `response_done` terminates a single response cycle; session remains open for additional messages.

### Failure Modes

- Missing/invalid session state on `message`/`answer` produces `error` with recovery hint (`send 'start' first`).
- Empty message content produces `error` and preserves socket session.
- Unknown message type and JSON decode failures produce explicit `error` payloads.

### Close Codes

- `4000`: invalid project name.
- `4004`: project missing from registry or missing directory.

## Spec Chat

**Endpoint:** `/api/spec/ws/{project_name}`  
**Implementing Artifact:** `ART-0113`

### Client -> Server

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `start` | none | Start session and stream first assistant/spec generation response. |
| `message` | `content` or `attachments[]` | User message payload; attachments are validated typed media payloads. |
| `answer` | `answers` (+ optional `tool_id`) | Structured response to question prompts. |
| `ping` | none | Heartbeat ping. |

### Server -> Client

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `text` | `content` | Assistant response chunk stream. |
| `question` | `questions` (+ optional `tool_id`) | Structured question payload requiring user answers. |
| `spec_complete` | `path` | Indicates primary spec artifact generation finished. |
| `file_written` | `path` | Indicates auxiliary file generation event. |
| `response_done` | none | Current stream segment complete. |
| `complete` | optional `path` | Session completion marker emitted after `response_done` if spec completed in cycle. |
| `pong` | none | Heartbeat response. |
| `error` | `content` | Validation/session/protocol/internal errors. |

### Ordering

- When `spec_complete` occurs during a response cycle, server defers final `complete` until `response_done` for that cycle.
- `response_done` always closes the active assistant stream segment.
- Multiple response cycles can occur on a single socket session.

### Failure Modes

- Invalid attachment payload fails fast with `error` and no stream invocation.
- Empty `message` without attachments produces `error`.
- Unknown message type and JSON parse failures emit `error` responses.

### Close Codes

- `4000`: invalid project name.
- `4004`: project missing from registry or missing directory.

## Expand Chat

**Endpoint:** `/api/expand/ws/{project_name}`  
**Implementing Artifact:** `ART-0107`

### Client -> Server

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `start` | none | Start or resume expansion session (idempotent semantics). |
| `message` | `content` or `attachments[]` | User expansion instructions and optional media attachments. |
| `done` | none | Explicit client signal to close planning loop and emit completion summary. |
| `ping` | none | Heartbeat ping. |

### Server -> Client

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `text` | `content` | Assistant response chunk stream. |
| `features_created` | `count`, `features[]` | Batch feature creation summary event. |
| `expansion_complete` | `total_added` | Explicit completion summary for session. |
| `response_done` | none | Current stream segment complete. |
| `pong` | none | Heartbeat response. |
| `error` | `content` | Validation/session/protocol/internal errors. |

### Ordering

- `start` on existing session emits resume text then `response_done` without recreating session state.
- `features_created` events can interleave with `text` streaming during generation.
- `done` triggers `expansion_complete` using current in-memory created feature count.

### Failure Modes

- Connection is rejected if project has no spec artifact prerequisite.
- Invalid attachments or empty `message` payloads return typed `error` and keep session alive.
- Unknown type or invalid JSON returns typed `error`.

### Close Codes

- `4000`: invalid project name.
- `4004`: missing project registry entry, missing project directory, or missing spec prerequisite.

## Terminal

**Endpoint:** `/api/terminal/ws/{project_name}/{terminal_id}`  
**Implementing Artifact:** `ART-0114`

### Client -> Server

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `resize` | `cols`, `rows` | Sets PTY dimensions; first valid resize is required before terminal start. |
| `input` | `data` (base64 bytes) | Sends keyboard/input bytes to PTY after terminal session is active. |
| `ping` | none | Heartbeat ping. |

### Server -> Client

| Type | Required Fields | Semantics |
| --- | --- | --- |
| `output` | `data` (base64 bytes) | PTY stdout/stderr byte stream chunks. |
| `exit` | `code` | Emitted when terminal session process exits. |
| `pong` | none | Heartbeat response. |
| `error` | `message` | Protocol/validation/runtime errors. |

### Ordering

- Socket accepts, validates identifiers, then binds output callback before entering receive loop.
- Initial `resize` is a hard prerequisite: input before startup returns `error` (`Terminal not ready - send resize first`).
- After start, `output` messages stream asynchronously; `exit` is emitted when session transitions inactive.

### Failure Modes

- Invalid base64 input, oversized input (>64KB encoded), and invalid resize dimensions return typed `error`.
- PTY start failure emits error then closes socket.
- Callback/task exceptions trigger cleanup and safe task cancellation.

### Close Codes

- `4000`: invalid project name or terminal ID.
- `4004`: project not found in registry/directory missing/terminal metadata missing.
- `4500`: terminal session failed to start after initial resize.

## Acceptance Checks

| Check ID | Assertion | Method | pass/fail rule |
| --- | --- | --- | --- |
| WS-AC-01 | Endpoint completeness is `5/5`. | Compare endpoint rows in `WEBSOCKET-ENDPOINT-MATRIX.md` against protocol sections in this document. | pass when all 5 matrix endpoints have matching contract sections with no extra/missing endpoint contracts. |
| WS-AC-02 | Message-type coverage is complete per endpoint. | For each endpoint, compare `Client -> Server` and `Server -> Client` type sets between matrix and contract tables. | pass when message sets are equal for every endpoint and all required fields are documented. |
| WS-AC-03 | `ordering` semantics are explicit for each channel. | Validate each endpoint section includes an `Ordering` subsection with deterministic event/lifecycle sequencing statements. | pass when all five endpoint sections include at least one ordering rule tied to concrete message types. |
| WS-AC-04 | `failure` semantics and `Close Codes` are explicit for each channel. | Validate each endpoint section includes `Failure Modes` and `Close Codes` with typed outcomes. | pass when all five endpoints document recoverable error paths and terminal close-code behavior. |
| WS-AC-05 | `frontend consumer parity` remains intact for project updates channel. | Compare documented project-updates message payloads against `ART-0225` (`ui/src/hooks/useWebSocket.ts`) and `ART-0229` message unions. | pass when every consumed message type/field in frontend consumer paths is represented in this contract set. |


## Cross-References

- Endpoint/message completeness source: `WEBSOCKET-ENDPOINT-MATRIX.md`
- REST companion contracts: `REST-API-CONTRACTS.md`
- Surface traceability binder: `SURFACE-TRACEABILITY.md`

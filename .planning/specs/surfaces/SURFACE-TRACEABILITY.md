# Surface Traceability

**Status:** Active  
**Phase:** 05 (Surface Contracts: API + WebSocket)  
**Purpose:** Bind surface contracts to implementing artifacts and frontend consumers.

## Canonical Surface Inputs

- REST inventory: `REST-API-ENDPOINT-MATRIX.md`
- WebSocket inventory: `WEBSOCKET-ENDPOINT-MATRIX.md`
- REST contract detail: `REST-API-CONTRACTS.md`
- WebSocket contract detail: `WEBSOCKET-CONTRACTS.md`

## REST Domain Traceability

| REST Domain | Surface Contract Artifacts | Backend Implementing ART IDs | Frontend Consumer ART IDs | Schema/Type Anchors |
| --- | --- | --- | --- | --- |
| Projects | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0110` | `ART-0226` | `ART-0115` |
| Features | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0108` | `ART-0226` | `ART-0115` |
| Agent | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0104` | `ART-0226` | `ART-0115` |
| Schedules | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0111` | `ART-0226` | `ART-0115` |
| DevServer | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0106` | `ART-0226` | `ART-0115` |
| Filesystem | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0109` | `ART-0226` | `ART-0115` |
| Settings | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0112` | `ART-0226` | `ART-0115` |
| Assistant | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0105` | `ART-0226` | `ART-0115` |
| Spec | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0113` | `ART-0226` | `ART-0115` |
| Expand | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0107` | `ART-0226` | `ART-0115` |
| Terminal | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0114` | `ART-0226` | `ART-0115` |
| Health + Setup | `REST-API-ENDPOINT-MATRIX.md`, `REST-API-CONTRACTS.md` | `ART-0102` | `ART-0226` | `ART-0115` |

## WebSocket Protocol Family Traceability

| WebSocket Family | Surface Contract Artifacts | Backend Implementing ART IDs | Frontend Consumer ART IDs | Schema/Type Anchors |
| --- | --- | --- | --- | --- |
| Project Updates | `WEBSOCKET-ENDPOINT-MATRIX.md`, `WEBSOCKET-CONTRACTS.md` | `ART-0102`, `ART-0131` | `ART-0225`, `ART-0229` | `ART-0115` |
| Assistant Chat | `WEBSOCKET-ENDPOINT-MATRIX.md`, `WEBSOCKET-CONTRACTS.md` | `ART-0105` | `ART-0229` | `ART-0115` |
| Spec Chat | `WEBSOCKET-ENDPOINT-MATRIX.md`, `WEBSOCKET-CONTRACTS.md` | `ART-0113` | `ART-0229` | `ART-0115` |
| Expand Chat | `WEBSOCKET-ENDPOINT-MATRIX.md`, `WEBSOCKET-CONTRACTS.md` | `ART-0107` | `ART-0229` | `ART-0115` |
| Terminal I/O | `WEBSOCKET-ENDPOINT-MATRIX.md`, `WEBSOCKET-CONTRACTS.md` | `ART-0114` | `ART-0229` | `ART-0115` |

## Contract-to-Implementation Binding Rules

- Every surface row must have at least one backend implementing `ART-####` reference and at least one contract artifact reference.
- Project-updates realtime parity requires both `ART-0225` (hook behavior) and `ART-0229` (message unions).
- REST parity requires `ART-0226` for route/method consumer coverage plus `ART-0115` payload type anchors.

## Coverage Statement

- REST domains covered: 13/13
- WebSocket protocol families covered: 5/5
- Required backend artifact span covered: `ART-0102`..`ART-0115`, `ART-0131`
- Required frontend consumer anchors covered: `ART-0225`, `ART-0226`, `ART-0229`

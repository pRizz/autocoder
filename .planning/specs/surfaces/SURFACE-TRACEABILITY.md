# Surface Traceability

**Status:** Active  
**Phase:** 06 (Surface Contracts: Data + Process + Security)  
**Purpose:** Bind transport + data + lifecycle + security contracts to implementing artifacts and frontend consumers.

## Canonical Surface Inputs

- REST inventory: `REST-API-ENDPOINT-MATRIX.md`
- WebSocket inventory: `WEBSOCKET-ENDPOINT-MATRIX.md`
- REST contract detail: `REST-API-CONTRACTS.md`
- WebSocket contract detail: `WEBSOCKET-CONTRACTS.md`
- Data lane: `DATA-PERSISTENCE-MATRIX.md`, `DATA-PERSISTENCE-CONTRACTS.md`
- Process lane: `PROCESS-LIFECYCLE-MATRIX.md`, `PROCESS-LIFECYCLE-CONTRACTS.md`
- Security lane: `SECURITY-POLICY-MATRIX.md`, `SECURITY-POLICY-CONTRACTS.md`

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

## Data Traceability

| Data Family | Surface Contract Artifacts | Backend Implementing ART IDs | Related Transport/Consumer Anchors |
| --- | --- | --- | --- |
| Feature persistence | `DATA-PERSISTENCE-MATRIX.md`, `DATA-PERSISTENCE-CONTRACTS.md` | `ART-0075`, `ART-0077` | REST `Features`, `Projects`, `Schedules` domains via `ART-0108`, `ART-0110`, `ART-0111` |
| Schedule persistence | `DATA-PERSISTENCE-MATRIX.md`, `DATA-PERSISTENCE-CONTRACTS.md` | `ART-0075` | REST `Schedules` + process lane scheduler semantics (`ART-0111`, `ART-0124`) |
| Assistant conversation persistence | `DATA-PERSISTENCE-MATRIX.md`, `DATA-PERSISTENCE-CONTRACTS.md` | `ART-0118` | Assistant REST/WebSocket families via `ART-0105` |

## Process Traceability

| Process Family | Surface Contract Artifacts | Backend Implementing ART IDs | Related Surface Anchors |
| --- | --- | --- | --- |
| Agent orchestration lifecycle | `PROCESS-LIFECYCLE-MATRIX.md`, `PROCESS-LIFECYCLE-CONTRACTS.md` | `ART-0122`, `ART-0104`, `ART-0128` | REST Agent domain + Project Updates websocket |
| Scheduler lifecycle | `PROCESS-LIFECYCLE-MATRIX.md`, `PROCESS-LIFECYCLE-CONTRACTS.md` | `ART-0124`, `ART-0111`, `ART-0075` | REST Schedules domain |
| DevServer + Terminal lifecycle | `PROCESS-LIFECYCLE-MATRIX.md`, `PROCESS-LIFECYCLE-CONTRACTS.md` | `ART-0120`, `ART-0126`, `ART-0106`, `ART-0114` | REST DevServer/Terminal + Terminal websocket |
| Chat session lifecycle | `PROCESS-LIFECYCLE-MATRIX.md`, `PROCESS-LIFECYCLE-CONTRACTS.md` | `ART-0117`, `ART-0121`, `ART-0125`, `ART-0105`, `ART-0107`, `ART-0113` | Assistant/Spec/Expand websocket families |

## Security Traceability

| Security Family | Surface Contract Artifacts | Backend Implementing/Test ART IDs | Related Surface Anchors |
| --- | --- | --- | --- |
| Command policy and validation | `SECURITY-POLICY-MATRIX.md`, `SECURITY-POLICY-CONTRACTS.md` | `ART-0100`, `ART-0106`, `ART-0120`, `ART-0141`, `ART-0143`, `ART-0144` | Agent/devserver command entry points |
| Filesystem/path trust boundaries | `SECURITY-POLICY-MATRIX.md`, `SECURITY-POLICY-CONTRACTS.md` | `ART-0109`, `ART-0100`, `ART-0130`, `ART-0143`, `ART-0144` | REST Filesystem domain |
| Localhost/remote policy + auth/rate-limit resilience | `SECURITY-POLICY-MATRIX.md`, `SECURITY-POLICY-CONTRACTS.md` | `ART-0102`, `ART-0078`, `ART-0096`, `ART-0142`, `ART-0143`, `ART-0144` | Global service boundary and operational behavior |

## Contract-to-Implementation Binding Rules

- Every contract family row must include at least one implementing `ART-####` reference.
- Data, Process, and Security families must each reference their lane matrix and lane contract documents.
- Security family rows must include at least one test evidence anchor (`ART-0141`..`ART-0144`).
- Transport parity continues to require frontend anchors `ART-0225`, `ART-0226`, and `ART-0229`.

## Coverage Statement

- REST domains covered: 13/13
- WebSocket protocol families covered: 5/5
- Data families covered: 3/3
- Process families covered: 4/4
- Security families covered: 3/3
- Required backend implementation anchors covered: `ART-0075`, `ART-0077`, `ART-0078`, `ART-0096`, `ART-0100`, `ART-0102`, `ART-0104`..`ART-0115`, `ART-0117`, `ART-0118`, `ART-0120`, `ART-0121`, `ART-0122`, `ART-0124`, `ART-0125`, `ART-0126`, `ART-0128`, `ART-0130`, `ART-0131`
- Required security test anchors covered: `ART-0141`, `ART-0142`, `ART-0143`, `ART-0144`
- Required frontend consumer anchors covered: `ART-0225`, `ART-0226`, `ART-0229`

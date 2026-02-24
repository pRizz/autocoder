# Phase 5: Surface Contracts (API + WebSocket) - Research

**Researched:** 2026-02-24
**Domain:** External API and realtime protocol contract specification
**Confidence:** HIGH

<user_constraints>
## User Constraints (active project context)

- Generate markdown/spec artifacts only; do not edit source implementation files.
- Preserve parity intent: contracts must describe the current external surface 1:1.
- Keep artifact traceability anchored to canonical inventory IDs (`ART-####`).
- Phase 5 must consume Phase 4 file-contract corpus as required prerequisite evidence.
</user_constraints>

<research_summary>
## Summary

Phase 5 should convert implemented HTTP and WebSocket behavior into authoritative surface contracts that regeneration agents can execute against.

Observed backend surface size:
- REST/API endpoints: **68** (`server/routers/*.py` + `/api/health` + `/api/setup/status` in `server/main.py`)
- WebSocket endpoints: **5**
  - `/ws/projects/{project_name}` (`server/websocket.py`, mounted in `server/main.py`)
  - `/api/assistant/ws/{project_name}`
  - `/api/spec/ws/{project_name}`
  - `/api/expand/ws/{project_name}`
  - `/api/terminal/ws/{project_name}/{terminal_id}`

Observed protocol shape:
- REST contracts are implemented in router modules (`ART-0104`..`ART-0114`) and typed primarily through `server/schemas.py` (`ART-0115`).
- WebSocket message unions are documented in router docstrings and mirrored in frontend types (`ART-0229`) and consumers (`ART-0225`).

**Primary recommendation:** Build Phase 5 in two parallel contract lanes (REST and WebSocket), then merge through a traceability/acceptance linkage plan tying each surface contract back to Phase 4 file contracts and executable checks.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Artifact/Tool | Purpose | Why |
|---------------|---------|-----|
| Markdown surface contract docs | Authoritative API/protocol specs | Human + agent readable and diff-friendly |
| Endpoint/message matrices | Deterministic inventory of surfaces | Prevents omissions and supports pass/fail auditing |
| `rg`-based checks | Structural validation of required sections/tokens | Fast and reproducible |

### Supporting
| Artifact | Purpose |
|----------|---------|
| Phase 4 file-contract corpus (`.planning/specs/contracts/**`) | Source-of-truth file-level behavior links |
| `server/schemas.py` + `ui/src/lib/types.ts` | Payload/message shape anchors |
| `ui/src/lib/api.ts` + `ui/src/hooks/useWebSocket.ts` | Client-side consumption and compatibility evidence |

No additional dependencies are required.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Inventory-first surface capture
Start with deterministic endpoint/message inventories before prose contracts:
- REST matrix: method + path + implementing artifact + schema references
- WebSocket matrix: endpoint + message types + direction + lifecycle notes

### Pattern 2: Contract docs by protocol family
Separate protocol families for clarity and quality gates:
- `REST-API-*` artifacts for routes/payloads/status/error behavior
- `WEBSOCKET-*` artifacts for message schemas/order/heartbeat/failure modes

### Pattern 3: Traceability closure pass
Final pass links surface contracts to:
- implementing file contracts (Phase 4 corpus)
- frontend consumers
- acceptance checks
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Surface completeness | Ad-hoc route notes | Matrix generated from router decorators + websocket endpoints |
| Payload contract certainty | Guessing request/response shapes | Use `server/schemas.py` and router `response_model` declarations |
| Realtime contract certainty | UI-only event inference | Combine backend websocket send/receive behavior with frontend type unions |

Key insight: objective inventories first, narrative contracts second.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Missing non-project surfaces
It is easy to focus only on `/api/projects/*` and miss global settings/filesystem/spec/assistant/expand endpoints.

### Pitfall 2: Partial websocket coverage
Project status websocket (`/ws/projects/{project_name}`) is only one of five websocket protocols; assistant/spec/expand/terminal streams must be captured too.

### Pitfall 3: Contracts detached from file corpus
Surface docs without explicit links to `ART-####` file contracts reduce regeneration executability and auditability.
</common_pitfalls>

<code_examples>
## Code Examples

### REST/WebSocket decorator discovery
```bash
rg -n '@router\.(get|post|put|patch|delete|websocket)\(' server/routers/*.py
rg -n '@app\.(get|websocket)\(' server/main.py
```

### WebSocket protocol event discovery
```bash
rg -n 'send_json|receive_text|\"type\"' server/websocket.py server/routers/*.py
rg -n 'switch \(message.type\)|type:' ui/src/hooks/useWebSocket.ts ui/src/lib/types.ts
```

### Docs-only guardrail
```bash
git diff --name-only | rg -v '^\.planning/'
```
</code_examples>

<open_questions>
## Open Questions

1. Should Phase 5 include only externally consumed routes/events or all exposed internal automation surfaces? Recommendation: include all publicly mounted FastAPI and WebSocket routes.
2. Should websocket contracts include close-code semantics? Recommendation: yes for endpoints that explicitly close with typed reasons/codes.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/ROADMAP.md` (Phase 5 goal/requirements/plans)
- `.planning/REQUIREMENTS.md` (`SURF-01`, `SURF-02`)
- `server/main.py` (`ART-0102`) mounted routes and top-level websocket
- `server/routers/*.py` (`ART-0104`..`ART-0114`) endpoint and protocol implementations
- `server/websocket.py` (`ART-0131`) project realtime stream protocol
- `server/schemas.py` (`ART-0115`) API payload schema definitions
- `ui/src/lib/api.ts` (`ART-0226`) REST client call surface
- `ui/src/hooks/useWebSocket.ts` (`ART-0225`) realtime consumer behavior
- `ui/src/lib/types.ts` (`ART-0229`) client-side message/type contracts

### Secondary (MEDIUM confidence)
- Phase 4 corpus artifacts under `.planning/specs/contracts/**` for file-level traceability linkage

### Surface count snapshot
- REST/API endpoints: 68
- WebSocket endpoints: 5
</sources>

<metadata>
## Metadata

**Research scope:**
- REST route contract capture strategy
- WebSocket protocol contract capture strategy
- Traceability linkage strategy for Phase 5 closeout

**Confidence breakdown:**
- Surface inventory confidence: HIGH
- Payload/message mapping confidence: HIGH
- Cross-link strategy confidence: HIGH

**Research date:** 2026-02-24
**Valid until:** 2026-03-25
</metadata>

---

*Phase: 05-surface-contracts-api-and-websocket*
*Research completed: 2026-02-24*
*Ready for planning: yes*

# Phase 7: TS/Bun/Solid Parity Matrix and Discrepancies - Research

**Researched:** 2026-02-28
**Domain:** Full old-to-new parity mapping and migration discrepancy/risk framing
**Confidence:** HIGH

<user_constraints>
## User Constraints (active project context)

- Generate markdown/spec artifacts only; do not edit source implementation files.
- Preserve intended external behavior 1:1 while changing implementation stack.
- Target implementation must be pure TypeScript on Bun with SolidJS UI.
- Maintain canonical traceability using artifact IDs (`ART-####`) and requirement IDs.
- Keep non-TypeScript assets (docs, workflows, scripts, configs) in parity scope.
</user_constraints>

<research_summary>
## Summary

Phase 7 is a translation-control phase between completed behavior contracts (Phases 4-6) and reconstruction execution planning (Phase 8). The phase must convert current artifact-level truth into explicit TS/Bun/Solid target mappings, then document discrepancy and risk controls without changing current surface behavior.

Canonical baseline evidence is already complete:
- Artifact universe: `237` in-scope units (`FILE-CONTRACT-COVERAGE.md`)
- Lane totals: backend `56`, frontend `93`, non-TS `88`
- Surface totals: REST `68`, WebSocket `5`, data `12`, process `12`, security `15`

Because scope and behavior are already captured, Phase 7 should focus on four deterministic outputs:
1. ART-level parity matrix (`MIGR-01`)
2. TS/Bun/Solid implementation notes by parity cluster (`MIGR-02`, `MIGR-04`)
3. Intended-vs-observed discrepancy ledger (`MIGR-03`, `MIGR-04`)
4. Risk/mitigation annotations tied to mapped units plus acceptance/index closure (`MIGR-05`)

**Primary recommendation:** Build the matrix first (single canonical source), then run implementation-notes and discrepancy-ledger tracks in parallel, and finish with a risk + acceptance + index closure pass.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Artifact/Tool | Purpose | Why |
|---------------|---------|-----|
| `TS-BUN-SOLID-PARITY-MATRIX.md` | Canonical old-to-new mapping for all ART units | Enforces complete 1:1 mapping accountability |
| `TS-BUN-SOLID-IMPLEMENTATION-NOTES.md` | Target-stack implementation direction by cluster | Converts mapping rows into actionable migration guidance |
| `INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md` | Explicit discrepancy accounting | Prevents silent behavior drift |
| `PARITY-RISK-REGISTER.md` + acceptance/index updates | Risk governance and handoff gating | Makes Phase 8 planning objective and auditable |

### Supporting
| Artifact | Purpose |
|----------|---------|
| `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md` | Canonical 237/237 completeness baseline |
| `.planning/specs/contracts/*-MATRIX.md` | Source lane partitioning (56/93/88) |
| `.planning/specs/surfaces/*.md` | External behavior contracts that must remain 1:1 |
| `.planning/specs/INDEX.md` | Canonical corpus entrypoint and prerequisite wiring |

No runtime dependency changes are needed in this phase. All work is markdown-only.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: ART-first parity mapping
Every parity row should be anchored by `ART-####`, not by path-only references.

### Pattern 2: Dual-level mapping model
- Row level: per-artifact target ownership and stack destination
- Cluster level: implementation strategy for grouped capabilities

### Pattern 3: Surface-preservation contract
Every mapping/discrepancy decision must explicitly state whether API/WebSocket/command/ops surfaces are preserved 1:1.

### Pattern 4: Discrepancy before risk closure
Record intended-vs-observed deltas before assigning risk severity and mitigation.

### Pattern 5: Gate-driven handoff
Phase 7 should end with objective acceptance checks tied directly to `MIGR-01..MIGR-05` and explicit Phase 8 prerequisites.
</architecture_patterns>

<dont_hand_roll>
## Do Not Hand-Roll

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Mapping completeness claims | Narrative coverage statements | Deterministic ART row counts (`237/237`) |
| Target-stack migration guidance | Generic rewrite notes | Clustered TS/Bun/Solid implementation notes linked to parity rows |
| Discrepancy handling | Ad hoc caveats in prose | Structured discrepancy ledger with IDs and decisions |
| Risk closure | Unlinked risk list | Risk register linked to matrix/discrepancy units and acceptance gates |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Incomplete parity rows
If any ART ID is missing from the parity matrix, MIGR-01 is not satisfied.

### Pitfall 2: Framework migration without behavior anchors
SolidJS/Bun direction must still reference existing API/WebSocket/data/process/security contracts.

### Pitfall 3: Discrepancies mixed with risks
Keep discrepancies (what differs) separate from risk (what could fail), then link them.

### Pitfall 4: Non-TS artifacts treated as out of scope
Docs/workflows/scripts/configs remain in-scope and need parity treatment.

### Pitfall 5: Missing Phase 8 handoff wiring
If parity corpus is not indexed as required prerequisites, reconstruction planning can drift.
</common_pitfalls>

<code_examples>
## Code Examples

### Confirm canonical artifact totals
```bash
rg -n '^\| ART-[0-9]{4} \|' .planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md | wc -l
rg -n '^\| ART-[0-9]{4} \|' .planning/specs/contracts/FRONTEND-UI-MATRIX.md | wc -l
rg -n '^\| ART-[0-9]{4} \|' .planning/specs/contracts/NON-TS-MATRIX.md | wc -l
```

### Confirm surface contract baselines
```bash
rg -n '^\| `?(GET|POST|PUT|PATCH|DELETE)' .planning/specs/surfaces/REST-API-ENDPOINT-MATRIX.md | wc -l
rg -n '^\| /' .planning/specs/surfaces/WEBSOCKET-ENDPOINT-MATRIX.md | wc -l
rg -n '^\| [DPS][0-9]{2} \|' .planning/specs/surfaces/DATA-PERSISTENCE-MATRIX.md .planning/specs/surfaces/PROCESS-LIFECYCLE-MATRIX.md .planning/specs/surfaces/SECURITY-POLICY-MATRIX.md
```

### Docs-only guardrail
```bash
git diff --name-only | rg -v '^\.planning/'
```
</code_examples>

<open_questions>
## Open Questions

1. Row granularity: should one ART map to exactly one target module or allow one-to-many?
   - Recommendation: one parity row per ART with optional one-to-many target references in a structured field.
2. Python-specific behavior: what if behavior exists only due to Python runtime quirks?
   - Recommendation: mark as discrepancy entry and keep external surface behavior preserved unless explicitly waived later.
3. Risk cardinality: annotate every row or by cluster?
   - Recommendation: cluster-level risk definitions plus row-level linkage field for deterministic coverage.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/ROADMAP.md` (Phase 7 goal, requirements, plan structure)
- `.planning/REQUIREMENTS.md` (`MIGR-01..MIGR-05`)
- `.planning/STATE.md` (current phase focus and prerequisites)
- `.planning/PROJECT.md` (target stack and constraints)
- `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md` (237/237 baseline)
- `.planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md`
- `.planning/specs/contracts/FRONTEND-UI-MATRIX.md`
- `.planning/specs/contracts/NON-TS-MATRIX.md`
- `.planning/specs/surfaces/REST-API-ENDPOINT-MATRIX.md`
- `.planning/specs/surfaces/WEBSOCKET-ENDPOINT-MATRIX.md`
- `.planning/specs/surfaces/DATA-PERSISTENCE-MATRIX.md`
- `.planning/specs/surfaces/PROCESS-LIFECYCLE-MATRIX.md`
- `.planning/specs/surfaces/SECURITY-POLICY-MATRIX.md`
- `.planning/specs/surfaces/SURFACE-TRACEABILITY.md`
- `.planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md`
- `.planning/specs/surfaces/SURFACE-CROSS-CONTRACT-CONSISTENCY.md`
- `.planning/specs/INDEX.md`

### Secondary (MEDIUM confidence)
- `.planning/specs/INVENTORY.md`
- `.planning/specs/COVERAGE-AUDIT.md`
- `.planning/specs/POLICY.md`
- `.planning/specs/GUARDRAILS.md`
</sources>

<metadata>
## Metadata

**Research scope:**
- Complete ART-level old-to-new mapping strategy
- TS/Bun/Solid implementation-direction framing
- Discrepancy and risk closure model
- Phase 8 prerequisite handoff model

**Confidence breakdown:**
- Parity matrix planning confidence: HIGH
- Implementation-notes planning confidence: HIGH
- Discrepancy-ledger planning confidence: HIGH
- Risk/acceptance closure planning confidence: HIGH

**Research date:** 2026-02-28
**Valid until:** 2026-03-31
</metadata>

---

*Phase: 07-ts-bun-solid-parity-matrix-and-discrepancies*
*Research completed: 2026-02-28*
*Ready for planning: yes*

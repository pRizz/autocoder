# Phase 8: Reconstruction Checklist & Acceptance Gates - Research

**Researched:** 2026-02-28
**Domain:** Reconstruction-wave sequencing, requirement-level acceptance mapping, and final readiness gate
**Confidence:** HIGH

<user_constraints>
## User Constraints (active project context)

- Generate markdown/spec artifacts only; do not edit source implementation files.
- Preserve intended external product/API/command behavior 1:1 during future regeneration.
- Target implementation direction remains pure TypeScript on Bun with SolidJS.
- Include non-TypeScript operational artifacts in reconstruction flow and acceptance coverage.
- Keep canonical traceability via requirement IDs and artifact IDs (`ART-####`).
</user_constraints>

<research_summary>
## Summary

Phase 8 is a closure-and-handoff phase. It should transform completed corpus artifacts from Phases 1-7 into an executable reconstruction program that can be applied to an empty repository with objective pass/fail gates.

Key available inputs:
- Inventory and file-contract corpus completeness: `237/237`
- Surface contract corpus: REST (`68`), WebSocket (`5`), data/process/security (`12/12/15`)
- Parity corpus: matrix (`237/237`), implementation clusters (`C01`..`C12`), discrepancy ledger (`16/16`), risk register (`12/12`)

Phase 8 should produce three deterministic artifacts aligned to roadmap plans:
1. Dependency-ordered reconstruction waves (`VERI-01`)
2. Requirement-to-acceptance traceability for all v1 requirements (`VERI-02`)
3. End-to-end parity scenarios plus final ready-to-regenerate gate (`VERI-03`, `VERI-04`)

**Primary recommendation:** run two parallel documentation lanes in wave 1 (reconstruction waves + requirement acceptance mapping), then close in wave 2 with parity scenario suite and final readiness gate tied to all prior acceptance ledgers.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Artifact/Tool | Purpose | Why |
|---------------|---------|-----|
| `RECONSTRUCTION-WAVES.md` | Ordered implementation sequence from empty repo to parity | Converts corpus into actionable execution order |
| `REQUIREMENT-ACCEPTANCE-TRACEABILITY.md` | Requirement-level gate mapping for all 24 v1 requirements | Guarantees coverage completeness |
| `PARITY-E2E-SCENARIOS.md` | Scenario-based parity validation across workflows and ops | Ensures cross-phase behavior confidence |
| `READY-TO-REGENERATE-GATE.md` | Final go/no-go rubric | Provides objective completion signal |

### Supporting
| Artifact | Purpose |
|----------|---------|
| `.planning/specs/INDEX.md` | Corpus discoverability and phase handoff wiring |
| `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md` | Canonical 237/237 file-level baseline |
| `.planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md` | Surface-level acceptance baseline |
| `.planning/specs/parity/PARITY-ACCEPTANCE-CHECKS.md` | Migration-level acceptance baseline |

No runtime dependencies are introduced. Phase remains markdown-only.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Wave-first execution framing
Represent reconstruction as deterministic waves (`W##`) with explicit prerequisites, outputs, and blocker criteria.

### Pattern 2: Requirement-complete acceptance mapping
Map every v1 requirement (`24/24`) to at least one objective acceptance signal and evidence artifact.

### Pattern 3: Scenario-backed readiness
Final readiness must require end-to-end scenario pass results, not only document completeness.

### Pattern 4: Gate composition
Ready-to-regenerate decision composes lower-level gates:
- file/inventory coverage gates
- surface contract gates
- parity/discrepancy/risk gates
- reconstruction-wave completion gates
</architecture_patterns>

<dont_hand_roll>
## Do Not Hand-Roll

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Reconstruction ordering | Narrative sequencing prose | Explicit wave matrix with dependency edges |
| Requirement coverage claims | Informal “covered” statements | 24-row traceability matrix with evidence pointers |
| Readiness decision | Subjective confidence summary | Objective go/no-go checklist with blocker criteria |
| End-to-end parity claims | Single-path happy-flow note | Multi-scenario suite spanning API, realtime, lifecycle, security, and ops |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Missing dependency gates between waves
If wave prerequisites are not explicit, regeneration becomes non-deterministic.

### Pitfall 2: VERI-02 mapped to partial requirements
Phase 8 must map all v1 requirement IDs (`24/24`), not only VERI requirements.

### Pitfall 3: Scenarios that omit ops behavior
Parity validation must include operational and process/security behaviors, not only UI/API flows.

### Pitfall 4: Final gate without objective blockers
A readiness gate must define hard fail conditions and required evidence artifacts.
</common_pitfalls>

<code_examples>
## Code Examples

### Requirement count baseline
```bash
rg -n '^- \[.\] \*\*[A-Z]+-[0-9]{2}\*\*:' .planning/REQUIREMENTS.md | wc -l
```

### Existing acceptance baseline discovery
```bash
rg -n 'MIGR-|SURF-|pass/fail' .planning/specs/parity/PARITY-ACCEPTANCE-CHECKS.md .planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md
```

### Docs-only guardrail
```bash
git diff --name-only | rg -v '^\.planning/'
```
</code_examples>

<open_questions>
## Open Questions

1. Should reconstruction waves be capability-first or layer-first?
   - Recommendation: capability-first with dependency annotations, because acceptance gates are capability-centric.
2. Should VERI traceability point to current evidence only or include future regeneration-test evidence placeholders?
   - Recommendation: include both current evidence and expected regeneration evidence fields.
3. Should readiness gate allow conditional pass states?
   - Recommendation: support only pass/fail/blocker; defer conditional states to discrepancy governance.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/ROADMAP.md` (Phase 8 goal/requirements/plans)
- `.planning/REQUIREMENTS.md` (`VERI-01`..`VERI-04` and full v1 requirement inventory)
- `.planning/STATE.md` (phase focus, constraints)
- `.planning/PROJECT.md` (core value and constraints)
- `.planning/specs/INDEX.md` (canonical corpus and prerequisites)
- `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md`
- `.planning/specs/surfaces/SURFACE-ACCEPTANCE-CHECKS.md`
- `.planning/specs/parity/PARITY-ACCEPTANCE-CHECKS.md`
- `.planning/specs/parity/TS-BUN-SOLID-PARITY-MATRIX.md`
- `.planning/specs/parity/TS-BUN-SOLID-IMPLEMENTATION-NOTES.md`
- `.planning/specs/parity/INTENDED-VS-OBSERVED-DISCREPANCY-LEDGER.md`
- `.planning/specs/parity/PARITY-RISK-REGISTER.md`

### Secondary (MEDIUM confidence)
- `.planning/specs/surfaces/SURFACE-TRACEABILITY.md`
- `.planning/specs/surfaces/SURFACE-CROSS-CONTRACT-CONSISTENCY.md`
- `.planning/specs/COVERAGE-AUDIT.md`
</sources>

<metadata>
## Metadata

**Research scope:**
- Reconstruction-wave sequencing model
- Full requirement acceptance traceability model
- End-to-end scenario + readiness gate model

**Confidence breakdown:**
- Reconstruction-wave planning confidence: HIGH
- Requirement traceability planning confidence: HIGH
- Readiness-gate planning confidence: HIGH

**Research date:** 2026-02-28
**Valid until:** 2026-03-31
</metadata>

---

*Phase: 08-reconstruction-checklist-and-acceptance-gates*
*Research completed: 2026-02-28*
*Ready for planning: yes*

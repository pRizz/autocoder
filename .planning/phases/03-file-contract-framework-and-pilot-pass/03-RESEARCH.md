# Phase 3: File Contract Framework & Pilot Pass - Research

**Researched:** 2026-02-24
**Domain:** File-level contract specification design and pilot validation for regeneration-oriented documentation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

No user constraints - all decisions at Claude's discretion

Additional constraints sourced from project state and requirements:
- No implementation source file edits; outputs must remain planning/spec artifacts.
- Contracts must support 1:1 regeneration intent from empty repository context.
- Artifact IDs (`ART-####`) remain canonical references for all file-spec records.
</user_constraints>

<research_summary>
## Summary

Phase 3 should establish a reusable file-contract schema before scaling to full corpus capture in Phase 4. The schema must be strict enough for regeneration agents to execute from it, but lightweight enough for high-volume authoring. For this phase, the key is to lock required fields and prove them on a pilot set spanning code and non-code subsystem types.

A practical pattern is a two-layer framework: (1) canonical schema definition document specifying mandatory fields and acceptance checks, and (2) authoring conventions document specifying naming, linking, and quality gate rules. Pilot specs then validate the framework against representative artifacts (backend code, frontend code, docs, workflow, script).

**Primary recommendation:** Define a mandatory file-spec schema that explicitly covers purpose/ownership, inputs/outputs, side effects, and direct dependencies, then apply it to a small multi-subsystem pilot set and run a structured review before Phase 4 expansion.
</research_summary>

<standard_stack>
## Standard Stack

The established tools/patterns for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Markdown contract specs | N/A | Human + agent-readable file contracts | Portable, diff-friendly, versionable in git |
| Inventory IDs (`ART-####`) | N/A | Stable cross-file reference mechanism | Decouples contract identity from path drift |
| `rg` / shell checks | N/A | Deterministic structure validation | Fast quality gates for required sections/tokens |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Pilot matrix table | N/A | Ensure subsystem representation coverage | During framework validation (Phase 3) |
| Review report rubric | N/A | Evaluate schema executability and gaps | Before finalizing schema for Phase 4 |
| Index linking | N/A | Canonical navigation and dependency signaling | After any new framework artifact is introduced |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Strict template schema | Free-form narrative specs | Faster authoring initially but inconsistent and hard to automate |
| Pilot-first validation | Immediate full-corpus capture | Faster breadth but high risk of schema rework and inconsistent entries |

**Installation:**
```bash
# No additional dependencies required.
# Use existing markdown + shell verification workflow.
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
.planning/specs/
├── FILE-SPEC-SCHEMA.md          # canonical schema fields and required sections
├── FILE-SPEC-AUTHORING.md       # naming, linking, and quality rules
├── FILE-SPEC-REVIEW.md          # pilot review outcomes and final decisions
└── pilot/
    ├── ART-xxxx-*.md            # pilot file contract entries
    └── PILOT-MATRIX.md          # subsystem coverage matrix + status
```

### Pattern 1: Schema + Conventions Split
**What:** Separate field-level schema from authoring process/guidelines.
**When to use:** Any large-scale documentation effort where consistency and speed both matter.
**Example:**
```text
Schema: mandatory contract fields and acceptance checks
Conventions: file naming, link format, reference rules, review gate
```

### Pattern 2: Representative Pilot Set
**What:** Validate schema against one artifact per key subsystem type before broad rollout.
**When to use:** Prior to Phase 4 exhaustive capture.
**Example:**
```text
Pilot set: backend source, frontend source, docs, workflow, operations script
```

### Anti-Patterns to Avoid
- **Schema-less pilots:** produces hard-to-compare artifacts and weak verification.
- **Code-only pilots:** misses non-TypeScript artifact contract expectations.
- **Path-only references:** breaks traceability when paths or file organization evolves.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contract identity | Ad-hoc per-file labels | Reuse `ART-####` IDs from inventory | Guarantees consistent traceability across phases |
| Schema validation | Manual reviewer intuition only | Required-section + token checks via `rg` | Objective and repeatable quality gate |
| Pilot completeness proof | Informal “looks representative” note | Pilot matrix with subsystem tags and pass status | Prevents blind spots before full rollout |

**Key insight:** Strong schema and objective validation checks early reduce rework and improve downstream regeneration quality.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Overly abstract contracts
**What goes wrong:** Specs describe intent but omit concrete inputs/outputs/dependencies.
**Why it happens:** Template focuses on narrative purpose only.
**How to avoid:** Make I/O/side-effects/dependencies mandatory schema fields.
**Warning signs:** Frequent “depends on implementation context” statements.

### Pitfall 2: Pilot set bias
**What goes wrong:** Pilot validates schema on one subsystem only.
**Why it happens:** Easy to start with code files and ignore docs/workflows/scripts.
**How to avoid:** Require one pilot artifact per key subsystem type in matrix.
**Warning signs:** Pilot folder contains only runtime source contracts.

### Pitfall 3: Non-executable specs
**What goes wrong:** Regeneration agents cannot infer implementation steps from contract fields.
**Why it happens:** Missing acceptance checks and dependency links.
**How to avoid:** Add regeneration-agent checklist and required acceptance section.
**Warning signs:** Reviewer cannot map contract to build order or verification actions.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from local workflow conventions:

### Required-section validation
```bash
rg -n "^## Purpose|^## Ownership|^## Inputs|^## Outputs|^## Side Effects|^## Direct Dependencies" .planning/specs/pilot/*.md
```

### Pilot coverage matrix sanity check
```bash
rg -n "Backend Source|Frontend Source|Documentation|Workflow|Operations Script" .planning/specs/pilot/PILOT-MATRIX.md
```

### Docs-only guardrail verification
```bash
git diff --name-only | rg -v '^\.planning/'
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Narrative architecture docs | Contract-driven spec sets with explicit field schemas | Recent LLM-assisted build workflows | More reliable automation and verification |
| One-pass documentation | Pilot-then-scale methodology | Recent autonomous planning workflows | Reduced large-scale rework and template drift |

**New tools/patterns to consider:**
- Machine-checkable section schemas for markdown artifacts.
- Requirement-linked contract metadata for phase-level verification.

**Deprecated/outdated:**
- Free-form file notes without standard sections.
- “Document all files first, validate schema later” approach.
</sota_updates>

<open_questions>
## Open Questions

1. **Pilot size boundary**
   - What we know: pilot must cover key subsystem types.
   - What's unclear: exact number of pilot entries needed for confidence.
   - Recommendation: keep Phase 3 pilot tight (5-8 entries) but type-complete.

2. **Schema strictness vs authoring speed**
   - What we know: strict schema improves consistency.
   - What's unclear: how much optional context to allow without slowing Phase 4.
   - Recommendation: keep core sections mandatory and allow concise optional notes.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/ROADMAP.md` — Phase 3 goal/success criteria
- `.planning/REQUIREMENTS.md` — `FILE-01`, `FILE-02`
- `.planning/specs/INVENTORY.md` — pilot candidate artifacts and IDs
- `.planning/specs/INDEX.md` and existing phase artifacts — current spec corpus organization

### Secondary (MEDIUM confidence)
- Existing local planning patterns from Phases 1-2 (schema-like markdown governance)

### Tertiary (LOW confidence - needs validation)
- Optional CI automation for schema linting in later governance phases
</sources>

<metadata>
## Metadata

**Research scope:**
- File-spec schema design
- Authoring convention strategy
- Pilot validation structure
- Verification approach for schema executability

**Confidence breakdown:**
- Standard stack: HIGH - aligns with established planning workflow
- Architecture: HIGH - directly tied to roadmap success criteria
- Pitfalls: HIGH - typical in contract-framework rollout
- Code examples: MEDIUM - section checks validated; exact final template fields finalized in plans

**Research date:** 2026-02-24
**Valid until:** 2026-03-25
</metadata>

---

*Phase: 03-file-contract-framework-and-pilot-pass*
*Research completed: 2026-02-24*
*Ready for planning: yes*

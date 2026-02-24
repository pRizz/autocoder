# Phase 1: Scope Policy, Inventory, and Guardrails - Research

**Researched:** 2026-02-24
**Domain:** Documentation architecture, repository inventorying, and execution guardrail enforcement
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

**CRITICAL:** If CONTEXT.md exists from /gsd:discuss-phase, copy locked decisions here verbatim. These MUST be honored by the planner.

No user constraints - all decisions at Claude's discretion

Additional constraints sourced from PROJECT.md and REQUIREMENTS.md for this phase:
- Specs must cover source + ops artifacts, excluding generated/runtime artifacts.
- This initiative is docs-only for execution: no source implementation file modifications.
- Output must be AI-first and deterministic for reconstruction.
</user_constraints>

<research_summary>
## Summary

Phase 1 should produce three durable foundations before any broad spec authoring begins: (1) explicit scope policy, (2) docs-only execution guardrails, and (3) canonical inventory with stable IDs. If this phase is under-specified, later phases will either miss artifacts or accidentally drift into source changes.

The standard approach in large audit/spec efforts is to define an immutable inventory contract first, then enforce execution boundaries through explicit allow/deny rules, and finally expose a repeatable inventory generation method. For this project, that means all outputs remain under `.planning/` and no changes are made to source implementation files.

**Primary recommendation:** Build a policy-first baseline with machine-checkable rules and a canonical inventory index that all later specs reference by ID.
</research_summary>

<standard_stack>
## Standard Stack

The established tools/patterns for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Markdown spec corpus | N/A | Human+agent readable contracts | Portable, diff-friendly, easy to review in git |
| `rg` / `find` / shell tooling | N/A | Deterministic repository inventory extraction | Fast, scriptable, and reproducible across environments |
| Git status/diff checks | N/A | Enforce docs-only scope and detect prohibited edits | Native repository source of truth for changed-file validation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| YAML frontmatter conventions | N/A | Standardize metadata in planning artifacts | Use in plan files where downstream workflows parse fields |
| Traceability tables | N/A | Requirement-to-phase mapping | Use for roadmap validation and coverage audits |
| Exclusion registry docs | N/A | Explain generated/runtime exclusions | Use whenever artifacts are intentionally omitted |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Scripted inventory extraction | Manual file listing | Faster to start but error-prone and non-reproducible |
| Explicit docs-only guardrails | Team convention only | Lower overhead but high risk of accidental source edits |

**Installation:**
```bash
# No additional package installation required for this phase.
# Uses repository shell tooling and markdown artifacts.
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
.planning/
├── specs/
│   ├── POLICY.md                # scope and guardrails
│   ├── INVENTORY.md             # canonical artifact list
│   └── INVENTORY-RULES.md       # extraction and classification rules
├── phases/
│   └── 01-scope-policy-inventory-and-guardrails/
│       ├── 01-RESEARCH.md
│       ├── 01-01-PLAN.md
│       ├── 01-02-PLAN.md
│       └── 01-03-PLAN.md
└── ...
```

### Pattern 1: Policy before enumeration
**What:** Define scope and exclusion rules before generating artifact lists.
**When to use:** Any full-repo spec initiative.
**Example:**
```text
1) Define source+ops inclusion policy
2) Define generated/runtime exclusions
3) Generate canonical inventory from policy
```

### Pattern 2: Guardrail-as-artifact
**What:** Store docs-only execution constraints in an explicit policy file rather than implicit team agreement.
**When to use:** Projects where accidental code edits are unacceptable during planning.
**Example:**
```text
Rule: Only .planning/** and markdown spec outputs may be modified in this phase.
Check: git diff --name-only must not include source implementation paths.
```

### Anti-Patterns to Avoid
- **Inventory-first without policy:** leads to unstable scope and rework.
- **Broad “document everything” with no exclusions list:** generated/runtime noise pollutes parity effort.
- **Unenforced docs-only rule:** accidental source edits invalidate phase goal.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Coverage validation | Ad-hoc manual checklists | `rg`/`find` + deterministic inventory tables | Manual tracking misses files as repo evolves |
| Guardrail enforcement | Informal “be careful” notes | Explicit policy + git-based change checks | Requires objective pass/fail checks |
| ID assignment | Free-form labels | Stable prefixed IDs (e.g., `ART-0001`) | Needed for downstream cross-references |

**Key insight:** Reuse deterministic shell+git validation patterns rather than inventing bespoke tooling in Phase 1.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Scope ambiguity
**What goes wrong:** Teams disagree later on what “in scope” meant.
**Why it happens:** No explicit inclusion/exclusion policy upfront.
**How to avoid:** Publish policy and exclusions as first deliverable.
**Warning signs:** Frequent reclassification of files after planning starts.

### Pitfall 2: Accidental source modifications
**What goes wrong:** Planning phase introduces implementation drift.
**Why it happens:** No hard guardrail and no file-change validation.
**How to avoid:** Add docs-only rule and explicit verification command in every plan.
**Warning signs:** `git status` shows source paths outside `.planning/**`.

### Pitfall 3: Non-reproducible inventory
**What goes wrong:** Later phases cannot regenerate inventory consistently.
**Why it happens:** Inventory compiled manually or with undocumented rules.
**How to avoid:** Store extraction/classification method with examples and exclusions.
**Warning signs:** Two runs produce different counts without repo changes.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from local workflow/tooling conventions:

### Inventory extraction baseline
```bash
# Source+ops discovery with explicit exclusions
find . -type f \
  -not -path './.git/*' \
  -not -path './venv/*' \
  -not -path './ui/node_modules/*' \
  -not -path './ui/dist/*'
```

### Docs-only guardrail check
```bash
# Must return only .planning/** paths during this initiative
git diff --name-only | rg -v '^\.planning/'
```

### Deterministic coverage sanity check
```bash
# Compare inventory row count against discovered scoped file count
# (exact command form to be finalized in phase plans)
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Narrative-only architecture docs | Contract+traceability based specs | Recent LLM-driven workflows | Better regeneration reliability |
| Implicit planning constraints | Explicit machine-checkable guardrails | Recent autonomous coding workflows | Fewer accidental scope violations |

**New tools/patterns to consider:**
- Diff-aware spec maintenance patterns for long-running planning tracks.
- Requirement-linked artifact IDs to reduce ambiguity in multi-phase pipelines.

**Deprecated/outdated:**
- “Single big doc” plans without per-file contract linkage.
- Manual-only progress tracking without reproducible extraction rules.
</sota_updates>

<open_questions>
## Open Questions

1. **Canonical artifact ID format**
   - What we know: IDs must be stable and sortable.
   - What's unclear: Whether IDs should be path-derived or sequence-based.
   - Recommendation: Use sequence IDs in Phase 1, retain path column for stability.

2. **Spec folder topology under `.planning/specs/`**
   - What we know: Phase 1 should create baseline policy and inventory artifacts.
   - What's unclear: Exact split between policy docs and inventory docs.
   - Recommendation: Start with `POLICY.md`, `INVENTORY.md`, `INVENTORY-RULES.md`; refine in later phases.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — constraints and core value
- `.planning/REQUIREMENTS.md` — phase requirements (`INVT-01`, `INVT-02`, `GARD-01`)
- `.planning/ROADMAP.md` — phase goal and success criteria
- `.planning/research/SUMMARY.md` and `.planning/codebase/*.md` — prior baseline context

### Secondary (MEDIUM confidence)
- Git and shell tooling conventions for reproducible inventory and guardrail checks

### Tertiary (LOW confidence - needs validation)
- Optional automation approach for inventory consistency checks in later phases
</sources>

<metadata>
## Metadata

**Research scope:**
- Core process: scope policy + inventory + docs-only guardrails
- Patterns: deterministic extraction, traceability, enforcement checks
- Pitfalls: scope drift, accidental source edits, non-reproducible inventories

**Confidence breakdown:**
- Standard stack: HIGH - based on current repo workflow and planning constraints
- Architecture: HIGH - directly aligned with phase goal
- Pitfalls: HIGH - already evidenced in project concerns/research
- Code examples: MEDIUM - command skeletons validated, exact inventory scripts deferred to plans

**Research date:** 2026-02-24
**Valid until:** 2026-03-25 (stable planning/process domain)
</metadata>

---

*Phase: 01-scope-policy-inventory-and-guardrails*
*Research completed: 2026-02-24*
*Ready for planning: yes*

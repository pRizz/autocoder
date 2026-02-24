# Phase 2: Coverage Validation & Classification - Research

**Researched:** 2026-02-24
**Domain:** Inventory drift detection, exclusion governance, and reproducible coverage auditing for spec corpora
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

No user constraints - all decisions at Claude's discretion

Additional constraints sourced from PROJECT.md/REQUIREMENTS.md/state:
- Outputs must remain docs/spec artifacts only (no implementation source edits).
- Coverage must account for source + ops artifacts while excluding generated/runtime classes.
- Artifact IDs (`ART-####`) remain canonical cross-reference keys.
</user_constraints>

<research_summary>
## Summary

Phase 2 should harden the boundary between intentional exclusions and missed coverage by making exclusion classes explicit and by introducing a reproducible audit loop that can be rerun after repository changes. The phase goal is not just to list files, but to prove inventory completeness with deterministic evidence and documented remediation.

Current repository evidence confirms this need: applying Phase 1 discovery rules now finds 230 files while `INVENTORY.md` still lists 224 entries, with six in-scope artifacts absent from inventory (new Phase 1 summaries/verification plus inventory artifacts). That is an expected post-phase drift, and Phase 2 should convert this from an ad-hoc discovery into a first-class audit process.

**Primary recommendation:** Create a dedicated exclusion taxonomy document plus a deterministic coverage-audit report format that always computes discovered vs inventoried sets, highlights gaps, and records remediation outcomes.
</research_summary>

<standard_stack>
## Standard Stack

The established tools/patterns for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `find` + `sed` + `sort` | system tools | Deterministic scope discovery | Portable and reproducible in CI/local runs |
| `rg` | system tool | Fast validation checks and token assertions | Reliable for markdown/spec policy validation |
| Python 3 stdlib (`pathlib`, set diff) | local runtime | Coverage reconciliation (inventory vs discovered) | Precise set-based gap detection with minimal complexity |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Markdown audit tables | N/A | Human-readable proof artifacts | Phase reports and handoffs |
| Canonical ID scheme (`ART-####`) | N/A | Stable references across docs | Any file-level and cross-surface spec linkage |
| Git diff checks | N/A | Guardrail enforcement | Before/after each plan completion |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Set-diff audit in docs/scripts | Manual checklist review | Simpler initially, but high miss-rate and poor reproducibility |
| Exclusion class document | Inline exclusions only in inventory rules | Less maintenance overhead, but reduced explainability for auditors |

**Installation:**
```bash
# No additional dependencies required for Phase 2.
# Use existing shell tools + python3 already present in repo workflow.
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
.planning/
├── specs/
│   ├── EXCLUSIONS.md             # explicit generated/runtime exclusion taxonomy
│   ├── COVERAGE-AUDIT.md         # deterministic audit run + gap results
│   ├── INVENTORY.md              # canonical artifact list (updated after gap remediation)
│   └── INDEX.md                  # links to exclusion and coverage-audit artifacts
└── phases/
    └── 02-coverage-validation-and-classification/
        ├── 02-RESEARCH.md
        ├── 02-01-PLAN.md
        └── 02-02-PLAN.md
```

### Pattern 1: Exclusion Registry as Contract
**What:** Separate generated/runtime exclusions into an explicit contract document with rationale, patterns, and examples.
**When to use:** Any repository where exclusions materially affect completeness claims.
**Example:**
```text
Class: Build outputs
Patterns: ui/dist/**, *.tsbuildinfo
Reason: reproducible outputs from source config
```

### Pattern 2: Deterministic Coverage Diff
**What:** Compute `discovered_set - inventory_set` and `inventory_set - discovered_set`, then classify each delta.
**When to use:** Every audit run before declaring coverage complete.
**Example:**
```text
missing_from_inventory: 6
extra_in_inventory: 0
status: remediated after inventory refresh
```

### Anti-Patterns to Avoid
- **Silent exclusions:** excluding classes without rationale causes future ambiguity.
- **One-time audit snapshots:** no reproducibility instructions means drift reappears undetected.
- **Path-only references without IDs:** weak traceability in later file/spec contracts.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Coverage completeness check | Manual eyeballing of inventory table | Scripted set diff between discovery and inventory | Manual review misses edge cases and scales poorly |
| Exclusion governance | Unstructured notes in phase summaries | Dedicated exclusion taxonomy in specs | Easier audits and explicit policy traceability |
| Drift handling | Implicit “update later” convention | Gap classification + remediation checklist in audit doc | Prevents stale inventory from blocking later phases |

**Key insight:** Use deterministic command outputs and explicit markdown contracts so coverage claims are reproducible, reviewable, and automation-ready.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Exclusion ambiguity
**What goes wrong:** Teams disagree whether lock files/caches/build outputs are in scope.
**Why it happens:** Exclusions are listed only as command flags, not governance artifacts.
**How to avoid:** Publish exclusion classes with rationale and examples in `EXCLUSIONS.md`.
**Warning signs:** Frequent re-litigation of include/exclude decisions.

### Pitfall 2: Inventory drift after plan execution
**What goes wrong:** New in-scope files appear but inventory remains stale.
**Why it happens:** Inventory generated once and not audited against discovery output.
**How to avoid:** Add repeatable coverage-audit run and required remediation pass.
**Warning signs:** `discovered_count != inventory_count` with unexplained deltas.

### Pitfall 3: Non-reproducible audit reports
**What goes wrong:** Coverage report cannot be regenerated by another agent.
**Why it happens:** Missing exact commands and criteria for pass/fail.
**How to avoid:** Include command sequence, expected outputs, and status rubric in audit artifact.
**Warning signs:** Different auditors produce different gap counts from same repo state.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from local workflow conventions:

### Deterministic discovery set
```bash
find . -type f \
  -not -path './.git/*' \
  -not -path './venv/*' \
  -not -path './ui/node_modules/*' \
  -not -path './ui/dist/*' \
  -not -path './__pycache__/*' \
  -not -path './*/__pycache__/*' \
  -not -name '*.pyc' \
  -not -name '*.log' \
  -not -name 'package-lock.json' \
  -not -name 'yarn.lock' \
  -not -name 'pnpm-lock.yaml' \
  -not -name 'bun.lockb' \
  -not -name '*.tsbuildinfo' \
  | sed 's#^\./##' | LC_ALL=C sort
```

### Coverage set comparison
```bash
# Compare discovered paths vs INVENTORY.md ART rows
# Report missing_from_inventory and extra_in_inventory
```

### Docs-only compliance check
```bash
git diff --name-only | rg -v '^\.planning/'
git diff --cached --name-only | rg -v '^\.planning/'
git ls-files --others --exclude-standard | rg -v '^\.planning/'
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static architecture docs | Traceable spec corpora with IDs and coverage checks | Recent LLM-assisted workflows | Better regeneration reliability and auditability |
| Ad-hoc exclusion notes | Formal exclusion taxonomy with rationale | Recent autonomous documentation pipelines | Reduced ambiguity during iterative updates |

**New tools/patterns to consider:**
- Diff-first coverage checks before every phase completion.
- Machine-readable audit metadata fields for future automation.

**Deprecated/outdated:**
- “Document once” inventory snapshots without re-audit loops.
- Implicit exclusion assumptions not backed by evidence.
</sota_updates>

<open_questions>
## Open Questions

1. **Inventory refresh cadence**
   - What we know: inventory drift appears after spec-phase file additions.
   - What's unclear: whether refresh should run after every plan or at phase boundaries.
   - Recommendation: enforce at least one full audit/remediation pass per phase completion.

2. **Exclusion granularity**
   - What we know: class-level exclusions exist in rules.
   - What's unclear: whether each class should include repo-specific count baselines.
   - Recommendation: include count snapshots for major exclusion classes to support drift forensics.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/ROADMAP.md` — Phase 2 goal, requirements, and success criteria
- `.planning/REQUIREMENTS.md` — `INVT-03`, `INVT-04` definitions
- `.planning/specs/POLICY.md` — scope boundaries
- `.planning/specs/INVENTORY-RULES.md` — discovery/exclusion/classification method
- `.planning/specs/INVENTORY.md` — canonical inventory baseline
- `.planning/specs/COVERAGE-BASELINE.md` — current baseline counts and reproducibility notes

### Secondary (MEDIUM confidence)
- Local deterministic audit commands and set-diff checks run during this planning session

### Tertiary (LOW confidence - needs validation)
- Optional future CI automation patterns for continuous coverage enforcement
</sources>

<metadata>
## Metadata

**Research scope:**
- Coverage completeness methodology
- Exclusion governance structure
- Drift detection/remediation workflow
- Reproducibility and audit evidence patterns

**Confidence breakdown:**
- Standard stack: HIGH - based on established project shell/git workflow
- Architecture: HIGH - directly aligned to Phase 2 success criteria
- Pitfalls: HIGH - evidenced by observed discovered-vs-inventory delta
- Code examples: MEDIUM - command patterns validated; final audit doc format to be finalized in plans

**Research date:** 2026-02-24
**Valid until:** 2026-03-25
</metadata>

---

*Phase: 02-coverage-validation-and-classification*
*Research completed: 2026-02-24*
*Ready for planning: yes*

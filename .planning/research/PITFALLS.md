# Pitfalls Research

**Domain:** Full-parity codebase specification and TS/Bun/Solid migration planning
**Researched:** 2026-02-24
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Incomplete artifact scope (missing ops/docs/scripts)

**What goes wrong:**
Specs look detailed but omit critical non-code artifacts that control setup, CI, launch, or security behavior.

**Why it happens:**
Teams focus on `src/` and ignore workflows, shell scripts, and repo policy files.

**How to avoid:**
Define scope policy first and enforce source+ops inventory baseline before writing contracts.

**Warning signs:**
Spec count is high but `.github/`, startup scripts, or docs are unreferenced.

**Phase to address:**
Phase 1 (Inventory and scoping)

---

### Pitfall 2: High-level summaries instead of executable contracts

**What goes wrong:**
Specifications become narrative architecture docs that can’t drive deterministic rebuild tasks.

**Why it happens:**
Narrative writing is faster than file-by-file interface and acceptance capture.

**How to avoid:**
Require each spec item to include behavior, inputs/outputs, side effects, dependencies, and pass/fail criteria.

**Warning signs:**
Phrases like “handles X” with no concrete conditions, schema fields, or edge-case behavior.

**Phase to address:**
Phase 2-3 (Contract extraction and validation)

---

### Pitfall 3: Preserving accidental behavior as parity requirement

**What goes wrong:**
Known bugs or incidental quirks get codified and carried into the target stack.

**Why it happens:**
“1:1” is interpreted as “everything currently observed,” not intended behavior.

**How to avoid:**
Maintain explicit intended-vs-observed discrepancy notes and require conscious decisions for each mismatch.

**Warning signs:**
Spec text says “must match current behavior” without defect triage sections.

**Phase to address:**
Phase 3-4 (Parity mapping and migration notes)

---

### Pitfall 4: Parity matrix without dependency-aware execution ordering

**What goes wrong:**
The mapping exists, but implementation starts in arbitrary order and stalls on hidden dependencies.

**Why it happens:**
No reconstruction wave plan linking dependencies, contracts, and verification steps.

**How to avoid:**
Attach dependency prerequisites and acceptance gates to each parity cluster.

**Warning signs:**
Checklist items cannot be started because required schemas/contracts aren’t defined.

**Phase to address:**
Phase 4-5 (Roadmap/checklist construction)

---

### Pitfall 5: Spec drift after initial completion

**What goes wrong:**
Specs are accurate at creation time, then silently diverge from repository reality.

**Why it happens:**
No maintenance cadence, diff checks, or ownership model.

**How to avoid:**
Add drift checks, update triggers, and periodic verification workflow in roadmap.

**Warning signs:**
Recent commits touch behavior-critical files with no corresponding spec updates.

**Phase to address:**
Phase 5+ (Maintenance and governance)

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Batch documenting by directory without per-file detail | Faster initial output | Missing contract fidelity, reconstruction failures | Never for P1 components |
| Skipping explicit discrepancy tracking | Simpler docs | Bugs become requirements by accident | Never |
| Deferring non-code artifact specs | Lower early effort | Build/ops behavior cannot be regenerated | Only temporarily, with explicit dated backlog item |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| API/WebSocket contract docs | Document endpoints but not message edge cases | Capture payload schema, ordering assumptions, errors, retries |
| Process/PTY behavior | Specify “terminal support” at high level only | Include lifecycle, cleanup, lock, and platform-specific behavior rules |
| Workflow/script coverage | Treat scripts as implementation details | Spec script inputs, side effects, and invocation contexts |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Monolithic mega-spec files | Slow updates, review fatigue, low precision | Modular specs with index and IDs | >200 artifacts |
| Duplicate contract definitions | Conflicting behavior statements | Single source-of-truth contract catalogs | Medium-sized projects with multiple contributors |
| Manual coverage tracking only | Missed files during fast repo changes | Add scripted inventory/coverage validation | Frequent commits or multi-branch work |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Including real secrets in examples | Credential leakage in docs | Use env-var names and redacted placeholders only |
| Ignoring command/path policy behavior in specs | Rebuilt system less secure than source | Treat security policy files/modules as first-class contract areas |
| Specifying remote execution without threat model | Unsafe default deployment behavior | Include explicit trust boundaries and safe defaults in requirements |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Dense specs with no navigation taxonomy | Hard to find required details | Add index + consistent IDs + category partitions |
| Checklists without acceptance examples | Ambiguous completion claims | Include concrete pass/fail examples per requirement |
| Mixing migration strategy with implementation logs | Specs become noisy and stale | Keep stable contract docs separate from execution run notes |

## "Looks Done But Isn't" Checklist

- [ ] **Inventory:** all scoped artifacts are listed and classified (source vs generated)
- [ ] **Per-file specs:** every in-scope file has a contract entry with acceptance criteria
- [ ] **Parity matrix:** every in-scope source/ops unit maps to a target implementation unit
- [ ] **Discrepancy handling:** intended-vs-observed differences are explicitly triaged
- [ ] **Verification:** reconstruction checklist includes dependency order and completion gates

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Incomplete artifact scope | MEDIUM | Re-run inventory baseline, diff against current specs, backfill missing contracts |
| Overly abstract specs | HIGH | Rewrite affected sections into file-level contracts with concrete examples |
| Drift after completion | MEDIUM | Run spec/code diff audit, revalidate changed files, update parity matrix/checklist |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Incomplete scope | Phase 1 | Scope index covers all source+ops paths |
| Abstract specs | Phase 2-3 | Random sample of specs supports executable tasks |
| Quirk preservation drift | Phase 3-4 | Discrepancy log reviewed and approved |
| Unordered rebuild checklist | Phase 4-5 | Dependency graph validates ordering |
| Spec drift | Phase 5+ | Drift check passes on subsequent updates |

## Sources

- Existing concern patterns from `.planning/codebase/CONCERNS.md`
- Repository operational surface (`.github/workflows`, launch scripts, security/config files)
- User-specified constraints for parity and stack migration

---
*Pitfalls research for: parity-first regeneration spec program*
*Researched: 2026-02-24*

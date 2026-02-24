# Execution Guardrails (Docs-Only)

**Status:** Active  
**Phase:** 01 (Scope Policy, Inventory, and Guardrails)  
**Last updated:** 2026-02-24

## Objective

Enforce the project rule that this initiative may generate only planning/spec markdown artifacts and may not modify implementation source files.

## Allowed Paths

All created/modified files must remain under:
- `.planning/**`

Verification token: Allowed paths are restricted to `.planning/**`.

Allowed artifact types in this phase:
- `*.md`
- planning metadata under `.planning/` that tracks phase execution state

## Prohibited Paths

Any file modification outside `.planning/**` is prohibited for this initiative, including but not limited to:
- root/runtime source (`*.py`, `*.ts`, `*.js`, etc.)
- `api/**`, `server/**`, `mcp_server/**`, `lib/**`, `ui/**`
- startup scripts (`start.*`, `bin/**`)
- CI/workflow files (`.github/**`)
- dependency manifests (`package.json`, `requirements*.txt`, `pyproject.toml`)

Verification token: Prohibited paths include any non-`.planning/**` path.

## Compliance Checklist

Run this checklist before marking any plan complete.

1. Working tree contains only `.planning/**` changes.
2. No staged non-`.planning/**` files exist.
3. No untracked non-`.planning/**` files exist.
4. Verification evidence is captured in plan summary.

## Canonical Checks

Run exactly these commands:

```bash
# Unstaged tracked-file edits must be limited to .planning/**
git diff --name-only | rg -v '^\.planning/'

# Staged tracked-file edits must be limited to .planning/**
git diff --cached --name-only | rg -v '^\.planning/'

# Untracked files must be limited to .planning/**
git ls-files --others --exclude-standard | rg -v '^\.planning/'
```

Interpretation:
- Any output from a command above is a guardrail violation.
- Zero output from all three commands means guardrail compliance.

## Violation Handling

1. Stop execution immediately.
2. Do not proceed to next task/plan.
3. Record violating paths in the current summary under issues/deviations.
4. Remove or revert violating edits before resuming.

## Relationship to Scope Policy

`.planning/specs/POLICY.md` defines scope coverage.  
This guardrail defines permitted write-scope during execution.

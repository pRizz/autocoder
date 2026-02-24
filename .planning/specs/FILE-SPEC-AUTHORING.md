# File Specification Authoring Conventions

**Status:** Active  
**Phase:** 03 (File Contract Framework & Pilot Pass)  
**Last updated:** 2026-02-24

## Purpose

Define how to author file-spec entries consistently so schema quality is uniform across all subsystem types.

## Naming

- File name format: `ART-####-<slug>.md`
- Store pilot entries under `.planning/specs/pilot/`
- Store full-corpus entries under the phase-approved contract directories (Phase 4+)

## Inventory ID Linkage

- Every entry MUST map to exactly one Inventory ID from `.planning/specs/INVENTORY.md`.
- Include both `ART-####` and canonical path in the Artifact Identity section.
- Cross-file references should prefer `ART-####` and may include path for readability.

## Required Sections

Author every entry using all required schema sections from `.planning/specs/FILE-SPEC-SCHEMA.md`:
- Artifact Identity
- Purpose
- Ownership
- Inputs
- Outputs
- Side Effects
- Direct Dependencies
- Error and Edge Behavior
- Acceptance Checks

## Writing Style

- Keep statements concrete and behavior-oriented.
- Prefer explicit verbs and observable effects over abstract summaries.
- Avoid implementation speculation that is not inferable from repository evidence.

## Quality Gate

Before accepting a file-spec entry:

1. Required section headings exist and are non-empty.
2. Inventory ID and path match canonical inventory row.
3. Dependencies include direct, not transitive-only, references.
4. Acceptance checks are concrete and objectively testable.

## Regeneration-Agent Checklist

Mandatory information to include so regeneration agents can operate without hidden context:

1. Mandatory artifact identity fields (`ART-####`, path, category, version).
2. Mandatory boundary statements (what is owned vs not owned).
3. Mandatory behavior surfaces (inputs/outputs/side effects) with observable language.
4. Mandatory direct dependencies with explicit rationale.
5. Quality Gate checks phrased as binary pass/fail criteria.

## Review Workflow

- Initial authoring pass: create draft from source artifact and linked dependencies.
- Consistency pass: validate section completeness and ID/path correctness.
- Cross-link pass: ensure dependencies and index/matrix references are updated.
- Final review pass: mark entry as ready only when Quality Gate items pass.

## Common Authoring Errors

- Missing side effects for scripts/workflows.
- Path-only references with no Inventory ID.
- Vague Purpose/Ownership text that does not define boundaries.
- Acceptance checks phrased as opinions instead of verifiable criteria.

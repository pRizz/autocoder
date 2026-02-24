# File Specification Schema

**Status:** Active  
**Phase:** 03 (File Contract Framework & Pilot Pass)  
**Last updated:** 2026-02-24

## Purpose

Define the canonical contract shape for each inventoried artifact so regeneration agents can reconstruct behavior with explicit, file-level expectations.

## Scope

This schema applies to all in-scope artifacts listed in `.planning/specs/INVENTORY.md`, regardless of subsystem type (code, documentation, workflow, script, config).

## Mandatory Contract Fields

Every file-spec entry MUST include the following sections.

### 1. Artifact Identity

- `ART ID`: canonical inventory reference (for example `ART-0075`)
- `Path`: repository path
- `Category`: inventory category
- `Contract Version`: schema version used by the entry

### 2. Purpose

Describe what the file is responsible for and why it exists in the product/ops surface.

### 3. Ownership

Describe responsibility boundaries: what this file owns and what it explicitly does not own.

### 4. Inputs

List runtime/build/user/system inputs consumed by the file contract.

### 5. Outputs

List observable outputs produced by this file (data, files, API behavior, UI state, side-channel outputs).

### 6. Side Effects

Document state changes, IO writes, process spawning, network calls, logging, and any external interactions.

### 7. Direct Dependencies

List direct dependencies on other artifacts (prefer `ART-####` references plus path for readability).

### 8. Error and Edge Behavior

Capture notable failure paths, fallback behavior, and important edge-case expectations.

### 9. Acceptance Checks

Define concise, verifiable checks that prove the contract entry is complete and useful for regeneration.

## Required Sections Checklist

A contract is invalid unless all required sections above are present and non-empty.

## Template

```markdown
# ART-####: <short-name>

## Artifact Identity
- ART ID: ART-####
- Path: <path>
- Category: <category>
- Contract Version: 1.0

## Purpose
<what this file exists to do>

## Ownership
- Owns: <owned responsibilities>
- Does not own: <out-of-scope responsibilities>

## Inputs
- <input 1>
- <input 2>

## Outputs
- <output 1>
- <output 2>

## Side Effects
- <effect 1>
- <effect 2>

## Direct Dependencies
- ART-#### `<path>`: <why dependency exists>

## Error and Edge Behavior
- <error/edge case behavior>

## Acceptance Checks
- [ ] <check 1>
- [ ] <check 2>
```

## Compact Example

### ART-0075 Example (illustrative)

- ART ID: `ART-0075`
- Path: `api/database.py`
- Purpose: central DB connection/session helper for API/runtime modules
- Ownership: owns connection/session configuration; does not own domain query logic
- Inputs: environment/database settings, call-site invocation
- Outputs: connection/session objects and DB operation results
- Side Effects: opens DB connections, may perform migration/setup side effects
- Direct Dependencies: `ART-0096` (`server/main.py`) and other service/router artifacts consuming DB helpers
- Acceptance Checks: references are concrete, responsibilities are bounded, dependency list is explicit

## Compatibility Notes

The schema is artifact-type agnostic. Non-code files (docs/workflows/scripts/config) use the same required sections with type-appropriate wording.

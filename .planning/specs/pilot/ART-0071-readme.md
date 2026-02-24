# ART-0071: readme

## Artifact Identity
- ART ID: ART-0071
- Path: README.md
- Category: DOCUMENTATION
- Contract Version: 1.0

## Purpose
Act as the primary operator/developer onboarding document describing prerequisites, setup paths, runtime modes, architecture overview, and security model.

## Ownership
- Owns: top-level product explanation, installation/run instructions, and operational expectations.
- Does not own: executable startup logic, runtime enforcement, or source-of-truth API implementation details.

## Inputs
- Current product capabilities and command interfaces.
- Supported platform/runtime constraints.
- Documentation updates from feature and operations changes.

## Outputs
- Human-readable guidance for installing, running, and understanding AutoForge.
- Canonical reference links for tutorials and prerequisites.
- High-level structure maps for repository and generated-project layouts.

## Side Effects
- No runtime side effects.
- Indirectly influences user/operator behavior through instructional content.

## Direct Dependencies
- ART-0134 `start.sh`: documented as an execution entrypoint.
- ART-0136 `start_ui.py`: referenced for web UI startup path.
- ART-0028 `.github/workflows/ci.yml`: aligned quality/validation expectations.

## Error and Edge Behavior
- Can become stale when commands or architecture change; requires periodic sync with implementation.
- Incomplete/outdated sections may cause setup failures or incorrect expectations.

## Acceptance Checks
- [ ] Purpose and ownership boundaries distinguish documentation from executable behavior.
- [ ] Inputs/outputs describe documentation maintenance lifecycle.
- [ ] Dependencies reference concrete executable/workflow artifacts discussed in the document.

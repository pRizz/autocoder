# ART-0026: claude-templates-testing-prompt-template-md

## Artifact Identity
- ART ID: ART-0026
- Path: .claude/templates/testing_prompt.template.md
- Category: OPS_AUTOMATION
- Contract Version: 1.0

## Purpose
Defines agent command/skill/prompt automation behavior in `.claude/templates/testing_prompt.template.md` to standardize repository workflows. Key sections: YOUR ROLE - TESTING AGENT, ASSIGNED FEATURES FOR REGRESSION TESTING, Workflow for EACH feature:, STEP 1: GET YOUR ASSIGNED FEATURE(S), STEP 2: VERIFY THE FEATURE, Browser Automation (Playwright CLI).

## Ownership
- Owns: agent-facing command/skill/workflow instruction behavior.
- Does not own: application runtime state transitions outside automation context.

## Inputs
- Prompt/workflow context provided by agent orchestration commands.
- Repository planning artifacts and command arguments.
- Skill/command references and instruction templates.

## Outputs
- Agent instruction surfaces and command behavior used during coding workflows.
- Structured prompts/context that drive deterministic task execution.

## Side Effects
- Influences agent execution behavior, command routing, and prompt interpretation.
- Can alter planning/workflow outputs by changing instruction constraints.

## Direct Dependencies
- ART-0069 `CLAUDE.md`: Agent operating constraints and repository workflow context.
- ART-0033 `.planning/ROADMAP.md`: Phase/task orchestration context used by commands/skills.
- ART-0034 `.planning/STATE.md`: Session continuity and execution state context.

## Error and Edge Behavior
- Missing files, invalid configuration, or stale references must be surfaced as explicit validation failures, not silent assumptions.
- Ambiguous policy/metadata states should be documented with deterministic fallback behavior so regeneration workflows remain reproducible.

## Acceptance Checks
- [ ] Artifact identity exactly matches `ART-0026` and `.claude/templates/testing_prompt.template.md` in `.planning/specs/INVENTORY.md`.
- [ ] Inputs/outputs/side effects are concrete and category-appropriate for this artifact.
- [ ] Direct dependencies include concrete `ART-####` references with rationale.
- [ ] Error and edge behavior covers invalid-state handling and deterministic fallback expectations.
- [ ] Contract language is specific enough for regeneration workflows to reproduce intent.

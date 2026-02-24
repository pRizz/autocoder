# ART-0134: start-sh

## Artifact Identity
- ART ID: ART-0134
- Path: start.sh
- Category: OPERATIONS_SCRIPT
- Contract Version: 1.0

## Purpose
Provide a Unix shell entrypoint that validates Claude CLI availability/auth hints, provisions Python virtual environment dependencies, and launches the AutoForge CLI menu.

## Ownership
- Owns: startup preflight checks and platform-specific environment bootstrapping for Linux/macOS shell usage.
- Does not own: core application business logic, long-running agent orchestration internals, or UI rendering.

## Inputs
- Host shell environment (`bash`, HOME, filesystem state).
- Presence/absence of `claude` CLI and virtual environment directories.
- Dependency manifests (`requirements.txt`) and optional npm global install for playwright CLI.

## Outputs
- Console status/error messaging during startup sequence.
- Activated virtual environment and installed Python dependencies.
- Invocation of `python start.py` after preflight completion.

## Side Effects
- Creates/removes `venv/` directories when compatibility checks require recreation.
- Installs Python packages and optionally global npm package (`@playwright/cli`).
- Executes application startup process.

## Direct Dependencies
- ART-0133 `start.py`: final CLI menu process invoked.
- ART-0089 `requirements.txt`: dependency installation source.
- ART-0071 `README.md`: documents script as recommended startup path.

## Error and Edge Behavior
- Exits early with actionable messages when CLI or venv setup fails.
- Handles incompatible Windows-created venv on Unix by deleting/recreating.
- Continues with warning path when Claude CLI directory is missing but user proceeds.

## Acceptance Checks
- [ ] Contract captures preflight, setup, and launch responsibilities distinctly.
- [ ] Side effects include filesystem and package-install operations.
- [ ] Dependencies align with directly referenced scripts/manifests/docs.

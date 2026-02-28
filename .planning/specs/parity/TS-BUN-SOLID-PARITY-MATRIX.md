# TS/Bun/Solid Parity Matrix

**Status:** Active  
**Phase:** 07 (TS/Bun/Solid Parity Matrix & Discrepancies)  
**Canonical completeness source for MIGR-01**

Total parity mappings: **237**

## Coverage Rules

- Canonical source-of-truth row sets:
  - `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md`
  - `.planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md`
  - `.planning/specs/contracts/FRONTEND-UI-MATRIX.md`
  - `.planning/specs/contracts/NON-TS-MATRIX.md`
- Completeness rule: exactly one row per `ART-####` from the canonical lane matrices.
- Uniqueness rule: one-row-per-ART (no duplicate artifact IDs in this matrix).
- Allowed target lanes: `bun-backend`, `solid-frontend`, `bun-ops`, `docs-config`.
- External behavior anchor requirement:
  - `REST-API-CONTRACTS.md`
  - `WEBSOCKET-CONTRACTS.md`
  - `DATA-PERSISTENCE-CONTRACTS.md`
  - `PROCESS-LIFECYCLE-CONTRACTS.md`
  - `SECURITY-POLICY-CONTRACTS.md`
- Any proposed migration mapping that conflicts with these surface contracts is invalid.

## Matrix

| ART ID | Source Path | Source Lane | Source Category | Current Concern | Target Stack Lane | Target Module/Cluster | Surface Preservation Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ART-0001 | `.claude/agents/code-review.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0002 | `.claude/agents/coder.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0003 | `.claude/agents/deep-dive.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0004 | `.claude/commands/check-code.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0005 | `.claude/commands/checkpoint.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0006 | `.claude/commands/create-spec.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0007 | `.claude/commands/expand-project.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0008 | `.claude/commands/gsd-to-autoforge-spec.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0009 | `.claude/commands/review-pr.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0010 | `.claude/launch.json` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0011 | `.claude/skills/frontend-design/LICENSE.txt` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0012 | `.claude/skills/frontend-design/SKILL.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0013 | `.claude/skills/gsd-to-autoforge-spec/SKILL.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0014 | `.claude/skills/gsd-to-autoforge-spec/references/app-spec-format.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0015 | `.claude/skills/playwright-cli/SKILL.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0016 | `.claude/skills/playwright-cli/references/request-mocking.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0017 | `.claude/skills/playwright-cli/references/running-code.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0018 | `.claude/skills/playwright-cli/references/session-management.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0019 | `.claude/skills/playwright-cli/references/storage-state.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0020 | `.claude/skills/playwright-cli/references/test-generation.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0021 | `.claude/skills/playwright-cli/references/tracing.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0022 | `.claude/skills/playwright-cli/references/video-recording.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0023 | `.claude/templates/app_spec.template.txt` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0024 | `.claude/templates/coding_prompt.template.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0025 | `.claude/templates/initializer_prompt.template.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0026 | `.claude/templates/testing_prompt.template.md` | non_ts | OPS_AUTOMATION | OPS_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0027 | `.env.example` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0028 | `.github/workflows/ci.yml` | non_ts | CI_AUTOMATION | CI_AUTOMATION | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0029 | `.gitignore` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0030 | `.npmignore` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0031 | `.planning/PROJECT.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0032 | `.planning/REQUIREMENTS.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0033 | `.planning/ROADMAP.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0034 | `.planning/STATE.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0035 | `.planning/codebase/ARCHITECTURE.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0036 | `.planning/codebase/CONCERNS.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0037 | `.planning/codebase/CONVENTIONS.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0038 | `.planning/codebase/INTEGRATIONS.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0039 | `.planning/codebase/STACK.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0040 | `.planning/codebase/STRUCTURE.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0041 | `.planning/codebase/TESTING.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0042 | `.planning/config.json` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0043 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-01-PLAN.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0044 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-01-SUMMARY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0045 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-02-PLAN.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0046 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-02-SUMMARY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0047 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-03-PLAN.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0048 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-03-SUMMARY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0049 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-RESEARCH.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0050 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-VERIFICATION.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0051 | `.planning/phases/02-coverage-validation-and-classification/02-01-PLAN.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0052 | `.planning/phases/02-coverage-validation-and-classification/02-01-SUMMARY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0053 | `.planning/phases/02-coverage-validation-and-classification/02-02-PLAN.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0054 | `.planning/phases/02-coverage-validation-and-classification/02-02-SUMMARY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0055 | `.planning/phases/02-coverage-validation-and-classification/02-RESEARCH.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0056 | `.planning/research/ARCHITECTURE.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0057 | `.planning/research/FEATURES.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0058 | `.planning/research/PITFALLS.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0059 | `.planning/research/STACK.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0060 | `.planning/research/SUMMARY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0061 | `.planning/specs/COVERAGE-AUDIT.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0062 | `.planning/specs/COVERAGE-BASELINE.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0063 | `.planning/specs/EXCLUSIONS.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0064 | `.planning/specs/GUARDRAILS.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0065 | `.planning/specs/INDEX.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0066 | `.planning/specs/INVENTORY-RULES.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0067 | `.planning/specs/INVENTORY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0068 | `.planning/specs/POLICY.md` | non_ts | PLANNING_DOC | PLANNING_DOC | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0069 | `CLAUDE.md` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0070 | `LICENSE.md` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0071 | `README.md` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0072 | `VISION.md` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0073 | `agent.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0074 | `api/__init__.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0075 | `api/database.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0076 | `api/dependency_resolver.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0077 | `api/migration.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0078 | `auth.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0079 | `autoforge_paths.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0080 | `autonomous_agent_demo.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0081 | `bin/autoforge.js` | non_ts | OPERATIONS_SCRIPT | OPERATIONS_SCRIPT | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0082 | `client.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0083 | `env_constants.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0084 | `examples/OPTIMIZE_CONFIG.md` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0085 | `examples/README.md` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0086 | `examples/org_config.yaml` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0087 | `examples/project_allowed_commands.yaml` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0088 | `lib/cli.js` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0089 | `mcp_server/__init__.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0090 | `mcp_server/feature_mcp.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0091 | `package.json` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0092 | `parallel_orchestrator.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0093 | `progress.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0094 | `prompts.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0095 | `pyproject.toml` | non_ts | CONFIG_OR_MISC | CONFIG_OR_MISC | docs-config | C11-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0096 | `rate_limit_utils.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0097 | `registry.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0098 | `requirements-prod.txt` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0099 | `requirements.txt` | non_ts | DOCUMENTATION | DOCUMENTATION | docs-config | C12-DOCS-CONFIG | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0100 | `security.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0101 | `server/__init__.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0102 | `server/main.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0103 | `server/routers/__init__.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0104 | `server/routers/agent.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0105 | `server/routers/assistant_chat.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0106 | `server/routers/devserver.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0107 | `server/routers/expand_project.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0108 | `server/routers/features.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0109 | `server/routers/filesystem.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0110 | `server/routers/projects.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0111 | `server/routers/schedules.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0112 | `server/routers/settings.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0113 | `server/routers/spec_creation.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0114 | `server/routers/terminal.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0115 | `server/schemas.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0116 | `server/services/__init__.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0117 | `server/services/assistant_chat_session.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0118 | `server/services/assistant_database.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0119 | `server/services/chat_constants.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0120 | `server/services/dev_server_manager.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0121 | `server/services/expand_chat_session.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0122 | `server/services/process_manager.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0123 | `server/services/project_config.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0124 | `server/services/scheduler_service.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0125 | `server/services/spec_chat_session.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0126 | `server/services/terminal_manager.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0127 | `server/utils/__init__.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0128 | `server/utils/process_utils.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0129 | `server/utils/project_helpers.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0130 | `server/utils/validation.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0131 | `server/websocket.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0132 | `start.bat` | non_ts | OPERATIONS_SCRIPT | OPERATIONS_SCRIPT | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0133 | `start.py` | non_ts | OPERATIONS_SCRIPT | OPERATIONS_SCRIPT | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0134 | `start.sh` | non_ts | OPERATIONS_SCRIPT | OPERATIONS_SCRIPT | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0135 | `start_ui.bat` | non_ts | OPERATIONS_SCRIPT | OPERATIONS_SCRIPT | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0136 | `start_ui.py` | non_ts | OPERATIONS_SCRIPT | OPERATIONS_SCRIPT | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0137 | `start_ui.sh` | non_ts | OPERATIONS_SCRIPT | OPERATIONS_SCRIPT | bun-ops | C10-BUN-OPS | Preserve operational, workflow, and documentation behavior contracts 1:1. |
| ART-0138 | `temp_cleanup.py` | backend_runtime | BACKEND_SOURCE | BACKEND_SOURCE | bun-backend | C01-BUN-BACKEND | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0139 | `test_client.py` | backend_runtime | TEST | TEST | bun-backend | C05-BUN-TESTS | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0140 | `test_dependency_resolver.py` | backend_runtime | TEST | TEST | bun-backend | C05-BUN-TESTS | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0141 | `test_devserver_security.py` | backend_runtime | TEST | TEST | bun-backend | C05-BUN-TESTS | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0142 | `test_rate_limit_utils.py` | backend_runtime | TEST | TEST | bun-backend | C05-BUN-TESTS | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0143 | `test_security.py` | backend_runtime | TEST | TEST | bun-backend | C05-BUN-TESTS | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0144 | `test_security_integration.py` | backend_runtime | TEST | TEST | bun-backend | C05-BUN-TESTS | Preserve external API/WebSocket/data/process/security behavior 1:1. |
| ART-0145 | `ui/components.json` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0146 | `ui/e2e/conversation-history.spec.ts` | frontend_ui | TEST | TEST | solid-frontend | C09-SOLID-E2E | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0147 | `ui/e2e/tooltip.spec.ts` | frontend_ui | TEST | TEST | solid-frontend | C09-SOLID-E2E | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0148 | `ui/eslint.config.js` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0149 | `ui/index.html` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0150 | `ui/package.json` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0151 | `ui/playwright.config.ts` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0152 | `ui/public/logo.png` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0153 | `ui/public/ollama.png` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0154 | `ui/public/vite.svg` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0155 | `ui/src/App.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0156 | `ui/src/components/ActivityFeed.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0157 | `ui/src/components/AddFeatureForm.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0158 | `ui/src/components/AgentAvatar.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0159 | `ui/src/components/AgentCard.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0160 | `ui/src/components/AgentControl.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0161 | `ui/src/components/AgentMissionControl.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0162 | `ui/src/components/AgentThought.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0163 | `ui/src/components/AssistantChat.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0164 | `ui/src/components/AssistantFAB.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0165 | `ui/src/components/AssistantPanel.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0166 | `ui/src/components/CelebrationOverlay.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0167 | `ui/src/components/ChatMessage.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0168 | `ui/src/components/ConfirmDialog.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0169 | `ui/src/components/ConversationHistory.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0170 | `ui/src/components/DebugLogViewer.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0171 | `ui/src/components/DependencyBadge.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0172 | `ui/src/components/DependencyGraph.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0173 | `ui/src/components/DevServerConfigDialog.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0174 | `ui/src/components/DevServerControl.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0175 | `ui/src/components/EditFeatureForm.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0176 | `ui/src/components/ExpandProjectChat.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0177 | `ui/src/components/ExpandProjectModal.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0178 | `ui/src/components/FeatureCard.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0179 | `ui/src/components/FeatureModal.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0180 | `ui/src/components/FolderBrowser.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0181 | `ui/src/components/HumanInputForm.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0182 | `ui/src/components/KanbanBoard.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0183 | `ui/src/components/KanbanColumn.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0184 | `ui/src/components/KeyboardShortcutsHelp.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0185 | `ui/src/components/NewProjectModal.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0186 | `ui/src/components/OrchestratorAvatar.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0187 | `ui/src/components/OrchestratorStatusCard.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0188 | `ui/src/components/ProgressDashboard.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0189 | `ui/src/components/ProjectSelector.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0190 | `ui/src/components/ProjectSetupRequired.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0191 | `ui/src/components/QuestionOptions.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0192 | `ui/src/components/ResetProjectModal.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0193 | `ui/src/components/ScheduleModal.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0194 | `ui/src/components/SettingsModal.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0195 | `ui/src/components/SetupWizard.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0196 | `ui/src/components/SpecCreationChat.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0197 | `ui/src/components/Terminal.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0198 | `ui/src/components/TerminalTabs.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0199 | `ui/src/components/ThemeSelector.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0200 | `ui/src/components/TypingIndicator.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0201 | `ui/src/components/ViewToggle.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0202 | `ui/src/components/mascotData.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0203 | `ui/src/components/ui/alert.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0204 | `ui/src/components/ui/badge.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0205 | `ui/src/components/ui/button.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0206 | `ui/src/components/ui/card.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0207 | `ui/src/components/ui/checkbox.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0208 | `ui/src/components/ui/dialog.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0209 | `ui/src/components/ui/dropdown-menu.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0210 | `ui/src/components/ui/input.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0211 | `ui/src/components/ui/label.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0212 | `ui/src/components/ui/separator.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0213 | `ui/src/components/ui/switch.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0214 | `ui/src/components/ui/textarea.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0215 | `ui/src/components/ui/tooltip.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0216 | `ui/src/hooks/useAssistantChat.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0217 | `ui/src/hooks/useCelebration.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0218 | `ui/src/hooks/useConversations.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0219 | `ui/src/hooks/useExpandChat.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0220 | `ui/src/hooks/useFeatureSound.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0221 | `ui/src/hooks/useProjects.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0222 | `ui/src/hooks/useSchedules.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0223 | `ui/src/hooks/useSpecChat.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0224 | `ui/src/hooks/useTheme.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0225 | `ui/src/hooks/useWebSocket.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0226 | `ui/src/lib/api.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0227 | `ui/src/lib/keyboard.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0228 | `ui/src/lib/timeUtils.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0229 | `ui/src/lib/types.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0230 | `ui/src/lib/utils.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0231 | `ui/src/main.tsx` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0232 | `ui/src/styles/globals.css` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0233 | `ui/src/vite-env.d.ts` | frontend_ui | FRONTEND_SOURCE | FRONTEND_SOURCE | solid-frontend | C07-SOLID-UI | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0234 | `ui/tsconfig.app.json` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0235 | `ui/tsconfig.json` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0236 | `ui/tsconfig.node.json` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |
| ART-0237 | `ui/vite.config.ts` | frontend_ui | FRONTEND_CONFIG | FRONTEND_CONFIG | solid-frontend | C08-SOLID-TOOLING | Preserve user-facing UI workflows and frontend-consumed protocol contracts 1:1. |

## Acceptance Checks

**Requirement:** `MIGR-01`

| Check ID | Requirement | Assertion | Evidence Method | pass/fail Criteria |
| --- | --- | --- | --- | --- |
| MIGR-01-AC-01 | MIGR-01 | Parity matrix row count is exactly `237`. | Count `ART-####` rows in this matrix. | pass when row count is 237; fail otherwise. |
| MIGR-01-AC-02 | MIGR-01 | Matrix parity coverage is `237/237` against canonical lane matrices. | Reconcile all matrix IDs against the union of backend/frontend/non-TS lane matrices. | pass when all canonical IDs are mapped and no extra IDs exist; fail on any delta. |
| MIGR-01-AC-03 | MIGR-01 | `one-row-per-ART` uniqueness is enforced. | Check duplicate ART IDs in this matrix. | pass when each ART appears exactly once; fail on any duplicate. |
| MIGR-01-AC-04 | MIGR-01 | No unmapped canonical inventory IDs remain. | Compare against `FILE-CONTRACT-COVERAGE.md` canonical set. | pass when unmapped count is zero; fail otherwise. |

## References

- `.planning/specs/contracts/FILE-CONTRACT-COVERAGE.md`
- `.planning/specs/contracts/BACKEND-RUNTIME-MATRIX.md`
- `.planning/specs/contracts/FRONTEND-UI-MATRIX.md`
- `.planning/specs/contracts/NON-TS-MATRIX.md`

# Canonical Inventory

**Status:** Active  
**Phase:** 01 (Scope Policy, Inventory, and Guardrails)  
**Generated:** 2026-02-24

Total in-scope artifacts: 224

## Category Summary

| Category | Count |
| --- | ---: |
| BACKEND_SOURCE | 50 |
| CI_AUTOMATION | 1 |
| CONFIG_OR_MISC | 8 |
| DOCUMENTATION | 8 |
| FRONTEND_CONFIG | 8 |
| FRONTEND_SOURCE | 83 |
| OPERATIONS_SCRIPT | 7 |
| OPS_AUTOMATION | 26 |
| PLANNING_DOC | 25 |
| TEST | 8 |

## Artifact Table

| ID | Path | Category | Notes |
| --- | --- | --- | --- |
| ART-0001 | `.claude/agents/code-review.md` | OPS_AUTOMATION | |
| ART-0002 | `.claude/agents/coder.md` | OPS_AUTOMATION | |
| ART-0003 | `.claude/agents/deep-dive.md` | OPS_AUTOMATION | |
| ART-0004 | `.claude/commands/check-code.md` | OPS_AUTOMATION | |
| ART-0005 | `.claude/commands/checkpoint.md` | OPS_AUTOMATION | |
| ART-0006 | `.claude/commands/create-spec.md` | OPS_AUTOMATION | |
| ART-0007 | `.claude/commands/expand-project.md` | OPS_AUTOMATION | |
| ART-0008 | `.claude/commands/gsd-to-autoforge-spec.md` | OPS_AUTOMATION | |
| ART-0009 | `.claude/commands/review-pr.md` | OPS_AUTOMATION | |
| ART-0010 | `.claude/launch.json` | OPS_AUTOMATION | |
| ART-0011 | `.claude/skills/frontend-design/LICENSE.txt` | OPS_AUTOMATION | |
| ART-0012 | `.claude/skills/frontend-design/SKILL.md` | OPS_AUTOMATION | |
| ART-0013 | `.claude/skills/gsd-to-autoforge-spec/SKILL.md` | OPS_AUTOMATION | |
| ART-0014 | `.claude/skills/gsd-to-autoforge-spec/references/app-spec-format.md` | OPS_AUTOMATION | |
| ART-0015 | `.claude/skills/playwright-cli/SKILL.md` | OPS_AUTOMATION | |
| ART-0016 | `.claude/skills/playwright-cli/references/request-mocking.md` | OPS_AUTOMATION | |
| ART-0017 | `.claude/skills/playwright-cli/references/running-code.md` | OPS_AUTOMATION | |
| ART-0018 | `.claude/skills/playwright-cli/references/session-management.md` | OPS_AUTOMATION | |
| ART-0019 | `.claude/skills/playwright-cli/references/storage-state.md` | OPS_AUTOMATION | |
| ART-0020 | `.claude/skills/playwright-cli/references/test-generation.md` | OPS_AUTOMATION | |
| ART-0021 | `.claude/skills/playwright-cli/references/tracing.md` | OPS_AUTOMATION | |
| ART-0022 | `.claude/skills/playwright-cli/references/video-recording.md` | OPS_AUTOMATION | |
| ART-0023 | `.claude/templates/app_spec.template.txt` | OPS_AUTOMATION | |
| ART-0024 | `.claude/templates/coding_prompt.template.md` | OPS_AUTOMATION | |
| ART-0025 | `.claude/templates/initializer_prompt.template.md` | OPS_AUTOMATION | |
| ART-0026 | `.claude/templates/testing_prompt.template.md` | OPS_AUTOMATION | |
| ART-0027 | `.env.example` | CONFIG_OR_MISC | |
| ART-0028 | `.github/workflows/ci.yml` | CI_AUTOMATION | |
| ART-0029 | `.gitignore` | CONFIG_OR_MISC | |
| ART-0030 | `.npmignore` | CONFIG_OR_MISC | |
| ART-0031 | `.planning/PROJECT.md` | PLANNING_DOC | |
| ART-0032 | `.planning/REQUIREMENTS.md` | PLANNING_DOC | |
| ART-0033 | `.planning/ROADMAP.md` | PLANNING_DOC | |
| ART-0034 | `.planning/STATE.md` | PLANNING_DOC | |
| ART-0035 | `.planning/codebase/ARCHITECTURE.md` | PLANNING_DOC | |
| ART-0036 | `.planning/codebase/CONCERNS.md` | PLANNING_DOC | |
| ART-0037 | `.planning/codebase/CONVENTIONS.md` | PLANNING_DOC | |
| ART-0038 | `.planning/codebase/INTEGRATIONS.md` | PLANNING_DOC | |
| ART-0039 | `.planning/codebase/STACK.md` | PLANNING_DOC | |
| ART-0040 | `.planning/codebase/STRUCTURE.md` | PLANNING_DOC | |
| ART-0041 | `.planning/codebase/TESTING.md` | PLANNING_DOC | |
| ART-0042 | `.planning/config.json` | PLANNING_DOC | |
| ART-0043 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-01-PLAN.md` | PLANNING_DOC | |
| ART-0044 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-01-SUMMARY.md` | PLANNING_DOC | |
| ART-0045 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-02-PLAN.md` | PLANNING_DOC | |
| ART-0046 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-03-PLAN.md` | PLANNING_DOC | |
| ART-0047 | `.planning/phases/01-scope-policy-inventory-and-guardrails/01-RESEARCH.md` | PLANNING_DOC | |
| ART-0048 | `.planning/research/ARCHITECTURE.md` | PLANNING_DOC | |
| ART-0049 | `.planning/research/FEATURES.md` | PLANNING_DOC | |
| ART-0050 | `.planning/research/PITFALLS.md` | PLANNING_DOC | |
| ART-0051 | `.planning/research/STACK.md` | PLANNING_DOC | |
| ART-0052 | `.planning/research/SUMMARY.md` | PLANNING_DOC | |
| ART-0053 | `.planning/specs/GUARDRAILS.md` | PLANNING_DOC | |
| ART-0054 | `.planning/specs/INDEX.md` | PLANNING_DOC | |
| ART-0055 | `.planning/specs/POLICY.md` | PLANNING_DOC | |
| ART-0056 | `CLAUDE.md` | DOCUMENTATION | |
| ART-0057 | `LICENSE.md` | DOCUMENTATION | |
| ART-0058 | `README.md` | DOCUMENTATION | |
| ART-0059 | `VISION.md` | DOCUMENTATION | |
| ART-0060 | `agent.py` | BACKEND_SOURCE | |
| ART-0061 | `api/__init__.py` | BACKEND_SOURCE | |
| ART-0062 | `api/database.py` | BACKEND_SOURCE | |
| ART-0063 | `api/dependency_resolver.py` | BACKEND_SOURCE | |
| ART-0064 | `api/migration.py` | BACKEND_SOURCE | |
| ART-0065 | `auth.py` | BACKEND_SOURCE | |
| ART-0066 | `autoforge_paths.py` | BACKEND_SOURCE | |
| ART-0067 | `autonomous_agent_demo.py` | BACKEND_SOURCE | |
| ART-0068 | `bin/autoforge.js` | OPERATIONS_SCRIPT | |
| ART-0069 | `client.py` | BACKEND_SOURCE | |
| ART-0070 | `env_constants.py` | BACKEND_SOURCE | |
| ART-0071 | `examples/OPTIMIZE_CONFIG.md` | DOCUMENTATION | |
| ART-0072 | `examples/README.md` | DOCUMENTATION | |
| ART-0073 | `examples/org_config.yaml` | CONFIG_OR_MISC | |
| ART-0074 | `examples/project_allowed_commands.yaml` | CONFIG_OR_MISC | |
| ART-0075 | `lib/cli.js` | CONFIG_OR_MISC | |
| ART-0076 | `mcp_server/__init__.py` | BACKEND_SOURCE | |
| ART-0077 | `mcp_server/feature_mcp.py` | BACKEND_SOURCE | |
| ART-0078 | `package.json` | CONFIG_OR_MISC | |
| ART-0079 | `parallel_orchestrator.py` | BACKEND_SOURCE | |
| ART-0080 | `progress.py` | BACKEND_SOURCE | |
| ART-0081 | `prompts.py` | BACKEND_SOURCE | |
| ART-0082 | `pyproject.toml` | CONFIG_OR_MISC | |
| ART-0083 | `rate_limit_utils.py` | BACKEND_SOURCE | |
| ART-0084 | `registry.py` | BACKEND_SOURCE | |
| ART-0085 | `requirements-prod.txt` | DOCUMENTATION | |
| ART-0086 | `requirements.txt` | DOCUMENTATION | |
| ART-0087 | `security.py` | BACKEND_SOURCE | |
| ART-0088 | `server/__init__.py` | BACKEND_SOURCE | |
| ART-0089 | `server/main.py` | BACKEND_SOURCE | |
| ART-0090 | `server/routers/__init__.py` | BACKEND_SOURCE | |
| ART-0091 | `server/routers/agent.py` | BACKEND_SOURCE | |
| ART-0092 | `server/routers/assistant_chat.py` | BACKEND_SOURCE | |
| ART-0093 | `server/routers/devserver.py` | BACKEND_SOURCE | |
| ART-0094 | `server/routers/expand_project.py` | BACKEND_SOURCE | |
| ART-0095 | `server/routers/features.py` | BACKEND_SOURCE | |
| ART-0096 | `server/routers/filesystem.py` | BACKEND_SOURCE | |
| ART-0097 | `server/routers/projects.py` | BACKEND_SOURCE | |
| ART-0098 | `server/routers/schedules.py` | BACKEND_SOURCE | |
| ART-0099 | `server/routers/settings.py` | BACKEND_SOURCE | |
| ART-0100 | `server/routers/spec_creation.py` | BACKEND_SOURCE | |
| ART-0101 | `server/routers/terminal.py` | BACKEND_SOURCE | |
| ART-0102 | `server/schemas.py` | BACKEND_SOURCE | |
| ART-0103 | `server/services/__init__.py` | BACKEND_SOURCE | |
| ART-0104 | `server/services/assistant_chat_session.py` | BACKEND_SOURCE | |
| ART-0105 | `server/services/assistant_database.py` | BACKEND_SOURCE | |
| ART-0106 | `server/services/chat_constants.py` | BACKEND_SOURCE | |
| ART-0107 | `server/services/dev_server_manager.py` | BACKEND_SOURCE | |
| ART-0108 | `server/services/expand_chat_session.py` | BACKEND_SOURCE | |
| ART-0109 | `server/services/process_manager.py` | BACKEND_SOURCE | |
| ART-0110 | `server/services/project_config.py` | BACKEND_SOURCE | |
| ART-0111 | `server/services/scheduler_service.py` | BACKEND_SOURCE | |
| ART-0112 | `server/services/spec_chat_session.py` | BACKEND_SOURCE | |
| ART-0113 | `server/services/terminal_manager.py` | BACKEND_SOURCE | |
| ART-0114 | `server/utils/__init__.py` | BACKEND_SOURCE | |
| ART-0115 | `server/utils/process_utils.py` | BACKEND_SOURCE | |
| ART-0116 | `server/utils/project_helpers.py` | BACKEND_SOURCE | |
| ART-0117 | `server/utils/validation.py` | BACKEND_SOURCE | |
| ART-0118 | `server/websocket.py` | BACKEND_SOURCE | |
| ART-0119 | `start.bat` | OPERATIONS_SCRIPT | |
| ART-0120 | `start.py` | OPERATIONS_SCRIPT | |
| ART-0121 | `start.sh` | OPERATIONS_SCRIPT | |
| ART-0122 | `start_ui.bat` | OPERATIONS_SCRIPT | |
| ART-0123 | `start_ui.py` | OPERATIONS_SCRIPT | |
| ART-0124 | `start_ui.sh` | OPERATIONS_SCRIPT | |
| ART-0125 | `temp_cleanup.py` | BACKEND_SOURCE | |
| ART-0126 | `test_client.py` | TEST | |
| ART-0127 | `test_dependency_resolver.py` | TEST | |
| ART-0128 | `test_devserver_security.py` | TEST | |
| ART-0129 | `test_rate_limit_utils.py` | TEST | |
| ART-0130 | `test_security.py` | TEST | |
| ART-0131 | `test_security_integration.py` | TEST | |
| ART-0132 | `ui/components.json` | FRONTEND_CONFIG | |
| ART-0133 | `ui/e2e/conversation-history.spec.ts` | TEST | |
| ART-0134 | `ui/e2e/tooltip.spec.ts` | TEST | |
| ART-0135 | `ui/eslint.config.js` | FRONTEND_CONFIG | |
| ART-0136 | `ui/index.html` | FRONTEND_SOURCE | |
| ART-0137 | `ui/package.json` | FRONTEND_CONFIG | |
| ART-0138 | `ui/playwright.config.ts` | FRONTEND_CONFIG | |
| ART-0139 | `ui/public/logo.png` | FRONTEND_SOURCE | |
| ART-0140 | `ui/public/ollama.png` | FRONTEND_SOURCE | |
| ART-0141 | `ui/public/vite.svg` | FRONTEND_SOURCE | |
| ART-0142 | `ui/src/App.tsx` | FRONTEND_SOURCE | |
| ART-0143 | `ui/src/components/ActivityFeed.tsx` | FRONTEND_SOURCE | |
| ART-0144 | `ui/src/components/AddFeatureForm.tsx` | FRONTEND_SOURCE | |
| ART-0145 | `ui/src/components/AgentAvatar.tsx` | FRONTEND_SOURCE | |
| ART-0146 | `ui/src/components/AgentCard.tsx` | FRONTEND_SOURCE | |
| ART-0147 | `ui/src/components/AgentControl.tsx` | FRONTEND_SOURCE | |
| ART-0148 | `ui/src/components/AgentMissionControl.tsx` | FRONTEND_SOURCE | |
| ART-0149 | `ui/src/components/AgentThought.tsx` | FRONTEND_SOURCE | |
| ART-0150 | `ui/src/components/AssistantChat.tsx` | FRONTEND_SOURCE | |
| ART-0151 | `ui/src/components/AssistantFAB.tsx` | FRONTEND_SOURCE | |
| ART-0152 | `ui/src/components/AssistantPanel.tsx` | FRONTEND_SOURCE | |
| ART-0153 | `ui/src/components/CelebrationOverlay.tsx` | FRONTEND_SOURCE | |
| ART-0154 | `ui/src/components/ChatMessage.tsx` | FRONTEND_SOURCE | |
| ART-0155 | `ui/src/components/ConfirmDialog.tsx` | FRONTEND_SOURCE | |
| ART-0156 | `ui/src/components/ConversationHistory.tsx` | FRONTEND_SOURCE | |
| ART-0157 | `ui/src/components/DebugLogViewer.tsx` | FRONTEND_SOURCE | |
| ART-0158 | `ui/src/components/DependencyBadge.tsx` | FRONTEND_SOURCE | |
| ART-0159 | `ui/src/components/DependencyGraph.tsx` | FRONTEND_SOURCE | |
| ART-0160 | `ui/src/components/DevServerConfigDialog.tsx` | FRONTEND_SOURCE | |
| ART-0161 | `ui/src/components/DevServerControl.tsx` | FRONTEND_SOURCE | |
| ART-0162 | `ui/src/components/EditFeatureForm.tsx` | FRONTEND_SOURCE | |
| ART-0163 | `ui/src/components/ExpandProjectChat.tsx` | FRONTEND_SOURCE | |
| ART-0164 | `ui/src/components/ExpandProjectModal.tsx` | FRONTEND_SOURCE | |
| ART-0165 | `ui/src/components/FeatureCard.tsx` | FRONTEND_SOURCE | |
| ART-0166 | `ui/src/components/FeatureModal.tsx` | FRONTEND_SOURCE | |
| ART-0167 | `ui/src/components/FolderBrowser.tsx` | FRONTEND_SOURCE | |
| ART-0168 | `ui/src/components/HumanInputForm.tsx` | FRONTEND_SOURCE | |
| ART-0169 | `ui/src/components/KanbanBoard.tsx` | FRONTEND_SOURCE | |
| ART-0170 | `ui/src/components/KanbanColumn.tsx` | FRONTEND_SOURCE | |
| ART-0171 | `ui/src/components/KeyboardShortcutsHelp.tsx` | FRONTEND_SOURCE | |
| ART-0172 | `ui/src/components/NewProjectModal.tsx` | FRONTEND_SOURCE | |
| ART-0173 | `ui/src/components/OrchestratorAvatar.tsx` | FRONTEND_SOURCE | |
| ART-0174 | `ui/src/components/OrchestratorStatusCard.tsx` | FRONTEND_SOURCE | |
| ART-0175 | `ui/src/components/ProgressDashboard.tsx` | FRONTEND_SOURCE | |
| ART-0176 | `ui/src/components/ProjectSelector.tsx` | FRONTEND_SOURCE | |
| ART-0177 | `ui/src/components/ProjectSetupRequired.tsx` | FRONTEND_SOURCE | |
| ART-0178 | `ui/src/components/QuestionOptions.tsx` | FRONTEND_SOURCE | |
| ART-0179 | `ui/src/components/ResetProjectModal.tsx` | FRONTEND_SOURCE | |
| ART-0180 | `ui/src/components/ScheduleModal.tsx` | FRONTEND_SOURCE | |
| ART-0181 | `ui/src/components/SettingsModal.tsx` | FRONTEND_SOURCE | |
| ART-0182 | `ui/src/components/SetupWizard.tsx` | FRONTEND_SOURCE | |
| ART-0183 | `ui/src/components/SpecCreationChat.tsx` | FRONTEND_SOURCE | |
| ART-0184 | `ui/src/components/Terminal.tsx` | FRONTEND_SOURCE | |
| ART-0185 | `ui/src/components/TerminalTabs.tsx` | FRONTEND_SOURCE | |
| ART-0186 | `ui/src/components/ThemeSelector.tsx` | FRONTEND_SOURCE | |
| ART-0187 | `ui/src/components/TypingIndicator.tsx` | FRONTEND_SOURCE | |
| ART-0188 | `ui/src/components/ViewToggle.tsx` | FRONTEND_SOURCE | |
| ART-0189 | `ui/src/components/mascotData.tsx` | FRONTEND_SOURCE | |
| ART-0190 | `ui/src/components/ui/alert.tsx` | FRONTEND_SOURCE | |
| ART-0191 | `ui/src/components/ui/badge.tsx` | FRONTEND_SOURCE | |
| ART-0192 | `ui/src/components/ui/button.tsx` | FRONTEND_SOURCE | |
| ART-0193 | `ui/src/components/ui/card.tsx` | FRONTEND_SOURCE | |
| ART-0194 | `ui/src/components/ui/checkbox.tsx` | FRONTEND_SOURCE | |
| ART-0195 | `ui/src/components/ui/dialog.tsx` | FRONTEND_SOURCE | |
| ART-0196 | `ui/src/components/ui/dropdown-menu.tsx` | FRONTEND_SOURCE | |
| ART-0197 | `ui/src/components/ui/input.tsx` | FRONTEND_SOURCE | |
| ART-0198 | `ui/src/components/ui/label.tsx` | FRONTEND_SOURCE | |
| ART-0199 | `ui/src/components/ui/separator.tsx` | FRONTEND_SOURCE | |
| ART-0200 | `ui/src/components/ui/switch.tsx` | FRONTEND_SOURCE | |
| ART-0201 | `ui/src/components/ui/textarea.tsx` | FRONTEND_SOURCE | |
| ART-0202 | `ui/src/components/ui/tooltip.tsx` | FRONTEND_SOURCE | |
| ART-0203 | `ui/src/hooks/useAssistantChat.ts` | FRONTEND_SOURCE | |
| ART-0204 | `ui/src/hooks/useCelebration.ts` | FRONTEND_SOURCE | |
| ART-0205 | `ui/src/hooks/useConversations.ts` | FRONTEND_SOURCE | |
| ART-0206 | `ui/src/hooks/useExpandChat.ts` | FRONTEND_SOURCE | |
| ART-0207 | `ui/src/hooks/useFeatureSound.ts` | FRONTEND_SOURCE | |
| ART-0208 | `ui/src/hooks/useProjects.ts` | FRONTEND_SOURCE | |
| ART-0209 | `ui/src/hooks/useSchedules.ts` | FRONTEND_SOURCE | |
| ART-0210 | `ui/src/hooks/useSpecChat.ts` | FRONTEND_SOURCE | |
| ART-0211 | `ui/src/hooks/useTheme.ts` | FRONTEND_SOURCE | |
| ART-0212 | `ui/src/hooks/useWebSocket.ts` | FRONTEND_SOURCE | |
| ART-0213 | `ui/src/lib/api.ts` | FRONTEND_SOURCE | |
| ART-0214 | `ui/src/lib/keyboard.ts` | FRONTEND_SOURCE | |
| ART-0215 | `ui/src/lib/timeUtils.ts` | FRONTEND_SOURCE | |
| ART-0216 | `ui/src/lib/types.ts` | FRONTEND_SOURCE | |
| ART-0217 | `ui/src/lib/utils.ts` | FRONTEND_SOURCE | |
| ART-0218 | `ui/src/main.tsx` | FRONTEND_SOURCE | |
| ART-0219 | `ui/src/styles/globals.css` | FRONTEND_SOURCE | |
| ART-0220 | `ui/src/vite-env.d.ts` | FRONTEND_SOURCE | |
| ART-0221 | `ui/tsconfig.app.json` | FRONTEND_CONFIG | |
| ART-0222 | `ui/tsconfig.json` | FRONTEND_CONFIG | |
| ART-0223 | `ui/tsconfig.node.json` | FRONTEND_CONFIG | |
| ART-0224 | `ui/vite.config.ts` | FRONTEND_CONFIG | |

# Testing Patterns

**Analysis Date:** 2026-02-24

## Test Framework

**Python Runner/Assertions:**
- Mixed `pytest`-style function tests and `unittest.TestCase` classes.
- Core examples: `test_dependency_resolver.py`, `test_security.py`, `test_client.py`, `test_devserver_security.py`.

**UI E2E:**
- Playwright tests under `ui/e2e/` (`conversation-history.spec.ts`, `tooltip.spec.ts`).
- Configured in `ui/playwright.config.ts` with Chromium project and local `npm run dev` web server.

**Run Commands:**
```bash
python -m pytest test_dependency_resolver.py -v
python test_security.py
python test_security_integration.py
npm --prefix ui run lint
npm --prefix ui run build
npm --prefix ui run test:e2e
```

## Test File Organization

**Backend Tests:**
- Root-level `test_*.py` files (no dedicated `tests/` package).
- Focused modules for security, dependency graph logic, and client env handling.

**Frontend Tests:**
- End-to-end specs in `ui/e2e/`.
- No broad unit/component test suite currently present in `ui/src/`.

## Test Structure

**Common Backend Pattern:**
- Arrange data fixtures inline.
- Execute pure function/router validation logic.
- Assert output shape or raised exception text.

**Common Security Test Pattern:**
- Temp directories + env var patching to simulate user/org configs.
- Assertions target allowlist/blocklist behavior and command parser hardening.

## Mocking

**Framework/Techniques:**
- `tempfile.TemporaryDirectory()` and environment mutation for filesystem/auth/provider scenarios.
- `pytest.raises(...)` for invalid command/validation branches.
- Minimal heavy mocking frameworks; many tests run real local logic against temporary files/SQLite.

**What Is Commonly Mocked:**
- Environment variables and HOME paths.
- Local config and project filesystem state.

**What Is Rarely Mocked:**
- End-to-end multi-process orchestrator behavior.
- UI network layers in isolated unit tests.

## Fixtures and Factories

**Current State:**
- Mostly ad-hoc inline fixtures in each test file.
- Reusable setup helpers exist for env restoration in security/client tests.
- No centralized Python fixture package (`conftest.py`) in repository root.

## Coverage

**CI Enforcement:**
- CI currently runs Python lint + `test_security.py`, plus UI lint/build (`.github/workflows/ci.yml`).
- No explicit global coverage percentage gates in CI.

**Practical Coverage Profile:**
- Strongest around command-security and dependency resolver logic.
- Weaker around full orchestrator loop, websocket streaming races, and UI component behavior.

## Test Types

**Unit Tests:**
- Dependency resolution and utility functions (`test_dependency_resolver.py`, `test_rate_limit_utils.py`).

**Integration-Oriented Backend Tests:**
- Security hook/config hierarchy tests interacting with temp files and realistic command strings (`test_security.py`, `test_security_integration.py`, `test_devserver_security.py`).

**E2E UI Tests:**
- Playwright checks for assistant panel and tooltip interactions (`ui/e2e/*.spec.ts`).

## Common Patterns

**Error Path Validation:**
- High frequency of negative-case assertions (`pytest.raises`, detailed error message matching).

**Data/State Isolation:**
- Heavy use of temporary directories to avoid polluting real config paths.

**Cross-Platform Awareness:**
- Tests include Windows/macOS/Linux command and path branch checks where relevant.

---

*Testing analysis: 2026-02-24*
*Update when CI scope, test tooling, or test organization changes*

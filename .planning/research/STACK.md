# Stack Research

**Domain:** Spec-first regeneration of an autonomous coding platform with TypeScript/Bun/SolidJS target
**Researched:** 2026-02-24
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| TypeScript | 5.x (current stable line) | Single language across backend, orchestration, tooling, and UI | Enforces one-language mandate while preserving strong typing for large-surface parity work |
| Bun | 1.x (current stable line) | Runtime, package manager, test runner, and script execution | Meets pure Bun requirement, simplifies toolchain, strong dev-loop speed for spec-to-implementation cycles |
| SolidJS | 1.x (current stable line) | UI framework replacement for existing React surface | Fine-grained reactivity fits high-frequency telemetry views (logs, websocket state) with lower rerender overhead |
| Hono (or Elysia) | Current stable line | HTTP/WebSocket API layer replacing FastAPI surface | Lightweight TS-first server framework for preserving REST/WS contracts without Python runtime |
| SQLite + typed ORM (Drizzle/Kysely) | Current stable lines | Project registry, feature store, schedule/assistant persistence | Retains proven single-node SQLite model with stronger schema typing and migration ergonomics in TS |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | Current stable line | Runtime validation for API payloads, config, and websocket messages | Use at every API boundary and spec ingestion boundary |
| node-pty | Current stable line | PTY-backed terminal sessions for browser terminal features | Use where parity requires interactive terminal semantics (Windows/macOS/Linux) |
| TanStack Query (Solid adapter) | Current stable line | Data fetching/mutation/cache patterns in Solid UI | Use to preserve existing query/mutation patterns from React implementation |
| Playwright | Current stable line | End-to-end test automation and parity verification | Use for UI behavior parity and regression checks during migration |
| YAML parser + markdown tooling | Current stable line | Parse docs, workflows, and policy specs as first-class artifacts | Use for non-code parity coverage (workflows/scripts/docs) |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Biome (or ESLint + Prettier) | Linting/formatting | Prefer one fast formatter/linter setup to keep docs+code changes consistent |
| Vitest + Bun test | Unit/integration tests | Use deterministic fixtures for orchestration logic and parsers |
| Changesets (or standard release tooling) | Version/release management | Useful if rebuilt project is distributed via npm similar to current repo |
| TypeDoc / custom markdown generators | API and contract docs generation | Helps keep generated docs aligned with hand-written spec corpus |

## Installation

```bash
# Core
bun add hono zod drizzle-orm sqlite3

# UI (Solid + query + router)
bun add solid-js @solidjs/router @tanstack/solid-query

# Supporting
bun add ws node-pty yaml gray-matter markdown-it

# Dev dependencies
bun add -d vitest @playwright/test typescript biome
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Bun runtime + package manager | Node.js + pnpm | Choose if a critical dependency fails under Bun compatibility in production |
| Hono/Elysia server | Fastify/Express | Choose if plugin ecosystem requirements exceed Hono/Elysia needs |
| SolidJS | React | Choose only if parity migration risk is lower by preserving existing React code path |
| Drizzle/Kysely | Raw SQL with sqlite driver | Choose for minimal abstraction if migration tooling becomes a blocker |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Mixed Python+TS runtime in target rebuild | Violates explicit requirement and doubles operational surface | Pure TS/Bun architecture |
| Premature microservices split | Increases parity risk, operational burden, and drift during migration | Single-process modular monolith first |
| Language-agnostic vague specs | Produces non-deterministic regeneration and missing capabilities | Contract-first specs with explicit interfaces/checklists |
| Generated artifact parity (dist/caches/venv) | No stable product intent and high noise/churn | Source + ops artifact parity only |

## Stack Patterns by Variant

**If parity-critical subsystem has Bun compatibility issues:**
- Use an adapter boundary around that subsystem (e.g., PTY/process integration) while keeping the rest pure Bun
- Because this isolates risk without abandoning the stack decision

**If UI parity requires incremental migration:**
- Preserve API contract and run parallel UI adapters in Solid until screens are fully ported
- Because behavior parity is the hard constraint, not one-shot rewrite speed

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| SolidJS 1.x | Vite/Bun plugin chain | Validate SSR/hydration decisions if any routes require server rendering |
| Bun 1.x | node-compat packages (subset) | Validate `node-pty` and process APIs early on all 3 platforms |
| Drizzle/Kysely | SQLite drivers | Confirm migration tooling supports existing schema evolution patterns |

## Sources

- Local codebase analysis: `.planning/codebase/STACK.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `CONCERNS.md`
- Existing implementation contracts from repository source (`server/`, `api/`, `ui/`, `mcp_server/`, scripts/workflows)
- Official docs to validate during implementation-phase planning: [bun.sh](https://bun.sh), [docs.solidjs.com](https://docs.solidjs.com), [typescriptlang.org](https://www.typescriptlang.org)

---
*Stack research for: spec-first TS/Bun/Solid regeneration of AutoForge*
*Researched: 2026-02-24*

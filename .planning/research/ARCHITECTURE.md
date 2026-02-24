# Architecture Research

**Domain:** Documentation architecture for deterministic codebase regeneration
**Researched:** 2026-02-24
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Scope & Inventory Layer                  │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │ Tree Snapshot  │ │ Inclusion Rules│ │ Artifact Index │  │
│  └──────┬─────────┘ └──────┬─────────┘ └──────┬─────────┘  │
│         │                  │                  │            │
├─────────┴──────────────────┴──────────────────┴────────────┤
│                    Contract Extraction Layer                │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Per-file specs + API/data/process/security contracts │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Migration & Verification Layer           │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │ Parity Matrix│ │ Risk Register│ │ Rebuild Checklist  │  │
│  └──────────────┘ └──────────────┘ └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Inventory index | Defines complete in-scope artifact set | Markdown index + inclusion/exclusion policy |
| Per-file contract specs | Captures each file’s intent, interfaces, dependencies, side effects | One markdown spec per file or grouped module |
| Surface contract catalogs | Cross-cutting behavior for APIs, websockets, schemas, process lifecycle | Thematic specs with references to file specs |
| Parity matrix | Maps current files/modules to TS/Bun/Solid targets | Tabular old→new mapping with status |
| Rebuild checklist | Ordered implementation/verification sequence | Phase/wave checklist with acceptance tests |

## Recommended Project Structure

```text
.planning/
├── PROJECT.md
├── config.json
├── codebase/                 # Current-state map (already created)
├── research/
│   ├── STACK.md
│   ├── FEATURES.md
│   ├── ARCHITECTURE.md
│   ├── PITFALLS.md
│   └── SUMMARY.md
├── REQUIREMENTS.md
├── ROADMAP.md
├── STATE.md
└── specs/
    ├── INDEX.md              # Scope + inventory
    ├── files/                # Per-file contracts
    ├── contracts/            # API/data/process/security contracts
    ├── migration/            # Old->new parity matrix + mapping notes
    └── verification/         # Rebuild and acceptance checklists
```

### Structure Rationale

- **`specs/files/`:** forces exhaustive and auditable file-level capture.
- **`specs/contracts/`:** avoids duplicated protocol and lifecycle logic across file specs.
- **`specs/migration/`:** centralizes TS/Bun/Solid transformation decisions.
- **`specs/verification/`:** keeps “definition of done” executable rather than narrative.

## Architectural Patterns

### Pattern 1: Contract-first specification

**What:** Define observable behavior and interfaces before implementation detail.
**When to use:** Every high-impact module (APIs, schedulers, process managers, websocket handlers).
**Trade-offs:** More upfront effort, much lower reconstruction ambiguity.

### Pattern 2: Traceable decomposition

**What:** Each requirement links to concrete files/contracts/checks.
**When to use:** In parity initiatives where missing one artifact breaks 1:1 goals.
**Trade-offs:** Requires disciplined cross-references.

### Pattern 3: Dual-track migration mapping

**What:** Current behavior contract + target implementation notes live together.
**When to use:** Stack migration with strict behavior parity.
**Trade-offs:** Larger docs, clearer migration path and fewer hidden assumptions.

## Data Flow

### Request Flow

```text
Repository tree
    ↓
Scope policy
    ↓
Artifact inventory
    ↓
Per-file contract extraction
    ↓
Cross-cutting contract synthesis
    ↓
Parity mapping (old->new)
    ↓
Reconstruction checklist + acceptance criteria
```

### State Management

```text
Inventory index
    ↓ (references)
File specs ↔ Contract catalogs ↔ Migration matrix
    ↓
Verification checklist (final authority for completion)
```

### Key Data Flows

1. **Coverage flow:** git tree → inventory → file specs → coverage validation.
2. **Migration flow:** current contract → target TS/Bun/Solid design note → parity mapping entry.
3. **Verification flow:** requirement → implementation step → acceptance check.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| <300 files | Single maintainers can manage manual spec authoring and review |
| 300-1000 files | Add module-level templates, ownership tags, and automated coverage checks |
| 1000+ files | Introduce generated metadata indexes and CI drift checks per directory |

### Scaling Priorities

1. **First bottleneck:** consistency across hundreds of specs — solve with strict templates.
2. **Second bottleneck:** spec drift from code — solve with diff-based review + CI checks.

## Anti-Patterns

### Anti-Pattern 1: Big narrative docs without file traceability

**What people do:** Write long architecture prose with little artifact linkage.
**Why it's wrong:** Cannot regenerate exact behavior; critical details are untestable.
**Do this instead:** Use file-level contracts and explicit traceability tables.

### Anti-Pattern 2: Migration notes separated from current behavior

**What people do:** Write a clean-room target design disconnected from current code.
**Why it's wrong:** High risk of silently dropping features.
**Do this instead:** Maintain one-to-one old->new mapping with acceptance checks.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Git metadata | Tree snapshot + status checks | Used for coverage and drift control |
| CI workflows | Spec validation hooks | Ensure docs stay aligned with implementation |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| File specs ↔ contract catalogs | Reference links + IDs | Avoid duplicate protocol definitions |
| Contracts ↔ migration matrix | Requirement/contract IDs | Ensures each target item traces to source behavior |

## Sources

- Existing architecture and structure docs in `.planning/codebase/`
- User constraints from initialization decisions
- Existing repository module boundaries (`api/`, `server/`, `ui/`, `mcp_server/`, scripts/docs)

---
*Architecture research for: deterministic regeneration spec system*
*Researched: 2026-02-24*

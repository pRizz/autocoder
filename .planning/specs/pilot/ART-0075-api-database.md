# ART-0075: api-database

## Artifact Identity
- ART ID: ART-0075
- Path: api/database.py
- Category: BACKEND_SOURCE
- Contract Version: 1.0

## Purpose
Provide SQLAlchemy models, migration helpers, and project-scoped database connection/session utilities for feature and scheduling persistence.

## Ownership
- Owns: database model definitions (`Feature`, `Schedule`, `ScheduleOverride`), engine/session factory helpers, compatibility migrations.
- Does not own: API route behavior, business workflow orchestration, UI state management.

## Inputs
- Project directory path used to resolve SQLite location.
- SQLAlchemy engine/session configuration and runtime DB state.
- Environment/runtime constraints (filesystem availability, SQLite behavior).

## Outputs
- SQLAlchemy model metadata and ORM classes.
- Database engine/session objects for callers.
- JSON-serializable dictionaries from model `to_dict` methods.

## Side Effects
- Creates/opens SQLite database files via SQLAlchemy engine usage.
- Executes migration SQL statements altering schema and updating null/default values.
- Commits transactional changes during migration helpers.

## Direct Dependencies
- ART-0079 `autoforge_paths.py`: database path resolution helper.
- ART-0096 `server/main.py`: initializes and consumes database layer.
- ART-0111 `server/services/assistant_database.py`: downstream service-level DB operations.

## Error and Edge Behavior
- Handles missing legacy columns via migration checks before ALTER operations.
- Treats malformed/NULL dependency JSON defensively (`get_dependencies_safe`).
- Database mutation failures propagate through SQLAlchemy exceptions to callers.

## Acceptance Checks
- [ ] Model classes and helper functions map directly to persisted feature/schedule concerns.
- [ ] Side effects explicitly capture migration writes and transactional commits.
- [ ] Direct dependencies reference concrete consuming artifacts.

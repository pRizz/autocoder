# Pilot File Spec Matrix

**Status:** Active  
**Phase:** 03 (File Contract Framework & Pilot Pass)  
**Last updated:** 2026-02-24

## Coverage Matrix

| Subsystem Type | Artifact ID | Source Path | Pilot Contract | Status |
| --- | --- | --- | --- | --- |
| Backend Source | ART-0075 | `api/database.py` | `ART-0075-api-database.md` | Complete |
| Frontend Source | ART-0155 | `ui/src/App.tsx` | `ART-0155-ui-src-app.md` | Complete |
| Documentation | ART-0071 | `README.md` | `ART-0071-readme.md` | Complete |
| Workflow | ART-0028 | `.github/workflows/ci.yml` | `ART-0028-ci-workflow.md` | Complete |
| Operations Script | ART-0134 | `start.sh` | `ART-0134-start-sh.md` | Complete |

## Pilot Scope Notes

- This pilot set intentionally spans both runtime code and non-code operational artifacts.
- Each entry follows schema-required sections: Purpose, Ownership, Inputs, Outputs, Side Effects, Direct Dependencies, Acceptance Checks.
- Matrix rows reference canonical inventory IDs to preserve traceability.

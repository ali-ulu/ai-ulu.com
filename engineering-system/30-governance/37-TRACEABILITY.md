# Bidirectional Traceability

Forward:
NEED → EVID → REQ/NFR → SPEC → ADR/FLOW/DATA → CMP → TASK → EXE → CODE/TEST → DEPLOY

Reverse navigation must also work.

Integrity audit detects:
- orphan requirement
- orphan task
- orphan code/change
- orphan test
- stale task after upstream change
- superseded decision still referenced
- evidence-backed claim with missing/expired evidence

No baseline approval with unresolved critical traceability breaks.

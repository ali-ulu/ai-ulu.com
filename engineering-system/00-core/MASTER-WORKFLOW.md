# Master Workflow

## A — Discovery & Validation
Intake → clarification triage → problem discovery → market validation if relevant → competitor analysis if relevant → repository/implementation research if relevant → literature/domain research if relevant → feasibility → requirements discovery → GO / CONDITIONAL-GO / POC-FIRST / NO-GO.

## B — Engineering Planning
Requirements → requirements analysis → NFRs → scope → product model → flows →
**invariants** → specifications (scenario form) → **contracts** → data model →
architecture → deployment/distribution → security/quality → engineering rules →
technology/dependencies → ADR/assumptions/risks/debt → decomposition →
dependency graph → tasks → context packs → execution contracts →
traceability audit → plan quality score → baseline approval.

Order matters. Invariants come before specifications because a specification
must not contradict a rule that already holds. Contracts come before
architecture's dependent code because a fixed boundary is what lets both sides
be built at once.

## C — Build
Implementation proceeds only against the approved baseline. CHG/DEV/APR/REC governance applies.

## D — Verify
Automated checks → AI review → risk/confidence → human/hybrid review when required → review receipt.

## E — Launch
Deploy/configure production, verify health/monitoring/backups/rollback, issue launch handoff.

## F — Learn
Capture project learnings as candidates, never automatic global truth.

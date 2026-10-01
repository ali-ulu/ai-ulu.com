# ID & Status Standard

NEED-### customer need
EVID-### evidence
REQ-### functional requirement
NFR-### non-functional requirement
SPEC-### behavior specification
FLOW-### flow
ADR-### architecture decision
ASM-### assumption
RISK-### risk
TD-### technical debt
CMP-### component/module
TASK-### task
EXE-### execution contract
CHG-### change request
DEV-### deviation
APR-### approval
BASE-### baseline
REC-### recovery event
REV-### verification/review
LEARN-### learning candidate

Statuses: DRAFT, REVIEW-REQUIRED, APPROVED, BLOCKED, SUPERSEDED, REJECTED, DONE.

## Required fields per type

The field lists in the numbered documents are the contract. This table is the
machine-checkable summary of them; `tools/engineering-validator` enforces it.

| Type | Required fields |
|------|-----------------|
| NEED | customer statement, user/actor, desired outcome, evidence, confidence |
| EVID | claim, source, source type, access date, evidence summary, reliability, confidence |
| REQ | description, source, priority, acceptance criteria, status |
| NFR | description, category, criterion, status |
| SPEC | linked requirements (or linked evidence), trigger, normal behavior, acceptance examples, status |
| FLOW | linked requirements, failure path, status |
| ADR | status, context, decision, why, consequences |
| ASM | assumption, confidence, impact if false, validation, status |
| RISK | risk, probability, impact, mitigation, status |
| TD | decision, reason, impact, resolution trigger, status |
| CMP | responsibility, interfaces, status |
| TASK | objective, linked requirements, expected output, acceptance criteria, status |
| EXE | task, can, cannot, must, status |
| CHG | request, reason, impact, affected artifacts, status |
| DEV | reason, discovered constraint, impact, proposed resolution, status |
| APR | decision class, approver, date, status |
| BASE | created, contents, approvals, status |
| REC | trigger, blast radius, recovery step, verification, status |
| REV | scope, commit, criteria, result, status |
| LEARN | observation, evidence, project context, confidence, candidate lesson |

Status is optional for NEED, EVID, CMP and LEARN, whose source documents do not
define one. Every other type must carry a status from the list above.

## Required upstream links

Traceability is only real if each artifact names its reason. These links are
required; a group is skipped when no artifact of that family exists in the
project, so a project without NFRs is not penalised for it.

| Type | Must link to at least one of |
|------|------------------------------|
| REQ, NFR | NEED or EVID (provenance may pass through evidence) |
| SPEC | REQ or NFR |
| FLOW | REQ, and SPEC |
| ADR | REQ or NFR, and EVID |
| TASK | REQ or NFR, and SPEC or EVID |
| EXE | TASK |
| CHG | REQ, SPEC or ADR |
| DEV | TASK or EXE |
| REV | TASK, EXE or REQ |
| BASE | REQ, NFR or SPEC |

## Record format

Registries are Markdown. An artifact starts at a `## ID` / `### ID` heading and
carries `- key: value` bullets. Keys are case-insensitive and fold runs of
spaces, so `Acceptance criteria` and `acceptance  criteria` are the same field.
Any `XXXX-###` token inside a reference field becomes a traceability edge.

```markdown
### REQ-001 Self-serve signup

- Description: a visitor can create an account without ops involvement
- Source: NEED-001
- Priority: HIGH
- Acceptance criteria: signup completes with no operator action
- Status: APPROVED
```

## Enforcement

`engineering-system/tools/engineering-validator` reads a project workspace and
reports ID, status, field, approval and traceability violations, then prints the
baseline gate from `90-templates/FINAL-PLAN-AUDIT.md`. Run it before proposing a
baseline; a baseline that fails the gate is not project truth.

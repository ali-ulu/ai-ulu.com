# Engineering Validator

Turns the Engineering System from prose into something a machine can check.

The system already says what a project must record: IDs from
`00-core/ID-AND-STATUS-STANDARD.md`, field lists from the numbered documents,
approval rules from `30-governance/35-CHANGE-DEVIATION-APPROVAL.md`, and the
gate checklist in `90-templates/FINAL-PLAN-AUDIT.md`. Until now nothing verified
that a real project actually did any of it. This tool does.

Zero dependencies, Node 18+, no network access.

## Commands

```bash
# Validate a project workspace (defaults to the current directory)
node engineering-system/tools/engineering-validator/bin/engineering-validate.js path/to/project

# Machine-readable report
node .../engineering-validate.js path/to/project --json

# Only the baseline gate checklist
node .../engineering-validate.js path/to/project --gate-only

# Fail on warnings too
node .../engineering-validate.js path/to/project --strict

# Freeze "today" for evidence-expiry checks (reproducible CI)
node .../engineering-validate.js path/to/project --now=2026-10-01

# Create a workspace, scaled to complexity
node engineering-system/tools/engineering-validator/bin/engineering-init.js my-project --complexity=STANDARD
```

Exit codes: `0` clean, `1` findings, `2` bad usage.

## Registry format

A registry is a Markdown file. The validator reads it back, so the file stays
readable for humans and machines at the same time.

```markdown
### REQ-001 Self-serve signup

- Description: a visitor can create an account without ops involvement
- Source: NEED-001
- Actor: visitor
- Priority: HIGH
- Acceptance criteria: signup completes with no operator action
- Confidence: EVIDENCE-BACKED
- Status: APPROVED
```

Rules the parser applies:

- An artifact starts at `## <ID>`, `### <ID>` or `#### <ID>`. The ID prefix
  determines the artifact type.
- Fields are `- key: value` bullets. Keys are matched case-insensitively with
  runs of spaces folded to one, so `Acceptance criteria` and
  `acceptance  criteria` are the same key.
- A continuation line indented by two or more spaces appends to the previous
  field.
- Any `XXXX-###` token inside a reference field becomes an edge in the
  traceability graph.

Expected files, matching `90-templates/PROJECT-WORKSPACE.md`:
`intake.md`, `discovery.md`, `evidence.md`, `feasibility.md`, `requirements.md`,
`nfr.md`, `scope.md`, `product-model.md`, `flows.md`, `specifications.md`,
`data-model.md`, `architecture.md`, `deployment.md`, `security-quality.md`,
`decisions.md`, `assumptions.md`, `risks.md`, `debt.md`, `traceability.md`,
`baseline.md`, plus every `.md` under `changes/`, `tasks/`, `components/`,
`context-packs/`, `execution-contracts/`, `handoffs/`, `verification/`,
`launch/`.

## What it checks

Structural (errors):

- unknown ID prefix
- missing or invalid status
- missing required field for the artifact type
- duplicate ID across files
- reference to an ID that does not exist (`DANGLING-REF`)
- an approved `CHG`/`DEV` with no `APR` approval
- a requirement claiming `EVIDENCE-BACKED` with no `EVID` behind it
- expired evidence, or evidence that is `REJECTED`/`SUPERSEDED` while still
  backing live work

Traceability (from `30-governance/37-TRACEABILITY.md`):

- orphan requirement with nothing consuming it
- orphan specification linked to no requirement
- approved task with no execution contract
- superseded decision still referenced

Warnings never block on their own; `--strict` promotes them.

## Baseline gate

`--gate-only` prints the eleven items from `90-templates/FINAL-PLAN-AUDIT.md`
that can be decided from the registries: GO decision, requirement sources,
acceptance criteria, NFR measurability, spec coverage, task/execution-contract
pairing, stop conditions, pending changes, traceability integrity, approved
baseline, and high-risk mitigation.

Items that need human judgement — evidence currency, architecture fit,
proportionality — are deliberately not automated. A passing gate means the
mechanical preconditions are met, not that the plan is good.

## Tests

```bash
cd engineering-system/tools/engineering-validator
npm test
```

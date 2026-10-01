# AI-ULU Engineering System

AI-ULU Engineering System turns an unclear software request into an evidence-backed, traceable, controlled engineering plan that can be executed by an AI coding agent, a developer, or a team.

It is not a coding framework and it is not a pile of prompts. It is a software delivery operating system built around four commercial stages:

**Blueprint → Build → Verify → Launch**

Core path:

Need → Discovery → Research → Validation → Requirements → Specification → Architecture → Decomposition → Execution Contract → Build → Verify → Deploy → Learn

## Core principles
- Do not invent requirements.
- Unknown is an acceptable state.
- Evidence before confident claims.
- Simpler viable architecture wins.
- Every downstream artifact must be traceable to an upstream reason.
- Change is controlled, not silently absorbed.
- Human approval is mandatory for defined high-impact boundaries.
- Agents receive minimum sufficient context, not the whole project by default.
- Planning can conclude NO-GO / DO NOT BUILD.
- Verification is independent from implementation where practical.
- Deployment target is part of planning even when deployment itself is optional.

## Tooling

`tools/engineering-validator` enforces the parts of this system that can be
checked mechanically: the ID and status standard, required fields per artifact
type, protected-approval rules and bidirectional traceability. It also prints
the baseline gate from 90-templates/FINAL-PLAN-AUDIT.md.

```bash
node engineering-system/tools/engineering-validator/bin/engineering-init.js my-project --complexity=STANDARD
node engineering-system/tools/engineering-validator/bin/engineering-validate.js my-project
```

Zero dependencies, Node 18+. See tools/engineering-validator/README.md.

Start with START-HERE.md and 00-core/ENGINEERING-CONSTITUTION.md.

# AI-ULU Engineering System

AI-ULU Engineering System turns an unclear software request into an evidence-backed, traceable, controlled engineering plan that can be executed by an AI coding agent, a developer, or a team.

It is not a coding framework and it is not a pile of prompts. It is a software delivery operating system built around four commercial stages:

**Blueprint → Build → Verify → Launch**

Core path:

Need → Discovery → Research → Validation → Requirements → Invariants →
Specification → Contracts → Data Model → Architecture → Decomposition →
Execution Contract → Build → Verify → Deploy → Learn

Invariants and contracts come before specification and code on purpose. An
invariant states what must never become true, and it is the one artifact that
can be enforced mechanically rather than trusted to attention. A contract fixes
a boundary, which is what lets both sides of it be built at once.

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
- A rule that can be enforced mechanically must be; attention is not a control.
- Behavior is specified as examples, so it can be executed rather than interpreted.

## The design layer

The planning documents are not checklists of things to remember. Each one states
a technique and how to know it is done:

| Document | Technique |
|---|---|
| `20-planning/11-REQUIREMENTS-ANALYSIS.md` | ambiguity scored against impact; conflicts recorded, never resolved silently |
| `20-planning/16-BEHAVIOR-SPECIFICATIONS.md` | behavior as Gherkin scenarios that become the tests |
| `20-planning/23-INVARIANTS.md` | rules that must never break, each mapped to an enforcement rung |
| `20-planning/24-CONTRACTS.md` | boundaries fixed before either side is built |
| `20-planning/17-DATA-MODEL.md` | invariants pushed into schema constraints |
| `20-planning/18-ARCHITECTURE.md` | dependency direction, ports and adapters, fitness functions |
| `50-verify/54-TEST-STRATEGY.md` | what is tested at which level, and what is deliberately not |

Start with START-HERE.md and 00-core/ENGINEERING-CONSTITUTION.md.

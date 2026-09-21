# Execution Contract

EXE-### constrains an AI agent or developer.

## CAN
Explicit files/modules/APIs/actions allowed.

## CANNOT
Examples: change database schema, add dependencies, alter public API, modify another module, change architecture, expand scope.

## MUST
- follow linked SPEC/ADR
- run listed checks
- preserve contracts
- report discovered constraints
- stop when stop conditions trigger
- create DEV/CHG instead of silently deviating

## Output
Changed files, implementation summary, checks/results, deviations/change requests, unresolved concerns and handoff payload.

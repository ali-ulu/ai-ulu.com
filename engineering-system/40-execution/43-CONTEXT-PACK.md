# Minimum Sufficient Context Pack

Do not send the whole project to every agent by default.

A task context pack contains only relevant:
- current BASE-###
- TASK and EXE
- linked REQ/NFR/SPEC
- ADRs
- module/component contract
- data/API contracts
- engineering/security constraints
- known risks/assumptions
- dependency outputs
- allowed repository paths
- unresolved questions

Context packs are versioned. Upstream change marks affected packs REVIEW-REQUIRED.

# Idea Preservation Audit

Compare the current system against ORIGIN.md.

For every preserved capability mark:
- PRESENT
- MERGED, with destination
- DEFERRED, with reason
- REMOVED, requiring ADR + approval

A refactor is incomplete if a capability disappears only because nobody noticed.

## Last audit

Audited 2026-10-01 against ORIGIN.md.

| Capability | State |
|------------|-------|
| discovery before specification | PRESENT (10-discovery/) |
| market / competitor / repository / literature research | PRESENT (10-discovery/05–08) |
| feasibility dimensions and GO gate | PRESENT (10-discovery/09) |
| evidence states | PRESENT (10-discovery/04, enforced by validator CLAIM-WITHOUT-EVIDENCE / EVIDENCE-EXPIRED) |
| requirements analysis | PRESENT (20-planning/11) |
| YAGNI/KISS/DRY and scope classification | PRESENT (20-planning/13, 21) |
| product model and flow families | PRESENT (20-planning/14–16) |
| data model, architecture, engineering rules, dependency governance | PRESENT (20-planning/17, 18, 21, 22) |
| complexity-aware decomposition and dependency graph | PRESENT (40-execution/40, 41) |
| tasks, context packs, execution contracts | PRESENT (40-execution/42–44, scaffolded by engineering-init) |
| bidirectional traceability | PRESENT (30-governance/37, enforced by validator) |
| assumptions, ADRs, risks, debt | PRESENT (30-governance/30–33) |
| security across the lifecycle | PRESENT (20-planning/20) |
| change management, baselines, deviations, approvals, handoffs | PRESENT (30-governance/34, 35; 40-execution/45; PROTECTED-WITHOUT-APPROVAL) |
| reproducibility, rollback/recovery, stop conditions | PRESENT (40-execution/46, 47; 30-governance/36) |
| project profiles and complexity-scaled process | PRESENT (00-core/PROJECT-PROFILE-AND-PROCESS.md, engineering-init) |
| controlled project learning | PRESENT (70-learning/70) |
| DO-NOT-BUILD / NO-GO decisions | PRESENT (10-discovery/09; GO-DECISION gate item) |
| Blueprint/Build/Verify/Launch packaging | PRESENT (80-service/) |
| AI, human and hybrid verification | PRESENT (50-verify/50) |
| reviewer marketplace and review receipts | DEFERRED (50-verify/53, not built by design) |
| mechanical enforcement of ID/status/field/approval/traceability and the baseline gate | PRESENT (tools/engineering-validator, added 2026-10-01) |

No capability is REMOVED, so no ADR is required.

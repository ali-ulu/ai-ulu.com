# Start Here

## New project
1. Create a project workspace: `node engineering-system/tools/engineering-validator/bin/engineering-init.js <dir> --complexity=STANDARD`.
   Manual equivalent: copy 90-templates/PROJECT-WORKSPACE.md.
2. Fill 10-discovery/01-CUSTOMER-INTAKE.md.
3. Apply 00-core/PROJECT-PROFILE-AND-PROCESS.md.
4. Run 00-core/MASTER-WORKFLOW.md.
5. Do not cross a gate while a stop condition is active.
6. Validate the workspace before proposing a baseline:
   `node engineering-system/tools/engineering-validator/bin/engineering-validate.js <dir>`.
   Fix errors; the gate checklist is the same one in 90-templates/FINAL-PLAN-AUDIT.md.
7. Before implementation, create an approved BASE-###.
8. Generate task context packs and execution contracts, not free-form coding prompts.
9. After implementation, run verification handoff.
10. Deployment execution is optional; deployment/distribution strategy is not.

The latest approved baseline is canonical project truth, not the newest file timestamp or last AI message.
A baseline that fails the validator gate is not project truth either.

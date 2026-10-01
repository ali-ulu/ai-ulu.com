#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Create a project workspace from 90-templates/PROJECT-WORKSPACE.md.
 *
 * Only the artifacts required by the selected complexity are written, so a
 * LEAN project does not receive critical-system ceremony
 * (00-core/PROJECT-PROFILE-AND-PROCESS.md).
 */

const COMPLEXITY = {
  LEAN: ['PROJECT.md', 'intake.md', 'discovery.md', 'requirements.md', 'scope.md', 'tasks/'],
  STANDARD: [
    'PROJECT.md',
    'profile.md',
    'intake.md',
    'evidence.md',
    'discovery.md',
    'feasibility.md',
    'requirements.md',
    'nfr.md',
    'scope.md',
    'product-model.md',
    'flows.md',
    'specifications.md',
    'architecture.md',
    'deployment.md',
    'security-quality.md',
    'decisions.md',
    'assumptions.md',
    'risks.md',
    'traceability.md',
    'tasks/',
    'context-packs/',
    'execution-contracts/',
    'verification/',
  ],
  EXTENDED: null, // null = every artifact
  CRITICAL: null,
};

const FILES = {
  'PROJECT.md': `# Project

- Project ID: 
- Customer/owner: 
- Problem: 
- Current phase: DISCOVERY
- Primary approver: 
`,
  'profile.md': `# Profile

- Project type: 
- Complexity: 
- Risk class: 
- Process selection: 
- Method notes: 
`,
  'intake.md': `# Customer Intake

Capture only what the customer knows. Unknown is valid. A need is promoted to
NEED-### in discovery.md; this file stays as raw intake notes.

- Project / organization: 
- Problem to solve: 
- Intended users and actors: 
- Current workaround: 
- Desired outcomes: 
- Must-have capabilities: 
- Nice-to-have ideas: 
- Explicit out-of-scope items: 
- Existing code/repository/infrastructure: 
- Expected scale and geography: 
- Data types and sensitivity: 
- Integrations: 
- Budget/time constraints: 
- Target platforms: 
- Deployment/distribution expectations: 
- Compliance/security constraints: 
- Known competitors/references: 
- Stakeholders/approvers: 
- Unknowns: 
`,
  'evidence.md': `# Evidence Register

### EVID-001 <short claim>

- Claim: 
- Source: 
- Source type: 
- Access date: 
- Evidence summary: 
- Reliability: 
- Confidence: UNKNOWN
- Revalidation date: 
`,
  'discovery.md': `# Problem Discovery

### NEED-001 <short name>

- Customer statement: 
- Observed problem: 
- User/actor: 
- Current behavior: 
- Desired outcome: 
- Evidence: UNKNOWN
- Confidence: UNKNOWN
- Open questions: 
`,
  'feasibility.md': `# Feasibility & GO Gate

- Technical feasibility: 
- Economic feasibility: 
- Operational feasibility: 
- Security/privacy feasibility: 
- Schedule feasibility: 
- Platform feasibility: 
- Dependency feasibility: 
- Legal/regulatory feasibility: 
- Decision: UNKNOWN
`,
  'requirements.md': `# Requirements Register

### REQ-001 <short name>

- Description: 
- Source: NEED-001
- Actor: 
- Priority: 
- Preconditions: 
- Expected behavior: 
- Constraints: 
- Dependencies: 
- Acceptance criteria: 
- Risk: 
- Confidence: UNKNOWN
- Status: DRAFT
`,
  'nfr.md': `# Non-Functional Requirements Register

### NFR-001 <short name>

- Description: 
- Category: 
- Criterion: 
- Source: NEED-001
- Status: DRAFT
`,
  'scope.md': `# Scope

Classify every capability: REQUIRED, OPTIONAL, FUTURE, REJECTED, OUT-OF-SCOPE.

| Capability | Class | Rationale | Linked |
|------------|-------|-----------|--------|
|  |  |  |  |
`,
  'product-model.md': `# Product Model

- Users/actors: 
- Roles/permissions: 
- Entities: 
- Capabilities: 
- Business rules: 
- States/transitions: 
- Ownership boundaries: 
- Tenancy model: 
- Lifecycle rules: 
`,
  'flows.md': `# System Flows

### FLOW-001 <short name>

- Linked requirements: REQ-001
- Linked specifications: 
- Normal path: 
- Failure path: 
- Status: DRAFT
`,
  'specifications.md': `# Behavior Specifications

### SPEC-001 <short name>

- Linked requirements: REQ-001
- Trigger: 
- Preconditions: 
- Normal behavior: 
- Alternative behavior: 
- Error behavior: 
- Observable output: 
- Invariants: 
- Acceptance examples: 
- Unresolved items: 
- Status: DRAFT
`,
  'data-model.md': `# Data Model

- Entities/ownership: 
- Attributes/types: 
- Relationships: 
- Constraints: 
- Indexes/access patterns: 
- Lifecycle/retention: 
- Sensitive fields: 
- Migration strategy: 
- Archival/deletion: 
- Consistency needs: 
`,
  'architecture.md': `# Architecture

- Context/system boundary: 
- Components/modules/services: 
- Data ownership: 
- Integration boundaries: 
- Trust boundaries: 
- Runtime/deployment shape: 
- Major failure modes: 
- Scalability/reliability assumptions: 
`,
  'deployment.md': `# Deployment & Distribution Strategy

- Target: 
- Hosting/environment/provider: 
- Regions/data residency: 
- Database/storage location: 
- CDN/edge needs: 
- Domain/DNS/TLS: 
- Secrets/configuration: 
- CI/CD release path: 
- Observability: 
- Backups: 
- Rollback: 
- Distribution: 
- Definition of Production: 
`,
  'security-quality.md': `# Security & Quality Requirements

- Authentication/authorization: 
- Trust boundaries: 
- Least privilege: 
- Data protection: 
- Secrets: 
- Abuse/rate limiting: 
- Tenant isolation: 
- Dependency/supply-chain risk: 
- Logging/auditability: 
- Privacy/retention: 
- Availability/recovery: 
- Accessibility: 
- Maintainability/testability: 
`,
  'decisions.md': `# Architecture Decision Records

### ADR-001 <short title>

- Status: DRAFT
- Context: 
- Decision drivers: 
- Options considered: 
- Decision: 
- Why: 
- Consequences: 
- Evidence: 
- Affected artifacts: 
- Approval: 
- Supersedes / superseded by: 
`,
  'assumptions.md': `# Assumption Register

### ASM-001 <short assumption>

- Assumption: 
- Source: 
- Confidence: UNKNOWN
- Impact if false: 
- Validation: 
- Validation deadline/trigger: 
- Affected artifacts: 
- Status: DRAFT
`,
  'risks.md': `# Risk Register

### RISK-001 <short risk>

- Risk: 
- Category: 
- Probability: 
- Impact: 
- Exposure/priority: 
- Evidence: 
- Mitigation: 
- Contingency: 
- Owner: 
- Trigger: 
- Affected artifacts: 
- Status: DRAFT
`,
  'debt.md': `# Technical Debt Register

### TD-001 <short debt>

- Decision: 
- Reason: 
- Impact: 
- Risk: 
- Affected artifacts: 
- Owner: 
- Resolution trigger: 
- Approval: 
- Status: DRAFT
`,
  'traceability.md': `# Traceability

Forward: NEED → EVID → REQ/NFR → SPEC → ADR/FLOW/DATA → CMP → TASK → EXE → CODE/TEST → DEPLOY

Run \`engineering-validate .\` after each change; it rebuilds this graph from the
registries rather than trusting a hand-maintained table.
`,
  'baseline.md': `# Baseline

### BASE-001 <short name>

- Created: 
- Contents: 
- Approvals: 
- Status: DRAFT
`,
};

const DIRS = ['changes', 'tasks', 'context-packs', 'execution-contracts', 'handoffs', 'verification', 'launch', 'components'];

function scaffold(root, complexity) {
  if (!Object.prototype.hasOwnProperty.call(COMPLEXITY, complexity)) {
    throw new Error(`complexity must be one of ${Object.keys(COMPLEXITY).join(', ')}`);
  }
  const selection = COMPLEXITY[complexity];
  const wantedFiles = selection === null ? Object.keys(FILES) : selection.filter((s) => s.endsWith('.md'));
  const wantedDirs = selection === null ? DIRS : selection.filter((s) => s.endsWith('/')).map((s) => s.replace(/\/$/, ''));

  const created = [];
  fs.mkdirSync(root, { recursive: true });
  for (const name of wantedFiles) {
    const full = path.join(root, name);
    if (fs.existsSync(full)) continue;
    fs.writeFileSync(full, FILES[name]);
    created.push(name);
  }
  for (const dir of wantedDirs) {
    const full = path.join(root, dir);
    if (fs.existsSync(full)) continue;
    fs.mkdirSync(full, { recursive: true });
    fs.writeFileSync(path.join(full, '.gitkeep'), '');
    created.push(`${dir}/`);
  }

  const manifestPath = path.join(root, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(
      manifestPath,
      `${JSON.stringify(
        {
          projectId: path.basename(root),
          projectType: 'OTHER',
          complexity,
          riskClass: 'UNKNOWN',
          currentPhase: 'DISCOVERY',
          goStatus: 'UNKNOWN',
          primaryApprover: '',
          verificationMode: 'AI',
          repository: '',
          deploymentTarget: '',
          openStopConditions: [],
        },
        null,
        2,
      )}\n`,
    );
    created.push('manifest.json');
  }

  return created;
}

function usage() {
  return [
    'Usage: engineering-init <directory> [--complexity=LEAN|STANDARD|EXTENDED|CRITICAL]',
    '',
    'Creates an AI-ULU Engineering System project workspace.',
    'LEAN and STANDARD write only the artifacts their profile requires;',
    'EXTENDED and CRITICAL write every artifact.',
  ].join('\n');
}

function main(argv) {
  let root = null;
  let complexity = 'STANDARD';
  for (const arg of argv) {
    if (arg === '-h' || arg === '--help') {
      process.stdout.write(`${usage()}\n`);
      return 0;
    }
    if (arg.startsWith('--complexity=')) complexity = arg.slice('--complexity='.length).toUpperCase();
    else if (arg.startsWith('-')) {
      process.stderr.write(`unknown option ${arg}\n\n${usage()}\n`);
      return 2;
    } else if (root === null) root = arg;
    else {
      process.stderr.write(`only one directory may be given\n\n${usage()}\n`);
      return 2;
    }
  }
  if (!root) {
    process.stderr.write(`${usage()}\n`);
    return 2;
  }

  try {
    const created = scaffold(path.resolve(root), complexity);
    process.stdout.write(`Created ${created.length} item(s) in ${path.resolve(root)}\n`);
    for (const item of created) process.stdout.write(`  + ${item}\n`);
    process.stdout.write(`\nNext: fill intake.md, then run engineering-validate ${root}\n`);
    return 0;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    return 2;
  }
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { scaffold, main, COMPLEXITY };

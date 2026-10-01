'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { parseRegistry, extractIds, statusOf, makeId } = require('../lib/registry');
const { buildGraph, auditTraceability, auditGate } = require('../lib/graph');
const { validateWorkspace } = require('../lib/validate');
const { scaffold } = require('../bin/engineering-init');

function tempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'eng-validate-'));
}

function write(root, name, body) {
  const full = path.join(root, name);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, body);
}

/** A workspace that satisfies every gate item, used to prove the gate can pass. */
function completeWorkspace() {
  const root = tempWorkspace();
  write(root, 'feasibility.md', ['# Feasibility & GO Gate', '', '- Technical feasibility: feasible', '- Decision: GO'].join('\n'));
  write(
    root,
    'evidence.md',
    ['### EVID-001 Signups are manual', '- Claim: onboarding is manual', '- Source: customer interview', '- Source type: interview', '- Access date: 2026-09-01', '- Evidence summary: ops spends 2h/day', '- Reliability: medium', '- Confidence: MEDIUM', '- Revalidation date: 2027-01-01'].join('\n'),
  );
  write(
    root,
    'requirements.md',
    ['### REQ-001 Self-serve signup', '- Description: users sign up alone', '- Source: EVID-001', '- Actor: visitor', '- Priority: HIGH', '- Acceptance criteria: signup completes without ops', '- Confidence: EVIDENCE-BACKED', '- Status: APPROVED'].join('\n'),
  );
  write(root, 'specifications.md', ['### SPEC-001 Signup flow', '- Linked requirements: REQ-001', '- Trigger: submit form', '- Normal behavior: account created', '- Acceptance examples: given valid email then account exists', '- Status: APPROVED'].join('\n'));
  write(root, 'tasks/TASK-001.md', ['### TASK-001 Build signup', '- Objective: implement the form', '- Linked requirements: REQ-001', '- Linked specifications: SPEC-001', '- Expected output: form + endpoint', '- Acceptance criteria: SPEC-001 examples pass', '- Status: APPROVED'].join('\n'));
  write(root, 'execution-contracts/EXE-001.md', ['### EXE-001 Signup task contract', '- Task: TASK-001', '- Can: edit src/signup', '- Cannot: change schema', '- Must: run tests', '- Status: APPROVED'].join('\n'));
  write(root, 'baseline.md', ['### BASE-001 Initial', '- Created: 2026-10-01', '- Contents: REQ-001, SPEC-001', '- Approvals: APR-001', '- Status: APPROVED'].join('\n'));
  write(root, 'changes/APR-001.md', ['### APR-001 Baseline approval', '- Decision class: baseline', '- Approver: founder', '- Date: 2026-10-01', '- Status: APPROVED'].join('\n'));
  return root;
}

test('parseRegistry reads headings and bullets', () => {
  const md = [
    '# Requirements Register',
    '',
    '### REQ-001 Login',
    '',
    '- Description: Users can sign in',
    '- Source: NEED-001',
    '- Acceptance criteria: valid credentials return a session',
    '- Status: APPROVED',
  ].join('\n');

  const [artifact] = parseRegistry(md, { file: 'requirements.md' });
  assert.strictEqual(artifact.id, 'REQ-001');
  assert.strictEqual(artifact.type, 'REQ');
  assert.strictEqual(artifact.title, 'Login');
  assert.strictEqual(artifact.fields['description'], 'Users can sign in');
  assert.strictEqual(statusOf(artifact), 'APPROVED');
  assert.deepStrictEqual(extractIds(artifact.fields.source), ['NEED-001']);
});

test('parseRegistry folds multi-line values', () => {
  const md = ['### SPEC-002 Cart', '- Normal behavior: adds the item', '  then recomputes totals', '- Status: DRAFT'].join('\n');
  const [artifact] = parseRegistry(md);
  assert.strictEqual(artifact.fields['normal behavior'], 'adds the item then recomputes totals');
});

test('extractIds ignores duplicates and unrelated tokens', () => {
  assert.deepStrictEqual(extractIds('REQ-001, REQ-001 and RISK-014'), ['REQ-001', 'RISK-014']);
  assert.deepStrictEqual(extractIds('HTTP-200 is not an artifact'), ['HTTP-200']);
  assert.deepStrictEqual(extractIds(''), []);
});

test('makeId pads to three digits', () => {
  assert.strictEqual(makeId('REQ', 1), 'REQ-001');
  assert.strictEqual(makeId('TASK', 42), 'TASK-042');
});

test('buildGraph separates upstream from downstream edges', () => {
  const artifacts = [
    { id: 'NEED-001', type: 'NEED', fields: {}, title: '' },
    { id: 'REQ-001', type: 'REQ', fields: { source: 'NEED-001' }, title: '' },
    { id: 'SPEC-001', type: 'SPEC', fields: { 'linked requirements': 'REQ-001' }, title: '' },
  ];
  const graph = buildGraph(artifacts);
  assert.deepStrictEqual(graph.upstream.get('REQ-001'), ['NEED-001']);
  assert.deepStrictEqual(graph.upstream.get('SPEC-001'), ['REQ-001']);
  assert.deepStrictEqual(graph.downstream.get('NEED-001'), ['REQ-001']);
});

test('dangling references are reported as errors', () => {
  const artifacts = [{ id: 'REQ-001', type: 'REQ', fields: { source: 'NEED-999' }, title: '' }];
  const graph = buildGraph(artifacts);
  const findings = auditTraceability(artifacts, graph);
  assert.ok(findings.some((f) => f.code === 'DANGLING-REF' && f.level === 'error'));
});

test('an evidence-backed requirement with no EVID is an error', () => {
  const artifacts = [
    {
      id: 'REQ-001',
      type: 'REQ',
      title: '',
      fields: { description: 'x', source: 'NEED-001', priority: 'HIGH', 'acceptance criteria': 'y', status: 'APPROVED', confidence: 'EVIDENCE-BACKED' },
    },
    { id: 'NEED-001', type: 'NEED', title: '', fields: {} },
  ];
  const graph = buildGraph(artifacts);
  const findings = auditTraceability(artifacts, graph);
  assert.ok(findings.some((f) => f.code === 'CLAIM-WITHOUT-EVIDENCE' && f.artifact.id === 'REQ-001'));
});

test('expired evidence is an error, future evidence is not', () => {
  const base = { id: 'EVID-001', type: 'EVID', title: '', fields: { claim: 'c', source: 's', 'source type': 't', 'access date': '2026-01-01', 'evidence summary': 'x', reliability: 'high', confidence: 'HIGH', 'revalidation date': '2026-06-01' } };
  const graph = buildGraph([base]);
  const expired = auditTraceability([base], graph, { now: new Date('2026-10-01').getTime() });
  assert.ok(expired.some((f) => f.code === 'EVIDENCE-EXPIRED'));
  const fresh = auditTraceability([base], graph, { now: new Date('2026-03-01').getTime() });
  assert.ok(!fresh.some((f) => f.code === 'EVIDENCE-EXPIRED'));
});

test('orphan requirement is a warning', () => {
  const artifacts = [
    { id: 'NEED-001', type: 'NEED', title: '', fields: {} },
    { id: 'REQ-001', type: 'REQ', title: '', fields: { description: 'x', source: 'NEED-001', priority: 'HIGH', 'acceptance criteria': 'y', status: 'APPROVED' } },
  ];
  const findings = auditTraceability(artifacts, buildGraph(artifacts));
  assert.ok(findings.some((f) => f.code === 'ORPHAN-REQUIREMENT' && f.level === 'warning'));
});

test('an approved CHG without an APR is rejected', () => {
  const root = tempWorkspace();
  write(
    root,
    'changes/CHG-001.md',
    ['### CHG-001 Widen scope', '- Request: add export', '- Reason: customer asked', '- Impact: REQ-001', '- Affected artifacts: REQ-001', '- Status: APPROVED'].join('\n'),
  );
  const result = validateWorkspace(root);
  assert.ok(result.findings.some((f) => f.code === 'PROTECTED-WITHOUT-APPROVAL'));
});

test('an approved CHG with an APR passes', () => {
  const root = tempWorkspace();
  write(
    root,
    'changes/CHG-001.md',
    ['### CHG-001 Widen scope', '- Request: add export', '- Reason: customer asked', '- Impact: REQ-001', '- Affected artifacts: APR-001', '- Status: APPROVED'].join('\n'),
  );
  write(root, 'changes/APR-001.md', ['### APR-001 Scope approval', '- Decision class: scope expansion', '- Approver: founder', '- Date: 2026-10-01', '- Status: APPROVED'].join('\n'));
  const result = validateWorkspace(root);
  assert.ok(!result.findings.some((f) => f.code === 'PROTECTED-WITHOUT-APPROVAL'));
});

test('missing required field and invalid status are reported', () => {
  const root = tempWorkspace();
  write(root, 'requirements.md', ['### REQ-001 Login', '- Description: x', '- Status: DONE-DONE'].join('\n'));
  const result = validateWorkspace(root);
  assert.ok(result.findings.some((f) => f.code === 'INVALID-STATUS'));
  assert.ok(result.findings.some((f) => f.code === 'MISSING-FIELD'));
});

test('unknown artifact prefix is an error', () => {
  const root = tempWorkspace();
  write(root, 'requirements.md', ['### ZZZ-001 Mystery', '- Status: DRAFT'].join('\n'));
  const result = validateWorkspace(root);
  assert.ok(result.findings.some((f) => f.code === 'UNKNOWN-TYPE'));
});

test('duplicate IDs across files are reported', () => {
  const root = tempWorkspace();
  write(root, 'requirements.md', ['### REQ-001 A', '- Description: x', '- Source: NEED-001', '- Priority: HIGH', '- Acceptance criteria: y', '- Status: APPROVED'].join('\n'));
  write(root, 'tasks/TASK-001.md', ['### REQ-001 B', '- Objective: z', '- Linked requirements: REQ-001', '- Expected output: q', '- Acceptance criteria: r', '- Status: DRAFT'].join('\n'));
  const result = validateWorkspace(root);
  assert.ok(result.findings.some((f) => f.code === 'DUPLICATE-ID'));
});

test('gate fails on an empty workspace and passes on a complete one', () => {
  const empty = validateWorkspace(tempWorkspace());
  assert.strictEqual(empty.summary.baselineReady, false);

  const result = validateWorkspace(completeWorkspace());
  const failing = result.gate.filter((g) => g.status === 'fail').map((g) => `${g.id}: ${g.detail}`);
  assert.deepStrictEqual(failing, [], `gate should pass, failing: ${failing.join('; ')}`);
  assert.strictEqual(result.summary.baselineReady, true);
});

test('gate blocks baseline approval when traceability breaks', () => {
  const artifacts = [
    { id: 'REQ-001', type: 'REQ', title: '', fields: { source: 'NEED-404' } },
  ];
  const findings = auditTraceability(artifacts, buildGraph(artifacts));
  const gate = auditGate(artifacts, buildGraph(artifacts), findings);
  const trace = gate.find((g) => g.id === 'TRACEABILITY');
  assert.strictEqual(trace.status, 'fail');
});

test('scaffold writes only the artifacts the profile requires', () => {
  const lean = tempWorkspace();
  scaffold(lean, 'LEAN');
  assert.ok(fs.existsSync(path.join(lean, 'requirements.md')));
  assert.ok(!fs.existsSync(path.join(lean, 'architecture.md')), 'LEAN must not get architecture ceremony');

  const critical = tempWorkspace();
  scaffold(critical, 'CRITICAL');
  assert.ok(fs.existsSync(path.join(critical, 'architecture.md')));
  assert.ok(fs.existsSync(path.join(critical, 'manifest.json')));
});

test('scaffolded workspace is parseable and reports no structural errors', () => {
  const root = tempWorkspace();
  scaffold(root, 'STANDARD');
  const result = validateWorkspace(root);
  const structural = result.findings.filter((f) => ['UNKNOWN-TYPE', 'DUPLICATE-ID', 'DANGLING-REF'].includes(f.code));
  assert.deepStrictEqual(structural, []);
});

test('scaffold rejects an unknown complexity', () => {
  assert.throws(() => scaffold(tempWorkspace(), 'HUGE'), /complexity must be one of/);
});

test('EVID without a status is valid, REQ without a status is not', () => {
  const root = tempWorkspace();
  write(
    root,
    'evidence.md',
    ['### EVID-001 Interview', '- Claim: c', '- Source: s', '- Source type: interview', '- Access date: 2026-09-01', '- Evidence summary: x', '- Reliability: medium', '- Confidence: MEDIUM'].join('\n'),
  );
  write(root, 'requirements.md', ['### REQ-001 Login', '- Description: x', '- Source: EVID-001', '- Priority: HIGH', '- Acceptance criteria: y'].join('\n'));
  const result = validateWorkspace(root);
  assert.ok(!result.findings.some((f) => f.code === 'MISSING-STATUS' && f.artifact.id === 'EVID-001'));
  assert.ok(result.findings.some((f) => f.code === 'MISSING-STATUS' && f.artifact.id === 'REQ-001'));
});

test('upstream link checks skip families that do not exist in the workspace', () => {
  const root = tempWorkspace();
  write(root, 'discovery.md', ['### NEED-001 Onboarding', '- Customer statement: c', '- User/actor: ops', '- Desired outcome: faster', '- Evidence: EVID-001', '- Confidence: MEDIUM'].join('\n'));
  write(
    root,
    'evidence.md',
    ['### EVID-001 Interview', '- Claim: c', '- Source: s', '- Source type: interview', '- Access date: 2026-09-01', '- Evidence summary: x', '- Reliability: medium', '- Confidence: MEDIUM'].join('\n'),
  );
  write(root, 'requirements.md', ['### REQ-001 Login', '- Description: x', '- Source: NEED-001', '- Priority: HIGH', '- Acceptance criteria: y', '- Status: APPROVED'].join('\n'));
  write(root, 'specifications.md', ['### SPEC-001 Login flow', '- Linked requirements: REQ-001', '- Trigger: submit', '- Normal behavior: session', '- Acceptance examples: valid then session', '- Status: APPROVED'].join('\n'));

  const result = validateWorkspace(root);
  // No NFR exists, so SPEC must not be flagged for a missing NFR link.
  const specWarnings = result.findings.filter((f) => f.code === 'MISSING-UPSTREAM-LINK' && f.artifact.id === 'SPEC-001');
  assert.deepStrictEqual(specWarnings, []);
});

test('SPEC accepts linked evidence instead of linked requirements', () => {
  const root = tempWorkspace();
  write(
    root,
    'specifications.md',
    ['### SPEC-001 Probe', '- Linked evidence: EVID-001', '- Trigger: t', '- Normal behavior: n', '- Acceptance examples: e', '- Status: DRAFT'].join('\n'),
  );
  write(
    root,
    'evidence.md',
    ['### EVID-001 Probe', '- Claim: c', '- Source: s', '- Source type: s', '- Access date: 2026-09-01', '- Evidence summary: x', '- Reliability: medium', '- Confidence: MEDIUM'].join('\n'),
  );
  const result = validateWorkspace(root);
  assert.ok(!result.findings.some((f) => f.code === 'MISSING-FIELD' && f.artifact.id === 'SPEC-001'));
});

test('strict mode treats warnings as failures', () => {
  const { main } = require('../bin/engineering-validate');
  const root = tempWorkspace();
  write(root, 'discovery.md', ['### NEED-001 x', '- Customer statement: c', '- User/actor: a', '- Desired outcome: d', '- Evidence: e', '- Confidence: LOW'].join('\n'));
  write(root, 'requirements.md', ['### REQ-001 x', '- Description: d', '- Source: NEED-001', '- Priority: HIGH', '- Acceptance criteria: a', '- Status: APPROVED'].join('\n'));
  // REQ-001 is an orphan requirement -> warning only.
  assert.strictEqual(main([root, '--json']), 0);
  assert.strictEqual(main([root, '--strict']), 1);
});

test('json report is machine readable and gate-only prints the checklist', () => {
  const { main } = require('../bin/engineering-validate');
  const root = completeWorkspace();
  assert.strictEqual(main([root, '--gate-only']), 0);
  const parsed = JSON.parse(require('../lib/validate').toJson(validateWorkspace(root), root));
  assert.ok(Array.isArray(parsed.gate));
  assert.ok(parsed.summary && typeof parsed.summary.errors === 'number');
  assert.strictEqual(parsed.summary.errors, 0);
});

test('cli rejects unknown options with exit code 2', () => {
  const { main } = require('../bin/engineering-validate');
  assert.strictEqual(main(['--nope']), 2);
});

test('cli prints usage for --help', () => {
  const { main } = require('../bin/engineering-validate');
  assert.strictEqual(main(['--help']), 0);
});

test('the golden fixture is completely clean, even in strict mode', () => {
  const { main } = require('../bin/engineering-validate');
  const fixture = path.join(__dirname, 'fixtures', 'complete-workspace');
  const result = validateWorkspace(fixture);
  assert.deepStrictEqual(result.findings, []);
  assert.strictEqual(result.summary.baselineReady, true);
  assert.strictEqual(main([fixture, '--strict']), 0);
});

test('a requirement may trace through evidence instead of a need', () => {
  const root = tempWorkspace();
  write(
    root,
    'evidence.md',
    ['### EVID-001 Interview', '- Claim: c', '- Source: s', '- Source type: interview', '- Access date: 2026-09-01', '- Evidence summary: x', '- Reliability: medium', '- Confidence: MEDIUM'].join('\n'),
  );
  write(root, 'requirements.md', ['### REQ-001 Login', '- Description: x', '- Source: EVID-001', '- Priority: HIGH', '- Acceptance criteria: y', '- Status: APPROVED'].join('\n'));
  const result = validateWorkspace(root);
  assert.ok(!result.findings.some((f) => f.code === 'MISSING-UPSTREAM-LINK' && f.artifact.id === 'REQ-001'));
});

test('a requirement with no provenance at all is flagged', () => {
  const root = tempWorkspace();
  write(root, 'discovery.md', ['### NEED-001 x', '- Customer statement: c', '- User/actor: a', '- Desired outcome: d', '- Evidence: e', '- Confidence: LOW'].join('\n'));
  write(root, 'requirements.md', ['### REQ-001 Login', '- Description: x', '- Priority: HIGH', '- Acceptance criteria: y', '- Status: APPROVED'].join('\n'));
  const result = validateWorkspace(root);
  assert.ok(result.findings.some((f) => f.code === 'MISSING-UPSTREAM-LINK' && f.artifact.id === 'REQ-001'));
});

test('an invariant is valid without a status and requires its enforcement fields', () => {
  const root = tempWorkspace();
  write(root, 'discovery.md', ['### NEED-001 x', '- Customer statement: c', '- User/actor: a', '- Desired outcome: d', '- Evidence: e', '- Confidence: LOW'].join('\n'));
  write(
    root,
    'invariants.md',
    [
      '### INV-001 One account per email',
      '- Linked requirements: REQ-001',
      '- Statement: at most one account per email',
      '- Scope: accounts',
      '- Rationale: email is the login identifier',
      '- Violation: login becomes ambiguous',
      '- Enforcement: unique index on lower(email)',
      '- Verified by: SPEC-001',
    ].join('\n'),
  );
  const result = validateWorkspace(root);
  assert.ok(!result.findings.some((f) => f.code === 'MISSING-FIELD' && f.artifact.id === 'INV-001'));
  assert.ok(!result.findings.some((f) => f.code === 'MISSING-STATUS' && f.artifact.id === 'INV-001'));
});

test('an invariant missing its enforcement mechanism is flagged', () => {
  const root = tempWorkspace();
  write(root, 'discovery.md', ['### NEED-001 x', '- Customer statement: c', '- User/actor: a', '- Desired outcome: d', '- Evidence: e', '- Confidence: LOW'].join('\n'));
  write(root, 'invariants.md', ['### INV-001 One account per email', '- Statement: at most one account per email', '- Scope: accounts'].join('\n'));
  const result = validateWorkspace(root);
  const missing = result.findings.filter((f) => f.code === 'MISSING-FIELD' && f.artifact.id === 'INV-001');
  assert.ok(missing.length > 0);
  assert.ok(missing.some((f) => /enforcement/i.test(f.message)));
});

test('a contract with its error model and idempotency rule is clean', () => {
  const root = tempWorkspace();
  write(root, 'discovery.md', ['### NEED-001 x', '- Customer statement: c', '- User/actor: a', '- Desired outcome: d', '- Evidence: e', '- Confidence: LOW'].join('\n'));
  write(root, 'requirements.md', ['### REQ-001 x', '- Description: d', '- Source: NEED-001', '- Priority: HIGH', '- Acceptance criteria: a', '- Status: APPROVED'].join('\n'));
  write(
    root,
    'specifications.md',
    ['### SPEC-001 Signup', '- Linked requirements: REQ-001', '- Trigger: submit', '- Normal behavior: account created', '- Acceptance examples: given/when/then', '- Status: APPROVED'].join('\n'),
  );
  write(
    root,
    'contracts.md',
    [
      '### CTR-001 Accounts API',
      '- Linked specifications: SPEC-001',
      '- Boundary: HTTP /accounts',
      '- Operations: POST /accounts',
      '- Error model: 409 duplicate, 422 validation',
      '- Idempotency rule: client-supplied key required',
      '- Version: v1',
    ].join('\n'),
  );
  const result = validateWorkspace(root);
  assert.ok(!result.findings.some((f) => f.code === 'MISSING-FIELD' && f.artifact.id === 'CTR-001'));
});

test('a contract with no idempotency rule is flagged', () => {
  const root = tempWorkspace();
  write(root, 'discovery.md', ['### NEED-001 x', '- Customer statement: c', '- User/actor: a', '- Desired outcome: d', '- Evidence: e', '- Confidence: LOW'].join('\n'));
  write(root, 'requirements.md', ['### REQ-001 x', '- Description: d', '- Source: NEED-001', '- Priority: HIGH', '- Acceptance criteria: a', '- Status: APPROVED'].join('\n'));
  write(root, 'contracts.md', ['### CTR-001 Accounts API', '- Boundary: HTTP /accounts', '- Operations: POST /accounts'].join('\n'));
  const result = validateWorkspace(root);
  const missing = result.findings.filter((f) => f.code === 'MISSING-FIELD' && f.artifact.id === 'CTR-001');
  assert.ok(missing.some((f) => /idempotency/i.test(f.message)));
});

'use strict';

const { ARTIFACT_TYPES, STATUSES, STATUS_OPTIONAL, REQUIRED_FIELDS, REQUIRED_UPSTREAM, FIELD_ALTERNATIVES, statusOf, hasField, fieldRefs } = require('./registry');
const { buildGraph, auditTraceability, auditGate } = require('./graph');
const { loadWorkspace, loadManifest, loadGoDecision } = require('./workspace');

const LEVEL_ORDER = { error: 0, warning: 1, info: 2 };

function validateArtifact(artifact) {
  const findings = [];
  const type = artifact.type;

  if (!ARTIFACT_TYPES[type]) {
    findings.push({
      level: 'error',
      code: 'UNKNOWN-TYPE',
      message: `${artifact.id} uses prefix "${type}", which is not in the ID standard`,
      artifact,
    });
    return findings;
  }

  const status = statusOf(artifact);
  if (status === null) {
    if (!STATUS_OPTIONAL.includes(type)) {
      findings.push({ level: 'error', code: 'MISSING-STATUS', message: `${artifact.id} has no status`, artifact });
    }
  } else if (!STATUSES.includes(status)) {
    findings.push({
      level: 'error',
      code: 'INVALID-STATUS',
      message: `${artifact.id} has status "${status}"; allowed: ${STATUSES.join(', ')}`,
      artifact,
    });
  }

  const alternatives = FIELD_ALTERNATIVES[type] || {};
  for (const field of REQUIRED_FIELDS[type] || []) {
    const accepted = alternatives[field] || [field];
    if (!accepted.some((key) => hasField(artifact, key))) {
      findings.push({
        level: 'error',
        code: 'MISSING-FIELD',
        message: `${artifact.id} is missing required field "${accepted.join('" or "')}"`,
        artifact,
      });
    }
  }

  // Approval is mandatory for the protected decision classes in
  // 30-governance/35-CHANGE-DEVIATION-APPROVAL.md.
  if ((type === 'CHG' || type === 'DEV') && status === 'APPROVED') {
    const approvals = fieldRefs(artifact).filter((id) => id.startsWith('APR-'));
    if (approvals.length === 0) {
      findings.push({
        level: 'error',
        code: 'PROTECTED-WITHOUT-APPROVAL',
        message: `${artifact.id} is APPROVED but references no APR-### approval`,
        artifact,
      });
    }
  }

  return findings;
}

function validateUpstream(artifact, graph) {
  const required = REQUIRED_UPSTREAM[artifact.type];
  if (!required) return [];
  if (statusOf(artifact) === 'SUPERSEDED' || statusOf(artifact) === 'REJECTED') return [];

  const familiesInWorkspace = new Set(Array.from(graph.byId.values(), (a) => a.type));
  const referenced = fieldRefs(artifact).concat(graph.upstream.get(artifact.id) || []);
  const present = new Set(referenced.map((id) => graph.byId.get(id)?.type || id.replace(/-\d+$/, '')));

  const missing = required
    .filter((group) => group.some((family) => familiesInWorkspace.has(family)))
    .filter((group) => !group.some((family) => present.has(family)));

  if (missing.length === 0) return [];
  return [
    {
      level: 'warning',
      code: 'MISSING-UPSTREAM-LINK',
      message: `${artifact.id} has no link to ${missing.map((group) => group.join(' or ')).join(' / ')}`,
      artifact,
    },
  ];
}

function validateManifest(manifest) {
  const findings = [];
  if (!manifest) return findings;
  const allowedComplexity = ['LEAN', 'STANDARD', 'EXTENDED', 'CRITICAL'];
  if (manifest.complexity && !allowedComplexity.includes(manifest.complexity)) {
    findings.push({
      level: 'error',
      code: 'INVALID-MANIFEST',
      message: `manifest.json complexity "${manifest.complexity}" is not one of ${allowedComplexity.join(', ')}`,
      artifact: null,
    });
  }
  const allowedTypes = ['WEB_SAAS', 'MOBILE', 'DESKTOP', 'API_SERVICE', 'DATA_PIPELINE', 'AI_LLM_APP', 'INTERNAL_TOOL', 'INTEGRATION', 'LIBRARY_SDK', 'INFRA_PLATFORM', 'OTHER'];
  if (manifest.projectType && !allowedTypes.includes(manifest.projectType)) {
    findings.push({
      level: 'warning',
      code: 'INVALID-MANIFEST',
      message: `manifest.json projectType "${manifest.projectType}" is not a known profile; use OTHER if intentional`,
      artifact: null,
    });
  }
  return findings;
}

/**
 * Validate a project workspace.
 * @returns {{findings: Array, gate: Array, summary: object, artifacts: Array}}
 */
function validateWorkspace(root, options = {}) {
  const { files, artifacts } = loadWorkspace(root);
  const manifest = loadManifest(root);
  const graph = buildGraph(artifacts);

  let findings = [];
  for (const artifact of artifacts) findings = findings.concat(validateArtifact(artifact));
  for (const artifact of artifacts) findings = findings.concat(validateUpstream(artifact, graph));
  findings = findings.concat(validateManifest(manifest));
  findings = findings.concat(auditTraceability(artifacts, graph, options));

  const gate = auditGate(artifacts, graph, findings, { ...options, goDecision: loadGoDecision(root) });

  findings.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);

  const summary = {
    files: files.length,
    artifacts: artifacts.length,
    errors: findings.filter((f) => f.level === 'error').length,
    warnings: findings.filter((f) => f.level === 'warning').length,
    gatePassed: gate.filter((g) => g.status === 'pass').length,
    gateTotal: gate.length,
    baselineReady: gate.every((g) => g.status === 'pass') && findings.every((f) => f.level !== 'error'),
  };

  return { findings, gate, summary, artifacts, graph, manifest };
}

function formatReport(result, { root, color = false } = {}) {
  const paint = (code, text) => (color ? `\u001b[${code}m${text}\u001b[0m` : text);
  const lines = [];
  lines.push(`Engineering System validation — ${root}`);
  lines.push(`Scanned ${result.summary.files} registry file(s), found ${result.summary.artifacts} artifact(s).`);
  lines.push('');

  if (result.findings.length === 0) {
    lines.push(paint(32, 'No findings.'));
  } else {
    for (const finding of result.findings) {
      const tag = finding.level === 'error' ? paint(31, 'ERROR  ') : paint(33, 'WARNING');
      const where = finding.artifact ? `${finding.artifact.file || '?'}:${finding.artifact.line || '?'} ` : '';
      lines.push(`${tag} ${finding.code} — ${where}${finding.message}`);
    }
  }

  lines.push('');
  lines.push('Baseline gate (90-templates/FINAL-PLAN-AUDIT.md)');
  for (const item of result.gate) {
    const mark = item.status === 'pass' ? paint(32, 'PASS') : paint(31, 'FAIL');
    lines.push(`  ${mark} ${item.id} — ${item.description}${item.detail ? ` (${item.detail})` : ''}`);
  }

  lines.push('');
  lines.push(
    `${result.summary.errors} error(s), ${result.summary.warnings} warning(s), ` +
      `gate ${result.summary.gatePassed}/${result.summary.gateTotal}. ` +
      (result.summary.baselineReady ? 'Baseline gate satisfied.' : 'Baseline gate NOT satisfied.'),
  );
  return lines.join('\n');
}

function toJson(result, root) {
  return JSON.stringify(
    {
      root,
      summary: result.summary,
      findings: result.findings.map((f) => ({
        level: f.level,
        code: f.code,
        message: f.message,
        id: f.artifact ? f.artifact.id : null,
        file: f.artifact ? f.artifact.file : null,
        line: f.artifact ? f.artifact.line : null,
      })),
      gate: result.gate,
    },
    null,
    2,
  );
}

module.exports = { validateArtifact, validateUpstream, validateManifest, validateWorkspace, formatReport, toJson, LEVEL_ORDER };

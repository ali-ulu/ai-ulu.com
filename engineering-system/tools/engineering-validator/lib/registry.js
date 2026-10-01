'use strict';

/**
 * Artifact registry model shared by the validator and the workspace scaffold.
 *
 * The Engineering System writes registries as plain Markdown so a human can
 * read them. The validator reads the same files back by parsing `### <ID>` or
 * `## <ID>` headings followed by `- key: value` bullets.
 */

const ARTIFACT_TYPES = {
  NEED: 'customer need',
  EVID: 'evidence',
  REQ: 'functional requirement',
  NFR: 'non-functional requirement',
  SPEC: 'behavior specification',
  FLOW: 'flow',
  ADR: 'architecture decision',
  ASM: 'assumption',
  RISK: 'risk',
  TD: 'technical debt',
  CMP: 'component/module',
  TASK: 'task',
  EXE: 'execution contract',
  CHG: 'change request',
  DEV: 'deviation',
  APR: 'approval',
  BASE: 'baseline',
  REC: 'recovery event',
  REV: 'verification/review',
  LEARN: 'learning candidate',
};

const STATUSES = [
  'DRAFT',
  'REVIEW-REQUIRED',
  'APPROVED',
  'BLOCKED',
  'SUPERSEDED',
  'REJECTED',
  'DONE',
];

/**
 * Types whose source document does not define a status field. For these,
 * status is accepted when present but never required.
 */
const STATUS_OPTIONAL = ['NEED', 'EVID', 'CMP', 'LEARN'];

/**
 * Required bullet keys per artifact type, derived from the field lists in the
 * numbered system documents. Keys are matched case-insensitively with spaces
 * folded to single spaces, so "Acceptance criteria" and "acceptance  criteria"
 * are the same key.
 */
const REQUIRED_FIELDS = {
  NEED: ['customer statement', 'user/actor', 'desired outcome', 'evidence', 'confidence'],
  EVID: ['claim', 'source', 'source type', 'access date', 'evidence summary', 'reliability', 'confidence'],
  REQ: ['description', 'source', 'priority', 'acceptance criteria', 'status'],
  NFR: ['description', 'category', 'criterion', 'status'],
  SPEC: ['linked requirements', 'trigger', 'normal behavior', 'acceptance examples', 'status'],
  FLOW: ['linked requirements', 'failure path', 'status'],
  ADR: ['status', 'context', 'decision', 'why', 'consequences'],
  ASM: ['assumption', 'confidence', 'impact if false', 'validation', 'status'],
  RISK: ['risk', 'probability', 'impact', 'mitigation', 'status'],
  TD: ['decision', 'reason', 'impact', 'resolution trigger', 'status'],
  CMP: ['responsibility', 'interfaces', 'status'],
  TASK: ['objective', 'linked requirements', 'expected output', 'acceptance criteria', 'status'],
  EXE: ['task', 'can', 'cannot', 'must', 'status'],
  CHG: ['request', 'reason', 'impact', 'affected artifacts', 'status'],
  DEV: ['reason', 'discovered constraint', 'impact', 'proposed resolution', 'status'],
  APR: ['decision class', 'approver', 'date', 'status'],
  BASE: ['created', 'contents', 'approvals', 'status'],
  REC: ['trigger', 'blast radius', 'recovery step', 'verification', 'status'],
  REV: ['scope', 'commit', 'criteria', 'result', 'status'],
  LEARN: ['observation', 'evidence', 'project context', 'confidence', 'candidate lesson'],
};

/**
 * Upstream reference families each artifact type must carry to satisfy
 * traceability. Each entry is a group of alternatives: at least one ID from
 * each group must be present. Groups whose families do not exist anywhere in
 * the workspace are skipped, so a project without NFRs is not penalised.
 */
const REQUIRED_UPSTREAM = {
  REQ: [['NEED', 'EVID']],
  NFR: [['NEED', 'EVID']],
  SPEC: [['REQ', 'NFR']],
  FLOW: [['REQ'], ['SPEC']],
  ADR: [['REQ', 'NFR'], ['EVID']],
  TASK: [['REQ', 'NFR'], ['SPEC', 'EVID']],
  EXE: [['TASK']],
  CHG: [['REQ', 'SPEC', 'ADR']],
  DEV: [['TASK', 'EXE']],
  REV: [['TASK', 'EXE', 'REQ']],
  BASE: [['REQ', 'NFR', 'SPEC']],
};

/** Required fields satisfied by any one of several accepted key names. */
const FIELD_ALTERNATIVES = {
  SPEC: { 'linked requirements': ['linked requirements', 'linked evidence'] },
};

/** Field names whose values are scanned to build traceability edges. */
const REFERENCE_FIELDS = [
  'source',
  'evidence',
  'linked requirements',
  'linked evidence',
  'affected artifacts',
  'affected',
  'blocked by',
  'unblocks',
  'dependencies',
  'supersedes',
  'superseded by',
  'task',
  'scope',
  'contents',
  'approvals',
  'links',
  'alternatives',
  'impact',
  'validation',
  'mitigation',
];

const ID_PATTERN = /\b([A-Z]{2,6})-(\d{3,})\b/g;

function normalizeKey(key) {
  return String(key).trim().toLowerCase().replace(/[_\s]+/g, ' ');
}

function makeId(prefix, index) {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

/** Extract every ID token from a free-text value, in order, without duplicates. */
function extractIds(value) {
  if (value == null) return [];
  const text = Array.isArray(value) ? value.join(' ') : String(value);
  const found = [];
  let match;
  ID_PATTERN.lastIndex = 0;
  while ((match = ID_PATTERN.exec(text)) !== null) {
    const id = `${match[1]}-${match[2]}`;
    if (!found.includes(id)) found.push(id);
  }
  return found;
}

/**
 * Parse one registry document into artifacts.
 * Recognises `### REQ-001` / `## REQ-001` headings and `- key: value` bullets.
 */
function parseRegistry(markdown, { file } = {}) {
  const lines = String(markdown).split(/\r?\n/);
  const artifacts = [];
  let current = null;
  let pendingKey = null;

  const flush = () => {
    if (current) artifacts.push(current);
    current = null;
    pendingKey = null;
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.replace(/\s+$/, '');
    const heading = line.match(/^#{2,4}\s+([A-Z]{2,6}-\d{3,})\b\s*(.*)$/);
    if (heading) {
      flush();
      current = {
        id: heading[1],
        type: heading[1].replace(/-\d+$/, ''),
        title: heading[2].trim(),
        fields: {},
        line: index + 1,
        file: file || null,
      };
      return;
    }

    if (!current) return;

    const bullet = line.match(/^\s*[-*]\s+([^:]+):\s*(.*)$/);
    if (bullet) {
      pendingKey = normalizeKey(bullet[1]);
      current.fields[pendingKey] = bullet[2].trim();
      return;
    }

    const bare = line.match(/^\s*[-*]\s+(.*)$/);
    if (bare && pendingKey) {
      current.fields[pendingKey] = `${current.fields[pendingKey] || ''} ${bare[1].trim()}`.trim();
      return;
    }

    if (line.trim() && pendingKey && /^\s{2,}\S/.test(line)) {
      current.fields[pendingKey] = `${current.fields[pendingKey] || ''} ${line.trim()}`.trim();
    }
  });

  flush();
  return artifacts;
}

function fieldText(artifact, key) {
  const value = artifact.fields[normalizeKey(key)];
  return value == null ? '' : String(value);
}

function hasField(artifact, key) {
  const value = artifact.fields[normalizeKey(key)];
  if (value == null) return false;
  const trimmed = String(value).trim();
  return trimmed !== '' && trimmed.toUpperCase() !== 'TBD';
}

/** IDs referenced through recognised reference fields. */
function fieldRefs(artifact) {
  const refs = [];
  for (const [key, value] of Object.entries(artifact.fields)) {
    if (!REFERENCE_FIELDS.includes(key)) continue;
    for (const id of extractIds(value)) {
      if (id !== artifact.id && !refs.includes(id)) refs.push(id);
    }
  }
  return refs;
}

/** Every ID mentioned anywhere in the artifact except its own status field. */
function allRefs(artifact) {
  const refs = [];
  for (const [key, value] of Object.entries(artifact.fields)) {
    if (key === 'status') continue;
    for (const id of extractIds(value)) {
      if (id !== artifact.id && !refs.includes(id)) refs.push(id);
    }
  }
  return refs;
}

function statusOf(artifact) {
  const raw = fieldText(artifact, 'status').trim().toUpperCase();
  return raw === '' ? null : raw;
}

module.exports = {
  ARTIFACT_TYPES,
  STATUSES,
  STATUS_OPTIONAL,
  REQUIRED_FIELDS,
  REQUIRED_UPSTREAM,
  FIELD_ALTERNATIVES,
  REFERENCE_FIELDS,
  ID_PATTERN,
  normalizeKey,
  makeId,
  extractIds,
  parseRegistry,
  fieldText,
  hasField,
  fieldRefs,
  allRefs,
  statusOf,
};

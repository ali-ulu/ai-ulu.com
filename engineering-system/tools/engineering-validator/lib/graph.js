'use strict';

const { ARTIFACT_TYPES, extractIds, fieldRefs, allRefs, statusOf, hasField, fieldText } = require('./registry');

/**
 * Layer order used to decide whether an edge points upstream (towards the
 * reason for the work) or downstream (towards the delivery of the work).
 * Side nodes carry governance rather than flow and sit outside the ordering.
 */
const LAYERS = ['NEED', 'EVID', 'REQ', 'NFR', 'INV', 'SPEC', 'CTR', 'FLOW', 'ADR', 'CMP', 'TASK', 'EXE', 'REV'];
const SIDE_TYPES = ['ASM', 'RISK', 'TD', 'CHG', 'DEV', 'APR', 'REC', 'BASE', 'LEARN'];

function layerIndex(type) {
  const index = LAYERS.indexOf(type);
  return index === -1 ? null : index;
}

/** Build the bidirectional traceability graph from a set of artifacts. */
function buildGraph(artifacts) {
  const byId = new Map();
  const duplicates = [];
  for (const artifact of artifacts) {
    if (byId.has(artifact.id)) {
      duplicates.push({ id: artifact.id, first: byId.get(artifact.id), second: artifact });
      continue;
    }
    byId.set(artifact.id, artifact);
  }

  const edges = [];
  const upstream = new Map();
  const downstream = new Map();
  const dangling = [];

  for (const artifact of artifacts) {
    const fromLayer = layerIndex(artifact.type);
    for (const targetId of allRefs(artifact)) {
      const target = byId.get(targetId);
      if (!target) {
        dangling.push({ from: artifact.id, to: targetId, artifact });
        continue;
      }
      const toLayer = layerIndex(target.type);
      let direction = 'side';
      if (fromLayer !== null && toLayer !== null) {
        if (toLayer < fromLayer) direction = 'upstream';
        else if (toLayer > fromLayer) direction = 'downstream';
      }
      edges.push({ from: artifact.id, to: targetId, direction, field: null });
      if (direction === 'upstream') {
        // artifact depends on target: target is upstream, artifact is downstream.
        if (!upstream.has(artifact.id)) upstream.set(artifact.id, []);
        upstream.get(artifact.id).push(targetId);
        if (!downstream.has(targetId)) downstream.set(targetId, []);
        downstream.get(targetId).push(artifact.id);
      } else if (direction === 'downstream') {
        if (!upstream.has(targetId)) upstream.set(targetId, []);
        upstream.get(targetId).push(artifact.id);
        if (!downstream.has(artifact.id)) downstream.set(artifact.id, []);
        downstream.get(artifact.id).push(targetId);
      }
    }
  }

  return { byId, edges, upstream, downstream, dangling, duplicates };
}

/** Downstream consumers that declare the artifact in a reference field. */
function consumersOf(graph, id) {
  return graph.edges.filter((edge) => edge.to === id).map((edge) => graph.byId.get(edge.from));
}

function findByType(artifacts, ...types) {
  return artifacts.filter((artifact) => types.includes(artifact.type));
}

function isLive(artifact) {
  const status = statusOf(artifact);
  return status !== 'SUPERSEDED' && status !== 'REJECTED';
}

/**
 * Bidirectional traceability integrity audit (30-governance/37-TRACEABILITY.md).
 * Returns findings without deciding severity thresholds.
 */
function auditTraceability(artifacts, graph, options = {}) {
  const findings = [];
  const add = (level, code, message, artifact) => findings.push({ level, code, message, artifact });

  for (const duplicate of graph.duplicates) {
    add(
      'error',
      'DUPLICATE-ID',
      `${duplicate.id} is defined twice (${duplicate.first.file || 'unknown'}:${duplicate.first.line} and ${duplicate.second.file || 'unknown'}:${duplicate.second.line})`,
      duplicate.second,
    );
  }

  for (const edge of graph.dangling) {
    add(
      'error',
      'DANGLING-REF',
      `${edge.from} references ${edge.to}, which is not defined in the workspace`,
      edge.artifact,
    );
  }

  for (const artifact of artifacts) {
    if (!isLive(artifact)) continue;
    const consumers = consumersOf(graph, artifact.id).filter(isLive);

    // Orphan requirement: nothing downstream implements or specifies it.
    if (artifact.type === 'REQ' || artifact.type === 'NFR') {
      const downstream = consumers.filter((c) => ['SPEC', 'FLOW', 'TASK', 'CMP'].includes(c.type));
      if (downstream.length === 0 && statusOf(artifact) !== 'REJECTED') {
        add('warning', 'ORPHAN-REQUIREMENT', `${artifact.id} has no specification, flow or task consuming it`, artifact);
      }
    }

    // Orphan specification: not linked to any requirement.
    if (artifact.type === 'SPEC') {
      const linked = consumers.filter((c) => c.type === 'REQ' || c.type === 'NFR');
      const declared = graph.upstream.get(artifact.id) || [];
      const declaresReq = declared.some((id) => ['REQ', 'NFR'].includes(graph.byId.get(id)?.type));
      if (linked.length === 0 && !declaresReq) {
        add('error', 'ORPHAN-SPEC', `${artifact.id} links to no requirement`, artifact);
      }
    }

    // Orphan task: no execution contract governs it.
    if (artifact.type === 'TASK') {
      const contracts = consumers.filter((c) => c.type === 'EXE');
      if (contracts.length === 0 && statusOf(artifact) === 'APPROVED') {
        add('warning', 'ORPHAN-TASK', `${artifact.id} is approved but has no execution contract`, artifact);
      }
    }

    // Superseded decision still referenced by live work.
    if (artifact.type === 'ADR' && statusOf(artifact) === 'SUPERSEDED') {
      const live = consumersOf(graph, artifact.id).filter((c) => isLive(c) && statusOf(c) !== 'SUPERSEDED');
      if (live.length > 0) {
        add(
          'warning',
          'SUPERSEDED-DECISION-REFERENCED',
          `${artifact.id} is superseded but still referenced by ${live.map((c) => c.id).join(', ')}`,
          artifact,
        );
      }
    }

    // Evidence that is claimed but not usable.
    if (artifact.type === 'EVID') {
      const status = statusOf(artifact);
      const expiry = fieldText(artifact, 'revalidation date') || fieldText(artifact, 'expiry');
      const expired = expiry && /^\d{4}-\d{2}-\d{2}$/.test(expiry.trim()) && new Date(expiry.trim()) < new Date(options.now || Date.now());
      if (expired) {
        add('error', 'EVIDENCE-EXPIRED', `${artifact.id} expired on ${expiry.trim()} and must be revalidated`, artifact);
      } else if (status === 'REJECTED' || status === 'SUPERSEDED') {
        const live = consumersOf(graph, artifact.id).filter(isLive);
        if (live.length > 0) {
          add(
            'error',
            'CLAIM-WITHOUT-EVIDENCE',
            `${artifact.id} is ${status} but still backs ${live.map((c) => c.id).join(', ')}`,
            artifact,
          );
        }
      }
    }

    // Requirement asserted as evidence-backed must point at real evidence.
    if (artifact.type === 'REQ' || artifact.type === 'NFR') {
      const confidence = fieldText(artifact, 'confidence').toUpperCase();
      const source = fieldText(artifact, 'source');
      const evidenceIds = extractIds(source).concat(extractIds(fieldText(artifact, 'evidence')));
      const evidenceBacked = /EVIDENCE-BACKED|CONFIRMED|CUSTOMER-CONFIRMED/.test(confidence) || /EVIDENCE-BACKED/.test(source.toUpperCase());
      const realEvidence = evidenceIds.some((id) => graph.byId.get(id)?.type === 'EVID');
      if (evidenceBacked && !realEvidence) {
        add(
          'error',
          'CLAIM-WITHOUT-EVIDENCE',
          `${artifact.id} claims ${confidence || 'EVIDENCE-BACKED'} confidence but references no EVID-### record`,
          artifact,
        );
      }
    }
  }

  return findings;
}

/**
 * Baseline gate checklist (90-templates/FINAL-PLAN-AUDIT.md).
 * Returns a list of { id, description, status, detail } items.
 */
function auditGate(artifacts, graph, findings, options = {}) {
  const goDecision = options.goDecision || null;
  const now = options.now || Date.now();
  const live = artifacts.filter(isLive);
  const byType = (type) => live.filter((a) => a.type === type);
  const items = [];
  const push = (id, description, ok, detail) => items.push({ id, description, status: ok ? 'pass' : 'fail', detail: detail || '' });

  const errors = findings.filter((f) => f.level === 'error');

  push('GO-DECISION', 'GO / feasibility decision exists', ['GO', 'CONDITIONAL-GO', 'POC-FIRST', 'NO-GO'].includes(goDecision), goDecision || 'no decision recorded');

  const reqs = byType('REQ');
  const reqsWithSource = reqs.filter((a) => extractIds(fieldText(a, 'source')).length > 0 || fieldText(a, 'source').trim() !== '');
  push('REQ-SOURCE', 'Every requirement has a source', reqs.length > 0 && reqsWithSource.length === reqs.length, `${reqsWithSource.length}/${reqs.length}`);

  const reqsWithCriteria = reqs.filter((a) => hasField(a, 'acceptance criteria'));
  push('REQ-AC', 'Every requirement has acceptance criteria', reqs.length > 0 && reqsWithCriteria.length === reqs.length, `${reqsWithCriteria.length}/${reqs.length}`);

  const nfrs = byType('NFR');
  const nfrsMeasurable = nfrs.filter((a) => hasField(a, 'criterion'));
  push('NFR-MEASURABLE', 'Every NFR is measurable or bounded', nfrs.length === 0 || nfrsMeasurable.length === nfrs.length, `${nfrsMeasurable.length}/${nfrs.length}`);

  const specs = byType('SPEC');
  push('SPEC-COVERAGE', 'Specifications exist for requirements', specs.length > 0 || reqs.length === 0, `${specs.length} spec(s)`);

  const tasks = byType('TASK');
  const tasksWithExe = tasks.filter((t) => consumersOf(graph, t.id).some((c) => c.type === 'EXE'));
  push('TASK-EXE', 'Every approved task has an execution contract', tasks.length === 0 || tasksWithExe.length === tasks.filter((t) => statusOf(t) === 'APPROVED').length, `${tasksWithExe.length}/${tasks.length}`);

  const unresolvedStops = live.filter((a) => statusOf(a) === 'BLOCKED');
  push('STOP-CONDITIONS', 'No unresolved stop condition', unresolvedStops.length === 0, unresolvedStops.map((a) => a.id).join(', ') || 'none');

  const protectedPending = live.filter((a) => (a.type === 'CHG' || a.type === 'DEV') && statusOf(a) === 'DRAFT');
  push('CHANGE-APPROVED', 'No pending change/deviation', protectedPending.length === 0, protectedPending.map((a) => a.id).join(', ') || 'none');

  const brokenTrace = errors.filter((f) => f.code === 'DANGLING-REF' || f.code === 'ORPHAN-SPEC' || f.code === 'DUPLICATE-ID');
  push('TRACEABILITY', 'Bidirectional traceability has no critical breaks', brokenTrace.length === 0, `${brokenTrace.length} critical finding(s)`);

  const hasBaseline = artifacts.some((a) => a.type === 'BASE' && statusOf(a) === 'APPROVED');
  push('BASELINE', 'Approved baseline exists', hasBaseline, hasBaseline ? 'approved' : 'missing');

  const highRisk = live.filter((a) => a.type === 'RISK' && /^(HIGH|CRITICAL)$/i.test(fieldText(a, 'impact')));
  const mitigated = highRisk.filter((a) => hasField(a, 'mitigation'));
  push('RISK-COVERAGE', 'High-impact risks have mitigation', highRisk.length === 0 || mitigated.length === highRisk.length, `${mitigated.length}/${highRisk.length}`);

  return items;
}

module.exports = { LAYERS, SIDE_TYPES, layerIndex, buildGraph, consumersOf, findByType, isLive, auditTraceability, auditGate };

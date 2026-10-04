'use strict';

const fs = require('fs');
const path = require('path');

const { parseRegistry } = require('./registry');

const REGISTRY_FILES = [
  'intake.md',
  'discovery.md',
  'evidence.md',
  'feasibility.md',
  'requirements.md',
  'nfr.md',
  'scope.md',
  'product-model.md',
  'flows.md',
  'invariants.md',
  'specifications.md',
  'contracts.md',
  'data-model.md',
  'architecture.md',
  'deployment.md',
  'security-quality.md',
  'decisions.md',
  'assumptions.md',
  'risks.md',
  'debt.md',
  'traceability.md',
  'baseline.md',
];

const REGISTRY_DIRS = ['changes', 'tasks', 'context-packs', 'execution-contracts', 'handoffs', 'verification', 'launch', 'components'];

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out.sort();
}

/** Load every registry document in a project workspace. */
function loadWorkspace(root) {
  const files = [];
  for (const name of REGISTRY_FILES) {
    const full = path.join(root, name);
    if (fs.existsSync(full)) files.push(full);
  }
  for (const dir of REGISTRY_DIRS) {
    files.push(...listMarkdown(path.join(root, dir)));
  }

  const artifacts = [];
  for (const file of files) {
    const markdown = fs.readFileSync(file, 'utf8');
    const parsed = parseRegistry(markdown, { file: path.relative(root, file) });
    artifacts.push(...parsed);
  }
  return { root, files, artifacts };
}

/** Read the optional machine-readable manifest. */
function loadManifest(root) {
  const full = path.join(root, 'manifest.json');
  if (!fs.existsSync(full)) return null;
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

/**
 * Read the GO gate decision from feasibility.md. The gate is a single record,
 * not a registry, so it is read as a document-level `- Decision: <value>`.
 */
function loadGoDecision(root) {
  const full = path.join(root, 'feasibility.md');
  if (!fs.existsSync(full)) return null;
  const match = fs.readFileSync(full, 'utf8').match(/^\s*[-*]\s*decision\s*:\s*(.+)$/im);
  return match ? match[1].trim().toUpperCase() : null;
}

module.exports = { REGISTRY_FILES, REGISTRY_DIRS, listMarkdown, loadWorkspace, loadManifest, loadGoDecision };

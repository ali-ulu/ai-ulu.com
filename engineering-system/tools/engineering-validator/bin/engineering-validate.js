#!/usr/bin/env node
'use strict';

const path = require('path');
const { validateWorkspace, formatReport, toJson } = require('../lib/validate');

function usage() {
  return [
    'Usage: engineering-validate [workspace] [options]',
    '',
    'Validates an AI-ULU Engineering System project workspace against',
    'the Engineering Constitution, the ID & status standard and the',
    'bidirectional traceability rules.',
    '',
    'Options:',
    '  --json            machine-readable report on stdout',
    '  --strict          exit non-zero on warnings as well as errors',
    '  --gate-only       print only the baseline gate checklist',
    '  --now=<iso>       treat this date as today (for expiry checks)',
    '  -h, --help        show this help',
    '',
    'Exit codes: 0 clean, 1 findings (or gate failure in --strict), 2 bad usage.',
  ].join('\n');
}

function parseArgs(argv) {
  const options = { json: false, strict: false, gateOnly: false, now: undefined, root: null };
  for (const arg of argv) {
    if (arg === '-h' || arg === '--help') return { help: true, options };
    else if (arg === '--json') options.json = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--gate-only') options.gateOnly = true;
    else if (arg.startsWith('--now=')) options.now = arg.slice('--now='.length);
    else if (arg.startsWith('-')) return { error: `unknown option ${arg}`, options };
    else if (options.root === null) options.root = arg;
    else return { error: 'only one workspace path may be given', options };
  }
  return { options };
}

function main(argv) {
  const parsed = parseArgs(argv);
  if (parsed.help) {
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  if (parsed.error) {
    process.stderr.write(`${parsed.error}\n\n${usage()}\n`);
    return 2;
  }

  const options = parsed.options;
  const root = path.resolve(options.root || process.cwd());
  const now = options.now ? new Date(options.now).getTime() : Date.now();

  let result;
  try {
    result = validateWorkspace(root, { now });
  } catch (error) {
    process.stderr.write(`Failed to read workspace ${root}: ${error.message}\n`);
    return 2;
  }

  if (options.json) {
    process.stdout.write(`${toJson(result, root)}\n`);
  } else if (options.gateOnly) {
    const lines = result.gate.map((item) => `${item.status === 'pass' ? 'PASS' : 'FAIL'} ${item.id} — ${item.description}`);
    process.stdout.write(`${lines.join('\n')}\n`);
  } else {
    process.stdout.write(`${formatReport(result, { root, color: process.stdout.isTTY })}\n`);
  }

  const { errors, warnings, baselineReady } = result.summary;
  if (options.strict) return errors === 0 && warnings === 0 && baselineReady ? 0 : 1;
  return errors === 0 ? 0 : 1;
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { main, parseArgs, usage };

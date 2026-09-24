import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

const rootIndex = process.argv.indexOf('--root');
if (rootIndex < 0 || !process.argv[rootIndex + 1]) {
  console.error('Usage: node rebalance-academy-answers.mjs --root <Senior-Software-Academy-v1> [--write]');
  process.exit(2);
}
const root = path.resolve(process.argv[rootIndex + 1]);
// These two packages use JSON-style quiz arrays. Frontend uses a separate seed format.
const ids = ['backend', 'devops'];
const digest = value => createHash('sha256').update(value).digest('hex');

function arrayEnd(source, start) {
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '[') depth++;
    else if (char === ']' && --depth === 0) return i + 1;
  }
  throw new Error('Unclosed quiz array');
}

function rotate(values, delta) {
  return values.map((_, index) => values[(index - delta + values.length) % values.length]);
}

function transform(source, id) {
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const pattern = /"quiz":\s*(\[)/g;
  const matches = [...source.matchAll(pattern)];
  if (matches.length !== 15) throw new Error(`${id}: expected 15 quiz arrays, found ${matches.length}`);
  let cursor = 0;
  let output = '';
  let questionIndex = 0;
  for (const match of matches) {
    const start = match.index + match[0].lastIndexOf('[');
    const end = arrayEnd(source, start);
    const questions = JSON.parse(source.slice(start, end));
    if (questions.length !== 3) throw new Error(`${id}: day quiz must have three questions`);
    for (const question of questions) {
      if (question.optionsTr?.length !== 4 || question.optionsEn?.length !== 4 || !Number.isInteger(question.a) || question.a < 0 || question.a > 3) {
        throw new Error(`${id}: invalid quiz at question ${questionIndex + 1}`);
      }
      const target = questionIndex % 4;
      const delta = (target - question.a + 4) % 4;
      const correctTr = question.optionsTr[question.a];
      const correctEn = question.optionsEn[question.a];
      question.optionsTr = rotate(question.optionsTr, delta);
      question.optionsEn = rotate(question.optionsEn, delta);
      question.a = target;
      if (question.optionsTr[target] !== correctTr || question.optionsEn[target] !== correctEn) throw new Error(`${id}: answer changed at question ${questionIndex + 1}`);
      questionIndex++;
    }
    const formatted = JSON.stringify(questions, null, 2).split('\n').map((line, index) => index ? '      ' + line : line).join(newline);
    output += source.slice(cursor, start) + formatted;
    cursor = end;
  }
  output += source.slice(cursor);
  if (questionIndex !== 45) throw new Error(`${id}: expected 45 questions, found ${questionIndex}`);
  return output;
}

const plans = [];
for (const id of ids) {
  const relative = path.join('courses', id, 'content.js');
  const targets = [path.join(root, id, relative), path.join(root, 'foundations', relative)];
  const originals = await Promise.all(targets.map(target => readFile(target, 'utf8')));
  if (digest(originals[0]) !== digest(originals[1])) throw new Error(`${id}: course copies differ before edit`);
  const updated = transform(originals[0], id);
  plans.push({ id, targets, original: originals[0], updated });
  console.log(`${id}: ${digest(originals[0]).slice(0, 12)} -> ${digest(updated).slice(0, 12)}; ${updated === originals[0] ? 'already balanced' : '45 answer positions balanced'}`);
}

if (process.argv.includes('--write')) {
  const backupDir = path.join(os.tmpdir(), `senior-academy-quiz-backup-${Date.now()}`);
  await mkdir(backupDir, { recursive: true });
  for (const plan of plans) {
    await writeFile(path.join(backupDir, `${plan.id}-original.js`), plan.original);
    for (const target of plan.targets) {
      const current = await readFile(target, 'utf8');
      if (digest(current) !== digest(plan.original)) throw new Error(`${plan.id}: source changed during edit; stop`);
      const temporary = `${target}.${process.pid}.tmp`;
      await writeFile(temporary, plan.updated);
      await rename(temporary, target);
    }
  }
  console.log(`Source copies updated. Original files backed up in ${backupDir}`);
} else {
  console.log('Dry run only. Pass --write to update both standalone and foundations copies.');
}

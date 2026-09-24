import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

const rootIndex = process.argv.indexOf('--root');
if (rootIndex < 0 || !process.argv[rootIndex + 1]) {
  console.error('Usage: node rebalance-frontend-answers.mjs --root <Senior-Software-Academy-v1> [--write]');
  process.exit(2);
}
const root = path.resolve(process.argv[rootIndex + 1]);
const relative = path.join('courses', 'frontend', 'content.js');
const targets = [path.join(root, 'frontend', relative), path.join(root, 'foundations', relative)];
const originals = await Promise.all(targets.map(target => readFile(target, 'utf8')));
const digest = value => createHash('sha256').update(value).digest('hex');
if (digest(originals[0]) !== digest(originals[1])) throw new Error('Frontend source copies differ before edit');

const oldLine = "    quiz:d.quiz.map((q,i)=>({id:`feq-${d.day}-${i+1}`,qTr:q[0],qEn:quizEnglish[d.day][i][0],optionsTr:q[1],optionsEn:quizEnglish[d.day][i][1],a:q[2],explainTr:q[3],explainEn:quizEnglish[d.day][i][2]}))";
const helper = `const rotateQuizOptions = (options, delta) => options.map((_, index) => options[(index - delta + options.length) % options.length]);
function assembleFrontendQuiz(day, question, index) {
  const english = quizEnglish[day.day][index];
  const answer = ((day.day - 1) * 3 + index) % 4;
  const delta = (answer - question[2] + 4) % 4;
  return {
    id: \`feq-\${day.day}-\${index + 1}\`,
    qTr: question[0], qEn: english[0],
    optionsTr: rotateQuizOptions(question[1], delta),
    optionsEn: rotateQuizOptions(english[1], delta),
    a: answer, explainTr: question[3], explainEn: english[2]
  };
}

`;
const existing = originals[0];
const brokenLine = '    quiz:d.quiz.map(assembleFrontendQuiz)';
const fixedLine = '    quiz:d.quiz.map((q,i)=>assembleFrontendQuiz(d,q,i))';
let updated;
if (existing.includes(oldLine) && existing.split(oldLine).length === 2) {
  updated = existing.replace('export const frontendCourse = {', helper + 'export const frontendCourse = {').replace(oldLine, fixedLine);
} else if (existing.includes(brokenLine) && existing.split(brokenLine).length === 2) {
  updated = existing.replace(brokenLine, fixedLine);
} else if (existing.includes(fixedLine) && existing.split(fixedLine).length === 2) {
  updated = existing;
} else {
  throw new Error('Frontend quiz assembly changed; stop instead of guessing');
}
console.log(`frontend: ${digest(existing).slice(0, 12)} -> ${digest(updated).slice(0, 12)}; 45 answer positions balanced during course assembly`);

if (process.argv.includes('--write')) {
  const backupDir = path.join(os.tmpdir(), `senior-academy-frontend-backup-${Date.now()}`);
  await mkdir(backupDir, { recursive: true });
  await writeFile(path.join(backupDir, 'frontend-original.js'), existing);
  for (const target of targets) {
    if (digest(await readFile(target, 'utf8')) !== digest(existing)) throw new Error('Frontend source changed during edit; stop');
    const temporary = `${target}.${process.pid}.tmp`;
    await writeFile(temporary, updated);
    await rename(temporary, target);
  }
  console.log(`Source copies updated. Original file backed up in ${backupDir}`);
} else {
  console.log('Dry run only. Pass --write to update both standalone and foundations copies.');
}

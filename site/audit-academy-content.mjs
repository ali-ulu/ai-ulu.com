import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootIndex = process.argv.indexOf('--root');
if (rootIndex < 0 || !process.argv[rootIndex + 1]) {
  console.error('Usage: node audit-academy-content.mjs --root <Senior-Software-Academy-v1> [--json]');
  process.exit(2);
}

const root = path.resolve(process.argv[rootIndex + 1]);
const ids = ['frontend', 'backend', 'devops', 'devsecops', 'system-design'];
const normalize = value => String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('tr');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const reports = [];

for (const id of ids) {
  const relative = path.join('courses', id, 'content.js');
  const standalonePath = path.join(root, id, relative);
  const embeddedPath = path.join(root, 'foundations', relative);
  const [source, embedded] = await Promise.all([readFile(standalonePath), readFile(embeddedPath)]);
  const module = await import(pathToFileURL(standalonePath).href);
  const course = Object.values(module).find(value => value && Array.isArray(value.days));
  if (!course) throw new Error(`${id}: course days could not be loaded`);
  const quiz = course.days.flatMap(day => day.quiz || []);
  const answers = [0, 0, 0, 0];
  const problems = [];
  const invalid = quiz.flatMap((question, index) => {
    const issues = [];
    for (const lang of ['Tr', 'En']) {
      const options = question[`options${lang}`];
      if (!normalize(question[`q${lang}`])) issues.push(`${lang} question missing`);
      if (!Array.isArray(options) || options.length !== 4) issues.push(`${lang} options must contain four choices`);
      else if (new Set(options.map(normalize)).size !== 4) issues.push(`${lang} options repeat`);
      if (!normalize(question[`explain${lang}`])) issues.push(`${lang} explanation missing`);
    }
    if (!Number.isInteger(question.a) || question.a < 0 || question.a > 3) issues.push('answer index invalid');
    else answers[question.a]++;
    return issues.map(issue => `question ${index + 1}: ${issue}`);
  });
  if (course.days.length !== 15) problems.push(`expected 15 days, found ${course.days.length}`);
  if (quiz.length !== 45) problems.push(`expected 45 questions, found ${quiz.length}`);
  const uniqueTr = new Set(quiz.map(question => normalize(question.qTr))).size;
  const uniqueEn = new Set(quiz.map(question => normalize(question.qEn))).size;
  if (uniqueTr !== quiz.length || uniqueEn !== quiz.length) problems.push(`repeated question stems: TR ${uniqueTr}/${quiz.length}, EN ${uniqueEn}/${quiz.length}`);
  if (quiz.length && Math.max(...answers) / quiz.length > 0.4) problems.push(`answer position concentration: ${answers.join('/')}`);
  const distractors = new Map();
  for (const question of quiz) {
    question.optionsTr?.forEach((option, index) => {
      if (index !== question.a) distractors.set(normalize(option), (distractors.get(normalize(option)) || 0) + 1);
    });
  }
  const overused = [...distractors].filter(([, count]) => count > 5).sort((a, b) => b[1] - a[1]);
  if (overused.length) problems.push(`overused distractors: ${overused.slice(0, 5).map(([option, count]) => `${count}× ${option}`).join('; ')}`);
  if (hash(source) !== hash(embedded)) problems.push('standalone and foundations copies differ');
  problems.push(...invalid);
  reports.push({ id, days: course.days.length, questions: quiz.length, uniqueTr, uniqueEn, answerPositions: answers, overusedDistractors: overused, sourceSha256: hash(source), copiesMatch: hash(source) === hash(embedded), problems });
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(reports, null, 2));
} else {
  for (const report of reports) {
    console.log(`${report.id}: ${report.days} days; ${report.questions} questions; unique TR/EN ${report.uniqueTr}/${report.uniqueEn}; answers ${report.answerPositions.join('/')}; copies ${report.copiesMatch ? 'match' : 'DIFFER'}; ${report.problems.length ? 'BLOCKED' : 'STRUCTURAL GATE PASSED'}`);
    for (const problem of report.problems) console.log(`  - ${problem}`);
  }
  console.log('This check finds structural assessment defects; a subject-matter and learner review is still required.');
}

if (reports.some(report => report.problems.length)) process.exitCode = 1;

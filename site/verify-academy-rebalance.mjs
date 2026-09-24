import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function argument(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`Missing ${name}`);
  return path.resolve(process.argv[index + 1]);
}

const root = argument('--root');
const backups = {
  frontend: path.join(argument('--frontend-backup'), 'frontend-original.js'),
  backend: path.join(argument('--other-backup'), 'backend-original.js'),
  devops: path.join(argument('--other-backup'), 'devops-original.js')
};

for (const id of Object.keys(backups)) {
  const currentPath = path.join(root, id, 'courses', id, 'content.js');
  const beforeModule = await import(pathToFileURL(backups[id]).href);
  const afterModule = await import(pathToFileURL(currentPath).href);
  const before = Object.values(beforeModule).find(value => value && Array.isArray(value.days));
  const after = Object.values(afterModule).find(value => value && Array.isArray(value.days));
  assert.equal(before.days.length, after.days.length, `${id}: day count`);
  let count = 0;
  before.days.forEach((day, dayIndex) => {
    const updated = after.days[dayIndex];
    assert.deepEqual(Object.fromEntries(Object.entries(day).filter(([key]) => key !== 'quiz')), Object.fromEntries(Object.entries(updated).filter(([key]) => key !== 'quiz')), `${id}: day ${dayIndex + 1} non-quiz content`);
    assert.equal(day.quiz.length, updated.quiz.length, `${id}: day ${dayIndex + 1} quiz count`);
    day.quiz.forEach((question, questionIndex) => {
      const revised = updated.quiz[questionIndex];
      for (const key of ['qTr', 'qEn', 'explainTr', 'explainEn']) assert.equal(question[key], revised[key], `${id}: ${key} changed`);
      for (const language of ['Tr', 'En']) {
        const key = `options${language}`;
        assert.deepEqual([...question[key]].sort(), [...revised[key]].sort(), `${id}: ${key} choices changed`);
        assert.equal(question[key][question.a], revised[key][revised.a], `${id}: ${key} correct answer changed`);
      }
      count++;
    });
  });
  assert.equal(count, 45, `${id}: expected 45 questions`);
  console.log(`${id}: 45 bilingual questions retain stems, choices, explanations and correct answers`);
}

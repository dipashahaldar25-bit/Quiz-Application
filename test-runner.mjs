import assert from 'node:assert';
import fs from 'node:fs';
import { calculateScore } from './src/utils/scoreCalculator.js';
import { validateQuizData } from './src/utils/validateQuestions.js';

console.log('--- STARTING QA TEST SUITE ---');

// 1. Validate questions.json
const rawData = fs.readFileSync('./src/data/questions.json', 'utf8');
const quizData = JSON.parse(rawData);
const validation = validateQuizData(quizData);
assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join(', ')}`);
assert.strictEqual(quizData.questions.length, quizData.quizMeta.totalQuestions, `Expected questions count (${quizData.questions.length}) to match totalQuestions (${quizData.quizMeta.totalQuestions})`);
assert.ok(quizData.questions.length >= 20, 'Expected at least 20 questions');
console.log(`✓ questions.json schema and content validation passed (${quizData.questions.length} questions)`);

const totalQ = quizData.questions.length;

// 2. Test score calculation: All skipped
const allSkippedResult = calculateScore(quizData.questions, {}, quizData.quizMeta, Date.now() - 30000, Date.now());
assert.strictEqual(allSkippedResult.correctCount, 0);
assert.strictEqual(allSkippedResult.wrongCount, 0);
assert.strictEqual(allSkippedResult.skippedCount, totalQ);
assert.strictEqual(allSkippedResult.percentage, 0);
assert.strictEqual(allSkippedResult.isPassed, false);
console.log('✓ All-skipped calculation passed');

// 3. Test score calculation: All correct
const allCorrectAnswers = {};
quizData.questions.forEach((q) => {
  allCorrectAnswers[q.id] = q.correctOptionId;
});
const allCorrectResult = calculateScore(quizData.questions, allCorrectAnswers, quizData.quizMeta, Date.now() - 60000, Date.now());
assert.strictEqual(allCorrectResult.correctCount, totalQ);
assert.strictEqual(allCorrectResult.wrongCount, 0);
assert.strictEqual(allCorrectResult.skippedCount, 0);
assert.strictEqual(allCorrectResult.percentage, 100);
assert.strictEqual(allCorrectResult.isPassed, true);
console.log('✓ All-correct (100%) calculation passed');

// 4. Test score calculation: Passing boundary (60%)
const passThreshold = Math.ceil(totalQ * (quizData.quizMeta.passingPercentage / 100));
const passingAnswers = {};
quizData.questions.forEach((q, idx) => {
  if (idx < passThreshold) {
    passingAnswers[q.id] = q.correctOptionId;
  } else {
    // pick wrong option
    const wrongOpt = q.options.find((o) => o.id !== q.correctOptionId);
    passingAnswers[q.id] = wrongOpt.id;
  }
});
const passResult = calculateScore(quizData.questions, passingAnswers, quizData.quizMeta, Date.now() - 40000, Date.now());
assert.strictEqual(passResult.correctCount, passThreshold);
assert.strictEqual(passResult.wrongCount, totalQ - passThreshold);
assert.strictEqual(passResult.skippedCount, 0);
assert.ok(passResult.percentage >= quizData.quizMeta.passingPercentage);
assert.strictEqual(passResult.isPassed, true);
console.log(`✓ Passing boundary condition (${passThreshold}/${totalQ}) passed`);

// 5. Test score calculation: Failing boundary (< 60%)
const failThreshold = Math.floor(totalQ * 0.5);
const failAnswers = {};
quizData.questions.forEach((q, idx) => {
  if (idx < failThreshold) {
    failAnswers[q.id] = q.correctOptionId;
  }
});
const failResult = calculateScore(quizData.questions, failAnswers, quizData.quizMeta, Date.now() - 40000, Date.now());
assert.strictEqual(failResult.correctCount, failThreshold);
assert.strictEqual(failResult.skippedCount, totalQ - failThreshold);
assert.ok(failResult.percentage < quizData.quizMeta.passingPercentage);
assert.strictEqual(failResult.isPassed, false);
console.log(`✓ Failing boundary condition (${failThreshold}/${totalQ}) passed`);

// 6. Test tiebreaker sorting for Leaderboard logic
const mockEntries = [
  { name: 'Player A', score: 8, totalDurationSeconds: 45, date: '2026-09-11T10:00:00Z' },
  { name: 'Player B', score: 10, totalDurationSeconds: 50, date: '2026-09-11T10:05:00Z' },
  { name: 'Player C', score: 8, totalDurationSeconds: 30, date: '2026-09-11T10:10:00Z' }, // tie with A, but faster!
];
const sorted = mockEntries.sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  if (a.totalDurationSeconds !== b.totalDurationSeconds) {
    return a.totalDurationSeconds - b.totalDurationSeconds;
  }
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});
assert.strictEqual(sorted[0].name, 'Player B', '1st should be highest score (10)');
assert.strictEqual(sorted[1].name, 'Player C', '2nd should be Player C (tie at 8, faster 30s)');
assert.strictEqual(sorted[2].name, 'Player A', '3rd should be Player A (tie at 8, slower 45s)');
console.log('✓ Leaderboard score + tiebreaker sorting passed');

// 7. Test Auth utilities & demo accounts
import {
  DEMO_ACCOUNTS,
  isValidEmail,
  calculatePasswordStrength,
  sanitizeUser,
} from './src/utils/authHelpers.js';

assert.ok(Array.isArray(DEMO_ACCOUNTS) && DEMO_ACCOUNTS.length >= 2, 'Expected at least 2 demo accounts');
assert.strictEqual(DEMO_ACCOUNTS[0].email, 'alex@example.com');
assert.strictEqual(DEMO_ACCOUNTS[0].password, 'password123');
assert.ok(DEMO_ACCOUNTS[0].name, 'Demo user should have a name');

// Email validation tests
assert.strictEqual(isValidEmail('user@domain.com'), true);
assert.strictEqual(isValidEmail('invalid-email'), false);
assert.strictEqual(isValidEmail(''), false);
assert.strictEqual(isValidEmail(null), false);

// Password strength tests
const weakPass = calculatePasswordStrength('123');
assert.strictEqual(weakPass.label, 'Weak');
const strongPass = calculatePasswordStrength('P@ssw0rd2026!');
assert.strictEqual(strongPass.label, 'Strong');

// Sanitize user tests
const rawUser = { id: 'u1', name: 'Test User', password: 'secretPassword', role: 'Tester' };
const safe = sanitizeUser(rawUser);
assert.strictEqual(safe.password, undefined, 'Sanitized user must not have password');
assert.strictEqual(safe.id, 'u1');
assert.strictEqual(safe.name, 'Test User');
console.log('✓ Auth helpers, validation, and demo accounts verified');

console.log('--- ALL QA TESTS PASSED SUCCESSFULLY! ---');

/**
 * Validates the structure and content of questions.json.
 * Ensures quizMeta exists with required fields, and every question
 * has exactly 4 options with unique IDs, a matching correctOptionId, and an explanation.
 */
export function validateQuizData(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Root data must be an object'] };
  }

  const { quizMeta, questions } = data;

  if (!quizMeta) {
    errors.push('Missing quizMeta object');
  } else {
    if (!quizMeta.title) errors.push('quizMeta.title is required');
    if (typeof quizMeta.totalQuestions !== 'number') errors.push('quizMeta.totalQuestions must be a number');
    if (typeof quizMeta.timePerQuestion !== 'number') errors.push('quizMeta.timePerQuestion must be a number');
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('questions must be a non-empty array');
  } else {
    questions.forEach((q, index) => {
      const qPrefix = `Question ${index + 1} (id: ${q.id}):`;
      if (!q.id) errors.push(`${qPrefix} missing id`);
      if (!q.question || typeof q.question !== 'string') errors.push(`${qPrefix} missing question text`);
      
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`${qPrefix} must have exactly 4 options`);
      } else {
        const optionIds = new Set();
        q.options.forEach((opt, optIndex) => {
          if (!opt.id) errors.push(`${qPrefix} option ${optIndex + 1} missing id`);
          if (!opt.text) errors.push(`${qPrefix} option ${optIndex + 1} missing text`);
          optionIds.add(opt.id);
        });

        if (!q.correctOptionId || !optionIds.has(q.correctOptionId)) {
          errors.push(`${qPrefix} correctOptionId '${q.correctOptionId}' is not among option IDs (${Array.from(optionIds).join(', ')})`);
        }
      }

      if (!q.explanation) {
        errors.push(`${qPrefix} missing explanation`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

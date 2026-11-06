/**
 * Calculates quiz score statistics, pass/fail status, and breakdown.
 *
 * @param {Array} questions - Array of question objects from questions.json
 * @param {Object} answers - Map of questionId -> selectedOptionId | null
 * @param {Object} quizMeta - Metadata containing passingPercentage
 * @param {number} startedAt - Timestamp when quiz started (ms)
 * @param {number} finishedAt - Timestamp when quiz was submitted (ms)
 * @returns {Object} Score details, breakdown counts, percentage, and time taken
 */
export function calculateScore(questions = [], answers = {}, quizMeta = {}, startedAt = null, finishedAt = null) {
  const totalQuestions = questions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const reviewItems = questions.map((q) => {
    const selectedOptionId = answers[q.id] ?? null;
    const isAnswered = selectedOptionId !== null && selectedOptionId !== undefined;
    const isCorrect = isAnswered && selectedOptionId === q.correctOptionId;

    let status = 'skipped';
    if (isAnswered) {
      if (isCorrect) {
        correctCount += 1;
        status = 'correct';
      } else {
        wrongCount += 1;
        status = 'wrong';
      }
    } else {
      skippedCount += 1;
    }

    const selectedOption = isAnswered
      ? q.options.find((opt) => opt.id === selectedOptionId)
      : null;
    const correctOption = q.options.find((opt) => opt.id === q.correctOptionId);

    return {
      questionId: q.id,
      questionText: q.question,
      options: q.options,
      selectedOptionId,
      selectedOptionText: selectedOption ? selectedOption.text : null,
      correctOptionId: q.correctOptionId,
      correctOptionText: correctOption ? correctOption.text : null,
      isCorrect,
      status,
      explanation: q.explanation,
    };
  });

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passingPercentage = quizMeta.passingPercentage ?? 60;
  const isPassed = percentage >= passingPercentage;

  let totalDurationSeconds = 0;
  if (startedAt && finishedAt && finishedAt > startedAt) {
    totalDurationSeconds = Math.round((finishedAt - startedAt) / 1000);
  }

  const minutes = Math.floor(totalDurationSeconds / 60);
  const seconds = totalDurationSeconds % 60;
  const formattedTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return {
    score: correctCount,
    totalQuestions,
    correctCount,
    wrongCount,
    skippedCount,
    percentage,
    passingPercentage,
    isPassed,
    totalDurationSeconds,
    formattedTime,
    reviewItems,
  };
}

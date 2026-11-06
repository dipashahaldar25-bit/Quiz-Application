import React, { useEffect } from 'react';
import Card from '../common/Card';
import OptionButton from './OptionButton';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
}) {
  if (!question) return null;

  // Keyboard shortcut listener: 1-4 or A-D
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const key = e.key.toLowerCase();
      let selectedIndex = -1;

      if (['1', '2', '3', '4'].includes(key)) {
        selectedIndex = parseInt(key, 10) - 1;
      } else if (['a', 'b', 'c', 'd'].includes(key)) {
        selectedIndex = key.charCodeAt(0) - 97;
      }

      if (selectedIndex >= 0 && selectedIndex < question.options.length) {
        onSelectOption(question.options[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, onSelectOption]);

  // Format question text: check if it has code snippets or multiple lines
  const renderQuestionText = (text) => {
    return (
      <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug whitespace-pre-line">
        {text}
      </div>
    );
  };

  return (
    <Card className="p-6 sm:p-8 md:p-10 shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            Single Choice (MCQ)
          </span>
        </div>
        {renderQuestionText(question.question)}
      </div>

      <div
        className="grid grid-cols-1 gap-3.5"
        role="radiogroup"
        aria-label={`Question ${questionNumber} options`}
      >
        {question.options.map((option, index) => (
          <OptionButton
            key={option.id}
            id={option.id}
            text={option.text}
            letterIndex={LETTERS[index] || option.id.toUpperCase()}
            numberIndex={index + 1}
            isSelected={selectedOptionId === option.id}
            onSelect={onSelectOption}
          />
        ))}
      </div>
    </Card>
  );
}

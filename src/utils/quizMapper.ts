import type { Quiz, QuizBackend, QuizQuestionBackend, QuizOptionBackend } from '../types';

export const mapQuiz = (q: QuizBackend): Quiz => {
  return {
    ...q,
    id: (q._id || q.id || '').toString(),
    date: q.createdAt || q.date || new Date().toISOString().split('T')[0],
    questions: (q.questions || []).map((quest: QuizQuestionBackend) => {
      let correctIndex = quest.correctAnswer;

      if (Array.isArray(quest.options) && typeof quest.options[0] === 'object') {
        const foundIndex = quest.options.findIndex(
          (opt): opt is QuizOptionBackend => typeof opt === 'object' && opt !== null && 'isCorrect' in opt && typeof (opt as QuizOptionBackend).isCorrect === 'boolean' && (opt as QuizOptionBackend).isCorrect
        );
        if (foundIndex !== -1) correctIndex = foundIndex;
      } else if (quest.correctAnswerIndex !== undefined) {
        correctIndex = quest.correctAnswerIndex;
      }

      return {
        id: (quest._id || quest.id || Math.random().toString()).toString(),
        question: quest.question || quest.questionText || '',
        options: (quest.options || []).map((opt) =>
          typeof opt === 'string' ? opt : opt.text
        ),
        correctAnswer: typeof correctIndex === 'number' ? correctIndex : 0,
      };
    }),
  };
};
import type { QuizQuestion } from "../../types";

type QuestionCardProps = {
  question: QuizQuestion;
  index: number;
};

function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <div className="question-card">
      <p className="question-title">
        Q{index + 1}: {question.question}
      </p>

      {question.options.map((option, optIndex) => (
        <div
          key={optIndex}
          className={
            optIndex === question.correctAnswer
              ? "option-item option-correct"
              : "option-item"
          }
        >
          {String.fromCharCode(65 + optIndex)}) {option}
        </div>
      ))}
    </div>
  );
}

export default QuestionCard;

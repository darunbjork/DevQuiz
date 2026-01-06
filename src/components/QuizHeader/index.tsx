import type { Quiz } from "../../types";

interface QuizHeaderProps {
  quiz: Quiz;
  currentQuestion: number;
  selectedAnswers: number[];
  setCurrentQuestion: (index: number) => void;
}

const QuizHeader = ({
  quiz,
  currentQuestion,
  selectedAnswers,
  setCurrentQuestion,
}: QuizHeaderProps) => (
  <div className="quiz-header">
    <h1 className="quiz-title">{quiz.title}</h1>
    <p className="quiz-description">{quiz.description}</p>

    <div className="progress-section">
      <div className="progress-top">
        <span>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
        <span>
          Answered: {selectedAnswers.filter((a) => a !== -1).length}/
          {quiz.questions.length}
        </span>
      </div>

      <div className="question-dots">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            className={`dot-btn ${
              index === currentQuestion
                ? "dot-current"
                : selectedAnswers[index] !== -1
                ? "dot-answered"
                : "dot-empty"
            }`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default QuizHeader;

import type { QuizQuestion } from "../../types";

interface QuestionDisplayProps {
  currentQ: QuizQuestion;
  currentQuestionIndex: number;
  selectedAnswers: number[];
  handleAnswerSelect: (optionIndex: number) => void;
}

const QuestionDisplay = ({
  currentQ,
  currentQuestionIndex,
  selectedAnswers,
  handleAnswerSelect,
}: QuestionDisplayProps) => (
  <div className="question-block">
    <h2 className="question-text">{currentQ.question}</h2>

    <div className="options-list">
      {currentQ.options.map((option, index) => (
        <button
          key={index}
          className={`option-btn ${
            selectedAnswers[currentQuestionIndex] === index
              ? "option-selected"
              : ""
          }`}
          onClick={() => handleAnswerSelect(index)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              className={`option-circle ${
                selectedAnswers[currentQuestionIndex] === index
                  ? "option-circle-selected"
                  : ""
              }`}
            >
              {selectedAnswers[currentQuestionIndex] === index && "✓"}
            </div>
            <span>{option}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default QuestionDisplay;

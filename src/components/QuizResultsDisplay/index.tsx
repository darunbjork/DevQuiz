import Card from "../Card";
import Button from "../Button";
import type { Quiz, UserAnswer } from "../../types";

interface QuizResultsDisplayProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  navigate: (path: string) => void;
  onRetry: () => void; // New prop for retrying the quiz
}

const QuizResultsDisplay = ({ quiz, userAnswers, navigate, onRetry }: QuizResultsDisplayProps) => {
  const score = userAnswers.filter((a) => a.isCorrect).length;
  const percentage = (score / quiz.questions.length) * 100;

  return (
    <div className="takequiz-container">
      <Card title="Quiz Results">
        <div className="results-container">
          <div
            className="results-score"
            style={{
              color:
                percentage >= 80
                  ? "#10b981"
                  : percentage >= 60
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          >
            {percentage.toFixed(0)}%
          </div>

          <p className="results-message">
            {percentage >= 80 && "Excellent work! 🎉"}
            {percentage >= 60 && percentage < 80 && "Good job! Keep practicing! 👍"}
            {percentage < 60 && "Keep studying and try again! 📚"}
          </p>

          <div className="nav-buttons" style={{ justifyContent: "center", gap: "16px" }}>
            <Button onClick={() => navigate("/profile")}>Back to Profile</Button>
            <Button variant="secondary" onClick={onRetry}>
              Retry Quiz
            </Button>
          </div>
        </div>

        <div className="detailed-results">
          <h3>Detailed Results</h3>

          {userAnswers.map((answer, index) => (
            <div
              key={answer.questionId}
              className={`result-item ${
                answer.isCorrect ? "result-correct" : "result-wrong"
              }`}
            >
              <div className="result-question">
                <span className="result-icon">
                  {answer.isCorrect ? "✓" : "✗"}
                </span>
                <p>
                  Q{index + 1}: {answer.question}
                </p>
              </div>

              <div className="result-answer">
                <p>
                  <strong>Your answer:</strong>{" "}
                  {answer.selectedAnswer !== -1
                    ? quiz.questions[index].options[answer.selectedAnswer]
                    : "No answer selected"}
                </p>

                {!answer.isCorrect && (
                  <p className="correct-answer-text">
                    <strong>Correct answer:</strong>{" "}
                    {quiz.questions[index].options[answer.correctAnswer]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuizResultsDisplay;

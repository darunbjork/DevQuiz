import type { SavedQuizResult } from "../../types";
import Card from "../Card";
import Button from "../Button";

interface QuizHistoryCardProps {
  result: SavedQuizResult;
  onDelete: (id: number) => void;
}

const QuizHistoryCard = ({ result, onDelete }: QuizHistoryCardProps) => (
  <Card>
    <div className="history-header">
      <div>
        <h4 className="history-title">{result.quizTitle}</h4>
        <p className="history-date">
          {new Date(result.date).toLocaleDateString()} at{" "}
          {new Date(result.date).toLocaleTimeString()}
        </p>
      </div>

      <div style={{ textAlign: "right" }}>
        <div
          className="history-score"
          style={{
            color:
              result.percentage >= 80
                ? "#10b981"
                : result.percentage >= 60
                ? "#f59e0b"
                : "#ef4444",
          }}
        >
          {result.percentage.toFixed(0)}%
        </div>
        <p className="history-date">
          {result.score}/{result.totalQuestions} correct
        </p>
      </div>
    </div>

    <div className="history-breakdown">
      <details>
        <summary style={{ cursor: "pointer", fontWeight: "600" }}>
          View Details
        </summary>

        <div style={{ marginLeft: "16px" }}>
          {result.answers.map((answer, index) => (
            <div
              key={answer.questionId}
              className="breakdown-item"
              style={{
                borderLeftColor: answer.isCorrect
                  ? "#10b981"
                  : "#ef4444",
                backgroundColor: answer.isCorrect
                  ? "#d1fae5"
                  : "#fee2e2",
              }}
            >
              <p>
                <strong>Q{index + 1}:</strong> {answer.question}
              </p>
              <p className="breakdown-item-text">
                {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </p>
            </div>
          ))}
        </div>
      </details>
    </div>

    <Button
      variant="danger"
      onClick={() => onDelete(result.id)}
    >
      Delete
    </Button>
  </Card>
);

export default QuizHistoryCard;

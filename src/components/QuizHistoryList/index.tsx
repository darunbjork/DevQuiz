import type { SavedQuizResult } from "../../types";
import Card from "../Card";
import QuizHistoryCard from "../QuizHistoryCard";

interface QuizHistoryListProps {
  quizHistory: SavedQuizResult[];
  onDelete: (id: string) => void;
}

const QuizHistoryList = ({ quizHistory, onDelete }: QuizHistoryListProps) => (
  <div>
    <h3 className="history-title">Quiz History</h3>

    {quizHistory.length === 0 ? (
      <Card>
        <p className="profile-subtitle" style={{ textAlign: "center", padding: "48px 0" }}>
          No quiz attempts yet.
        </p>
      </Card>
    ) : (
      <div className="history-list">
        {quizHistory
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((result) => (
            <QuizHistoryCard key={result.id} result={result} onDelete={onDelete} />
          ))}
      </div>
    )}
  </div>
);

export default QuizHistoryList;

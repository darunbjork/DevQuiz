import { type Quiz } from "../types";
import Card from "./Card";
import Button from "./Button";
import "./QuizCard.css";

interface QuizCardProps {
  quiz: Quiz;
  onDelete?: (quizId: number) => void;
  onEdit?: (quiz: Quiz) => void;
  onTakeQuiz?: (quizId: number) => void;
}

function QuizCard({ quiz, onDelete, onEdit, onTakeQuiz }: QuizCardProps) {
  return (
    <Card className="quizcard" title={quiz.title}>
      <p className="quizcard-description">{quiz.description}</p>

      <div className="quizcard-footer">
        <span className="quizcard-meta">
          {quiz.questions.length} questions • Created: {quiz.date}
        </span>

        <div className="quizcard-actions">
          {onTakeQuiz && (
            <Button onClick={() => onTakeQuiz(quiz.id)}>Take Quiz</Button>
          )}

          {onEdit && (
            <Button variant="secondary" onClick={() => onEdit(quiz)}>
              Edit
            </Button>
          )}

          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(quiz.id)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default QuizCard;
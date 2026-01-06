import type { QuizQuestion } from "../../types";
import Card from "../Card";
import QuestionCard from "../QuestionCard";

type QuizQuestionsDisplayProps = {
  questions: QuizQuestion[];
  title?: string;
};

function QuizQuestionsDisplay({ questions, title = "Generated Questions" }: QuizQuestionsDisplayProps) {
  if (questions.length === 0) return null;

  return (
    <Card title={`${title} (${questions.length})`}>
      <div className="form-group">
        {questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </div>
    </Card>
  );
}

export default QuizQuestionsDisplay;

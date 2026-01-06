import Button from "../Button";
import type { Quiz } from "../../types";

interface NavigationButtonsProps {
  currentQuestion: number;
  quiz: Quiz;
  selectedAnswers: number[];
  setCurrentQuestion: (index: number) => void;
  handleSubmit: () => void;
}

const NavigationButtons = ({
  currentQuestion,
  quiz,
  selectedAnswers,
  setCurrentQuestion,
  handleSubmit,
}: NavigationButtonsProps) => (
  <div className="nav-buttons">
    <Button
      variant="secondary"
      disabled={currentQuestion === 0}
      onClick={() => setCurrentQuestion(currentQuestion - 1)}
    >
      ← Previous
    </Button>

    {currentQuestion < quiz.questions.length - 1 ? (
      <Button
        disabled={selectedAnswers[currentQuestion] === -1}
        onClick={() => setCurrentQuestion(currentQuestion + 1)}
      >
        Next →
      </Button>
    ) : (
      <Button
        variant="success"
        disabled={selectedAnswers.some((a) => a === -1)}
        onClick={handleSubmit}
      >
        Submit Quiz
      </Button>
    )}
  </div>
);

export default NavigationButtons;

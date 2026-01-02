import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Quiz, UserAnswer } from "../types";
import Card from "../components/Card";
import Button from "../components/Button";
import "./TakeQuiz.css";

function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() =>
    new Array(quiz.questions.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const auth = useAuth();
  const navigate = useNavigate();
  const currentQ = quiz.questions[currentQuestion];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const answers: UserAnswer[] = quiz.questions.map((question, index) => ({
      questionId: Date.now() + index,
      question: question.question,
      selectedAnswer: selectedAnswers[index],
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswers[index] === question.correctAnswer,
    }));

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const percentage = (correctCount / quiz.questions.length) * 100;

    setUserAnswers(answers);
    setShowResults(true);

    auth.saveQuizResult({
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      answers,
    });
  };

  /* RESULTS PAGE */
  if (showResults) {
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
              <Button variant="secondary" onClick={() => window.location.reload()}>
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
  }

  /* QUIZ PLAY PAGE */
  return (
    <div className="takequiz-container">
      <Card>
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

        <div className="question-block">
          <h2 className="question-text">{currentQ.question}</h2>

          <div className="options-list">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswers[currentQuestion] === index
                    ? "option-selected"
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    className={`option-circle ${
                      selectedAnswers[currentQuestion] === index
                        ? "option-circle-selected"
                        : ""
                    }`}
                  >
                    ✓
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="nav-buttons">
          <Button
            variant="secondary"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
          >
            ← Previous
          </Button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              disabled={selectedAnswers[currentQuestion] === -1}
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
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
      </Card>
    </div>
  );
}

function TakeQuiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const auth = useAuth();

  const quiz = auth.user?.createdQuizzes?.find(
    (q: Quiz) => q.id === parseInt(quizId || "")
  );

  if (!quiz) {
    return (
      <div className="takequiz-container">
        <Card>
          <p style={{ textAlign: "center", padding: "32px 0", fontSize: "18px" }}>
            Quiz not found
          </p>
          <div style={{ textAlign: "center" }}>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  return <QuizPlayer quiz={quiz} key={quiz.id} />;
}

export default TakeQuiz;
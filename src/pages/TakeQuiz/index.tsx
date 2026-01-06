import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Quiz, UserAnswer } from "../../types";
import Card from "../../components/Card";
import "./TakeQuiz.css";
import QuizHeader from "../../components/QuizHeader";
import QuestionDisplay from "../../components/QuestionDisplay";
import NavigationButtons from "../../components/NavigationButtons";
import QuizResultsDisplay from "../../components/QuizResultsDisplay";
import QuizNotFound from "../../components/QuizNotFound";

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

  const handleRetryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setShowResults(false);
    setUserAnswers([]);
  };

  /* RESULTS PAGE */
  if (showResults) {
    return (
      <QuizResultsDisplay
        quiz={quiz}
        userAnswers={userAnswers}
        navigate={navigate}
        onRetry={handleRetryQuiz}
      />
    );
  }

  /* QUIZ PLAY PAGE */
  return (
    <div className="takequiz-container">
      <Card>
        <QuizHeader
          quiz={quiz}
          currentQuestion={currentQuestion}
          selectedAnswers={selectedAnswers}
          setCurrentQuestion={setCurrentQuestion}
        />

        <QuestionDisplay
          currentQ={currentQ}
          currentQuestionIndex={currentQuestion}
          selectedAnswers={selectedAnswers}
          handleAnswerSelect={handleAnswerSelect}
        />

        <NavigationButtons
          currentQuestion={currentQuestion}
          quiz={quiz}
          selectedAnswers={selectedAnswers}
          setCurrentQuestion={setCurrentQuestion}
          handleSubmit={handleSubmit}
        />
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
    return <QuizNotFound />;
  }

  return <QuizPlayer quiz={quiz} key={quiz.id} />;
}

export default TakeQuiz;
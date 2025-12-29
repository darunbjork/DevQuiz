import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Quiz, UserAnswer } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';

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
      questionId: Date.now() + index, // Use index for unique ID as question doesn't have id
      question: question.question,
      selectedAnswer: selectedAnswers[index],
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswers[index] === question.correctAnswer
    }));

    const correctCount = answers.filter(a => a.isCorrect).length;
    const percentage = (correctCount / quiz.questions.length) * 100;

    setUserAnswers(answers);
    setShowResults(true);

    // Save quiz result
    auth.saveQuizResult({
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      answers
    });
  };

  if (showResults) {
    const score = userAnswers.filter(a => a.isCorrect).length;
    const percentage = (score / quiz.questions.length) * 100;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="Quiz Results">
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444',
              marginBottom: '16px'
            }}>
              {percentage.toFixed(0)}%
            </div>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>
              {score}/{quiz.questions.length} Correct
            </p>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              {percentage >= 80 && 'Excellent work! 🎉'}
              {percentage >= 60 && percentage < 80 && 'Good job! Keep practicing! 👍'}
              {percentage < 60 && 'Keep studying and try again! 📚'}
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
              <Button onClick={() => navigate('/profile')}>
                Back to Profile
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Retry Quiz
              </Button>
            </div>
          </div>

          {/* Detailed Results */}
          <div style={{ marginTop: '32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Detailed Results</h3>
            {userAnswers.map((answer, index) => (
              <div 
                key={answer.questionId}
                style={{
                  padding: '16px',
                  marginBottom: '16px',
                  border: `2px solid ${answer.isCorrect ? '#10b981' : '#ef4444'}`,
                  borderRadius: '8px',
                  backgroundColor: answer.isCorrect ? '#d1fae5' : '#fee2e2'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ 
                    fontSize: '24px',
                    color: answer.isCorrect ? '#10b981' : '#ef4444'
                  }}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </span>
                  <p style={{ fontWeight: '600', margin: 0 }}>
                    Q{index + 1}: {answer.question}
                  </p>
                </div>

                <div style={{ marginLeft: '32px' }}>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>Your answer:</strong>{' '}
                    {answer.selectedAnswer !== -1 
                      ? quiz.questions[index].options[answer.selectedAnswer]
                      : 'No answer selected'}
                  </p>
                  {!answer.isCorrect && (
                    <p style={{ color: '#10b981' }}>
                      <strong>Correct answer:</strong>{' '}
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>
            {quiz.title}
          </h1>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            {quiz.description}
          </p>
          
          {/* Progress Bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#888' }}>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span style={{ fontSize: '14px', color: '#888' }}>
                Answered: {selectedAnswers.filter(a => a !== -1).length}/{quiz.questions.length}
              </span>
            </div>
            
            {/* Question Navigation Dots */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: index === currentQuestion
                      ? '#4f46e5'
                      : selectedAnswers[index] !== -1
                      ? '#10b981'
                      : '#e5e7eb',
                    color: index === currentQuestion || selectedAnswers[index] !== -1 ? 'white' : '#666',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', lineHeight: '1.6' }}>
            {currentQ.question}
          </h2>
          
          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  border: selectedAnswers[currentQuestion] === index
                    ? '3px solid #4f46e5'
                    : '2px solid #ddd',
                  borderRadius: '12px',
                  backgroundColor: selectedAnswers[currentQuestion] === index
                    ? '#eef2ff'
                    : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '16px'
                }}
                onClick={() => handleAnswerSelect(index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: selectedAnswers[currentQuestion] === index
                      ? '2px solid #4f46e5'
                      : '2px solid #888',
                    backgroundColor: selectedAnswers[currentQuestion] === index
                      ? '#4f46e5'
                      : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: selectedAnswers[currentQuestion] === index ? 'white' : 'transparent',
                    fontWeight: '600'
                  }}>
                    ✓
                  </div>
                  <span style={{ flex: 1 }}>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="secondary"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            ← Previous
          </Button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              disabled={selectedAnswers[currentQuestion] === -1}
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next →
            </Button>
          ) : (
            <Button
              variant="success"
              disabled={selectedAnswers.some(answer => answer === -1)}
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

  const quiz = auth.user?.createdQuizzes?.find((q: Quiz) => q.id === parseInt(quizId || ''));

  if (!quiz) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <p style={{ textAlign: 'center', padding: '32px 0', fontSize: '18px' }}>
            Quiz not found
          </p>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <QuizPlayer quiz={quiz} key={quiz.id} />;
}

export default TakeQuiz;
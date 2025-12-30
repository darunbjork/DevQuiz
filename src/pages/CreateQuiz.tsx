import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import type { NewQuiz, QuizQuestion } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';

function CreateQuiz() {
  const [quizData, setQuizData] = useState<NewQuiz>({
    title: '',
    description: '',
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<Omit<QuizQuestion, 'id'>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });
  
  const auth = useAuth();
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (currentQuestion.options.some(opt => !opt.trim())) {
      toast.error('Please fill all options');
      return;
    }
    
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { ...currentQuestion, id: Date.now() }
      ]
    }));
    
    // Reset current question
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  };

  const handleCreateQuiz = () => {
    if (!quizData.title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    if (!quizData.description.trim()) {
      toast.error('Please enter a quiz description');
      return;
    }
    
    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    
    auth.addCreatedQuiz(quizData);
    toast.success('Quiz created successfully!');
    navigate('/profile');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>
        Create New Quiz
      </h1>

      <Card title="Quiz Details" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              value={quizData.title}
              onChange={(e) => setQuizData({...quizData, title: e.target.value})}
              placeholder="Enter quiz title"
            />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
            <textarea
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '100px'
              }}
              rows={3}
              value={quizData.description}
              onChange={(e) => setQuizData({...quizData, description: e.target.value})}
              placeholder="Enter quiz description"
            />
          </div>
      </Card>

      <Card title="Add Question" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Question</label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
              placeholder="Enter question"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Options</label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[index] = e.target.value;
                    setCurrentQuestion({...currentQuestion, options: newOptions});
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                  style={{ marginLeft: '12px' }}
                />
              </div>
            ))}
          </div>
          <Button onClick={handleAddQuestion}>Add Question</Button>
        </div>
      </Card>

      <Card title="Questions Preview" style={{ marginBottom: '24px' }}>
        {quizData.questions.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>
            No questions added yet
          </p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {quizData.questions.map((q, index) => (
              <li 
                key={index} 
                style={{ 
                  borderBottom: '1px solid #eee', 
                  paddingBottom: '12px',
                  marginBottom: '12px'
                }}
              >
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {index + 1}. {q.question}
                </p>
                <ul style={{ marginLeft: '20px' }}>
                  {q.options.map((opt, optIndex) => (
                    <li 
                      key={optIndex}
                      style={{
                        color: optIndex === q.correctAnswer ? 'green' : 'inherit',
                        fontWeight: optIndex === q.correctAnswer ? 'bold' : 'normal'
                      }}
                    >
                      {optIndex + 1}. {opt} {optIndex === q.correctAnswer && '✓'}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '24px'
      }}>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/profile')}
        >
          Cancel
        </Button>
                  <Button 
                    onClick={handleCreateQuiz}
                    disabled={quizData.questions.length === 0}
                  >
                    Create Quiz ({quizData.questions.length} questions)
                  </Button>     
                   </div>
    </div>
  );
}

export default CreateQuiz;
import { type Quiz } from '../types';
import Card from './Card';
import Button from './Button';

interface QuizCardProps {
  quiz: Quiz;
  onDelete?: (quizId: number) => void;
  onEdit?: (quiz: Quiz) => void;
  onTakeQuiz?: (quizId: number) => void;
}

function QuizCard({ quiz, onDelete, onEdit, onTakeQuiz }: QuizCardProps) {
  return (
    <Card 
     style={{ marginBottom: '16px' }}
      title={quiz.title}
    >
      <p style={{ color: '#666', marginBottom: '8px' }}>
        {quiz.description}
      </p>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '16px'
      }}>
        <span style={{ 
          fontSize: '14px', 
          color: '#888'
        }}>
          {quiz.questions.length} questions • Created: {quiz.date}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onTakeQuiz && (
            <Button onClick={() => onTakeQuiz(quiz.id)}>
              Take Quiz
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="secondary" 
              onClick={() => onEdit(quiz)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="danger" 
              onClick={() => onDelete(quiz.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default QuizCard;
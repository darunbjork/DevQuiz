import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import type { QuizQuestion, NewQuiz } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';

function Study() {
  const [studyNote, setStudyNote] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  
  const auth = useAuth();
  const navigate = useNavigate();

  const parseQuizText = (text: string): QuizQuestion[] => {
    const questionBlocks = text.split(/(Q\d+:)/).filter(Boolean);
    const pairedBlocks = questionBlocks.reduce((result, _value, index, array) => {
      if (index % 2 === 0) {
        result.push(array.slice(index, index + 2));
      }
      return result;
    }, [] as string[][]);

    return pairedBlocks
      .filter(pair => pair.length === 2 && pair[0].startsWith('Q'))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, qBody], index) => {
        const questionTextLines = qBody.split('\n').filter(line => line.trim() !== '');
        const questionText = questionTextLines[0].trim();
        const options: string[] = [];
        let correctAnswerIndex: number = -1;

        for (const line of questionTextLines.slice(1)) {
          if (line.match(/^[A-D]\) /)) {
            options.push(line.substring(3).trim());
          } else if (line.startsWith('Correct: ')) {
            const correctLetter = line.substring('Correct: '.length).trim();
            correctAnswerIndex = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
          }
        }

        return {
          id: Date.now() + index,
          question: questionText,
          options,
          correctAnswer: correctAnswerIndex,
        };
      });
  };

  const handleGenerateQuiz = async () => {
    console.log(studyNote);
    if (!studyNote.trim()) {
      toast.error('Please enter study notes');
      return;
    }

    setLoading(true);
    setQuizQuestions([]);

    const detailedPrompt = `
Based on the following study note, generate 5 multiple-choice questions in the exact format shown below.
Ensure each question has four options (A, B, C, D) and specify the correct answer.

Study Note:
"""
${studyNote}
"""

Format:
Q1: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [A/B/C/D]

Q2: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [A/B/C/D]
`;

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

      const requestBody = {
        contents: [
          {
            parts: [{ text: detailedPrompt }]
          }
        ]
      };

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      const parsed = parseQuizText(aiResponse);
      
      if (parsed.length === 0) {
        toast.error('Failed to parse AI response. Try again.');
        return;
      }

      setQuizQuestions(parsed);
      
      // Auto-generate title and description
      const firstWords = studyNote.split(' ').slice(0, 5).join(' ');
      setQuizTitle(`AI Quiz: ${firstWords}...`);
      setQuizDescription(`AI-generated quiz based on your study notes about: ${firstWords}...`);
      
      toast.success(`Generated ${parsed.length} questions!`);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (quizQuestions.length === 0) {
      toast.error('No questions to save');
      return;
    }

    const quizData: NewQuiz = {
      title: quizTitle,
      description: quizDescription,
      questions: quizQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    };

    auth.addCreatedQuiz(quizData);
    
    // Reset form
    setStudyNote('');
    setQuizQuestions([]);
    setQuizTitle('');
    setQuizDescription('');
    
    navigate('/profile');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>
        Study with AI 🤖
      </h1>

      <Card title="Generate Quiz from Notes" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Paste your study notes
            </label>
            <textarea 
              value={studyNote}
              onChange={(e) => setStudyNote(e.target.value)}
              placeholder="Example: React hooks allow function components to use state and lifecycle features. useState manages state, useEffect handles side effects..."
              rows={8}
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <Button onClick={handleGenerateQuiz} disabled={loading}>
            {loading ? 'Generating Questions...' : 'Generate Quiz with AI'}
          </Button>
        </div>
      </Card>

      {quizQuestions.length > 0 && (
        <>
          <Card title="Quiz Details" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
              </div>
            </div>
          </Card>

          <Card title={`Generated Questions (${quizQuestions.length})`} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {quizQuestions.map((q, index) => (
                <div 
                  key={q.id}
                  style={{ 
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <p style={{ fontWeight: '600', marginBottom: '12px' }}>
                    Q{index + 1}: {q.question}
                  </p>
                  <div style={{ marginLeft: '20px' }}>
                    {q.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        style={{
                          padding: '8px',
                          marginBottom: '4px',
                          backgroundColor: optIndex === q.correctAnswer ? '#d1fae5' : 'white',
                          borderRadius: '4px',
                          border: optIndex === q.correctAnswer ? '2px solid #10b981' : '1px solid #e5e7eb'
                        }}
                      >
                        {String.fromCharCode(65 + optIndex)}) {option}
                        {optIndex === q.correctAnswer && (
                          <span style={{ marginLeft: '8px', color: '#10b981', fontWeight: '600' }}>
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <Button 
              variant="secondary"
              onClick={() => {
                setQuizQuestions([]);
                setQuizTitle('');
                setQuizDescription('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveQuiz}>
              Save AI Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Study;

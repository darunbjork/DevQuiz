import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import QuizCard from '../components/QuizCard';
import Button from '../components/Button';
import Card from '../components/Card';
import AccuracyPieChart from '../components/AccuracyPieChart';
import type { SavedQuizResult, Quiz, UserAnswer } from '../types';

function Profile() {
  const auth = useAuth();
  const [editName, setEditName] = useState(auth.user?.name || '');
  const [activeTab, setActiveTab] = useState<'quizzes' | 'history' | 'analytics'>('quizzes');
  const navigate = useNavigate();

  if (!auth.user) {
    return <div style={{ padding: '24px' }}>Please log in to view profile</div>;
  }

  const quizHistory = auth.user.quizzes || [];
  const createdQuizzes = auth.user.createdQuizzes || [];

  // Analytics Data
  const performanceData = quizHistory
    .slice(-10)
    .map((quiz: SavedQuizResult, index: number) => ({
      name: `Quiz ${index + 1}`,
      score: quiz.percentage,
      date: new Date(quiz.date).toLocaleDateString()
    }));

  const avgScore = quizHistory.length > 0
    ? quizHistory.reduce((sum: number, q: SavedQuizResult) => sum + q.percentage, 0) / quizHistory.length
    : 0;

  const totalQuestions = quizHistory.reduce((sum: number, q: SavedQuizResult) => sum + q.totalQuestions, 0);
  const totalCorrect = quizHistory.reduce((sum: number, q: SavedQuizResult) => sum + q.score, 0);



  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px',
        marginTop: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Profile</h1>
          <p style={{ color: '#666' }}>Welcome back, {auth.user.name}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4f46e5' }}>
              {createdQuizzes.length}
            </div>
            <p style={{ color: '#666', marginTop: '8px' }}>Quizzes Created</p>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>
              {quizHistory.length}
            </div>
            <p style={{ color: '#666', marginTop: '8px' }}>Quizzes Taken</p>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b' }}>
              {avgScore.toFixed(0)}%
            </div>
            <p style={{ color: '#666', marginTop: '8px' }}>Average Score</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <button
          style={{
            padding: '12px 24px',
            border: 'none',
            borderBottom: activeTab === 'quizzes' ? '3px solid #4f46e5' : 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'quizzes' ? '600' : 'normal',
            color: activeTab === 'quizzes' ? '#4f46e5' : '#666',
            fontSize: '16px'
          }}
          onClick={() => setActiveTab('quizzes')}
        >
          My Quizzes
        </button>
        <button
          style={{
            padding: '12px 24px',
            border: 'none',
            borderBottom: activeTab === 'history' ? '3px solid #4f46e5' : 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'history' ? '600' : 'normal',
            color: activeTab === 'history' ? '#4f46e5' : '#666',
            fontSize: '16px'
          }}
          onClick={() => setActiveTab('history')}
        >
          Quiz History
        </button>
        <button
          style={{
            padding: '12px 24px',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '3px solid #4f46e5' : 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'analytics' ? '600' : 'normal',
            color: activeTab === 'analytics' ? '#4f46e5' : '#666',
            fontSize: '16px'
          }}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'quizzes' && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '20px' }}>My Created Quizzes</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={() => navigate('/study')}>
                Generate with AI
              </Button>
              <Button onClick={() => navigate('/create-quiz')}>
                Create Manually
              </Button>
            </div>
          </div>
          
          {createdQuizzes.length === 0 ? (
            <Card>
              <p style={{ 
                color: '#888', 
                textAlign: 'center',
                padding: '48px 0'
              }}>
                You haven't created any quizzes yet. Create your first quiz using AI or manually!
              </p>
            </Card>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '16px'
            }}>
              {createdQuizzes.map((quiz: Quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onDelete={auth.deleteCreatedQuiz}
                  onTakeQuiz={(id) => navigate(`/take-quiz/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Quiz History</h3>
          
          {quizHistory.length === 0 ? (
            <Card>
              <p style={{ 
                color: '#888', 
                textAlign: 'center',
                padding: '48px 0'
              }}>
                No quiz attempts yet. Take a quiz to see your history!
              </p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizHistory.sort((a: SavedQuizResult, b: SavedQuizResult) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((result: SavedQuizResult) => (
                <Card key={result.id}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ marginBottom: '8px', fontSize: '18px' }}>{result.quizTitle}</h4>
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        {new Date(result.date).toLocaleDateString()} at{' '}
                        {new Date(result.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: 'bold',
                        color: result.percentage >= 80 ? '#10b981' : result.percentage >= 60 ? '#f59e0b' : '#ef4444'
                      }}>
                        {result.percentage.toFixed(0)}%
                      </div>
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        {result.score}/{result.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                  
                  {/* Answer Breakdown */}
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <details>
                      <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '12px' }}>
                        View Details
                      </summary>
                      <div style={{ marginLeft: '16px' }}>
                        {result.answers.map((answer: UserAnswer, index: number) => (
                          <div 
                            key={answer.questionId}
                            style={{
                              padding: '8px',
                              marginBottom: '8px',
                              borderLeft: `4px solid ${answer.isCorrect ? '#10b981' : '#ef4444'}`,
                              paddingLeft: '12px',
                              backgroundColor: answer.isCorrect ? '#d1fae5' : '#fee2e2',
                              borderRadius: '4px'
                            }}
                          >
                            <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                              <strong>Q{index + 1}:</strong> {answer.question}
                            </p>
                            <p style={{ fontSize: '12px', color: '#666' }}>
                              {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                  
                  <div style={{ marginTop: '12px' }}>
                    <Button 
                      variant="danger"
                      onClick={() => auth.deleteQuiz(result.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Performance Analytics</h3>
          
          {quizHistory.length === 0 ? (
            <Card>
              <p style={{ 
                color: '#888', 
                textAlign: 'center',
                padding: '48px 0'
              }}>
                No data yet. Take some quizzes to see your analytics!
              </p>
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Line Chart */}
              <Card title="Performance Over Time">
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Pie Chart */}
              <Card title="Overall Accuracy">
                <div style={{ height: '300px' }}>
                  <AccuracyPieChart 
                    totalCorrect={totalCorrect} 
                    totalQuestions={totalQuestions} 
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Section */}
      <Card title="Edit Profile" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Name</label>
            <input 
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input 
              type="email"
              value={auth.user.email}
              disabled
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                color: '#666'
              }}
            />
          </div>
          <Button onClick={() => auth.updateProfile({ name: editName })}>
            Update Name
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
// Second: AuthContextProvider
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import type {
  User,
  NewQuiz,
  Quiz,
  SavedQuizResult,
  QuizBackend,
  SavedQuizAttemptBackend,
  SavedQuizAttemptAnswerBackend,
} from '../types';
import { mapQuiz } from '../utils/quizMapper'; // Import mapQuiz from types
import { AuthContext } from './AuthContext';
import { API_BASE_URL } from '../config/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    toast.success('Logged out successfully');
  }, []);

  const loadMe = useCallback(
    async (accessToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();

          const mappedCreatedQuizzes: Quiz[] = (userData.createdQuizzes || []).map(mapQuiz);

          const mappedQuizzes: SavedQuizResult[] = (userData.quizzes || []).map(
            (a: SavedQuizAttemptBackend) => {
              const quiz = mappedCreatedQuizzes.find(
                (cq) => cq.id === (a.quizId || '').toString()
              );

              return {
                id: (a._id || a.id || '').toString(),
                quizId: (a.quizId || '').toString(),
                quizTitle: a.quizTitle || quiz?.title || 'AI Generated Quiz',
                score: a.score || 0,
                totalQuestions: a.totalQuestions || a.answers?.length || 0,
                percentage: a.totalQuestions
                  ? (a.score / a.totalQuestions) * 100
                  : a.answers?.length
                  ? (a.score / a.answers.length) * 100
                  : 0,
                date: a.startTime || a.date || new Date().toISOString(),
                answers: (a.answers || []).map((ans: SavedQuizAttemptAnswerBackend) => ({
                  questionId: (ans.questionId || '').toString(),
                  question: ans.questionText || '',
                  selectedAnswer: parseInt(ans.selectedOption || '0'),
                  isCorrect: ans.isCorrect,
                })),
              };
            }
          );

          const user: User = {
            ...userData,
            id: (userData.id || userData._id || '').toString(),
            quizzes: mappedQuizzes,
            createdQuizzes: mappedCreatedQuizzes,
            settings: userData.settings || { theme: 'light' },
          };
          setUser(user);
          sessionStorage.setItem('user', JSON.stringify(user));
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        logout();
      }
    },
    [logout]
  );

  useEffect(() => {
    const storedToken = sessionStorage.getItem('accessToken');

    if (storedToken && !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
      loadMe(storedToken);
    }
  }, [loadMe, token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed');
        return false;
      }

      const data = await response.json();
      setToken(data.token);
      sessionStorage.setItem('accessToken', data.token);

      await loadMe(data.token);

      toast.success(`Welcome back!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login.');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
        return false;
      }

      toast.success('Account created successfully! Please log in.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred during registration.');
      return false;
    }
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
        return;
      }

      await loadMe(token);
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An unexpected error occurred while updating profile.');
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/attempts/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadMe(token);
        toast.success('Quiz result deleted');
      } else {
        toast.error('Failed to delete quiz result');
      }
    } catch (error) {
      console.error('Delete quiz error:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const addCreatedQuiz = async (quizData: NewQuiz) => {
    if (!token) return;

    try {
      const payload = {
        title: quizData.title,
        description: quizData.description,
        // Assuming topic and difficulty are part of NewQuiz if AI generated, or added during creation process
        topic: (quizData as QuizBackend).topic || 'General',
        difficulty: (quizData as QuizBackend).difficulty || 'intermediate',
        questions: quizData.questions.map((q) => ({
          questionText: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswer,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadMe(token);
        toast.success('Quiz created successfully!');
      } else {
        toast.error('Failed to create quiz');
      }
    } catch (error) {
      console.error('Add quiz error:', error);
    }
  };

  const updateQuiz = async (quizId: string, updatedQuiz: Partial<Quiz>) => {
    if (!token) return;

    try {
      const payload: {
        title?: string;
        description?: string;
        questions?: { questionText: string; options: string[]; correctAnswerIndex: number }[];
      } = {};
      if (updatedQuiz.title) payload.title = updatedQuiz.title;
      if (updatedQuiz.description) payload.description = updatedQuiz.description;
      if (updatedQuiz.questions) {
        payload.questions = updatedQuiz.questions.map((q) => ({
          questionText: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswer,
        }));
      }

      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadMe(token);
        toast.success('Quiz updated!');
      }
    } catch (error) {
      console.error('Update quiz error:', error);
    }
  };

  const deleteCreatedQuiz = async (quizId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadMe(token);
        toast.success('Quiz deleted');
      }
    } catch (error) {
      console.error('Delete created quiz error:', error);
    }
  };

  const saveQuizResult = async (result: Omit<SavedQuizResult, 'id' | 'date'>) => {
    if (!token) return;

    try {
      const payload = {
        quizId: result.quizId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        answers: result.answers.map((a) => ({
          questionId: a.questionId.toString(),
          selectedOption: a.selectedAnswer.toString(),
          isCorrect: a.isCorrect,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/api/attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadMe(token);

        const percentage = (result.score / result.totalQuestions) * 100;
        if (percentage >= 80) {
          toast.success(`Excellent! You scored ${percentage.toFixed(0)}%`);
        } else if (percentage >= 60) {
          toast.info(`Good job! You scored ${percentage.toFixed(0)}%`);
        } else {
          toast.warn(`Keep practicing! You scored ${percentage.toFixed(0)}%`);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save quiz results');
      }
    } catch (error) {
      console.error('Save quiz result error:', error);
      toast.error('An unexpected error occurred while saving results.');
    }
  };

  const toggleTheme = () => {
    if (!user) return;

    const newTheme: 'light' | 'dark' = user.settings.theme === 'light' ? 'dark' : 'light';
    const updatedSettings = { ...user.settings, theme: newTheme };
    updateProfile({ settings: updatedSettings });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // Expose token
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        deleteQuiz,
        addCreatedQuiz,
        updateQuiz,
        deleteCreatedQuiz,
        saveQuizResult,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, mapQuiz };


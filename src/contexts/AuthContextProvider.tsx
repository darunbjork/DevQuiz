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

import { apiClient } from '../services/apiClient';

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
    async () => {
      try {
        // apiClient will automatically add the Authorization header if a token is present via its getter
        const response = await apiClient.fetchWithAuth('/api/auth/me', {});

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
          logout(); // This will be called if loadMe fails, e.g., token invalid/expired
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        logout(); // Ensure logout on any error during loadMe
      }
    },
    [logout]
  );

  // Configure apiClient with auth callbacks
  useEffect(() => {
    apiClient.configureAuth(
      () => token, // Getter for current token
      setToken,    // Setter for token state
      logout       // Logout callback
    );
  }, [token, setToken, logout]); // token is included so apiClient always has the latest token

  useEffect(() => {
    const storedToken = sessionStorage.getItem('accessToken');
    if (storedToken) { // Only set if stored, don't re-set if token already exists
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
    }
  }, []); // Only runs once on mount

// New useEffect to load user data when token becomes available
  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMe();
    }
  }, [token, loadMe]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // apiClient.fetchWithAuth will not add Authorization header if token is null
      // credentials: 'include' is automatically added by apiClient
      const response = await apiClient.fetchWithAuth('/api/auth/login', {
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
      const newToken = data.token; // Correctly extract 'token'
      setToken(newToken); // Update state

      // IMMEDIATELY re-configure apiClient with the new token
      apiClient.configureAuth(
        () => newToken, // The getter returns this fresh token
        setToken,
        logout
      );

      sessionStorage.setItem('accessToken', newToken); // Store accessToken

      await loadMe(); // Now loadMe uses apiClient configured with the fresh token

      toast.success(`Welcome back!`);
      return true;
    } catch (error)
    {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login.');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // credentials: 'include' is automatically added by apiClient
      const response = await apiClient.fetchWithAuth('/api/auth/register', {
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
      const response = await apiClient.fetchWithAuth('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
        return;
      }

      await loadMe();
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An unexpected error occurred while updating profile.');
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!token) return;

    try {
      // apiClient will add Authorization header and credentials: 'include'
      const response = await apiClient.fetchWithAuth(`/api/attempts/${quizId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadMe();
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

      // apiClient will add Authorization header and credentials: 'include'
      const response = await apiClient.fetchWithAuth('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) { // Check for !response.ok after apiClient change
        const errorData = await response.json(); // Safely parse error data
        toast.error(errorData.message || 'Failed to create quiz');
      } else {
        await loadMe();
        toast.success('Quiz created successfully!');
      }
    } catch (error) {
      console.error('Add quiz error:', error);
      toast.error('An unexpected error occurred while adding quiz.'); // Added toast.error
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

      // apiClient will add Authorization header and credentials: 'include'
      const response = await apiClient.fetchWithAuth(`/api/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) { // Check for !response.ok after apiClient change
        const errorData = await response.json(); // Safely parse error data
        toast.error(errorData.message || 'Failed to update quiz');
      } else {
        await loadMe();
        toast.success('Quiz updated!');
      }
    } catch (error) {
      console.error('Update quiz error:', error);
      toast.error('An unexpected error occurred while updating quiz.'); // Added toast.error
    }
  };

  const deleteCreatedQuiz = async (quizId: string) => {
    if (!token) return;

    try {
      // apiClient will add Authorization header and credentials: 'include'
      const response = await apiClient.fetchWithAuth(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) { // Check for !response.ok after apiClient change
        const errorData = await response.json(); // Safely parse error data
        toast.error(errorData.message || 'Failed to delete quiz');
      } else {
        await loadMe();
        toast.success('Quiz deleted');
      }
    } catch (error) {
      console.error('Delete created quiz error:', error);
      toast.error('An unexpected error occurred while deleting quiz.'); // Added toast.error
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

      // apiClient will add Authorization header and credentials: 'include'
      const response = await apiClient.fetchWithAuth('/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) { // Check for !response.ok after apiClient change
        const errorData = await response.json(); // Safely parse error data
        toast.error(errorData.message || 'Failed to save quiz results');
      } else {
        await loadMe();

        const percentage = (result.score / result.totalQuestions) * 100;
        if (percentage >= 80) {
          toast.success(`Excellent! You scored ${percentage.toFixed(0)}%`);
        } else if (percentage >= 60) {
          toast.info(`Good job! You scored ${percentage.toFixed(0)}%`);
        } else {
          toast.warn(`Keep practicing! You scored ${percentage.toFixed(0)}%`);
        }
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
    // updateProfile already uses apiClient.fetchWithAuth
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

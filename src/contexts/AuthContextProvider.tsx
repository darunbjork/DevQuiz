import { createContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import type { User, NewQuiz, Quiz, SavedQuizResult, AuthContextType } from '../types';
import * as storage from '../utils/storage';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const userId = storage.getCurrentUserId();
    if (userId) {
      const foundUser = storage.findUserById(userId);
      if (foundUser) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(foundUser);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = storage.findUserByEmail(email);
    
    if (!foundUser) {
      toast.error('User not found');
      return false;
    }
    
    if (foundUser.password !== password) {
      toast.error('Invalid password');
      return false;
    }
    
    setUser(foundUser);
    setIsAuthenticated(true);
    storage.setCurrentUser(foundUser.id);
    toast.success(`Welcome back, ${foundUser.name}!`);
    return true;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const existingUser = storage.findUserByEmail(email);
    
    if (existingUser) {
      toast.error('Email already exists');
      return false;
    }

    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      quizzes: [],
      createdQuizzes: [],
      settings: { theme: 'light' }
    };
    
    storage.addUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    storage.setCurrentUser(newUser.id);
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    storage.clearCurrentUser();
    toast.success('Logged out successfully');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    storage.updateUser(user.id, updatedData);
    toast.success('Profile updated!');
  };

  const deleteQuiz = (quizId: number) => {
    if (!user) return;
    
    const updatedQuizzes = user.quizzes.filter(quiz => quiz.id !== quizId);
    const updatedUser = { ...user, quizzes: updatedQuizzes };
    setUser(updatedUser);
    storage.updateUser(user.id, { quizzes: updatedQuizzes });
    toast.success('Quiz result deleted');
  };

  const addCreatedQuiz = (quizData: NewQuiz) => {
    if (!user) return;

    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      userId: user.id,
      source: 'manual',
      questions: quizData.questions.map((q, index) => ({
        ...q,
        id: Date.now() + index
      }))
    };
    
    const updatedQuizzes = [...(user.createdQuizzes || []), newQuiz];
    const updatedUser = { ...user, createdQuizzes: updatedQuizzes };
    setUser(updatedUser);
    storage.updateUser(user.id, { createdQuizzes: updatedQuizzes });
    toast.success('Quiz created successfully!');
  };

  const updateQuiz = (quizId: number, updatedQuiz: Partial<Quiz>) => {
    if (!user) return;
    
    const updatedQuizzes = user.createdQuizzes?.map(quiz => 
      quiz.id === quizId ? { ...quiz, ...updatedQuiz } : quiz
    );
    
    const updatedUser = { ...user, createdQuizzes: updatedQuizzes };
    setUser(updatedUser);
    storage.updateUser(user.id, { createdQuizzes: updatedQuizzes });
    toast.success('Quiz updated!');
  };

  const deleteCreatedQuiz = (quizId: number) => {
    if (!user) return;
    
    const updatedQuizzes = user.createdQuizzes?.filter(quiz => quiz.id !== quizId);
    const updatedUser = { ...user, createdQuizzes: updatedQuizzes };
    setUser(updatedUser);
    storage.updateUser(user.id, { createdQuizzes: updatedQuizzes });
    toast.success('Quiz deleted');
  };

  const saveQuizResult = (result: Omit<SavedQuizResult, 'id' | 'date'>) => {
    if (!user) return;

    const newResult: SavedQuizResult = {
      ...result,
      id: Date.now(),
      date: new Date().toISOString()
    };
    
    const updatedQuizzes = [...user.quizzes, newResult];
    const updatedUser = { ...user, quizzes: updatedQuizzes };
    setUser(updatedUser);
    storage.updateUser(user.id, { quizzes: updatedQuizzes });
    
    const percentage = (result.score / result.totalQuestions) * 100;
    if (percentage >= 80) {
      toast.success(`Excellent! You scored ${percentage.toFixed(0)}%`);
    } else if (percentage >= 60) {
      toast.info(`Good job! You scored ${percentage.toFixed(0)}%`);
    } else {
      toast.warn(`Keep practicing! You scored ${percentage.toFixed(0)}%`);
    }
  };

  const toggleTheme = () => {
    if (!user) return;
    
    const newTheme: 'light' | 'dark' = user.settings.theme === 'light' ? 'dark' : 'light';
    const updatedSettings = { ...user.settings, theme: newTheme };
    updateProfile({ settings: updatedSettings });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
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
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
}

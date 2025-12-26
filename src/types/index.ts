export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; 
}

export interface NewQuiz {
  title: string;
  description: string;
  questions: Omit<QuizQuestion, 'id'>[];
}

export interface Quiz extends NewQuiz {
  id: number;
  date: string;
  userId: number;
  source: 'ai' | 'manual'; 
  noteText?: string; 
}

export interface UserAnswer {
  questionId: number;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export interface SavedQuizResult {
  id: number;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: UserAnswer[];
  date: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  quizzes: SavedQuizResult[]; 
  createdQuizzes: Quiz[];
  settings: UserSettings;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  deleteQuiz: (quizId: number) => void;
  addCreatedQuiz: (quizData: NewQuiz) => void;
  updateQuiz: (quizId: number, updatedQuiz: Partial<Quiz>) => void;
  deleteCreatedQuiz: (quizId: number) => void;
  saveQuizResult: (result: Omit<SavedQuizResult, 'id' | 'date'>) => void;
  toggleTheme: () => void;
}
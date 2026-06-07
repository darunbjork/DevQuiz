export interface QuizOptionBackend {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestionBackend {
  _id?: string;
  id?: string;
  questionText?: string;
  question?: string; 
  options: (string | QuizOptionBackend)[];
  correctAnswer?: number;
  correctAnswerIndex?: number;
}

export interface QuizBackend {
  date: string | undefined;
  topic: string;
  difficulty: string;
  _id?: string;
  id?: string;
  title: string;
  description: string;
  userId: string;
  source: 'ai';
  noteText?: string;
  createdAt?: string;
  questions: QuizQuestionBackend[];
}

export interface SavedQuizAttemptAnswerBackend {
  questionId: string;
  questionText?: string;
  selectedOption: string; 
  isCorrect: boolean;
}

export interface SavedQuizAttemptBackend {
  _id?: string;
  id?: string;
  quizId: string;
  quizTitle?: string;
  score: number;
  totalQuestions: number;
  answers: SavedQuizAttemptAnswerBackend[];
  startTime?: string;
  date?: string;
}


export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; 
}

export interface NewQuiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface Quiz extends NewQuiz {
  id: string;
  date: string;
  userId: string;
  source: 'ai'; 
  noteText?: string; 
}

export interface UserAnswer {
  questionId: string;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export interface SavedQuizResult {
  id: string;
  quizId: string;
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
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  quizzes: SavedQuizResult[]; 
  createdQuizzes: Quiz[];
  settings: UserSettings;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  addCreatedQuiz: (quizData: NewQuiz) => Promise<void>;
  updateQuiz: (quizId: string, updatedQuiz: Partial<Quiz>) => Promise<void>;
  deleteCreatedQuiz: (quizId: string) => Promise<void>;
  saveQuizResult: (result: Omit<SavedQuizResult, 'id' | 'date'>) => Promise<void>;
  toggleTheme: () => void;
}
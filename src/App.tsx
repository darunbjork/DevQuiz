import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Study from './pages/Study';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div style={{
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
        color: theme === 'dark' ? '#e5e5e5' : '#1a1a1a',
        minHeight: '100vh'
      }}>
        <Navbar />
        <ToastContainer />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/study" element={
              <ProtectedRoute>
                <Study />
              </ProtectedRoute>
            } />
            <Route path="/create-quiz" element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            } />
            <Route path="/take-quiz/:quizId" element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
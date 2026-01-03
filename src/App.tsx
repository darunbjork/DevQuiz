import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Study from './pages/Study';
import MyQuizzes from './pages/MyQuizzes';
import TakeQuiz from './pages/TakeQuiz';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
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
            <Route path="/my-quizzes" element={
              <ProtectedRoute>
                <MyQuizzes />
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
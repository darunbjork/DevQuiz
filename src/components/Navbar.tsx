import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';

function Navbar() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#6b7280',
      color: 'white'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Study AI Assistant</Link>
      
      <div>
        {!auth.isAuthenticated ? (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: 'white', marginLeft: '1rem' }}>Login</Link>
            <Link to="/signup" style={{ textDecoration: 'none', color: 'white', marginLeft: '1rem' }}>Signup</Link>
          </>
        ) : (
          <>
            <Link to="/study" style={{ textDecoration: 'none', color: 'white', marginLeft: '1rem' }}>Study</Link>
            {/* Add this line after the Study link */}
            <Link 
              to="/create-quiz" 
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                margin: '0 16px'
              }}
            >
              Create Quiz
            </Link>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'white', marginLeft: '1rem' }}>Profile</Link>
            <button onClick={auth.logout} style={{ marginLeft: '1rem' }}>Logout</button>
            <Button onClick={toggleTheme} variant="secondary" style={{ marginLeft: '1rem' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
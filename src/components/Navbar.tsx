import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import Button from "./Button";
import "./Navbar.css";

function Navbar() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar fade-in">
      <Link to="/" className="navbar-brand hover-lift">
        Study AI Assistant
      </Link>

      <div className="nav-links">
        {!auth.isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link hover-lift">
              Login
            </Link>

            <Link to="/signup" className="nav-link hover-lift">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link to="/study" className="nav-link hover-lift">
              Study
            </Link>

            <Link to="/create-quiz" className="nav-link hover-lift">
              Create Quiz
            </Link>

            <Link to="/profile" className="nav-link hover-lift">
              Profile
            </Link>

            <button onClick={auth.logout} className="logout-btn hover-lift pressable">
              Logout
            </button>

            <Button
              onClick={toggleTheme}
              variant="secondary"
              style={{
                marginLeft: "var(--space-4)",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
              }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
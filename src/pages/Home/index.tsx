import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Study AI Assistant</h1>

      <p className="home-subtext">
        Your personal AI-powered study companion
      </p>

      <div className="home-cta hover-lift">
        <p style={{ margin: 0, color: "var(--color-text)" }}>
          Start exploring your study tools
        </p>
      </div>

      {/* NEW GET STARTED BUTTON */}
      <button
        className="home-start-btn hover-lift"
        onClick={() => navigate("/study")}
      >
        Get Started →
      </button>
    </div>
  );
}

export default Home;
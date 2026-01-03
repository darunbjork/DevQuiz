import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import QuizCard from "../components/QuizCard";
import Button from "../components/Button";
import Card from "../components/Card";
import "./MyQuizzes.css";

function MyQuizzes() {
  const auth = useAuth();
  const navigate = useNavigate();
  const createdQuizzes = auth.user?.createdQuizzes || [];

  return (
    <div className="myquizzes-container fade-in">
      <div className="myquizzes-header">
        <h1 className="myquizzes-title">My Quizzes</h1>
        <p className="myquizzes-subtitle">Manage your created quizzes</p>
      </div>

      <Card className="myquizzes-card">
        <div className="history-header">
          <h3 className="history-title">My Created Quizzes</h3>
          <Button onClick={() => navigate("/study")}>Generate with AI</Button>
        </div>

        {createdQuizzes.length === 0 ? (
          <Card>
            <p className="profile-subtitle" style={{ textAlign: "center", padding: "48px 0" }}>
              You haven't created any quizzes yet. Generate one with AI!
            </p>
          </Card>
        ) : (
          <div className="quizzes-grid">
            {createdQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={auth.deleteCreatedQuiz}
                onTakeQuiz={(id) => navigate(`/take-quiz/${id}`)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default MyQuizzes;

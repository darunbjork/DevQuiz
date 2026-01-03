import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Button from "../components/Button";
import Card from "../components/Card";
import AccuracyPieChart from "../components/AccuracyPieChart";
import "./Profile.css";

function Profile() {
  const auth = useAuth();
  const [editName, setEditName] = useState(auth.user?.name || "");
  const [activeTab, setActiveTab] = useState<"history" | "analytics">(
    "history"
  );

  if (!auth.user) {
    return <div className="profile-container">Please log in to view profile</div>;
  }

  const quizHistory = auth.user.quizzes || [];
  const createdQuizzes = auth.user.createdQuizzes || [];

  const performanceData = quizHistory.slice(-10).map((quiz, index) => ({
    name: `Quiz ${index + 1}`,
    score: quiz.percentage,
    date: new Date(quiz.date).toLocaleDateString(),
  }));

  const avgScore =
    quizHistory.length > 0
      ? quizHistory.reduce((sum, q) => sum + q.percentage, 0) /
        quizHistory.length
      : 0;

  const totalQuestions = quizHistory.reduce(
    (sum, q) => sum + q.totalQuestions,
    0
  );
  const totalCorrect = quizHistory.reduce((sum, q) => sum + q.score, 0);

  return (
    <div className="profile-container fade-in">
      {/* HEADER */}
      <div className="profile-header">
        <div>
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">Welcome back, {auth.user.name}!</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <Card>
          <div className="stats-item">
            <div className="stats-number" style={{ color: "#4f46e5" }}>
              {createdQuizzes.length}
            </div>
            <p className="stats-label">Quizzes Created</p>
          </div>
        </Card>

        <Card>
          <div className="stats-item">
            <div className="stats-number" style={{ color: "#10b981" }}>
              {quizHistory.length}
            </div>
            <p className="stats-label">Quizzes Taken</p>
          </div>
        </Card>

        <Card>
          <div className="stats-item">
            <div className="stats-number" style={{ color: "#f59e0b" }}>
              {avgScore.toFixed(0)}%
            </div>
            <p className="stats-label">Average Score</p>
          </div>
        </Card>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${
            activeTab === "history" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          Quiz History
        </button>

        <button
          className={`tab-btn ${
            activeTab === "analytics" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "history" && (
        <div>
          <h3 className="history-title">Quiz History</h3>

          {quizHistory.length === 0 ? (
            <Card>
              <p className="profile-subtitle" style={{ textAlign: "center", padding: "48px 0" }}>
                No quiz attempts yet.
              </p>
            </Card>
          ) : (
            <div className="history-list">
              {quizHistory
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((result) => (
                  <Card key={result.id}>
                    <div className="history-header">
                      <div>
                        <h4 className="history-title">{result.quizTitle}</h4>
                        <p className="history-date">
                          {new Date(result.date).toLocaleDateString()} at{" "}
                          {new Date(result.date).toLocaleTimeString()}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          className="history-score"
                          style={{
                            color:
                              result.percentage >= 80
                                ? "#10b981"
                                : result.percentage >= 60
                                ? "#f59e0b"
                                : "#ef4444",
                          }}
                        >
                          {result.percentage.toFixed(0)}%
                        </div>
                        <p className="history-date">
                          {result.score}/{result.totalQuestions} correct
                        </p>
                      </div>
                    </div>

                    <div className="history-breakdown">
                      <details>
                        <summary style={{ cursor: "pointer", fontWeight: "600" }}>
                          View Details
                        </summary>

                        <div style={{ marginLeft: "16px" }}>
                          {result.answers.map((answer, index) => (
                            <div
                              key={answer.questionId}
                              className="breakdown-item"
                              style={{
                                borderLeftColor: answer.isCorrect
                                  ? "#10b981"
                                  : "#ef4444",
                                backgroundColor: answer.isCorrect
                                  ? "#d1fae5"
                                  : "#fee2e2",
                              }}
                            >
                              <p>
                                <strong>Q{index + 1}:</strong> {answer.question}
                              </p>
                              <p className="breakdown-item-text">
                                {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>

                    <Button
                      variant="danger"
                      onClick={() => auth.deleteQuiz(result.id)}
                    >
                      Delete
                    </Button>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div>
          <h3 className="history-title">Performance Analytics</h3>

          {quizHistory.length === 0 ? (
            <Card>
              <p className="profile-subtitle" style={{ textAlign: "center", padding: "48px 0" }}>
                No data yet.
              </p>
            </Card>
          ) : (
            <>
              <div className="analytics-grid">
                <Card title="Performance Over Time">
                  <div style={{ height: "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#4f46e5"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="Overall Accuracy">
                  <div style={{ height: "300px" }}>
                    <AccuracyPieChart
                      totalCorrect={totalCorrect}
                      totalQuestions={totalQuestions}
                    />
                  </div>
                </Card>
              </div>
              
              {/* Additional stats */}
              <Card title="Quick Stats">
                <div style={{ display: "flex", justifyContent: "space-around", padding: "16px 0" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "800", color: "#10b981" }}>
                      {totalCorrect}
                    </div>
                    <p className="stats-label">Total Correct</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "800", color: "#ef4444" }}>
                      {totalQuestions - totalCorrect}
                    </div>
                    <p className="stats-label">Total Incorrect</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "800", color: "#4f46e5" }}>
                      {((totalCorrect / totalQuestions) * 100).toFixed(1)}%
                    </div>
                    <p className="stats-label">Overall Accuracy</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {/* EDIT PROFILE */}
      <Card title="Edit Profile">
        <div className="edit-profile">
          <div>
            <label className="edit-label">Name</label>
            <input
              type="text"
              className="edit-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="edit-label">Email</label>
            <input
              type="email"
              className="edit-input"
              value={auth.user.email}
              disabled
            />
          </div>

          <Button onClick={() => auth.updateProfile({ name: editName })}>
            Update Name
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Profile;

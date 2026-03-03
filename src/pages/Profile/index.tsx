import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
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
import Card from "../../components/Card";
import AccuracyPieChart from "../../components/AccuracyPieChart";
import "./Profile.css";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileStatsGrid from "../../components/ProfileStatsGrid";
import ProfileTabs from "../../components/ProfileTabs";
import QuizHistoryList from "../../components/QuizHistoryList";
import EditProfileForm from "../../components/EditProfileForm";

function Profile() {
  // `useAuth()` is a React Hook. React Hooks must always be called at the
  // top level of a functional component. This ensures that the Hook
  // is called consistently every time the component renders, following
  // React's rules for Hooks.
  const auth = useAuth();
  // The `?.` (optional chaining operator) checks if `auth.user` exists (is not null or undefined).
  // If `auth.user` exists, it then tries to get `auth.user.name`.
  // If `auth.user` does NOT exist, it stops there and the whole expression becomes `undefined`,
  // preventing a potential error if `auth.user` were null or undefined.
  const [editUsername, setEditUsername] = useState(auth.user?.username || "");
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
      <ProfileHeader username={auth.user.username} />

      <ProfileStatsGrid
        quizzesCreated={createdQuizzes.length}
        quizzesTaken={quizHistory.length}
        averageScore={avgScore}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB CONTENT */}
      {activeTab === "history" && (
        <QuizHistoryList quizHistory={quizHistory} onDelete={auth.deleteQuiz} />
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

      <EditProfileForm
        editUsername={editUsername}
        setEditUsername={setEditUsername}
        userEmail={auth.user.email}
        onUpdateProfile={auth.updateProfile}
      />
    </div>
  );
}

export default Profile;

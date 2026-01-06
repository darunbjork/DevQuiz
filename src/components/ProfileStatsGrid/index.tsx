import Card from "../Card";

interface ProfileStatsGridProps {
  quizzesCreated: number;
  quizzesTaken: number;
  averageScore: number;
}

const ProfileStatsGrid = ({ quizzesCreated, quizzesTaken, averageScore }: ProfileStatsGridProps) => (
  <div className="stats-grid">
    <Card>
      <div className="stats-item">
        <div className="stats-number" style={{ color: "#4f46e5" }}>
          {quizzesCreated}
        </div>
        <p className="stats-label">Quizzes Created</p>
      </div>
    </Card>

    <Card>
      <div className="stats-item">
        <div className="stats-number" style={{ color: "#10b981" }}>
          {quizzesTaken}
        </div>
        <p className="stats-label">Quizzes Taken</p>
      </div>
    </Card>

    <Card>
      <div className="stats-item">
        <div className="stats-number" style={{ color: "#f59e0b" }}>
          {averageScore.toFixed(0)}%
        </div>
        <p className="stats-label">Average Score</p>
      </div>
    </Card>
  </div>
);

export default ProfileStatsGrid;

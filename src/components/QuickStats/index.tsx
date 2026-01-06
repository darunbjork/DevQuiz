import Card from "../Card";

interface QuickStatsProps {
  totalCorrect: number;
  totalQuestions: number;
}

const QuickStats = ({ totalCorrect, totalQuestions }: QuickStatsProps) => (
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
          {totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0}%
        </div>
        <p className="stats-label">Overall Accuracy</p>
      </div>
    </div>
  </Card>
);

export default QuickStats;

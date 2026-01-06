import Card from "../Card";
import AccuracyPieChart from "../AccuracyPieChart";
import PerformanceLineChart from "../PerformanceLineChart";
import QuickStats from "../QuickStats";
import type { SavedQuizResult } from "../../types";

interface PerformanceData {
  name: string;
  score: number;
  date: string;
}

interface AnalyticsDashboardProps {
  quizHistory: SavedQuizResult[];
  performanceData: PerformanceData[];
  totalCorrect: number;
  totalQuestions: number;
}

const AnalyticsDashboard = ({
  quizHistory,
  performanceData,
  totalCorrect,
  totalQuestions,
}: AnalyticsDashboardProps) => (
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
          <PerformanceLineChart performanceData={performanceData} />
          <Card title="Overall Accuracy">
            <div style={{ height: "300px" }}>
              <AccuracyPieChart
                totalCorrect={totalCorrect}
                totalQuestions={totalQuestions}
              />
            </div>
          </Card>
        </div>
        <QuickStats totalCorrect={totalCorrect} totalQuestions={totalQuestions} />
      </>
    )}
  </div>
);

export default AnalyticsDashboard;

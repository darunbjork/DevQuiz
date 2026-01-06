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
import Card from "../Card";

interface PerformanceData {
  name: string;
  score: number;
  date: string;
}

interface PerformanceLineChartProps {
  performanceData: PerformanceData[];
}

const PerformanceLineChart = ({ performanceData }: PerformanceLineChartProps) => (
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
);

export default PerformanceLineChart;

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AccuracyPieChartProps {
  totalCorrect: number;
  totalQuestions: number;
}

const AccuracyPieChart: React.FC<AccuracyPieChartProps> = ({ totalCorrect, totalQuestions }) => {
  const totalIncorrect = totalQuestions - totalCorrect;

  const pieData = [
    { name: 'Correct', value: totalCorrect, color: '#10b981' },
    { name: 'Incorrect', value: totalIncorrect, color: '#ef4444' }
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Total Questions Answered: {totalQuestions}
        </p>
      </div>
    </>
  );
};

export default AccuracyPieChart;

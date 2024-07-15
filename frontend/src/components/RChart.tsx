import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const shuffleArray = (array:number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const RChart: React.FC = () => {
  const originalData = [
    {
      subject: "Convergence Time",
      A: 120,
      B: 110,
      C: 70,
      fullMark: 150,
    },
    {
      subject: "Test Accuracy",
      A: 98,
      B: 130,
      C: 40,
      fullMark: 150,
    },
    {
      subject: "Training Cost",
      A: 86,
      B: 130,
      C: 70,
      fullMark: 150,
    },
    {
      subject: "Training Time",
      A: 99,
      B: 100,
      C: 20,
      fullMark: 150,
    },
    {
      subject: "param1",
      A: 85,
      B: 90,
      C: 150,
      fullMark: 150,
    },
    {
      subject: "param2",
      A: 65,
      B: 85,
      C: 120,
      fullMark: 150,
    },
  ];

  const data = originalData.map((item) => ({
    ...item,
    A: shuffleArray([item.A, item.B, item.C])[0], 
    B: shuffleArray([item.A, item.B, item.C])[1],
    C: shuffleArray([item.A, item.B, item.C])[2],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar
          name="Model 1"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Model 2"
          dataKey="B"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Radar
          name="Model 3"
          dataKey="C"
          stroke="#ff7300"
          fill="#ff7300"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RChart;


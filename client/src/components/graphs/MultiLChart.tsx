import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { colorMap } from "../../colors";
import CustomTooltip from "../../components/Tooltip";

interface Props {
  chartData: { epoch: number; [key: string]: number }[];
}

const MultiLChart: React.FC<Props> = ({ chartData }) => {
  const keys = Object.keys(chartData[0] || {}).filter((key) => key !== "epoch");

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <RechartsLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis scale="log" domain={[0.01, 0.2]} tickCount={3} />
          <Tooltip content={<CustomTooltip title="Epoch" />} />
          <Legend />
          {keys.map((key, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={key}
              stroke={colorMap[key] || "#000000"}
              dot={false}
              animationDuration={6500}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLChart;

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
  TooltipProps,
} from "recharts";
import { colorMap } from "../../colors";

interface Props {
  chartData: { epoch: number; [key: string]: number }[];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{`Epoch: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:<span className="ml-2">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MultiLChart: React.FC<Props> = ({ chartData }) => {
  const keys = Object.keys(chartData[0] || {}).filter((key) => key !== "epoch");

  return (
    <div style={{ width: "85%", height: 400 }}>
      <ResponsiveContainer>
        <RechartsLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis
            scale="log"
            domain={[0.01, 0.2]}
            tickCount={3}
          />
          <Tooltip content={<CustomTooltip />} />
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

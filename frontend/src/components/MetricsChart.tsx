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

interface Props {
  chartData: { epoch: number; Train_RMSE: number; Valid_RMSE: number }[];
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
        <p className="text-sm text-blue-400">
          Train Loss:
          <span className="ml-2">{payload[0].value}</span>
        </p>
        <p className="text-sm text-indigo-400">
          Val Loss:
          <span className="ml-2">{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const LineChart: React.FC<Props> = ({ chartData }) => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <RechartsLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis
            scale="log" // Use log scale
            domain={[0.01, 1]} // Fixed domain range for the log scale
            ticks={[0.01, 0.1, 1]} // Fixed tick values
            tickFormatter={(tick) => tick.toExponential(1)} // Format ticks in exponential notation
            tickCount={3} // Number of ticks
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Train_RMSE"
            stroke="#8884d8"
            dot={false}
            animationDuration={6500}
          />
          <Line
            type="monotone"
            dataKey="Valid_RMSE"
            stroke="#82ca9d"
            dot={false}
            animationDuration={6500}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;

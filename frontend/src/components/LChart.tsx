import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";

interface ChartData {
  Train_Loss: number[];
  Val_Loss: number[];
}

interface LChartProps {
  data: ChartData;
}

const LChart: React.FC<LChartProps> = ({ data }) => {
  const chartData = data.Train_Loss.map((value, index) => ({
    epoch: index + 1,
    Train_Loss: value,
    Val_Loss: data.Val_Loss[index],
  }));

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
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

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="epoch" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="Train_Loss"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={false}
          animationDuration={6500}
        />
        <Line
          type="monotone"
          dataKey="Val_Loss"
          stroke="#82ca9d"
          dot={false}
          animationDuration={6500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LChart;


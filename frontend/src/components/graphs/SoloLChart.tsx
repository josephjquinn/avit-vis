import React, { useEffect, useState, useRef } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  chartData: {
    epoch: number;
    Train_RMSE?: number;
    Train_NRMSE?: number;
    Train_L1?: number;
    Valid_NRMSE?: number;
    Valid_RMSE?: number;
    Valid_L1?: number;
    Dens_Valid_NRMSE?: number;
    Dens_Valid_RMSE?: number;
    Dens_Valid_L1?: number;
    PTemp_Valid_NRMSE?: number;
    PTemp_Valid_RMSE?: number;
    PTemp_Valid_L1?: number;
    UWnd_Valid_NRMSE?: number;
    UWnd_Valid_RMSE?: number;
    UWnd_Valid_L1?: number;
    WWnd_Valid_NRMSE?: number;
    WWnd_Valid_RMSE?: number;
    WWnd_Valid_L1?: number;
  }[];
  selectedVars: string[];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 text-white rounded-md">
        <p className="text-lg">{`Epoch: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            <span style={{ color: entry.color }}>{entry.name}</span>:{" "}
            {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const MetricsChart: React.FC<Props> = ({ chartData, selectedVars }) => {
  const [animatingVar, setAnimatingVar] = useState<string | null>(null);
  const [animationTriggered, setAnimationTriggered] = useState<boolean>(false);
  const previousSelectedVarRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedVars.length > 0) {
      const lastSelectedVar = selectedVars[selectedVars.length - 1];
      if (lastSelectedVar !== previousSelectedVarRef.current) {
        previousSelectedVarRef.current = lastSelectedVar;
        setAnimationTriggered(false); // Reset the animation trigger
        setTimeout(() => {
          setAnimatingVar(lastSelectedVar);
          setAnimationTriggered(true); // Trigger the animation
        }, 100); // Add a slight delay before starting animation
      }
    }
  }, [selectedVars]);

  const variables = [
    { key: "Train_RMSE", color: "#8884d8" },
    { key: "Train_NRMSE", color: "#82ca9d" },
    { key: "Train_L1", color: "#ffc658" },
    { key: "Valid_NRMSE", color: "#ff7300" },
    { key: "Valid_RMSE", color: "#00c49f" },
    { key: "Valid_L1", color: "#ffbb28" },
    { key: "Dens_Valid_NRMSE", color: "#d0ed57" },
    { key: "Dens_Valid_RMSE", color: "#a4de6c" },
    { key: "Dens_Valid_L1", color: "#82ca9d" },
    { key: "PTemp_Valid_NRMSE", color: "#8884d8" },
    { key: "PTemp_Valid_RMSE", color: "#ffc658" },
    { key: "PTemp_Valid_L1", color: "#ff7300" },
    { key: "UWnd_Valid_NRMSE", color: "#00c49f" },
    { key: "UWnd_Valid_RMSE", color: "#ffbb28" },
    { key: "UWnd_Valid_L1", color: "#d0ed57" },
    { key: "WWnd_Valid_NRMSE", color: "#a4de6c" },
    { key: "WWnd_Valid_RMSE", color: "#8884d8" },
    { key: "WWnd_Valid_L1", color: "#82ca9d" },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={chartData}>
        <XAxis dataKey="epoch" />
        <YAxis scale="log" domain={["auto", "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {variables.map(({ key, color }) =>
          selectedVars.includes(key) ? (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              dot={false}
            />
          ) : null,
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default MetricsChart;

import React, { useEffect, useState } from "react";
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
            <span style={{ color: entry.stroke }} className="font-bold">
              {entry.name}:
            </span>{" "}
            <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MetricsChart: React.FC<Props> = ({ chartData }) => {
  const [selectedVars, setSelectedVars] = useState<string[]>([
    "Train_RMSE",
    "Valid_RMSE",
  ]);
  const [previousSelectedVars, setPreviousSelectedVars] = useState<string[]>([
    "Train_RMSE",
    "Valid_RMSE",
  ]);
  const [animateNewLines, setAnimateNewLines] = useState<Set<string>>(
    new Set(),
  );

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

  useEffect(() => {
    // Determine which lines are newly selected or reselected
    const newlySelectedVars = selectedVars.filter(
      (key) => !previousSelectedVars.includes(key),
    );
    setAnimateNewLines(new Set(newlySelectedVars));

    // Update previous selected variables
    setPreviousSelectedVars(selectedVars);
  }, [selectedVars]);

  const handleButtonClick = (variableKey: string) => {
    setSelectedVars((prev) =>
      prev.includes(variableKey)
        ? prev.filter((key) => key !== variableKey)
        : [...prev, variableKey],
    );
  };

  // Debugging: log chartData and selectedVars
  console.log("Chart Data:", chartData);
  console.log("Selected Vars:", selectedVars);
  console.log("Animate New Lines:", Array.from(animateNewLines));

  return (
    <div>
      <div>
        <h3>Select Variables to Display:</h3>
        {variables.map(({ key, color }) => (
          <button
            key={key}
            onClick={() => handleButtonClick(key)}
            style={{
              backgroundColor: selectedVars.includes(key) ? color : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              margin: "4px",
              cursor: "pointer",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <RechartsLineChart data={chartData}>
          <XAxis dataKey="epoch" />
          <YAxis scale="log" domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {variables
            .filter(({ key }) => selectedVars.includes(key))
            .map(({ key, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                dot={false}
                strokeWidth={2}
                animationDuration={10000} // Animate only newly selected lines
                isAnimationActive={true} // Ensure animation is active
              />
            ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;

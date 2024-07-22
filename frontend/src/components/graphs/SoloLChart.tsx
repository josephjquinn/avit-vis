import React, { useState, useEffect } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  chartData: {
    epoch: number;
    Train_RMSE: number;
    Train_NRMSE: number;
    Train_L1: number;
    Valid_NRMSE: number;
    Valid_RMSE: number;
    Valid_L1: number;
    Dens_Valid_NRMSE: number;
    Dens_Valid_RMSE: number;
    Dens_Valid_L1: number;
    PTemp_Valid_NRMSE: number;
    PTemp_Valid_RMSE: number;
    PTemp_Valid_L1: number;
    UWnd_Valid_NRMSE: number;
    UWnd_Valid_RMSE: number;
    UWnd_Valid_L1: number;
    WWnd_Valid_NRMSE: number;
    WWnd_Valid_RMSE: number;
    WWnd_Valid_L1: number;
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedVars((prev) => [...prev, value]);
    } else {
      setSelectedVars((prev) => prev.filter((item) => item !== value));
    }
  };

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
    <div>
      <div>
        <h3>Select Variables to Display:</h3>
        {variables.map((variable) => (
          <label key={variable.key}>
            <input
              type="checkbox"
              value={variable.key}
              checked={selectedVars.includes(variable.key)}
              onChange={handleCheckboxChange}
            />
            {variable.key}
          </label>
        ))}
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <RechartsLineChart data={chartData}>
            <XAxis dataKey="epoch" />
            <YAxis scale="log" domain={["auto", "auto"]} />

            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedVars.map((variable) => (
              <Line
                key={variable}
                type="monotone"
                dataKey={variable}
                stroke={variables.find((v) => v.key === variable)?.color}
                dot={false}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;

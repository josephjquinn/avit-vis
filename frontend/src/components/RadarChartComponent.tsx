import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { NormalizationData } from "../types"; // Adjust the import path as needed

interface RadarChartComponentProps {
  dataSets: { name: string; data: NormalizationData }[]; // Array of datasets
}

// Custom Tooltip Component
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{`${label}`}</p>
        <p className="text-sm text-blue-400">
          Value:
          <span className="ml-2">{payload[0].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ dataSets }) => {
  // Convert NormalizationData to format suitable for RadarChart
  const radarData = dataSets.flatMap(({ name, data }) => [
    { subject: "Train RMSE", name, value: data.train_rmse },
    { subject: "Train NRMSE", name, value: data.train_nrmse },
    { subject: "Train L1", name, value: data.train_l1 },
    { subject: "Valid NRMSE", name, value: data.valid_nrmse },
    { subject: "Valid RMSE", name, value: data.valid_rmse },
    { subject: "Valid L1", name, value: data.valid_l1 },
    { subject: "Dens Valid NRMSE", name, value: data.dens_valid_nrmse },
    { subject: "Dens Valid RMSE", name, value: data.dens_valid_rmse },
    { subject: "Dens Valid L1", name, value: data.dens_valid_l1 },
    { subject: "PTemp Valid NRMSE", name, value: data.ptemp_valid_nrmse },
    { subject: "PTemp Valid RMSE", name, value: data.ptemp_valid_rmse },
    { subject: "PTemp Valid L1", name, value: data.ptemp_valid_l1 },
    { subject: "UWnd Valid NRMSE", name, value: data.uwnd_valid_nrmse },
    { subject: "UWnd Valid RMSE", name, value: data.uwnd_valid_rmse },
    { subject: "UWnd Valid L1", name, value: data.uwnd_valid_l1 },
    { subject: "WWnd Valid NRMSE", name, value: data.wwnd_valid_nrmse },
    { subject: "WWnd Valid RMSE", name, value: data.wwnd_valid_rmse },
    { subject: "WWnd Valid L1", name, value: data.wwnd_valid_l1 },
    { subject: "Total Training Time", name, value: data.train_time },
  ]);

  // Define a color map for different cases
  const colorMap: { [key: string]: string } = {
    "ti-64-8": "#8884d8",
    "Case2": "#82ca9d",
    "Case3": "#ffc658",
    // Add more colors as needed
  };

  // Create a radar data structure for each subject
  const radarDataFormatted = radarData.reduce((acc, curr) => {
    const existing = acc.find(d => d.subject === curr.subject);
    if (existing) {
      existing[curr.name] = curr.value;
    } else {
      acc.push({ subject: curr.subject, [curr.name]: curr.value });
    }
    return acc;
  }, [] as any[]);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ResponsiveContainer>
        <RadarChart outerRadius={200} data={radarDataFormatted}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          {dataSets.map(({ name }) => (
            <Radar
              key={name}
              name={name}
              dataKey={name}
              stroke={colorMap[name] || "#000000"}
              fill={colorMap[name] || "#000000"}
              fillOpacity={0.6}
            />
          ))}
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;

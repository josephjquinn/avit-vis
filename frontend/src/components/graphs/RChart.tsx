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
  Legend,
} from "recharts";
import { NormalizationData } from "../../types"; // Adjust the import path as needed
import { colorMap } from "../../colors"; // Adjust the import path as needed

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
    // Organize tooltip data by case
    const tooltipData = payload.reduce(
      (acc: { [key: string]: number }, item) => {
        acc[item.name] = item.value;
        return acc;
      },
      {},
    );

    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{`${label}`}</p>
        {Object.entries(tooltipData).map(([caseName, value]) => (
          <p
            key={caseName}
            className="text-sm"
            style={{ color: colorMap[caseName] }}
          >
            {caseName}:<span className="ml-2">{value.toFixed(2)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RChart: React.FC<RadarChartComponentProps> = ({ dataSets }) => {
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

  // Create a radar data structure for each subject
  const radarDataFormatted = radarData.reduce((acc, curr) => {
    const existing = acc.find((d) => d.subject === curr.subject);
    if (existing) {
      existing[curr.name] = curr.value;
    } else {
      acc.push({ subject: curr.subject, [curr.name]: curr.value });
    }
    return acc;
  }, [] as any[]);

  return (
    <div style={{ width: "100%", height: 500 }}>
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
              fillOpacity={0.3}
            />
          ))}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RChart;

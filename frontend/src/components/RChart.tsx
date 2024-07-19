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
  data: NormalizationData; // Use NormalizationData
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

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data }) => {
  // Convert NormalizationData to format suitable for RadarChart
  const radarData = [
    { subject: "Train RMSE", value: data.train_rmse },
    { subject: "Train NRMSE", value: data.train_nrmse },
    { subject: "Train L1", value: data.train_l1 },
    { subject: "Valid NRMSE", value: data.valid_nrmse },
    { subject: "Valid RMSE", value: data.valid_rmse },
    { subject: "Valid L1", value: data.valid_l1 },
    { subject: "Dens Valid NRMSE", value: data.dens_valid_nrmse },
    { subject: "Dens Valid RMSE", value: data.dens_valid_rmse },
    { subject: "Dens Valid L1", value: data.dens_valid_l1 },
    { subject: "PTemp Valid NRMSE", value: data.ptemp_valid_nrmse },
    { subject: "PTemp Valid RMSE", value: data.ptemp_valid_rmse },
    { subject: "PTemp Valid L1", value: data.ptemp_valid_l1 },
    { subject: "UWnd Valid NRMSE", value: data.uwnd_valid_nrmse },
    { subject: "UWnd Valid RMSE", value: data.uwnd_valid_rmse },
    { subject: "UWnd Valid L1", value: data.uwnd_valid_l1 },
    { subject: "WWnd Valid NRMSE", value: data.wwnd_valid_nrmse },
    { subject: "WWnd Valid RMSE", value: data.wwnd_valid_rmse },
    { subject: "WWnd Valid L1", value: data.wwnd_valid_l1 },
    { subject: "Total Training Time", value: data.train_time },
  ];

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ResponsiveContainer>
        <RadarChart outerRadius={200} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Normalization Data"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;

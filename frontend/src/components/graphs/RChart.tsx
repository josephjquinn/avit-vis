import React from "react";
import CustomTooltip from "../../components/Tooltip";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { NormalizationData } from "../../types";
import { colorMap } from "../../colors";

interface RadarChartComponentProps {
  dataSets: { name: string; data: NormalizationData }[];
}

interface RadarData {
  subject: string;
  [key: string]: number | string;
}

const RChart: React.FC<RadarChartComponentProps> = ({ dataSets }) => {
  // Provide default data if no cases are selected
  const defaultRadarData: RadarData[] = [
    { subject: "Train RMSE", "No Data": 0 },
    { subject: "Train NRMSE", "No Data": 0 },
    { subject: "Train L1", "No Data": 0 },
    { subject: "Valid NRMSE", "No Data": 0 },
    { subject: "Valid RMSE", "No Data": 0 },
    { subject: "Valid L1", "No Data": 0 },
    { subject: "Dens Valid NRMSE", "No Data": 0 },
    { subject: "Dens Valid RMSE", "No Data": 0 },
    { subject: "Dens Valid L1", "No Data": 0 },
    { subject: "PTemp Valid NRMSE", "No Data": 0 },
    { subject: "PTemp Valid RMSE", "No Data": 0 },
    { subject: "PTemp Valid L1", "No Data": 0 },
    { subject: "UWnd Valid NRMSE", "No Data": 0 },
    { subject: "UWnd Valid RMSE", "No Data": 0 },
    { subject: "UWnd Valid L1", "No Data": 0 },
    { subject: "WWnd Valid NRMSE", "No Data": 0 },
    { subject: "WWnd Valid RMSE", "No Data": 0 },
    { subject: "WWnd Valid L1", "No Data": 0 },
    { subject: "Total Training Time", "No Data": 0 },
  ];

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

  const radarDataFormatted: RadarData[] = radarData.reduce(
    (acc: RadarData[], curr) => {
      const existing = acc.find((d) => d.subject === curr.subject);
      if (existing) {
        if (curr.value !== undefined) {
          existing[curr.name] = curr.value as number;
        }
      } else {
        if (curr.value !== undefined) {
          acc.push({
            subject: curr.subject,
            [curr.name]: curr.value as number,
          });
        }
      }
      return acc;
    },
    [],
  );

  // Use default data if no radarDataFormatted is present
  const dataToDisplay =
    radarDataFormatted.length > 0 ? radarDataFormatted : defaultRadarData;

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <RadarChart outerRadius={200} data={dataToDisplay}>
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
          <Tooltip content={<CustomTooltip title="" round={2} />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RChart;

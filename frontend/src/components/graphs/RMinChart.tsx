import React from "react";
import CustomTooltip from "../Tooltip";
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
import "./Radar.css";

interface RadarChartComponentProps {
  dataSets: { name: string; data: NormalizationData }[];
}

interface RadarData {
  subject: string;
  [key: string]: number | string;
}

const MinChart: React.FC<RadarChartComponentProps> = ({ dataSets }) => {
  const defaultRadarData: RadarData[] = [
    { subject: "Train RMSE", "No Data": 0 },
    { subject: "Train NRMSE", "No Data": 0 },
    { subject: "Valid NRMSE", "No Data": 0 },
    { subject: "Valid RMSE", "No Data": 0 },
    { subject: "dens NRMSE", "No Data": 0 },
    { subject: "dens RMSE", "No Data": 0 },
    { subject: "ptmp NRMSE", "No Data": 0 },
    { subject: "ptmp RMSE", "No Data": 0 },
    { subject: "uwnd NRMSE", "No Data": 0 },
    { subject: "uwnd RMSE", "No Data": 0 },
    { subject: "wwnd NRMSE", "No Data": 0 },
    { subject: "wwnd RMSE", "No Data": 0 },
  ];

  const radarData = dataSets.flatMap(({ name, data }) => [
    { subject: "Train RMSE", name, value: data.train_rmse },
    { subject: "Train NRMSE", name, value: data.train_nrmse },
    { subject: "Valid NRMSE", name, value: data.valid_nrmse },
    { subject: "Valid RMSE", name, value: data.valid_rmse },
    { subject: "dens NRMSE", name, value: data.dens_valid_nrmse },
    { subject: "dens RMSE", name, value: data.dens_valid_rmse },
    { subject: "ptemp NRMSE", name, value: data.ptemp_valid_nrmse },
    { subject: "ptmp RMSE", name, value: data.ptemp_valid_rmse },
    { subject: "uwnd NRMSE", name, value: data.uwnd_valid_nrmse },
    { subject: "uwnd RMSE", name, value: data.uwnd_valid_rmse },
    { subject: "wwnd NRMSE", name, value: data.wwnd_valid_nrmse },
    { subject: "wwnd RMSE", name, value: data.wwnd_valid_rmse },
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

  const dataToDisplay =
    radarDataFormatted.length > 0 ? radarDataFormatted : defaultRadarData;

  return (
    <div className="radar-ch">
      <ResponsiveContainer>
        <RadarChart outerRadius="70%" data={dataToDisplay}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" orientation="outer" cx={9999990} />

          <PolarRadiusAxis angle={30} />
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

export default MinChart;

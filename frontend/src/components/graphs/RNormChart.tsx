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

interface RadarChartComponentProps {
  dataSets: { name: string; data: NormalizationData }[];
}

interface RadarData {
  subject: string;
  [key: string]: number | string;
}

const RChart: React.FC<RadarChartComponentProps> = ({ dataSets }) => {
  const defaultRadarData: RadarData[] = [
    { subject: "Train Acc", "No Data": 0 },
    { subject: "Valid Acc", "No Data": 0 },
    { subject: "Dens Valid Acc", "No Data": 0 },
    { subject: "PTemp Valid Acc", "No Data": 0 },
    { subject: "UWnd Valid Acc", "No Data": 0 },
    { subject: "WWnd Valid Acc", "No Data": 0 },
    { subject: "Node Hours", "No Data": 0 },
  ];

  const radarData = dataSets.flatMap(({ name, data }) => [
    { subject: "Train Acc", name, value: data.train_rmse },
    { subject: "Valid Acc", name, value: data.valid_rmse },
    { subject: "Dens Valid Acc", name, value: data.dens_valid_rmse },
    { subject: "PTemp Valid Acc", name, value: data.ptemp_valid_rmse },
    { subject: "UWnd Valid Acc", name, value: data.uwnd_valid_rmse },
    { subject: "WWnd Valid Acc", name, value: data.wwnd_valid_rmse },
    { subject: "Node Hours", name, value: data.node_hours },
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

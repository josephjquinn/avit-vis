import React, { useState } from "react";
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

import { ChartData } from "../types";

interface LChartProps {
  data: ChartData;
}

const MetricsChart: React.FC<LChartProps> = ({ data }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const metricGroups = {
    train: [
      { key: "train_rmse", color: "#8884d8" },
      { key: "train_nrmse", color: "#82ca9d" },
      { key: "train_l1", color: "#ff7300" },
    ],
    validation: [
      { key: "valid_nrmse", color: "#0088FE" },
      { key: "valid_rmse", color: "#00C49F" },
      { key: "valid_l1", color: "#FFBB28" },
    ],
    ptmp: [
      { key: "ptemp_valid_nrmse", color: "#DC143C" },
      { key: "ptemp_valid_rmse", color: "#FFD700" },
      { key: "ptemp_valid_l1", color: "#808080" },
    ],
    dens: [
      { key: "dens_valid_nrmse", color: "#FF8042" },
      { key: "dens_valid_rmse", color: "#008080" },
      { key: "dens_valid_l1", color: "#800080" },
    ],
    uwnd: [
      { key: "uwnd_valid_nrmse", color: "#FF69B4" },
      { key: "uwnd_valid_rmse", color: "#3CB371" },
      { key: "uwnd_valid_l1", color: "#B8860B" },
    ],
    wwnd: [
      { key: "wwnd_valid_nrmse", color: "#C71585" },
      { key: "wwnd_valid_rmse", color: "#4B0082" },
      { key: "wwnd_valid_l1", color: "#00FFFF" },
    ],
  };

  const handleToggleMetric = (metricKey: string) => {
    if (selectedMetrics.includes(metricKey)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metricKey));
    } else {
      setSelectedMetrics([...selectedMetrics, metricKey]);
    }
  };

  const chartData = data.epoch.map((epoch, index) => ({
    epoch,
    ...Object.keys(metricGroups).reduce(
      (acc, groupKey) => {
        const groupMetrics = metricGroups[groupKey];
        groupMetrics.forEach((metric) => {
          if (selectedMetrics.includes(metric.key)) {
            if (!acc[metric.key]) {
              acc[metric.key] = [];
            }
            acc[metric.key].push(data[metric.key][index]);
          }
        });
        return acc;
      },
      {} as Record<string, number[]>,
    ),
  }));

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{`Epoch: ${label}`}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm">
              {`${entry.dataKey}: `}
              <span className="ml-2">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        {Object.keys(metricGroups).map((groupKey, groupIndex) => (
          <div key={groupIndex}>
            <h3>{groupKey}</h3>
            {metricGroups[groupKey].map((metric, metricIndex) => (
              <div key={`${groupKey}-${metricIndex}`}>
                <input
                  type="checkbox"
                  id={`${groupKey}-${metric.key}`}
                  checked={selectedMetrics.includes(metric.key)}
                  onChange={() => handleToggleMetric(metric.key)}
                />
                <label
                  htmlFor={`${groupKey}-${metric.key}`}
                  style={{ color: metric.color }}
                >
                  {metric.key}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis scale="log" domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {Object.keys(metricGroups).map((groupKey, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {metricGroups[groupKey].map((metric, metricIndex) => {
                if (selectedMetrics.includes(metric.key)) {
                  return (
                    <Line
                      key={`${groupKey}-${metricIndex}`}
                      type="monotone"
                      dataKey={metric.key}
                      stroke={metric.color}
                      dot={false}
                      animationDuration={
                        selectedMetrics.length === 1 &&
                        selectedMetrics.includes(metric.key)
                          ? 650
                          : 0
                      }
                    />
                  );
                }
                return null;
              })}
            </React.Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;

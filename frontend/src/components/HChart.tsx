import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { NormalizationData } from "../types";

interface BubbleChartProps {
  data: NormalizationData;
}

const HChart
  // Prepare bubble chart data
  const bubbleData = [
    {
      x: data.train_rmse,
      y: data.valid_rmse,
      size: data.train_l1,
      name: "Train RMSE vs Valid RMSE",
    },
    {
      x: data.train_nrmse,
      y: data.valid_nrmse,
      size: data.dens_valid_l1,
      name: "Train NRMSE vs Valid NRMSE",
    },
    // Add more data points as needed
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="Metric X" />
        <YAxis type="number" dataKey="y" name="Metric Y" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Metrics Data" data={bubbleData} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default HChart;

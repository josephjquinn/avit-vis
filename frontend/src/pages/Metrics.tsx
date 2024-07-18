import React from "react";
import MetricsChart from "../components/MetricsChart";

import chartData from "../data/sample.json";

import { ChartData } from "../types";

const Metrics: React.FC = () => {
  const data: ChartData = chartData;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Metrics Chart</h1>
      </header>
      <main>
        {data.epoch.length > 0 ? (
          <MetricsChart data={data} />
        ) : (
          <p>Loading data...</p>
        )}
      </main>
    </div>
  );
};

export default Metrics;

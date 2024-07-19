import React, { useEffect, useState } from "react";
import { MetricsData, NormalizationData } from "../types";
import MetricsChart from "../components/MetricsChart";
import RChart from "../components/RChart";
import HChart from "../components/HChart";
import {
  getMetricsData,
  getCaseNames,
  getNormalizationData,
} from "../lib/services";

const Metrics: React.FC = () => {
  const [metricsDataState, setMetricsDataState] = useState<MetricsData | null>(
    null,
  );
  const [normalizationDataState, setNormalizationDataState] =
    useState<NormalizationData | null>(null); // State for normalization data
  const [error, setError] = useState<string | null>(null);
  const [caseName, setCaseName] = useState<string>("ti-64-8"); // Default case name
  const [caseNames, setCaseNames] = useState<string[]>([]);

  useEffect(() => {
    // Fetch case names on component mount
    const fetchCaseNames = () => {
      try {
        const names = getCaseNames();
        setCaseNames(names);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching case names");
        }
      }
    };

    fetchCaseNames();
  }, []);

  useEffect(() => {
    // Fetch metrics data and normalization data when caseName changes
    const fetchData = async () => {
      try {
        const metricsData = getMetricsData(caseName);
        setMetricsDataState(metricsData);

        const normalizationData = await getNormalizationData(caseName); // Fetch normalization data
        setNormalizationDataState(normalizationData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching data");
        }
      }
    };

    fetchData();
  }, [caseName]);

  const handleCaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCaseName(event.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!metricsDataState || !normalizationDataState) {
    return <div>Loading...</div>;
  }

  // Prepare data for the line chart
  const chartData = metricsDataState.epoch.map((epoch, index) => ({
    epoch,
    Train_RMSE: metricsDataState.train_rmse[index],
    Valid_RMSE: metricsDataState.valid_rmse[index],
  }));

  // Generate unique key based on chartData
  const chartKey = JSON.stringify(chartData);

  return (
    <div>
      <h2>Metrics for Case: {caseName}</h2>

      {/* Dropdown to select case name */}
      <label>Select Case Name:</label>
      <select value={caseName} onChange={handleCaseChange}>
        {caseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {/* Metrics Chart */}
      <MetricsChart key={chartKey} chartData={chartData} />

      {/* R Chart */}
      <RChart data={normalizationDataState} />
    </div>
  );
};

export default Metrics;

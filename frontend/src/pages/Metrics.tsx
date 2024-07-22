import React, { useEffect, useState } from "react";
import { MetricsData, NormalizationData } from "../types";
import MetricsChart from "../components/MetricsChart";
import SoloLchart from "../components/SoloLChart";
import RChart from "../components/RChart";
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

  const singleChartData = metricsDataState.epoch.map((epoch, index) => ({
    epoch,
    Train_RMSE: metricsDataState.train_rmse[index],
    Train_NRMSE: metricsDataState.train_nrmse[index],
    Train_L1: metricsDataState.train_l1[index],
    Valid_NRMSE: metricsDataState.valid_nrmse[index],
    Valid_RMSE: metricsDataState.valid_rmse[index],
    Valid_L1: metricsDataState.valid_l1[index],
    Dens_Valid_NRMSE: metricsDataState.dens_valid_nrmse[index],
    Dens_Valid_RMSE: metricsDataState.dens_valid_rmse[index],
    Dens_Valid_L1: metricsDataState.dens_valid_l1[index],
    PTemp_Valid_NRMSE: metricsDataState.ptemp_valid_nrmse[index],
    PTemp_Valid_RMSE: metricsDataState.ptemp_valid_rmse[index],
    PTemp_Valid_L1: metricsDataState.ptemp_valid_l1[index],
    UWnd_Valid_NRMSE: metricsDataState.uwnd_valid_nrmse[index],
    UWnd_Valid_RMSE: metricsDataState.uwnd_valid_rmse[index],
    UWnd_Valid_L1: metricsDataState.uwnd_valid_l1[index],
    WWnd_Valid_NRMSE: metricsDataState.wwnd_valid_nrmse[index],
    WWnd_Valid_RMSE: metricsDataState.wwnd_valid_rmse[index],
    WWnd_Valid_L1: metricsDataState.wwnd_valid_l1[index],
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
      <SoloLchart chartData={singleChartData} />
      <MetricsChart key={chartKey} chartData={chartData} />
      {/* R Chart */}
      <RChart data={normalizationDataState} />
    </div>
  );
};

export default Metrics;

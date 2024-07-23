import React, { useEffect, useState } from "react";
import { MetricsData, NormalizationData } from "../types";
import MetricsChart from "../components/graphs/SoloLChart";
import { getMetricsData, getCaseNames, getNormalizationData } from "../lib/services";

const Metrics: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [normalizationData, setNormalizationData] = useState<NormalizationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [caseName, setCaseName] = useState<string>("ti-64-8");
  const [caseNames, setCaseNames] = useState<string[]>([]);

  useEffect(() => {
    // Fetch case names on component mount
    const fetchCaseNames = async () => {
      try {
        const names = await getCaseNames();
        setCaseNames(names);
      } catch (err) {
        setError("An error occurred while fetching case names");
      }
    };

    fetchCaseNames();
  }, []);

  useEffect(() => {
    // Fetch metrics and normalization data when caseName changes
    const fetchData = async () => {
      try {
        const metrics = await getMetricsData(caseName);
        setMetricsData(metrics);

        const normalization = await getNormalizationData(caseName);
        setNormalizationData(normalization);
      } catch (err) {
        setError("An error occurred while fetching data");
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

  if (!metricsData || !normalizationData) {
    return <div>Loading...</div>;
  }

  // Prepare data for the line chart
  const chartData = metricsData.epoch.map((epoch, index) => ({
    epoch,
    Train_RMSE: metricsData.train_rmse[index],
    Valid_RMSE: metricsData.valid_rmse[index],
    Train_NRMSE: metricsData.train_nrmse[index],
    Train_L1: metricsData.train_l1[index],
    Valid_NRMSE: metricsData.valid_nrmse[index],
    Valid_L1: metricsData.valid_l1[index],
    Dens_Valid_NRMSE: metricsData.dens_valid_nrmse[index],
    Dens_Valid_RMSE: metricsData.dens_valid_rmse[index],
    Dens_Valid_L1: metricsData.dens_valid_l1[index],
    PTemp_Valid_NRMSE: metricsData.ptemp_valid_nrmse[index],
    PTemp_Valid_RMSE: metricsData.ptemp_valid_rmse[index],
    PTemp_Valid_L1: metricsData.ptemp_valid_l1[index],
    UWnd_Valid_NRMSE: metricsData.uwnd_valid_nrmse[index],
    UWnd_Valid_RMSE: metricsData.uwnd_valid_rmse[index],
    UWnd_Valid_L1: metricsData.uwnd_valid_l1[index],
    WWnd_Valid_NRMSE: metricsData.wwnd_valid_nrmse[index],
    WWnd_Valid_RMSE: metricsData.wwnd_valid_rmse[index],
    WWnd_Valid_L1: metricsData.wwnd_valid_l1[index],
  }));

  return (
    <div>
      <h2>Metrics for Case: {caseName}</h2>
      <label>Select Case Name:</label>
      <select value={caseName} onChange={handleCaseChange}>
        {caseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <MetricsChart chartData={chartData} />
    </div>
  );
};

export default Metrics;

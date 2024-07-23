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
  const [selectedVars, setSelectedVars] = useState<string[]>(["Train_RMSE", "Valid_RMSE"]);
  const [previousSelectedVars, setPreviousSelectedVars] = useState<string[]>(["Train_RMSE", "Valid_RMSE"]);
  const [animateNewLines, setAnimateNewLines] = useState<Set<string>>(new Set());

  const variables = [
    { key: "Train_RMSE", color: "#8884d8" },
    { key: "Train_NRMSE", color: "#82ca9d" },
    { key: "Train_L1", color: "#ffc658" },
    { key: "Valid_NRMSE", color: "#ff7300" },
    { key: "Valid_RMSE", color: "#00c49f" },
    { key: "Valid_L1", color: "#ffbb28" },
    { key: "Dens_Valid_NRMSE", color: "#d0ed57" },
    { key: "Dens_Valid_RMSE", color: "#a4de6c" },
    { key: "Dens_Valid_L1", color: "#82ca9d" },
    { key: "PTemp_Valid_NRMSE", color: "#8884d8" },
    { key: "PTemp_Valid_RMSE", color: "#ffc658" },
    { key: "PTemp_Valid_L1", color: "#ff7300" },
    { key: "UWnd_Valid_NRMSE", color: "#00c49f" },
    { key: "UWnd_Valid_RMSE", color: "#ffbb28" },
    { key: "UWnd_Valid_L1", color: "#d0ed57" },
    { key: "WWnd_Valid_NRMSE", color: "#a4de6c" },
    { key: "WWnd_Valid_RMSE", color: "#8884d8" },
    { key: "WWnd_Valid_L1", color: "#82ca9d" },
  ];

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

  useEffect(() => {
    // Determine which lines are newly selected or reselected
    const newlySelectedVars = selectedVars.filter(
      (key) => !previousSelectedVars.includes(key),
    );
    setAnimateNewLines(new Set(newlySelectedVars));

    // Update previous selected variables
    setPreviousSelectedVars(selectedVars);
  }, [selectedVars]);

  const handleCaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCaseName(event.target.value);
  };

  const handleButtonClick = (variableKey: string) => {
    setSelectedVars((prev) =>
      prev.includes(variableKey)
        ? prev.filter((key) => key !== variableKey)
        : [...prev, variableKey],
    );
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

      <div>
        <h3>Select Variables to Display:</h3>
        {variables.map(({ key, color }) => (
          <button
            key={key}
            onClick={() => handleButtonClick(key)}
            style={{
              backgroundColor: selectedVars.includes(key) ? color : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              margin: "4px",
              cursor: "pointer",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <MetricsChart chartData={chartData} selectedVars={selectedVars} animateNewLines={animateNewLines} />
    </div>
  );
};

export default Metrics;

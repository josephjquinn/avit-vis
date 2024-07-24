import React, { useEffect, useState } from "react";
import { MetricsData, NormalizationData } from "../types";
import MetricsChart from "../components/graphs/SoloLChart";
import {
  getMetricsData,
  getCaseNames,
  getNormalizationData,
} from "../lib/services";
import {
  Select,
  MenuItem,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import "./Metrics.css"; // Ensure this CSS file is included

const Metrics: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [normalizationData, setNormalizationData] =
    useState<NormalizationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [caseName, setCaseName] = useState<string>("ti-64-8");
  const [caseNames, setCaseNames] = useState<string[]>([]);
  const [selectedVars, setSelectedVars] = useState<string[]>([
    "Train_RMSE",
    "Valid_RMSE",
  ]);

  useEffect(() => {
    const fetchCaseNames = async () => {
      try {
        const names = await getCaseNames();
        setCaseNames(
          names.sort((a, b) => {
            // Extract type, batch size, and patch size from case names
            const [aType, aBatch, aPatch] = a.split("-");
            const [bType, bBatch, bPatch] = b.split("-");

            // Convert batch size and patch size to numbers for proper comparison
            const aBatchSize = parseInt(aBatch, 10);
            const aPatchSize = parseInt(aPatch, 10);
            const bBatchSize = parseInt(bBatch, 10);
            const bPatchSize = parseInt(bPatch, 10);

            // Define the order of types: ti < s < b
            const typeOrder = { ti: 0, s: 1, b: 2 };
            const aTypeOrder = typeOrder[aType];
            const bTypeOrder = typeOrder[bType];

            // Compare by type order
            if (aTypeOrder !== bTypeOrder) {
              return aTypeOrder - bTypeOrder;
            }

            // Compare by batch size if types are the same
            if (aBatchSize !== bBatchSize) {
              return aBatchSize - bBatchSize;
            }

            // Compare by patch size if types and batch sizes are the same
            return bPatchSize - aPatchSize;
          }),
        );
      } catch (err) {
        setError("An error occurred while fetching case names");
      }
    };

    fetchCaseNames();
  }, []);

  useEffect(() => {
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

  const handleCaseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCaseName(event.target.value as string);
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

  const chartData = metricsData.epoch.map((epoch, index) => ({
    epoch,
    Train_L1: metricsData.train_l1[index],
    Train_RMSE: metricsData.train_rmse[index],
    Train_NRMSE: metricsData.train_nrmse[index],
    Valid_L1: metricsData.valid_l1[index],
    Valid_RMSE: metricsData.valid_rmse[index],
    Valid_NRMSE: metricsData.valid_nrmse[index],
    Dens_Valid_L1: metricsData.dens_valid_l1[index],
    Dens_Valid_RMSE: metricsData.dens_valid_rmse[index],
    Dens_Valid_NRMSE: metricsData.dens_valid_nrmse[index],
    PTemp_Valid_L1: metricsData.ptemp_valid_l1[index],
    PTemp_Valid_RMSE: metricsData.ptemp_valid_rmse[index],
    PTemp_Valid_NRMSE: metricsData.ptemp_valid_nrmse[index],
    UWnd_Valid_L1: metricsData.uwnd_valid_l1[index],
    UWnd_Valid_RMSE: metricsData.uwnd_valid_rmse[index],
    UWnd_Valid_NRMSE: metricsData.uwnd_valid_nrmse[index],
    WWnd_Valid_L1: metricsData.wwnd_valid_l1[index],
    WWnd_Valid_RMSE: metricsData.wwnd_valid_rmse[index],
    WWnd_Valid_NRMSE: metricsData.wwnd_valid_nrmse[index],
  }));

  const categories = {
    Train: [
      { key: "Train_RMSE", color: "#8884d8" },
      { key: "Train_NRMSE", color: "#82ca9d" },
      { key: "Train_L1", color: "#ffc658" },
    ],
    Valid: [
      { key: "Valid_NRMSE", color: "#ff7300" },
      { key: "Valid_RMSE", color: "#00c49f" },
      { key: "Valid_L1", color: "#ffbb28" },
    ],
    dens: [
      { key: "Dens_Valid_NRMSE", color: "#d0ed57" },
      { key: "Dens_Valid_RMSE", color: "#a4de6c" },
      { key: "Dens_Valid_L1", color: "#82ca9d" },
    ],
    PTemp: [
      { key: "PTemp_Valid_NRMSE", color: "#8884d8" },
      { key: "PTemp_Valid_RMSE", color: "#ffc658" },
      { key: "PTemp_Valid_L1", color: "#ff7300" },
    ],
    uwnd: [
      { key: "UWnd_Valid_NRMSE", color: "#00c49f" },
      { key: "UWnd_Valid_RMSE", color: "#ffbb28" },
      { key: "UWnd_Valid_L1", color: "#d0ed57" },
    ],
    wwnd: [
      { key: "WWnd_Valid_NRMSE", color: "#a4de6c" },
      { key: "WWnd_Valid_RMSE", color: "#8884d8" },
      { key: "WWnd_Valid_L1", color: "#82ca9d" },
    ],
  };

  const calculateTrainingNodeHours = (trainingTime: number): number => {
    return trainingTime / 3600;
  };

  const trainingTimeInSeconds = metricsData.total_training_time || 0; // Assuming metricsData includes trainingTimeInMinutes
  const nodeHours = calculateTrainingNodeHours(trainingTimeInSeconds);
  return (
    <div className="metrics-page">
      <h2>Metrics for Case: {caseName}</h2>

      <FormControl margin="normal" variant="outlined">
        <InputLabel style={{ color: "#fff" }}>Select Case Name</InputLabel>
        <Select
          value={caseName}
          onChange={handleCaseChange}
          label="Select Case Name"
          sx={{
            color: "#fff",
            backgroundColor: "#333",
            "& .MuiSelect-icon": {
              color: "#fff",
            },
          }}
        >
          {caseNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText style={{ color: "#aaa" }}>
          Select a case to view its metrics.
        </FormHelperText>
      </FormControl>

      <div className="case-data">
        <h3>Training Node Hours: {nodeHours.toFixed(2)}</h3>
        <h3>Final Loss: {metricsData.final_training_acc.toFixed(4)}</h3>
      </div>
      <div className="button-container">
        {Object.keys(categories).map((category) => (
          <div key={category} className="category-group">
            <h3>{category}</h3>
            <div className="button-group">
              {categories[category].map(({ key, color }) => (
                <Button
                  key={key}
                  onClick={() => handleButtonClick(key)}
                  variant={
                    selectedVars.includes(key) ? "contained" : "outlined"
                  }
                  className={selectedVars.includes(key) ? "selected" : ""}
                  style={{
                    backgroundColor: selectedVars.includes(key)
                      ? color
                      : "transparent",
                    color: selectedVars.includes(key) ? "#fff" : color,
                  }}
                >
                  {key}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <MetricsChart chartData={chartData} selectedVars={selectedVars} />
    </div>
  );
};

export default Metrics;

import React, { useEffect, useState } from "react";
import MetricsChart from "../components/MetricsChart";
import RadarChartComponent from "../components/RadarChartComponent";
import { getMetricsData, getNormalizationData, getCaseNames } from "../lib/services";
import { NormalizationData } from "../types";

const Compare: React.FC = () => {
  const [metricsDataState, setMetricsDataState] = useState<{ [key: string]: any }>({});
  const [normalizationDataState, setNormalizationDataState] = useState<{ [key: string]: NormalizationData }>({});
  const [caseNames, setCaseNames] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseNames = async () => {
      try {
        const names = await getCaseNames();
        setCaseNames(names);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    };

    fetchCaseNames();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsData = await Promise.all(
          caseNames.map(name => getMetricsData(name))
        );
        const metricsDataMap = caseNames.reduce((map, name, index) => {
          map[name] = metricsData[index];
          return map;
        }, {} as { [key: string]: any });
        setMetricsDataState(metricsDataMap);

        const normalizationData = await Promise.all(
          caseNames.map(name => getNormalizationData(name))
        );
        const normalizationDataMap = caseNames.reduce((map, name, index) => {
          map[name] = normalizationData[index];
          return map;
        }, {} as { [key: string]: NormalizationData });
        setNormalizationDataState(normalizationDataMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    };

    if (caseNames.length > 0) {
      fetchData();
    }
  }, [caseNames]);

  const handleCheckboxChange = (caseName: string) => {
    setSelectedCases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(caseName)) {
        newSet.delete(caseName);
      } else {
        newSet.add(caseName);
      }
      return newSet;
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Prepare data for MetricsChart
  const selectedData = Array.from(selectedCases).flatMap(caseName => {
    const caseData = metricsDataState[caseName];
    if (!caseData || !Array.isArray(caseData.epoch)) return [];
    return caseData.epoch.map((epoch: number, index: number) => ({
      epoch,
      [caseName]: caseData.valid_rmse && Array.isArray(caseData.valid_rmse) ? caseData.valid_rmse[index] : 0,
    }));
  });

  // Group data by epoch and merge the values
  const chartData = selectedData.reduce((acc, data) => {
    const existing = acc.find(d => d.epoch === data.epoch);
    if (existing) {
      Object.assign(existing, data);
    } else {
      acc.push(data);
    }
    return acc;
  }, [] as { epoch: number; [key: string]: number }[]);

  // Prepare radar data
  const radarData = Array.from(selectedCases).map(caseName => ({
    name: caseName,
    data: normalizationDataState[caseName]
  }));

  return (
    <div>
      <h2>Select Cases to Compare</h2>
      <div>
        {caseNames.map(name => (
          <label key={name}>
            <input
              type="checkbox"
              checked={selectedCases.has(name)}
              onChange={() => handleCheckboxChange(name)}
            />
            {name}
          </label>
        ))}
      </div>
      {selectedCases.size > 0 && (
        <div>
          <MetricsChart chartData={chartData} />
          <RadarChartComponent dataSets={radarData} />
        </div>
      )}
    </div>
  );
};

export default Compare;

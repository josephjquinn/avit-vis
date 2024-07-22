import React, { useEffect, useState } from "react";
import MultiLChart from "../components/graphs/MultiLChart";
import RChart from "../components/graphs/RChart";
import {
  getMetricsData,
  getNormalizationData,
  getCaseNames,
} from "../lib/services";
import { NormalizationData } from "../types";

interface MetricsData {
  epoch: number[];
  valid_rmse?: number[];
}

interface MetricsDataMap {
  [key: string]: MetricsData | null;
}

const Compare: React.FC = () => {
  const [metricsDataState, setMetricsDataState] = useState<MetricsDataMap>({});
  const [normalizationDataState, setNormalizationDataState] = useState<{
    [key: string]: NormalizationData | null;
  }>({});
  const [caseNames, setCaseNames] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseNames = async () => {
      try {
        const names = getCaseNames();
        setCaseNames(names);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      }
    };

    fetchCaseNames();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsData = await Promise.all(
          caseNames.map((name) => getMetricsData(name)),
        );
        const metricsDataMap: MetricsDataMap = caseNames.reduce(
          (map, name, index) => {
            map[name] = metricsData[index] || null;
            return map;
          },
          {} as MetricsDataMap,
        );
        setMetricsDataState(metricsDataMap);

        const normalizationData = await Promise.all(
          caseNames.map((name) => getNormalizationData(name)),
        );
        const normalizationDataMap = caseNames.reduce(
          (map, name, index) => {
            map[name] = normalizationData[index] || null;
            return map;
          },
          {} as { [key: string]: NormalizationData | null },
        );
        setNormalizationDataState(normalizationDataMap);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      }
    };

    if (caseNames.length > 0) {
      fetchData();
    }
  }, [caseNames]);

  const handleCheckboxChange = (caseName: string) => {
    setSelectedCases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(caseName)) {
        newSet.delete(caseName);
      } else {
        newSet.add(caseName);
      }
      return newSet;
    });
  };

  const handleSelectTiCases = () => {
    const tiCases = caseNames.filter((name) => name.includes("ti"));
    setSelectedCases(new Set(tiCases));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const selectedData = Array.from(selectedCases).flatMap((caseName) => {
    const caseData = metricsDataState[caseName];
    if (!caseData || !Array.isArray(caseData.epoch)) return [];
    return caseData.epoch.map((epoch: number, index: number) => ({
      epoch,
      [caseName]:
        caseData.valid_rmse && Array.isArray(caseData.valid_rmse)
          ? caseData.valid_rmse[index]
          : 0,
    }));
  });

  const chartData = selectedData.reduce(
    (acc, data) => {
      const existing = acc.find((d) => d.epoch === data.epoch);
      if (existing) {
        Object.assign(existing, data);
      } else {
        acc.push(data);
      }
      return acc;
    },
    [] as { epoch: number; [key: string]: number }[],
  );
  const radarData = Array.from(selectedCases).map((caseName) => ({
    name: caseName,
    data: normalizationDataState[caseName] || ({} as NormalizationData),
  }));

  return (
    <div>
      <h2>Select Cases to Compare</h2>
      <button onClick={handleSelectTiCases} className="btn btn-primary mb-4">
        Select All "ti" Cases
      </button>
      <div>
        {caseNames.map((name) => (
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
      <div style={{ display: "flex" }}>
        <MultiLChart
          chartData={chartData.length > 0 ? chartData : [{ epoch: 0 }]}
        />
        <RChart
          dataSets={
            radarData.length > 0
              ? radarData
              : [{ name: "No Data", data: {} as NormalizationData }]
          }
        />
      </div>
    </div>
  );
};

export default Compare;

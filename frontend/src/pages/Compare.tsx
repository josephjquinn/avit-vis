import React, { useEffect, useState } from "react";
import MultiLChart from "../components/graphs/MultiLChart";
import RChart from "../components/graphs/RChart";
import {
  getMetricsData,
  getNormalizationData,
  getCaseNames,
} from "../lib/services";
import { NormalizationData } from "../types";
import './interface.css';

interface MetricsData {
  epoch: number[];
  valid_rmse?: number[];
}

interface MetricsDataMap {
  [key: string]: MetricsData | null;
}

const extractBatchSize = (caseName: string): number => {
  const match = caseName.match(/-(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
};

const sortCasesByBatchSize = (cases: string[]): string[] => {
  return cases.sort((a, b) => extractBatchSize(a) - extractBatchSize(b));
};

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

  const handleButtonClick = (caseName: string) => {
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

  const handleSelectSCases = () => {
    const sCases = caseNames.filter((name) => name.includes("s"));
    setSelectedCases(new Set(sCases));
  };

  const handleSelectBCases = () => {
    const bCases = caseNames.filter((name) => name.includes("b"));
    setSelectedCases(new Set(bCases));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tiCases = sortCasesByBatchSize(caseNames.filter(name => name.includes("ti")));
  const sCases = sortCasesByBatchSize(caseNames.filter(name => name.includes("s")));
  const bCases = sortCasesByBatchSize(caseNames.filter(name => name.includes("b")));

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

  const defaultRadarData = [{ name: "No Data", data: {} as NormalizationData }];

  return (
    <div>
      <h2>Select Cases to Compare</h2>
      <button onClick={handleSelectTiCases} className="button btn-primary mb-4">
        Select All "ti" Cases
      </button>
      <button onClick={handleSelectSCases} className="button btn-primary mb-4">
        Select All "s" Cases
      </button>
      <button onClick={handleSelectBCases} className="button btn-primary mb-4">
        Select All "b" Cases
      </button>
      <div className="button-group-container">
        <div className="button-group">
          <h3>TI Cases</h3>
          {tiCases.map(name => (
            <button
              key={name}
              onClick={() => handleButtonClick(name)}
              className={`button ${selectedCases.has(name) ? 'btn-success' : 'btn-outline-secondary'}`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="button-group">
          <h3>S Cases</h3>
          {sCases.map(name => (
            <button
              key={name}
              onClick={() => handleButtonClick(name)}
              className={`button ${selectedCases.has(name) ? 'btn-success' : 'btn-outline-secondary'}`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="button-group">
          <h3>B Cases</h3>
          {bCases.map(name => (
            <button
              key={name}
              onClick={() => handleButtonClick(name)}
              className={`button ${selectedCases.has(name) ? 'btn-success' : 'btn-outline-secondary'}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-container">
        <MultiLChart
          chartData={chartData.length > 0 ? chartData : [{ epoch: 0 }]}
        />
        <RChart
          dataSets={
            radarData.length > 0
              ? radarData
              : defaultRadarData
          }
        />
      </div>
    </div>
  );
};

export default Compare;

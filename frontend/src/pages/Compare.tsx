import React, { useEffect, useState } from "react";
import MultiLChart from "../components/graphs/MultiLChart";
import RChart from "../components/graphs/RChart";
import {
  getMetricsData,
  getNormalizationData,
  getCaseNames,
} from "../lib/services";
import { NormalizationData } from "../types";
import "./Compare.css";

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

const extractPatchSize = (caseName: string): number => {
  const match = caseName.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
};

const sortCasesByBatchAndPatchSize = (cases: string[]): string[] => {
  return cases.sort((a, b) => {
    const batchSizeComparison = extractBatchSize(a) - extractBatchSize(b);
    if (batchSizeComparison !== 0) return batchSizeComparison;
    return extractPatchSize(b) - extractPatchSize(a); // Reverse the order for patch size
  });
};

const Compare: React.FC = () => {
  const [metricsDataState, setMetricsDataState] = useState<MetricsDataMap>({});
  const [normalizationDataState, setNormalizationDataState] = useState<{
    [key: string]: NormalizationData | null;
  }>({});
  const [caseNames, setCaseNames] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroupState, setSelectedGroupState] = useState<{
    [key: string]: boolean;
  }>({
    ti: false,
    s: false,
    b: false,
  });

  // Track selected states for batch sizes and patch sizes
  const [selectedBatchSizes, setSelectedBatchSizes] = useState<Set<number>>(
    new Set(),
  );
  const [selectedPatchSizes, setSelectedPatchSizes] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const fetchCaseNames = async () => {
      try {
        const names = await getCaseNames();
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

  const handleClearAll = () => {
    // Clear all selected cases
    setSelectedCases(new Set());

    // Reset group selection states
    setSelectedGroupState(() => {
      const resetGroupState = {};
      for (const group of Object.keys(selectedGroupState)) {
        resetGroupState[group] = false;
      }
      return resetGroupState;
    });

    // Reset batch size and patch size selection states
    setSelectedBatchSizes(new Set());
    setSelectedPatchSizes(new Set());

    // Optionally reset the active group (if you have such a state)
    setActiveGroup(null);
  };
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

  const handleSelectCases = (group: string) => {
    const filteredCases = caseNames.filter((name) => name.includes(group));
    const isCurrentlySelected = selectedGroupState[group];

    setSelectedCases((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlySelected) {
        filteredCases.forEach((name) => newSet.delete(name));
      } else {
        filteredCases.forEach((name) => newSet.add(name));
      }
      return newSet;
    });

    setSelectedGroupState((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));

    // Ensure only one group is active at a time
    setActiveGroup((prev) => (prev === group ? null : group));
  };
  const handleSelectBatchSize = (batchSize: number) => {
    const filteredCases = caseNames.filter(
      (name) => extractBatchSize(name) === batchSize,
    );
    setSelectedBatchSizes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(batchSize)) {
        newSet.delete(batchSize);
      } else {
        newSet.add(batchSize);
      }
      return newSet;
    });
    setSelectedCases((prev) => {
      const newSet = new Set(prev);
      if (selectedBatchSizes.has(batchSize)) {
        filteredCases.forEach((name) => newSet.delete(name));
      } else {
        filteredCases.forEach((name) => newSet.add(name));
      }
      return newSet;
    });
  };

  const handleSelectPatchSize = (patchSize: number) => {
    const filteredCases = caseNames.filter(
      (name) => extractPatchSize(name) === patchSize,
    );
    setSelectedPatchSizes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(patchSize)) {
        newSet.delete(patchSize);
      } else {
        newSet.add(patchSize);
      }
      return newSet;
    });
    setSelectedCases((prev) => {
      const newSet = new Set(prev);
      if (selectedPatchSizes.has(patchSize)) {
        filteredCases.forEach((name) => newSet.delete(name));
      } else {
        filteredCases.forEach((name) => newSet.add(name));
      }
      return newSet;
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tiCases = sortCasesByBatchAndPatchSize(
    caseNames.filter((name) => name.includes("ti")),
  );
  const sCases = sortCasesByBatchAndPatchSize(
    caseNames.filter((name) => name.includes("s")),
  );
  const bCases = sortCasesByBatchAndPatchSize(
    caseNames.filter((name) => name.includes("b")),
  );

  const allBatchSizes = Array.from(new Set(caseNames.map(extractBatchSize)));
  const allPatchSizes = Array.from(new Set(caseNames.map(extractPatchSize)));

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
    <div className="compare-container">
      <div>
        <div className="cat-container">
          <div className="cat-box">
            <h3>Model Sizes</h3>
            <div className="cat-btns-container">
              <button
                onClick={() => handleSelectCases("ti")}
                className={`button ${activeGroup === "ti" ? "group-btn-success" : "group-btn"}`}
              >
                Ti
              </button>
              <button
                onClick={() => handleSelectCases("s")}
                className={`button ${activeGroup === "s" ? "group-btn-success" : "group-btn"}`}
              >
                S
              </button>
              <button
                onClick={() => handleSelectCases("b")}
                className={`button ${activeGroup === "b" ? "group-btn-success" : "group-btn"}`}
              >
                B
              </button>
            </div>
          </div>
          <div className="cat-box">
            <h3>Patch Sizes</h3>
            <div className="cat-btns-container">
              {allPatchSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSelectPatchSize(size)}
                  className={`button ${selectedPatchSizes.has(size) ? "group-btn-success" : "group-btn"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="cat-box">
            <h3>Batch Sizes</h3>
            <div className="cat-btns-container">
              {allBatchSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSelectBatchSize(size)}
                  className={`button ${selectedBatchSizes.has(size) ? "group-btn-success" : "group-btn"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button className="button clear-btn" onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      </div>

      <div className="button-group-wrapper">
        <div className="button-group-container">
          <div className="com-button-group">
            <h3>TI Cases</h3>
            {tiCases.map((name) => (
              <button
                key={name}
                onClick={() => handleButtonClick(name)}
                className={`button ${selectedCases.has(name) ? "case-btn-success" : "case-btn"}`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="com-button-group">
            <h3>S Cases</h3>
            {sCases.map((name) => (
              <button
                key={name}
                onClick={() => handleButtonClick(name)}
                className={`button ${selectedCases.has(name) ? "case-btn-success" : "case-btn"}`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="com-button-group">
            <h3>B Cases</h3>
            {bCases.map((name) => (
              <button
                key={name}
                onClick={() => handleButtonClick(name)}
                className={`button ${selectedCases.has(name) ? "case-btn-success" : "case-btn"}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div style={{ width: "100%" }}>
          <MultiLChart
            chartData={chartData.length > 0 ? chartData : [{ epoch: 0 }]}
          />
        </div>
        <div style={{ width: "100%" }}>
          <RChart
            dataSets={radarData.length > 0 ? radarData : defaultRadarData}
          />
        </div>
      </div>
    </div>
  );
};

export default Compare;

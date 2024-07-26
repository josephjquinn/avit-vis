import metricsData from "../../../backend/output/all_cases.json"; // Import the static JSON file
import normalizationData from "../../../backend/output/normalized.json"; // Import the static JSON file
import minData from "../../../backend/output/mins.json"; // Import the static JSON file

import { MetricsData, NormalizationData } from "../types";

type MetricsDataMap = Record<string, MetricsData>;
type NormalizationDataMap = Record<string, NormalizationData>;

export const getMetricsData = (caseName: string): MetricsData | null => {
  const data = (metricsData as MetricsDataMap)[caseName];
  if (data) {
    return data;
  } else {
    throw new Error(`No data found for case ${caseName}`);
  }
};

export const getCaseNames = (): string[] => {
  return Object.keys(metricsData as MetricsDataMap);
};
export const getNormalizationData = (
  caseName: string,
): NormalizationData | null => {
  const data = (normalizationData as NormalizationDataMap)[caseName];
  if (data) {
    return data;
  } else {
    throw new Error(`No normalization data found for case ${caseName}`);
  }
};
export const getMinData = (caseName: string): NormalizationData | null => {
  const data = (minData as NormalizationDataMap)[caseName];
  if (data) {
    return data;
  } else {
    throw new Error(`No min data found for case ${caseName}`);
  }
};

import metricsData from "../data/all_cases_data.json"; // Import the static JSON file
import normalizationData from "../../public/radar_data.json"; // Import the static JSON file

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

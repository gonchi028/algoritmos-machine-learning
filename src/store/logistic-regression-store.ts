import { create } from "zustand";
import { LogisticDataPoint, LogisticRegressionResult } from "@/lib/logistic-regression";

type LogisticPredictionPoint = {
  x: number;
  probability: number;
  predictedClass: 0 | 1;
} | null;

type LogisticRegressionStore = {
  dataPoints: LogisticDataPoint[];
  setDataPoints: (dataPoints: LogisticDataPoint[]) => void;
  addDataPoint: (point: LogisticDataPoint) => void;
  removeDataPoint: (index: number) => void;
  clearData: () => void;

  result: LogisticRegressionResult | null;
  setResult: (result: LogisticRegressionResult | null) => void;

  showSteps: boolean;
  setShowSteps: (show: boolean) => void;

  predictionPoint: LogisticPredictionPoint;
  setPredictionPoint: (point: LogisticPredictionPoint) => void;

  threshold: number;
  setThreshold: (threshold: number) => void;
};

export const useLogisticRegressionStore = create<LogisticRegressionStore>((set) => ({
  dataPoints: [],
  setDataPoints: (dataPoints) => set({ dataPoints }),
  addDataPoint: (point) =>
    set((state) => ({ dataPoints: [...state.dataPoints, point] })),
  removeDataPoint: (index) =>
    set((state) => ({
      dataPoints: state.dataPoints.filter((_, i) => i !== index),
    })),
  clearData: () => set({ dataPoints: [], result: null, predictionPoint: null }),

  result: null,
  setResult: (result) => set({ result }),

  showSteps: true,
  setShowSteps: (show) => set({ showSteps: show }),

  predictionPoint: null,
  setPredictionPoint: (point) => set({ predictionPoint: point }),

  threshold: 0.5,
  setThreshold: (threshold) => set({ threshold }),
}));

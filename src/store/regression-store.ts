import { create } from "zustand";
import { DataPoint, RegressionResult } from "@/lib/linear-regression";

type PredictionPoint = {
  x: number;
  y: number;
} | null;

type RegressionStore = {
  dataPoints: DataPoint[];
  setDataPoints: (dataPoints: DataPoint[]) => void;
  addDataPoint: (point: DataPoint) => void;
  removeDataPoint: (index: number) => void;
  clearData: () => void;
  
  result: RegressionResult | null;
  setResult: (result: RegressionResult | null) => void;
  
  showSteps: boolean;
  setShowSteps: (show: boolean) => void;
  
  predictionPoint: PredictionPoint;
  setPredictionPoint: (point: PredictionPoint) => void;
};

export const useRegressionStore = create<RegressionStore>((set) => ({
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
}));

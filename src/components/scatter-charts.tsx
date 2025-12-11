import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  ReferenceDot,
} from "recharts";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useRegressionStore } from "@/store/regression-store";
import { predictY } from "@/lib/linear-regression";
import { Decimal } from "decimal.js";

// Simple scatter plot for data visualization
export const DataScatterChart = () => {
  const { dataPoints } = useRegressionStore();

  if (dataPoints.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Diagrama de Dispersión
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        Visualización de los pares de datos (X, Y) en el plano cartesiano
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              name="X"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "X",
                position: "insideBottomRight",
                offset: -10,
                fill: "#374151",
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Y"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "Y",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-lg">
                      <p className="text-sm font-medium">
                        X: {payload[0].payload.x}
                      </p>
                      <p className="text-sm font-medium">
                        Y: {payload[0].payload.y}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Datos"
              data={dataPoints}
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth={1}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Scatter plot with regression line
export const RegressionLineChart = () => {
  const { dataPoints, result } = useRegressionStore();

  if (!result || dataPoints.length === 0) {
    return null;
  }

  // Calculate line points for the regression line
  const xValues = dataPoints.map((p) => p.x);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const padding = (maxX - minX) * 0.1;

  const lineData = [
    { x: minX - padding, y: predictY(minX - padding, result.b0, result.b1) },
    { x: maxX + padding, y: predictY(maxX + padding, result.b0, result.b1) },
  ];

  // Combine scatter data with line data for the composed chart
  const scatterData = dataPoints.map((p) => ({
    x: p.x,
    y: p.y,
    type: "scatter",
  }));

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Diagrama de Dispersión con Línea de Regresión
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        La línea roja representa la ecuación:{" "}
        <InlineMath math={`\\hat{y} = ${new Decimal(result.b1).toDecimalPlaces(4).toNumber()}x ${result.b0 >= 0 ? '+' : '-'} ${new Decimal(Math.abs(result.b0)).toDecimalPlaces(4).toNumber()}`} />
      </p>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              name="X"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[minX - padding, maxX + padding]}
              label={{
                value: "X",
                position: "insideBottomRight",
                offset: -10,
                fill: "#374151",
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Y"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "Y",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-lg">
                      <p className="text-sm font-medium">
                        X: {payload[0].payload.x}
                      </p>
                      <p className="text-sm font-medium">
                        Y: {payload[0].payload.y?.toFixed(4)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Regression Line */}
            <Line
              data={lineData}
              type="linear"
              dataKey="y"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              legendType="line"
              name="Línea de regresión"
            />
            {/* Scatter Points */}
            <Scatter
              name="Datos"
              data={scatterData}
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth={1}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span>Datos observados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-red-600"></div>
          <span>Línea de regresión</span>
        </div>
      </div>
    </div>
  );
};

// Scatter plot with regression line and prediction point
type PredictionChartProps = {
  predictionPoint: { x: number; y: number } | null;
};

export const PredictionChart = ({ predictionPoint }: PredictionChartProps) => {
  const { dataPoints, result } = useRegressionStore();

  if (!result || dataPoints.length === 0) {
    return null;
  }

  // Calculate line points for the regression line
  const xValues = dataPoints.map((p) => p.x);
  let minX = Math.min(...xValues);
  let maxX = Math.max(...xValues);

  // Extend range if prediction point is outside
  if (predictionPoint) {
    minX = Math.min(minX, predictionPoint.x);
    maxX = Math.max(maxX, predictionPoint.x);
  }

  const padding = (maxX - minX) * 0.1;

  const lineData = [
    { x: minX - padding, y: predictY(minX - padding, result.b0, result.b1) },
    { x: maxX + padding, y: predictY(maxX + padding, result.b0, result.b1) },
  ];

  const scatterData = dataPoints.map((p) => ({
    x: p.x,
    y: p.y,
    type: "scatter",
  }));

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Diagrama con Predicción
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        {predictionPoint
          ? `Punto predicho: (${predictionPoint.x}, ${predictionPoint.y.toFixed(4)})`
          : "Realiza una predicción para verla en el gráfico"}
      </p>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              name="X"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[minX - padding, maxX + padding]}
              label={{
                value: "X",
                position: "insideBottomRight",
                offset: -10,
                fill: "#374151",
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Y"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "Y",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-lg">
                      <p className="text-sm font-medium">
                        X: {payload[0].payload.x}
                      </p>
                      <p className="text-sm font-medium">
                        Y: {payload[0].payload.y?.toFixed(4)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Regression Line */}
            <Line
              data={lineData}
              type="linear"
              dataKey="y"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              legendType="line"
              name="Línea de regresión"
            />
            {/* Scatter Points */}
            <Scatter
              name="Datos"
              data={scatterData}
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth={1}
            />
            {/* Prediction Point */}
            {predictionPoint && (
              <ReferenceDot
                x={predictionPoint.x}
                y={predictionPoint.y}
                r={8}
                fill="#16a34a"
                stroke="#15803d"
                strokeWidth={2}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span>Datos observados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-red-600"></div>
          <span>Línea de regresión</span>
        </div>
        {predictionPoint && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Predicción</span>
          </div>
        )}
      </div>
    </div>
  );
};

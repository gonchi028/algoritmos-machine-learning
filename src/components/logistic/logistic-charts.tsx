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
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { useLogisticRegressionStore } from "@/store/logistic-regression-store";
import { predictProbability } from "@/lib/logistic-regression";
import { Decimal } from "decimal.js";

// Simple scatter plot for data visualization
export const LogisticDataScatterChart = () => {
  const { dataPoints } = useLogisticRegressionStore();

  if (dataPoints.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Diagrama de Dispersión
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        Visualización de los datos con clases 0 (rojo) y 1 (verde)
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
              domain={[-0.1, 1.1]}
              ticks={[0, 1]}
              label={{
                value: "Y (Clase)",
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
                        Clase: {payload[0].payload.y}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Clase 0"
              data={dataPoints.filter((p) => p.y === 0)}
              fill="#ef4444"
              stroke="#dc2626"
              strokeWidth={1}
            />
            <Scatter
              name="Clase 1"
              data={dataPoints.filter((p) => p.y === 1)}
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth={1}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Sigmoid curve with data points
export const LogisticSigmoidChart = () => {
  const { dataPoints, result, threshold } = useLogisticRegressionStore();

  if (!result || dataPoints.length === 0) {
    return null;
  }

  // Calculate X range
  const xValues = dataPoints.map((p) => p.x);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const padding = (maxX - minX) * 0.2;

  // Generate sigmoid curve points
  const sigmoidPoints: { x: number; probability: number }[] = [];
  const numPoints = 100;
  for (let i = 0; i <= numPoints; i++) {
    const x = minX - padding + (i / numPoints) * (maxX - minX + 2 * padding);
    const probability = predictProbability(x, result.b0, result.b1);
    sigmoidPoints.push({
      x: new Decimal(x).toDecimalPlaces(4).toNumber(),
      probability: new Decimal(probability).toDecimalPlaces(4).toNumber(),
    });
  }

  // Prepare data points with predicted probability
  const scatterData = dataPoints.map((p) => ({
    x: p.x,
    y: p.y,
    probability: predictProbability(p.x, result.b0, result.b1),
  }));

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Curva Sigmoide del Modelo
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        La curva púrpura representa la probabilidad predicha P(Y=1|X).
        La línea punteada indica el umbral de decisión ({threshold}).
      </p>
      <div className="h-[400px] w-full">
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
              dataKey="probability"
              name="Probabilidad"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, 1]}
              label={{
                value: "P(Y=1)",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-lg">
                      <p className="text-sm font-medium">X: {data.x}</p>
                      {data.y !== undefined && (
                        <p className="text-sm font-medium">Clase Real: {data.y}</p>
                      )}
                      <p className="text-sm font-medium">
                        P(Y=1): {new Decimal(data.probability).toDecimalPlaces(4).toNumber()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Sigmoid curve */}
            <Line
              data={sigmoidPoints}
              type="monotone"
              dataKey="probability"
              stroke="#9333ea"
              strokeWidth={3}
              dot={false}
              name="Curva Sigmoide"
            />
            {/* Threshold line */}
            <ReferenceLine
              y={threshold}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Umbral: ${threshold}`,
                position: "right",
                fill: "#f59e0b",
              }}
            />
            {/* Data points - Class 0 */}
            <Scatter
              name="Clase 0"
              data={scatterData.filter((p) => p.y === 0)}
              fill="#ef4444"
              stroke="#dc2626"
              strokeWidth={2}
            />
            {/* Data points - Class 1 */}
            <Scatter
              name="Clase 1"
              data={scatterData.filter((p) => p.y === 1)}
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Chart with prediction point
export const LogisticPredictionChart = () => {
  const { dataPoints, result, predictionPoint, threshold } =
    useLogisticRegressionStore();

  if (!result || dataPoints.length === 0 || !predictionPoint) {
    return null;
  }

  // Calculate X range including prediction point
  const xValues = dataPoints.map((p) => p.x);
  let minX = Math.min(...xValues);
  let maxX = Math.max(...xValues);

  if (predictionPoint) {
    minX = Math.min(minX, predictionPoint.x);
    maxX = Math.max(maxX, predictionPoint.x);
  }

  const padding = (maxX - minX) * 0.2;

  // Generate sigmoid curve points
  const sigmoidPoints: { x: number; probability: number }[] = [];
  const numPoints = 100;
  for (let i = 0; i <= numPoints; i++) {
    const x = minX - padding + (i / numPoints) * (maxX - minX + 2 * padding);
    const probability = predictProbability(x, result.b0, result.b1);
    sigmoidPoints.push({
      x: new Decimal(x).toDecimalPlaces(4).toNumber(),
      probability: new Decimal(probability).toDecimalPlaces(4).toNumber(),
    });
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Visualización de la Predicción
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        El punto azul muestra la predicción para X = {predictionPoint.x}
      </p>
      <div className="h-[400px] w-full">
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
            />
            <YAxis
              type="number"
              dataKey="probability"
              name="Probabilidad"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, 1]}
            />
            <Tooltip />
            {/* Sigmoid curve */}
            <Line
              data={sigmoidPoints}
              type="monotone"
              dataKey="probability"
              stroke="#9333ea"
              strokeWidth={3}
              dot={false}
            />
            {/* Threshold line */}
            <ReferenceLine
              y={threshold}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            {/* Prediction point */}
            <ReferenceDot
              x={predictionPoint.x}
              y={predictionPoint.probability}
              r={10}
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth={2}
            />
            {/* Vertical line from prediction to x-axis */}
            <ReferenceLine
              x={predictionPoint.x}
              stroke="#3b82f6"
              strokeDasharray="3 3"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import { Decimal } from "decimal.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRegressionStore } from "@/store/regression-store";
import { interpretCorrelation } from "@/lib/linear-regression";

export const RegressionResultsDisplay = () => {
  const { result, showSteps, setShowSteps } = useRegressionStore();

  if (!result) {
    return null;
  }

  const formatNumber = (num: number, decimals: number = 4) => {
    return new Decimal(num).toDecimalPlaces(decimals).toNumber();
  };

  return (
    <div className="mt-10 space-y-8">
      {/* Equation Result - Hero Section */}
      <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-6 shadow-lg">
        <h2 className="mb-2 text-center text-xl font-medium text-blue-800">
          Ecuación de Regresión Lineal
        </h2>
        <p className="text-center text-3xl font-bold text-blue-600">{result.equation}</p>
        <p className="mt-2 text-center text-sm text-blue-600">
          Donde ŷ es el valor predicho de Y para un valor dado de X
        </p>
      </div>

      {/* Toggle Steps Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          {showSteps ? "Ocultar pasos de cálculo" : "Mostrar pasos de cálculo"}
        </button>
      </div>

      {showSteps && (
        <>
          {/* Step 1: Data Table with Calculations */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 1: Tabla de Cálculos
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Para cada par de datos (Xᵢ, Yᵢ), calculamos Xᵢ², Yᵢ² y Xᵢ·Yᵢ
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  Tabla de valores calculados para la regresión lineal
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">i</TableHead>
                    <TableHead className="text-center">Xᵢ</TableHead>
                    <TableHead className="text-center">Yᵢ</TableHead>
                    <TableHead className="text-center">Xᵢ²</TableHead>
                    <TableHead className="text-center">Yᵢ²</TableHead>
                    <TableHead className="text-center">Xᵢ · Yᵢ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.steps.map((step, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">{step.xi}</TableCell>
                      <TableCell className="text-center">{step.yi}</TableCell>
                      <TableCell className="text-center">
                        {formatNumber(step.xiSquared)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(step.yiSquared)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(step.xiYi)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-gray-100 font-semibold">
                    <TableCell className="text-center">Σ</TableCell>
                    <TableCell className="text-center">{result.sumX}</TableCell>
                    <TableCell className="text-center">{result.sumY}</TableCell>
                    <TableCell className="text-center">
                      {result.sumXSquared}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.sumYSquared}
                    </TableCell>
                    <TableCell className="text-center">{result.sumXY}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>

          {/* Step 2: Summations */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 2: Sumatorias
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500">n (cantidad de datos)</p>
                <p className="text-xl font-bold">{result.n}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500">ΣX</p>
                <p className="text-xl font-bold">{result.sumX}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500">ΣY</p>
                <p className="text-xl font-bold">{result.sumY}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500">ΣX²</p>
                <p className="text-xl font-bold">{result.sumXSquared}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500">ΣY²</p>
                <p className="text-xl font-bold">{result.sumYSquared}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500">ΣXY</p>
                <p className="text-xl font-bold">{result.sumXY}</p>
              </div>
            </div>
          </div>

          {/* Step 3: Calculate Means */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 3: Medias
            </h3>
            <div className="mb-4 space-y-2 rounded-lg bg-blue-50 p-4 text-sm">
              <p>
                <strong>Media de X (x̄):</strong> ΣX / n = {result.sumX} /{" "}
                {result.n} = <strong>{result.meanX}</strong>
              </p>
              <p>
                <strong>Media de Y (ȳ):</strong> ΣY / n = {result.sumY} /{" "}
                {result.n} = <strong>{result.meanY}</strong>
              </p>
            </div>
          </div>

          {/* Step 4: Calculate Slope (b1) */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 4: Pendiente (b₁)
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-medium">Fórmula:</p>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-center font-mono">
                  b₁ = (n · ΣXY - ΣX · ΣY) / (n · ΣX² - (ΣX)²)
                </p>
              </div>
              <p className="font-medium">Sustitución:</p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-center font-mono">
                  b₁ = ({result.n} × {result.sumXY} - {result.sumX} ×{" "}
                  {result.sumY}) / ({result.n} × {result.sumXSquared} -{" "}
                  {result.sumX}²)
                </p>
              </div>
              <p className="font-medium">Numerador:</p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-center">
                  {result.n} × {result.sumXY} - {result.sumX} × {result.sumY} ={" "}
                  {formatNumber(result.n * result.sumXY)} -{" "}
                  {formatNumber(result.sumX * result.sumY)} ={" "}
                  <strong>
                    {formatNumber(
                      result.n * result.sumXY - result.sumX * result.sumY
                    )}
                  </strong>
                </p>
              </div>
              <p className="font-medium">Denominador:</p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-center">
                  {result.n} × {result.sumXSquared} - {result.sumX}² ={" "}
                  {formatNumber(result.n * result.sumXSquared)} -{" "}
                  {formatNumber(result.sumX * result.sumX)} ={" "}
                  <strong>
                    {formatNumber(
                      result.n * result.sumXSquared - result.sumX * result.sumX
                    )}
                  </strong>
                </p>
              </div>
              <p className="font-medium">Resultado:</p>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-center text-lg font-bold">
                  b₁ = {formatNumber(result.b1, 6)}
                </p>
              </div>
            </div>
          </div>

          {/* Step 5: Calculate Intercept (b0) */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 5: Intercepto (b₀)
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-medium">Fórmula:</p>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-center font-mono">b₀ = ȳ - b₁ · x̄</p>
              </div>
              <p className="font-medium">Sustitución:</p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-center">
                  b₀ = {result.meanY} - ({formatNumber(result.b1, 6)} ×{" "}
                  {result.meanX})
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-center">
                  b₀ = {result.meanY} -{" "}
                  {formatNumber(result.b1 * result.meanX, 6)}
                </p>
              </div>
              <p className="font-medium">Resultado:</p>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-center text-lg font-bold">
                  b₀ = {formatNumber(result.b0, 6)}
                </p>
              </div>
            </div>
          </div>

          {/* Step 6: Correlation Coefficient */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 6: Coeficiente de Correlación (r)
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-medium">Fórmula:</p>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-center font-mono text-xs md:text-sm">
                  r = (n · ΣXY - ΣX · ΣY) / √[(n · ΣX² - (ΣX)²) · (n · ΣY² -
                  (ΣY)²)]
                </p>
              </div>
              <p className="font-medium">Resultado:</p>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-center text-lg font-bold">
                  r = {formatNumber(result.r, 6)}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-center">
                  <strong>r² = {formatNumber(result.rSquared, 6)}</strong>
                </p>
                <p className="mt-1 text-center text-xs text-gray-600">
                  El {formatNumber(result.rSquared * 100, 2)}% de la variabilidad de Y
                  es explicada por X
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Summary Results */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Resumen de Resultados
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-gray-600">Pendiente (b₁)</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatNumber(result.b1, 6)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Por cada unidad que aumenta X, Y cambia en {formatNumber(result.b1, 4)}{" "}
              unidades
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-gray-600">Intercepto (b₀)</p>
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(result.b0, 6)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Valor de Y cuando X = 0
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-sm text-gray-600">Coeficiente de Correlación (r)</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(result.r, 6)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {interpretCorrelation(result.r)}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-gray-600">
              Coeficiente de Determinación (r²)
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {formatNumber(result.rSquared, 6)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatNumber(result.rSquared * 100, 2)}% de la varianza explicada
            </p>
          </div>
        </div>
      </div>

      {/* Final Equation */}
      <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-6">
        <h3 className="mb-2 text-center text-lg font-semibold text-gray-800">
          Ecuación Final de la Recta de Regresión
        </h3>
        <p className="text-center text-3xl font-bold text-blue-600">
          {result.equation}
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
          Esta ecuación puede usarse para predecir valores de Y a partir de
          valores de X
        </p>
      </div>
    </div>
  );
};

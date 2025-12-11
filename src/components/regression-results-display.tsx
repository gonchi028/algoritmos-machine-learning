import { Decimal } from "decimal.js";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
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
        <div className="text-center text-3xl font-bold text-blue-600">
          <BlockMath math={`\\hat{y} = ${formatNumber(result.b1, 6)}x ${result.b0 >= 0 ? '+' : '-'} ${formatNumber(Math.abs(result.b0), 6)}`} />
        </div>
        <p className="mt-2 text-center text-sm text-blue-600">
          Donde <InlineMath math="\hat{y}" /> es el valor predicho de Y para un valor dado de X
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
              Para cada par de datos <InlineMath math="(X_i, Y_i)" />, calculamos <InlineMath math="X_i^2" />, <InlineMath math="Y_i^2" /> y <InlineMath math="X_i \cdot Y_i" />
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  Tabla de valores calculados para la regresión lineal
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">i</TableHead>
                    <TableHead className="text-center"><InlineMath math="X_i" /></TableHead>
                    <TableHead className="text-center"><InlineMath math="Y_i" /></TableHead>
                    <TableHead className="text-center"><InlineMath math="X_i^2" /></TableHead>
                    <TableHead className="text-center"><InlineMath math="Y_i^2" /></TableHead>
                    <TableHead className="text-center"><InlineMath math="X_i \cdot Y_i" /></TableHead>
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
                <p className="text-sm text-gray-500"><InlineMath math="n" /> (cantidad de datos)</p>
                <p className="text-xl font-bold">{result.n}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500"><InlineMath math="\sum X" /></p>
                <p className="text-xl font-bold">{result.sumX}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500"><InlineMath math="\sum Y" /></p>
                <p className="text-xl font-bold">{result.sumY}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500"><InlineMath math="\sum X^2" /></p>
                <p className="text-xl font-bold">{result.sumXSquared}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500"><InlineMath math="\sum Y^2" /></p>
                <p className="text-xl font-bold">{result.sumYSquared}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm text-gray-500"><InlineMath math="\sum XY" /></p>
                <p className="text-xl font-bold">{result.sumXY}</p>
              </div>
            </div>
          </div>

          {/* Step 3: Calculate Means */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 3: Medias
            </h3>
            <div className="mb-4 space-y-4 rounded-lg bg-blue-50 p-4 text-sm">
              <div>
                <strong>Media de X <InlineMath math="(\bar{x})" />:</strong>{" "}
                <InlineMath math={`\\bar{x} = \\frac{\\sum X}{n} = \\frac{${result.sumX}}{${result.n}} = ${result.meanX}`} />
              </div>
              <div>
                <strong>Media de Y <InlineMath math="(\bar{y})" />:</strong>{" "}
                <InlineMath math={`\\bar{y} = \\frac{\\sum Y}{n} = \\frac{${result.sumY}}{${result.n}} = ${result.meanY}`} />
              </div>
            </div>
          </div>

          {/* Step 4: Calculate Slope (b1) */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 4: Pendiente <InlineMath math="(b_1)" />
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-medium">Fórmula:</p>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <BlockMath math="b_1 = \frac{n \cdot \sum XY - \sum X \cdot \sum Y}{n \cdot \sum X^2 - (\sum X)^2}" />
              </div>
              <p className="font-medium">Sustitución:</p>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <BlockMath math={`b_1 = \\frac{${result.n} \\times ${result.sumXY} - ${result.sumX} \\times ${result.sumY}}{${result.n} \\times ${result.sumXSquared} - ${result.sumX}^2}`} />
              </div>
              <p className="font-medium">Numerador:</p>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <InlineMath math={`${result.n} \\times ${result.sumXY} - ${result.sumX} \\times ${result.sumY} = ${formatNumber(result.n * result.sumXY)} - ${formatNumber(result.sumX * result.sumY)} = \\mathbf{${formatNumber(result.n * result.sumXY - result.sumX * result.sumY)}}`} />
              </div>
              <p className="font-medium">Denominador:</p>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <InlineMath math={`${result.n} \\times ${result.sumXSquared} - ${result.sumX}^2 = ${formatNumber(result.n * result.sumXSquared)} - ${formatNumber(result.sumX * result.sumX)} = \\mathbf{${formatNumber(result.n * result.sumXSquared - result.sumX * result.sumX)}}`} />
              </div>
              <p className="font-medium">Resultado:</p>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <BlockMath math={`b_1 = ${formatNumber(result.b1, 6)}`} />
              </div>
            </div>
          </div>

          {/* Step 5: Calculate Intercept (b0) */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 5: Intercepto <InlineMath math="(b_0)" />
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-medium">Fórmula:</p>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <BlockMath math="b_0 = \bar{y} - b_1 \cdot \bar{x}" />
              </div>
              <p className="font-medium">Sustitución:</p>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <InlineMath math={`b_0 = ${result.meanY} - (${formatNumber(result.b1, 6)} \\times ${result.meanX})`} />
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <InlineMath math={`b_0 = ${result.meanY} - ${formatNumber(result.b1 * result.meanX, 6)}`} />
              </div>
              <p className="font-medium">Resultado:</p>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <BlockMath math={`b_0 = ${formatNumber(result.b0, 6)}`} />
              </div>
            </div>
          </div>

          {/* Step 6: Correlation Coefficient */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 6: Coeficiente de Correlación <InlineMath math="(r)" />
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-medium">Fórmula:</p>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <BlockMath math="r = \frac{n \cdot \sum XY - \sum X \cdot \sum Y}{\sqrt{(n \cdot \sum X^2 - (\sum X)^2) \cdot (n \cdot \sum Y^2 - (\sum Y)^2)}}" />
              </div>
              <p className="font-medium">Resultado:</p>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <BlockMath math={`r = ${formatNumber(result.r, 6)}`} />
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <p>
                  <InlineMath math={`r^2 = ${formatNumber(result.rSquared, 6)}`} />
                </p>
                <p className="mt-1 text-xs text-gray-600">
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
            <p className="text-sm text-gray-600">Pendiente <InlineMath math="(b_1)" /></p>
            <p className="text-2xl font-bold text-blue-600">
              {formatNumber(result.b1, 6)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Por cada unidad que aumenta X, Y cambia en {formatNumber(result.b1, 4)}{" "}
              unidades
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-gray-600">Intercepto <InlineMath math="(b_0)" /></p>
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(result.b0, 6)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Valor de Y cuando X = 0
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-sm text-gray-600">Coeficiente de Correlación <InlineMath math="(r)" /></p>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(result.r, 6)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {interpretCorrelation(result.r)}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-gray-600">
              Coeficiente de Determinación <InlineMath math="(r^2)" />
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
        <div className="text-center text-3xl font-bold text-blue-600">
          <BlockMath math={`\\hat{y} = ${formatNumber(result.b1, 6)}x ${result.b0 >= 0 ? '+' : '-'} ${formatNumber(Math.abs(result.b0), 6)}`} />
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Esta ecuación puede usarse para predecir valores de Y a partir de
          valores de X
        </p>
      </div>
    </div>
  );
};

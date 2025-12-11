import { Decimal } from "decimal.js";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLogisticRegressionStore } from "@/store/logistic-regression-store";
import {
  interpretPseudoRSquared,
  interpretOddsRatio,
  calculateAccuracy,
  calculateConfusionMatrix,
} from "@/lib/logistic-regression";

export const LogisticResultsDisplay = () => {
  const { result, dataPoints, showSteps, setShowSteps, threshold } = useLogisticRegressionStore();

  if (!result) {
    return null;
  }

  const formatNumber = (num: number, decimals: number = 4) => {
    return new Decimal(num).toDecimalPlaces(decimals).toNumber();
  };

  const accuracy = calculateAccuracy(dataPoints, result.b0, result.b1, threshold);
  const confusion = calculateConfusionMatrix(dataPoints, result.b0, result.b1, threshold);

  return (
    <div className="mt-10 space-y-8">
      {/* Equation Result - Hero Section */}
      <div className="rounded-xl border-2 border-purple-500 bg-purple-50 p-6 shadow-lg">
        <h2 className="mb-2 text-center text-xl font-medium text-purple-800">
          Modelo de Regresión Logística
        </h2>
        <div className="text-center text-2xl font-bold text-purple-600">
          <BlockMath math={`P(Y=1|X) = \\frac{1}{1 + e^{-(${formatNumber(result.b0, 4)} ${result.b1 >= 0 ? '+' : '-'} ${formatNumber(Math.abs(result.b1), 4)}x)}}`} />
        </div>
        <p className="mt-2 text-center text-sm text-purple-600">
          Donde <InlineMath math="P(Y=1|X)" /> es la probabilidad de que Y sea 1 dado X
        </p>
      </div>

      {/* Toggle Steps Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="text-sm text-purple-600 underline hover:text-purple-800"
        >
          {showSteps ? "Ocultar explicación teórica" : "Mostrar explicación teórica"}
        </button>
      </div>

      {showSteps && (
        <>
          {/* Theory Section */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              ¿Qué es la Regresión Logística?
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                La regresión logística es un algoritmo de clasificación que predice la 
                probabilidad de que una observación pertenezca a una clase específica (0 o 1).
              </p>
              <p>
                A diferencia de la regresión lineal que predice valores continuos, la 
                regresión logística utiliza la <strong>función sigmoide</strong> para 
                transformar la salida a un rango entre 0 y 1.
              </p>
            </div>
          </div>

          {/* Sigmoid Function */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 1: Función Sigmoide
            </h3>
            <div className="space-y-4 text-sm">
              <p className="text-gray-600">
                La función sigmoide transforma cualquier valor real en un valor entre 0 y 1:
              </p>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <BlockMath math="\sigma(z) = \frac{1}{1 + e^{-z}}" />
              </div>
              <p className="text-gray-600">
                Donde <InlineMath math="z = b_0 + b_1 \cdot x" /> es la combinación lineal de los coeficientes.
              </p>
            </div>
          </div>

          {/* Model Equation */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 2: Ecuación del Modelo
            </h3>
            <div className="space-y-4 text-sm">
              <p className="text-gray-600">
                El modelo completo de regresión logística es:
              </p>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <BlockMath math="P(Y=1|X) = \frac{1}{1 + e^{-(b_0 + b_1 \cdot x)}}" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium"><InlineMath math="b_0" /> (Intercepto)</p>
                  <p className="text-gray-600">El logaritmo de las probabilidades cuando X = 0</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium"><InlineMath math="b_1" /> (Coeficiente)</p>
                  <p className="text-gray-600">El cambio en el logaritmo de las probabilidades por unidad de X</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Descent */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 3: Optimización (Descenso del Gradiente)
            </h3>
            <div className="space-y-4 text-sm">
              <p className="text-gray-600">
                Los coeficientes se optimizan maximizando la <strong>función de verosimilitud</strong>:
              </p>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <BlockMath math="L(b_0, b_1) = \sum_{i=1}^{n} [y_i \log(p_i) + (1-y_i) \log(1-p_i)]" />
              </div>
              <p className="text-gray-600">
                El gradiente se calcula para actualizar los coeficientes iterativamente:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <BlockMath math="b_0 := b_0 + \alpha \sum_{i=1}^{n}(y_i - p_i)" />
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <BlockMath math="b_1 := b_1 + \alpha \sum_{i=1}^{n}(y_i - p_i) \cdot x_i" />
                </div>
              </div>
              <p className="text-gray-600 text-center">
                Donde <InlineMath math="\alpha" /> es la tasa de aprendizaje
              </p>
            </div>
          </div>

          {/* Training Progress */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Paso 4: Progreso del Entrenamiento
            </h3>
            <div className="mb-4 text-sm text-gray-600">
              <p>
                Estado de convergencia:{" "}
                <span className={result.convergenceReached ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                  {result.convergenceReached ? "✓ Convergió" : "✗ No convergió (máximo de iteraciones alcanzado)"}
                </span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  Historial de iteraciones del descenso del gradiente
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Iteración</TableHead>
                    <TableHead className="text-center"><InlineMath math="b_0" /></TableHead>
                    <TableHead className="text-center"><InlineMath math="b_1" /></TableHead>
                    <TableHead className="text-center">Log-Verosimilitud</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.iterations.slice(0, 10).map((step) => (
                    <TableRow key={step.iteration}>
                      <TableCell className="text-center">{step.iteration}</TableCell>
                      <TableCell className="text-center">{formatNumber(step.b0, 6)}</TableCell>
                      <TableCell className="text-center">{formatNumber(step.b1, 6)}</TableCell>
                      <TableCell className="text-center">{formatNumber(step.logLikelihood, 4)}</TableCell>
                    </TableRow>
                  ))}
                  {result.iterations.length > 10 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        ... {result.iterations.length - 10} iteraciones más ...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Model Statistics */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Estadísticas del Modelo
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-sm text-gray-600">Intercepto <InlineMath math="(b_0)" /></p>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(result.b0, 6)}
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-gray-600">Coeficiente <InlineMath math="(b_1)" /></p>
            <p className="text-2xl font-bold text-blue-600">
              {formatNumber(result.b1, 6)}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-gray-600">Odds Ratio <InlineMath math="(e^{b_1})" /></p>
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(result.oddsRatio, 4)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {interpretOddsRatio(result.oddsRatio)}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-gray-600">Pseudo <InlineMath math="R^2" /> (McFadden)</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatNumber(result.pseudoRSquared, 4)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {interpretPseudoRSquared(result.pseudoRSquared)}
            </p>
          </div>
          <div className="rounded-lg bg-teal-50 p-4">
            <p className="text-sm text-gray-600">Precisión del Modelo</p>
            <p className="text-2xl font-bold text-teal-600">
              {formatNumber(accuracy * 100, 2)}%
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Con umbral de {threshold}
            </p>
          </div>
          <div className="rounded-lg bg-pink-50 p-4">
            <p className="text-sm text-gray-600">Log-Verosimilitud</p>
            <p className="text-2xl font-bold text-pink-600">
              {formatNumber(result.logLikelihood, 4)}
            </p>
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Matriz de Confusión
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Evaluación del modelo con umbral = {threshold}
        </p>
        <div className="flex justify-center">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-[300px]">
              <thead>
                <tr>
                  <th className="border-b border-r bg-gray-50 p-3"></th>
                  <th className="border-b border-r bg-gray-50 p-3 text-center">
                    Predicho: 0
                  </th>
                  <th className="border-b bg-gray-50 p-3 text-center">
                    Predicho: 1
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-r bg-gray-50 p-3 font-medium">
                    Real: 0
                  </td>
                  <td className="border-b border-r bg-green-100 p-3 text-center font-bold text-green-700">
                    TN: {confusion.tn}
                  </td>
                  <td className="border-b bg-red-100 p-3 text-center font-bold text-red-700">
                    FP: {confusion.fp}
                  </td>
                </tr>
                <tr>
                  <td className="border-r bg-gray-50 p-3 font-medium">
                    Real: 1
                  </td>
                  <td className="border-r bg-red-100 p-3 text-center font-bold text-red-700">
                    FN: {confusion.fn}
                  </td>
                  <td className="bg-green-100 p-3 text-center font-bold text-green-700">
                    TP: {confusion.tp}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div className="text-center">
            <p className="text-gray-500">Sensibilidad (Recall)</p>
            <p className="font-bold">
              {confusion.tp + confusion.fn > 0
                ? formatNumber(confusion.tp / (confusion.tp + confusion.fn) * 100, 1)
                : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Especificidad</p>
            <p className="font-bold">
              {confusion.tn + confusion.fp > 0
                ? formatNumber(confusion.tn / (confusion.tn + confusion.fp) * 100, 1)
                : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Precisión</p>
            <p className="font-bold">
              {confusion.tp + confusion.fp > 0
                ? formatNumber(confusion.tp / (confusion.tp + confusion.fp) * 100, 1)
                : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">F1-Score</p>
            <p className="font-bold">
              {(() => {
                const precision = confusion.tp / (confusion.tp + confusion.fp) || 0;
                const recall = confusion.tp / (confusion.tp + confusion.fn) || 0;
                const f1 = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;
                return formatNumber(f1 * 100, 1);
              })()}%
            </p>
          </div>
        </div>
      </div>

      {/* Final Equation */}
      <div className="rounded-lg border-2 border-purple-500 bg-purple-50 p-6">
        <h3 className="mb-2 text-center text-lg font-semibold text-gray-800">
          Ecuación Final del Modelo
        </h3>
        <div className="text-center text-2xl font-bold text-purple-600">
          <BlockMath math={`P(Y=1|X) = \\frac{1}{1 + e^{-(${formatNumber(result.b0, 4)} ${result.b1 >= 0 ? '+' : '-'} ${formatNumber(Math.abs(result.b1), 4)}x)}}`} />
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Esta ecuación predice la probabilidad de que Y sea 1 para cualquier valor de X
        </p>
      </div>
    </div>
  );
};

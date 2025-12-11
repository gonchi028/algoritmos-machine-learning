import { Integrantes } from "@/components";
import {
  LogisticTextAreaDataForm,
  LogisticDataDisplay,
  CalculateLogisticRegressionButton,
  LogisticResultsDisplay,
  LogisticPredictionForm,
  LogisticDataScatterChart,
  LogisticSigmoidChart,
  LogisticPredictionChart,
} from "@/components/logistic";
import { useLogisticRegressionStore } from "@/store/logistic-regression-store";

export const LogisticRegressionPage = () => {
  const { predictionPoint } = useLogisticRegressionStore();

  return (
    <main className="container mx-auto p-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-2xl font-semibold">
          Regresión Logística - Paso a Paso
        </h1>

        <div>
          <p className="mt-1 text-center text-xs font-semibold text-gray-400">
            TECNOLOGÍAS EMERGENTES - ISI - 2025
          </p>
          <div className="my-2 flex justify-center">
            <Integrantes />
          </div>
        </div>

        <div className="mt-4 mb-5 flex justify-center">
          <img src="/univalle.png" alt="logo" className="size-40" />
        </div>

        {/* Introduction */}
        <div className="mb-6 rounded-lg border bg-purple-50 p-4">
          <h2 className="mb-2 text-lg font-medium text-purple-800">
            ¿Qué es la Regresión Logística?
          </h2>
          <p className="text-sm text-gray-700">
            La regresión logística es un algoritmo de <strong>clasificación binaria</strong> que 
            predice la probabilidad de que una observación pertenezca a una de dos clases (0 o 1).
            A diferencia de la regresión lineal, utiliza la <strong>función sigmoide</strong> para 
            transformar la salida lineal en una probabilidad entre 0 y 1.
          </p>
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>Ejemplos de uso:</strong></p>
            <ul className="mt-1 list-inside list-disc">
              <li>Predecir si un estudiante aprobará o reprobará un examen</li>
              <li>Detectar si un email es spam o no</li>
              <li>Diagnosticar si un paciente tiene una enfermedad</li>
            </ul>
          </div>
        </div>

        {/* Data Input Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium text-gray-700">
            1. Ingreso de Datos
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Ingrese los pares de datos (X, Y) donde Y debe ser 0 o 1 (clasificación binaria):
          </p>
          <LogisticTextAreaDataForm />
        </div>

        {/* Data Display */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium text-gray-700">
            2. Datos Cargados
          </h2>
          <LogisticDataDisplay />
          <LogisticDataScatterChart />
        </div>

        {/* Calculate Button */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium text-gray-700">
            3. Calcular Regresión Logística
          </h2>
          <CalculateLogisticRegressionButton />
        </div>

        {/* Results */}
        <div className="mb-6">
          <LogisticResultsDisplay />
        </div>

        {/* Sigmoid Chart */}
        <div className="mb-6">
          <LogisticSigmoidChart />
        </div>

        {/* Prediction Section */}
        <div className="mb-6">
          <LogisticPredictionForm />
        </div>

        {/* Prediction Chart */}
        <div className="mb-10">
          {predictionPoint && <LogisticPredictionChart />}
        </div>
      </div>
    </main>
  );
};

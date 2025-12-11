import { TextAreaDataForm, ExcelUploadForm } from "@/components/forms";
import {
  RegressionDataDisplay,
  RegressionResultsDisplay,
  Integrantes,
  CalculateRegressionButton,
  PredictionForm,
  DataScatterChart,
  RegressionLineChart,
  PredictionChart,
} from "@/components";
import { useRegressionStore } from "@/store/regression-store";

export const LinearRegressionPage = () => {
  const { predictionPoint } = useRegressionStore();

  return (
    <main className="container mx-auto p-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-2xl font-semibold">
          Regresión Lineal - Paso a Paso
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

        {/* Data Input Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium text-gray-700">
            1. Ingreso de Datos
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Ingrese los pares de datos (X, Y) usando una de las siguientes
            opciones:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <TextAreaDataForm />
            <ExcelUploadForm />
          </div>
        </div>

        {/* Data Display */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium text-gray-700">
            2. Datos Cargados
          </h2>
          <RegressionDataDisplay />
          <DataScatterChart />
        </div>

        {/* Calculate Button */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium text-gray-700">
            3. Calcular Regresión
          </h2>
          <CalculateRegressionButton />
        </div>

        {/* Results */}
        <div className="mb-6">
          <RegressionResultsDisplay />
        </div>

        {/* Regression Line Chart */}
        <div className="mb-6">
          <RegressionLineChart />
        </div>

        {/* Prediction Section */}
        <div className="mb-6">
          <PredictionForm />
        </div>

        {/* Prediction Chart */}
        <div className="mb-10">
          <PredictionChart predictionPoint={predictionPoint} />
        </div>
      </div>
    </main>
  );
};

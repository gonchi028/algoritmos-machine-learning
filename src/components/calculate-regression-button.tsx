import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "sonner";
import { useRegressionStore } from "@/store/regression-store";
import { calculateLinearRegression } from "@/lib/linear-regression";

export const CalculateRegressionButton = () => {
  const { dataPoints, setResult } = useRegressionStore();

  const handleCalculate = () => {
    if (dataPoints.length < 2) {
      toast.error("Se necesitan al menos 2 pares de datos para calcular la regresión");
      return;
    }

    const result = calculateLinearRegression(dataPoints);

    if (!result) {
      toast.error("No se pudo calcular la regresión. Verifique los datos.");
      return;
    }

    setResult(result);
    toast.success("¡Regresión lineal calculada exitosamente!");
  };

  return (
    <div className="mt-6 flex justify-center">
      <Button
        onClick={handleCalculate}
        disabled={dataPoints.length < 2}
        size="lg"
        className="w-full sm:w-auto"
      >
        <Calculator className="mr-2 h-5 w-5" />
        Calcular Regresión Lineal
      </Button>
    </div>
  );
};

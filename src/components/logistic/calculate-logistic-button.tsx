import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useLogisticRegressionStore } from "@/store/logistic-regression-store";
import { calculateLogisticRegression } from "@/lib/logistic-regression";
import { toast } from "sonner";

export const CalculateLogisticRegressionButton = () => {
  const { dataPoints, setResult } = useLogisticRegressionStore();

  const handleCalculate = () => {
    if (dataPoints.length < 2) {
      toast.error("Necesita al menos 2 pares de datos");
      return;
    }

    const result = calculateLogisticRegression(dataPoints);

    if (result) {
      setResult(result);
      toast.success("Regresión logística calculada exitosamente");
    } else {
      toast.error("Error al calcular la regresión logística. Verifique que tenga ambas clases (0 y 1).");
    }
  };

  return (
    <Button
      onClick={handleCalculate}
      disabled={dataPoints.length < 2}
      className="w-full bg-purple-600 hover:bg-purple-700"
      size="lg"
    >
      <Calculator className="mr-2 h-5 w-5" />
      Calcular Regresión Logística
    </Button>
  );
};

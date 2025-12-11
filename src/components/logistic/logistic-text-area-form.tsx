import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLogisticRegressionStore } from "@/store/logistic-regression-store";
import { LogisticDataPoint } from "@/lib/logistic-regression";
import { toast } from "sonner";

export const LogisticTextAreaDataForm = () => {
  const [inputValue, setInputValue] = useState("");
  const { setDataPoints, setResult, setPredictionPoint } = useLogisticRegressionStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const lines = inputValue
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const parsedData: LogisticDataPoint[] = [];

      for (const line of lines) {
        // Support formats: "x,y" or "x;y" or "x y" or "x\ty"
        const parts = line.split(/[,;\s\t]+/).filter((p) => p.length > 0);

        if (parts.length >= 2) {
          const x = parseFloat(parts[0]);
          const y = parseInt(parts[1]);

          if (isNaN(x) || (y !== 0 && y !== 1)) {
            toast.error(`Formato inválido en línea: "${line}". Y debe ser 0 o 1.`);
            return;
          }

          parsedData.push({ x, y: y as 0 | 1 });
        } else {
          toast.error(`Formato inválido en línea: "${line}"`);
          return;
        }
      }

      if (parsedData.length < 2) {
        toast.error("Necesita al menos 2 pares de datos");
        return;
      }

      // Check if we have both classes
      const hasPositive = parsedData.some((p) => p.y === 1);
      const hasNegative = parsedData.some((p) => p.y === 0);
      if (!hasPositive || !hasNegative) {
        toast.error("Los datos deben incluir ambas clases (0 y 1)");
        return;
      }

      setDataPoints(parsedData);
      setResult(null);
      setPredictionPoint(null);
      toast.success(`${parsedData.length} pares de datos cargados exitosamente`);
    } catch {
      toast.error("Error al procesar los datos");
    }
  };

  const loadExampleData = () => {
    // Example: Study hours vs Pass/Fail exam
    const exampleData = `1, 0
2, 0
2.5, 0
3, 0
3.5, 0
4, 0
4.5, 1
5, 0
5.5, 1
6, 1
6.5, 1
7, 1
7.5, 1
8, 1
8.5, 1
9, 1`;
    setInputValue(exampleData);
    toast.info("Datos de ejemplo cargados: Horas de estudio vs Aprobar examen");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <div>
        <Label htmlFor="logistic-data-input" className="text-sm font-medium">
          Ingresar datos manualmente
        </Label>
        <p className="mb-2 text-xs text-gray-500">
          Formato: X, Y (donde Y debe ser 0 o 1)
        </p>
        <Textarea
          id="logistic-data-input"
          placeholder="Ejemplo:
1, 0
2, 0
3, 1
4, 1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={8}
          className="font-mono text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Cargar Datos
        </Button>
        <Button type="button" variant="outline" onClick={loadExampleData}>
          Ejemplo
        </Button>
      </div>
    </form>
  );
};

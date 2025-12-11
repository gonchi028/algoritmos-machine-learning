import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useLogisticRegressionStore } from "@/store/logistic-regression-store";

export const LogisticDataDisplay = () => {
  const { dataPoints, removeDataPoint, clearData, setResult, setPredictionPoint } =
    useLogisticRegressionStore();

  if (dataPoints.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
        <p>No hay datos cargados</p>
        <p className="text-sm">Ingrese datos usando el formulario anterior</p>
      </div>
    );
  }

  const handleClearAll = () => {
    clearData();
    setResult(null);
    setPredictionPoint(null);
  };

  const nPositive = dataPoints.filter((p) => p.y === 1).length;
  const nNegative = dataPoints.filter((p) => p.y === 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{dataPoints.length}</span> pares de datos
          <span className="ml-2 text-green-600">({nPositive} positivos)</span>
          <span className="ml-2 text-red-600">({nNegative} negativos)</span>
        </div>
        <Button variant="destructive" size="sm" onClick={handleClearAll}>
          <Trash2 className="mr-2 h-4 w-4" />
          Limpiar Todo
        </Button>
      </div>
      <div className="max-h-[300px] overflow-auto rounded-lg border">
        <Table>
          <TableCaption>Pares de datos (X, Y) cargados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead className="text-center">X (Variable Independiente)</TableHead>
              <TableHead className="text-center">Y (Clase: 0 o 1)</TableHead>
              <TableHead className="w-16 text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPoints.map((point, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{point.x}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      point.y === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {point.y}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDataPoint(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

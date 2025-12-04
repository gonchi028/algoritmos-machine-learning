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
import { useRegressionStore } from "@/store/regression-store";

export const RegressionDataDisplay = () => {
  const { dataPoints, removeDataPoint, clearData } = useRegressionStore();

  if (dataPoints.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center">
        <p className="text-gray-500">
          No hay datos cargados. Ingrese datos manualmente o cargue un archivo.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Datos cargados</h3>
        <Button variant="destructive" size="sm" onClick={clearData}>
          <Trash2 className="mr-2 h-4 w-4" />
          Limpiar datos
        </Button>
      </div>
      <Table>
        <TableCaption>
          {dataPoints.length} pares de datos (X, Y) cargados
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>X</TableHead>
            <TableHead>Y</TableHead>
            <TableHead className="w-16 text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPoints.map((point, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{point.x}</TableCell>
              <TableCell>{point.y}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDataPoint(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

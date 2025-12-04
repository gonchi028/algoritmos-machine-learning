import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { Upload, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRegressionStore } from "@/store/regression-store";
import { DataPoint } from "@/lib/linear-regression";

export const ExcelUploadForm = () => {
  const { setDataPoints } = useRegressionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (content: string): DataPoint[] => {
    const dataPoints: DataPoint[] = [];
    const lines = content.split(/\r?\n/);

    // Skip header if present (check if first line contains non-numeric values)
    let startIndex = 0;
    if (lines.length > 0) {
      const firstLine = lines[0].split(/[,;\t]/);
      if (firstLine.length >= 2) {
        const firstX = parseFloat(firstLine[0].trim());
        const firstY = parseFloat(firstLine[1].trim());
        if (isNaN(firstX) || isNaN(firstY)) {
          startIndex = 1; // Skip header
        }
      }
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "") continue;

      // Try different separators
      let parts = line.split(",");
      if (parts.length < 2) parts = line.split(";");
      if (parts.length < 2) parts = line.split("\t");

      if (parts.length >= 2) {
        const x = parseFloat(parts[0].trim());
        const y = parseFloat(parts[1].trim());

        if (!isNaN(x) && !isNaN(y)) {
          dataPoints.push({ x, y });
        }
      }
    }

    return dataPoints;
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileName = file.name.toLowerCase();
      const isCSV = fileName.endsWith(".csv");
      const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
      const isTxt = fileName.endsWith(".txt");

      if (!isCSV && !isExcel && !isTxt) {
        toast.error("Por favor seleccione un archivo .csv, .xlsx, .xls o .txt");
        return;
      }

      try {
        if (isCSV || isTxt) {
          // Handle CSV/TXT files
          const content = await file.text();
          const dataPoints = parseCSV(content);

          if (dataPoints.length < 2) {
            toast.error("El archivo debe contener al menos 2 pares de datos");
            return;
          }

          setDataPoints(dataPoints);
          toast.success(
            `${dataPoints.length} pares de datos cargados desde ${file.name}`
          );
        } else if (isExcel) {
          // For Excel files, we'll need to use a library like xlsx
          // For now, let's provide a simple CSV parser and show a message
          toast.info(
            "Para archivos Excel, por favor guárdelo como CSV primero, o use el área de texto para ingresar los datos manualmente."
          );
          
          // Alternative: Read Excel using FileReader and basic parsing
          // This is a simplified approach that works for simple Excel files
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = e.target?.result;
              if (typeof data === "string") {
                const dataPoints = parseCSV(data);
                if (dataPoints.length >= 2) {
                  setDataPoints(dataPoints);
                  toast.success(
                    `${dataPoints.length} pares de datos cargados desde ${file.name}`
                  );
                }
              }
            } catch {
              toast.error(
                "No se pudo leer el archivo Excel. Por favor guárdelo como CSV."
              );
            }
          };
          reader.readAsText(file);
        }
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Error al leer el archivo");
      }

      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setDataPoints]
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-medium">Cargar desde archivo</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-gray-400">
          <div className="text-center">
            <FileSpreadsheet className="mx-auto mb-2 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-sm text-gray-600">
              Suba un archivo CSV o TXT con los datos
            </p>
            <p className="text-xs text-gray-400">
              El archivo debe tener dos columnas: X e Y
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          Seleccionar archivo
        </Button>
        <p className="text-center text-xs text-gray-500">
          Formatos soportados: .csv, .txt (con separadores: coma, punto y coma, o tabulación)
        </p>
      </div>
    </div>
  );
};

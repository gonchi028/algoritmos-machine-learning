import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegressionStore } from "@/store/regression-store";
import { DataPoint } from "@/lib/linear-regression";

const formSchema = z.object({
  separador: z.enum([",", ";", "|", " ", "\t"]),
  data: z.string().min(1, { message: "Los datos son requeridos" }),
});

export const TextAreaDataForm = () => {
  const { setDataPoints } = useRegressionStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      separador: ",",
      data: `1, 2
2, 4
3, 5
4, 4
5, 5
6, 7
7, 8
8, 9
9, 10
10, 11`,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { separador, data } = values;
    const dataPoints: DataPoint[] = [];

    // Split by newlines to get each pair
    const lines = data.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === "") continue;

      // Split each line by the separator
      const parts = trimmedLine.split(separador);

      if (parts.length >= 2) {
        const x = parseFloat(parts[0].trim());
        const y = parseFloat(parts[1].trim());

        if (!isNaN(x) && !isNaN(y)) {
          dataPoints.push({ x, y });
        }
      }
    }

    if (dataPoints.length < 2) {
      toast.error("Se necesitan al menos 2 pares de datos (X, Y)");
      return;
    }

    setDataPoints(dataPoints);
    toast.success(`${dataPoints.length} pares de datos cargados correctamente`);
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-medium">Ingresar datos manualmente</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="separador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Separador de columnas</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Seleccione un separador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value=",">Coma ","</SelectItem>
                    <SelectItem value=";">Punto y coma ";"</SelectItem>
                    <SelectItem value="|">Barra vertical "|"</SelectItem>
                    <SelectItem value=" ">Espacio " "</SelectItem>
                    <SelectItem value={"\t"}>Tabulación</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  El separador entre los valores X e Y en cada línea.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datos (X, Y)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese sus datos, un par por línea"
                    className="min-h-[200px] font-mono"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese los pares de datos (X, Y), uno por línea. Ejemplo:
                  <br />
                  <code className="text-xs">1, 2</code>
                  <br />
                  <code className="text-xs">2, 4</code>
                  <br />
                  <code className="text-xs">3, 5</code>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button className="w-full sm:w-auto" type="submit">
              Cargar datos
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

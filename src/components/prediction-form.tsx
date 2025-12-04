import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calculator } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { useRegressionStore } from "@/store/regression-store";
import { predictY } from "@/lib/linear-regression";
import { Decimal } from "decimal.js";

const formSchema = z.object({
  xValue: z.string().refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
    message: "Ingrese un valor numérico válido",
  }),
});

export const PredictionForm = () => {
  const { result, predictionPoint, setPredictionPoint } = useRegressionStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      xValue: "",
    },
  });

  if (!result) {
    return null;
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const x = parseFloat(values.xValue);
    const y = predictY(x, result.b0, result.b1);
    setPredictionPoint({ x, y });
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Predicción de Valores
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        Usa la ecuación de regresión para predecir el valor de Y dado un valor de X
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="xValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor de X</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Ingrese un valor de X"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese el valor de X para el cual desea predecir Y
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full sm:w-auto">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Predicción
          </Button>
        </form>
      </Form>

      {predictionPoint && (
        <div className="mt-6 rounded-lg border-2 border-green-500 bg-green-50 p-4">
          <h4 className="mb-2 text-center font-medium text-green-800">
            Resultado de la Predicción
          </h4>
          <div className="space-y-2 text-center">
            <p className="text-sm text-green-700">
              Para <strong>X = {predictionPoint.x}</strong>
            </p>
            <p className="text-sm text-green-700">
              Usando la ecuación: <strong>{result.equation}</strong>
            </p>
            <p className="text-sm text-green-700">
              ŷ = {new Decimal(result.b1).toDecimalPlaces(4).toNumber()} × {predictionPoint.x}{" "}
              {result.b0 >= 0 ? "+" : "-"}{" "}
              {Math.abs(new Decimal(result.b0).toDecimalPlaces(4).toNumber())}
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              ŷ = {new Decimal(predictionPoint.y).toDecimalPlaces(4).toNumber()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

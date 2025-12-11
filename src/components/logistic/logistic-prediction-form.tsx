import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calculator } from "lucide-react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

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
import { useLogisticRegressionStore } from "@/store/logistic-regression-store";
import { predictProbability, predictClass } from "@/lib/logistic-regression";
import { Decimal } from "decimal.js";

const formSchema = z.object({
  xValue: z.string().refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
    message: "Ingrese un valor numérico válido",
  }),
});

export const LogisticPredictionForm = () => {
  const { result, predictionPoint, setPredictionPoint, threshold } =
    useLogisticRegressionStore();

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
    const probability = predictProbability(x, result.b0, result.b1);
    const predictedClass = predictClass(x, result.b0, result.b1, threshold);
    setPredictionPoint({ x, probability, predictedClass });
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Predicción de Probabilidad
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        Usa el modelo de regresión logística para predecir la probabilidad de Y=1 dado un valor de X
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
                  Ingrese el valor de X para el cual desea predecir la probabilidad
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 sm:w-auto">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Predicción
          </Button>
        </form>
      </Form>

      {predictionPoint && (
        <div className="mt-6 rounded-lg border-2 border-purple-500 bg-purple-50 p-4">
          <h4 className="mb-2 text-center font-medium text-purple-800">
            Resultado de la Predicción
          </h4>
          <div className="space-y-2 text-center">
            <p className="text-sm text-purple-700">
              Para <InlineMath math={`X = ${predictionPoint.x}`} />
            </p>
            <p className="text-sm text-purple-700">
              <InlineMath math={`z = ${new Decimal(result.b0).toDecimalPlaces(4).toNumber()} ${result.b1 >= 0 ? '+' : '-'} ${Math.abs(new Decimal(result.b1).toDecimalPlaces(4).toNumber())} \\times ${predictionPoint.x}`} />
            </p>
            <p className="text-sm text-purple-700">
              <InlineMath math={`z = ${new Decimal(result.b0 + result.b1 * predictionPoint.x).toDecimalPlaces(4).toNumber()}`} />
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-xl font-bold text-purple-600">
                <InlineMath math={`P(Y=1) = ${new Decimal(predictionPoint.probability).toDecimalPlaces(4).toNumber()}`} />
              </p>
              <p className="text-lg text-purple-600">
                ({new Decimal(predictionPoint.probability * 100).toDecimalPlaces(2).toNumber()}% de probabilidad)
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Con umbral = {threshold}
              </p>
              <p className={`mt-1 text-2xl font-bold ${
                predictionPoint.predictedClass === 1
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                Clase Predicha: {predictionPoint.predictedClass}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

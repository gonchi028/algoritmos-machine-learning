import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { calculate } from "@/lib/calculations";
import { useDataStore } from "@/store";

const formSchema = z
  .object({
    tecnica: z.enum([
      "simple-inspeccion",
      "distribucion-arbitraria",
      "sturges",
      "maximo-entero",
    ]),
    intervalos: z
      .string()
      .refine((val) => !isNaN(Number(val)))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.tecnica === "distribucion-arbitraria") {
        return (
          data.intervalos !== undefined &&
          Number.isInteger(Number(data.intervalos)) &&
          Number(data.intervalos) >= 1
        );
      }
      return true;
    },
    {
      message: "El número de intervalos debe ser un número entero positivo",
      path: ["intervalos"],
    }
  );

export const CalculateForm = () => {
  const { orderedData, setTableData } = useDataStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tecnica: "sturges",
      intervalos: "",
    },
  });

  const selectedTecnica = form.watch("tecnica");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (orderedData.length === 0) {
      toast.error("Ingresa datos para calcular la tabla...");
      return;
    }

    const tableData = calculate({
      orderedData: orderedData,
      tecnica: values.tecnica,
      intervalos: values.intervalos ? Number(values.intervalos) : undefined,
    });
    setTableData(tableData);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="tecnica"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Técnica</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Técnica de calculo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="simple-inspeccion">
                      Simple inspeccion
                    </SelectItem>
                    <SelectItem value="distribucion-arbitraria">
                      Distribucion arbitraria
                    </SelectItem>
                    <SelectItem value="sturges">Sturges</SelectItem>
                    <SelectItem value="maximo-entero">Máximo entero</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona la técnica que deseas utilizar para calcular la
                  tabla estadística.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedTecnica === "distribucion-arbitraria" && (
            <FormField
              control={form.control}
              name="intervalos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de intervalos</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingresa el número de intervalos para la distribución
                    arbitraria
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-center">
            <Button className="w-full sm:w-auto" type="submit">
              Calcular Tabla Estadística
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataStore } from "@/store";

const formSchema = z.object({
  separador: z.enum([",", ".", " ", "|"]),
  data: z.string().min(1, { message: "Los datos son requeridos" }),
});

export const UploadDataForm = () => {
  const { setData } = useDataStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      separador: ",",
      // data: "0, 4, 2, 1, 0, 6, 1, 2, 4, 5, 3, 2, 3, 6, 5, 4, 2, 3, 2, 4, 1, 1, 6, 4, 4, 0, 2, 0, 2, 6, 2, 4, 0, 4, 6, 4, 5, 1, 6, 1, 6, 5, 1, 6, 0, 4, 2, 1, 0, 3",
      // data: "12, 35, 31, 12, 4, 26, 12, 11, 15, 31, 8, 20, 41, 8, 15, 21, 6, 15, 21, 10, 23, 11, 16, 6, 41, 19, 10, 9, 31, 14, 9, 15, 24, 20, 10, 11",
      // data: "15, 20, 45, 19, 13, 38, 13, 46, 20, 18, 14, 16, 19, 21, 22, 13, 32, 23, 18, 24, 29, 44, 24, 25, 27, 25, 39, 18, 33, 27",
      data: "12, 6, 13, 8, 9, 15, 11, 14, 12, 14, 12, 16, 18, 4, 11, 16, 5, 6, 9, 7, 5, 16, 2, 15, 10",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { separador, data } = values;
    const dataArray: number[] = [];

    const stringDataArray = data.split(separador);
    stringDataArray.forEach((item) => {
      const trimmedItem = item.trim();

      if (trimmedItem !== "" && !isNaN(Number(trimmedItem))) {
        dataArray.push(Number(trimmedItem));
      }
    });

    setData(dataArray);
  };

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="separador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Separador de datos</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Seleccione un separador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value=".">Punto "."</SelectItem>
                    <SelectItem value=",">Coma ","</SelectItem>
                    <SelectItem value=" ">Espacio " "</SelectItem>
                    <SelectItem value="|">Barra vertical "|"</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  El separador de datos es el caracter que separa los datos
                  numericos en la tabla.
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
                <FormLabel>Datos</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ingrese sus datos" {...field} />
                </FormControl>
                <FormDescription>
                  Ingrese sus datos numericos, utilizando un separador, por
                  ejemplo: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Recuerda que solo se
                  tomará en cuenta los datos numericos.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button className="w-full sm:w-auto" type="submit">
              Registrar datos
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

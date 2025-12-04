import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDataStore } from "@/store";

export const DataDisplay = () => {
  const { data, orderedData } = useDataStore();
  const rows = Math.ceil(data.length / 10);

  return (
    <div className="mt-8 mb-5">
      <Table>
        <TableCaption>
          {orderedData.length === 0 ? (
            <p className="text-center">No se encuentran datos registrados</p>
          ) : (
            <p className="text-center">Datos para la tabla estadistica</p>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={5}>Datos</TableHead>
            <TableHead colSpan={5} className="text-end">
              n = {data.length}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {/* {orderedData.length === 0 && (
              <TableCell colSpan={10} className="text-center">
                No se encuentran datos registrados
              </TableCell>
            )} */}
          </TableRow>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 10 }).map((_, index) => {
                const position = 10 * i + index;

                if (position <= data.length) {
                  return (
                    <TableCell key={`${i}-${index}`}>
                      {orderedData[position]}
                    </TableCell>
                  );
                }
                return null;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

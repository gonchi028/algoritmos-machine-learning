import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDataStore } from "@/store/data-store";
import { Decimal } from "decimal.js";

export const ResultsDisplay = () => {
  const { tableData } = useDataStore();

  return (
    <>
      {tableData.length > 0 && (
        <div className="mt-10">
          {tableData[0].limites.limInf === tableData[0].limites.limSup ? (
            <>
              <h2 className="my-4 text-center text-2xl font-medium">
                Tabla estadistica
              </h2>
              <Table>
                <TableCaption>
                  Todos los datos de la tabla estadistica.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>li</TableHead>
                    <TableHead>fi</TableHead>
                    <TableHead>hi</TableHead>
                    <TableHead>pi [%]</TableHead>
                    <TableHead>Fi</TableHead>
                    <TableHead>Hi</TableHead>
                    <TableHead>Pi [%]</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={row.marcaClase}>
                      <TableCell>{row.marcaClase}</TableCell>
                      <TableCell>{row.fAbsolutaSimple}</TableCell>
                      <TableCell>
                        {new Decimal(row.fRelativaSimple)
                          .times(10000)
                          .round()
                          .div(10000)
                          .toNumber()}
                      </TableCell>
                      <TableCell>
                        {new Decimal(row.fPorcentualSimple)
                          .times(10000)
                          .round()
                          .div(10000)
                          .toNumber()}
                      </TableCell>
                      <TableCell>{row.fAbsolutaAcumulada}</TableCell>
                      {index === tableData.length - 1 ? (
                        <>
                          <TableCell>1</TableCell>
                          <TableCell>100</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            {new Decimal(row.fRelativaAcumulada)
                              .times(10000)
                              .round()
                              .div(10000)
                              .toNumber()}
                          </TableCell>
                          <TableCell>
                            {new Decimal(row.fPorcentualAcumulada)
                              .times(10000)
                              .round()
                              .div(10000)
                              .toNumber()}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    {/* <TableCell colSpan={3}>Total</TableCell> */}
                    <TableCell>Total</TableCell>
                    <TableCell>
                      {tableData.reduce(
                        (acc, row) => acc + row.fAbsolutaSimple,
                        0
                      )}
                    </TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          ) : (
            <>
              <h2 className="my-4 text-center text-2xl font-medium">
                Tabla estadistica
              </h2>
              <Table>
                <TableCaption>
                  Todos los datos de la tabla estadistica.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>li</TableHead>
                    <TableHead>xi</TableHead>
                    <TableHead>fi</TableHead>
                    <TableHead>hi</TableHead>
                    <TableHead>pi [%]</TableHead>
                    <TableHead>Fi</TableHead>
                    <TableHead>Hi</TableHead>
                    <TableHead>Pi [%]</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={row.marcaClase}>
                      <TableCell>
                        [{row.limites.limInf} ; {row.limites.limSup})
                      </TableCell>
                      <TableCell>{row.marcaClase}</TableCell>
                      <TableCell>{row.fAbsolutaSimple}</TableCell>
                      <TableCell>
                        {new Decimal(row.fRelativaSimple)
                          .times(10000)
                          .round()
                          .div(10000)
                          .toNumber()}
                      </TableCell>
                      <TableCell>
                        {new Decimal(row.fPorcentualSimple)
                          .times(10000)
                          .round()
                          .div(10000)
                          .toNumber()}
                      </TableCell>
                      <TableCell>{row.fAbsolutaAcumulada}</TableCell>
                      {index === tableData.length - 1 ? (
                        <>
                          <TableCell>1</TableCell>
                          <TableCell>100</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            {new Decimal(row.fRelativaAcumulada)
                              .times(10000)
                              .round()
                              .div(10000)
                              .toNumber()}
                          </TableCell>
                          <TableCell>
                            {new Decimal(row.fPorcentualAcumulada)
                              .times(10000)
                              .round()
                              .div(10000)
                              .toNumber()}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell>
                      {tableData.reduce(
                        (acc, row) => acc + row.fAbsolutaSimple,
                        0
                      )}
                    </TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}
        </div>
      )}
    </>
  );
};

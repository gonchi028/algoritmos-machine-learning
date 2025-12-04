import { Decimal } from "decimal.js";

type CalculationInput = {
  orderedData: number[];
  tecnica:
    | "simple-inspeccion"
    | "distribucion-arbitraria"
    | "sturges"
    | "maximo-entero";
  intervalos?: number;
};

export type TableData = {
  limites: {
    limInf: number;
    limSup: number;
  };
  marcaClase: number;
  fAbsolutaSimple: number;
  fRelativaSimple: number;
  fPorcentualSimple: number;
  fAbsolutaAcumulada: number;
  fRelativaAcumulada: number;
  fPorcentualAcumulada: number;
};

export const calculate = ({
  orderedData,
  tecnica,
  intervalos,
}: CalculationInput): TableData[] => {
  const tableData: TableData[] = [];
  if (tecnica === "simple-inspeccion") {
    const total = orderedData.length;
    let count = 1;

    for (let i = 0; i < total; i++) {
      if (!!orderedData[i + 1] && orderedData[i] === orderedData[i + 1]) {
        count++;
      }
      if (i === total - 1 || orderedData[i] !== orderedData[i + 1]) {
        tableData.push({
          limites: {
            limInf: orderedData[i],
            limSup: orderedData[i],
          },
          marcaClase: orderedData[i],
          fAbsolutaSimple: count,
          fRelativaSimple: count / total,
          fPorcentualSimple: (count / total) * 100,
          fAbsolutaAcumulada:
            tableData.length > 0
              ? tableData[tableData.length - 1].fAbsolutaAcumulada + count
              : count,
          fRelativaAcumulada:
            tableData.length > 0
              ? tableData[tableData.length - 1].fRelativaAcumulada +
                count / total
              : count / total,
          fPorcentualAcumulada:
            tableData.length > 0
              ? tableData[tableData.length - 1].fPorcentualAcumulada +
                (count / total) * 100
              : (count / total) * 100,
        });
        count = 1;
      }
    }
    return tableData;
  }

  const maxDecimals = Math.max(
    ...orderedData.map((value) =>
      value.toString().split(".")[1] ? value.toString().split(".")[1].length : 0
    )
  );

  const n = orderedData.length;
  const alcance = {
    d: orderedData[0],
    D: orderedData[n - 1],
  };
  const la = alcance.D - alcance.d + Math.pow(10, -maxDecimals);

  // Sturges
  let k = Math.round(1 + 3.3 * Math.log10(n));

  if (tecnica === "distribucion-arbitraria" && intervalos) {
    k = intervalos;
  }
  if (tecnica === "maximo-entero") {
    k = Math.round(10 * Math.log10(n));
  }

  const t = la / k;

  let tFixed = Number(t.toFixed(maxDecimals));
  if (tFixed * k < la) {
    tFixed = tFixed + Math.pow(10, -maxDecimals);
  }
  const correccion = Math.round((tFixed * k - la) * Math.pow(10, maxDecimals));

  let limInf = new Decimal(alcance.d);
  if (correccion % 2 === 0) {
    limInf = limInf.minus(
      new Decimal(correccion).div(2).mul(new Decimal(10).pow(-maxDecimals))
    );
  } else {
    limInf = limInf.minus(
      new Decimal(correccion - 1).div(2).mul(new Decimal(10).pow(-maxDecimals))
    );
  }

  let index = 0;
  let count = 0;
  for (let i = 0; i < k; i++) {
    while (orderedData[index] < limInf.toNumber() + tFixed) {
      index++;
      count++;
    }
    tableData.push({
      limites: {
        limInf: limInf.toNumber(),
        limSup: limInf.plus(tFixed).toNumber(),
      },
      marcaClase: Number(
        limInf.plus(new Decimal(tFixed).plus(limInf)).div(2).toNumber()
      ),
      fAbsolutaSimple: count,
      fRelativaSimple: new Decimal(count).div(n).toNumber(),
      fPorcentualSimple: new Decimal(count).div(n).mul(100).toNumber(),
      fAbsolutaAcumulada:
        tableData.length > 0
          ? tableData[tableData.length - 1].fAbsolutaAcumulada + count
          : count,
      fRelativaAcumulada:
        tableData.length > 0
          ? new Decimal(tableData[tableData.length - 1].fRelativaAcumulada)
              .add(new Decimal(count).div(n))
              .toNumber()
          : new Decimal(count).div(n).toNumber(),
      fPorcentualAcumulada:
        tableData.length > 0
          ? new Decimal(tableData[tableData.length - 1].fPorcentualAcumulada)
              .add(new Decimal(count).div(n).mul(100).toNumber())
              .toNumber()
          : new Decimal(count).div(n).mul(100).toNumber(),
    });
    count = 0;
    limInf = limInf.plus(tFixed);
  }

  return tableData;
};

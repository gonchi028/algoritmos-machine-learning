import { Decimal } from "decimal.js";

export type DataPoint = {
  x: number;
  y: number;
};

export type CalculationStep = {
  xi: number;
  yi: number;
  xiSquared: number;
  yiSquared: number;
  xiYi: number;
};

export type RegressionResult = {
  // Summations
  n: number;
  sumX: number;
  sumY: number;
  sumXSquared: number;
  sumYSquared: number;
  sumXY: number;

  // Means
  meanX: number;
  meanY: number;

  // Regression coefficients
  b1: number; // slope
  b0: number; // intercept

  // Correlation coefficient
  r: number;
  rSquared: number;

  // Step by step table data
  steps: CalculationStep[];

  // Equation string
  equation: string;
};

export const calculateLinearRegression = (data: DataPoint[]): RegressionResult | null => {
  if (data.length < 2) {
    return null;
  }

  const n = data.length;

  // Calculate step-by-step values for each data point
  const steps: CalculationStep[] = data.map((point) => ({
    xi: point.x,
    yi: point.y,
    xiSquared: new Decimal(point.x).pow(2).toNumber(),
    yiSquared: new Decimal(point.y).pow(2).toNumber(),
    xiYi: new Decimal(point.x).times(point.y).toNumber(),
  }));

  // Calculate summations
  const sumX = steps.reduce((acc, step) => new Decimal(acc).plus(step.xi).toNumber(), 0);
  const sumY = steps.reduce((acc, step) => new Decimal(acc).plus(step.yi).toNumber(), 0);
  const sumXSquared = steps.reduce((acc, step) => new Decimal(acc).plus(step.xiSquared).toNumber(), 0);
  const sumYSquared = steps.reduce((acc, step) => new Decimal(acc).plus(step.yiSquared).toNumber(), 0);
  const sumXY = steps.reduce((acc, step) => new Decimal(acc).plus(step.xiYi).toNumber(), 0);

  // Calculate means
  const meanX = new Decimal(sumX).div(n).toNumber();
  const meanY = new Decimal(sumY).div(n).toNumber();

  // Calculate slope (b1) using the formula:
  // b1 = (n * Σxy - Σx * Σy) / (n * Σx² - (Σx)²)
  const numeratorB1 = new Decimal(n).times(sumXY).minus(new Decimal(sumX).times(sumY));
  const denominatorB1 = new Decimal(n).times(sumXSquared).minus(new Decimal(sumX).pow(2));
  
  if (denominatorB1.isZero()) {
    return null; // Cannot calculate regression with zero variance in X
  }

  const b1 = numeratorB1.div(denominatorB1).toNumber();

  // Calculate intercept (b0) using the formula:
  // b0 = ȳ - b1 * x̄
  const b0 = new Decimal(meanY).minus(new Decimal(b1).times(meanX)).toNumber();

  // Calculate correlation coefficient (r) using the formula:
  // r = (n * Σxy - Σx * Σy) / sqrt((n * Σx² - (Σx)²) * (n * Σy² - (Σy)²))
  const numeratorR = new Decimal(n).times(sumXY).minus(new Decimal(sumX).times(sumY));
  const denominatorR = new Decimal(n)
    .times(sumXSquared)
    .minus(new Decimal(sumX).pow(2))
    .times(new Decimal(n).times(sumYSquared).minus(new Decimal(sumY).pow(2)))
    .sqrt();

  const r = denominatorR.isZero() ? 0 : numeratorR.div(denominatorR).toNumber();
  const rSquared = new Decimal(r).pow(2).toNumber();

  // Format the equation
  const b0Rounded = new Decimal(b0).toDecimalPlaces(4).toNumber();
  const b1Rounded = new Decimal(b1).toDecimalPlaces(4).toNumber();
  const sign = b0Rounded >= 0 ? "+" : "-";
  const equation = `ŷ = ${b1Rounded}x ${sign} ${Math.abs(b0Rounded)}`;

  return {
    n,
    sumX: new Decimal(sumX).toDecimalPlaces(4).toNumber(),
    sumY: new Decimal(sumY).toDecimalPlaces(4).toNumber(),
    sumXSquared: new Decimal(sumXSquared).toDecimalPlaces(4).toNumber(),
    sumYSquared: new Decimal(sumYSquared).toDecimalPlaces(4).toNumber(),
    sumXY: new Decimal(sumXY).toDecimalPlaces(4).toNumber(),
    meanX: new Decimal(meanX).toDecimalPlaces(4).toNumber(),
    meanY: new Decimal(meanY).toDecimalPlaces(4).toNumber(),
    b1: new Decimal(b1).toDecimalPlaces(6).toNumber(),
    b0: new Decimal(b0).toDecimalPlaces(6).toNumber(),
    r: new Decimal(r).toDecimalPlaces(6).toNumber(),
    rSquared: new Decimal(rSquared).toDecimalPlaces(6).toNumber(),
    steps,
    equation,
  };
};

// Predict Y value for a given X
export const predictY = (x: number, b0: number, b1: number): number => {
  return new Decimal(b1).times(x).plus(b0).toNumber();
};

// Interpret the correlation coefficient
export const interpretCorrelation = (r: number): string => {
  const absR = Math.abs(r);
  const direction = r >= 0 ? "positiva" : "negativa";
  
  if (absR === 1) {
    return `Correlación ${direction} perfecta`;
  } else if (absR >= 0.9) {
    return `Correlación ${direction} muy fuerte`;
  } else if (absR >= 0.7) {
    return `Correlación ${direction} fuerte`;
  } else if (absR >= 0.5) {
    return `Correlación ${direction} moderada`;
  } else if (absR >= 0.3) {
    return `Correlación ${direction} débil`;
  } else if (absR > 0) {
    return `Correlación ${direction} muy débil`;
  } else {
    return "Sin correlación lineal";
  }
};

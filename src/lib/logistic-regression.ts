import { Decimal } from "decimal.js";

export type LogisticDataPoint = {
  x: number;
  y: 0 | 1; // Binary outcome
};

export type LogisticCalculationStep = {
  iteration: number;
  b0: number;
  b1: number;
  logLikelihood: number;
  predictions: number[];
};

export type LogisticRegressionResult = {
  // Data info
  n: number;
  nPositive: number;
  nNegative: number;

  // Coefficients
  b0: number; // intercept
  b1: number; // coefficient

  // Model fit statistics
  logLikelihood: number;
  nullLogLikelihood: number;
  pseudoRSquared: number; // McFadden's R²

  // Odds ratio
  oddsRatio: number;

  // Training history
  iterations: LogisticCalculationStep[];
  convergenceReached: boolean;

  // Equation
  equation: string;
};

// Sigmoid function
export const sigmoid = (z: number): number => {
  // Handle overflow for large positive/negative values
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
};

// Predict probability for a given x
export const predictProbability = (x: number, b0: number, b1: number): number => {
  const z = new Decimal(b0).plus(new Decimal(b1).times(x)).toNumber();
  return sigmoid(z);
};

// Predict class (0 or 1) based on threshold
export const predictClass = (x: number, b0: number, b1: number, threshold: number = 0.5): 0 | 1 => {
  return predictProbability(x, b0, b1) >= threshold ? 1 : 0;
};

// Calculate log likelihood
const calculateLogLikelihood = (
  data: LogisticDataPoint[],
  b0: number,
  b1: number
): number => {
  let logLikelihood = 0;
  for (const point of data) {
    const p = predictProbability(point.x, b0, b1);
    // Clamp probability to avoid log(0)
    const pClamped = Math.max(Math.min(p, 1 - 1e-10), 1e-10);
    if (point.y === 1) {
      logLikelihood += Math.log(pClamped);
    } else {
      logLikelihood += Math.log(1 - pClamped);
    }
  }
  return logLikelihood;
};

// Calculate null log likelihood (model with only intercept)
const calculateNullLogLikelihood = (data: LogisticDataPoint[]): number => {
  const n = data.length;
  const nPositive = data.filter((p) => p.y === 1).length;
  const p = nPositive / n;
  const pClamped = Math.max(Math.min(p, 1 - 1e-10), 1e-10);
  return nPositive * Math.log(pClamped) + (n - nPositive) * Math.log(1 - pClamped);
};

// Logistic Regression using Gradient Descent
export const calculateLogisticRegression = (
  data: LogisticDataPoint[],
  learningRate: number = 0.1,
  maxIterations: number = 1000,
  tolerance: number = 1e-6
): LogisticRegressionResult | null => {
  if (data.length < 2) {
    return null;
  }

  const n = data.length;
  const nPositive = data.filter((p) => p.y === 1).length;
  const nNegative = n - nPositive;

  // Validate we have both classes
  if (nPositive === 0 || nNegative === 0) {
    return null;
  }

  // Initialize coefficients
  let b0 = 0;
  let b1 = 0;

  const iterations: LogisticCalculationStep[] = [];
  let convergenceReached = false;
  let prevLogLikelihood = -Infinity;

  for (let iter = 0; iter < maxIterations; iter++) {
    // Calculate gradients
    let gradB0 = 0;
    let gradB1 = 0;
    const predictions: number[] = [];

    for (const point of data) {
      const p = predictProbability(point.x, b0, b1);
      predictions.push(p);
      const error = point.y - p;
      gradB0 += error;
      gradB1 += error * point.x;
    }

    // Update coefficients
    b0 = new Decimal(b0).plus(new Decimal(learningRate).times(gradB0).div(n)).toNumber();
    b1 = new Decimal(b1).plus(new Decimal(learningRate).times(gradB1).div(n)).toNumber();

    // Calculate log likelihood
    const logLikelihood = calculateLogLikelihood(data, b0, b1);

    // Store iteration (sample some iterations to avoid too much data)
    if (iter < 10 || iter % 100 === 0 || iter === maxIterations - 1) {
      iterations.push({
        iteration: iter + 1,
        b0: new Decimal(b0).toDecimalPlaces(6).toNumber(),
        b1: new Decimal(b1).toDecimalPlaces(6).toNumber(),
        logLikelihood: new Decimal(logLikelihood).toDecimalPlaces(6).toNumber(),
        predictions: predictions.map((p) => new Decimal(p).toDecimalPlaces(4).toNumber()),
      });
    }

    // Check convergence
    if (Math.abs(logLikelihood - prevLogLikelihood) < tolerance) {
      convergenceReached = true;
      // Add final iteration if not already added
      if (iterations[iterations.length - 1].iteration !== iter + 1) {
        iterations.push({
          iteration: iter + 1,
          b0: new Decimal(b0).toDecimalPlaces(6).toNumber(),
          b1: new Decimal(b1).toDecimalPlaces(6).toNumber(),
          logLikelihood: new Decimal(logLikelihood).toDecimalPlaces(6).toNumber(),
          predictions: predictions.map((p) => new Decimal(p).toDecimalPlaces(4).toNumber()),
        });
      }
      break;
    }

    prevLogLikelihood = logLikelihood;
  }

  // Calculate final statistics
  const logLikelihood = calculateLogLikelihood(data, b0, b1);
  const nullLogLikelihood = calculateNullLogLikelihood(data);
  
  // McFadden's pseudo R-squared
  const pseudoRSquared = 1 - logLikelihood / nullLogLikelihood;

  // Odds ratio
  const oddsRatio = Math.exp(b1);

  // Format equation
  const b0Rounded = new Decimal(b0).toDecimalPlaces(4).toNumber();
  const b1Rounded = new Decimal(b1).toDecimalPlaces(4).toNumber();
  const sign = b1Rounded >= 0 ? "+" : "-";
  const equation = `P(Y=1) = 1 / (1 + e^-(${b0Rounded} ${sign} ${Math.abs(b1Rounded)}x))`;

  return {
    n,
    nPositive,
    nNegative,
    b0: new Decimal(b0).toDecimalPlaces(6).toNumber(),
    b1: new Decimal(b1).toDecimalPlaces(6).toNumber(),
    logLikelihood: new Decimal(logLikelihood).toDecimalPlaces(6).toNumber(),
    nullLogLikelihood: new Decimal(nullLogLikelihood).toDecimalPlaces(6).toNumber(),
    pseudoRSquared: new Decimal(pseudoRSquared).toDecimalPlaces(6).toNumber(),
    oddsRatio: new Decimal(oddsRatio).toDecimalPlaces(6).toNumber(),
    iterations,
    convergenceReached,
    equation,
  };
};

// Interpret pseudo R-squared
export const interpretPseudoRSquared = (r2: number): string => {
  if (r2 >= 0.4) {
    return "Excelente ajuste del modelo";
  } else if (r2 >= 0.2) {
    return "Buen ajuste del modelo";
  } else if (r2 >= 0.1) {
    return "Ajuste moderado del modelo";
  } else {
    return "Ajuste bajo del modelo";
  }
};

// Interpret odds ratio
export const interpretOddsRatio = (or: number): string => {
  if (or > 1) {
    const increase = ((or - 1) * 100).toFixed(1);
    return `Por cada unidad de aumento en X, las probabilidades de Y=1 aumentan en ${increase}%`;
  } else if (or < 1) {
    const decrease = ((1 - or) * 100).toFixed(1);
    return `Por cada unidad de aumento en X, las probabilidades de Y=1 disminuyen en ${decrease}%`;
  } else {
    return "X no tiene efecto en las probabilidades de Y=1";
  }
};

// Calculate accuracy
export const calculateAccuracy = (
  data: LogisticDataPoint[],
  b0: number,
  b1: number,
  threshold: number = 0.5
): number => {
  let correct = 0;
  for (const point of data) {
    const predicted = predictClass(point.x, b0, b1, threshold);
    if (predicted === point.y) {
      correct++;
    }
  }
  return correct / data.length;
};

// Calculate confusion matrix
export const calculateConfusionMatrix = (
  data: LogisticDataPoint[],
  b0: number,
  b1: number,
  threshold: number = 0.5
): { tp: number; tn: number; fp: number; fn: number } => {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  for (const point of data) {
    const predicted = predictClass(point.x, b0, b1, threshold);
    if (point.y === 1 && predicted === 1) tp++;
    else if (point.y === 0 && predicted === 0) tn++;
    else if (point.y === 0 && predicted === 1) fp++;
    else fn++;
  }
  return { tp, tn, fp, fn };
};

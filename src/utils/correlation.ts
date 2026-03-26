import type { CorrelationEntry, CorrelationMatrix, NumericData } from '../types';

/**
 * Compute Pearson r for two arrays, ignoring pairs where either value is NaN.
 * Returns { r, n } where n is the pairwise complete count.
 */
function pearsonR(xs: number[], ys: number[]): { r: number; n: number } {
  const pairs: [number, number][] = [];
  for (let i = 0; i < xs.length; i++) {
    if (!isNaN(xs[i]) && !isNaN(ys[i])) {
      pairs.push([xs[i], ys[i]]);
    }
  }
  const n = pairs.length;
  if (n < 3) return { r: NaN, n };

  const mx = pairs.reduce((s, p) => s + p[0], 0) / n;
  const my = pairs.reduce((s, p) => s + p[1], 0) / n;

  let sxy = 0, sxx = 0, syy = 0;
  for (const [x, y] of pairs) {
    const dx = x - mx;
    const dy = y - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }

  const denom = Math.sqrt(sxx * syy);
  if (denom === 0) return { r: NaN, n };
  return { r: Math.max(-1, Math.min(1, sxy / denom)), n };
}

/**
 * Regularized incomplete beta function via continued fraction (Lentz method).
 * Used to compute the t-distribution CDF for p-value calculation.
 */
function betai(a: number, b: number, x: number): number {
  if (x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;
  // Use symmetry relation when x > (a+1)/(a+b+2)
  const threshold = (a + 1) / (a + b + 2);
  if (x > threshold) {
    return 1 - betai(b, a, 1 - x);
  }
  // Compute log of beta function
  const lbeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta) / a;
  // Continued fraction via modified Lentz
  return front * betacf(a, b, x);
}

function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200;
  const EPS = 3e-7;
  const FPMIN = 1e-30;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1.0;
  let d = 1.0 - qab * x / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1.0 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < EPS) break;
  }
  return h;
}

function lgamma(x: number): number {
  // Lanczos approximation
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  }
  x -= 1;
  let ag = c[0];
  for (let i = 1; i < g + 2; i++) ag += c[i] / (x + i);
  const t = x + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(ag);
}

/**
 * Two-tailed p-value for Pearson r with n observations.
 * Uses t = r*sqrt(n-2)/sqrt(1-r^2) and t-distribution CDF.
 */
export function pValue(r: number, n: number): number {
  if (isNaN(r) || n < 3) return NaN;
  if (Math.abs(r) === 1) return 0;
  const df = n - 2;
  const t = Math.abs(r) * Math.sqrt(df) / Math.sqrt(1 - r * r);
  // p = 2 * P(T > t) = 2 * (1 - CDF_t(t, df))
  // Using relation to incomplete beta: P(T > t) = betai(df/2, 0.5, df/(df+t^2)) / 2
  const x = df / (df + t * t);
  return Math.min(1, betai(df / 2, 0.5, x));
}

/**
 * Build the full correlation matrix for the given numeric data and selected columns.
 */
export function buildCorrelationMatrix(
  data: NumericData,
  selectedColumns: string[],
): CorrelationMatrix {
  const cols = selectedColumns.filter((c) => data.columns.includes(c));
  const entries = new Map<string, CorrelationEntry>();

  const colIndices = cols.map((c) => data.columns.indexOf(c));

  for (let i = 0; i < cols.length; i++) {
    for (let j = i; j < cols.length; j++) {
      const colA = cols[i];
      const colB = cols[j];

      let r: number;
      let p: number;
      let n: number;

      if (i === j) {
        r = 1;
        p = 0;
        n = data.rows.filter((row) => !isNaN(row[colIndices[i]])).length;
      } else {
        const xs = data.rows.map((row) => row[colIndices[i]]);
        const ys = data.rows.map((row) => row[colIndices[j]]);
        const result = pearsonR(xs, ys);
        r = result.r;
        n = result.n;
        p = pValue(r, n);
      }

      const entry: CorrelationEntry = { colA, colB, r, pValue: p, n };
      const key1 = `${colA}||${colB}`;
      const key2 = `${colB}||${colA}`;
      entries.set(key1, entry);
      if (i !== j) entries.set(key2, { ...entry, colA: colB, colB: colA });
    }
  }

  return { columns: cols, entries };
}

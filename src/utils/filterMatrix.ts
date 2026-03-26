import type { ControlState, CorrelationMatrix } from '../types';

export type FilteredMatrix = {
  columns: string[];
  zMatrix: (number | null)[][];
  annotationMatrix: string[][];
  pMatrix: (number | null)[][];
};

export function filterMatrix(
  matrix: CorrelationMatrix,
  controls: ControlState,
): FilteredMatrix {
  const { columns } = matrix;
  const { pValueThreshold, weakCorrelationCutoff, showWeakAsGray, precisionDigits } = controls;
  const n = columns.length;

  const zMatrix: (number | null)[][] = [];
  const annotationMatrix: string[][] = [];
  const pMatrix: (number | null)[][] = [];

  for (let i = 0; i < n; i++) {
    const zRow: (number | null)[] = [];
    const aRow: string[] = [];
    const pRow: (number | null)[] = [];

    for (let j = 0; j < n; j++) {
      const key = `${columns[i]}||${columns[j]}`;
      const entry = matrix.entries.get(key);

      if (!entry || isNaN(entry.r)) {
        zRow.push(null);
        aRow.push('');
        pRow.push(null);
        continue;
      }

      const { r, pValue } = entry;
      const isInsignificant = !isNaN(pValue) && pValue > pValueThreshold;
      const isWeak = Math.abs(r) < weakCorrelationCutoff && i !== j;

      if (isInsignificant || isWeak) {
        if (showWeakAsGray) {
          zRow.push(null);
          aRow.push('');
          pRow.push(isNaN(pValue) ? null : pValue);
        } else {
          zRow.push(NaN as unknown as null);
          aRow.push('');
          pRow.push(null);
        }
      } else {
        zRow.push(r);
        aRow.push(r.toFixed(precisionDigits));
        pRow.push(isNaN(pValue) ? null : pValue);
      }
    }

    zMatrix.push(zRow);
    annotationMatrix.push(aRow);
    pMatrix.push(pRow);
  }

  return { columns, zMatrix, annotationMatrix, pMatrix };
}

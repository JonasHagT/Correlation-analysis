import { useMemo } from 'react';
import type { CorrelationMatrix, NumericData } from '../types';
import { buildCorrelationMatrix } from '../utils/correlation';

export function useCorrelationMatrix(
  numericData: NumericData | null,
  selectedColumns: string[],
): CorrelationMatrix | null {
  return useMemo(() => {
    if (!numericData || selectedColumns.length < 2) return null;
    return buildCorrelationMatrix(numericData, selectedColumns);
  }, [numericData, selectedColumns]);
}

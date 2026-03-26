import { useState, useCallback } from 'react';
import type { CSVRow, NumericData } from '../types';
import { parseCSVFile, toNumericData } from '../utils/parseCSV';

type UseCSVDataReturn = {
  numericData: NumericData | null;
  allColumns: string[];
  numericColumns: string[];
  rawRows: CSVRow[];
  fileName: string | null;
  rowCount: number;
  error: string | null;
  isLoading: boolean;
  loadFile: (file: File) => void;
  reset: () => void;
};

export function useCSVData(): UseCSVDataReturn {
  const [numericData, setNumericData] = useState<NumericData | null>(null);
  const [allColumns, setAllColumns] = useState<string[]>([]);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setNumericData(null);
    try {
      const { rows, allColumns: ac, numericColumns: nc } = await parseCSVFile(file);
      const data = toNumericData(rows, nc);
      setRawRows(rows);
      setAllColumns(ac);
      setNumericColumns(nc);
      setNumericData(data);
      setFileName(file.name);
      setRowCount(rows.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error parsing CSV.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setNumericData(null);
    setAllColumns([]);
    setNumericColumns([]);
    setRawRows([]);
    setFileName(null);
    setRowCount(0);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    numericData,
    allColumns,
    numericColumns,
    rawRows,
    fileName,
    rowCount,
    error,
    isLoading,
    loadFile,
    reset,
  };
}

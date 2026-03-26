import Papa from 'papaparse';
import type { CSVRow, NumericData } from '../types';

const NUMERIC_THRESHOLD = 0.7; // 70% of values must be numeric to count the column as numeric

export function detectNumericColumns(rows: CSVRow[]): string[] {
  if (rows.length === 0) return [];
  const columns = Object.keys(rows[0]);
  return columns.filter((col) => {
    let numericCount = 0;
    let totalCount = 0;
    for (const row of rows) {
      const val = row[col];
      if (val === null || val === '' || val === undefined) continue;
      totalCount++;
      const num = typeof val === 'number' ? val : parseFloat(String(val));
      if (!isNaN(num)) numericCount++;
    }
    return totalCount > 0 && numericCount / totalCount >= NUMERIC_THRESHOLD;
  });
}

export function toNumericData(rows: CSVRow[], columns: string[]): NumericData {
  const numericRows = rows.map((row) =>
    columns.map((col) => {
      const val = row[col];
      if (val === null || val === '' || val === undefined) return NaN;
      const num = typeof val === 'number' ? val : parseFloat(String(val));
      return isNaN(num) ? NaN : num;
    }),
  );
  return { columns, rows: numericRows };
}

export function parseCSVFile(
  file: File,
): Promise<{ rows: CSVRow[]; allColumns: string[]; numericColumns: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete(results) {
        const rows = results.data;
        if (rows.length === 0) {
          reject(new Error('CSV file is empty or has no data rows.'));
          return;
        }
        const allColumns = Object.keys(rows[0]);
        const numericColumns = detectNumericColumns(rows);
        if (numericColumns.length < 2) {
          reject(
            new Error(
              'Need at least 2 numeric columns to compute correlations. ' +
                `Found: ${numericColumns.length}.`,
            ),
          );
          return;
        }
        resolve({ rows, allColumns, numericColumns });
      },
      error(err) {
        reject(new Error(`CSV parse error: ${err.message}`));
      },
    });
  });
}

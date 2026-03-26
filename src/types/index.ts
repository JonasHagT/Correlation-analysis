export type CSVRow = Record<string, string | number | null>;

export type NumericData = {
  columns: string[];
  rows: number[][];
};

export type CorrelationEntry = {
  colA: string;
  colB: string;
  r: number;
  pValue: number;
  n: number;
};

export type CorrelationMatrix = {
  columns: string[];
  entries: Map<string, CorrelationEntry>;
};

export type ControlState = {
  pValueThreshold: number;
  colorScaleMin: number;
  colorScaleMax: number;
  weakCorrelationCutoff: number;
  showWeakAsGray: boolean;
  precisionDigits: number;
  selectedColumns: string[];
};

export const DEFAULT_CONTROL_STATE: ControlState = {
  pValueThreshold: 0.05,
  colorScaleMin: -1.0,
  colorScaleMax: 1.0,
  weakCorrelationCutoff: 0.0,
  showWeakAsGray: true,
  precisionDigits: 2,
  selectedColumns: [],
};

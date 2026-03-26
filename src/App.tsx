import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload/FileUpload';
import { HeatmapChart } from './components/HeatmapChart/HeatmapChart';
import { Sidebar } from './components/Layout/Sidebar';
import { useCSVData } from './hooks/useCSVData';
import { useCorrelationMatrix } from './hooks/useCorrelationMatrix';
import type { ControlState } from './types';
import { DEFAULT_CONTROL_STATE } from './types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controls, setControls] = useState<ControlState>(DEFAULT_CONTROL_STATE);

  const { numericData, numericColumns, fileName, rowCount, error, isLoading, loadFile, reset } =
    useCSVData();

  // Auto-select all numeric columns when data loads
  useEffect(() => {
    if (numericColumns.length > 0) {
      setControls((prev) => ({ ...prev, selectedColumns: [...numericColumns] }));
    }
  }, [numericColumns]);

  const matrix = useCorrelationMatrix(numericData, controls.selectedColumns);

  const handleControlChange = (patch: Partial<ControlState>) => {
    setControls((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    reset();
    setControls(DEFAULT_CONTROL_STATE);
  };

  const hasData = !!matrix && matrix.columns.length >= 2;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">Correlation Analysis</h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Pearson · Interactive</p>
          </div>
        </div>
        {hasData && (
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm text-slate-300 hover:text-white lg:hidden"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Settings
          </button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-auto p-5">
          {/* File upload zone */}
          <div className="mb-5">
            <FileUpload
              onFileAccepted={loadFile}
              currentFileName={fileName}
              rowCount={rowCount}
              onReset={handleReset}
              isLoading={isLoading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Heatmap */}
          {hasData && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Pearson Correlation Matrix</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {matrix.columns.length} variables · {rowCount.toLocaleString()} observations
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-2 rounded bg-red-400" /> Positive
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-2 rounded bg-blue-400" /> Negative
                  </span>
                </div>
              </div>
              <HeatmapChart matrix={matrix} controls={controls} />
            </div>
          )}

          {/* Empty state */}
          {!hasData && !error && !isLoading && !fileName && (
            <div className="text-center py-16 text-slate-600">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">Upload a CSV to get started</p>
            </div>
          )}
        </main>

        {/* Sidebar (desktop: always visible on lg+) */}
        {hasData && (
          <div className="hidden lg:flex w-72 border-l border-slate-800 flex-shrink-0">
            <Sidebar
              isOpen={true}
              onClose={() => {}}
              controls={controls}
              onControlChange={handleControlChange}
              numericColumns={numericColumns}
              matrix={matrix}
            />
          </div>
        )}
      </div>

      {/* Mobile sidebar */}
      {hasData && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          controls={controls}
          onControlChange={handleControlChange}
          numericColumns={numericColumns}
          matrix={matrix}
        />
      )}
    </div>
  );
}

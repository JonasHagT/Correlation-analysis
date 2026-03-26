import { useRef, useState, useCallback } from 'react';

type Props = {
  onFileAccepted: (file: File) => void;
  currentFileName: string | null;
  rowCount: number;
  onReset: () => void;
  isLoading: boolean;
};

export function FileUpload({ onFileAccepted, currentFileName, rowCount, onReset, isLoading }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
        alert('Please upload a CSV file.');
        return;
      }
      onFileAccepted(file);
    },
    [onFileAccepted],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (currentFileName) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-400 font-medium truncate text-sm">{currentFileName}</span>
          <span className="text-slate-400 text-xs shrink-0">{rowCount.toLocaleString()} rows</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
        >
          Change file
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed
        cursor-pointer transition-all duration-200 select-none
        ${isDragging
          ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
          : 'border-slate-600 bg-slate-800/40 hover:border-slate-400 hover:bg-slate-800/60'
        }
      `}
    >
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={onChange} />
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Parsing CSV...</p>
        </div>
      ) : (
        <>
          <div className="w-14 h-14 rounded-2xl bg-slate-700/60 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">Drop your CSV file here</p>
            <p className="text-slate-400 text-sm mt-1">or click to browse</p>
          </div>
          <p className="text-xs text-slate-500">Supports any CSV with numeric columns</p>
        </>
      )}
    </div>
  );
}

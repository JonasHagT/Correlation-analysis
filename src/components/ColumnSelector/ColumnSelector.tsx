type Props = {
  numericColumns: string[];
  selectedColumns: string[];
  onChange: (selected: string[]) => void;
};

export function ColumnSelector({ numericColumns, selectedColumns, onChange }: Props) {
  const allSelected = selectedColumns.length === numericColumns.length;

  const toggle = (col: string) => {
    if (selectedColumns.includes(col)) {
      if (selectedColumns.length <= 2) return; // keep at least 2
      onChange(selectedColumns.filter((c) => c !== col));
    } else {
      onChange([...selectedColumns, col]);
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      onChange(numericColumns.slice(0, 2));
    } else {
      onChange([...numericColumns]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Columns</span>
        <button
          onClick={toggleAll}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {numericColumns.map((col) => {
          const checked = selectedColumns.includes(col);
          return (
            <label
              key={col}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm
                ${checked ? 'bg-violet-500/15 text-violet-200' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}
              `}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(col)}
                className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
              />
              <span className="truncate">{col}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

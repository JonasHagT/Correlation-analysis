import type { ControlState } from '../../types';
import { ColumnSelector } from '../ColumnSelector/ColumnSelector';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import { StatsSummary } from '../StatsSummary/StatsSummary';
import type { CorrelationMatrix } from '../../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  controls: ControlState;
  onControlChange: (patch: Partial<ControlState>) => void;
  numericColumns: string[];
  matrix: CorrelationMatrix | null;
};

export function Sidebar({ isOpen, onClose, controls, onControlChange, numericColumns, matrix }: Props) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-700/60
          z-30 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="text-sm font-semibold text-slate-200">Settings</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {numericColumns.length > 0 && (
            <ColumnSelector
              numericColumns={numericColumns}
              selectedColumns={controls.selectedColumns}
              onChange={(cols) => onControlChange({ selectedColumns: cols })}
            />
          )}

          <div className="border-t border-slate-700/60 pt-4">
            <ControlPanel controls={controls} onChange={onControlChange} />
          </div>

          {matrix && matrix.columns.length >= 2 && (
            <div className="border-t border-slate-700/60 pt-4">
              <StatsSummary matrix={matrix} controls={controls} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

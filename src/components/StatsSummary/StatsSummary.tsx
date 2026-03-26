import type { ControlState, CorrelationMatrix } from '../../types';

type Props = {
  matrix: CorrelationMatrix;
  controls: ControlState;
  topN?: number;
};

export function StatsSummary({ matrix, controls, topN = 10 }: Props) {
  const { columns, entries } = matrix;
  const pairs: { colA: string; colB: string; r: number; pValue: number; n: number }[] = [];

  for (let i = 0; i < columns.length; i++) {
    for (let j = i + 1; j < columns.length; j++) {
      const key = `${columns[i]}||${columns[j]}`;
      const entry = entries.get(key);
      if (!entry || isNaN(entry.r)) continue;
      if (entry.pValue > controls.pValueThreshold) continue;
      if (Math.abs(entry.r) < controls.weakCorrelationCutoff) continue;
      pairs.push(entry);
    }
  }

  pairs.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
  const top = pairs.slice(0, topN);

  if (top.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No significant correlations match current filters.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Top {Math.min(topN, top.length)} Correlations
      </h3>
      <div className="space-y-1.5">
        {top.map((pair, idx) => {
          const pct = Math.abs(pair.r) * 100;
          const isPos = pair.r >= 0;
          return (
            <div key={`${pair.colA}-${pair.colB}`} className="flex items-center gap-3 group">
              <span className="text-xs text-slate-500 w-4 text-right shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs mb-1">
                  <span className="text-slate-200 truncate max-w-[100px]">{pair.colA}</span>
                  <span className="text-slate-500">↔</span>
                  <span className="text-slate-200 truncate max-w-[100px]">{pair.colB}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isPos ? 'bg-red-400' : 'bg-blue-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-xs font-mono font-semibold ${isPos ? 'text-red-400' : 'text-blue-400'}`}>
                  {pair.r.toFixed(controls.precisionDigits)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  p={pair.pValue < 0.001 ? '<.001' : pair.pValue.toFixed(3)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

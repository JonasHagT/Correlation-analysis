import type { ControlState } from '../../types';

type Props = {
  controls: ControlState;
  onChange: (patch: Partial<ControlState>) => void;
};

type SliderRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
};

function SliderRow({ label, value, min, max, step, format, onChange }: SliderRowProps) {
  const display = format ? format(value) : value.toFixed(2);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-mono text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`
          relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0
          ${value ? 'bg-violet-500' : 'bg-slate-600'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
            ${value ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}

const P_VALUE_STEPS = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 1.0];

function logPSlider(value: number): number {
  const idx = P_VALUE_STEPS.reduce((best, v, i) =>
    Math.abs(v - value) < Math.abs(P_VALUE_STEPS[best] - value) ? i : best,
    0,
  );
  return idx;
}

export function ControlPanel({ controls, onChange }: Props) {
  const pIdx = logPSlider(controls.pValueThreshold);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filter</span>
        </div>
        <div className="space-y-4">
          {/* p-value slider (step through predefined values) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">p-value threshold</span>
              <span className="text-xs font-mono text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded">
                p &lt; {controls.pValueThreshold}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={P_VALUE_STEPS.length - 1}
              step={1}
              value={pIdx}
              onChange={(e) =>
                onChange({ pValueThreshold: P_VALUE_STEPS[parseInt(e.target.value)] })
              }
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              {P_VALUE_STEPS.map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
          </div>

          <SliderRow
            label="Weak correlation cutoff (|r| min)"
            value={controls.weakCorrelationCutoff}
            min={0}
            max={0.9}
            step={0.05}
            onChange={(v) => onChange({ weakCorrelationCutoff: v })}
          />

          <Toggle
            label="Show filtered as gray"
            value={controls.showWeakAsGray}
            onChange={(v) => onChange({ showWeakAsGray: v })}
          />
        </div>
      </div>

      <div className="border-t border-slate-700/60 pt-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          Color Scale
        </span>
        <div className="space-y-4">
          <SliderRow
            label="Scale min"
            value={controls.colorScaleMin}
            min={-1}
            max={0}
            step={0.05}
            onChange={(v) => onChange({ colorScaleMin: v })}
          />
          <SliderRow
            label="Scale max"
            value={controls.colorScaleMax}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => onChange({ colorScaleMax: v })}
          />
        </div>
      </div>

      <div className="border-t border-slate-700/60 pt-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          Display
        </span>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">Decimal places</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => onChange({ precisionDigits: d })}
                  className={`
                    w-7 h-7 rounded text-xs font-mono transition-colors
                    ${controls.precisionDigits === d
                      ? 'bg-violet-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

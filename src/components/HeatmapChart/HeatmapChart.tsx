import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const createPlotlyComponent = require('react-plotly.js/factory');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Plotly = require('plotly.js-basic-dist-min');
import type { ControlState, CorrelationMatrix } from '../../types';
import { filterMatrix } from '../../utils/filterMatrix';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = createPlotlyComponent(Plotly as any);

type Props = {
  matrix: CorrelationMatrix;
  controls: ControlState;
};

export function HeatmapChart({ matrix, controls }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) setContainerWidth(width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered = filterMatrix(matrix, controls);
  const { columns, zMatrix, annotationMatrix } = filtered;

  const n = columns.length;
  const cellSize = Math.min(80, Math.max(28, Math.floor((containerWidth - 160) / n)));
  const plotSize = cellSize * n + 160;
  const fontSize = Math.max(8, Math.min(13, cellSize * 0.26));

  // Build hover text matrix
  const hoverText = columns.map((colA) =>
    columns.map((colB) => {
      const key = `${colA}||${colB}`;
      const entry = matrix.entries.get(key);
      if (!entry || isNaN(entry.r)) return `${colA} vs ${colB}<br>No data`;
      const pStr = isNaN(entry.pValue)
        ? 'n/a'
        : entry.pValue < 0.001
        ? '< 0.001'
        : entry.pValue.toFixed(3);
      return `<b>${colA}</b> vs <b>${colB}</b><br>r = ${entry.r.toFixed(4)}<br>p = ${pStr}<br>n = ${entry.n}`;
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trace: any = {
    type: 'heatmap',
    z: zMatrix,
    x: columns,
    y: columns,
    zmin: controls.colorScaleMin,
    zmax: controls.colorScaleMax,
    zmid: 0,
    colorscale: 'RdBu',
    reversescale: true,
    text: annotationMatrix,
    texttemplate: '%{text}',
    hovertext: hoverText,
    hovertemplate: '%{hovertext}<extra></extra>',
    showscale: true,
    colorbar: {
      thickness: 14,
      len: 0.85,
      tickfont: { color: '#94a3b8', size: 10 },
      tickvals: [-1, -0.5, 0, 0.5, 1],
    },
  };

  const layout = {
    width: plotSize,
    height: plotSize,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 100, r: 60, t: 40, b: 100 },
    font: { color: '#94a3b8', size: fontSize, family: 'ui-monospace, monospace' },
    xaxis: {
      tickangle: -45,
      side: 'bottom' as const,
      tickfont: { size: Math.max(8, fontSize - 1), color: '#cbd5e1' },
      gridcolor: 'rgba(255,255,255,0.04)',
    },
    yaxis: {
      tickfont: { size: Math.max(8, fontSize - 1), color: '#cbd5e1' },
      gridcolor: 'rgba(255,255,255,0.04)',
      autorange: 'reversed' as const,
    },
    hoverlabel: {
      bgcolor: '#1e293b',
      bordercolor: '#475569',
      font: { color: '#e2e8f0', size: 12 },
    },
  };

  const config = {
    displayModeBar: false,
    responsive: false,
  };

  return (
    <div ref={containerRef} className="w-full overflow-auto">
      <Plot
        data={[trace]}
        layout={layout}
        config={config}
        style={{ display: 'block' }}
      />
    </div>
  );
}

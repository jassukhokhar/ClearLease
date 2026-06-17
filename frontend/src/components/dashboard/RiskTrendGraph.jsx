import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * Lightweight inline SVG line chart of risk score over time (no chart library).
 * `data` = [{ date, score, name }] oldest → newest.
 */
const RiskTrendGraph = ({ data = [] }) => {
  const W = 520;
  const H = 160;
  const P = 24; // padding

  const { points, path } = useMemo(() => {
    if (data.length === 0) return { points: [], path: '' };
    const n = data.length;
    const stepX = n > 1 ? (W - P * 2) / (n - 1) : 0;
    const y = (score) => H - P - (score / 100) * (H - P * 2);
    const pts = data.map((d, i) => ({
      x: P + i * stepX,
      y: y(d.score),
      ...d,
    }));
    const d = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    return { points: pts, path: d };
  }, [data]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
          <TrendingUp className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Risk trend</h3>
      </div>

      {data.length < 2 ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
          Analyze a few leases to see your risk trend.
        </p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
          {/* gridlines at 0/50/100 */}
          {[0, 50, 100].map((g) => {
            const yy = H - P - (g / 100) * (H - P * 2);
            return (
              <g key={g}>
                <line
                  x1={P}
                  x2={W - P}
                  y1={yy}
                  y2={yy}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text x={4} y={yy + 3} fontSize="9" fill="#94a3b8">
                  {g}
                </text>
              </g>
            );
          })}
          <path d={path} fill="none" stroke="#4f46e5" strokeWidth="2" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill={p.score >= 60 ? '#e11d48' : p.score >= 25 ? '#f59e0b' : '#10b981'}
            >
              <title>{`${p.name}: ${p.score}/100`}</title>
            </circle>
          ))}
        </svg>
      )}
    </div>
  );
};

export default RiskTrendGraph;

import React, { useState, useEffect, useCallback } from 'react';
import { Animate } from 'react-move';
// inline ease — avoids d3-ease dependency
const easeExpOut = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
import './CalculatorSection.css';

const API = 'http://localhost:5001/api/calculator';

const PLAN_LABELS = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };
const PLAN_COLORS = { basic: '#8FB097', standard: '#6B8F71', premium: '#4A7C55' };

function fmt(n) {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n/100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function CalculatorSection() {
  const [companySize, setCompanySize] = useState(200);
  const [planType, setPlanType]       = useState('standard');
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);

  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companySize, planType }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback calculation
      const base = companySize * (planType === 'basic' ? 480 : planType === 'standard' ? 720 : 1080);
      const savings = Math.round(companySize * 1780 - base);
      const roi = Math.round((savings / base) * 100);
      setResult({ totalCost: base, netBenefit: savings, roiPercent: roi, breakevenMonths: Math.ceil(12 / (savings/base + 1)), totalBenefit: savings + base,
        chartData: Array.from({length:12},(_, i) => ({ month: i+1, cumulativeSaving: Math.round((savings/12)*(i+1)), cumulativeCost: Math.round((base/12)*(i+1)) })) });
    } finally {
      setLoading(false);
    }
  }, [companySize, planType]);

  useEffect(() => { calculate(); }, [calculate]);

  const maxChartVal = result ? Math.max(...result.chartData.map(d => Math.max(d.cumulativeSaving, d.cumulativeCost))) : 1;

  // SVG line graph dimensions
  const W = 560, H = 180, PAD = 32;
  const toX = (month) => PAD + ((month - 1) / 11) * (W - PAD * 2);
  const toY = (val) => H - PAD - (val / maxChartVal) * (H - PAD * 2);

  const buildPath = (key) => result?.chartData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.month)},${toY(d[key])}`).join(' ') || '';
  const buildArea = (key) => {
    const pts = result?.chartData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.month)},${toY(d[key])}`).join(' ') || '';
    const last = result?.chartData.at(-1);
    return last ? `${pts} L${toX(12)},${H - PAD} L${PAD},${H - PAD} Z` : '';
  };

  return (
    <section className="calculator-section section-pad" id="calculator">
      <div className="section-inner">
        <div className="calc-header reveal">
          <span className="eyebrow">ROI Calculator</span>
          <h2 className="section-title">See Your <em>Savings</em></h2>
          <p className="section-subtitle">For HR leaders: model the financial impact of Swasth India for your organization.</p>
        </div>

        <div className="calc-grid">
          {/* Controls */}
          <div className="calc-controls glass-card reveal reveal-delay-1">
            <div className="control-group">
              <label className="control-label">
                Company Size
                <strong className="control-val">{companySize.toLocaleString()} employees</strong>
              </label>
              <input
                type="range"
                min={10} max={10000} step={10}
                value={companySize}
                onChange={e => setCompanySize(Number(e.target.value))}
                className="calc-slider"
              />
              <div className="slider-ticks">
                <span>10</span><span>2,500</span><span>5,000</span><span>10,000</span>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Plan Type</label>
              <div className="plan-toggle">
                {Object.entries(PLAN_LABELS).map(([k, v]) => (
                  <button
                    key={k}
                    className={`plan-btn ${planType === k ? 'active' : ''}`}
                    onClick={() => setPlanType(k)}
                    style={planType === k ? { background: PLAN_COLORS[k] } : {}}
                  >{v}</button>
                ))}
              </div>
            </div>

            {result && (
              <Animate
                start={{ roi: 0, savings: 0, cost: 0 }}
                update={{ roi: [result.roiPercent], savings: [result.netBenefit], cost: [result.totalCost], timing: { duration: 900, ease: easeExpOut } }}
              >
                {({ roi, savings, cost }) => (
                  <div className="calc-results">
                    <div className="result-chip main">
                      <strong>{Math.round(roi)}%</strong>
                      <span>Annual ROI</span>
                    </div>
                    <div className="result-chip">
                      <strong>{fmt(Math.round(savings))}</strong>
                      <span>Net Benefit / Year</span>
                    </div>
                    <div className="result-chip">
                      <strong>{result.breakevenMonths}mo</strong>
                      <span>Break-even</span>
                    </div>
                    <div className="result-chip">
                      <strong>{fmt(Math.round(cost))}</strong>
                      <span>Annual Investment</span>
                    </div>
                  </div>
                )}
              </Animate>
            )}

            <a className="btn-primary calc-cta" href="#footer">Get a Custom Quote →</a>
          </div>

          {/* Line Chart */}
          <div className="calc-chart-wrap reveal reveal-delay-2">
            <div className="chart-legend">
              <span className="legend-item savings">● Net Cumulative Savings</span>
              <span className="legend-item cost">● Investment Cost</span>
            </div>
            {result && (
              <Animate
                start={{ progress: 0 }}
                update={{ progress: [1], timing: { duration: 1200, ease: easeExpOut } }}
                key={`${companySize}-${planType}`}
              >
                {({ progress }) => (
                  <svg viewBox={`0 0 ${W} ${H}`} className="roi-svg" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75, 1].map(f => (
                      <line key={f} x1={PAD} y1={toY(maxChartVal*f)} x2={W-PAD} y2={toY(maxChartVal*f)}
                        stroke="rgba(44,44,44,0.07)" strokeWidth="1" strokeDasharray="4,4" />
                    ))}
                    {/* Month labels */}
                    {[1,3,6,9,12].map(m => (
                      <text key={m} x={toX(m)} y={H-8} textAnchor="middle" fontSize="9" fill="rgba(44,44,44,0.4)">{m === 1 ? 'Jan' : m === 12 ? 'Dec' : `M${m}`}</text>
                    ))}
                    {/* Savings area */}
                    <path d={buildArea('cumulativeSaving')} fill="rgba(107,143,113,0.12)" />
                    {/* Savings line with animated clipPath */}
                    <defs>
                      <clipPath id={`clip-savings-${companySize}`}>
                        <rect x={PAD} y={0} width={(W - PAD * 2) * progress} height={H} />
                      </clipPath>
                    </defs>
                    <path d={buildPath('cumulativeSaving')} fill="none" stroke="#6B8F71" strokeWidth="2.5" strokeLinecap="round"
                      clipPath={`url(#clip-savings-${companySize})`} />
                    {/* Cost line */}
                    <path d={buildPath('cumulativeCost')} fill="none" stroke="#E8DCC8" strokeWidth="2" strokeLinecap="round" strokeDasharray="6,4"
                      clipPath={`url(#clip-savings-${companySize})`} />
                    {/* Breakeven marker */}
                    {result.breakevenMonths <= 12 && (
                      <g>
                        <line x1={toX(result.breakevenMonths)} y1={PAD} x2={toX(result.breakevenMonths)} y2={H-PAD}
                          stroke="rgba(196,163,90,0.5)" strokeWidth="1" strokeDasharray="4,3" />
                        <text x={toX(result.breakevenMonths)+4} y={PAD+10} fontSize="8" fill="#C4A35A">breakeven</text>
                      </g>
                    )}
                  </svg>
                )}
              </Animate>
            )}
            {loading && <div className="chart-loading">Calculating…</div>}
            <p className="chart-note">Projections based on KPMG India Maternal Health benchmarks · All figures in INR</p>
          </div>
        </div>
      </div>
    </section>
  );
}

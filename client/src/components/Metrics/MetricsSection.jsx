import React, { useEffect, useState, useRef } from 'react';
import { Animate } from 'react-move';
// inline ease — no d3-ease dependency needed
const easeExpOut = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
import './MetricsSection.css';

const API = 'http://localhost:5001/api/metrics';

const FALLBACK = [
  { label:'Lives Touched', display:'10M+', value:10, unit:'M+', description:'Members supported across India' },
  { label:'Care Sessions', display:'2.4M+', value:2.4, unit:'M+', description:'Virtual & in-person sessions' },
  { label:'Specialists', display:'1,200+', value:1200, unit:'+', description:'Board-certified providers' },
  { label:'Employer Partners', display:'350+', value:350, unit:'+', description:'Corporates offering Swasth' },
  { label:'CSAT Score', display:'4.9/5', value:4.9, unit:'/5', description:'Member satisfaction rating' },
  { label:'Cost Reduction', display:'40%', value:40, unit:'%', description:'Average healthcare cost savings' },
];

function AnimatedBar({ value, maxVal, inView, color }) {
  return (
    <Animate
      start={{ height: 0, opacity: 0 }}
      update={{
        height: [inView ? (value / maxVal) * 100 : 0],
        opacity: [inView ? 1 : 0],
        timing: { duration: 1200, delay: 200, ease: easeExpOut },
      }}
    >
      {({ height, opacity }) => (
        <div
          className="metric-bar-fill"
          style={{ height: `${height}%`, opacity, background: color }}
        />
      )}
    </Animate>
  );
}

function AnimatedNumber({ target, inView, suffix = '' }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1600;
    const from = target * 0.3;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplayed(+(from + (target - from) * eased).toFixed(1));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, target]);

  return <span>{displayed}{suffix}</span>;
}

export default function MetricsSection() {
  const [metrics, setMetrics] = useState(FALLBACK);
  const [inView, setInView]   = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(data => { if (data?.length) setMetrics(data.slice(0,6)); }).catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.25 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const maxVal = Math.max(...metrics.map(m => Number(m.value) || 0));

  const barColors = ['#6B8F71','#8FB097','#C8DEC9','#E8DCC8','#C4A35A','#B8D4E0'];

  return (
    <section className="metrics-section" id="metrics" ref={sectionRef}>
      <div className="section-inner">
        <div className="metrics-header reveal">
          <span className="eyebrow">Our Impact</span>
          <h2 className="section-title">Transforming Lives,<br/><em>at Scale</em></h2>
          <p className="section-subtitle">Data-driven care that makes a measurable difference across every stage of the journey.</p>
        </div>

        {/* Marquee row */}
        <div className="metrics-marquee-wrap">
          <div className="metrics-marquee">
            {[...metrics,...metrics].map((m, i) => (
              <div key={i} className="marquee-chip">
                <strong>{m.display || m.label}</strong>
                <span>{m.description || m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="metrics-bars-wrap reveal reveal-delay-2">
          <div className="metrics-bars">
            {metrics.map((m, i) => (
              <div key={m.label || i} className="metric-bar-col">
                <div className="metric-bar-track">
                  <AnimatedBar value={Number(m.value)||0} maxVal={maxVal||100} inView={inView} color={barColors[i % barColors.length]} />
                </div>
                <div className="metric-bar-label">
                  <strong className="metric-num">
                    {inView ? <AnimatedNumber target={Number(m.value)||0} inView={inView} suffix={m.unit || ''} /> : '—'}
                  </strong>
                  <span>{m.label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="metrics-source">Source: Swasth India platform analytics, Q1 2026</p>
        </div>
      </div>
    </section>
  );
}

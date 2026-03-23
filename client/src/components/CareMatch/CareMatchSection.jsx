import React, { useState, useEffect, useRef } from 'react';
import { NodeGroup } from 'react-move';
// inline easing — avoids d3-ease dependency
const easeExpOut  = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeBackOut = (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
import './CareMatchSection.css';

const API = `${import.meta.env.VITE_API_BASE || 'http://localhost:5001'}/api/providers`;

const FILTERS = ['All', 'OB-GYN', 'Midwife', 'Doula', 'Pediatrics', 'Mental Health', 'Lactation'];

const MOCK = [
  { _id:'1', name:'Dr. Priya Sharma', specialty:'OB-GYN', sub:'High-Risk Pregnancy', location:'Mumbai', rating:4.9, reviews:312, yearsExp:14, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=priya', available:true },
  { _id:'2', name:'Meena Krishnan', specialty:'Midwife', sub:'Water Birth', location:'Bangalore', rating:4.8, reviews:198, yearsExp:9, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=meena', available:true },
  { _id:'3', name:'Ananya Desai', specialty:'Doula', sub:'Postpartum Support', location:'Remote', rating:5.0, reviews:87, yearsExp:6, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=ananya', available:true },
  { _id:'4', name:'Dr. Rohit Menon', specialty:'Pediatrics', sub:'Neonatal Care', location:'Chennai', rating:4.7, reviews:256, yearsExp:12, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=rohit', available:true },
  { _id:'5', name:'Sunita Kapoor', specialty:'Mental Health', sub:'Perinatal Psychiatry', location:'Remote', rating:4.9, reviews:143, yearsExp:10, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=sunita', available:true },
  { _id:'6', name:'Dr. Kavitha Rao', specialty:'OB-GYN', sub:'Fertility & IVF', location:'Hyderabad', rating:4.8, reviews:289, yearsExp:16, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=kavitha', available:true },
  { _id:'7', name:'Lakshmi Nair', specialty:'Lactation', sub:'IBCLC Consultant', location:'Remote', rating:5.0, reviews:201, yearsExp:8, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=lakshmi', available:true },
  { _id:'8', name:'Dr. Arjun Bedi', specialty:'Pediatrics', sub:'Developmental', location:'Delhi', rating:4.6, reviews:178, yearsExp:11, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=arjun', available:true },
  { _id:'9', name:'Preeti Joshi', specialty:'Mental Health', sub:'Trauma & Grief', location:'Remote', rating:4.9, reviews:112, yearsExp:7, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=preeti', available:true },
];

const SPEC_COLORS = { 'OB-GYN':'#B8D4E0','Midwife':'#C8DEC9','Doula':'#E8C4B8','Pediatrics':'#D4E8B8','Mental Health':'#D8C8E8','Lactation':'#E8D8B8' };

export default function CareMatchSection() {
  const [providers, setProviders] = useState(MOCK);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filtered, setFiltered] = useState(MOCK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(d => { if(d?.length) setProviders(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    const data = activeFilter === 'All' ? providers : providers.filter(p =>
      p.specialty === activeFilter || (p.tags && p.tags.includes(activeFilter))
    );
    setFiltered(data);
  }, [activeFilter, providers]);

  return (
    <section className="carematch-section section-pad" id="care-match">
      <div className="section-inner">
        <div className="carematch-header reveal">
          <span className="eyebrow">Care Match</span>
          <h2 className="section-title">Find Your <em>Perfect Specialist</em></h2>
          <p className="section-subtitle">Matched by specialty, availability, and fit. Every provider is board-certified and vetted.</p>
        </div>

        {/* Filter bar */}
        <div className="carematch-filters reveal reveal-delay-1">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* NodeGroup — React Move FLIP grid animation */}
        <div className="providers-grid">
          <NodeGroup
            data={filtered}
            keyAccessor={d => d._id}
            start={() => ({ opacity: 0, scale: 0.88, y: 20 })}
            enter={() => ({ opacity: [1], scale: [1], y: [0], timing: { duration: 480, ease: easeBackOut } })}
            update={() => ({ opacity: [1], scale: [1], y: [0], timing: { duration: 360, ease: easeExpOut } })}
            leave={() => ({ opacity: [0], scale: [0.85], y: [-20], timing: { duration: 300, ease: easeExpOut } })}
          >
            {nodes => (
              <>
                {nodes.map(({ key, data: p, state: { opacity, scale, y } }) => (
                  <div
                    key={key}
                    className="provider-card"
                    style={{ opacity, transform: `translateY(${y}px) scale(${scale})` }}
                  >
                    <div className="pc-header" style={{ background: SPEC_COLORS[p.specialty] || '#E8DCC8' }}>
                      <img src={p.avatar} alt={p.name} className="pc-avatar" />
                      <div className={`pc-availability ${p.available ? 'available' : ''}`}>
                        {p.available ? '● Available' : '○ Waitlist'}
                      </div>
                    </div>
                    <div className="pc-body">
                      <div className="pc-specialty-badge">{p.specialty}</div>
                      <h3 className="pc-name">{p.name}</h3>
                      <p className="pc-sub">{p.sub}</p>
                      <div className="pc-meta">
                        <span>📍 {p.location}</span>
                        <span>⭐ {p.rating} ({p.reviews})</span>
                        <span>🎓 {p.yearsExp}yr exp</span>
                      </div>
                      <button className="btn-primary pc-cta">Request Match</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </NodeGroup>
        </div>

        <div className="carematch-footer reveal">
          <p>Showing {filtered.length} specialists · <a href="#">View all 1,200+ providers →</a></p>
        </div>
      </div>
    </section>
  );
}

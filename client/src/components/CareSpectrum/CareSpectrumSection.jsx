import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './CareSpectrumSection.css';

const STAGES = [
  {
    id: 'preconception',
    label: 'Preconception',
    emoji: '🌱',
    tagline: 'Building the Foundation',
    color: '#C8DEC9',
    bg: 'linear-gradient(135deg, #F0F7F1 0%, #E8F4EA 100%)',
    description: 'Fertility awareness, nutritional counseling, genetic screening, and mental health preparation. We help you begin your journey with clarity and confidence.',
    cards: ['Fertility Consultations', 'Nutritional Planning', 'Genetic Counseling', 'Mental Wellness Prep'],
    stat: '3.2x',
    statLabel: 'better outcomes with preconception care',
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy',
    emoji: '🌸',
    tagline: 'Nurturing Every Moment',
    color: '#E8C4B8',
    bg: 'linear-gradient(135deg, #FDF5F3 0%, #FAEAE5 100%)',
    description: 'From your first trimester to birth planning — access midwives, doulas, OB-GYNs, and mental health specialists who know your complete story.',
    cards: ['Prenatal Check-ins', 'Birth Planning', 'Mental Health Support', 'Partner Inclusion'],
    stat: '60%',
    statLabel: 'reduction in unplanned C-sections',
  },
  {
    id: 'pediatrics',
    label: 'Pediatrics',
    emoji: '🌼',
    tagline: 'Growing Together',
    color: '#B8D4E0',
    bg: 'linear-gradient(135deg, #F2F8FB 0%, #E5F2F7 100%)',
    description: 'Lactation support, postpartum recovery, newborn care coaching, developmental pediatrics, and ongoing family wellness through the first five years.',
    cards: ['Lactation Support', 'Postpartum Recovery', 'Newborn Coaching', 'Developmental Tracking'],
    stat: '4.8★',
    statLabel: 'pediatric care satisfaction score',
  },
];

export default function CareSpectrumSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const blobX = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);

  const stage = STAGES[active];

  const cardVariants = {
    hidden:   { opacity: 0, y: 24, scale: 0.95 },
    visible:  (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.1, duration: 0.55, ease: [0.16,1,0.3,1] } }),
    exit:     { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.3 } },
  };

  return (
    <section className="spectrum-section" id="care-spectrum" ref={sectionRef}>
      {/* Parallax blob that moves horizontally opposite to vertical scroll */}
      <motion.div className="spectrum-bg-blob" style={{ x: blobX }} />

      <div className="section-inner">
        <div className="spectrum-header reveal">
          <span className="eyebrow">The Care Spectrum</span>
          <h2 className="section-title">Every Stage of<br/><em>Your Journey</em></h2>
        </div>

        {/* Stage tabs */}
        <div className="spectrum-tabs">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              className={`spectrum-tab ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
              style={{ '--tab-color': s.color }}
            >
              <span className="tab-emoji">{s.emoji}</span>
              <span className="tab-label">{s.label}</span>
              {active === i && <motion.div className="tab-indicator" layoutId="tabIndicator" />}
            </button>
          ))}
        </div>

        {/* Stage content — AnimatePresence for Theatre.js-style transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            className="spectrum-stage"
            style={{ background: stage.bg }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
          >
            <div className="stage-left">
              <span className="stage-emoji">{stage.emoji}</span>
              <h3 className="stage-tagline">{stage.tagline}</h3>
              <p className="stage-desc">{stage.description}</p>
              <div className="stage-stat">
                <strong style={{ color: stage.color === '#C8DEC9' ? '#4A7C55' : stage.color === '#E8C4B8' ? '#B06040' : '#3A7090' }}>
                  {stage.stat}
                </strong>
                <span>{stage.statLabel}</span>
              </div>
              <button className="btn-primary" style={{ marginTop: '2rem' }}>
                Explore {stage.label} Care →
              </button>
            </div>

            <div className="stage-right">
              <AnimatePresence mode="popLayout">
                {stage.cards.map((card, i) => (
                  <motion.div
                    key={`${stage.id}-${card}`}
                    className="stage-card"
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="stage-card-icon" style={{ background: stage.color }}>
                      {i === 0 ? '💬' : i === 1 ? '📋' : i === 2 ? '🧘' : '👥'}
                    </div>
                    <span>{card}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import HeroSection from './components/Hero/HeroSection';
import MetricsSection from './components/Metrics/MetricsSection';
import CareSpectrumSection from './components/CareSpectrum/CareSpectrumSection';
import StoriesSection from './components/Stories/StoriesSection';
import CareMatchSection from './components/CareMatch/CareMatchSection';
import CalculatorSection from './components/Calculator/CalculatorSection';
import FooterSection from './components/Footer/FooterSection';

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global reveal-on-scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* ── FLOATING NAV ── */}
      <nav className={`swasth-nav ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav-logo">
          <div className="nav-logo-icon">स</div>
          <span className="nav-logo-text">Swasth <em>India</em></span>
        </div>
        <ul className="nav-links">
          {[['metrics','Impact'],['care-spectrum','Care'],['stories','Stories'],['care-match','Specialists'],['calculator','ROI']].map(([id,label]) => (
            <li key={id}><a href={`#${id}`} onClick={e=>{e.preventDefault();scrollTo(id)}}>{label}</a></li>
          ))}
        </ul>
        <a className="nav-cta btn-primary" href="#footer" onClick={e=>{e.preventDefault();scrollTo('footer')}}>Get Started</a>
      </nav>

      <main>
        <HeroSection />
        <MetricsSection />
        <CareSpectrumSection />
        <StoriesSection />
        <CareMatchSection />
        <CalculatorSection />
      </main>
      <FooterSection />
    </>
  );
}

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './FooterSection.css';

const LINKS = {
  'For Members':  ['How It Works', 'Find a Specialist', 'Member Stories', 'Pricing', 'Download App'],
  'For Employers':['Benefits Overview', 'ROI Calculator', 'Case Studies', 'HR Resources', 'Request Demo'],
  'Company':      ['About Us', 'Our Providers', 'Careers', 'Press', 'Blog'],
  'Legal':        ['Privacy Policy', 'Terms of Use', 'HIPAA Notice', 'Accessibility'],
};

export default function FooterSection() {
  const [formData, setFormData] = useState({ name:'', email:'', company:'', role:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const contentY = useTransform(scrollYProgress, [0.75, 1], [0, -40]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5001'}/api/leads`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ ...formData, message:'Website lead form' }),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <footer className="site-footer" id="footer">
      {/* Sticky footer revealed underneath — using z-index layering */}
      <div className="footer-fixed-bg" />

      <motion.div className="footer-main" style={{ y: contentY }}>
        <div className="footer-inner section-inner">

          {/* Lead gen form */}
          <div className="footer-lead">
            <div className="footer-lead-text">
              <span className="eyebrow">Get Started</span>
              <h2 className="footer-lead-title">Ready to transform<br/><em>women's health</em><br/>at your company?</h2>
            </div>

            <motion.div
              className="lead-form-card glass-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {submitted ? (
                <div className="form-success">
                  <span>🌸</span>
                  <h3>Thank you!</h3>
                  <p>Our team will reach out within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="lead-form">
                  <h3 className="form-title">Request a Demo</h3>
                  <div className="form-row">
                    <input placeholder="Your name *" required value={formData.name} onChange={e => setFormData(d => ({...d, name: e.target.value}))} className="form-input" />
                    <input placeholder="Work email *" type="email" required value={formData.email} onChange={e => setFormData(d => ({...d, email: e.target.value}))} className="form-input" />
                  </div>
                  <div className="form-row">
                    <input placeholder="Company" value={formData.company} onChange={e => setFormData(d => ({...d, company: e.target.value}))} className="form-input" />
                    <input placeholder="Your role" value={formData.role} onChange={e => setFormData(d => ({...d, role: e.target.value}))} className="form-input" />
                  </div>
                  <button type="submit" className="btn-primary form-submit" disabled={loading}>
                    {loading ? 'Sending…' : 'Schedule Demo →'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Footer nav links */}
          <div className="footer-links-grid">
            {Object.entries(LINKS).map(([group, items]) => (
              <div key={group} className="footer-col">
                <h4 className="footer-col-title">{group}</h4>
                <ul>
                  {items.map(item => <li key={item}><a href="#">{item}</a></li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <div className="footer-brand">
              <div className="nav-logo-icon" style={{ width:32, height:32, fontSize:'0.85rem' }}>स</div>
              <div>
                <div className="footer-brand-name">Swasth <em>India</em></div>
                <div className="footer-brand-sub">Redefining Women's Healthcare</div>
              </div>
            </div>
            <div className="footer-socials">
              {['𝕏', 'in', '📸', '▶'].map(s => (
                <a key={s} href="#" className="social-btn">{s}</a>
              ))}
            </div>
            <div className="footer-legal">
              <span>© 2026 Swasth India Health Inc.</span>
              <span>·</span>
              <a href="#">Privacy</a>
              <span>·</span>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

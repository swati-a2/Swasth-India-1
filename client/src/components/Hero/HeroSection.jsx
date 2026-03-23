import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import LifeBlob from './LifeBlob';
import './HeroSection.css';

export default function HeroSection() {
  const mouse = useRef({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const { scrollY } = useScroll();
  // Canvas: parallax at 0.2x — barely moves
  const canvasY  = useTransform(scrollY, [0, 800], [0, -160]);
  // Text moves at full 1x — faster departure, creating depth
  const textY    = useTransform(scrollY, [0, 600], [0, -80]);
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width)  * 2 - 1;
    const y = -((clientY - top) / height) * 2 + 1;
    setMousePos({ x, y });
  };

  // Theatre.js-style stagger entrance (using Framer Motion in lieu of Theatre.js studio)
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: 32, filter: 'blur(4px)' },
    visible:  { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16,1,0.3,1] } },
  };
  const letterVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.16,1,0.3,1] } },
  };

  const headline = "Swasth India";

  return (
    <section className="hero-section" id="hero" ref={sectionRef} onMouseMove={handleMouseMove}>

      {/* 3D Canvas — deepest layer, slowest parallax */}
      <motion.div className="hero-canvas-wrap" style={{ y: canvasY }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 3]} intensity={1.2} color="#C8DEC9" />
            <pointLight position={[-4, -2, 2]} intensity={0.8} color="#E8DCC8" />
            <LifeBlob mouseX={mousePos.x} mouseY={mousePos.y} />
            <Environment preset="forest" />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Organic background blobs (CSS) */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      {/* TEXT LAYER — standard scroll speed (1x) */}
      <motion.div className="hero-content" style={{ y: textY, opacity: textOpacity }}>
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="eyebrow hero-eyebrow" variants={itemVariants}>
            ✦ Redefining Women's Healthcare in India
          </motion.span>

          {/* Animated headline — letter by letter */}
          <h1 className="hero-headline" aria-label={headline}>
            {headline.split('').map((char, i) => (
              <motion.span
                key={i}
                className="hero-letter"
                variants={letterVariants}
                style={char === ' ' ? { display: 'inline-block', width: '0.3em' } : {}}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.p className="hero-tagline" variants={itemVariants}>
            From preconception to pediatrics — a complete ecosystem of care, <br />
            designed around you and the people you love most.
          </motion.p>

          <motion.div className="hero-ctas" variants={itemVariants}>
            <a className="btn-primary hero-btn" href="#care-spectrum">Start Your Journey</a>
            <a className="btn-outline hero-btn" href="#care-match">Meet Specialists ↗</a>
          </motion.div>

          <motion.div className="hero-stats" variants={containerVariants}>
            {[['10M+', 'Lives Touched'], ['1,200+', 'Specialists'], ['4.9★', 'Member Rating']].map(([num, label]) => (
              <motion.div key={label} className="hero-stat" variants={itemVariants}>
                <strong>{num}</strong>
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        style={{ opacity: textOpacity }}
      >
        <div className="scroll-dot" />
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
}

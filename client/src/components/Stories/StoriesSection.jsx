import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { motion } from 'framer-motion';
import MemberComposition from './MemberComposition';
import './StoriesSection.css';

const STORIES = [
  { id:'s1', name:'Priya R.',    since:'2022', highlight:'High-risk pregnancy, healthy delivery', quote:'"I had 24/7 access to my midwife via chat. That peace of mind was priceless."', role:'Software Engineer, Bengaluru' },
  { id:'s2', name:'Deepa M.',    since:'2023', highlight:'Postpartum mental health support', quote:'"I was struggling silently. My therapist through Swasth helped me find myself again."', role:'Teacher, Pune' },
  { id:'s3', name:'Aruna & Siva', since:'2021', highlight:'IVF journey to parenthood', quote:'"After 3 years of trying, the fertility specialist on Swasth finally understood us."', role:'Entrepreneurs, Chennai' },
];

export default function StoriesSection() {
  const [playing, setPlaying] = useState(null);

  return (
    <section className="stories-section" id="stories">
      <div className="section-inner">
        <div className="stories-header reveal">
          <span className="eyebrow">Member Stories</span>
          <h2 className="section-title">Real People.<br/><em>Real Transformations.</em></h2>
          <p className="section-subtitle">Every number in our metrics is a person whose life changed for the better.</p>
        </div>

        <div className="stories-grid">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              className={`story-card reveal reveal-delay-${i+1} ${playing === story.id ? 'playing' : ''}`}
              onHoverStart={() => setPlaying(story.id)}
              onHoverEnd={() => setPlaying(null)}
              whileHover={{ scale: 1.02, y: -6 }}
              transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
            >
              {/* Remotion Player — hover to play */}
              <div className="story-player-wrap">
                <Player
                  component={MemberComposition}
                  inputProps={{ memberName: story.name, memberSince: story.since, highlight: story.highlight }}
                  durationInFrames={150}
                  compositionWidth={640}
                  compositionHeight={360}
                  fps={30}
                  style={{ width:'100%', borderRadius:'var(--radius-lg) var(--radius-lg) 0 0', overflow:'hidden' }}
                  controls={false}
                  autoPlay={playing === story.id}
                  loop
                />
                <div className={`story-play-hint ${playing === story.id ? 'hidden' : ''}`}>
                  <div className="play-circle">▶</div>
                  <span>Hover to play</span>
                </div>
              </div>

              <div className="story-meta">
                <div className="story-quote">{story.quote}</div>
                <div className="story-author">
                  <div className="story-avatar">{story.name.charAt(0)}</div>
                  <div>
                    <strong>{story.name}</strong>
                    <span>{story.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

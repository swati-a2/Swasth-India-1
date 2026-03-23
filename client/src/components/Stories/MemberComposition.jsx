import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Video } from 'remotion';

// Remotion composition — React components rendered as video frames
export default function MemberComposition({ memberName = 'Priya R.', memberSince = '2022', highlight = 'Smooth pregnancy journey' }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Opacity for the overlay fades in at 0.5s, out at end
  const overlayOpacity = interpolate(frame, [0, fps * 0.5, durationInFrames - fps * 0.5, durationInFrames], [0, 1, 1, 0], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  // Name badge slides in from left
  const badgeX = interpolate(frame, [fps * 0.3, fps * 0.9], [-120, 0], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  // Caption fades line by line
  const cap1Opacity = interpolate(frame, [fps * 1.0, fps * 1.5], [0, 1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  const cap2Opacity = interpolate(frame, [fps * 1.8, fps * 2.3], [0, 1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  // Progress bar
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a2a1a 0%, #2C3E2D 100%)', fontFamily: 'Inter,sans-serif', overflow: 'hidden' }}>
      {/* Textured background */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 80% at 30% 50%, rgba(107,143,113,0.2) 0%, transparent 60%)' }} />

      {/* Member avatar placeholder */}
      <div style={{ position:'absolute', right:'-5%', top:'5%', width:'55%', height:'90%', borderRadius:'40px', background:'linear-gradient(135deg, rgba(107,143,113,0.3), rgba(200,222,201,0.15))', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', opacity: overlayOpacity }}>
        🌸
      </div>

      {/* Member badge */}
      <div style={{ position:'absolute', bottom:'2rem', left:'1.5rem', transform:`translateX(${badgeX}px)`, opacity: overlayOpacity }}>
        <div style={{ background:'rgba(107,143,113,0.85)', backdropFilter:'blur(12px)', borderRadius:'12px', padding:'0.75rem 1.25rem', color:'white', fontSize:'0.75rem' }}>
          <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.2rem' }}>{memberName}</div>
          <div style={{ opacity:0.75 }}>Member since {memberSince} · {highlight}</div>
        </div>
      </div>

      {/* Captions */}
      <div style={{ position:'absolute', bottom:'5.5rem', left:'1.5rem', maxWidth:'45%' }}>
        <div style={{ background:'rgba(0,0,0,0.55)', borderRadius:'8px', padding:'0.6rem 1rem', marginBottom:'0.5rem', opacity: cap1Opacity, color:'white', fontSize:'0.85rem', lineHeight:1.5 }}>
          "Swasth India completely changed how I felt about my pregnancy—"
        </div>
        <div style={{ background:'rgba(0,0,0,0.55)', borderRadius:'8px', padding:'0.6rem 1rem', opacity: cap2Opacity, color:'white', fontSize:'0.85rem', lineHeight:1.5 }}>
          "—from scared to supported, every single step."
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position:'absolute', bottom:0, left:0, height:'3px', width:`${progress * 100}%`, background:'linear-gradient(90deg, #6B8F71, #C8DEC9)', transition:'width 0.05s' }} />
    </AbsoluteFill>
  );
}

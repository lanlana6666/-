/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Wind, HelpCircle, Eye, EyeOff, Sliders, Moon, Sparkles, Feather } from 'lucide-react';

export type BackgroundPreset = 'gilt-flow' | 'spring-drift' | 'golden-milling' | 'zen-mist' | 'minimal-still';

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  opacity: number;
  color: string;
  swayRange: number;
  swaySpeed: number;
  swayOffset: number;
}

interface SpiceParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  pulseSpeed: number;
  pulseOffset: number;
}

export default function DynamicBackground() {
  const [preset, setPreset] = useState<BackgroundPreset>('gilt-flow');
  const [intensity, setIntensity] = useState<number>(1.2); // Speed multiplier
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [videoBg, setVideoBg] = useState<'gilt' | 'stream' | 'bamboo' | 'none'>('gilt');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track mouse coordinates for wind force
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0, active: false });
  
  // Refs for particle animation loops to avoid state refresh issues
  const presetRef = useRef<BackgroundPreset>(preset);
  const intensityRef = useRef<number>(intensity);
  const isVisibleRef = useRef<boolean>(isVisible);

  useEffect(() => {
    presetRef.current = preset;
  }, [preset]);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Handle ambient mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Calculate cursor velocity
      if (mouse.px !== 0 && mouse.py !== 0) {
        mouse.vx = (e.clientX - mouse.px) * 0.15;
        mouse.vy = (e.clientY - mouse.py) * 0.15;
      }
      mouse.px = e.clientX;
      mouse.py = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.vx = 0;
      mouseRef.current.vy = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Canvas Drawing & Animating Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // ResizeObserver on the dynamic background container
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        width = canvas.width = entryWidth || window.innerWidth;
        height = canvas.height = entryHeight || window.innerHeight;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initialize custom design particles
    const leafParticles: LeafParticle[] = [];
    const spiceParticles: SpiceParticle[] = [];

    const leafColors = [
      '#5C633F', // Deep matcha
      '#8A9A5B', // Fresh sage green
      '#A3B86C', // Pale matcha leaf
      '#C4D300', // Autumn golden moss
      '#7D8B55', // Wood moss
    ];

    const spiceColors = [
      'rgba(200, 211, 0, 0.4)',  // Semi-transparent golden dust
      'rgba(92, 99, 63, 0.35)',   // Soft matcha green powder
      'rgba(138, 154, 91, 0.3)',  // Sage powder glow
      'rgba(232, 234, 224, 0.5)', // Pure misty white steam
    ];

    // Build lists of tea leaf structures
    const maxLeaves = 48;
    for (let i = 0; i < maxLeaves; i++) {
      leafParticles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 6, // 6px to 14px size leaf
        speedY: Math.random() * 0.7 + 0.4,
        speedX: Math.random() * 0.4 - 0.2,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
        opacity: Math.random() * 0.42 + 0.18,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        swayRange: Math.random() * 30 + 15,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    // Build micro matcha mineral specs
    const maxSpices = 60;
    for (let i = 0; i < maxSpices; i++) {
      spiceParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        speedY: -(Math.random() * 0.5 + 0.2), // Rising up like vapor steam
        speedX: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.5 + 0.1,
        color: spiceColors[Math.floor(Math.random() * spiceColors.length)],
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Function to draw beautiful vector tea leaf curve shapes
    const drawLeaf = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.globalAlpha = alpha;
      c.fillStyle = color;

      c.beginPath();
      // Draw standard stylized teardrop lanceolate tea leaf shape using bezier curves
      c.moveTo(0, -size);
      
      // Left side curve of leaf
      c.bezierCurveTo(-size * 0.65, -size * 0.3, -size * 0.75, size * 0.3, 0, size);
      
      // Right side curve of leaf
      c.bezierCurveTo(size * 0.75, size * 0.3, size * 0.65, -size * 0.3, 0, -size);
      
      c.fill();

      // Draw delicate central leaf spine/vein
      c.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, -size);
      c.lineTo(0, size * 0.82);
      c.stroke();

      c.restore();
    };

    // Function to draw beautiful irregular gold foil flakes
    const drawGoldFlake = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      
      // 3D-like metallic shadow glow
      c.shadowColor = 'rgba(212, 175, 55, 0.45)';
      c.shadowBlur = 6;

      c.beginPath();
      // Irregular gold foil tears polygon structure
      c.moveTo(-size * 0.6, -size * 0.5);
      c.lineTo(size * 0.7, -size * 0.7);
      c.lineTo(size * 0.9, size * 0.3);
      c.lineTo(size * 0.2, size * 0.85);
      c.lineTo(-size * 0.8, size * 0.6);
      c.closePath();
      c.fill();
      c.restore();
    };

    let time = 0;
    let windAccumX = 0;

    const tick = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const currentPreset = presetRef.current;
      const speedMult = intensityRef.current;

      // Dynamic wind velocity from mouse movements
      const mouse = mouseRef.current;
      const windForceX = mouse.active ? mouse.vx * 0.45 : 0;
      const windForceY = mouse.active ? mouse.vy * 0.42 : 0;

      // Draw flowing horizontal water waves & volumetric liquid bodies across the full canvas area
      if (isVisibleRef.current && currentPreset !== 'minimal-still') {
        windAccumX += windForceX * 0.1;
        
        // --- Part A: Volumetric Liquid Flowing Bodies (3 Overlapping Parallax Gradient Waves) ---
        const numLiquidLayers = 3;
        for (let i = 0; i < numLiquidLayers; i++) {
          ctx.beginPath();
          
          // Generate a smooth gradient representive of high-end tea liquor flowing
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          if (i === 0) {
            // Upper layer (very soft pastel green water body)
            grad.addColorStop(0, 'rgba(199, 220, 167, 0.05)');
            grad.addColorStop(0.5, 'rgba(138, 154, 91, 0.01)');
            grad.addColorStop(1, 'rgba(199, 220, 167, 0.04)');
          } else if (i === 1) {
            // Mid layer (soothing mist flow)
            grad.addColorStop(0, 'rgba(138, 154, 91, 0.025)');
            grad.addColorStop(0.6, 'rgba(199, 220, 167, 0.035)');
            grad.addColorStop(1, 'rgba(92, 99, 63, 0.015)');
          } else {
            // Heavy deep layer (silky Matcha liquor river)
            grad.addColorStop(0, 'rgba(199, 220, 167, 0.01)');
            grad.addColorStop(0.4, 'rgba(92, 99, 63, 0.03)');
            grad.addColorStop(1, 'rgba(138, 154, 91, 0.05)');
          }
          ctx.fillStyle = grad;

          // Draw the fluid body curve
          ctx.moveTo(0, height);
          
          const speedFactor = (0.24 - i * 0.06) * speedMult;
          const waveFreq = 0.0018 + i * 0.0008;
          const waveAmp = 40 + i * 18;
          const verticalCenter = (height * 0.2) + (i * (height * 0.24));

          for (let x = 0; x <= width + 40; x += 30) {
            const flowOffset = (time * speedFactor) + (i * 3.4) + windAccumX;
            const waveValue1 = Math.sin(x * waveFreq + flowOffset);
            const waveValue2 = Math.cos(x * waveFreq * 1.8 - flowOffset * 0.5) * 0.4;
            const y = verticalCenter + (waveValue1 + waveValue2) * waveAmp;
            ctx.lineTo(x, y);
          }

          // Complete polygon down to screen bottom to fill the volumetric body
          ctx.lineTo(width + 40, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();
        }

        // --- Part B: Linear Ripple Contours (Surface Tension Lines) ---
        const waveSpacing = 240; 
        const numWaveBands = Math.ceil(height / waveSpacing) + 1;

        for (let band = 0; band <= numWaveBands; band++) {
          const yc = band * waveSpacing - 10;
          
          // Foreground fine shimmering water refraction line
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(210, 222, 193, 0.07)'; 
          ctx.lineWidth = 1.4;
          for (let x = 0; x <= width + 40; x += 30) {
            const phaseOffset = band * 0.52;
            const flowOffset = (time * 0.38 * speedMult) + windAccumX;
            const wave1 = Math.sin(x * 0.0028 + flowOffset + phaseOffset) * 22;
            const wave2 = Math.cos(x * 0.0055 - flowOffset * 0.6 + phaseOffset * 1.3) * 7;
            const y = yc + wave1 + wave2;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Delicate bottom reflection highlight
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(138, 154, 91, 0.03)';
          ctx.lineWidth = 0.8;
          for (let x = 0; x <= width + 40; x += 40) {
            const phaseOffset = band * 1.1 + 0.8;
            const flowOffset = (time * 0.25 * speedMult) + windAccumX * 1.15;
            const wave1 = Math.sin(x * 0.0042 - flowOffset + phaseOffset) * 12;
            const wave2 = Math.cos(x * 0.0085 + flowOffset * 0.4 + phaseOffset * 0.7) * 4;
            const y = yc - 15 + wave1 + wave2;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      if (!isVisibleRef.current || currentPreset === 'minimal-still') {
        // Minimal/Still mode: do not re-render heavy canvas calculations
        animationId = requestAnimationFrame(tick);
        return;
      }

      // 1. Draw & update Rising Steam/Milling Sparkles (Golden Milling / Ambient)
      if (currentPreset === 'golden-milling' || currentPreset === 'zen-mist') {
        for (let i = 0; i < spiceParticles.length; i++) {
          const p = spiceParticles[i];
          
          // Slowly adjust according to interactive breeze
          p.x += (p.speedX * speedMult) + windForceX;
          p.y += (p.speedY * speedMult) + windForceY;

          // Gentle sine-wave horizontal drift
          p.x += Math.sin(time + p.pulseOffset) * 0.15;

          // Boundaries recycling wrapper
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) {
            p.x = width + 10;
          } else if (p.x > width + 10) {
            p.x = -10;
          }

          // Pulsate micro-size glow
          const currentAlpha = p.opacity * (0.6 + Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset) * 0.4);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.fill();
        }
      }

      // 2. Draw & update Floating Sways Tea Leaves / Golden Flakes
      if (currentPreset === 'spring-drift' || currentPreset === 'gilt-flow' || currentPreset === 'zen-mist') {
        const isGilt = currentPreset === 'gilt-flow';
        const activeLeaves = currentPreset === 'spring-drift' 
          ? leafParticles 
          : isGilt 
          ? leafParticles.slice(0, 36) // plenty of gold foil particles
          : leafParticles.slice(0, 24);

        for (let i = 0; i < activeLeaves.length; i++) {
          const p = activeLeaves[i];

          // Calc swaying
          p.swayOffset += p.swaySpeed;
          const swayAmount = Math.sin(p.swayOffset) * p.speedX * 0.8;

          // Apply physics forces: speed + background drag + mouse-breeze
          p.y += (p.speedY * speedMult * (isGilt ? 0.95 : 0.85)) + (windForceY * 0.4);
          p.x += (p.speedX + swayAmount + (windForceX * (isGilt ? 0.9 : 0.8)));
          p.angle += p.spin + (windForceX * 0.02);

          // Return boundaries check
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
            p.angle = Math.random() * Math.PI * 2;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          if (isGilt) {
            // Dynamic premium gold metallic leaf colors
            const goldColors = [
              'rgba(218, 165, 32, 0.72)', // goldenrod
              'rgba(255, 215, 0, 0.85)',   // true gold
              'rgba(238, 201, 0, 0.65)',   // deep gold
              'rgba(184, 134, 11, 0.68)',  // dark golden
              'rgba(253, 240, 196, 0.82)'  // cream gold sparkling
            ];
            const customGoldColor = goldColors[i % goldColors.length];
            drawGoldFlake(ctx, p.x, p.y, p.size * 0.85, p.angle, customGoldColor, p.opacity * 1.25);
          } else {
            drawLeaf(ctx, p.x, p.y, p.size, p.angle, p.color, p.opacity);
          }
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Immersive flowing loop background video to fulfill the user's specific premium requirement */}
      {videoBg !== 'none' && (
        <div className="absolute inset-0 z-0 overflow-hidden w-full h-full pointer-events-none select-none">
          <video
            key={videoBg}
            src={
              videoBg === 'gilt'
                ? 'https://assets.mixkit.co/videos/preview/mixkit-golden-liquid-with-metallic-shimmer-40713-large.mp4'
                : videoBg === 'stream'
                ? 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4'
                : 'https://assets.mixkit.co/videos/preview/mixkit-fresh-bamboo-leaves-in-wind-42335-large.mp4'
            }
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] pointer-events-none ${
              videoBg === 'gilt'
                ? 'opacity-[0.22] mix-blend-color-burn scale-102 filter contrast-[1.05] saturate-[1.10]'
                : 'opacity-[0.16] mix-blend-multiply'
            }`}
          />
          {/* Subtle matcha or golden light tint and soft layout gradient mask overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none select-none ${
            videoBg === 'gilt'
              ? 'via-[#FDF9F0]/10 to-[#FDFCF8]/45'
              : 'via-[#FDFCF8]/5 to-[#FDFCF8]/40'
          }`}></div>
        </div>
      )}

      {/* 1. Canvas layer for dynamic leaves & sparks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-[0.88] pointer-events-none transition-all duration-700"
      />

      {/* 2. Color bubble clouds (Zen-Mist organic moving mists) */}
      {preset === 'zen-mist' && (
        <div className="absolute inset-0 z-0 opacity-[0.15] mix-blend-multiply filter blur-[90px] w-full h-full pointer-events-none transition-all duration-[2000ms] animate-pulse">
          <div className="absolute top-[10%] left-[15%] w-[33vw] h-[33vw] rounded-full bg-[#8A9A5B] transition-transform duration-[8000ms] animate-[spin_50s_linear_infinite]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#C4D300] transition-transform duration-[12000ms] animate-[spin_80s_linear_infinite]"></div>
          <div className="absolute top-[40%] right-[30%] w-[25vw] h-[25vw] rounded-full bg-[#5C633F] transition-transform duration-[6000ms]"></div>
        </div>
      )}

      {preset === 'spring-drift' && (
        <div className="absolute inset-0 z-0 opacity-[0.05] filter blur-[60px] pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-[#8A9A5B]/30 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-[#5C633F]/20 animate-pulse duration-[4000ms]"></div>
        </div>
      )}

      {/* 3. Tiny Elegant Zen Setting Controller Overlay (Interactive Floating Pill UI) */}
      <div className="fixed bottom-24 right-4 sm:right-6 z-[60] pointer-events-auto flex flex-col items-end gap-2.5 max-sm:bottom-28">
        {showControls && (
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C4C8B7]/40 shadow-xl w-64 text-on-surface transform transition-all duration-300 animate-fade-in-up flex flex-col gap-3 font-serif select-none">
            <div className="flex items-center justify-between border-b border-[#C4C8B7]/25 pb-2">
              <span className="text-xs font-bold tracking-widest text-primary flex items-center gap-1">
                <Feather className="w-3.5 h-3.5" />
                禅意意境设置
              </span>
              <button
                onClick={() => setShowControls(false)}
                className="text-[10px] text-gray-400 hover:text-primary tracking-wide font-sans cursor-pointer h-5 w-5 rounded-full hover:bg-black/5 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Presets Grid */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400 tracking-wider">意境选择</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => { setPreset('gilt-flow'); setIsVisible(true); }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer col-span-2 ${
                    preset === 'gilt-flow' && isVisible
                      ? 'bg-amber-600 font-bold text-white shadow-md'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                >
                  👑 鎏金金箔
                </button>
                <button
                  onClick={() => { setPreset('spring-drift'); setIsVisible(true); }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    preset === 'spring-drift' && isVisible
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                >
                  🍃 春雨新绿
                </button>
                <button
                  onClick={() => { setPreset('golden-milling'); setIsVisible(true); }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    preset === 'golden-milling' && isVisible
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                >
                  ✨ 石磨引莹
                </button>
                <button
                  onClick={() => { setPreset('zen-mist'); setIsVisible(true); }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    preset === 'zen-mist' && isVisible
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                >
                  ☁️ 禅境霞光
                </button>
                <button
                  onClick={() => { setPreset('minimal-still'); setIsVisible(false); }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    !isVisible
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                >
                  ⏸️ 止息静止
                </button>
              </div>
            </div>

            {/* Video Streams selection list */}
            <div className="flex flex-col gap-1.5 border-t border-[#C4C8B7]/25 pt-2">
              <span className="text-[10px] text-gray-400 tracking-wider">流水背景视频 (Stream Video)</span>
              <div className="grid grid-cols-4 gap-1 text-[9px]">
                <button
                  onClick={() => setVideoBg('gilt')}
                  className={`py-1 rounded text-center transition-all cursor-pointer ${
                    videoBg === 'gilt'
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                  title="Luxury liquid golden gilt flowing stream"
                >
                  👑 鎏金珍宝
                </button>
                <button
                  onClick={() => setVideoBg('stream')}
                  className={`py-1 rounded text-center transition-all cursor-pointer ${
                    videoBg === 'stream'
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                  title="Serene forest stream winding through stones"
                >
                  🍵 印象茶溪
                </button>
                <button
                  onClick={() => setVideoBg('bamboo')}
                  className={`py-1 rounded text-center transition-all cursor-pointer ${
                    videoBg === 'bamboo'
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                  title="Gently swaying emerald bamboo forest"
                >
                  🍃 摇曳新绿
                </button>
                <button
                  onClick={() => setVideoBg('none')}
                  className={`py-1 rounded text-center transition-all cursor-pointer ${
                    videoBg === 'none'
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-beige/50 text-on-surface-variant hover:bg-surface-beige'
                  }`}
                  title="No video background, translucent canvas mode only"
                >
                  🌸 无视频
                </button>
              </div>
            </div>

            {/* Speed slider */}
            {isVisible && (
              <div className="flex flex-col gap-1 pr-1.5">
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span>微风流速 (Breeze Level)</span>
                  <span className="font-mono text-primary font-bold">x{intensity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full accent-[#5C633F] h-1 bg-surface-beige rounded-lg appearance-none cursor-ew-resize mt-1"
                />
              </div>
            )}

            <p className="text-[9px] text-[#8A9A5B]/90 font-sans tracking-wide leading-relaxed bg-surface-beige/40 p-1.5 rounded-lg border border-[#8A9A5B]/10">
              💡 提示：将鼠标在屏幕上拂过，可引动和风拂落叶。
            </p>
          </div>
        )}

        {/* Minimal Float Pill Trigger Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-[#C4C8B7]/40 shadow-lg text-primary font-bold tracking-widest text-[11px] flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group scale-95 hover:scale-100 font-serif active:scale-90"
          title="意境背景设置"
        >
          <Wind className="w-4 h-4 text-secondary group-hover:rotate-45 transition-transform duration-500" />
          <span>意境</span>
          {isVisible ? (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          )}
        </button>
      </div>
    </div>
  );
}

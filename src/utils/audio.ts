/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Premium Web Audio API Sound Synthesizer for Peace Put
// Generates warm, organic, and elegant sound chimes/taps
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Lazy initialisation to comply with browser autoplay / user-gesture standards
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Plays a warm organic wooden tap sound (premium button clicks)
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser standard)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Create nodes
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm organic sine-triangle fusion wave
    osc.type = 'triangle';
    // Base pitch of a high-end hollow bamboo/wooden resonance
    osc.frequency.setValueAtTime(840, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

    // Dynamic bandpass filter for wooden resonance
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.12);
    filter.Q.setValueAtTime(4.0, now);

    // Ultra snappy decay envelope
    gainNode.gain.setValueAtTime(0.0, now);
    gainNode.gain.linearRampToValueAtTime(0.28, now + 0.003); // Snappy instant attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12); // Smooth quick decay

    // Connections: Osc -> Filter -> Gain -> Destination
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    console.warn('Audio click playback suppressed by browser policy or error:', error);
  }
}

/**
 * Plays a soft, elegant Zen chord chime (for navigation tabs or successful loads)
 */
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    // Pentatonic scale frequencies for a luxury Zen resonance: G5, C6 (crystal bells)
    const frequencies = [783.99, 1046.50];

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const delay = index * 0.04; // Gentle strum effect

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      // Soft release envelope
      gainNode.gain.setValueAtTime(0.0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.07, now + delay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.6);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.7);
    });
  } catch (error) {
    console.warn('Audio chime playback suppressed:', error);
  }
}

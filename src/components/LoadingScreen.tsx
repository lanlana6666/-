/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Leaf } from 'lucide-react';

interface LoadingScreenProps {
  onFinished: () => void;
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [submittingIdx, setSubmittingIdx] = useState(0);
  const [isDoneOnProgress, setIsDoneOnProgress] = useState(false);

  const steps = [
    { text: '一期一会：炉火初红，静候泉水微响...', delay: 400 },
    { text: '松籁竹声：研磨宇治首采碾茶，翠色初现...', delay: 400 },
    { text: '石磨慢转：古法低温手工研磨中...', delay: 500 },
    { text: '黄金流沙：注入金箔鎏金微尘，气韵天成...', delay: 400 },
    { text: '一盏禅心：奉茶就餐，请君入席体验...', delay: 300 }
  ];

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Vary index and progress smoothly
      const increment = Math.floor(Math.random() * 8) + 6; 
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      const computedIdx = Math.min(
        steps.length - 1,
        Math.floor((currentProgress / 100) * steps.length)
      );
      setSubmittingIdx(computedIdx);

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Let it resolve smoothly for a beat
        setTimeout(() => {
          setIsDoneOnProgress(true);
        }, 500);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Exit trigger
  useEffect(() => {
    if (isDoneOnProgress) {
      const waitTimer = setTimeout(() => {
        onFinished();
      }, 700);
      return () => clearTimeout(waitTimer);
    }
  }, [isDoneOnProgress, onFinished]);

  return (
    <motion.div
      key="matcha-loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: isDoneOnProgress ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
      className="fixed inset-0 z-[10000] bg-[#121811] text-[#F5F2EB] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* 1. Green Tea Metallic flow abstract lines in the background */}
      <div className="absolute inset-0 opacity-[0.25] pointer-events-none select-none mix-blend-color-dodge">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#8A9A5B]/25 via-[#5C633F]/15 to-transparent blur-3xl animate-pulse -top-20 -left-20" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-600/20 via-transparent to-transparent blur-3xl -bottom-20 -right-20" />
      </div>

      <div className="max-w-md w-full text-center flex flex-col items-center relative z-10">
        
        {/* Logo Shield Frame */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-8 flex items-center justify-center"
        >
          {/* Animated tea radial rings resembling standard Matcha mixing whisk whirlpool */}
          <div className="absolute -inset-6 rounded-full border border-[#8A9A5B]/35 animate-spin-slow opacity-65" />
          <div className="absolute -inset-10 rounded-full border border-dashed border-emerald-800/20 animate-spin-reverse opacity-45" />

          {/* Actual Whisk Bowl Center container */}
          <div className="w-24 h-24 rounded-full bg-[#0E120D] border border-[#8A9A5B]/50 flex items-center justify-center shadow-xl relative">
            <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🍵</span>
            
            {/* Spinning tea bubble element */}
            <motion.div 
              className="absolute inset-2 rounded-full border-t border-r border-[#A3B899]/50"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Brand Text Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-normal uppercase text-white mb-2">
            PEACE PUT
          </h2>
          <p className="text-[10px] text-[#8A9A5B] font-mono tracking-[0.4em] uppercase font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#8A9A5B]" />
            MATCHA ARTISAN STUDY • 宇治和弦
          </p>
        </motion.div>

        {/* Circular Progress Wheel and numerical percentage */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background tracking track */}
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-white/5"
              strokeWidth="3.5"
              fill="transparent"
            />
            {/* Active colorful loading state track */}
            <motion.circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-[#8A9A5B]"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - progress / 100)}
              transition={{ type: 'tween', ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black font-mono tracking-tight text-white">
              {progress}%
            </span>
            <span className="text-[9px] font-sans text-gray-400 tracking-widest mt-1 uppercase">
              慢火点茶中
            </span>
          </div>
        </div>

        {/* Description message box */}
        <div className="h-14 flex items-center justify-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={submittingIdx}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-xs sm:text-sm text-[#E8EAE0] font-serif leading-relaxed"
            >
              {steps[submittingIdx]?.text || '一期一会，安顿身心...'}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Small subtitle about peace put */}
        <div className="mt-10 pt-6 border-t border-white/5 w-48 text-[9px] text-[#A6AB9A]/60 font-mono tracking-wider flex items-center justify-center gap-1 uppercase">
          <Leaf className="w-3 h-3 text-emerald-800" />
          <span>手作茶物 • 身心安顿</span>
        </div>

      </div>
    </motion.div>
  );
}

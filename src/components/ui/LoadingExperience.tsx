import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingExperienceProps {
  onComplete?: () => void;
  onLoadingComplete?: () => void;
}

export const LoadingExperience: React.FC<LoadingExperienceProps> = ({ 
  onComplete, 
  onLoadingComplete 
}) => {
  const [step, setStep] = useState<number>(0);

  const finish = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    } else if (typeof onLoadingComplete === 'function') {
      onLoadingComplete();
    }
  };

  useEffect(() => {
    // Fast path for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    // Snappy, cinematic sequence (under 1.2s total)
    const timer1 = setTimeout(() => setStep(1), 350);
    const timer2 = setTimeout(() => setStep(2), 850);
    const timer3 = setTimeout(() => {
      finish();
    }, 1150);

    // Allow user to click anywhere or press Esc/Space to skip immediately
    const handleQuickSkip = () => {
      finish();
    };
    window.addEventListener('keydown', handleQuickSkip, { once: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('keydown', handleQuickSkip);
    };
  }, []);

  return (
    <AnimatePresence>
      {step < 2 ? (
        <motion.div
          key="loader-overlay"
          onClick={finish}
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            opacity: 0,
            transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070708] text-[#f2f2f5] select-none cursor-pointer"
        >
          {/* Subtle perimeter frame */}
          <div className="absolute inset-8 border border-white/5 pointer-events-none hidden md:block" />
          
          <div className="text-center px-6 z-10 max-w-xl">
            {/* Project Index / Counter */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-[11px] tracking-[0.3em] text-white/40 uppercase mb-6"
            >
              [ PORTFOLIO ARCHIVE / 2026 ]
            </motion.div>

            {/* Saurabh Primary Title */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white"
              >
                SAURABH
              </motion.h1>
            </div>

            {/* Tri-discipline reveal: VIDEO · DESIGN · WEB */}
            <div className="overflow-hidden flex items-center justify-center space-x-3 sm:space-x-5 font-mono text-xs sm:text-sm tracking-[0.25em] text-white/70">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                VIDEO
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={step >= 1 ? { opacity: 0.3 } : {}}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="text-white/30"
              >
                ·
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                DESIGN
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={step >= 1 ? { opacity: 0.3 } : {}}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="text-white/30"
              >
                ·
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                WEB
              </motion.span>
            </div>

            {/* Progress bar line */}
            <div className="mt-12 w-32 h-[1px] bg-white/10 mx-auto overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="h-full bg-white/80"
              />
            </div>
          </div>

          {/* Skip prompt on click */}
          <button
            onClick={onComplete}
            className="absolute bottom-10 font-mono text-[10px] tracking-widest text-white/30 hover:text-white/80 transition-colors cursor-pointer uppercase"
          >
            Press anywhere or click to enter ↵
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

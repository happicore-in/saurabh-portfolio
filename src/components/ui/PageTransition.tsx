import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  routeKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, routeKey }) => {
  const isReduced = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      key={routeKey}
      initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={isReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={isReduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
      transition={{
        duration: isReduced ? 0 : 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full relative z-10 min-h-[calc(100vh-200px)] will-change-[transform,opacity]"
    >
      {children}
    </motion.div>
  );
};

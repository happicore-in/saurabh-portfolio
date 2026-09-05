import React from 'react';

export const FlowingBackground: React.FC = () => {
  return (
    <div 
      id="ambient-flowing-background"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-35"
      aria-hidden="true"
    >
      {/* Subtle background grain grid */}
      <div className="absolute inset-0 bg-grain opacity-50" />

      {/* Hardware-Accelerated Ambient SVG with zero CPU JS overhead */}
      <svg
        className="absolute w-full h-full object-cover min-w-[1200px] min-h-[800px]"
        viewBox="0 0 1600 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="monoLine1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="50%" stopColor="#888899" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="monoLine2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="60%" stopColor="#555566" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.025" />
            <stop offset="100%" stopColor="#08080a" stopOpacity="0" />
          </radialGradient>
          
          <style>{`
            @keyframes flowStream1 {
              0% { stroke-dashoffset: 0; transform: translate3d(0, 0, 0); }
              50% { transform: translate3d(8px, -12px, 0); }
              100% { stroke-dashoffset: 200; transform: translate3d(0, 0, 0); }
            }
            @keyframes flowStream2 {
              0% { stroke-dashoffset: 0; transform: translate3d(0, 0, 0); }
              50% { transform: translate3d(-10px, 15px, 0); }
              100% { stroke-dashoffset: -240; transform: translate3d(0, 0, 0); }
            }
            .stream-path-1 {
              stroke-dasharray: 12 8;
              animation: flowStream1 22s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              will-change: transform, stroke-dashoffset;
            }
            .stream-path-2 {
              stroke-dasharray: 10 10;
              animation: flowStream2 28s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              will-change: transform, stroke-dashoffset;
            }
            @media (prefers-reduced-motion: reduce) {
              .stream-path-1, .stream-path-2 {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* Ambient subtle center glow */}
        <circle cx="800" cy="500" r="600" fill="url(#centerGlow)" />

        {/* Primary sweep wave - Hardware GPU composited */}
        <path
          d="M-100,250 C300,100 500,450 900,320 C1300,190 1500,500 1800,380"
          stroke="url(#monoLine1)"
          strokeWidth="1.2"
          fill="none"
          className="stream-path-1"
        />

        {/* Secondary counter wave */}
        <path
          d="M-100,680 C400,820 650,480 1050,620 C1450,760 1600,420 1800,550"
          stroke="url(#monoLine2)"
          strokeWidth="1"
          fill="none"
          className="stream-path-2"
        />

        {/* Diagonal subtle architectural ribbon */}
        <path
          d="M100,-100 C300,300 700,500 900,800 C1100,1100 1500,1000 1700,1200"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Framing technical marks */}
        <line x1="80" y1="60" x2="140" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="80" y1="60" x2="80" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="1520" y1="940" x2="1460" y2="940" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="1520" y1="940" x2="1520" y2="880" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
};

import React from 'react';
import { PageRoute, CursorState } from '../types';
import { ArrowLeft, Film } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: PageRoute) => void;
  setCursorState: (state: CursorState) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, setCursorState }) => {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-4 text-[#f2f2f5]">
      <div className="space-y-6 max-w-md">
        <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block">
          [ ERROR // TIMELINE DROPPED FRAME ]
        </span>

        <h1 className="font-display text-8xl sm:text-9xl font-extrabold tracking-tighter text-white">
          404
        </h1>

        <p className="font-mono text-base text-white/70 uppercase tracking-wider">
          THIS FRAME DOESN&apos;T EXIST.
        </p>

        <p className="text-sm text-white/50 leading-relaxed">
          The requested coordinate or project asset has been relocated or removed from the archive.
        </p>

        <div className="pt-4">
          <button
            onClick={() => onNavigate('home')}
            onMouseEnter={() => setCursorState('open')}
            onMouseLeave={() => setCursorState('default')}
            className="px-8 py-3.5 bg-white text-[#08080a] font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:bg-white/90 hover:scale-105 transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};

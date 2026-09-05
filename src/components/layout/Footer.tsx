import React from 'react';
import { PageRoute, CursorState } from '../../types';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ArrowUpRight, Download, Mail, ShieldCheck } from 'lucide-react';
import { downloadResume } from '../../utils/resumeDownload';

interface FooterProps {
  onNavigate: (route: PageRoute, anchorId?: string) => void;
  setCursorState: (state: CursorState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, setCursorState }) => {
  return (
    <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-12 text-[#F5F5F4] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          
          {/* Col 1: Identity & Statement */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              onMouseEnter={() => setCursorState('open')}
              onMouseLeave={() => setCursorState('default')}
              className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter text-[#F5F5F4] hover:opacity-80 transition-opacity block text-left cursor-pointer"
            >
              {PERSONAL_INFO.name}
            </button>
            <p className="font-mono text-xs tracking-widest text-white/50 uppercase">
              {PERSONAL_INFO.shortTitle}
            </p>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed pt-2 font-serif italic">
              Operating at the intersection of video storytelling, high-craft graphic design, and modern interactive web engineering.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center space-x-2 text-[10px] font-mono px-3 py-1 bg-white/5 border border-white/10 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{PERSONAL_INFO.status}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
              EXPLORE
            </h4>
            <ul className="space-y-2 font-mono text-xs tracking-wider">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  HOME
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('web')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  WEB
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('graphic')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  GRAPHIC
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('video')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  VIDEO
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  ABOUT
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  CONTACT
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Experience & Credentials (Jump directly to sections inside About) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
              ABOUT SECTIONS
            </h4>
            <ul className="space-y-2 font-mono text-xs tracking-wider">
              <li>
                <button
                  onClick={() => onNavigate('about', 'experience')}
                  className="text-white/70 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>EXPERIENCE TIMELINE</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about', 'credentials')}
                  className="text-white/70 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>CREDENTIALS MATRIX</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about', 'education')}
                  className="text-white/70 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>IIT MADRAS EDUCATION</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </button>
              </li>
              <li>
                <button
                  onClick={downloadResume}
                  className="text-white/70 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer pt-1"
                >
                  <Download className="w-3 h-3 text-white/60" />
                  <span>DOWNLOAD RESUME ↓</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio & Network */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
              STUDIO & CONNECT
            </h4>
            <ul className="space-y-2 font-mono text-xs tracking-wider">
              <li>
                <a
                  href={PERSONAL_INFO.studio.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white flex items-center space-x-1.5 transition-colors"
                >
                  <span>HAPPICORE</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href={PERSONAL_INFO.studio.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white flex items-center space-x-1.5 transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white flex items-center space-x-1.5 transition-colors"
                >
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onMouseEnter={() => setCursorState('contact')}
                  onMouseLeave={() => setCursorState('default')}
                  className="text-white/70 hover:text-white flex items-center space-x-1.5 transition-colors"
                >
                  <Mail className="w-3 h-3 text-white/50" />
                  <span>EMAIL</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/40 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-6 sm:space-x-10">
            <span>© 2026 {PERSONAL_INFO.name} CORE</span>
            <span className="hidden sm:inline">25.867° N, 83.561° E</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-[10px] font-mono bg-white/10 px-2 py-1 text-white/80">
              LATENCY: 12ms
            </div>
            
            {/* Direct Studio CMS Access (private link) */}
            <button
              onClick={() => onNavigate('admin')}
              className="text-white/40 hover:text-white/80 transition-colors flex items-center space-x-1 cursor-pointer"
              title="Open Studio Content Management System"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>CMS ARCHIVE</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

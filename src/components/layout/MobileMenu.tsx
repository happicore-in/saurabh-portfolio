import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute } from '../../types';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ArrowUpRight, Download, X, Instagram, Mail } from 'lucide-react';
import { downloadResume } from '../../utils/resumeDownload';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, anchorId?: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
}) => {
  const navItems: { label: string; route: PageRoute; anchorId?: string; number: string }[] = [
    { label: 'HOME', route: 'home', number: '01' },
    { label: 'WEB', route: 'web', number: '02' },
    { label: 'GRAPHIC', route: 'graphic', number: '03' },
    { label: 'VIDEO', route: 'video', number: '04' },
    { label: 'ABOUT', route: 'about', number: '05' },
    { label: 'EXPERIENCE', route: 'about', anchorId: 'experience', number: '06' },
    { label: 'CREDENTIALS', route: 'about', anchorId: 'credentials', number: '07' },
    { label: 'CONTACT', route: 'contact', number: '08' },
  ];

  const handleSelect = (route: PageRoute, anchorId?: string) => {
    onNavigate(route, anchorId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-[#050505] text-[#F5F5F4] flex flex-col justify-between p-5 sm:p-8 md:hidden overflow-y-auto w-full max-w-full"
        >
          {/* Header bar inside menu */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <span className="font-display text-lg sm:text-xl font-bold tracking-tighter text-[#F5F5F4]">
              {PERSONAL_INFO.name}
            </span>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2.5 text-white/80 hover:text-white bg-white/[0.05] border border-white/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with staggered animation */}
          <div className="py-6 space-y-2.5 my-auto">
            {navItems.map((item, index) => {
              const isActive = !item.anchorId && currentRoute === item.route;
              return (
                <motion.div
                  key={`${item.route}-${item.anchorId || 'main'}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index, duration: 0.25 }}
                >
                  <button
                    onClick={() => handleSelect(item.route, item.anchorId)}
                    className="w-full flex items-center justify-between group py-2 text-left min-h-[44px] cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <span className="font-mono text-[11px] text-white/30 tracking-widest w-5">
                        {item.number}
                      </span>
                      <span
                        className={`font-display text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                          isActive
                            ? 'text-white border-b-2 border-white pb-0.5'
                            : 'text-white/70 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                        isActive
                          ? 'text-white translate-x-1 -translate-y-1'
                          : 'text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1'
                      }`}
                    />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Actions & Studio Connection */}
          <div className="pt-5 border-t border-white/10 space-y-3.5 shrink-0">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSelect('contact')}
                className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-[#F5F5F4] text-[#050505] font-mono text-[11px] font-bold tracking-widest uppercase cursor-pointer hover:bg-white min-h-[44px]"
              >
                <span>CONNECT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={PERSONAL_INFO.studio.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-white/[0.05] border border-white/10 text-[#F5F5F4] font-mono text-[11px] tracking-widest uppercase hover:bg-white/10 transition-colors min-h-[44px]"
              >
                <span>HAPPICORE</span>
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Resume Download */}
            <button
              onClick={() => {
                downloadResume();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-mono text-white/70 hover:text-white border border-dashed border-white/20 transition-colors cursor-pointer min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD RESUME ↓</span>
            </button>

            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40 pt-1">
              <span className="truncate max-w-[180px]">{PERSONAL_INFO.location}</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-white flex items-center space-x-1 min-h-[30px]">
                <Mail className="w-3 h-3" />
                <span>EMAIL ME</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

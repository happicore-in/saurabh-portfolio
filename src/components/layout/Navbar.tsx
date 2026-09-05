import React, { useState, useEffect } from 'react';
import { PageRoute, CursorState } from '../../types';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  setCursorState: (state: CursorState) => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  setCursorState,
  onOpenMobileMenu,
  isMobileMenuOpen,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; route: PageRoute }[] = [
    { label: 'HOME', route: 'home' },
    { label: 'WEB', route: 'web' },
    { label: 'GRAPHIC', route: 'graphic' },
    { label: 'VIDEO', route: 'video' },
    { label: 'ABOUT', route: 'about' },
    { label: 'CONTACT', route: 'contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 py-4'
          : 'bg-[#050505]/60 backdrop-blur-sm border-b border-white/10 py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        
        {/* Brand Name & Freelance Indicator */}
        <div className="flex items-center gap-4">
          <button
            id="brand-home-btn"
            onClick={() => onNavigate('home')}
            onMouseEnter={() => setCursorState('open')}
            onMouseLeave={() => setCursorState('default')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tighter text-[#F5F5F4] group-hover:opacity-80 transition-opacity">
              {PERSONAL_INFO.name}
            </span>
          </button>

          {/* Minimal Freelance Status Badge */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 ml-2 sm:ml-4 font-mono">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>{PERSONAL_INFO.status}</span>
          </div>
        </div>

        {/* Clean Desktop Navigation Links (Artistic Flair editorial style) */}
        <nav 
          id="navbar-nav"
          className="hidden md:flex items-center gap-7 lg:gap-8 text-[11px] uppercase tracking-widest font-medium font-mono"
        >
          {navItems.map((item) => {
            const isActive = currentRoute === item.route || 
              (item.route === 'web' && currentRoute === 'web-detail') ||
              (item.route === 'graphic' && currentRoute === 'graphic-detail') ||
              (item.route === 'video' && currentRoute === 'video-detail');

            const isContact = item.route === 'contact';

            return (
              <button
                key={item.route}
                id={`nav-item-${item.route}`}
                onClick={() => onNavigate(item.route)}
                onMouseEnter={() => setCursorState('open')}
                onMouseLeave={() => setCursorState('default')}
                className={`py-1 cursor-pointer transition-all ${
                  isContact ? 'mr-4 lg:mr-6' : ''
                } ${
                  isActive
                    ? 'text-[#F5F5F4] border-b border-white opacity-100 font-bold'
                    : 'text-[#F5F5F4] opacity-40 hover:opacity-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Connect Button & Mobile Toggle */}
        <div id="navbar-actions" className="flex items-center gap-3 ml-4 sm:ml-6 lg:ml-8">
          <button
            id="nav-connect-btn"
            onClick={() => onNavigate('contact')}
            onMouseEnter={() => setCursorState('contact')}
            onMouseLeave={() => setCursorState('default')}
            className="hidden sm:inline-flex items-center gap-2 bg-[#F5F5F4] text-[#050505] px-6 py-2 text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-colors cursor-pointer"
          >
            <span>CONNECT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={onOpenMobileMenu}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white bg-white/[0.05] border border-white/10 cursor-pointer transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};

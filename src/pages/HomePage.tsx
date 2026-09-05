import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  PageRoute, 
  CursorState, 
  VideoProject, 
  WebProject, 
  GraphicProject 
} from '../types';
import { 
  PERSONAL_INFO, 
  TOOLS_DATA, 
  VIDEO_PROJECTS, 
  WEB_PROJECTS, 
  GRAPHIC_PROJECTS, 
  TESTIMONIALS_DATA 
} from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { ToolLogo } from '../components/ToolLogo';
import { 
  ArrowUpRight, 
  Play, 
  Code, 
  Layers, 
  Film, 
  Sparkles, 
  ExternalLink, 
  ArrowRight,
  Monitor,
  Palette,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectVideo: (project: VideoProject) => void;
  onSelectWeb: (project: WebProject) => void;
  onSelectGraphic: (project: GraphicProject) => void;
  setCursorState: (state: CursorState) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectVideo,
  onSelectWeb,
  onSelectGraphic,
  setCursorState,
}) => {
  const { videoProjects, webProjects, graphicProjects, personalInfo } = usePortfolioData();
  const allVideos = videoProjects.length > 0 ? videoProjects : VIDEO_PROJECTS;
  const allWeb = webProjects.length > 0 ? webProjects : WEB_PROJECTS;
  const allGraphics = graphicProjects.length > 0 ? graphicProjects : GRAPHIC_PROJECTS;
  const info = personalInfo || PERSONAL_INFO;

  const [activeToolIndex, setActiveToolIndex] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Lightweight GPU mouse tilt for Hero 3D depth (zero React state updates)
  const heroTiltRef = useRef<HTMLDivElement>(null);
  const heroRafId = useRef<number | null>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    if (heroRafId.current !== null) {
      cancelAnimationFrame(heroRafId.current);
    }
    heroRafId.current = requestAnimationFrame(() => {
      if (heroTiltRef.current) {
        heroTiltRef.current.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      }
    });
  };

  const handleHeroMouseLeave = () => {
    if (heroRafId.current !== null) {
      cancelAnimationFrame(heroRafId.current);
    }
    if (heroTiltRef.current) {
      heroTiltRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  useEffect(() => {
    return () => {
      if (heroRafId.current !== null) {
        cancelAnimationFrame(heroRafId.current);
      }
    };
  }, []);

  // Selected work items (mixing Video, Web, Graphic)
  const featuredVideo = allVideos[0]; // Paradox 2026
  const featuredWeb = allWeb[0];   // Happicore Digital Workspace
  const featuredGraphic = allGraphics[0]; // Paradox Posters
  const secondaryVideo = allVideos[1] || allVideos[0]; // Sportify Recap

  return (
    <div className="w-full max-w-full text-[#f2f2f5] overflow-hidden">

      {/* ========================================================= */}
      {/* 01. HERO SECTION (ARTISTIC FLAIR ARCHITECTURAL EDITORIAL)  */}
      {/* ========================================================= */}
      <section 
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center pt-24 pb-12 border-b border-white/10 preserve-3d"
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Vertical Architectural Rail */}
          <div className="hidden lg:flex lg:col-span-1 border-r border-white/10 items-center justify-center py-10 pr-6">
            <div className="rotate-[-90deg] text-[10px] uppercase tracking-[0.5em] whitespace-nowrap opacity-40 font-bold font-mono">
              DIGITAL CREATIVE // 2026
            </div>
          </div>

          {/* Center Main Typographic Stagger */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:px-10 py-6 lg:border-r border-white/10 relative w-full min-w-0">
            
            {/* Status indicators */}
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] font-mono opacity-40 uppercase tracking-widest mb-4 sm:mb-6 flex-wrap">
              <span>00.1 SEQUENCER</span>
              <span className="text-white/20">/</span>
              <span className="text-emerald-400">STATUS: ACTIVE</span>
            </div>

            {/* Disciplines eyebrow */}
            <div className="mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-50 block leading-relaxed break-words">
                VIDEO EDITING · WEB DEVELOPMENT · GRAPHIC DESIGN
              </span>
            </div>

            {/* Staggered Headlines: SAURABH with Signature Disciplines */}
            <div 
              ref={heroTiltRef}
              style={{
                transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                willChange: 'transform'
              }}
              className="space-y-0.5 sm:space-y-0"
            >
              <h1 
                id="hero-full-name"
                className="text-[clamp(2.4rem,11.5vw,6.5rem)] font-extrabold tracking-tighter leading-[0.9] font-display uppercase text-[#F5F5F4] break-words"
              >
                SAURABH
              </h1>
              <div 
                id="hero-tagline-line1"
                className="text-[clamp(1.35rem,6.2vw,4.75rem)] font-bold tracking-tighter leading-tight pl-2 sm:pl-8 opacity-90 italic font-serif text-[#F5F5F4] break-words"
              >
                I EDIT. I DESIGN.
              </div>
              <div 
                id="hero-tagline-line2"
                className="text-[clamp(1.35rem,6.2vw,4.75rem)] font-bold tracking-tighter leading-tight pl-3 sm:pl-16 border-b-2 border-white/20 pb-3 sm:pb-4 font-display text-[#F5F5F4] break-words"
              >
                I BUILD.
              </div>
            </div>

            {/* Editorial Statement in Serif Italic */}
            <p className="mt-6 sm:mt-8 max-w-lg text-sm sm:text-base opacity-75 leading-relaxed font-serif italic text-[#F5F5F4] break-words">
              {PERSONAL_INFO.intro}
            </p>

            {/* Quick Hero Architectural Cards: Showreel & Happicore */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 w-full max-w-md">
              
              {/* Showreel Card */}
              <div 
                onClick={() => onSelectVideo(featuredVideo)}
                onMouseEnter={() => setCursorState('video')}
                onMouseLeave={() => setCursorState('default')}
                className="group cursor-pointer w-full min-w-0"
              >
                <span className="text-[10px] block opacity-40 mb-1.5 font-mono tracking-widest truncate">
                  01 // SHOWREEL
                </span>
                <div className="w-full h-22 sm:h-28 border border-white/20 relative group-hover:border-white transition-all overflow-hidden bg-white/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/5 flex items-center justify-center italic text-xs font-mono uppercase tracking-widest group-hover:scale-105 transition-transform px-1 text-center">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Play className="w-3.5 h-3.5 fill-current shrink-0" /> PLAY REEL
                    </span>
                  </div>
                </div>
              </div>

              {/* Happicore Card */}
              <div 
                onClick={() => onNavigate('graphic')}
                onMouseEnter={() => setCursorState('open')}
                onMouseLeave={() => setCursorState('default')}
                className="group cursor-pointer w-full min-w-0"
              >
                <span className="text-[10px] block opacity-40 mb-1.5 font-mono tracking-widest truncate">
                  02 // HAPPICORE
                </span>
                <div className="w-full h-22 sm:h-28 border border-white/20 p-2.5 sm:p-4 group-hover:border-white transition-all bg-white/5 flex flex-col justify-between">
                  <p className="text-[9px] leading-tight uppercase opacity-60 font-mono line-clamp-2">
                    Independent Creative Studio Focusing on Visual Excellence.
                  </p>
                  <span className="text-[9px] font-mono tracking-widest uppercase border-b border-white/40 w-max group-hover:border-white transition-colors truncate">
                    VIEW STUDIO →
                  </span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('video')}
                onMouseEnter={() => setCursorState('open')}
                onMouseLeave={() => setCursorState('default')}
                className="px-6 py-3.5 sm:py-3 bg-[#F5F5F4] text-[#050505] font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>EXPLORE ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => onNavigate('contact')}
                onMouseEnter={() => setCursorState('contact')}
                onMouseLeave={() => setCursorState('default')}
                className="px-6 py-3.5 sm:py-3 bg-transparent text-[#F5F5F4] border border-white/20 font-mono text-[11px] uppercase tracking-widest font-bold hover:border-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>LET&apos;S CONNECT</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

          </div>

          {/* Right Column: Architectural System Map & Experience Matrix */}
          <div className="lg:col-span-4 bg-[#0A0A0A] p-0 flex flex-col border-t lg:border-t-0 mt-8 lg:mt-0 border-white/10 w-full min-w-0">
            
            {/* System Map / Multi-Page Architecture */}
            <div className="p-4 sm:p-8 border-b border-white/10">
              <h2 className="text-[10px] uppercase tracking-widest font-mono font-bold mb-4 opacity-40">
                SYSTEM MAP // ARCHITECTURE
              </h2>
              <div className="grid grid-cols-2 gap-3">
                
                <div 
                  onClick={() => onNavigate('web')}
                  onMouseEnter={() => setCursorState('open')}
                  onMouseLeave={() => setCursorState('default')}
                  className="aspect-video bg-white/5 border border-white/10 p-2.5 hover:border-white/40 transition-colors cursor-pointer group"
                >
                  <div className="w-full h-full border border-dashed border-white/20 flex items-end p-2 group-hover:border-white/40 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-white/80">Web // 02</span>
                  </div>
                </div>

                <div 
                  onClick={() => onNavigate('graphic')}
                  onMouseEnter={() => setCursorState('open')}
                  onMouseLeave={() => setCursorState('default')}
                  className="aspect-video bg-white/5 border border-white/10 p-2.5 hover:border-white/40 transition-colors cursor-pointer group"
                >
                  <div className="w-full h-full border border-dashed border-white/20 flex items-end p-2 group-hover:border-white/40 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-white/80">Graphic // 03</span>
                  </div>
                </div>

                <div 
                  onClick={() => onNavigate('video')}
                  onMouseEnter={() => setCursorState('video')}
                  onMouseLeave={() => setCursorState('default')}
                  className="aspect-video bg-white/5 border border-white/10 p-2.5 hover:border-white/40 transition-colors cursor-pointer group"
                >
                  <div className="w-full h-full border border-dashed border-white/20 flex items-end p-2 group-hover:border-white/40 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-white/80">Video // 04</span>
                  </div>
                </div>

                <div 
                  onClick={() => onNavigate('about')}
                  onMouseEnter={() => setCursorState('open')}
                  onMouseLeave={() => setCursorState('default')}
                  className="aspect-video bg-white/5 border border-white/10 p-2.5 hover:border-white/40 transition-colors cursor-pointer group"
                >
                  <div className="w-full h-full border border-dashed border-white/20 flex items-end p-2 group-hover:border-white/40 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-white/80">About // 05</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Experience Matrix (Artistic Flair component) */}
            <div className="p-6 sm:p-8 flex-1">
              <h3 className="text-[10px] uppercase tracking-widest font-mono font-bold mb-4 opacity-40">
                EXPERIENCE MATRIX
              </h3>
              <div className="space-y-4">
                
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div className="text-[11px] leading-tight">
                    <p className="font-bold uppercase tracking-wide text-white">THE SPORTIFY (IIT MADRAS)</p>
                    <p className="opacity-50 text-[10px] mt-1 font-mono">Deputy Head – Design & Media</p>
                  </div>
                  <span className="text-[10px] font-mono opacity-40">25—26</span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div className="text-[11px] leading-tight">
                    <p className="font-bold uppercase tracking-wide text-white">HAPPICORE STUDIO</p>
                    <p className="opacity-50 text-[10px] mt-1 font-mono">Founder & Creative Lead</p>
                  </div>
                  <span className="text-[10px] font-mono opacity-40">2024</span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div className="text-[11px] leading-tight">
                    <p className="font-bold uppercase tracking-wide text-white">IIT MADRAS BS DATA SCIENCE</p>
                    <p className="opacity-50 text-[10px] mt-1 font-mono">Technical & Computational Core</p>
                  </div>
                  <span className="text-[10px] font-mono opacity-40">2026</span>
                </div>

              </div>
            </div>

            {/* Fast Trigger Strip: Let's build something cinematic */}
            <div 
              onClick={() => onNavigate('contact')}
              onMouseEnter={() => setCursorState('contact')}
              onMouseLeave={() => setCursorState('default')}
              className="p-6 sm:p-8 bg-[#F5F5F4] text-[#050505] hover:bg-white transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Let&apos;s build something cinematic.
                </span>
                <span className="text-xl">→</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 02. SHOWREEL SECTION (CINEMATIC REEL PREVIEW)             */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
              02 // DIRECTED REEL
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              SHOWREEL
            </h2>
          </div>
          <p className="font-mono text-xs text-white/60 max-w-md">
            Selected cuts from Paradox 2026, The Sportify recap, and convention aftermovies.
          </p>
        </div>

        {/* Big Cinematic Showcase Frame */}
        <div 
          onClick={() => onSelectVideo(featuredVideo)}
          onMouseEnter={() => setCursorState('video')}
          onMouseLeave={() => setCursorState('default')}
          className="relative aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/15 group cursor-pointer bg-[#0e0e14]"
        >
          <img
            src={getOptimizedImageUrl(featuredVideo.thumbnail, { width: 1200, crop: 'limit' })}
            alt={featuredVideo.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-90 group-hover:scale-105 transition-all duration-700 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-[#08080a] border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-2xl"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
            </motion.div>
          </div>

          {/* Reel metadata & CTA overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
            <div>
              <span className="font-mono text-xs px-2.5 py-1 bg-white/10 rounded-full backdrop-blur-sm text-white/80 uppercase">
                {featuredVideo.category}
              </span>
              <h3 className="font-display text-xl sm:text-3xl font-bold text-white mt-2">
                {featuredVideo.title}
              </h3>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs text-white group-hover:translate-x-1 transition-transform">
              <span>PLAY SHOWREEL</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 03. SHORT INTRO SECTION                                   */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
          <div className="md:col-span-4 font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
            03 // PHILOSOPHY & STATEMENT
          </div>
          <div className="md:col-span-8 space-y-6">
            <p className="font-display text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              &ldquo;Different mediums. One unified creative mindset.&rdquo;
            </p>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
              Whether cutting rhythmic festival aftermovies, engineering interactive web interfaces, or designing campaign visual identities — I treat every frame, pixel, and line of code as a storytelling device.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 04. FEATURED WORK (EDITORIAL ASYMMETRIC COMPOSITION)      */}
      {/* ========================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
              04 // CURATED CATALOGUE
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              SELECTED WORK
            </h2>
          </div>

          <button
            onClick={() => onNavigate('video')}
            onMouseEnter={() => setCursorState('open')}
            onMouseLeave={() => setCursorState('default')}
            className="font-mono text-xs tracking-wider text-white/70 hover:text-white flex items-center space-x-2 cursor-pointer pb-2 group"
          >
            <span>VIEW ALL WORK</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Asymmetric Editorial Composition (not a boring 3-col card grid) */}
        <div className="space-y-16">
          
          {/* Work Item 01: Video Flagship (Large Horizontal Preview) */}
          <div 
            onClick={() => onSelectVideo(featuredVideo)}
            onMouseEnter={() => {
              setCursorState('video');
              setHoveredCard('work-1');
            }}
            onMouseLeave={() => {
              setCursorState('default');
              setHoveredCard(null);
            }}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-white/[0.06] pb-14"
          >
            <div className="lg:col-span-8 overflow-hidden rounded-xl border border-white/10 aspect-[16/9] relative bg-[#0e0e14]">
              <img
                src={getOptimizedImageUrl(featuredVideo.thumbnail, { width: 1000, crop: 'limit' })}
                alt={featuredVideo.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full font-mono text-[11px] text-white/80 border border-white/10">
                VIDEO // REEL
              </div>
              <div className="absolute bottom-4 right-4 flex items-center space-x-2 px-3 py-1.5 bg-white text-[#08080a] rounded-full font-mono text-xs font-semibold">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>WATCH</span>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 lg:pl-6">
              <span className="font-mono text-xs text-white/40 tracking-widest">
                [ 01 // 2026 ]
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-white/80 transition-colors">
                {featuredVideo.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {featuredVideo.description}
              </p>
              <div className="pt-2 font-mono text-xs text-white/40 flex items-center space-x-2">
                <span>ROLE:</span>
                <span className="text-white/80">{featuredVideo.role}</span>
              </div>
            </div>
          </div>

          {/* Work Item 02 & 03: Split Pair (Web + Graphic) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-white/[0.06] pb-14">
            
            {/* Web Project Preview */}
            <div
              onClick={() => onSelectWeb(featuredWeb)}
              onMouseEnter={() => setCursorState('project')}
              onMouseLeave={() => setCursorState('default')}
              className="lg:col-span-7 group cursor-pointer space-y-4"
            >
              <div className="rounded-xl overflow-hidden border border-white/10 aspect-[16/10] relative bg-[#0e0e14]">
                {/* Browser window top mock */}
                <div className="absolute top-0 left-0 right-0 h-7 bg-[#121218] border-b border-white/10 flex items-center px-3 space-x-1.5 z-10">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-[10px] text-white/40">happicore.studio</span>
                </div>
                <img
                  src={getOptimizedImageUrl(featuredWeb.thumbnail, { width: 900, crop: 'limit' })}
                  alt={featuredWeb.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover pt-7 group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-100"
                />
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="font-mono text-xs text-white/40 tracking-widest block mb-1">
                    [ 02 // WEB DEVELOPMENT ]
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-white/80 transition-colors">
                    {featuredWeb.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 max-w-md">
                    {featuredWeb.subtitle}
                  </p>
                </div>
                <span className="font-mono text-xs text-white/50 group-hover:text-white transition-colors flex items-center space-x-1">
                  <span>CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Graphic Poster Preview */}
            <div
              onClick={() => onSelectGraphic(featuredGraphic)}
              onMouseEnter={() => setCursorState('project')}
              onMouseLeave={() => setCursorState('default')}
              className="lg:col-span-5 group cursor-pointer space-y-4"
            >
              <div className="rounded-xl overflow-hidden border border-white/10 aspect-[4/5] relative bg-[#0e0e14]">
                <img
                  src={getOptimizedImageUrl(featuredGraphic.heroImage, { width: 700, crop: 'limit' })}
                  alt={featuredGraphic.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full font-mono text-[11px] text-white/80 border border-white/10">
                  GRAPHIC // POSTER
                </div>
              </div>

              <div>
                <span className="font-mono text-xs text-white/40 tracking-widest block mb-1">
                  [ 03 // VISUAL DESIGN ]
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-white/80 transition-colors">
                  {featuredGraphic.title}
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  {featuredGraphic.category} · {featuredGraphic.year}
                </p>
              </div>
            </div>

          </div>

          {/* Work Item 04: Society Annual Recap */}
          <div 
            onClick={() => onSelectVideo(secondaryVideo)}
            onMouseEnter={() => setCursorState('video')}
            onMouseLeave={() => setCursorState('default')}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-5 space-y-3 order-2 lg:order-1">
              <span className="font-mono text-xs text-white/40 tracking-widest">
                [ 04 // 2026 RECAP ]
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-white/80 transition-colors">
                {secondaryVideo.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {secondaryVideo.description}
              </p>
              <div className="font-mono text-xs text-white/70 pt-2 flex items-center space-x-2">
                <span>VIEW FILM DETAILS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div className="lg:col-span-7 overflow-hidden rounded-xl border border-white/10 aspect-[16/9] relative bg-[#0e0e14] order-1 lg:order-2">
              <img
                src={getOptimizedImageUrl(secondaryVideo.thumbnail, { width: 900, crop: 'limit' })}
                alt={secondaryVideo.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center backdrop-blur-sm transition-all">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 05. SERVICES SECTION                                      */}
      {/* ========================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="mb-14">
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
            05 // CREATIVE OFFERING
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            SERVICES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Service 01 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all duration-300 space-y-4 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-white/30 tracking-widest">[ 01 ]</span>
                <Film className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                VIDEO EDITING
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Turning raw footage into engaging visual stories. High-impact fest aftermovies, social short-form hype reels, and documentary recaps engineered with rhythmic cutting and deep audio sound design.
              </p>
            </div>
            <div className="pt-6 border-t border-white/[0.06] font-mono text-xs text-white/40 flex items-center justify-between">
              <span>Premiere Pro · CapCut · Alight</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Service 02 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all duration-300 space-y-4 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-white/30 tracking-widest">[ 02 ]</span>
                <Monitor className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                WEB DEVELOPMENT
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Building responsive and interactive digital experiences. Clean, semantic frontend architectures, GPU-accelerated motion, dynamic portfolio engines, and cloud asset distribution pipelines.
              </p>
            </div>
            <div className="pt-6 border-t border-white/[0.06] font-mono text-xs text-white/40 flex items-center justify-between">
              <span>HTML5 · CSS · JS · Tailwind</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Service 03 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all duration-300 space-y-4 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-white/30 tracking-widest">[ 03 ]</span>
                <Palette className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                GRAPHIC DESIGN
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Creating visual identities and communication assets. Event posters, social carousel kits, certificates, brand systems, and editorial typography that command attention in crowded digital streams.
              </p>
            </div>
            <div className="pt-6 border-t border-white/[0.06] font-mono text-xs text-white/40 flex items-center justify-between">
              <span>Photoshop · Figma · Canva</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 06. TOOLS & TECHNOLOGIES (INTERACTIVE 3D PERSPECTIVE)     */}
      {/* ========================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
              06 // STACK ARCHITECTURE
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              TOOLS & TECH
            </h2>
          </div>
          <p className="font-mono text-xs text-white/50 max-w-sm">
            Recognized tools applied across daily production workflows. Hover any item to inspect usage context.
          </p>
        </div>

        {/* 3D Interactive Tool Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS_DATA.map((tool, index) => {
            const isHovered = activeToolIndex === index;
            return (
              <motion.div
                key={tool.name}
                onMouseEnter={() => {
                  setActiveToolIndex(index);
                  setCursorState('open');
                }}
                onMouseLeave={() => {
                  setActiveToolIndex(null);
                  setCursorState('default');
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-xl border transition-all duration-300 relative cursor-pointer ${
                  isHovered
                    ? 'bg-white/[0.06] border-white/40 shadow-xl'
                    : 'bg-white/[0.02] border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-2 overflow-hidden shadow-inner group-hover:border-white/25 transition-all">
                    <ToolLogo name={tool.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-white/10 rounded text-white/60 uppercase">
                    {tool.category}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-1">
                  {tool.name}
                </h3>
                
                <p className="font-mono text-[11px] text-white/50 mb-3">
                  {tool.experienceLevel}
                </p>

                <p className="text-xs text-white/70 leading-relaxed">
                  {tool.roleDescription}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 07. HAPPICORE — INDEPENDENT CREATIVE STUDIO                */}
      {/* ========================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="rounded-3xl bg-gradient-to-b from-[#111117] to-[#0a0a0e] border border-white/15 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          
          {/* Subtle watermark background logo */}
          <div className="absolute right-4 bottom-0 opacity-5 font-display text-9xl sm:text-[14rem] font-extrabold pointer-events-none select-none">
            HAPPI
          </div>

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 font-mono text-[11px] text-white/80">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{PERSONAL_INFO.studio.descriptor}</span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              {PERSONAL_INFO.studio.name}
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              {PERSONAL_INFO.studio.description}
            </p>

            {/* Direct Work Paths (Rule 19: Do NOT make visitors depend on Instagram!) */}
            <div className="pt-4 space-y-3">
              <span className="font-mono text-[11px] tracking-widest text-white/40 uppercase block">
                DIRECT STUDIO PORTFOLIO PATHS:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => onNavigate('video')}
                  onMouseEnter={() => setCursorState('open')}
                  onMouseLeave={() => setCursorState('default')}
                  className="p-4 rounded-xl bg-white/[0.04] hover:bg-white text-white hover:text-[#08080a] border border-white/10 text-left transition-all cursor-pointer group"
                >
                  <span className="font-mono text-[10px] tracking-wider text-white/50 group-hover:text-black/60 block">
                    01 // FILM
                  </span>
                  <span className="font-display font-bold text-sm block mt-1">
                    VIDEO WORK →
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('graphic')}
                  onMouseEnter={() => setCursorState('open')}
                  onMouseLeave={() => setCursorState('default')}
                  className="p-4 rounded-xl bg-white/[0.04] hover:bg-white text-white hover:text-[#08080a] border border-white/10 text-left transition-all cursor-pointer group"
                >
                  <span className="font-mono text-[10px] tracking-wider text-white/50 group-hover:text-black/60 block">
                    02 // ART
                  </span>
                  <span className="font-display font-bold text-sm block mt-1">
                    GRAPHIC WORK →
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('web')}
                  onMouseEnter={() => setCursorState('open')}
                  onMouseLeave={() => setCursorState('default')}
                  className="p-4 rounded-xl bg-white/[0.04] hover:bg-white text-white hover:text-[#08080a] border border-white/10 text-left transition-all cursor-pointer group"
                >
                  <span className="font-mono text-[10px] tracking-wider text-white/50 group-hover:text-black/60 block">
                    03 // CODE
                  </span>
                  <span className="font-display font-bold text-sm block mt-1">
                    WEB WORK →
                  </span>
                </button>
              </div>
            </div>

            {/* Separate External Social CTA */}
            <div className="pt-4 flex items-center space-x-4">
              <a
                href={PERSONAL_INFO.studio.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursorState('open')}
                onMouseLeave={() => setCursorState('default')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-mono text-xs text-white transition-colors"
              >
                <span>EXPLORE HAPPICORE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={PERSONAL_INFO.studio.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-white/50 hover:text-white transition-colors"
              >
                {PERSONAL_INFO.studio.handle}
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 08. TESTIMONIALS (3D PERSPECTIVE MARQUEE)                 */}
      {/* ========================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
              08 // SOCIAL PROOF
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              WHAT PEOPLE SAY
            </h2>
          </div>
          <p className="font-mono text-xs text-white/50">
            [ Verified peer feedback & production citations ]
          </p>
        </div>

        {/* Perspective Testimonial Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors space-y-4"
            >
              <div className="flex text-amber-300 space-x-1 text-sm">
                {[...Array(item.stars)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                <div>
                  <h4 className="font-bold text-white">{item.author}</h4>
                  <p className="text-white/50 text-[11px]">{item.role}</p>
                </div>
                <span className="text-[10px] text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded">
                  {item.project}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 09. FREELANCE CTA SECTION (ARTISTIC FLAIR RECTANGULAR)    */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase">
            09 // COLLABORATION
          </span>

          <h2 className="font-display text-2xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#F5F5F4] leading-tight break-words">
            AVAILABLE FOR FREELANCE PROJECTS
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs text-white/60">
            <span className="px-3.5 py-1.5 bg-white/5 border border-white/10">
              VIDEO EDITING
            </span>
            <span className="px-3.5 py-1.5 bg-white/5 border border-white/10">
              WEB DEVELOPMENT
            </span>
            <span className="px-3.5 py-1.5 bg-white/5 border border-white/10">
              GRAPHIC DESIGN
            </span>
          </div>

          <div className="pt-4 sm:pt-6">
            <button
              onClick={() => onNavigate('contact')}
              onMouseEnter={() => setCursorState('contact')}
              onMouseLeave={() => setCursorState('default')}
              className="px-8 py-3.5 sm:py-4 bg-[#F5F5F4] text-[#050505] font-mono text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors cursor-pointer inline-flex items-center space-x-2 min-h-[44px]"
            >
              <span>START A PROJECT</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

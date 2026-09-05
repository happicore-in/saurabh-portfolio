import React, { useState } from 'react';
import { 
  Save, 
  Check, 
  Home, 
  Layers, 
  Star, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';

export const HomeContentManagerView: React.FC = () => {
  const { homeSections, updateHomeSections, webProjects, graphicProjects, videoProjects } = usePortfolioData();

  const [heroHeadline, setHeroHeadline] = useState(homeSections.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(homeSections.heroSubheadline);
  const [primaryCtaText, setPrimaryCtaText] = useState(homeSections.primaryCtaText);
  const [secondaryCtaText, setSecondaryCtaText] = useState(homeSections.secondaryCtaText);

  // Discipline Descriptions
  const [webDesc, setWebDesc] = useState(homeSections.disciplineDescriptions.web);
  const [graphicDesc, setGraphicDesc] = useState(homeSections.disciplineDescriptions.graphic);
  const [videoDesc, setVideoDesc] = useState(homeSections.disciplineDescriptions.video);

  // Selected Featured Projects
  const [featuredProjects, setFeaturedProjects] = useState<string[]>(homeSections.featuredProjectIds);

  const [savedNotice, setSavedNotice] = useState(false);

  const toggleFeaturedProject = (id: string) => {
    if (featuredProjects.includes(id)) {
      setFeaturedProjects(featuredProjects.filter(p => p !== id));
    } else {
      setFeaturedProjects([...featuredProjects, id]);
    }
  };

  const handleSave = () => {
    updateHomeSections({
      heroHeadline,
      heroSubheadline,
      primaryCtaText,
      secondaryCtaText,
      disciplineDescriptions: {
        web: webDesc,
        graphic: graphicDesc,
        video: videoDesc
      },
      featuredProjectIds: featuredProjects
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const allAvailableProjects = [
    ...webProjects.map(p => ({ id: p.id, title: p.title, type: 'WEB', year: p.year })),
    ...graphicProjects.map(p => ({ id: p.id, title: p.title, type: 'GRAPHIC', year: p.year })),
    ...videoProjects.map(p => ({ id: p.id, title: p.title, type: 'VIDEO', year: p.year }))
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4 sticky top-16 bg-[#050505] py-4 z-20">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            CONTENT MANAGEMENT // FRONT PAGE
          </span>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            HOME PAGE SECTIONS & SHOWCASE
          </h1>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>SAVE HOME SETTINGS</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Home page configuration successfully updated! Live immediately on public home view.</span>
        </div>
      )}

      {/* 01. Hero Section Management (Section 19) */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-5">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <Home className="w-4 h-4 text-white/60" />
          <span>HERO STAGE COPY & CALL-TO-ACTIONS</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            PRIMARY HERO HEADLINE
          </label>
          <input
            type="text"
            value={heroHeadline}
            onChange={(e) => setHeroHeadline(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-base text-white font-display font-bold focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            SUBHEADLINE / EDITORIAL BIO
          </label>
          <textarea
            rows={2}
            value={heroSubheadline}
            onChange={(e) => setHeroSubheadline(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 p-3 text-sm text-white focus:outline-none focus:border-white leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              PRIMARY CTA BUTTON TEXT
            </label>
            <input
              type="text"
              value={primaryCtaText}
              onChange={(e) => setPrimaryCtaText(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              SECONDARY CTA BUTTON TEXT
            </label>
            <input
              type="text"
              value={secondaryCtaText}
              onChange={(e) => setSecondaryCtaText(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 02. Discipline Switcher Descriptions */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <Layers className="w-4 h-4 text-white/60" />
          <span>TRI-DISCIPLINE SWITCHER MICROCOPY</span>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-white/60 uppercase text-[11px] mb-1">
              WEB DEVELOPMENT SUMMARY
            </label>
            <textarea
              rows={2}
              value={webDesc}
              onChange={(e) => setWebDesc(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 p-2.5 text-white focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-white/60 uppercase text-[11px] mb-1">
              GRAPHIC DESIGN SUMMARY
            </label>
            <textarea
              rows={2}
              value={graphicDesc}
              onChange={(e) => setGraphicDesc(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 p-2.5 text-white focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-white/60 uppercase text-[11px] mb-1">
              VIDEO EDITING SUMMARY
            </label>
            <textarea
              rows={2}
              value={videoDesc}
              onChange={(e) => setVideoDesc(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 p-2.5 text-white focus:outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* 03. Featured Work Selection (Section 19) */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 font-bold text-white uppercase tracking-wider">
            <Star className="w-4 h-4 text-amber-400" />
            <span>FEATURED SHOWCASE SELECTION ({featuredProjects.length} SELECTED)</span>
          </div>
          <span className="text-[10px] text-white/40">CHECK TO FEATURE ON HOME PAGE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {allAvailableProjects.map((p) => {
            const isFeatured = featuredProjects.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleFeaturedProject(p.id)}
                className={`p-3 border flex items-center justify-between transition-colors cursor-pointer select-none ${
                  isFeatured 
                    ? 'bg-white/10 border-white text-white' 
                    : 'bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-white/10 text-white/80">
                      {p.type}
                    </span>
                    <span className="font-bold text-xs truncate text-white">{p.title}</span>
                  </div>
                  <span className="text-[10px] text-white/40 block mt-1">Year: {p.year}</span>
                </div>

                <div className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                  isFeatured ? 'bg-white text-black border-white' : 'border-white/20'
                }`}>
                  {isFeatured && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="pt-6 border-t border-white/10 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors cursor-pointer flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>SAVE ALL CHANGES</span>
        </button>
      </div>

    </div>
  );
};

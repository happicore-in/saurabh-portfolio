import React, { useState } from 'react';
import { GraphicProject, CursorState } from '../types';
import { GRAPHIC_PROJECTS } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { LightboxModal } from '../components/ui/LightboxModal';
import { ArrowLeft, ArrowRight, Eye, Maximize2, Palette } from 'lucide-react';

interface GraphicDetailPageProps {
  project: GraphicProject;
  onBack: () => void;
  onSelectProject: (project: GraphicProject) => void;
  setCursorState: (state: CursorState) => void;
}

export const GraphicDetailPage: React.FC<GraphicDetailPageProps> = ({
  project,
  onBack,
  onSelectProject,
  setCursorState,
}) => {
  const { graphicProjects } = usePortfolioData();
  const allProjects = graphicProjects.length > 0 ? graphicProjects : GRAPHIC_PROJECTS;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!project) {
    return (
      <div className="w-full text-[#f2f2f5] pt-32 pb-24 px-4 max-w-5xl mx-auto text-center space-y-4">
        <p className="font-mono text-xs text-white/50 uppercase tracking-widest">GRAPHIC PROJECT NOT FOUND</p>
        <button 
          onClick={onBack} 
          className="px-5 py-2.5 bg-white text-black rounded-full font-mono text-xs font-bold hover:bg-white/90 cursor-pointer"
        >
          BACK TO ARCHIVE
        </button>
      </div>
    );
  }

  // Safe navigation without zero modulo or NaN
  const hasMultiple = allProjects.length > 1;
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = hasMultiple && currentIndex >= 0
    ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]
    : null;
  const nextProject = hasMultiple && currentIndex >= 0
    ? allProjects[(currentIndex + 1) % allProjects.length]
    : null;

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const allImages = (project.gallery || []).map((item) => ({
    url: getOptimizedImageUrl(item.url, { width: 1600, crop: 'limit' }),
    caption: item.caption,
  }));

  return (
    <div className="w-full text-[#f2f2f5] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 font-mono text-xs text-white/50 hover:text-white mb-8 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>BACK TO GRAPHIC ARCHIVE</span>
      </button>

      {/* Project Title & Metadata Header */}
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-white/40">
          <span className="text-white/80 uppercase">{project.category}</span>
          <span>·</span>
          <span>YEAR: {project.year}</span>
          <span>·</span>
          <span>ROLE: {project.role}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white break-words">
          {project.title}
        </h1>

        <div className="pt-2 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full font-mono text-xs text-white/70"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Large Hero Artwork Frame */}
      <div 
        onClick={() => openLightboxAt(0)}
        onMouseEnter={() => setCursorState('open')}
        onMouseLeave={() => setCursorState('default')}
        className="mb-12 rounded-2xl border border-white/15 overflow-hidden bg-[#0c0c10] shadow-2xl relative group cursor-pointer"
      >
        <img
          src={getOptimizedImageUrl(project.heroImage, { width: 1400, crop: 'limit' })}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full max-h-[75vh] object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="px-5 py-2.5 bg-white text-[#08080a] rounded-full font-mono text-xs font-bold tracking-wider flex items-center space-x-2 shadow-xl">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>OPEN HIGH-RES LIGHTBOX</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-16 max-w-3xl space-y-4">
        <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
          PROJECT SYNOPSIS & ART DIRECTION
        </h2>
        <p className="text-base sm:text-lg text-white/80 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Multiple Artwork Gallery */}
      <div className="space-y-6 mb-20">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
            COMPLETE ASSET GALLERY ({project.gallery.length} SLATES)
          </h2>
          <span className="font-mono text-xs text-white/40">
            CLICK ANY ASSET FOR FULLSCREEN VIEW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.gallery.map((item, index) => (
            <div
              key={index}
              onClick={() => openLightboxAt(index)}
              onMouseEnter={() => setCursorState('open')}
              onMouseLeave={() => setCursorState('default')}
              className="group cursor-pointer space-y-2"
            >
              <div className="rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-[#0c0c10] relative">
                <img
                  src={getOptimizedImageUrl(item.url, { width: 600, height: 450, crop: 'fill' })}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 p-1.5 rounded-md bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="font-mono text-xs text-white/60 group-hover:text-white transition-colors">
                {item.caption}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next Project Navigation */}
      {prevProject && nextProject && (
        <div className="pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-left transition-colors cursor-pointer group"
          >
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1">
              ← PREVIOUS GRAPHIC PROJECT
            </span>
            <span className="font-display font-bold text-lg text-white group-hover:text-white/80">
              {prevProject.title}
            </span>
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-right transition-colors cursor-pointer group"
          >
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1">
              NEXT GRAPHIC PROJECT →
            </span>
            <span className="font-display font-bold text-lg text-white group-hover:text-white/80">
              {nextProject.title}
            </span>
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

    </div>
  );
};

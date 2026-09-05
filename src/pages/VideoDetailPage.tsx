import React from 'react';
import { VideoProject, CursorState } from '../types';
import { VIDEO_PROJECTS } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl, getVideoPosterUrl } from '../lib/cloudinary';
import { ArrowLeft, Play, Server, Clock, Film, Layers } from 'lucide-react';

interface VideoDetailPageProps {
  project: VideoProject;
  onBack: () => void;
  onSelectProject: (project: VideoProject) => void;
  onOpenPlayer: (project: VideoProject) => void;
  setCursorState: (state: CursorState) => void;
}

export const VideoDetailPage: React.FC<VideoDetailPageProps> = ({
  project,
  onBack,
  onSelectProject,
  onOpenPlayer,
  setCursorState,
}) => {
  const { videoProjects } = usePortfolioData();
  const allProjects = videoProjects.length > 0 ? videoProjects : VIDEO_PROJECTS;

  if (!project) {
    return (
      <div className="w-full text-[#f2f2f5] pt-32 pb-24 px-4 max-w-5xl mx-auto text-center space-y-4">
        <p className="font-mono text-xs text-white/50 uppercase tracking-widest">VIDEO PROJECT NOT FOUND</p>
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

  const rawThumb = project.thumbnail || (project.cloudinaryPublicId ? getVideoPosterUrl(project.cloudinaryPublicId) : '');
  const thumbUrl = getOptimizedImageUrl(rawThumb, { width: 1400, crop: 'limit' });

  return (
    <div className="w-full text-[#f2f2f5] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 font-mono text-xs text-white/50 hover:text-white mb-8 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>BACK TO VIDEO ARCHIVE</span>
      </button>

      {/* Project Header */}
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-white/40">
          <span className="text-white/80 uppercase">{project.category}</span>
          <span>·</span>
          <span>YEAR: {project.year}</span>
          <span>·</span>
          <span>DURATION: {project.duration}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white break-words">
          {project.title}
        </h1>

        {/* Tools Badges */}
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

      {/* Large Cinematic Video Player Area */}
      <div 
        onClick={() => onOpenPlayer(project)}
        onMouseEnter={() => setCursorState('video')}
        onMouseLeave={() => setCursorState('default')}
        className="mb-16 aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black relative group cursor-pointer shadow-2xl"
      >
        <img
          src={thumbUrl}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover filter brightness-[0.75] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-[#08080a] border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-2xl transform group-hover:scale-110">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
          </div>
        </div>

        {/* Bottom Bar Info */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-xs text-white/80 pointer-events-none">
          <span className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-white/60" />
            <span>CLICK TO LAUNCH CINEMATIC MASTER</span>
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md">
            MASTER 1080P
          </span>
        </div>
      </div>

      {/* Structured Project Information Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        
        {/* Left Col: The Project / The Edit / The Result */}
        <div className="md:col-span-8 space-y-12">
          
          {/* THE PROJECT */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
              01 // THE PROJECT
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {project.theProject}
            </p>
          </section>

          {/* THE EDIT */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
              02 // THE EDIT & PIPELINE
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {project.theEdit}
            </p>
          </section>

          {/* THE RESULT */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
              03 // THE RESULT & RECEPTION
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {project.theResult}
            </p>
          </section>

        </div>

        {/* Right Col: Metadata Sidebar */}
        <div className="md:col-span-4 space-y-8 md:pl-6 md:border-l md:border-white/10">
          
          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-1">
              MY ROLE
            </span>
            <p className="font-display font-bold text-white text-lg">
              {project.role}
            </p>
          </div>

          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-1">
              YEAR OF PRODUCTION
            </span>
            <p className="font-mono text-white text-base">
              {project.year}
            </p>
          </div>

          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-1">
              CATEGORY
            </span>
            <p className="font-mono text-white text-sm">
              {project.category}
            </p>
          </div>

          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-1">
              TOOLS & NLE
            </span>
            <p className="font-mono text-white text-sm">
              {project.tools.join(', ')}
            </p>
          </div>

          {/* Cloud Storage Pipeline Architecture (Rule 28) */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-white/70">
              <Server className="w-3.5 h-3.5 text-white/50" />
              <span className="font-bold">STORAGE ARCHITECTURE</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Primary stream served via {project.videoSourceType === 'cloudinary' ? 'Cloudinary High-Speed Edge CDN' : project.videoSourceType === 'google-drive' ? 'Google Drive Video Stream' : 'Direct Video Stream'} with adaptive edge buffering.
            </p>
          </div>

        </div>

      </div>

      {/* Additional Stills / Film Frames */}
      {project.stills && project.stills.length > 0 && (
        <div className="mb-20 space-y-6">
          <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase border-b border-white/10 pb-4">
            SELECTED 4K FILM FRAMES & STILLS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.stills.map((still, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#0c0c10]">
                <img
                  src={getOptimizedImageUrl(still, { width: 800, crop: 'limit' })}
                  alt={`${project.title} frame ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-90 hover:brightness-100 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next Video Project Navigation */}
      {prevProject && nextProject && (
        <div className="pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-left transition-colors cursor-pointer group"
          >
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1">
              ← PREVIOUS VIDEO REEL
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
              NEXT VIDEO REEL →
            </span>
            <span className="font-display font-bold text-lg text-white group-hover:text-white/80">
              {nextProject.title}
            </span>
          </button>
        </div>
      )}

    </div>
  );
};

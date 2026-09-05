import React from 'react';
import { motion } from 'motion/react';
import { WebProject, CursorState } from '../types';
import { WEB_PROJECTS } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { ArrowLeft, ArrowRight, ExternalLink, Github, CheckCircle, Code, Layers } from 'lucide-react';

interface WebDetailPageProps {
  project: WebProject;
  onBack: () => void;
  onSelectProject: (project: WebProject) => void;
  setCursorState: (state: CursorState) => void;
}

export const WebDetailPage: React.FC<WebDetailPageProps> = ({
  project,
  onBack,
  onSelectProject,
  setCursorState,
}) => {
  const { webProjects } = usePortfolioData();
  const allProjects = webProjects.length > 0 ? webProjects : WEB_PROJECTS;

  if (!project) {
    return (
      <div className="w-full text-[#f2f2f5] pt-32 pb-24 px-4 max-w-5xl mx-auto text-center space-y-4">
        <p className="font-mono text-xs text-white/50 uppercase tracking-widest">WEB PROJECT NOT FOUND</p>
        <button 
          onClick={onBack} 
          className="px-5 py-2.5 bg-white text-black rounded-full font-mono text-xs font-bold hover:bg-white/90 cursor-pointer"
        >
          BACK TO ARCHIVE
        </button>
      </div>
    );
  }

  // Navigation: Safe Previous & Next project without zero modulo or NaN
  const hasMultiple = allProjects.length > 1;
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = hasMultiple && currentIndex >= 0
    ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]
    : null;
  const nextProject = hasMultiple && currentIndex >= 0
    ? allProjects[(currentIndex + 1) % allProjects.length]
    : null;

  return (
    <div className="w-full text-[#f2f2f5] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 font-mono text-xs text-white/50 hover:text-white mb-8 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>BACK TO WEB ARCHIVE</span>
      </button>

      {/* Project Title Header */}
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-white/40">
          <span>WEB PROJECT // {project.year}</span>
          <span>·</span>
          <span>ROLE: {project.role}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white break-words">
          {project.title}
        </h1>
        <p className="font-mono text-base text-white/70">
          {project.subtitle}
        </p>

        {/* Action Links */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorState('open')}
              onMouseLeave={() => setCursorState('default')}
              className="px-6 py-3 bg-white text-[#08080a] font-mono text-xs font-bold rounded-lg flex items-center space-x-2 hover:bg-white/90 transition-all shadow-md"
            >
              <span>LIVE WEBSITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorState('code')}
              onMouseLeave={() => setCursorState('default')}
              className="px-6 py-3 bg-white/[0.04] border border-white/20 text-white font-mono text-xs font-semibold rounded-lg flex items-center space-x-2 hover:bg-white/10 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>VIEW CODE</span>
            </a>
          )}
        </div>
      </div>

      {/* Large Website Browser Mock Preview */}
      <div className="mb-16 rounded-2xl border border-white/15 overflow-hidden bg-[#0c0c10] shadow-2xl">
        <div className="h-9 bg-[#14141c] border-b border-white/10 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          </div>
          <span className="font-mono text-[11px] text-white/50">{project.slug}.happicore.studio</span>
          <div className="w-10" />
        </div>
        <img
          src={getOptimizedImageUrl(project.thumbnail, { width: 1400, crop: 'limit' })}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full aspect-[16/9] object-cover"
        />
      </div>

      {/* Case Study Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        
        {/* Left Col: Overview & Process */}
        <div className="md:col-span-8 space-y-12">
          
          {/* Overview */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
              01 // PROJECT OVERVIEW
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {project.overview}
            </p>
          </section>

          {/* Key Features */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
              02 // KEY ARCHITECTURAL FEATURES
            </h2>
            <ul className="space-y-3">
              {project.keyFeatures.map((feat, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-white/70">
                  <CheckCircle className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Process */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
              03 // DESIGN & DEVELOPMENT PROCESS
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              {project.process}
            </p>
          </section>

          {/* Visual Previews */}
          {project.previews && project.previews.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
                04 // INTERFACE PREVIEWS
              </h2>
              <div className="space-y-4">
                {project.previews.map((imgUrl, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#09090c]">
                    <img
                      src={getOptimizedImageUrl(imgUrl, { width: 1200, crop: 'limit' })}
                      alt={`${project.title} preview ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Col: Metadata Sidebar */}
        <div className="md:col-span-4 space-y-8 md:pl-6 md:border-l md:border-white/10">
          
          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-2">
              MY ROLE
            </span>
            <p className="font-display font-bold text-white text-lg">
              {project.role}
            </p>
          </div>

          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-2">
              YEAR
            </span>
            <p className="font-mono text-white text-base">
              {project.year}
            </p>
          </div>

          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-2">
              TECHNOLOGIES
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded font-mono text-xs text-white/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-2">
              CLIENT / CONTEXT
            </span>
            <p className="font-mono text-sm text-white/70">
              Happicore Creative Ecosystem & IIT Madras Community
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Prev / Next Project Navigation */}
      {prevProject && nextProject && (
        <div className="pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-left transition-colors cursor-pointer group"
          >
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1">
              ← PREVIOUS WEB PROJECT
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
              NEXT WEB PROJECT →
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

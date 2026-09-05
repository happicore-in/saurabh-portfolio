import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageRoute, CursorState, WebProject } from '../types';
import { WEB_PROJECTS } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { ExternalLink, Github, ArrowRight, Monitor, Layers, Terminal } from 'lucide-react';

interface WebPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectWebProject: (project: WebProject) => void;
  setCursorState: (state: CursorState) => void;
}

export const WebPage: React.FC<WebPageProps> = ({
  onNavigate,
  onSelectWebProject,
  setCursorState,
}) => {
  const { webProjects } = usePortfolioData();
  const [filter, setFilter] = useState<string>('ALL');

  const allProjects = webProjects.length > 0 ? webProjects : WEB_PROJECTS;
  const categories = ['ALL', 'INTERFACES', 'PLATFORMS', 'SYSTEMS'];

  const filteredProjects = filter === 'ALL'
    ? allProjects
    : allProjects.filter((p) => p.category.toUpperCase().includes(filter));

  return (
    <div className="w-full max-w-7xl mx-auto text-[#f2f2f5] pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Header */}
      <div className="mb-12 sm:mb-16 border-b border-white/10 pb-8 sm:pb-12">
        <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-3">
          PORTFOLIO ARCHIVE // 01
        </span>
        <h1 className="font-display text-3xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none mb-4 break-words">
          WEB DEVELOPMENT
        </h1>
        <p className="font-mono text-sm sm:text-xl text-white/70 tracking-tight">
          BUILDING DIGITAL EXPERIENCES.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-2 mb-8 sm:mb-12 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              filter === cat
                ? 'bg-white text-[#08080a] font-semibold'
                : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Web Projects Catalog with Browser Window presentations */}
      <div className="space-y-12 sm:space-y-20">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-[#0d0d12] overflow-hidden group hover:border-white/20 transition-all duration-300 w-full"
          >
            {/* Browser Window Header Mock */}
            <div className="h-10 bg-[#121218] border-b border-white/10 px-3 sm:px-4 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/20" />
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/20" />
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-black/40 px-2.5 sm:px-4 py-1 rounded-md border border-white/5 font-mono text-[10px] sm:text-[11px] text-white/50 max-w-[170px] sm:max-w-sm truncate">
                <span className="text-white/20 hidden sm:inline">https://</span>
                <span className="text-white/80 truncate">{project.slug}.happicore.studio</span>
              </div>

              <span className="font-mono text-[11px] text-white/40 shrink-0">
                [{project.year}]
              </span>
            </div>

            {/* Content Split: Large Media Preview + Info Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-4 sm:p-8 items-center">
              
              {/* Media Preview */}
              <div
                onClick={() => onSelectWebProject(project)}
                onMouseEnter={() => setCursorState('project')}
                onMouseLeave={() => setCursorState('default')}
                className="lg:col-span-7 aspect-[16/10] rounded-xl overflow-hidden border border-white/10 relative cursor-pointer bg-black"
              >
                <img
                  src={getOptimizedImageUrl(project.thumbnail, { width: 1200, crop: 'limit' })}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-md font-mono text-[11px] text-white/80 border border-white/10 flex items-center space-x-2">
                  <Terminal className="w-3 h-3 text-white/60" />
                  <span>CLICK TO VIEW CASE STUDY</span>
                </div>
              </div>

              {/* Information Column */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <span className="font-mono text-xs text-white/40 tracking-widest uppercase block mb-1">
                    [ ROLE: {project.role} ]
                  </span>
                  <h2 
                    onClick={() => onSelectWebProject(project)}
                    className="font-display text-2xl sm:text-3xl font-bold text-white hover:text-white/80 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h2>
                  <p className="font-mono text-xs text-white/60 mt-1">
                    {project.subtitle}
                  </p>
                </div>

                <p className="text-sm text-white/70 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                    TECHNOLOGIES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded font-mono text-[11px] text-white/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: LIVE WEBSITE + VIEW CODE + CASE STUDY */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursorState('open')}
                      onMouseLeave={() => setCursorState('default')}
                      className="px-4 py-2 bg-white text-[#08080a] hover:bg-white/90 font-mono text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>LIVE WEBSITE</span>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursorState('code')}
                      onMouseLeave={() => setCursorState('default')}
                      className="px-4 py-2 bg-white/[0.04] border border-white/20 text-white hover:bg-white/10 font-mono text-xs rounded-lg flex items-center space-x-1.5 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>VIEW CODE</span>
                    </a>
                  )}

                  <button
                    onClick={() => onSelectWebProject(project)}
                    className="px-3 py-2 text-white/60 hover:text-white font-mono text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

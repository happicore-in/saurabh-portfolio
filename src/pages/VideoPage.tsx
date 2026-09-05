import React from 'react';
import { motion } from 'motion/react';
import { PageRoute, CursorState, VideoProject } from '../types';
import { VIDEO_PROJECTS } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl, getVideoPosterUrl } from '../lib/cloudinary';
import { Play, ArrowRight, Film, Clock } from 'lucide-react';

interface VideoPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectVideoProject: (project: VideoProject) => void;
  onPlayVideoModal: (project: VideoProject) => void;
  setCursorState: (state: CursorState) => void;
}

export const VideoPage: React.FC<VideoPageProps> = ({
  onNavigate,
  onSelectVideoProject,
  onPlayVideoModal,
  setCursorState,
}) => {
  const { videoProjects } = usePortfolioData();
  const allProjects = videoProjects.length > 0 ? videoProjects : VIDEO_PROJECTS;

  return (
    <div className="w-full max-w-7xl mx-auto text-[#f2f2f5] pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Header */}
      <div className="mb-12 sm:mb-16 border-b border-white/10 pb-8 sm:pb-12">
        <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-3">
          PORTFOLIO ARCHIVE // 03
        </span>
        <h1 className="font-display text-3xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none mb-4 break-words">
          VIDEO EDITING
        </h1>
        <p className="font-mono text-sm sm:text-xl text-white/70 tracking-tight">
          TURNING RAW FOOTAGE INTO STORIES.
        </p>
      </div>

      {/* Video Catalog (Large Cinematic Cards) */}
      <div className="space-y-20">
        {allProjects.map((project, index) => {
          const rawThumb = project.thumbnail || (project.cloudinaryPublicId ? getVideoPosterUrl(project.cloudinaryPublicId) : '');
          const thumbUrl = getOptimizedImageUrl(rawThumb, { width: 1200, crop: 'limit' });

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/10 pb-16"
            >
              {/* Cinematic Video Thumbnail with Direct Play Button */}
              <div
                onClick={() => onSelectVideoProject(project)}
                onMouseEnter={() => setCursorState('video')}
                onMouseLeave={() => setCursorState('default')}
                className="lg:col-span-8 aspect-video rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer bg-[#0e0e14] shadow-2xl"
              >
                <img
                  src={thumbUrl}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[0.75] group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
                />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Central Floating Play Trigger */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayVideoModal(project);
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-[#08080a] border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-2xl transform group-hover:scale-110 cursor-pointer"
                  title="Play Reel"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                </button>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full font-mono text-[11px] text-white/90 border border-white/10 flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-white/50" />
                <span>{project.duration}</span>
              </div>

              {/* Tag */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full font-mono text-[11px] text-white/80 border border-white/10">
                {project.category}
              </div>
            </div>

            {/* Video Details Column */}
            <div className="lg:col-span-4 space-y-5">
              <div>
                <span className="font-mono text-xs text-white/40 tracking-widest uppercase block mb-1">
                  [ {project.year} // {project.role} ]
                </span>
                <h2 
                  onClick={() => onSelectVideoProject(project)}
                  className="font-display text-2xl sm:text-3xl font-bold text-white hover:text-white/80 transition-colors cursor-pointer"
                >
                  {project.title}
                </h2>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                {project.description}
              </p>

              {/* Tools Used */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                  TOOLS & NLE:
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded font-mono text-[11px] text-white/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={() => onPlayVideoModal(project)}
                  onMouseEnter={() => setCursorState('video')}
                  onMouseLeave={() => setCursorState('default')}
                  className="px-5 py-2.5 bg-white text-[#08080a] font-mono text-xs font-bold rounded-lg flex items-center space-x-2 hover:bg-white/90 transition-all cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>WATCH VIDEO</span>
                </button>

                <button
                  onClick={() => onSelectVideoProject(project)}
                  className="font-mono text-xs text-white/60 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>CASE BREAKDOWN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>
          );
        })}
      </div>

    </div>
  );
};

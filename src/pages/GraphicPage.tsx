import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageRoute, CursorState, GraphicProject } from '../types';
import { GRAPHIC_PROJECTS } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { ArrowRight, Eye, Layers } from 'lucide-react';

interface GraphicPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectGraphicProject: (project: GraphicProject) => void;
  setCursorState: (state: CursorState) => void;
}

export const GraphicPage: React.FC<GraphicPageProps> = ({
  onNavigate,
  onSelectGraphicProject,
  setCursorState,
}) => {
  const { graphicProjects } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const allProjects = graphicProjects.length > 0 ? graphicProjects : GRAPHIC_PROJECTS;

  const categories = [
    'ALL',
    'Posters & Events',
    'Social Creatives',
    'Certificates',
    'Visual Identity'
  ];

  const filteredProjects = selectedCategory === 'ALL'
    ? allProjects
    : allProjects.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(p.category.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto text-[#f2f2f5] pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Header */}
      <div className="mb-12 sm:mb-16 border-b border-white/10 pb-8 sm:pb-12">
        <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-3">
          PORTFOLIO ARCHIVE // 02
        </span>
        <h1 className="font-display text-3xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none mb-4 break-words">
          GRAPHIC DESIGN
        </h1>
        <p className="font-mono text-sm sm:text-xl text-white/70 tracking-tight">
          DESIGNING WHAT PEOPLE SEE.
        </p>
      </div>

      {/* Category Pills */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-2 mb-8 sm:mb-12 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              selectedCategory === cat
                ? 'bg-white text-[#08080a] font-semibold'
                : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asymmetric Editorial Gallery Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {filteredProjects.map((project, index) => {
          // Asymmetric column widths: Alternate between wide (7 cols) and compact (5 cols)
          const isWide = index % 3 === 0;
          const colSpan = isWide ? 'md:col-span-8' : index % 3 === 1 ? 'md:col-span-4' : 'md:col-span-6';

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => onSelectGraphicProject(project)}
              onMouseEnter={() => setCursorState('project')}
              onMouseLeave={() => setCursorState('default')}
              className={`${colSpan} group cursor-pointer space-y-4`}
            >
              {/* Image Frame with subtle 3D hover perspective */}
              <div className="rounded-2xl overflow-hidden border border-white/10 relative bg-[#0e0e14] shadow-lg">
                <div className={`${isWide ? 'aspect-[16/10]' : 'aspect-[4/5]'} w-full overflow-hidden`}>
                  <img
                    src={getOptimizedImageUrl(project.heroImage, { width: isWide ? 1200 : 800, crop: 'limit' })}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-transform duration-700 ease-out"
                  />
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full font-mono text-[10px] text-white/80 border border-white/10 uppercase">
                  {project.category}
                </div>

                {/* Hover Overlay Badge */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="px-5 py-2.5 rounded-full bg-white text-[#08080a] font-mono text-xs font-bold tracking-widest uppercase flex items-center space-x-2 shadow-2xl">
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW DESIGN</span>
                  </div>
                </div>
              </div>

              {/* Text Information */}
              <div className="pt-1 flex items-baseline justify-between">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-white/80 transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs text-white/50 mt-1">
                    {project.role} · {project.year}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

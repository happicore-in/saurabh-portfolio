import React, { useState } from 'react';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  X, 
  ArrowLeft, 
  Edit3, 
  Check, 
  ExternalLink,
  Github,
  Play,
  Share2
} from 'lucide-react';
import { WebProject, GraphicProject, VideoProject } from '../../../types';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onPublish?: () => void;
  project: {
    type: 'web' | 'graphic' | 'video';
    data: WebProject | GraphicProject | VideoProject;
  } | null;
}

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onPublish,
  project
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [published, setPublished] = useState(false);

  if (!isOpen || !project) return null;

  const { type, data } = project;

  const handlePublishClick = () => {
    setPublished(true);
    if (onPublish) onPublish();
    setTimeout(() => setPublished(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] text-[#F5F5F4] animate-in fade-in duration-150 font-sans">
      
      {/* Top Preview Control Bar */}
      <div className="h-16 border-b border-white/15 bg-[#0A0A0A] px-4 sm:px-6 flex items-center justify-between shrink-0 font-mono text-xs">
        
        {/* Left: Back & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">BACK TO CMS</span>
          </button>

          <div className="hidden md:flex items-center space-x-2 text-white/50 text-[11px]">
            <span>PREVIEWING:</span>
            <span className="text-white font-bold truncate max-w-xs">{data.title}</span>
            <span className="px-1.5 py-0.5 bg-white/10 text-white/70 uppercase text-[9px]">{type}</span>
          </div>
        </div>

        {/* Center: Viewport Mode Switcher */}
        <div className="flex items-center space-x-1 p-1 bg-white/5 border border-white/10">
          <button
            onClick={() => setViewport('desktop')}
            className={`px-3 py-1.5 flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DESKTOP (100%)</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            className={`px-3 py-1.5 flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TABLET (768px)</span>
          </button>

          <button
            onClick={() => setViewport('mobile')}
            className={`px-3 py-1.5 flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MOBILE (390px)</span>
          </button>
        </div>

        {/* Right: Edit & Publish Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EDIT FORM</span>
          </button>

          <button
            onClick={handlePublishClick}
            className="px-4 py-1.5 bg-white text-black font-bold hover:bg-white/90 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{published ? 'PUBLISHED!' : 'PUBLISH'}</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-white/50 hover:text-white bg-white/5 border border-white/10 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 overflow-y-auto bg-[#030303] p-4 sm:p-8 flex justify-center items-start">
        
        <div
          className={`bg-[#050505] border border-white/15 transition-all duration-300 shadow-2xl min-h-[85vh] overflow-hidden ${
            viewport === 'desktop' ? 'w-full max-w-6xl' :
            viewport === 'tablet' ? 'w-[768px] max-w-full' :
            'w-[390px] max-w-full'
          }`}
        >
          {/* Inner Simulated Public Website Navbar */}
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between font-mono text-[10px] text-white/40 uppercase tracking-widest bg-[#0A0A0A]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-bold font-sans">SAURABH</span>
            </div>
            <span>PUBLIC LIVE PREVIEW</span>
          </div>

          {/* Render Public Detail Content corresponding to project type */}
          <div className="p-6 sm:p-12 space-y-10 text-[#F5F5F4]">
            
            {/* Title & Metadata Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-white/50 mb-3">
                <span className="text-white font-bold">{data.year}</span>
                <span>/</span>
                <span>{data.role}</span>
                <span>/</span>
                <span className="px-2 py-0.5 bg-white/10 text-white/80">{type.toUpperCase()}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
                {data.title}
              </h1>

              {'subtitle' in data && (
                <p className="mt-2 text-lg text-white/70 font-light">
                  {data.subtitle}
                </p>
              )}
            </div>

            {/* Main Visual Cover */}
            <div className="aspect-video w-full bg-[#111] border border-white/10 relative overflow-hidden flex items-center justify-center">
              {'thumbnail' in data && data.thumbnail ? (
                <img 
                  src={data.thumbnail} 
                  alt={data.title} 
                  className="w-full h-full object-cover" 
                />
              ) : 'heroImage' in data && data.heroImage ? (
                <img 
                  src={data.heroImage} 
                  alt={data.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center font-mono text-xs text-white/40 p-8">
                  NO COVER IMAGE ASSIGNED
                </div>
              )}

              {type === 'video' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Description & Technical Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
                    PROJECT OVERVIEW
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                    {data.description}
                  </p>
                </div>

                {'overview' in data && (
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
                      TECHNICAL ARCHITECTURE
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed font-mono">
                      {data.overview}
                    </p>
                  </div>
                )}

                {/* Video Case Study Points */}
                {'theProject' in data && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-white/60 mb-1">THE DIRECTIVE</h4>
                      <p className="text-xs text-white/80">{data.theProject}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono uppercase text-white/60 mb-1">THE EDIT WORKFLOW</h4>
                      <p className="text-xs text-white/80">{data.theEdit}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono uppercase text-white/60 mb-1">THE METRICS</h4>
                      <p className="text-xs text-white/80">{data.theResult}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Metadata */}
              <div className="space-y-6 font-mono text-xs border-l border-white/10 pl-6">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">
                    DISCIPLINE TOOLS & STACK
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {'technologies' in data && data.technologies.map(t => (
                      <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 text-white/80">
                        {t}
                      </span>
                    ))}
                    {'tools' in data && data.tools.map(t => (
                      <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 text-white/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {'liveUrl' in data && data.liveUrl && (
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">
                      LIVE DEPLOYMENT
                    </span>
                    <a 
                      href={data.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:underline flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{data.liveUrl}</span>
                    </a>
                  </div>
                )}

                {'githubUrl' in data && data.githubUrl && (
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">
                      SOURCE REPOSITORY
                    </span>
                    <a 
                      href={data.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:underline flex items-center gap-1 truncate"
                    >
                      <Github className="w-3 h-3" />
                      <span className="truncate">{data.githubUrl}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

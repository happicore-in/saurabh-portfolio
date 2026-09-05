import React, { useState, useMemo } from 'react';
import { Search, X, FolderKanban, Award, Briefcase, Image as ImageIcon, MessageSquare, ArrowRight } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';

interface GlobalSearchResult {
  id: string;
  type: 'PROJECT' | 'CREDENTIAL' | 'EXPERIENCE' | 'MEDIA' | 'TESTIMONIAL';
  title: string;
  subtitle: string;
  status: 'PUBLISHED' | 'DRAFT' | 'READY';
  lastUpdated: string;
  targetView: string;
  entityId?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (view: string, entityId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const { 
    webProjects, 
    graphicProjects, 
    videoProjects, 
    credentials, 
    experience, 
    mediaItems, 
    testimonials 
  } = usePortfolioData();

  const allSearchableItems: GlobalSearchResult[] = useMemo(() => {
    const list: GlobalSearchResult[] = [];

    // Web Projects
    webProjects.forEach(p => {
      list.push({
        id: p.id,
        type: 'PROJECT',
        title: p.title,
        subtitle: `Web Project // ${p.year} // ${p.technologies.slice(0, 3).join(', ')}`,
        status: 'PUBLISHED',
        lastUpdated: 'Recently updated',
        targetView: 'portfolio-web',
        entityId: p.id
      });
    });

    // Graphic Projects
    graphicProjects.forEach(p => {
      list.push({
        id: p.id,
        type: 'PROJECT',
        title: p.title,
        subtitle: `Graphic // ${p.category} // ${p.year}`,
        status: 'PUBLISHED',
        lastUpdated: 'Recently updated',
        targetView: 'portfolio-graphic',
        entityId: p.id
      });
    });

    // Video Projects
    videoProjects.forEach(p => {
      list.push({
        id: p.id,
        type: 'PROJECT',
        title: p.title,
        subtitle: `Video Reel // ${p.category} // ${p.duration}`,
        status: 'PUBLISHED',
        lastUpdated: 'Recently updated',
        targetView: 'portfolio-video',
        entityId: p.id
      });
    });

    // Credentials
    credentials.forEach(c => {
      list.push({
        id: c.id,
        type: 'CREDENTIAL',
        title: `${c.number} — ${c.title}`,
        subtitle: `${c.category} // Issued by ${c.issuedBy} (${c.year})`,
        status: 'PUBLISHED',
        lastUpdated: 'Verified archive',
        targetView: 'content-credentials',
        entityId: c.id
      });
    });

    // Experience
    experience.forEach(e => {
      list.push({
        id: e.id,
        type: 'EXPERIENCE',
        title: `${e.role} @ ${e.organization}`,
        subtitle: `${e.period} // ${e.location || 'India'}`,
        status: 'PUBLISHED',
        lastUpdated: 'Live profile',
        targetView: 'content-experience',
        entityId: e.id
      });
    });

    // Media Items
    mediaItems.forEach(m => {
      list.push({
        id: m.id,
        type: 'MEDIA',
        title: m.name,
        subtitle: `${m.type.toUpperCase()} // ${m.size} // Used in: ${m.usedIn[0] || 'Unassigned'}`,
        status: 'READY',
        lastUpdated: m.uploadedAt,
        targetView: 'media-library',
        entityId: m.id
      });
    });

    // Testimonials
    testimonials.forEach(t => {
      list.push({
        id: t.id,
        type: 'TESTIMONIAL',
        title: `${t.author} (${t.role})`,
        subtitle: t.quote.slice(0, 60) + '...',
        status: 'PUBLISHED',
        lastUpdated: 'Active review',
        targetView: 'testimonials',
        entityId: t.id
      });
    });

    return list;
  }, [webProjects, graphicProjects, videoProjects, credentials, experience, mediaItems, testimonials]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return allSearchableItems.slice(0, 8);
    const q = query.toLowerCase();
    return allSearchableItems.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.subtitle.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  }, [query, allSearchableItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0E0E0E] border border-white/20 max-w-2xl w-full shadow-2xl relative overflow-hidden font-sans">
        
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-white/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, media, credentials, experience..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white text-xs font-mono"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-white/50 hover:text-white bg-white/5 border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Metadata */}
        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
          <span>{filteredResults.length} RECORDS FOUND</span>
          <span>PRESS ESC TO CLOSE</span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-white/40 font-mono text-xs">
              NO MATCHING CONTENT FOUND FOR &quot;{query}&quot;
            </div>
          ) : (
            filteredResults.map((result) => {
              const Icon = 
                result.type === 'PROJECT' ? FolderKanban :
                result.type === 'CREDENTIAL' ? Award :
                result.type === 'EXPERIENCE' ? Briefcase :
                result.type === 'MEDIA' ? ImageIcon : MessageSquare;

              return (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => {
                    onSelectResult(result.targetView, result.entityId);
                    onClose();
                  }}
                  className="p-3 bg-white/[0.02] hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-white/10 text-white/70">
                          {result.type}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-white truncate">
                          {result.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-white/50 truncate font-mono mt-0.5">
                        {result.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 block">
                        {result.status}
                      </span>
                      <span className="text-[9px] font-mono text-white/30 block mt-1">
                        {result.lastUpdated}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between text-[10px] font-mono text-white/40">
          <span>JUMP DIRECTLY TO ANY PORTFOLIO ENTITY</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 bg-white/10">↑↓</kbd> NAVIGATE <kbd className="px-1 bg-white/10 ml-1">↵</kbd> SELECT
          </span>
        </div>

      </div>
    </div>
  );
};

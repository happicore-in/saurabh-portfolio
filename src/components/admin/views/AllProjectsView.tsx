import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Eye, 
  Copy, 
  Archive, 
  Trash2, 
  Globe, 
  Palette, 
  Film,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { WebProject, GraphicProject, VideoProject } from '../../../types';

interface UnifiedProjectRow {
  id: string;
  type: 'web' | 'graphic' | 'video';
  title: string;
  category: string;
  year: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  lastUpdated: string;
  thumbnail: string;
  original: WebProject | GraphicProject | VideoProject;
}

interface AllProjectsViewProps {
  initialFilter?: 'all' | 'web' | 'graphic' | 'video';
  onAddProject: (type: 'web' | 'graphic' | 'video') => void;
  onEditProject: (type: 'web' | 'graphic' | 'video', id: string) => void;
  onPreviewProject: (type: 'web' | 'graphic' | 'video', data: WebProject | GraphicProject | VideoProject) => void;
  onRequestDelete: (type: 'web' | 'graphic' | 'video', id: string, title: string) => void;
}

export const AllProjectsView: React.FC<AllProjectsViewProps> = ({
  initialFilter = 'all',
  onAddProject,
  onEditProject,
  onPreviewProject,
  onRequestDelete
}) => {
  const { 
    webProjects, 
    graphicProjects, 
    videoProjects, 
    addWebProject, 
    addGraphicProject, 
    addVideoProject,
    logActivity 
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'graphic' | 'video'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Normalize into unified rows
  const allRows: UnifiedProjectRow[] = useMemo(() => {
    const list: UnifiedProjectRow[] = [];

    webProjects.forEach(p => {
      list.push({
        id: p.id,
        type: 'web',
        title: p.title,
        category: 'Web Development',
        year: p.year,
        status: 'PUBLISHED',
        lastUpdated: '2026-03-01',
        thumbnail: p.thumbnail,
        original: p
      });
    });

    graphicProjects.forEach(p => {
      list.push({
        id: p.id,
        type: 'graphic',
        title: p.title,
        category: p.category,
        year: p.year,
        status: 'PUBLISHED',
        lastUpdated: '2026-02-28',
        thumbnail: p.heroImage,
        original: p
      });
    });

    videoProjects.forEach(p => {
      list.push({
        id: p.id,
        type: 'video',
        title: p.title,
        category: p.category,
        year: p.year,
        status: 'PUBLISHED',
        lastUpdated: '2026-03-02',
        thumbnail: p.thumbnail,
        original: p
      });
    });

    return list;
  }, [webProjects, graphicProjects, videoProjects]);

  const filteredRows = useMemo(() => {
    return allRows
      .filter(row => {
        if (activeTab !== 'all' && row.type !== activeTab) return false;
        if (statusFilter !== 'ALL' && row.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return row.title.toLowerCase().includes(q) || row.category.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.year.localeCompare(a.year);
        if (sortBy === 'oldest') return a.year.localeCompare(b.year);
        return a.title.localeCompare(b.title);
      });
  }, [allRows, activeTab, statusFilter, searchQuery, sortBy]);

  const handleDuplicate = (row: UnifiedProjectRow) => {
    const newId = `${row.id}-copy-${Date.now()}`;
    const newTitle = `${row.title} (Copy)`;

    if (row.type === 'web') {
      addWebProject({ ...(row.original as WebProject), id: newId, title: newTitle, slug: `${(row.original as WebProject).slug}-copy` });
    } else if (row.type === 'graphic') {
      addGraphicProject({ ...(row.original as GraphicProject), id: newId, title: newTitle, slug: `${(row.original as GraphicProject).slug}-copy` });
    } else {
      addVideoProject({ ...(row.original as VideoProject), id: newId, title: newTitle, slug: `${(row.original as VideoProject).slug}-copy` });
    }

    setCopiedNotice(`Duplicated "${row.title}" into draft copy.`);
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & New Project Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 mb-1">
            <span>REPOSITORY // INVENTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F4] tracking-tight">
            ALL PORTFOLIO PROJECTS
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
            Filter, inspect, duplicate and stage projects across Web, Graphic and Video disciplines.
          </p>
        </div>

        {/* Action Dropdown or Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onAddProject(activeTab === 'all' ? 'web' : activeTab)}
            className="px-4 py-2.5 bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW {activeTab === 'all' ? 'PROJECT' : activeTab.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {copiedNotice && (
        <div className="p-3 bg-white/10 border border-white/20 text-xs font-mono text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Tab Navigation & Search Controls */}
      <div className="space-y-4">
        
        {/* Filter Tabs: ALL, WEB, GRAPHIC, VIDEO */}
        <div className="flex items-center space-x-1 border-b border-white/10 pb-2 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'all' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            ALL ({allRows.length})
          </button>

          <button
            onClick={() => setActiveTab('web')}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'web' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>WEB ({webProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('graphic')}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'graphic' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>GRAPHIC ({graphicProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'video' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>VIDEO ({videoProjects.length})</span>
          </button>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between font-mono text-xs">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-[#111] border border-white/15 pl-9 pr-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-white/40 uppercase text-[10px]">STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#111] border border-white/15 px-2.5 py-1.5 text-white focus:outline-none text-xs"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-white/40 uppercase text-[10px]">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#111] border border-white/15 px-2.5 py-1.5 text-white focus:outline-none text-xs"
              >
                <option value="newest">NEWEST YEAR</option>
                <option value="oldest">OLDEST YEAR</option>
                <option value="title">TITLE (A-Z)</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Projects Table / Responsive Card View */}
      {filteredRows.length === 0 ? (
        /* Empty State (Section 42) */
        <div className="p-12 text-center bg-[#0C0C0C] border border-dashed border-white/15 my-8">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-white/40">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="font-display text-base font-bold text-white uppercase tracking-tight">
            NO {activeTab !== 'all' ? activeTab.toUpperCase() : ''} PROJECTS FOUND
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1 max-w-sm mx-auto">
            {searchQuery ? `No results match "${searchQuery}". Try modifying your query.` : 'Your future creative records will appear here.'}
          </p>
          <button
            onClick={() => onAddProject(activeTab === 'all' ? 'web' : activeTab)}
            className="mt-5 px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ADD PROJECT</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#0C0C0C] border border-white/10 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 text-[10px] uppercase tracking-wider">
                <th className="p-3.5 w-16">THUMBNAIL</th>
                <th className="p-3.5">PROJECT NAME</th>
                <th className="p-3.5">CATEGORY</th>
                <th className="p-3.5">YEAR</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 hidden md:table-cell">LAST UPDATED</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRows.map((row) => (
                <tr key={`${row.type}-${row.id}`} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Thumbnail */}
                  <td className="p-3.5">
                    <div className="w-14 h-10 bg-[#151515] border border-white/10 overflow-hidden shrink-0">
                      {row.thumbnail ? (
                        <img 
                          src={row.thumbnail} 
                          alt={row.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-white/20">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name & Type */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-white transition-colors truncate max-w-xs">
                        {row.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block mt-0.5">
                      {row.type.toUpperCase()} DISCIPLINE
                    </span>
                  </td>

                  {/* Category */}
                  <td className="p-3.5 text-white/70">
                    {row.category}
                  </td>

                  {/* Year */}
                  <td className="p-3.5 text-white/70 font-bold">
                    {row.year}
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider border ${
                      row.status === 'PUBLISHED' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20' :
                      row.status === 'DRAFT' ? 'bg-amber-950/40 text-amber-300 border-amber-500/20' :
                      'bg-white/5 text-white/40 border-white/10'
                    }`}>
                      {row.status}
                    </span>
                  </td>

                  {/* Last Updated */}
                  <td className="p-3.5 text-white/40 text-[11px] hidden md:table-cell">
                    {row.lastUpdated}
                  </td>

                  {/* Actions: Edit, Preview, Duplicate, Archive, Delete */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreviewProject(row.type, row.original)}
                        title="Preview Public Page"
                        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEditProject(row.type, row.id)}
                        title="Edit Project"
                        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(row)}
                        title="Duplicate as Draft"
                        className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRequestDelete(row.type, row.id, row.title)}
                        title="Permanently Delete"
                        className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2">
        <span>SHOWING {filteredRows.length} OF {allRows.length} TOTAL RECORDS</span>
        <span>MODIFICATIONS COMMITTED INSTANTLY</span>
      </div>

    </div>
  );
};

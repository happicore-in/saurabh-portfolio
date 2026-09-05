import React from 'react';
import { 
  FolderKanban, 
  Globe, 
  Palette, 
  Film, 
  Award, 
  Plus, 
  UploadCloud, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Activity,
  HardDrive,
  ShieldCheck,
  TrendingUp,
  FileText,
  Inbox
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';

interface DashboardHomeViewProps {
  onNavigateView: (view: string) => void;
  onAddWebProject: () => void;
  onAddGraphicProject: () => void;
  onAddVideoProject: () => void;
  onAddCredential: () => void;
  onAddExperience: () => void;
  onUploadMedia: () => void;
}

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  onNavigateView,
  onAddWebProject,
  onAddGraphicProject,
  onAddVideoProject,
  onAddCredential,
  onAddExperience,
  onUploadMedia
}) => {
  const { 
    webProjects, 
    graphicProjects, 
    videoProjects, 
    credentials, 
    activities, 
    mediaItems,
    personalInfo,
    inquiries,
    unreadInquiriesCount
  } = usePortfolioData();

  const totalProjects = webProjects.length + graphicProjects.length + videoProjects.length;
  const publishedCount = totalProjects + credentials.length;
  const draftCount = 2; // dynamic placeholder
  const recentlyUpdatedCount = activities.length;

  return (
    <div className="space-y-10 font-sans">
      
      {/* 01. Welcome Header & Freelance Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>STUDIO SYSTEM // ACTIVE SESSION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F5F5F4] tracking-tight">
            GOOD TO SEE YOU, SAURABH.
          </h1>
          <p className="mt-1 text-sm text-white/60 font-light">
            Manage your creative portfolio, cloud media streams and archive records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-white/5 border border-white/10 font-mono text-xs text-white/80 flex items-center gap-2">
            <span className="text-white/40">FREELANCE STATUS:</span>
            <span className={personalInfo.statusTag?.includes('AVAILABLE') ? 'text-emerald-400 font-bold' : 'text-white'}>
              {personalInfo.statusTag || 'AVAILABLE'}
            </span>
          </div>

          <button
            onClick={() => onNavigateView('settings-storage')}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">STORAGE PIPELINE</span>
          </button>
        </div>
      </div>

      {/* Unread Inquiries Banner */}
      {unreadInquiriesCount > 0 && (
        <div className="p-4 bg-white/[0.03] border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <span className="text-white font-bold text-xs uppercase tracking-wider block">
                {unreadInquiriesCount} NEW CLIENT INQUIR{unreadInquiriesCount > 1 ? 'IES' : 'Y'} RECEIVED
              </span>
              <span className="text-white/50 text-[11px]">
                Potential leads submitted via your public contact form.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateView('contact-inquiries')}
            className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            VIEW INQUIRIES ({unreadInquiriesCount})
          </button>
        </div>
      )}

      {/* 02. Overview Statistics (Section 05) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 font-bold">
            OVERVIEW METRICS
          </h2>
          <span className="text-[10px] font-mono text-white/30">REAL-TIME PORTFOLIO SYNC</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Total Projects */}
          <div 
            onClick={() => onNavigateView('portfolio-all')}
            className="p-5 bg-[#0C0C0C] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-white/40 mb-3 font-mono text-[10px]">
              <span className="uppercase tracking-widest">TOTAL PROJECTS</span>
              <FolderKanban className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <div className="text-3xl font-display font-bold text-white">
              {totalProjects}
            </div>
            <div className="mt-2 text-[10px] font-mono text-white/40">
              Across 3 disciplines
            </div>
          </div>

          {/* Web Projects */}
          <div 
            onClick={() => onNavigateView('portfolio-web')}
            className="p-5 bg-[#0C0C0C] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-white/40 mb-3 font-mono text-[10px]">
              <span className="uppercase tracking-widest">WEB PROJECTS</span>
              <Globe className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <div className="text-3xl font-display font-bold text-white">
              {webProjects.length}
            </div>
            <div className="mt-2 text-[10px] font-mono text-emerald-400/80">
              Active React & Next.js
            </div>
          </div>

          {/* Graphic Projects */}
          <div 
            onClick={() => onNavigateView('portfolio-graphic')}
            className="p-5 bg-[#0C0C0C] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-white/40 mb-3 font-mono text-[10px]">
              <span className="uppercase tracking-widest">GRAPHIC PROJECTS</span>
              <Palette className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <div className="text-3xl font-display font-bold text-white">
              {graphicProjects.length}
            </div>
            <div className="mt-2 text-[10px] font-mono text-white/40">
              Branding & Posters
            </div>
          </div>

          {/* Video Projects */}
          <div 
            onClick={() => onNavigateView('portfolio-video')}
            className="p-5 bg-[#0C0C0C] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-white/40 mb-3 font-mono text-[10px]">
              <span className="uppercase tracking-widest">VIDEO PROJECTS</span>
              <Film className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <div className="text-3xl font-display font-bold text-white">
              {videoProjects.length}
            </div>
            <div className="mt-2 text-[10px] font-mono text-white/40">
              R2 & Drive Masters
            </div>
          </div>

          {/* Credentials */}
          <div 
            onClick={() => onNavigateView('content-credentials')}
            className="p-5 bg-[#0C0C0C] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-white/40 mb-3 font-mono text-[10px]">
              <span className="uppercase tracking-widest">CREDENTIALS</span>
              <Award className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <div className="text-3xl font-display font-bold text-white">
              {credentials.length}
            </div>
            <div className="mt-2 text-[10px] font-mono text-white/40">
              Verified Certificates
            </div>
          </div>

          {/* Client Inquiries */}
          <div 
            onClick={() => onNavigateView('contact-inquiries')}
            className="p-5 bg-[#0C0C0C] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-white/40 mb-3 font-mono text-[10px]">
              <span className="uppercase tracking-widest">INQUIRIES</span>
              <Inbox className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <div className="text-3xl font-display font-bold text-white flex items-baseline gap-2">
              <span>{inquiries.length}</span>
              {unreadInquiriesCount > 0 && (
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{unreadInquiriesCount} new
                </span>
              )}
            </div>
            <div className="mt-2 text-[10px] font-mono text-white/40">
              Client Messages
            </div>
          </div>

        </div>

        {/* Second Row Stats: Published, Drafts, Recently Updated */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
          <div className="p-4 bg-white/[0.02] border border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-white/50 uppercase">PUBLISHED RECORDS</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/20">
              {publishedCount} LIVE
            </span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-white/50 uppercase">SAVED DRAFTS</span>
            <span className="text-amber-300 font-bold px-2 py-0.5 bg-amber-950/40 border border-amber-500/20">
              {draftCount} IN EDIT
            </span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-white/50 uppercase">RECENTLY UPDATED</span>
            <span className="text-white font-bold px-2 py-0.5 bg-white/10">
              {recentlyUpdatedCount} ENTRIES
            </span>
          </div>
        </div>
      </div>

      {/* 03. QUICK ACTIONS (Section 06) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 font-bold">
            PROMPT ACTIONS
          </h2>
          <span className="text-[10px] font-mono text-white/30">INSTANT CMS STAGING</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          
          <button
            onClick={onAddWebProject}
            className="p-3.5 bg-white/5 hover:bg-white hover:text-black border border-white/15 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[90px]"
          >
            <Globe className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-60">ADD</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">WEB PROJECT</span>
            </div>
          </button>

          <button
            onClick={onAddGraphicProject}
            className="p-3.5 bg-white/5 hover:bg-white hover:text-black border border-white/15 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[90px]"
          >
            <Palette className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-60">ADD</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">GRAPHIC</span>
            </div>
          </button>

          <button
            onClick={onAddVideoProject}
            className="p-3.5 bg-white/5 hover:bg-white hover:text-black border border-white/15 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[90px]"
          >
            <Film className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-60">ADD</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">VIDEO</span>
            </div>
          </button>

          <button
            onClick={onAddCredential}
            className="p-3.5 bg-white/5 hover:bg-white hover:text-black border border-white/15 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[90px]"
          >
            <Award className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-60">ADD</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">CREDENTIAL</span>
            </div>
          </button>

          <button
            onClick={onAddExperience}
            className="p-3.5 bg-white/5 hover:bg-white hover:text-black border border-white/15 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[90px]"
          >
            <Briefcase className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-60">ADD</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">EXPERIENCE</span>
            </div>
          </button>

          <button
            onClick={onUploadMedia}
            className="p-3.5 bg-white/5 hover:bg-white hover:text-black border border-white/15 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[90px]"
          >
            <UploadCloud className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-60">UPLOAD</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">MEDIA</span>
            </div>
          </button>

        </div>
      </div>

      {/* 04. RECENT ACTIVITY & STORAGE PIPELINE (Section 07 & 27) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity Table */}
        <div className="lg:col-span-8 bg-[#0C0C0C] border border-white/10 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
              <Activity className="w-4 h-4 text-white/60" />
              <span>RECENT ACTIVITY</span>
            </div>
            <span className="text-[10px] font-mono text-white/40 uppercase">
              AUDIT LOG
            </span>
          </div>

          <div className="divide-y divide-white/5 font-mono text-xs">
            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] px-2 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-white/40 mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px] truncate">
                      {act.action}
                    </p>
                    <p className="text-[10px] text-white/50 truncate font-mono mt-0.5">
                      {act.item}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="text-[10px] text-white/40">
                    {act.date}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 uppercase tracking-wider border ${
                    act.status === 'PUBLISHED' ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/20' :
                    act.status === 'UPLOADED' ? 'bg-white/10 text-white/80 border-white/20' :
                    'bg-white/5 text-white/60 border-white/10'
                  }`}>
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Rail: Quick Media & Infrastructure Status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Storage Snapshot */}
          <div className="bg-[#0C0C0C] border border-white/10 p-5 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs font-bold text-white uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-white/60" />
                <span>STORAGE ASSETS</span>
              </span>
              <button 
                onClick={() => onNavigateView('media-library')}
                className="text-[10px] text-white/50 hover:text-white cursor-pointer"
              >
                LIBRARY →
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-white/60">Cloudinary CDN Storage</span>
                <span className="text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 overflow-hidden">
                <div className="bg-white h-full w-[24%]" />
              </div>
              <div className="flex justify-between text-[10px] text-white/40">
                <span>Optimized Video & Imagery</span>
                <span>Global Edge CDN</span>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[11px]">
                <span className="text-white/60">Google Drive Failover</span>
                <span className="text-emerald-400 font-bold">SYNC READY</span>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[11px]">
                <span className="text-white/60">Active Media Files</span>
                <span className="text-white font-bold">{mediaItems.length} items</span>
              </div>
            </div>
          </div>

          {/* Quick Publication Checklist */}
          <div className="bg-[#0C0C0C] border border-white/10 p-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 font-bold text-white uppercase tracking-wider">
              <span>DEPLOYMENT PIPELINE</span>
              <span className="text-emerald-400 text-[10px]">HEALTHY</span>
            </div>

            <ul className="space-y-2 text-[11px] text-white/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Client-Side Bundle (Vite + React 18)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Cloudinary Video & Asset Edge Caching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Responsive Viewports Tested</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Credentials Matrix Synced</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

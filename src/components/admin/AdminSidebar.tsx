import React from 'react';
import { 
  LayoutDashboard, 
  Home, 
  User, 
  Briefcase, 
  Wrench, 
  Award, 
  FolderKanban, 
  Globe, 
  Palette, 
  Film, 
  Image as ImageIcon, 
  UploadCloud, 
  Sparkles, 
  Mail, 
  Share2, 
  Inbox,
  Bell,
  Settings, 
  Sliders, 
  HardDrive, 
  ShieldCheck, 
  LogOut,
  X
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

interface AdminSidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onSelectView,
  onLogout,
  mobileOpen,
  onCloseMobile
}) => {
  const { webProjects, graphicProjects, videoProjects, credentials, mediaItems, unreadInquiriesCount } = usePortfolioData();

  const totalProjects = webProjects.length + graphicProjects.length + videoProjects.length;

  const handleNavClick = (view: string) => {
    onSelectView(view);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between select-none">
      
      {/* Top Studio Logo & System Tag */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white text-black font-mono font-black text-xs flex items-center justify-center tracking-tighter">
              SC
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#F5F5F4] tracking-tight leading-none">
                SAURABH
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mt-1">
                CREATIVE CMS // v2.4
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-white/60 hover:text-white bg-white/5 border border-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-3.5 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] font-mono text-xs">
          
          {/* 1. DASHBOARD */}
          <div>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider">DASHBOARD</span>
              </div>
              <span className="text-[10px] opacity-60">CTRL</span>
            </button>
          </div>

          {/* 2. CONTENT */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-1.5">
              CONTENT
            </div>

            <button
              onClick={() => handleNavClick('content-home')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'content-home'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('content-about')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'content-about'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>About</span>
            </button>

            <button
              onClick={() => handleNavClick('content-experience')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'content-experience'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Experience</span>
            </button>

            <button
              onClick={() => handleNavClick('content-skills')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'content-skills'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Skills & Tools</span>
            </button>

            <button
              onClick={() => handleNavClick('content-credentials')}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'content-credentials'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Award className="w-3.5 h-3.5" />
                <span>Credentials</span>
              </div>
              <span className="text-[10px] text-white/40">{credentials.length}</span>
            </button>
          </div>

          {/* 3. PORTFOLIO */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-1.5">
              PORTFOLIO
            </div>

            <button
              onClick={() => handleNavClick('portfolio-all')}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'portfolio-all'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>All Projects</span>
              </div>
              <span className="text-[10px] text-white/40">{totalProjects}</span>
            </button>

            <button
              onClick={() => handleNavClick('portfolio-web')}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'portfolio-web' || currentView === 'portfolio-add-web'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Web</span>
              </div>
              <span className="text-[10px] text-white/40">{webProjects.length}</span>
            </button>

            <button
              onClick={() => handleNavClick('portfolio-graphic')}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'portfolio-graphic' || currentView === 'portfolio-add-graphic'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Graphic</span>
              </div>
              <span className="text-[10px] text-white/40">{graphicProjects.length}</span>
            </button>

            <button
              onClick={() => handleNavClick('portfolio-video')}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'portfolio-video' || currentView === 'portfolio-add-video'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Film className="w-3.5 h-3.5" />
                <span>Video</span>
              </div>
              <span className="text-[10px] text-white/40">{videoProjects.length}</span>
            </button>
          </div>

          {/* 4. MEDIA */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-1.5">
              MEDIA
            </div>

            <button
              onClick={() => handleNavClick('media-library')}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'media-library'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Library</span>
              </div>
              <span className="text-[10px] text-white/40">{mediaItems.length}</span>
            </button>

            <button
              onClick={() => handleNavClick('media-upload')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'media-upload'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Media</span>
            </button>
          </div>

          {/* 5. HAPPICORE */}
          <div>
            <button
              onClick={() => handleNavClick('happicore')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 transition-colors cursor-pointer ${
                currentView === 'happicore'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span className="uppercase tracking-wider">HAPPICORE</span>
            </button>
          </div>

          {/* 6. CONTACT */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-1.5">
              CONTACT
            </div>

            <button
              onClick={() => handleNavClick('contact-inquiries')}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'contact-inquiries'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Inbox className="w-3.5 h-3.5" />
                <span>Client Inquiries</span>
              </div>
              {unreadInquiriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-black">
                  {unreadInquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact-details')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'contact-details'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Details</span>
            </button>

            <button
              onClick={() => handleNavClick('contact-social')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'contact-social'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Social Links</span>
            </button>
          </div>

          {/* 7. SETTINGS */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-1.5">
              SETTINGS
            </div>

            <button
              onClick={() => handleNavClick('settings-profile')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'settings-profile'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => handleNavClick('settings-website')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'settings-website'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => handleNavClick('settings-storage')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'settings-storage'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Storage</span>
            </button>

            <button
              onClick={() => handleNavClick('settings-account')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'settings-account'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Account</span>
            </button>

            <button
              onClick={() => handleNavClick('settings-notifications')}
              className={`w-full flex items-center space-x-2.5 px-3 py-1.5 transition-colors cursor-pointer ${
                currentView === 'settings-notifications'
                  ? 'bg-white/15 text-white font-bold border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications</span>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Log Out Action */}
      <div className="p-4 border-t border-white/10 font-mono text-xs">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-3 py-2 text-white/50 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <LogOut className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">LOG OUT</span>
          </div>
          <span className="text-[10px] text-white/30">ESC</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen border-r border-white/10 bg-[#080808] sticky top-0 shrink-0 z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#080808] border-r border-white/15 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ExternalLink, 
  User, 
  Menu, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Laptop,
  Smartphone,
  Tablet,
  LogOut,
  Settings
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

interface AdminHeaderProps {
  currentViewTitle: string;
  onOpenMobileSidebar: () => void;
  onOpenGlobalSearch: () => void;
  onNavigateView: (view: string) => void;
  onPreviewPublicSite: (device?: 'desktop' | 'tablet' | 'mobile') => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentViewTitle,
  onOpenMobileSidebar,
  onOpenGlobalSearch,
  onNavigateView,
  onPreviewPublicSite,
  onLogout
}) => {
  const { adminUser, activities, isFirestoreConnected, unreadInquiriesCount } = usePortfolioData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-white/10 bg-[#0A0A0A] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      
      {/* Left: Mobile Menu Trigger & View Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation sidebar"
          className="lg:hidden p-2 text-white/70 hover:text-white bg-white/5 border border-white/10 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest hidden sm:inline">
            CORE //
          </span>
          <h1 className="font-display text-sm sm:text-base font-bold text-[#F5F5F4] tracking-tight uppercase">
            {currentViewTitle}
          </h1>
        </div>

        {/* Firestore Cloud Sync Status Badge */}
        <div 
          className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-mono text-white/70"
          title={isFirestoreConnected ? 'Connected to Firebase Firestore' : 'Running on cached/local fallback'}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isFirestoreConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <span className="tracking-wider">{isFirestoreConnected ? 'CLOUD SYNCED' : 'OFFLINE FALLBACK'}</span>
        </div>
      </div>

      {/* Center: Quick Search Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#121212] border border-white/15 text-xs text-white/40 hover:text-white hover:border-white/30 transition-all font-mono group cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
            <span className="text-[11px] truncate">Search projects, media, credentials, experience...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white/10 border border-white/10 text-[9px] font-mono text-white/60">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* Mobile Search Icon Button */}
        <button
          onClick={onOpenGlobalSearch}
          aria-label="Search"
          className="md:hidden p-2 text-white/60 hover:text-white bg-white/5 border border-white/10 cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowPreviewDropdown(false);
            }}
            aria-label="Notifications"
            className="p-2 text-white/70 hover:text-white bg-white/5 border border-white/10 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadInquiriesCount > 0 ? (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] text-center bg-emerald-400 text-black font-mono font-bold text-[9px] rounded-full">
                {unreadInquiriesCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white/40 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0E0E0E] border border-white/20 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  NOTIFICATIONS & LOGS
                </span>
                {unreadInquiriesCount > 0 && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {unreadInquiriesCount} NEW
                  </span>
                )}
              </div>

              {unreadInquiriesCount > 0 && (
                <div className="mb-3 p-2.5 bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="text-xs font-mono text-white">
                    <strong>{unreadInquiriesCount}</strong> new inquiries
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateView('contact-inquiries');
                    }}
                    className="px-2 py-1 bg-white text-black font-mono text-[10px] font-bold uppercase rounded hover:bg-white/90 cursor-pointer"
                  >
                    VIEW ALL
                  </button>
                </div>
              )}

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-2.5 bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                    {act.status === 'PUBLISHED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : act.status === 'UPLOADED' ? (
                      <Clock className="w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white leading-tight truncate">
                        {act.action}
                      </p>
                      <p className="text-[10px] text-white/50 truncate font-mono mt-0.5">
                        {act.item}
                      </p>
                      <span className="text-[9px] text-white/30 font-mono block mt-1">
                        {act.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-white cursor-pointer"
                >
                  DISMISS TRAY
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Website Dropdown & Trigger */}
        <div className="relative">
          <div className="inline-flex border border-white/20 bg-white/5">
            <button
              onClick={() => onPreviewPublicSite('desktop')}
              className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-white hover:bg-white hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>PREVIEW SITE</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                setShowPreviewDropdown(!showPreviewDropdown);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="px-1.5 py-1.5 border-l border-white/20 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Preview viewport modes"
            >
              <Laptop className="w-3 h-3" />
            </button>
          </div>

          {showPreviewDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0E0E0E] border border-white/20 shadow-2xl p-2 z-50 font-mono text-xs">
              <span className="block px-2 py-1 text-[9px] uppercase tracking-wider text-white/40">
                VIEWPORT PREVIEW
              </span>
              <button
                onClick={() => {
                  setShowPreviewDropdown(false);
                  onPreviewPublicSite('desktop');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/10 text-left text-white/80 hover:text-white cursor-pointer"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>DESKTOP VIEW</span>
              </button>
              <button
                onClick={() => {
                  setShowPreviewDropdown(false);
                  onPreviewPublicSite('tablet');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/10 text-left text-white/80 hover:text-white cursor-pointer"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>TABLET VIEW</span>
              </button>
              <button
                onClick={() => {
                  setShowPreviewDropdown(false);
                  onPreviewPublicSite('mobile');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/10 text-left text-white/80 hover:text-white cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>MOBILE VIEW</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin Profile Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowPreviewDropdown(false);
            }}
            className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 bg-white/5 border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 bg-white text-black font-mono font-bold text-[10px] flex items-center justify-center">
              S
            </div>
            <span className="font-mono text-xs text-white/90 hidden sm:inline uppercase">
              {adminUser.name}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0E0E0E] border border-white/20 shadow-2xl p-2 z-50 font-mono text-xs">
              <div className="px-2.5 py-2 border-b border-white/10 mb-1">
                <p className="font-bold text-white text-[11px] uppercase truncate">{adminUser?.name || 'ADMIN'}</p>
                <p className="text-[10px] text-white/40 truncate">{adminUser?.email || ''}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigateView('settings-profile');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/10 text-left text-white/80 hover:text-white cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigateView('settings-website');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/10 text-left text-white/80 hover:text-white cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Website Config</span>
              </button>

              <div className="border-t border-white/10 my-1 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-red-300 hover:bg-red-950/40 text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOG OUT</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

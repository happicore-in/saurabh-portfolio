import React, { useState, useEffect } from 'react';
import { PageRoute, CursorState, WebProject, GraphicProject, VideoProject } from '../types';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ShieldAlert, LogOut, ArrowLeft, RefreshCw } from 'lucide-react';
import { deleteFileFromFirebaseStorage } from '../lib/firebase/storage';

// Admin Components & Views
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebar } from '../components/admin/AdminSidebar';

import { DashboardHomeView } from '../components/admin/views/DashboardHomeView';
import { AllProjectsView } from '../components/admin/views/AllProjectsView';
import { WebProjectFormView } from '../components/admin/views/WebProjectFormView';
import { GraphicProjectFormView } from '../components/admin/views/GraphicProjectFormView';
import { VideoProjectFormView } from '../components/admin/views/VideoProjectFormView';

import { HomeContentManagerView } from '../components/admin/views/HomeContentManagerView';
import { AboutContentManagerView } from '../components/admin/views/AboutContentManagerView';
import { ExperienceContentManagerView } from '../components/admin/views/ExperienceContentManagerView';
import { SkillsToolsContentManagerView } from '../components/admin/views/SkillsToolsContentManagerView';
import { CredentialsContentManagerView } from '../components/admin/views/CredentialsContentManagerView';

import { MediaLibraryView } from '../components/admin/views/MediaLibraryView';
import { MediaUploadView } from '../components/admin/views/MediaUploadView';
import { HappicoreManagerView } from '../components/admin/views/HappicoreManagerView';
import { ContactManagerView } from '../components/admin/views/ContactManagerView';
import { InquiriesView } from '../components/admin/views/InquiriesView';

import { 
  SettingsProfileView, 
  SettingsWebsiteView, 
  SettingsStorageView, 
  SettingsAccountView,
  SettingsNotificationsView
} from '../components/admin/views/SettingsViews';

// Global Modals
import { DeleteConfirmModal } from '../components/admin/modals/DeleteConfirmModal';
import { GlobalSearchModal } from '../components/admin/modals/GlobalSearchModal';
import { ProjectPreviewModal } from '../components/admin/modals/ProjectPreviewModal';

interface AdminPageProps {
  onNavigate: (route: PageRoute) => void;
  setCursorState?: (state: CursorState) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate, setCursorState }) => {
  const { 
    isAuthenticated, 
    isAdmin,
    authLoading,
    authStatus,
    logout, 
    deleteWebProject, 
    deleteGraphicProject, 
    deleteVideoProject, 
    deleteMediaItem,
    mediaItems,
    webProjects,
    graphicProjects,
    videoProjects
  } = usePortfolioData();

  // Admin routing state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<{
    type: 'web' | 'graphic' | 'video';
    data: WebProject | GraphicProject | VideoProject;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'web' | 'graphic' | 'video' | 'media';
    id: string;
    title: string;
  } | null>(null);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setPreviewProject(null);
        setDeleteTarget(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Title calculation based on currentView
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Studio Dashboard';
      case 'content-home': return 'Home Page Content';
      case 'content-about': return 'About & Biography';
      case 'content-experience': return 'Experience Timeline';
      case 'content-skills': return 'Skills & Creative Tools';
      case 'content-credentials': return 'Accredited Credentials';
      case 'portfolio-all': return 'All Portfolio Projects';
      case 'portfolio-web': return 'Web Engineering Projects';
      case 'portfolio-graphic': return 'Graphic & Brand Projects';
      case 'portfolio-video': return 'Cinematic Video Projects';
      case 'portfolio-add-web': return 'Create Web Project';
      case 'portfolio-edit-web': return 'Edit Web Project';
      case 'portfolio-add-graphic': return 'Create Graphic Project';
      case 'portfolio-edit-graphic': return 'Edit Graphic Project';
      case 'portfolio-add-video': return 'Create Video Project';
      case 'portfolio-edit-video': return 'Edit Video Project';
      case 'media-library': return 'Media Asset Library';
      case 'media-upload': return 'Upload Media Assets';
      case 'happicore': return 'Happicore Studio Config';
      case 'contact-inquiries': return 'Client Inquiries';
      case 'contact-details': return 'Inquiry & Response Details';
      case 'contact-social': return 'Social Channels & Links';
      case 'settings-profile': return 'Profile Settings';
      case 'settings-website': return 'Website & SEO Settings';
      case 'settings-storage': return 'Storage Pipeline & CDN';
      case 'settings-account': return 'Admin Security & 2FA';
      case 'settings-notifications': return 'Contact Notifications';
      default: return 'Studio CMS';
    }
  };

  // Handlers
  const handleSelectView = (view: string) => {
    setCurrentView(view);
    setEditingProjectId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAddProject = (type: 'web' | 'graphic' | 'video') => {
    setEditingProjectId(null);
    setCurrentView(`portfolio-add-${type}`);
  };

  const handleStartEditProject = (type: 'web' | 'graphic' | 'video', id: string) => {
    setEditingProjectId(id);
    setCurrentView(`portfolio-edit-${type}`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'web') deleteWebProject(deleteTarget.id);
    else if (deleteTarget.type === 'graphic') deleteGraphicProject(deleteTarget.id);
    else if (deleteTarget.type === 'video') deleteVideoProject(deleteTarget.id);
    else if (deleteTarget.type === 'media') {
      const item = mediaItems.find(m => m.id === deleteTarget.id);
      if (item?.storagePath || (item?.url && item.url.includes('firebasestorage.googleapis.com'))) {
        deleteFileFromFirebaseStorage(item.storagePath || item.url).catch(() => {});
      }
      deleteMediaItem(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  // Loading auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-xs text-white/50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-white/40" />
          <span className="tracking-widest uppercase">CONNECTING TO SECURE FIREBASE CONSOLE...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, show the login screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {}}
        onReturnToSite={() => onNavigate('home')}
      />
    );
  }

  // If authenticated but lacks admin authorization
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F5F4] flex flex-col items-center justify-center p-6 relative font-sans">
        <div className="max-w-md w-full bg-[#0A0A0A] border border-red-500/30 p-8 shadow-2xl relative">
          <div className="w-12 h-12 bg-red-950/50 border border-red-500/40 flex items-center justify-center mb-6">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>

          <h1 className="text-xl font-display font-bold text-white tracking-tight mb-2">
            ACCESS DENIED
          </h1>
          <p className="text-xs text-white/60 mb-6 font-mono leading-relaxed">
            You do not have permission to access the Admin CMS.
          </p>

          <div className="p-3 bg-white/5 border border-white/10 text-xs font-mono mb-6 space-y-1">
            <div className="text-white/40 uppercase text-[10px]">AUTHENTICATED ACCOUNT</div>
            <div className="text-white font-medium break-all">{authStatus?.email || 'Unknown User'}</div>
            <div className="text-[10px] text-amber-400/80 pt-1">
              Required: Custom Claim <code>admin: true</code> or authorized admin email address.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 font-mono text-xs">
            <button
              onClick={() => logout()}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3 px-4 bg-white text-black font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-white/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN HOME</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F4] flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Admin Shell: Sidebar + Main Content Area */}
      <div className="flex flex-1 min-h-screen">
        
        {/* Left Navigation Sidebar */}
        <AdminSidebar
          currentView={currentView}
          onSelectView={handleSelectView}
          onLogout={logout}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#060606]">
          
          {/* Top Sticky Header */}
          <AdminHeader
            currentViewTitle={getViewTitle()}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenGlobalSearch={() => setIsSearchOpen(true)}
            onNavigateView={handleSelectView}
            onPreviewPublicSite={(device) => {
              // If currently editing or viewing a project, open preview modal
              if (previewProject) return;
              if (webProjects.length > 0) {
                setPreviewProject({ type: 'web', data: webProjects[0] });
              } else {
                onNavigate('home');
              }
            }}
            onLogout={logout}
          />

          {/* Main View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            
            {/* 1. Dashboard Home */}
            {currentView === 'dashboard' && (
              <DashboardHomeView
                onNavigateView={handleSelectView}
                onAddWebProject={() => handleStartAddProject('web')}
                onAddGraphicProject={() => handleStartAddProject('graphic')}
                onAddVideoProject={() => handleStartAddProject('video')}
                onAddCredential={() => handleSelectView('content-credentials')}
                onAddExperience={() => handleSelectView('content-experience')}
                onUploadMedia={() => handleSelectView('media-upload')}
              />
            )}

            {/* 2. All Projects & Discipline Lists */}
            {(currentView === 'portfolio-all' || currentView === 'portfolio-web' || currentView === 'portfolio-graphic' || currentView === 'portfolio-video') && (
              <AllProjectsView
                initialFilter={
                  currentView === 'portfolio-web' ? 'web' :
                  currentView === 'portfolio-graphic' ? 'graphic' :
                  currentView === 'portfolio-video' ? 'video' : 'all'
                }
                onAddProject={handleStartAddProject}
                onEditProject={handleStartEditProject}
                onPreviewProject={(type, data) => setPreviewProject({ type, data })}
                onRequestDelete={(type, id, title) => setDeleteTarget({ type, id, title })}
              />
            )}

            {/* 3. Project Forms: Web */}
            {(currentView === 'portfolio-add-web' || currentView === 'portfolio-edit-web') && (
              <WebProjectFormView
                editId={editingProjectId || undefined}
                onCancel={() => handleSelectView('portfolio-web')}
                onPreview={(data) => setPreviewProject({ type: 'web', data })}
                onSaved={() => handleSelectView('portfolio-web')}
              />
            )}

            {/* 4. Project Forms: Graphic */}
            {(currentView === 'portfolio-add-graphic' || currentView === 'portfolio-edit-graphic') && (
              <GraphicProjectFormView
                editId={editingProjectId || undefined}
                onCancel={() => handleSelectView('portfolio-graphic')}
                onPreview={(data) => setPreviewProject({ type: 'graphic', data })}
                onSaved={() => handleSelectView('portfolio-graphic')}
              />
            )}

            {/* 5. Project Forms: Video */}
            {(currentView === 'portfolio-add-video' || currentView === 'portfolio-edit-video') && (
              <VideoProjectFormView
                editId={editingProjectId || undefined}
                onCancel={() => handleSelectView('portfolio-video')}
                onPreview={(data) => setPreviewProject({ type: 'video', data })}
                onSaved={() => handleSelectView('portfolio-video')}
              />
            )}

            {/* 6. Content Managers */}
            {currentView === 'content-home' && <HomeContentManagerView />}
            {currentView === 'content-about' && <AboutContentManagerView />}
            {currentView === 'content-experience' && <ExperienceContentManagerView />}
            {currentView === 'content-skills' && <SkillsToolsContentManagerView />}
            {currentView === 'content-credentials' && <CredentialsContentManagerView />}

            {/* 7. Media */}
            {currentView === 'media-library' && (
              <MediaLibraryView
                onNavigateUpload={() => handleSelectView('media-upload')}
                onRequestDelete={(id, name) => setDeleteTarget({ type: 'media', id, title: name })}
              />
            )}
            {currentView === 'media-upload' && (
              <MediaUploadView onBackToLibrary={() => handleSelectView('media-library')} />
            )}

            {/* 8. Happicore */}
            {currentView === 'happicore' && <HappicoreManagerView />}

            {/* 9. Contact */}
            {currentView === 'contact-inquiries' && <InquiriesView />}
            {currentView === 'contact-details' && <ContactManagerView initialTab="details" />}
            {currentView === 'contact-social' && <ContactManagerView initialTab="social" />}

            {/* 10. Settings */}
            {currentView === 'settings-profile' && <SettingsProfileView />}
            {currentView === 'settings-website' && <SettingsWebsiteView />}
            {currentView === 'settings-storage' && <SettingsStorageView />}
            {currentView === 'settings-account' && <SettingsAccountView />}
            {currentView === 'settings-notifications' && <SettingsNotificationsView />}

          </main>

        </div>

      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(view, entityId) => {
          if (entityId && view.includes('portfolio-')) {
            const type = view.replace('portfolio-', '') as 'web' | 'graphic' | 'video';
            handleStartEditProject(type, entityId);
          } else {
            handleSelectView(view);
          }
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        itemName={deleteTarget?.title}
        title={deleteTarget?.type === 'media' ? 'REMOVE MEDIA ASSET?' : 'DELETE PORTFOLIO PROJECT?'}
        message={
          deleteTarget?.type === 'media'
            ? 'Are you sure you want to permanently remove this media file from your cloud asset storage?'
            : 'This will permanently remove the project and all case study records from your portfolio.'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ProjectPreviewModal
        isOpen={previewProject !== null}
        project={previewProject}
        onClose={() => setPreviewProject(null)}
        onEdit={() => {
          if (!previewProject) return;
          const { type, data } = previewProject;
          setPreviewProject(null);
          handleStartEditProject(type, data.id);
        }}
      />

    </div>
  );
};

import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  PageRoute, 
  CursorState, 
  VideoProject, 
  WebProject, 
  GraphicProject 
} from './types';
import { VIDEO_PROJECTS, WEB_PROJECTS, GRAPHIC_PROJECTS } from './data/portfolioData';

// Layout & UI components
import { CustomCursor } from './components/ui/CustomCursor';
import { FlowingBackground } from './components/ui/FlowingBackground';
import { LoadingExperience } from './components/ui/LoadingExperience';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/ui/PageTransition';
import { VideoPlayerModal } from './components/ui/VideoPlayerModal';

// Pages - Eager initial load for immediate hero render
import { HomePage } from './pages/HomePage';

// Lazy-loaded routes for instant initial page loading & optimal bundle splitting
const WebPage = React.lazy(() => import('./pages/WebPage').then(m => ({ default: m.WebPage })));
const WebDetailPage = React.lazy(() => import('./pages/WebDetailPage').then(m => ({ default: m.WebDetailPage })));
const GraphicPage = React.lazy(() => import('./pages/GraphicPage').then(m => ({ default: m.GraphicPage })));
const GraphicDetailPage = React.lazy(() => import('./pages/GraphicDetailPage').then(m => ({ default: m.GraphicDetailPage })));
const VideoPage = React.lazy(() => import('./pages/VideoPage').then(m => ({ default: m.VideoPage })));
const VideoDetailPage = React.lazy(() => import('./pages/VideoDetailPage').then(m => ({ default: m.VideoDetailPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

import { usePortfolioData } from './context/PortfolioDataContext';

export default function App() {
  const { videoProjects, webProjects, graphicProjects } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [aboutAnchor, setAboutAnchor] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>('default');

  // Active detail project selections
  const [selectedVideo, setSelectedVideo] = useState<VideoProject>(videoProjects[0] || VIDEO_PROJECTS[0]);
  const [selectedWeb, setSelectedWeb] = useState<WebProject>(webProjects[0] || WEB_PROJECTS[0]);
  const [selectedGraphic, setSelectedGraphic] = useState<GraphicProject>(graphicProjects[0] || GRAPHIC_PROJECTS[0]);

  // Video modal trigger
  const [modalVideo, setModalVideo] = useState<VideoProject | null>(null);

  // Navigation helper
  const handleNavigate = (route: PageRoute, anchorId?: string) => {
    setCurrentRoute(route);
    setAboutAnchor(anchorId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct Project Selection Handlers
  const handleSelectVideo = (project: VideoProject) => {
    setSelectedVideo(project);
    handleNavigate('video-detail');
  };

  const handleSelectWeb = (project: WebProject) => {
    setSelectedWeb(project);
    handleNavigate('web-detail');
  };

  const handleSelectGraphic = (project: GraphicProject) => {
    setSelectedGraphic(project);
    handleNavigate('graphic-detail');
  };

  // Keyboard shortcut for quick 404 test or testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc closes mobile menu
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#050505] text-[#F5F5F4] font-sans selection:bg-[#F5F5F4] selection:text-[#050505] relative">
      
      {/* Structural Architectural Perimeter Frame (Artistic Flair signature) */}
      <div className="pointer-events-none fixed inset-0 border border-white/[0.04] m-2 sm:m-4 z-40 hidden md:block" />

      {/* 1. Cinematic Loading Sequence on First Load */}
      <AnimatePresence>
        {loading && (
          <LoadingExperience 
            onComplete={() => setLoading(false)} 
            onLoadingComplete={() => setLoading(false)} 
          />
        )}
      </AnimatePresence>

      {/* 2. Magnetic State-Aware Custom Cursor */}
      <CustomCursor cursorState={cursorState} />

      {/* 3. Subtle Flowing Background Mesh */}
      {currentRoute !== 'admin' && <FlowingBackground />}

      {/* 4. Global Navigation Bar */}
      {currentRoute !== 'admin' && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={(route) => handleNavigate(route)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          isMobileMenuOpen={mobileMenuOpen}
          setCursorState={setCursorState}
        />
      )}

      {/* 5. Fullscreen Mobile Navigation Menu */}
      {currentRoute !== 'admin' && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentRoute={currentRoute}
          onNavigate={(route, anchorId) => handleNavigate(route, anchorId)}
        />
      )}

      {/* 6. Active Page Content with Route Transitions & Suspense */}
      <main className="relative z-10 w-full max-w-full overflow-x-hidden">
        <Suspense fallback={
          <div className="min-h-[70vh] flex items-center justify-center font-mono text-[11px] text-white/40 tracking-[0.3em] uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-white/40 animate-pulse mr-3" />
            LOADING SECTION...
          </div>
        }>
          <AnimatePresence mode="wait">
            {currentRoute === 'home' && (
            <PageTransition routeKey="home">
              <HomePage
                onNavigate={(route) => handleNavigate(route)}
                onSelectVideo={handleSelectVideo}
                onSelectWeb={handleSelectWeb}
                onSelectGraphic={handleSelectGraphic}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'web' && (
            <PageTransition routeKey="web">
              <WebPage
                onNavigate={(route) => handleNavigate(route)}
                onSelectWebProject={handleSelectWeb}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'web-detail' && (
            <PageTransition routeKey={`web-detail-${selectedWeb.id}`}>
              <WebDetailPage
                project={selectedWeb}
                onBack={() => handleNavigate('web')}
                onSelectProject={(p) => setSelectedWeb(p)}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'graphic' && (
            <PageTransition routeKey="graphic">
              <GraphicPage
                onNavigate={(route) => handleNavigate(route)}
                onSelectGraphicProject={handleSelectGraphic}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'graphic-detail' && (
            <PageTransition routeKey={`graphic-detail-${selectedGraphic.id}`}>
              <GraphicDetailPage
                project={selectedGraphic}
                onBack={() => handleNavigate('graphic')}
                onSelectProject={(p) => setSelectedGraphic(p)}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'video' && (
            <PageTransition routeKey="video">
              <VideoPage
                onNavigate={(route) => handleNavigate(route)}
                onSelectVideoProject={handleSelectVideo}
                onPlayVideoModal={(p) => setModalVideo(p)}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'video-detail' && (
            <PageTransition routeKey={`video-detail-${selectedVideo.id}`}>
              <VideoDetailPage
                project={selectedVideo}
                onBack={() => handleNavigate('video')}
                onSelectProject={(p) => setSelectedVideo(p)}
                onOpenPlayer={(p) => setModalVideo(p)}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'about' && (
            <PageTransition routeKey="about">
              <AboutPage
                onNavigate={(route) => handleNavigate(route)}
                anchorId={aboutAnchor}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'contact' && (
            <PageTransition routeKey="contact">
              <ContactPage
                onNavigate={(route) => handleNavigate(route)}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === 'admin' && (
            <PageTransition routeKey="admin">
              <AdminPage
                onNavigate={(route) => handleNavigate(route)}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}

          {currentRoute === '404' && (
            <PageTransition routeKey="404">
              <NotFoundPage
                onNavigate={(route) => handleNavigate(route)}
                setCursorState={setCursorState}
              />
            </PageTransition>
          )}
        </AnimatePresence>
        </Suspense>
      </main>

      {/* 7. Global Video Player Modal with R2/Drive support */}
      <VideoPlayerModal
        project={modalVideo}
        onClose={() => setModalVideo(null)}
      />

      {/* 8. Global Footer */}
      {currentRoute !== 'admin' && (
        <Footer
          onNavigate={(route, anchorId) => handleNavigate(route, anchorId)}
          setCursorState={setCursorState}
        />
      )}

    </div>
  );
}

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  WebProject, 
  GraphicProject, 
  VideoProject, 
  Credential, 
  ExperienceItem, 
  ToolItem, 
  Testimonial 
} from '../types';
import { 
  PERSONAL_INFO as INITIAL_PERSONAL_INFO,
  WEB_PROJECTS as INITIAL_WEB_PROJECTS,
  GRAPHIC_PROJECTS as INITIAL_GRAPHIC_PROJECTS,
  VIDEO_PROJECTS as INITIAL_VIDEO_PROJECTS,
  CREDENTIALS_DATA as INITIAL_CREDENTIALS,
  EXPERIENCE_DATA as INITIAL_EXPERIENCE,
  TOOLS_DATA as INITIAL_TOOLS,
  TESTIMONIALS_DATA as INITIAL_TESTIMONIALS
} from '../data/portfolioData';

import {
  subscribeToAuth,
  signInAdminWithEmail,
  sendAdminPasswordReset,
  signOutAdmin,
  getFirebaseAuthErrorMessage,
  AdminAuthStatus
} from '../lib/firebase/auth';

import {
  FirestoreProject,
  FirestoreMediaItem,
  FirestoreActivityItem,
  subscribeToProjects,
  subscribeToExperience,
  subscribeToTools,
  subscribeToCredentials,
  subscribeToTestimonials,
  subscribeToMedia,
  subscribeToActivities,
  subscribeToSiteContent,
  createProject,
  updateProject,
  deleteProject,
  createExperience,
  updateExperience,
  deleteExperience,
  saveTool,
  deleteTool as deleteFirestoreTool,
  createCredential,
  updateCredential,
  deleteCredential,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateSiteContent,
  saveMediaItemRecord,
  deleteMediaItemRecord,
  logActivityToFirestore,
  seedInitialPortfolioDataIfEmpty,
  InquiryItem,
  subscribeToInquiries,
  updateInquiryStatus as updateInquiryStatusFirestore,
  deleteInquiry as deleteInquiryFirestore
} from '../lib/firebase/firestore';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadedAt: string;
  dimensions?: string;
  usedIn: string[];
  storagePath?: string;
  source?: 'cloudinary' | 'google-drive' | 'firebase-storage' | 'external';
  cloudinaryPublicId?: string;
  thumbnailUrl?: string;
  category?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  item: string;
  date: string;
  status: 'PUBLISHED' | 'DRAFT' | 'UPDATED' | 'ARCHIVED' | 'UPLOADED';
  category: 'PROJECT' | 'CREDENTIAL' | 'MEDIA' | 'SETTINGS';
}

export interface HomeSectionConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface PortfolioDataContextType {
  // Public Data
  personalInfo: typeof INITIAL_PERSONAL_INFO;
  updatePersonalInfo: (info: Partial<typeof INITIAL_PERSONAL_INFO>) => Promise<void>;
  
  webProjects: WebProject[];
  addWebProject: (project: WebProject) => Promise<void>;
  updateWebProject: (id: string, project: Partial<WebProject>) => Promise<void>;
  deleteWebProject: (id: string) => Promise<void>;
  
  graphicProjects: GraphicProject[];
  addGraphicProject: (project: GraphicProject) => Promise<void>;
  updateGraphicProject: (id: string, project: Partial<GraphicProject>) => Promise<void>;
  deleteGraphicProject: (id: string) => Promise<void>;

  videoProjects: VideoProject[];
  addVideoProject: (project: VideoProject) => Promise<void>;
  updateVideoProject: (id: string, project: Partial<VideoProject>) => Promise<void>;
  deleteVideoProject: (id: string) => Promise<void>;

  credentials: Credential[];
  addCredential: (credential: Credential) => Promise<void>;
  updateCredential: (id: string, cred: Partial<Credential>) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;

  experience: ExperienceItem[];
  addExperience: (exp: ExperienceItem) => Promise<void>;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  tools: ToolItem[];
  addTool: (tool: ToolItem) => Promise<void>;
  updateTool: (name: string, tool: Partial<ToolItem>) => Promise<void>;
  deleteTool: (name: string) => Promise<void>;

  testimonials: Testimonial[];
  addTestimonial: (t: Testimonial) => Promise<void>;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Media Library
  mediaItems: MediaItem[];
  addMediaItem: (media: MediaItem) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;

  // Recent Activity Log
  activities: ActivityItem[];
  logActivity: (action: string, item: string, status: ActivityItem['status'], category: ActivityItem['category']) => Promise<void>;

  // Home Section Orders
  homeSections: HomeSectionConfig[];
  toggleHomeSection: (id: string) => void;

  // Real Firebase Auth State
  isAuthenticated: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  authError: string | null;
  authStatus: AdminAuthStatus | null;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  adminUser: { name: string; email: string; role: string; avatar: string };
  updateAdminProfile: (profile: { name: string; email: string; role: string }) => void;
  
  // Contact & Social channels convenience interfaces
  contactInfo: {
    email: string;
    phone: string;
    location: string;
    responseTime: string;
    freelanceStatus: string;
  };
  updateContactInfo: (info: Partial<{ email: string; phone: string; location: string; responseTime: string; freelanceStatus: string }>) => Promise<void>;
  socialLinks: Array<{ platform: string; url: string }>;
  updateSocialLinks: (links: Array<{ platform: string; url: string }>) => Promise<void>;

  // Client Inquiries & Notifications
  inquiries: InquiryItem[];
  unreadInquiriesCount: number;
  updateInquiryStatus: (id: string, status: InquiryItem['status'], readState?: boolean) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Cloud sync status
  isFirestoreConnected: boolean;
}

const INITIAL_HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'hero', title: 'Hero Section & 3D Parallax', visible: true, order: 1 },
  { id: 'showreel', title: 'Featured Showreel Player', visible: true, order: 2 },
  { id: 'intro', title: 'Philosophy & Intro Statement', visible: true, order: 3 },
  { id: 'featured-work', title: 'Curated Selected Works Grid', visible: true, order: 4 },
  { id: 'services', title: 'Core Services (Video, Web, Graphic)', visible: true, order: 5 },
  { id: 'tools', title: '3D Stack & Software Inspection', visible: true, order: 6 },
  { id: 'happicore', title: 'Happicore Studio Feature', visible: true, order: 7 },
  { id: 'testimonials', title: 'Verified Testimonials', visible: true, order: 8 },
  { id: 'cta', title: 'Freelance Collaboration CTA', visible: true, order: 9 }
];

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public Data States
  const [personalInfo, setPersonalInfo] = useState<typeof INITIAL_PERSONAL_INFO>(INITIAL_PERSONAL_INFO);
  const [webProjects, setWebProjects] = useState<WebProject[]>(INITIAL_WEB_PROJECTS);
  const [graphicProjects, setGraphicProjects] = useState<GraphicProject[]>(INITIAL_GRAPHIC_PROJECTS);
  const [videoProjects, setVideoProjects] = useState<VideoProject[]>(INITIAL_VIDEO_PROJECTS);
  const [credentials, setCredentials] = useState<Credential[]>(INITIAL_CREDENTIALS);
  const [experience, setExperience] = useState<ExperienceItem[]>(INITIAL_EXPERIENCE);
  const [tools, setTools] = useState<ToolItem[]>(INITIAL_TOOLS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSectionConfig[]>(INITIAL_HOME_SECTIONS);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  // Firebase Auth States
  const [authStatus, setAuthStatus] = useState<AdminAuthStatus | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // 1. Subscribe to Firebase Authentication
  useEffect(() => {
    const unsubscribe = subscribeToAuth((status) => {
      setAuthStatus(status);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Initialize Public Firestore Data & Real-time Subscriptions
  useEffect(() => {
    // Subscribe to Projects
    const unsubProjects = subscribeToProjects(
      (firestoreProjects) => {
        setIsFirestoreConnected(true);
        if (firestoreProjects && firestoreProjects.length > 0) {
          // Map web projects
          const webs: WebProject[] = firestoreProjects
            .filter(p => p.category === 'web')
            .map(p => ({
              id: p.id,
              slug: p.slug || p.id,
              title: p.title,
              subtitle: p.shortDescription || '',
              description: p.description,
              year: p.year,
              role: p.role,
              technologies: p.technologies || p.tools || [],
              thumbnail: p.thumbnailUrl || p.coverUrl || '',
              liveUrl: p.liveUrl,
              githubUrl: p.githubUrl,
              overview: p.overview || p.description,
              keyFeatures: p.deliverables || [],
              process: '',
              previews: p.gallery || []
            }));
          setWebProjects(webs);

          // Map graphic projects
          const graphics: GraphicProject[] = firestoreProjects
            .filter(p => p.category === 'graphic')
            .map(p => ({
              id: p.id,
              slug: p.slug || p.id,
              title: p.title,
              subtitle: p.shortDescription,
              category: p.shortDescription || 'Visual Identity',
              year: p.year,
              role: p.role || 'Visual Designer',
              tools: p.tools || [],
              description: p.description,
              heroImage: p.coverUrl || p.thumbnailUrl || '',
              cloudinaryPublicId: p.cloudinaryPublicId,
              images: p.gallery || [],
              gallery: (p.gallery || []).map(url => ({ url, caption: p.title }))
            }));
          setGraphicProjects(graphics);

          // Map video projects
          const videos: VideoProject[] = firestoreProjects
            .filter(p => p.category === 'video')
            .map(p => {
              const videoSourceType: VideoProject['videoSourceType'] =
                p.videoSource === 'cloudinary' ? 'cloudinary' :
                p.videoSource === 'googleDrive' ? 'google-drive' :
                p.videoSource === 'youtube' ? 'youtube' : 'cloudflare-r2';
              return {
                id: p.id,
                slug: p.slug || p.id,
                title: p.title,
                subtitle: p.shortDescription,
                category: p.shortDescription || 'Cinematography',
                year: p.year,
                role: p.role || 'Lead Editor',
                tools: p.tools || [],
                duration: p.videoDuration || '02:30',
                description: p.description,
                thumbnail: p.thumbnailUrl || p.coverUrl || '',
                videoSourceType,
                videoUrl: p.videoUrl,
                driveUrl: p.videoSource === 'googleDrive' ? p.videoUrl : undefined,
                cloudinaryPublicId: p.cloudinaryPublicId,
                theProject: p.description,
                theEdit: p.role || '',
                theResult: '',
                stills: p.gallery || []
              };
            });
          setVideoProjects(videos);
        }
      },
      (err) => {
        console.warn('[PortfolioDataContext] Projects subscription warning:', err);
      }
    );

    // Subscribe to Experience
    const unsubExp = subscribeToExperience(
      (expList) => {
        if (expList && expList.length > 0) setExperience(expList);
      },
      (err) => {
        console.warn('[PortfolioDataContext] Experience subscription warning:', err);
      }
    );

    // Subscribe to Tools
    const unsubTools = subscribeToTools(
      (toolsList) => {
        if (toolsList && toolsList.length > 0) setTools(toolsList);
      },
      (err) => {
        console.warn('[PortfolioDataContext] Tools subscription warning:', err);
      }
    );

    // Subscribe to Credentials
    const unsubCreds = subscribeToCredentials(
      (credsList) => {
        if (credsList && credsList.length > 0) setCredentials(credsList);
      },
      (err) => {
        console.warn('[PortfolioDataContext] Credentials subscription warning:', err);
      }
    );

    // Subscribe to Testimonials
    const unsubTestimonials = subscribeToTestimonials(
      (tList) => {
        if (tList && tList.length > 0) setTestimonials(tList);
      },
      (err) => {
        console.warn('[PortfolioDataContext] Testimonials subscription warning:', err);
      }
    );

    // Subscribe to Media Items
    const unsubMedia = subscribeToMedia(
      (mList) => {
        if (mList) setMediaItems(mList);
      },
      (err) => {
        console.warn('[PortfolioDataContext] Media subscription warning:', err);
      }
    );

    // Subscribe to Site Content (Profile & Contact)
    const unsubProfile = subscribeToSiteContent<Record<string, any>>(
      'profile',
      (prof) => {
        if (prof) {
          setPersonalInfo(prev => ({
            ...prev,
            name: prof.name || prev.name,
            shortTitle: prof.shortTitle || prev.shortTitle,
            tagline: prof.tagline || prev.tagline,
            altTagline: prof.altTagline || prev.altTagline,
            intro: prof.intro || prev.intro
          }));
        }
      },
      (err) => {
        console.warn('[PortfolioDataContext] Profile content subscription warning:', err);
      }
    );

    const unsubContact = subscribeToSiteContent<Record<string, any>>(
      'contact',
      (c) => {
        if (c) {
          setPersonalInfo(prev => ({
            ...prev,
            email: c.email || prev.email,
            phone: c.phone || prev.phone,
            location: c.location || prev.location,
            linkedin: c.linkedin || prev.linkedin,
            status: c.status || prev.status
          }));
        }
      },
      (err) => {
        console.warn('[PortfolioDataContext] Contact content subscription warning:', err);
      }
    );

    return () => {
      unsubProjects();
      unsubExp();
      unsubTools();
      unsubCreds();
      unsubTestimonials();
      unsubMedia();
      unsubProfile();
      unsubContact();
    };
  }, []);

  // 3. Admin-only Collections: Subscribe to Activities and Inquiries strictly when authenticated as Admin
  useEffect(() => {
    if (!authStatus?.isAdmin) {
      setActivities([]);
      setInquiries([]);
      return;
    }

    const unsubActivities = subscribeToActivities(
      (aList) => {
        setActivities(aList);
      },
      (err) => {
        console.warn('[PortfolioDataContext] Admin activities subscription warning:', err);
      }
    );

    const unsubInquiries = subscribeToInquiries(
      (iList) => {
        setInquiries(iList);
      },
      (err) => {
        console.warn('[PortfolioDataContext] Admin inquiries subscription warning:', err);
      }
    );

    // Attempt non-destructive seed of missing documents if admin is logged in
    seedInitialPortfolioDataIfEmpty().catch((err) => {
      console.warn('[Firestore] Admin initial check notice:', err);
    });

    return () => {
      unsubActivities();
      unsubInquiries();
    };
  }, [authStatus?.isAdmin]);

  // Admin user profile representation
  const [adminMeta, setAdminMeta] = useState({
    name: 'Saurabh',
    role: 'Studio Director & Owner'
  });

  const updateAdminProfile = (p: { name: string; email: string; role: string }) => {
    setAdminMeta({ name: p.name, role: p.role });
  };

  const adminUser = {
    name: adminMeta.name,
    email: authStatus?.email || 'saurabhcore31@gmail.com',
    role: authStatus?.hasCustomClaim ? 'Super Administrator (Claim Verified)' : adminMeta.role,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
  };

  // Real Firebase Authentication Actions
  const login = async (email: string, pass: string, rememberMe: boolean = true) => {
    setAuthError(null);
    try {
      const user = await signInAdminWithEmail(email, pass, rememberMe);
      // Explicitly refresh claims
      const tokenRes = await user.getIdTokenResult(true);
      return { success: true };
    } catch (err: any) {
      const friendlyMsg = getFirebaseAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg };
    }
  };

  const logout = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.error('[Firebase Auth] Logout error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendAdminPasswordReset(email);
      return { success: true };
    } catch (err: any) {
      const friendlyMsg = getFirebaseAuthErrorMessage(err);
      return { success: false, error: friendlyMsg };
    }
  };

  // Activity Logger
  const logActivity = async (
    action: string, 
    item: string, 
    status: ActivityItem['status'], 
    category: ActivityItem['category']
  ) => {
    const act: FirestoreActivityItem = {
      id: `act-${Date.now()}`,
      action,
      item,
      date: 'Just now',
      status,
      category
    };
    // Optimistic local update
    setActivities(prev => [act, ...prev.slice(0, 19)]);
    await logActivityToFirestore(act);
  };

  // -------------------------------------------------------------
  // Real Firestore CRUD Operations
  // -------------------------------------------------------------

  const updatePersonalInfo = async (info: Partial<typeof INITIAL_PERSONAL_INFO>) => {
    setPersonalInfo(prev => ({ ...prev, ...info }));
    if (info.email || info.phone || info.location || info.linkedin || info.status) {
      await updateSiteContent('contact', {
        email: info.email,
        phone: info.phone,
        location: info.location,
        linkedin: info.linkedin,
        status: info.status
      });
    }
    if (info.name || info.shortTitle || info.tagline || info.altTagline || info.intro) {
      await updateSiteContent('profile', {
        name: info.name,
        shortTitle: info.shortTitle,
        tagline: info.tagline,
        altTagline: info.altTagline,
        intro: info.intro
      });
    }
    await logActivity('Profile Settings Updated', 'Contact & Brand information', 'UPDATED', 'SETTINGS');
  };

  // Web Projects CRUD
  const addWebProject = async (project: WebProject) => {
    setWebProjects(prev => [project, ...prev]);
    const firestoreData: Omit<FirestoreProject, 'createdAt' | 'updatedAt'> = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: 'web',
      shortDescription: project.subtitle,
      description: project.description,
      overview: project.overview,
      year: project.year,
      role: project.role,
      technologies: project.technologies,
      thumbnailUrl: project.thumbnail,
      coverUrl: project.thumbnail,
      gallery: project.previews,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      featured: true,
      status: 'published'
    };
    await createProject(firestoreData);
    await logActivity('Web Project Added', project.title, 'PUBLISHED', 'PROJECT');
  };

  const updateWebProject = async (id: string, updated: Partial<WebProject>) => {
    setWebProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    const updates: Partial<FirestoreProject> = {};
    if (updated.title) updates.title = updated.title;
    if (updated.slug) updates.slug = updated.slug;
    if (updated.subtitle) updates.shortDescription = updated.subtitle;
    if (updated.description) updates.description = updated.description;
    if (updated.overview) updates.overview = updated.overview;
    if (updated.year) updates.year = updated.year;
    if (updated.role) updates.role = updated.role;
    if (updated.technologies) updates.technologies = updated.technologies;
    if (updated.thumbnail) {
      updates.thumbnailUrl = updated.thumbnail;
      updates.coverUrl = updated.thumbnail;
    }
    if (updated.previews) updates.gallery = updated.previews;
    if (updated.liveUrl !== undefined) updates.liveUrl = updated.liveUrl;
    if (updated.githubUrl !== undefined) updates.githubUrl = updated.githubUrl;

    await updateProject(id, updates);
    await logActivity('Web Project Updated', updated.title || 'Web Project', 'UPDATED', 'PROJECT');
  };

  const deleteWebProject = async (id: string) => {
    const project = webProjects.find(p => p.id === id);
    setWebProjects(prev => prev.filter(p => p.id !== id));
    await deleteProject(id);
    await logActivity('Web Project Deleted', project?.title || id, 'ARCHIVED', 'PROJECT');
  };

  // Graphic Projects CRUD
  const addGraphicProject = async (project: GraphicProject) => {
    setGraphicProjects(prev => [project, ...prev]);
    const firestoreData: Omit<FirestoreProject, 'createdAt' | 'updatedAt'> = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: 'graphic',
      shortDescription: project.category,
      description: project.description,
      year: project.year,
      role: project.role,
      tools: project.tools,
      coverUrl: project.heroImage,
      cloudinaryPublicId: project.cloudinaryPublicId,
      gallery: project.images || [],
      featured: true,
      status: 'published'
    };
    await createProject(firestoreData);
    await logActivity('Graphic Project Added', project.title, 'PUBLISHED', 'PROJECT');
  };

  const updateGraphicProject = async (id: string, updated: Partial<GraphicProject>) => {
    setGraphicProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    const updates: Partial<FirestoreProject> = {};
    if (updated.title) updates.title = updated.title;
    if (updated.slug) updates.slug = updated.slug;
    if (updated.category) updates.shortDescription = updated.category;
    if (updated.description) updates.description = updated.description;
    if (updated.year) updates.year = updated.year;
    if (updated.role) updates.role = updated.role;
    if (updated.tools) updates.tools = updated.tools;
    if (updated.heroImage) updates.coverUrl = updated.heroImage;
    if (updated.cloudinaryPublicId !== undefined) updates.cloudinaryPublicId = updated.cloudinaryPublicId;
    if (updated.images) updates.gallery = updated.images;

    await updateProject(id, updates);
    await logActivity('Graphic Project Updated', updated.title || 'Graphic Project', 'UPDATED', 'PROJECT');
  };

  const deleteGraphicProject = async (id: string) => {
    const project = graphicProjects.find(p => p.id === id);
    setGraphicProjects(prev => prev.filter(p => p.id !== id));
    await deleteProject(id);
    await logActivity('Graphic Project Deleted', project?.title || id, 'ARCHIVED', 'PROJECT');
  };

  // Video Projects CRUD
  const addVideoProject = async (project: VideoProject) => {
    setVideoProjects(prev => [project, ...prev]);
    const videoSource = project.videoSourceType === 'cloudinary' ? 'cloudinary'
      : project.videoSourceType === 'google-drive' ? 'googleDrive'
      : project.videoSourceType === 'youtube' ? 'youtube'
      : 'r2';

    const firestoreData: Omit<FirestoreProject, 'createdAt' | 'updatedAt'> = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: 'video',
      shortDescription: project.category,
      description: project.description,
      year: project.year,
      role: project.role,
      tools: project.tools,
      videoDuration: project.duration,
      thumbnailUrl: project.thumbnail,
      coverUrl: project.thumbnail,
      videoUrl: project.videoUrl || project.driveUrl,
      videoSource,
      cloudinaryPublicId: project.cloudinaryPublicId,
      gallery: project.stills || [],
      featured: true,
      status: 'published'
    };
    await createProject(firestoreData);
    await logActivity('Video Project Added', `${project.title} (${project.videoSourceType})`, 'PUBLISHED', 'PROJECT');
  };

  const updateVideoProject = async (id: string, updated: Partial<VideoProject>) => {
    setVideoProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    const updates: Partial<FirestoreProject> = {};
    if (updated.title) updates.title = updated.title;
    if (updated.slug) updates.slug = updated.slug;
    if (updated.category) updates.shortDescription = updated.category;
    if (updated.description) updates.description = updated.description;
    if (updated.year) updates.year = updated.year;
    if (updated.role) updates.role = updated.role;
    if (updated.tools) updates.tools = updated.tools;
    if (updated.duration) updates.videoDuration = updated.duration;
    if (updated.thumbnail) {
      updates.thumbnailUrl = updated.thumbnail;
      updates.coverUrl = updated.thumbnail;
    }
    if (updated.videoUrl) updates.videoUrl = updated.videoUrl;
    if (updated.driveUrl) {
      updates.videoUrl = updated.driveUrl;
      updates.videoSource = 'googleDrive';
    }
    if (updated.videoSourceType) {
      updates.videoSource = updated.videoSourceType === 'cloudinary' ? 'cloudinary'
        : updated.videoSourceType === 'google-drive' ? 'googleDrive'
        : updated.videoSourceType === 'youtube' ? 'youtube'
        : 'r2';
    }
    if (updated.cloudinaryPublicId !== undefined) updates.cloudinaryPublicId = updated.cloudinaryPublicId;
    if (updated.stills) updates.gallery = updated.stills;

    await updateProject(id, updates);
    await logActivity('Video Project Updated', updated.title || 'Video Project', 'UPDATED', 'PROJECT');
  };

  const deleteVideoProject = async (id: string) => {
    const project = videoProjects.find(p => p.id === id);
    setVideoProjects(prev => prev.filter(p => p.id !== id));
    await deleteProject(id);
    await logActivity('Video Project Deleted', project?.title || id, 'ARCHIVED', 'PROJECT');
  };

  // Credentials CRUD
  const addCredential = async (cred: Credential) => {
    setCredentials(prev => [cred, ...prev]);
    await createCredential(cred);
    await logActivity('Credential Added', `${cred.number} - ${cred.title}`, 'PUBLISHED', 'CREDENTIAL');
  };

  const updateCredentialItem = async (id: string, cred: Partial<Credential>) => {
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, ...cred } : c));
    await updateCredential(id, cred);
    await logActivity('Credential Updated', cred.title || id, 'UPDATED', 'CREDENTIAL');
  };

  const deleteCredentialItem = async (id: string) => {
    const c = credentials.find(item => item.id === id);
    setCredentials(prev => prev.filter(item => item.id !== id));
    await deleteCredential(id);
    await logActivity('Credential Removed', c?.title || id, 'ARCHIVED', 'CREDENTIAL');
  };

  // Experience CRUD
  const addExperienceItem = async (exp: ExperienceItem) => {
    setExperience(prev => [exp, ...prev]);
    await createExperience(exp);
    await logActivity('Experience Role Added', `${exp.role} @ ${exp.organization}`, 'PUBLISHED', 'SETTINGS');
  };

  const updateExperienceItem = async (id: string, exp: Partial<ExperienceItem>) => {
    setExperience(prev => prev.map(e => e.id === id ? { ...e, ...exp } : e));
    await updateExperience(id, exp);
    await logActivity('Experience Role Updated', exp.role || id, 'UPDATED', 'SETTINGS');
  };

  const deleteExperienceItem = async (id: string) => {
    setExperience(prev => prev.filter(e => e.id !== id));
    await deleteExperience(id);
    await logActivity('Experience Role Removed', id, 'ARCHIVED', 'SETTINGS');
  };

  // Tools CRUD
  const addTool = async (tool: ToolItem) => {
    setTools(prev => [...prev, tool]);
    await saveTool(tool);
    await logActivity('Tool Added', tool.name, 'PUBLISHED', 'SETTINGS');
  };

  const updateTool = async (name: string, updated: Partial<ToolItem>) => {
    setTools(prev => prev.map(t => t.name === name ? { ...t, ...updated } : t));
    const full = tools.find(t => t.name === name);
    if (full) {
      await saveTool({ ...full, ...updated });
    }
  };

  const deleteTool = async (name: string) => {
    setTools(prev => prev.filter(t => t.name !== name));
    await deleteFirestoreTool(name);
  };

  // Testimonials CRUD
  const addTestimonial = async (t: Testimonial) => {
    setTestimonials(prev => [t, ...prev]);
    await createTestimonial(t);
    await logActivity('Testimonial Added', t.author, 'PUBLISHED', 'SETTINGS');
  };

  const updateTestimonialItem = async (id: string, t: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
    await updateTestimonial(id, t);
  };

  const deleteTestimonialItem = async (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id));
    await deleteTestimonial(id);
  };

  // Media Items CRUD
  const addMediaItem = async (media: MediaItem) => {
    setMediaItems(prev => [media, ...prev]);
    const firestoreMedia: FirestoreMediaItem = {
      id: media.id,
      name: media.name,
      url: media.url,
      type: media.type,
      size: media.size,
      uploadedAt: media.uploadedAt,
      dimensions: (media as any).dimensions,
      usedIn: media.usedIn || [],
      storagePath: (media as any).storagePath,
      source: media.source || 'cloudinary',
      cloudinaryPublicId: media.cloudinaryPublicId,
      thumbnailUrl: media.thumbnailUrl,
      category: media.category
    };
    await saveMediaItemRecord(firestoreMedia);
    await logActivity('Media Uploaded', `${media.name} (${media.size})`, 'UPLOADED', 'MEDIA');
  };

  const deleteMediaItem = async (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    setMediaItems(prev => prev.filter(m => m.id !== id));
    await deleteMediaItemRecord(id);
    await logActivity('Media Permanently Deleted', item?.name || id, 'ARCHIVED', 'MEDIA');
  };

  const toggleHomeSection = (id: string) => {
    setHomeSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const contextValue = useMemo<PortfolioDataContextType>(() => ({
    personalInfo,
    updatePersonalInfo,
    webProjects,
    addWebProject,
    updateWebProject,
    deleteWebProject,
    graphicProjects,
    addGraphicProject,
    updateGraphicProject,
    deleteGraphicProject,
    videoProjects,
    addVideoProject,
    updateVideoProject,
    deleteVideoProject,
    credentials,
    addCredential,
    updateCredential: updateCredentialItem,
    deleteCredential: deleteCredentialItem,
    experience,
    addExperience: addExperienceItem,
    updateExperience: updateExperienceItem,
    deleteExperience: deleteExperienceItem,
    tools,
    addTool,
    updateTool,
    deleteTool,
    testimonials,
    addTestimonial,
    updateTestimonial: updateTestimonialItem,
    deleteTestimonial: deleteTestimonialItem,
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    activities,
    logActivity,
    homeSections,
    toggleHomeSection,
    isAuthenticated: Boolean(authStatus?.isAuthenticated),
    isAdmin: Boolean(authStatus?.isAdmin),
    authLoading,
    authError,
    authStatus,
    login,
    logout,
    resetPassword,
    adminUser,
    updateAdminProfile,
    contactInfo: {
      email: personalInfo?.email || 'saurabhcore31@gmail.com',
      phone: personalInfo?.phone || '+91 8127122102',
      location: personalInfo?.location || 'Mau, Uttar Pradesh, India',
      responseTime: 'Within 24 hours',
      freelanceStatus: personalInfo?.status || 'AVAILABLE FOR FREELANCE'
    },
    updateContactInfo: async (c: Partial<{ email: string; phone: string; location: string; responseTime: string; freelanceStatus: string }>) => {
      await updatePersonalInfo({
        ...(c.email ? { email: c.email } : {}),
        ...(c.phone ? { phone: c.phone } : {}),
        ...(c.location ? { location: c.location } : {}),
        ...(c.freelanceStatus ? { status: c.freelanceStatus } : {})
      });
    },
    socialLinks: [
      { platform: 'LinkedIn', url: personalInfo?.linkedin || 'https://linkedin.com/in/saurabh-07328a372' },
      { platform: 'Instagram (Happicore)', url: personalInfo?.studio?.instagramUrl || 'https://instagram.com/happicore' }
    ],
    updateSocialLinks: async (links: Array<{ platform: string; url: string }>) => {
      const linkedin = links.find(l => l.platform.toLowerCase().includes('linkedin'))?.url;
      const insta = links.find(l => l.platform.toLowerCase().includes('instagram'))?.url;
      await updatePersonalInfo({
        ...(linkedin ? { linkedin, linkedinDisplay: linkedin.replace(/^https?:\/\//, '') } : {}),
        ...(insta && personalInfo?.studio ? { studio: { ...personalInfo.studio, instagramUrl: insta } } : {})
      });
    },
    inquiries,
    unreadInquiriesCount: inquiries.filter(i => !i.read || i.status === 'new').length,
    updateInquiryStatus: async (id: string, status: InquiryItem['status'], readState?: boolean) => {
      await updateInquiryStatusFirestore(id, status, readState);
    },
    deleteInquiry: async (id: string) => {
      await deleteInquiryFirestore(id);
    },
    isFirestoreConnected
  }), [
    personalInfo,
    updatePersonalInfo,
    webProjects,
    graphicProjects,
    videoProjects,
    credentials,
    experience,
    tools,
    testimonials,
    mediaItems,
    activities,
    inquiries,
    homeSections,
    authStatus,
    authLoading,
    authError,
    adminMeta,
    adminUser,
    isFirestoreConnected
  ]);

  return (
    <PortfolioDataContext.Provider value={contextValue}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};

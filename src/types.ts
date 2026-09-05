export type PageRoute = 
  | 'home' 
  | 'web' 
  | 'web-detail' 
  | 'graphic' 
  | 'graphic-detail' 
  | 'video' 
  | 'video-detail' 
  | 'about' 
  | 'contact' 
  | 'admin' 
  | '404';

export type CursorState = 'default' | 'project' | 'video' | 'open' | 'code' | 'contact' | 'hidden';

export interface WebProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  role: string;
  technologies: string[];
  thumbnail: string;
  liveUrl?: string;
  githubUrl?: string;
  overview: string;
  keyFeatures: string[];
  process: string;
  previews: string[];
}

export interface GraphicProject {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  client?: string;
  concept?: string;
  typography?: string | string[];
  colorPalette?: string[];
  resolution?: string;
  category: 'Posters & Events' | 'Social Creatives' | 'Certificates' | 'Branding' | 'Visual Identity' | string;
  year: string;
  role: string;
  tools: string[];
  description: string;
  heroImage: string;
  cloudinaryPublicId?: string;
  images?: string[];
  gallery?: {
    url: string;
    caption: string;
    aspect?: 'portrait' | 'landscape' | 'square';
  }[];
}

export interface VideoProject {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  resolution?: string;
  aspectRatio?: string;
  category: string;
  year: string;
  role: string;
  tools: string[];
  duration: string;
  description: string;
  thumbnail: string;
  videoSourceType: 'cloudinary' | 'google-drive' | 'youtube' | 'cloudflare-r2' | 'local';
  videoUrl?: string;
  driveUrl?: string;
  youtubeId?: string;
  cloudinaryPublicId?: string;
  theProject: string;
  theEdit: string;
  theResult: string;
  stills: string[];
}

export interface Credential {
  id: string;
  number: string;
  title: string;
  issuedBy: string;
  year: string;
  category: 'TECH' | 'HACKATHONS' | 'COMPETITIONS' | 'LEADERSHIP' | 'DESIGN' | 'VIDEO' | 'OTHER' | string;
  verificationUrl?: string;
  verifyUrl?: string;
  credentialId?: string;
  image?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location?: string;
  description: string | string[];
  skills?: string[];
  highlights?: string[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
  format: string;
  uploadedAt: string;
  usedIn: string[];
  source?: 'cloudinary' | 'google-drive' | 'firebase-storage' | 'external';
  cloudinaryPublicId?: string;
  thumbnailUrl?: string;
  category?: string;
}

export interface ToolItem {
  name: string;
  category: 'VIDEO' | 'GRAPHIC' | 'WEB';
  roleDescription: string;
  experienceLevel: string;
  svgIcon: string;
}

export interface Testimonial {
  id: string;
  stars: number;
  quote: string;
  author: string;
  role: string;
  project: string;
  isPlaceholder?: boolean;
}

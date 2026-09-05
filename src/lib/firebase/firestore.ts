import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  WebProject,
  GraphicProject,
  VideoProject,
  Credential,
  ExperienceItem,
  ToolItem,
  Testimonial
} from '../../types';
import {
  PERSONAL_INFO,
  WEB_PROJECTS,
  GRAPHIC_PROJECTS,
  VIDEO_PROJECTS,
  CREDENTIALS_DATA,
  EXPERIENCE_DATA,
  TOOLS_DATA,
  TESTIMONIALS_DATA
} from '../../data/portfolioData';

// Firestore collection names
export const COLLECTIONS = {
  PROJECTS: 'projects',
  EXPERIENCE: 'experience',
  SKILLS: 'skills',
  CREDENTIALS: 'credentials',
  TESTIMONIALS: 'testimonials',
  SITE_CONTENT: 'siteContent',
  MEDIA: 'media',
  ACTIVITIES: 'activities',
  SETTINGS: 'settings',
  INQUIRIES: 'inquiries'
} as const;

// Types for unified project model
export interface FirestoreProject {
  id: string;
  title: string;
  slug: string;
  category: 'web' | 'graphic' | 'video';
  shortDescription?: string;
  description: string;
  year: string;
  role: string;
  tools?: string[];
  technologies?: string[];
  thumbnailUrl?: string;
  coverUrl?: string;
  gallery?: string[];
  videoUrl?: string;
  videoSource?: 'cloudinary' | 'googleDrive' | 'youtube' | 'r2';
  videoDuration?: string;
  cloudinaryPublicId?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  order?: number;
  client?: string;
  deliverables?: string[];
  metrics?: { label: string; value: string }[];
  overview?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreMediaItem {
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

export interface FirestoreActivityItem {
  id: string;
  action: string;
  item: string;
  date: string;
  status: 'PUBLISHED' | 'DRAFT' | 'UPDATED' | 'ARCHIVED' | 'UPLOADED';
  category: 'PROJECT' | 'CREDENTIAL' | 'MEDIA' | 'SETTINGS';
  createdAt?: any;
}

// ----------------------------------------------------------------------
// 1. Projects Service
// ----------------------------------------------------------------------

export async function createProject(projectData: Omit<FirestoreProject, 'createdAt' | 'updatedAt'>): Promise<string> {
  const colRef = collection(db, COLLECTIONS.PROJECTS);
  const docRef = projectData.id ? doc(db, COLLECTIONS.PROJECTS, projectData.id) : doc(colRef);
  const id = docRef.id;
  
  const payload = {
    ...projectData,
    id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(docRef, payload);
  return id;
}

export async function updateProject(id: string, updates: Partial<FirestoreProject>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PROJECTS, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
}

export async function getProjectById(id: string): Promise<FirestoreProject | null> {
  const docRef = doc(db, COLLECTIONS.PROJECTS, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as FirestoreProject;
  }
  return null;
}

export async function getProjectBySlug(slug: string): Promise<FirestoreProject | null> {
  const q = query(
    collection(db, COLLECTIONS.PROJECTS),
    where('slug', '==', slug)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].data() as FirestoreProject;
  }
  return null;
}

export async function getAllProjects(): Promise<FirestoreProject[]> {
  const colRef = collection(db, COLLECTIONS.PROJECTS);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => d.data() as FirestoreProject);
}

export async function getPublishedProjects(category?: 'web' | 'graphic' | 'video'): Promise<FirestoreProject[]> {
  let q;
  if (category) {
    q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where('status', '==', 'published'),
      where('category', '==', category)
    );
  } else {
    q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where('status', '==', 'published')
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as FirestoreProject);
}

export async function getFeaturedProjects(): Promise<FirestoreProject[]> {
  const q = query(
    collection(db, COLLECTIONS.PROJECTS),
    where('status', '==', 'published'),
    where('featured', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as FirestoreProject);
}

export function subscribeToProjects(
  callback: (projects: FirestoreProject[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.PROJECTS);
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => d.data() as FirestoreProject);
    callback(list);
  }, (err) => {
    console.warn('[Firestore] subscribeToProjects notice:', err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 2. Experience Service
// ----------------------------------------------------------------------

export async function getAllExperience(): Promise<ExperienceItem[]> {
  const colRef = collection(db, COLLECTIONS.EXPERIENCE);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => d.data() as ExperienceItem);
}

export async function createExperience(item: ExperienceItem): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EXPERIENCE, item.id);
  await setDoc(docRef, {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateExperience(id: string, updates: Partial<ExperienceItem>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EXPERIENCE, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.EXPERIENCE, id));
}

export function subscribeToExperience(
  callback: (items: ExperienceItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.EXPERIENCE);
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => d.data() as ExperienceItem);
    callback(list);
  }, (err) => {
    console.warn('[Firestore] subscribeToExperience notice:', err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 3. Skills & Tools Service
// ----------------------------------------------------------------------

export async function getAllTools(): Promise<ToolItem[]> {
  const colRef = collection(db, COLLECTIONS.SKILLS);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => d.data() as ToolItem);
}

export async function saveTool(tool: ToolItem): Promise<void> {
  // Use sanitized tool name as ID
  const id = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  await setDoc(doc(db, COLLECTIONS.SKILLS, id), {
    ...tool,
    updatedAt: serverTimestamp()
  });
}

export async function deleteTool(name: string): Promise<void> {
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  await deleteDoc(doc(db, COLLECTIONS.SKILLS, id));
}

export function subscribeToTools(
  callback: (tools: ToolItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.SKILLS);
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => d.data() as ToolItem);
    callback(list);
  }, (err) => {
    console.warn('[Firestore] subscribeToTools notice:', err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 4. Credentials Service
// ----------------------------------------------------------------------

export async function getAllCredentials(): Promise<Credential[]> {
  const colRef = collection(db, COLLECTIONS.CREDENTIALS);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => d.data() as Credential);
}

export async function createCredential(cred: Credential): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CREDENTIALS, cred.id);
  await setDoc(docRef, {
    ...cred,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateCredential(id: string, updates: Partial<Credential>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CREDENTIALS, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteCredential(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CREDENTIALS, id));
}

export function subscribeToCredentials(
  callback: (creds: Credential[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.CREDENTIALS);
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => d.data() as Credential);
    callback(list);
  }, (err) => {
    console.warn('[Firestore] subscribeToCredentials notice:', err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 5. Testimonials Service
// ----------------------------------------------------------------------

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const colRef = collection(db, COLLECTIONS.TESTIMONIALS);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => d.data() as Testimonial);
}

export async function createTestimonial(t: Testimonial): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TESTIMONIALS, t.id);
  await setDoc(docRef, {
    ...t,
    createdAt: serverTimestamp()
  });
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
}

export function subscribeToTestimonials(
  callback: (testimonials: Testimonial[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.TESTIMONIALS);
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => d.data() as Testimonial);
    callback(list);
  }, (err) => {
    console.warn('[Firestore] subscribeToTestimonials notice:', err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 6. Site Content Service (Home, Happicore, Contact, Profile)
// ----------------------------------------------------------------------

export async function getSiteContent<T>(sectionDoc: string): Promise<T | null> {
  const docRef = doc(db, COLLECTIONS.SITE_CONTENT, sectionDoc);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as T;
  }
  return null;
}

export async function updateSiteContent(sectionDoc: string, data: Record<string, any>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SITE_CONTENT, sectionDoc);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export function subscribeToSiteContent<T>(
  sectionDoc: string, 
  callback: (data: T | null) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, COLLECTIONS.SITE_CONTENT, sectionDoc);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as T);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn(`[Firestore] subscribeToSiteContent(${sectionDoc}) notice:`, err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 7. Media Records Service
// ----------------------------------------------------------------------

export async function getAllMediaItems(): Promise<FirestoreMediaItem[]> {
  const colRef = collection(db, COLLECTIONS.MEDIA);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => d.data() as FirestoreMediaItem);
}

export async function saveMediaItemRecord(item: FirestoreMediaItem): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MEDIA, item.id);
  await setDoc(docRef, {
    ...item,
    createdAt: serverTimestamp()
  });
}

export async function deleteMediaItemRecord(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.MEDIA, id));
}

export function subscribeToMedia(
  callback: (items: FirestoreMediaItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.MEDIA);
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => d.data() as FirestoreMediaItem);
    callback(list);
  }, (err) => {
    console.warn('[Firestore] subscribeToMedia notice:', err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 8. Activities Service
// ----------------------------------------------------------------------

export async function logActivityToFirestore(act: FirestoreActivityItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.ACTIVITIES, act.id);
    await setDoc(docRef, {
      ...act,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('[Firestore] logActivityToFirestore notice:', err);
  }
}

export function subscribeToActivities(
  callback: (acts: FirestoreActivityItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.ACTIVITIES);
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => d.data() as FirestoreActivityItem);
    callback(list);
  }, (err) => {
    console.warn('[Firestore] subscribeToActivities notice:', err);
    if (onError) onError(err);
  });
}

// ----------------------------------------------------------------------
// 9. Initial Seeding Utility
// ----------------------------------------------------------------------

/**
 * Checks if Cloud Firestore has existing project documents.
 * Only creates missing documents and never overwrites existing admin-created portfolio content.
 */
export async function seedInitialPortfolioDataIfEmpty(): Promise<boolean> {
  try {
    const projCol = collection(db, COLLECTIONS.PROJECTS);
    const projSnap = await getDocs(projCol);
    const existingIds = new Set(projSnap.docs.map(d => d.id));

    const batch = writeBatch(db);
    let countAdded = 0;

    // 1. Seed Web Projects (only missing)
    for (const p of WEB_PROJECTS) {
      if (!existingIds.has(p.id)) {
        const ref = doc(db, COLLECTIONS.PROJECTS, p.id);
        batch.set(ref, {
          id: p.id,
          title: p.title,
          slug: p.slug || p.id,
          category: 'web',
          shortDescription: p.subtitle || p.description.slice(0, 100),
          description: p.description,
          year: p.year,
          role: p.role,
          technologies: p.technologies,
          thumbnailUrl: p.thumbnail,
          coverUrl: p.thumbnail,
          gallery: p.previews || [],
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
          featured: true,
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        countAdded++;
      }
    }

    // 2. Seed Graphic Projects (only missing)
    for (const p of GRAPHIC_PROJECTS) {
      if (!existingIds.has(p.id)) {
        const ref = doc(db, COLLECTIONS.PROJECTS, p.id);
        batch.set(ref, {
          id: p.id,
          title: p.title,
          slug: p.slug || p.id,
          category: 'graphic',
          shortDescription: p.category,
          description: p.description,
          year: p.year,
          role: 'Lead Visual Designer',
          tools: p.tools,
          coverUrl: p.heroImage,
          gallery: p.images || [],
          featured: true,
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        countAdded++;
      }
    }

    // 3. Seed Video Projects (only missing)
    for (const p of VIDEO_PROJECTS) {
      if (!existingIds.has(p.id)) {
        const ref = doc(db, COLLECTIONS.PROJECTS, p.id);
        batch.set(ref, {
          id: p.id,
          title: p.title,
          slug: p.slug || p.id,
          category: 'video',
          shortDescription: p.category,
          description: p.description,
          year: p.year,
          role: p.role || 'Cinematographer & Colorist',
          tools: p.tools,
          thumbnailUrl: p.thumbnail,
          coverUrl: p.thumbnail,
          videoUrl: p.videoUrl || p.driveUrl,
          videoSource: p.videoSourceType === 'google-drive' ? 'googleDrive' : 'r2',
          videoDuration: p.duration,
          featured: true,
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        countAdded++;
      }
    }

    // 4. Seed Experience (only missing)
    const expCol = collection(db, COLLECTIONS.EXPERIENCE);
    const expSnap = await getDocs(expCol);
    const existingExpIds = new Set(expSnap.docs.map(d => d.id));
    for (const e of EXPERIENCE_DATA) {
      if (!existingExpIds.has(e.id)) {
        const ref = doc(db, COLLECTIONS.EXPERIENCE, e.id);
        batch.set(ref, {
          ...e,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        countAdded++;
      }
    }

    // 5. Seed Credentials (only missing)
    const credCol = collection(db, COLLECTIONS.CREDENTIALS);
    const credSnap = await getDocs(credCol);
    const existingCredIds = new Set(credSnap.docs.map(d => d.id));
    for (const c of CREDENTIALS_DATA) {
      if (!existingCredIds.has(c.id)) {
        const ref = doc(db, COLLECTIONS.CREDENTIALS, c.id);
        batch.set(ref, {
          ...c,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        countAdded++;
      }
    }

    // 6. Seed Skills (only missing)
    const skillCol = collection(db, COLLECTIONS.SKILLS);
    const skillSnap = await getDocs(skillCol);
    const existingSkillIds = new Set(skillSnap.docs.map(d => d.id));
    for (const t of TOOLS_DATA) {
      const id = t.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (!existingSkillIds.has(id)) {
        const ref = doc(db, COLLECTIONS.SKILLS, id);
        batch.set(ref, {
          ...t,
          updatedAt: serverTimestamp()
        });
        countAdded++;
      }
    }

    // 7. Seed Testimonials (only missing)
    const testCol = collection(db, COLLECTIONS.TESTIMONIALS);
    const testSnap = await getDocs(testCol);
    const existingTestIds = new Set(testSnap.docs.map(d => d.id));
    for (const t of TESTIMONIALS_DATA) {
      if (!existingTestIds.has(t.id)) {
        const ref = doc(db, COLLECTIONS.TESTIMONIALS, t.id);
        batch.set(ref, {
          ...t,
          createdAt: serverTimestamp()
        });
        countAdded++;
      }
    }

    // 8. Seed Site Content (only missing)
    const profileRef = doc(db, COLLECTIONS.SITE_CONTENT, 'profile');
    const profSnap = await getDoc(profileRef);
    if (!profSnap.exists()) {
      batch.set(profileRef, {
        name: PERSONAL_INFO.name,
        shortTitle: PERSONAL_INFO.shortTitle,
        tagline: PERSONAL_INFO.tagline,
        altTagline: PERSONAL_INFO.altTagline,
        intro: PERSONAL_INFO.intro,
        updatedAt: serverTimestamp()
      });
      countAdded++;
    }

    const contactRef = doc(db, COLLECTIONS.SITE_CONTENT, 'contact');
    const contactSnap = await getDoc(contactRef);
    if (!contactSnap.exists()) {
      batch.set(contactRef, {
        email: PERSONAL_INFO.email,
        phone: PERSONAL_INFO.phone,
        location: PERSONAL_INFO.location,
        linkedin: PERSONAL_INFO.linkedin,
        status: PERSONAL_INFO.status,
        updatedAt: serverTimestamp()
      });
      countAdded++;
    }

    const happicoreRef = doc(db, COLLECTIONS.SITE_CONTENT, 'happicore');
    const happiSnap = await getDoc(happicoreRef);
    if (!happiSnap.exists()) {
      batch.set(happicoreRef, {
        name: 'HAPPICORE',
        tagline: 'INDEPENDENT CREATIVE STUDIO',
        description: 'A boutique creative studio focused on high-fidelity cinematic video production, brand aesthetics, and modern web platforms.',
        coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        instagramUrl: 'https://instagram.com/happicore.studio',
        updatedAt: serverTimestamp()
      });
      countAdded++;
    }

    if (countAdded > 0) {
      await batch.commit();
      console.info(`[Firestore] Successfully initialized ${countAdded} missing portfolio documents in Cloud Firestore.`);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn('[Firestore] Notice during seeding execution:', err);
    return false;
  }
}

// ============================================================
// INQUIRIES & CONTACT FORM
// ============================================================
export interface InquiryItem {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
  budget?: string;
  timeline?: string;
  status: 'new' | 'read' | 'replied' | 'contacted' | 'archived';
  read: boolean;
  createdAt?: any;
  updatedAt?: any;
  notificationSent?: boolean;
}

export async function submitInquiry(
  inquiry: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    service?: string;
    budget?: string;
    timeline?: string;
  }
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const inquiriesRef = collection(db, COLLECTIONS.INQUIRIES);
    const newDoc = doc(inquiriesRef);
    const fallbackSubject = inquiry.service ? `${inquiry.service} Project Inquiry` : 'Portfolio Contact Inquiry';
    const payload: InquiryItem = {
      id: newDoc.id,
      name: inquiry.name.trim(),
      email: inquiry.email.trim(),
      subject: (inquiry.subject?.trim() || fallbackSubject).trim(),
      message: inquiry.message.trim(),
      service: inquiry.service || 'General Inquiry',
      budget: inquiry.budget || 'Flexible',
      timeline: inquiry.timeline || 'Immediate',
      status: 'new',
      read: false,
      createdAt: serverTimestamp()
    };
    await setDoc(newDoc, payload);
    return { success: true, id: newDoc.id };
  } catch (err: any) {
    console.error('[Firestore] Failed to submit inquiry:', err);
    return { success: false, error: err?.message || 'Failed to submit inquiry' };
  }
}

export function subscribeToInquiries(
  onUpdate: (inquiries: InquiryItem[]) => void,
  onError?: (err: any) => void
) {
  const q = query(
    collection(db, COLLECTIONS.INQUIRIES),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          read: typeof data.read === 'boolean' ? data.read : (data.status !== 'new'),
          subject: data.subject || data.service || 'Portfolio Project Inquiry'
        };
      }) as InquiryItem[];
      onUpdate(list);
    },
    (err) => {
      if (onError) onError(err);
      else console.warn('[Firestore] Inquiries subscription warning:', err);
    }
  );
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryItem['status'],
  readState?: boolean
): Promise<void> {
  const ref = doc(db, COLLECTIONS.INQUIRIES, id);
  const isRead = typeof readState === 'boolean' ? readState : (status !== 'new');
  await updateDoc(ref, { 
    status, 
    read: isRead,
    updatedAt: serverTimestamp() 
  });
}

export async function deleteInquiry(id: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.INQUIRIES, id);
  await deleteDoc(ref);
}


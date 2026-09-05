import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Check, 
  Plus, 
  X, 
  UploadCloud, 
  Link as LinkIcon, 
  Github, 
  Image as ImageIcon,
  AlertCircle,
  MoveUp,
  MoveDown,
  Loader2
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { WebProject } from '../../../types';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { getOptimizedImageUrl } from '../../../lib/cloudinary';

interface WebProjectFormViewProps {
  editId?: string;
  onCancel: () => void;
  onPreview: (data: WebProject) => void;
  onSaved: () => void;
}

export const WebProjectFormView: React.FC<WebProjectFormViewProps> = ({
  editId,
  onCancel,
  onPreview,
  onSaved
}) => {
  const { webProjects, addWebProject, updateWebProject } = usePortfolioData();
  const existing = editId ? webProjects.find(p => p.id === editId) : null;

  const [name, setName] = useState(existing?.title || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [subtitle, setSubtitle] = useState(existing?.subtitle || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [overview, setOverview] = useState(existing?.overview || '');
  const [process, setProcess] = useState(existing?.process || '');
  const [year, setYear] = useState(existing?.year || '2026');
  const [role, setRole] = useState(existing?.role || 'Lead Full-Stack Developer');
  
  // Technologies (Section 10)
  const [technologies, setTechnologies] = useState<string[]>(
    existing?.technologies || ['React', 'TypeScript', 'Tailwind CSS']
  );
  const [techInput, setTechInput] = useState('');

  // Media
  const [thumbnail, setThumbnail] = useState(existing?.thumbnail || '');
  const [liveUrl, setLiveUrl] = useState(existing?.liveUrl || '');
  const [githubUrl, setGithubUrl] = useState(existing?.githubUrl || '');
  
  // Gallery (Section 11)
  const [previews, setPreviews] = useState<string[]>(existing?.previews || []);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  
  // Settings
  const [featured, setFeatured] = useState<boolean>(true);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');

  // Simulated drag-and-drop progress
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Auto-slug generator if adding new
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (t: string) => {
    setTechnologies(technologies.filter(item => item !== t));
  };

  const handleAddGalleryItem = () => {
    if (newGalleryUrl.trim()) {
      setPreviews([...previews, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryItem = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const thumbFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const thumbnailUpload = useCloudinaryUpload({
    folder: 'portfolio/graphics',
    maxSizeMB: 25,
    onSuccess: (res) => {
      setThumbnail(res.secure_url);
    }
  });

  const galleryUpload = useCloudinaryUpload({
    folder: 'portfolio/graphics',
    maxSizeMB: 25,
    onSuccess: (res) => {
      setPreviews(prev => [...prev, res.secure_url]);
    }
  });

  const handleThumbFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      thumbnailUpload.selectFile(file);
      thumbnailUpload.startUpload('portfolio/graphics');
    }
  };

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      galleryUpload.selectFile(file);
      galleryUpload.startUpload('portfolio/graphics');
    }
  };

  const buildProjectData = (): WebProject => ({
    id: editId || `web-${slug || Date.now()}`,
    slug: slug || `project-${Date.now()}`,
    title: name || 'Untitled Web Project',
    subtitle: subtitle || 'Interactive Web Application',
    description: description || 'No summary entered yet.',
    year,
    role,
    technologies,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    liveUrl: liveUrl || undefined,
    githubUrl: githubUrl || undefined,
    overview: overview || 'Technical implementation powered by modern web standards.',
    keyFeatures: ['Responsive layout architecture', 'Performant client bundle', 'Clean design system'],
    process: process || 'Engineered from design prototype to production code.',
    previews: previews.length > 0 ? previews : [thumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop']
  });

  const handleSubmit = (saveStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!name.trim()) {
      setNotice('Please provide a project name before saving.');
      return;
    }

    const data = buildProjectData();
    if (editId) {
      updateWebProject(editId, data);
    } else {
      addWebProject(data);
    }

    setNotice(`Web project "${data.title}" successfully ${saveStatus === 'PUBLISHED' ? 'published' : 'saved as draft'}!`);
    setTimeout(() => {
      onSaved();
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Top Bar with Cancel & Publish buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4 sticky top-16 bg-[#050505] py-4 z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              CMS FORM // WEB REPOSITORY
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase">
              {editId ? `EDIT: ${name || 'WEB PROJECT'}` : 'ADD WEB PROJECT'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => onPreview(buildProjectData())}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>PREVIEW</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-4 py-2 bg-white text-black font-bold hover:bg-white/90 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>PUBLISH</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Form Fields (Section 09) */}
      <div className="space-y-6">
        
        {/* Row: Project Name & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              PROJECT NAME *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. The Sportify Live Portal"
              required
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              SLUG URL PATH
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. the-sportify-portal"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono text-white/80"
            />
          </div>
        </div>

        {/* Short Subtitle */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            SHORT SUBTITLE / TAGLINE
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Official sports tournament management platform for IIT Madras"
            className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            SHORT SUMMARY / DESCRIPTION
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview explaining what this web application achieves..."
            className="w-full bg-[#0E0E0E] border border-white/15 p-3.5 text-sm text-white focus:outline-none focus:border-white leading-relaxed"
          />
        </div>

        {/* Full Overview / Architecture */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            FULL ARCHITECTURAL OVERVIEW
          </label>
          <textarea
            rows={4}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Detailed breakdown of the stack, frontend architecture, state management and data pipelines..."
            className="w-full bg-[#0E0E0E] border border-white/15 p-3.5 text-sm text-white focus:outline-none focus:border-white leading-relaxed font-mono text-xs"
          />
        </div>

        {/* Row: Year & Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              YEAR
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              YOUR ROLE
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead Full-Stack Architect"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>
        </div>

        {/* ==================================================== */}
        {/* TECHNOLOGIES TAG MANAGER (Section 10)               */}
        {/* ==================================================== */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-3">
          <label className="block text-xs font-mono uppercase tracking-widest text-white/80 font-bold">
            TECHNOLOGIES & FRAMEWORKS
          </label>
          <p className="text-xs text-white/40 font-mono">
            Only technologies explicitly added here will be displayed on public project cards.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-3 py-1 bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center gap-2"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="text-white/40 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
              placeholder="e.g. React, Next.js, Firebase, Tailwind..."
              className="flex-1 bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs uppercase font-bold border border-white/20 transition-colors cursor-pointer"
            >
              + ADD TECHNOLOGY
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* MEDIA UPLOADER & THUMBNAIL (Section 11)              */}
        {/* ==================================================== */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono uppercase tracking-widest text-white/80 font-bold">
              PROJECT THUMBNAIL & COVER
            </label>
            <span className="text-[10px] font-mono text-emerald-400">
              TARGET: portfolio/graphics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Paste direct image URL or upload below..."
                className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-white"
              />

              <input
                ref={thumbFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbFileSelect}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => thumbFileInputRef.current?.click()}
                  disabled={thumbnailUpload.isUploading}
                  className="px-3.5 py-2 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {thumbnailUpload.isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>UPLOADING ({thumbnailUpload.progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>UPLOAD TO CLOUDINARY</span>
                    </>
                  )}
                </button>
              </div>

              {thumbnailUpload.isUploading && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-200" 
                    style={{ width: `${thumbnailUpload.progress}%` }} 
                  />
                </div>
              )}

              {thumbnailUpload.isError && (
                <p className="text-red-400 text-[11px] font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{thumbnailUpload.error}</span>
                </p>
              )}
            </div>

            {/* Thumbnail Preview box */}
            <div className="w-full aspect-video bg-[#141414] border border-white/10 overflow-hidden relative flex items-center justify-center">
              {thumbnail ? (
                <img 
                  src={getOptimizedImageUrl(thumbnail, { width: 600 })} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center font-mono text-[10px] text-white/30">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-30" />
                  <span>NO THUMBNAIL ASSIGNED</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* GALLERY MANAGEMENT (Section 11)                     */}
        {/* ==================================================== */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-white/80">
              PROJECT SCREENSHOT GALLERY ({previews.length})
            </label>
            <span className="text-[10px] text-emerald-400">CLOUDINARY READY</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {previews.map((img, i) => (
              <div key={i} className="aspect-video bg-[#151515] border border-white/10 relative group overflow-hidden">
                <img 
                  src={getOptimizedImageUrl(img, { width: 320, height: 180, crop: 'fill' })} 
                  alt={`Preview ${i}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryItem(i)}
                    className="p-1.5 bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <input
            ref={galleryFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryFileSelect}
            className="hidden"
          />

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => galleryFileInputRef.current?.click()}
              disabled={galleryUpload.isUploading}
              className="px-3 py-2 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {galleryUpload.isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>UPLOADING ({galleryUpload.progress}%)...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>+ UPLOAD SCREENSHOT</span>
                </>
              )}
            </button>

            <input
              type="url"
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              placeholder="Or paste screenshot URL to append..."
              className="flex-1 bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none min-w-[200px]"
            />
            <button
              type="button"
              onClick={handleAddGalleryItem}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black uppercase font-bold border border-white/20 transition-colors cursor-pointer"
            >
              + ADD URL
            </button>
          </div>

          {galleryUpload.isUploading && (
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-emerald-400 transition-all duration-200" 
                style={{ width: `${galleryUpload.progress}%` }} 
              />
            </div>
          )}
        </div>

        {/* URLs: Live Website & GitHub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              LIVE WEBSITE URL
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-white/30 absolute left-3 top-3 pointer-events-none" />
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://sportify.iitm.ac.in"
                className="w-full bg-[#0E0E0E] border border-white/15 pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              GITHUB REPOSITORY URL
            </label>
            <div className="relative">
              <Github className="w-4 h-4 text-white/30 absolute left-3 top-3 pointer-events-none" />
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/saurabh/sportify-core"
                className="w-full bg-[#0E0E0E] border border-white/15 pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Featured Project & Publication Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[#0A0A0A] border border-white/10 flex items-center justify-between font-mono text-xs">
            <div>
              <span className="font-bold text-white block uppercase">FEATURED ON HOME PAGE</span>
              <span className="text-[10px] text-white/40 block">Showcase in selected works carousel</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={featured} 
                onChange={(e) => setFeatured(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40" />
            </label>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-white/10 flex items-center justify-between font-mono text-xs">
            <div>
              <span className="font-bold text-white block uppercase">PUBLICATION STATE</span>
              <span className="text-[10px] text-white/40 block">Make accessible on public /web index</span>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="bg-[#141414] border border-white/20 px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </div>
        </div>

      </div>

      {/* Bottom Save Action Bar */}
      <div className="pt-8 border-t border-white/10 flex items-center justify-between font-mono text-xs">
        <button
          type="button"
          onClick={onCancel}
          className="text-white/40 hover:text-white uppercase tracking-wider cursor-pointer"
        >
          DISCARD & CANCEL
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white uppercase font-bold tracking-wider border border-white/20 transition-colors cursor-pointer"
          >
            SAVE AS DRAFT
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90 transition-colors cursor-pointer"
          >
            PUBLISH PROJECT
          </button>
        </div>
      </div>

    </div>
  );
};

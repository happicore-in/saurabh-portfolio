import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Check, 
  Plus, 
  X, 
  UploadCloud, 
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { GraphicProject } from '../../../types';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { getOptimizedImageUrl } from '../../../lib/cloudinary';

interface GraphicProjectFormViewProps {
  editId?: string;
  onCancel: () => void;
  onPreview: (data: GraphicProject) => void;
  onSaved: () => void;
}

export const GraphicProjectFormView: React.FC<GraphicProjectFormViewProps> = ({
  editId,
  onCancel,
  onPreview,
  onSaved
}) => {
  const { graphicProjects, addGraphicProject, updateGraphicProject } = usePortfolioData();
  const existing = editId ? graphicProjects.find(p => p.id === editId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [subtitle, setSubtitle] = useState(existing?.subtitle || '');
  const [category, setCategory] = useState<any>(existing?.category || 'Branding');
  const [description, setDescription] = useState(existing?.description || '');
  const [concept, setConcept] = useState(existing?.concept || '');
  const [year, setYear] = useState(existing?.year || '2026');
  const [role, setRole] = useState(existing?.role || 'Brand Identity & Visual Designer');
  const [client, setClient] = useState(existing?.client || 'Independent / Studio Work');
  const [heroImage, setHeroImage] = useState(existing?.heroImage || '');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(existing?.cloudinaryPublicId || '');
  const [resolution, setResolution] = useState(existing?.resolution || 'Vector / 4K UHD');
  
  // Tools
  const [tools, setTools] = useState<string[]>(existing?.tools || ['Illustrator', 'Photoshop', 'Figma']);
  const [toolInput, setToolInput] = useState('');

  // Gallery
  const [images, setImages] = useState<string[]>(existing?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [featured, setFeatured] = useState<boolean>(true);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [notice, setNotice] = useState<string | null>(null);

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary direct upload hooks
  const heroUpload = useCloudinaryUpload({
    folder: 'portfolio/graphics',
    maxSizeMB: 25,
    onSuccess: (res) => {
      setHeroImage(res.secure_url);
      setCloudinaryPublicId(res.public_id);
    }
  });

  const galleryUpload = useCloudinaryUpload({
    folder: 'portfolio/graphics',
    maxSizeMB: 25,
    onSuccess: (res) => {
      setImages(prev => [...prev, res.secure_url]);
    }
  });

  const handleHeroFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      heroUpload.selectFile(file);
      heroUpload.startUpload('portfolio/graphics');
    }
  };

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      galleryUpload.selectFile(file);
      galleryUpload.startUpload('portfolio/graphics');
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleAddTool = () => {
    if (toolInput.trim() && !tools.includes(toolInput.trim())) {
      setTools([...tools, toolInput.trim()]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (t: string) => {
    setTools(tools.filter(x => x !== t));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const buildData = (): GraphicProject => ({
    id: editId || `graphic-${slug || Date.now()}`,
    slug: slug || `graphic-${Date.now()}`,
    title: title || 'Untitled Visual Project',
    subtitle: subtitle || 'Brand & Visual Identity Experiment',
    category,
    year,
    client,
    role,
    tools,
    description: description || 'Visual and typographic narrative system.',
    concept: concept || 'Explores monochrome editorial contrast and geometric structure.',
    heroImage: heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    cloudinaryPublicId: cloudinaryPublicId || undefined,
    images: images.length > 0 ? images : [heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'],
    typography: ['Neue Haas Grotesk', 'Editorial Serif'],
    colorPalette: ['#050505', '#F5F5F4', '#555555'],
    resolution
  });

  const handleSubmit = (saveStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      setNotice('Please provide a graphic project title.');
      return;
    }

    const data = buildData();
    if (editId) {
      updateGraphicProject(editId, data);
    } else {
      addGraphicProject(data);
    }

    setNotice(`Graphic project "${data.title}" saved successfully!`);
    setTimeout(() => {
      onSaved();
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Top Action Bar */}
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
              CMS FORM // GRAPHIC & VISUAL
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase">
              {editId ? `EDIT: ${title || 'GRAPHIC PROJECT'}` : 'ADD GRAPHIC PROJECT'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => onPreview(buildData())}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>PREVIEW</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-4 py-2 bg-white text-black font-bold hover:bg-white/90 flex items-center gap-1.5 cursor-pointer"
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

      {/* Main Form Fields (Section 12) */}
      <div className="space-y-6">
        
        {/* Row: Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              PROJECT TITLE *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. MONOCHROME ESSENCE // BRAND SYSTEM"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              SLUG PATH
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="monochrome-essence"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono text-white/80"
            />
          </div>
        </div>

        {/* Row: Category & Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            >
              <option value="Posters">Posters</option>
              <option value="Branding">Branding</option>
              <option value="Editorial">Editorial</option>
              <option value="3D/Motion">3D/Motion</option>
              <option value="Social">Social</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              CREATION YEAR
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              CLIENT / CONTEXT
            </label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. Happicore / IIT Madras"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Concept / Design Case Study */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            DESIGN CONCEPT & EDITORIAL STATEMENT
          </label>
          <textarea
            rows={4}
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Artistic rationale, negative space philosophy, visual hierarchy decisions..."
            className="w-full bg-[#0E0E0E] border border-white/15 p-3.5 text-sm text-white focus:outline-none focus:border-white leading-relaxed font-mono text-xs"
          />
        </div>

        {/* Tools Tag Manager */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-3">
          <label className="block text-xs font-mono uppercase tracking-widest text-white/80 font-bold">
            DESIGN TOOLS APPLIED
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            {tools.map((t) => (
              <span key={t} className="px-3 py-1 bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center gap-2">
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTool(t)}
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
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTool(); } }}
              placeholder="e.g. Illustrator, Photoshop, Figma, Blender..."
              className="flex-1 bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTool}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs uppercase font-bold border border-white/20 transition-colors cursor-pointer"
            >
              + ADD TOOL
            </button>
          </div>
        </div>

        {/* Hero Artwork with Cloudinary Upload */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono uppercase tracking-widest text-white/80 font-bold">
              PRIMARY HERO ARTWORK
            </label>
            <span className="text-[10px] font-mono text-emerald-400">
              TARGET: portfolio/graphics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="Paste direct high-res image URL or upload below..."
                className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
              />

              {/* Direct Cloudinary Upload Trigger */}
              <input
                ref={heroFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroFileSelect}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  disabled={heroUpload.isUploading}
                  className="px-3.5 py-2 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {heroUpload.isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>UPLOADING ({heroUpload.progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>UPLOAD TO CLOUDINARY</span>
                    </>
                  )}
                </button>

                {cloudinaryPublicId && (
                  <span className="text-[10px] font-mono text-white/40 truncate max-w-[180px]">
                    ID: {cloudinaryPublicId}
                  </span>
                )}
              </div>

              {heroUpload.isUploading && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-200" 
                    style={{ width: `${heroUpload.progress}%` }} 
                  />
                </div>
              )}

              {heroUpload.isError && (
                <p className="text-red-400 text-[11px] font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{heroUpload.error}</span>
                </p>
              )}
            </div>

            <div className="w-full aspect-video bg-[#141414] border border-white/10 overflow-hidden relative flex items-center justify-center">
              {heroImage ? (
                <img 
                  src={getOptimizedImageUrl(heroImage, { width: 600 })} 
                  alt="Hero preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center font-mono text-[10px] text-white/30">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-30" />
                  <span>NO HERO IMAGE</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supporting Artwork / Gallery */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-white/80 block">
              ADDITIONAL ARTWORK / SPREADS ({images.length})
            </label>
            <span className="text-[10px] text-emerald-400">
              CLOUDINARY READY
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, i) => (
              <div key={i} className="aspect-square bg-[#151515] border border-white/10 relative group overflow-hidden">
                <img 
                  src={getOptimizedImageUrl(img, { width: 300, height: 300, crop: 'fill' })} 
                  alt={`Asset ${i}`} 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
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
                  <span>+ UPLOAD SPREAD</span>
                </>
              )}
            </button>

            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste artwork image URL..."
              className="flex-1 bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none min-w-[200px]"
            />
            <button
              type="button"
              onClick={handleAddImage}
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

      </div>

      {/* Bottom Save Action */}
      <div className="pt-8 border-t border-white/10 flex items-center justify-between font-mono text-xs">
        <button
          type="button"
          onClick={onCancel}
          className="text-white/40 hover:text-white uppercase tracking-wider cursor-pointer"
        >
          DISCARD
        </button>

        <button
          type="button"
          onClick={() => handleSubmit('PUBLISHED')}
          className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90 transition-colors cursor-pointer"
        >
          SAVE & PUBLISH
        </button>
      </div>

    </div>
  );
};

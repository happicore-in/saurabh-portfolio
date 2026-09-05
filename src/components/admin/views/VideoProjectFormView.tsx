import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Check, 
  X, 
  UploadCloud, 
  Play, 
  Film,
  HardDrive,
  Link as LinkIcon,
  Cloud,
  Loader2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { VideoProject } from '../../../types';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { getVideoPosterUrl, getOptimizedImageUrl } from '../../../lib/cloudinary';

interface VideoProjectFormViewProps {
  editId?: string;
  onCancel: () => void;
  onPreview: (data: VideoProject) => void;
  onSaved: () => void;
}

export const VideoProjectFormView: React.FC<VideoProjectFormViewProps> = ({
  editId,
  onCancel,
  onPreview,
  onSaved
}) => {
  const { videoProjects, addVideoProject, updateVideoProject } = usePortfolioData();
  const existing = editId ? videoProjects.find(p => p.id === editId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [subtitle, setSubtitle] = useState(existing?.subtitle || '');
  const [category, setCategory] = useState<any>(existing?.category || 'Showreel');
  const [description, setDescription] = useState(existing?.description || '');
  const [year, setYear] = useState(existing?.year || '2026');
  const [role, setRole] = useState(existing?.role || 'Lead Editor & Colorist');
  const [duration, setDuration] = useState(existing?.duration || '02:45');
  const [resolution, setResolution] = useState(existing?.resolution || '4K UHD // 24fps');
  const [aspectRatio, setAspectRatio] = useState(existing?.aspectRatio || '16:9 Cinematic');
  const [thumbnail, setThumbnail] = useState(existing?.thumbnail || '');
  
  // Video Sources (Cloudinary, Drive, R2, YouTube)
  const [videoSourceType, setVideoSourceType] = useState<VideoProject['videoSourceType']>(
    existing?.videoSourceType || (existing?.cloudinaryPublicId ? 'cloudinary' : existing?.driveUrl ? 'google-drive' : 'cloudinary')
  );
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl || '');
  const [driveUrl, setDriveUrl] = useState(existing?.driveUrl || '');
  const [youtubeId, setYoutubeId] = useState(existing?.youtubeId || '');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(existing?.cloudinaryPublicId || '');

  // File input refs
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary video upload hook
  const videoUpload = useCloudinaryUpload({
    folder: 'portfolio/videos',
    maxSizeMB: 100,
    onSuccess: (res) => {
      setVideoUrl(res.secure_url);
      setCloudinaryPublicId(res.public_id);
      setVideoSourceType('cloudinary');
      // Auto-set high quality video poster if not already set
      if (!thumbnail) {
        setThumbnail(getVideoPosterUrl(res.public_id));
      }
    }
  });

  // Cloudinary custom poster upload hook
  const posterUpload = useCloudinaryUpload({
    folder: 'portfolio/videos',
    maxSizeMB: 25,
    onSuccess: (res) => {
      setThumbnail(res.secure_url);
    }
  });

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      videoUpload.selectFile(file);
      videoUpload.startUpload('portfolio/videos');
    }
  };

  const handlePosterFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      posterUpload.selectFile(file);
      posterUpload.startUpload('portfolio/videos');
    }
  };
  
  // Tools
  const [tools, setTools] = useState<string[]>(
    existing?.tools || ['Premiere Pro', 'DaVinci Resolve', 'After Effects']
  );
  const [toolInput, setToolInput] = useState('');

  // Three-act editorial case study points
  const [theProject, setTheProject] = useState(existing?.theProject || '');
  const [theEdit, setTheEdit] = useState(existing?.theEdit || '');
  const [theResult, setTheResult] = useState(existing?.theResult || '');

  const [featured, setFeatured] = useState<boolean>(true);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [notice, setNotice] = useState<string | null>(null);

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

  const buildData = (): VideoProject => ({
    id: editId || `video-${slug || Date.now()}`,
    slug: slug || `video-${Date.now()}`,
    title: title || 'Untitled Cinematic Cut',
    subtitle: subtitle || 'Cinematic Film Sequence',
    category,
    year,
    role,
    duration,
    resolution,
    aspectRatio,
    tools,
    description: description || 'Narrative pacing, rhythmic sound design and film color grading.',
    thumbnail: thumbnail || (cloudinaryPublicId ? getVideoPosterUrl(cloudinaryPublicId) : 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop'),
    videoSourceType,
    videoUrl: videoUrl || undefined,
    driveUrl: driveUrl || undefined,
    youtubeId: youtubeId || undefined,
    cloudinaryPublicId: cloudinaryPublicId || undefined,
    theProject: theProject || 'Commercial visual narrative shot on cinema glass.',
    theEdit: theEdit || 'Cut with precision match cuts, foley layering and custom DaVinci Film LUTs.',
    theResult: theResult || 'Over 250,000 organic visual views and commercial adoption.',
    stills: []
  });

  const handleSubmit = (saveStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      setNotice('Please provide a video project title.');
      return;
    }

    const data = buildData();
    if (editId) {
      updateVideoProject(editId, data);
    } else {
      addVideoProject(data);
    }

    setNotice(`Video project "${data.title}" saved successfully!`);
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
              CMS FORM // VIDEO & MOTION
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase">
              {editId ? `EDIT: ${title || 'VIDEO PROJECT'}` : 'ADD VIDEO PROJECT'}
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

      {/* Main Form Fields */}
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
              placeholder="e.g. SAURABH // 2026 CINEMATIC REEL"
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
              placeholder="cinematic-reel-2026"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono text-white/80"
            />
          </div>
        </div>

        {/* Row: Category, Duration, Year */}
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
              <option value="Commercial">Commercial</option>
              <option value="Showreel">Showreel</option>
              <option value="Documentary">Documentary</option>
              <option value="Brand Film">Brand Film</option>
              <option value="Music Video">Music Video</option>
              <option value="Motion Design">Motion Design</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              RUN TIME DURATION
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="02:45"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              YEAR
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>
        </div>

        {/* Technical Specs: Aspect Ratio & Resolution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              ASPECT RATIO
            </label>
            <input
              type="text"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              placeholder="e.g. 16:9 Cinematic / 2.39:1 Anamorphic"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              RESOLUTION & FRAMERATE
            </label>
            <input
              type="text"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="e.g. 4K DCI // 24fps"
              className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white font-mono"
            />
          </div>
        </div>

        {/* ==================================================== */}
        {/* VIDEO STREAM & CLOUD SOURCES                       */}
        {/* ==================================================== */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/80 font-bold flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>PRIMARY VIDEO STREAMING PIPELINE</span>
            </label>
            <div className="flex items-center gap-1 font-mono text-[10px]">
              {(['cloudinary', 'google-drive', 'youtube'] as const).map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setVideoSourceType(source)}
                  className={`px-2.5 py-1 uppercase transition-colors cursor-pointer ${
                    videoSourceType === source
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {source.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Cloudinary Direct Video Upload Section */}
            {videoSourceType === 'cloudinary' && (
              <div className="p-4 bg-[#121214] border border-white/10 space-y-3">
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileSelect}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-white/70 uppercase">
                    UPLOAD VIDEO CLIP DIRECTLY (MAX 100MB)
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    TARGET: portfolio/videos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={videoUpload.isUploading}
                    className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {videoUpload.isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>UPLOADING VIDEO ({videoUpload.progress}%)...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>UPLOAD VIDEO TO CLOUDINARY</span>
                      </>
                    )}
                  </button>

                  {videoUpload.isUploading && (
                    <button
                      type="button"
                      onClick={videoUpload.cancel}
                      className="px-3 py-2 bg-red-950/80 border border-red-500/40 text-red-200 text-xs uppercase hover:bg-red-900 cursor-pointer"
                    >
                      CANCEL
                    </button>
                  )}
                </div>

                {videoUpload.isUploading && (
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-200" 
                      style={{ width: `${videoUpload.progress}%` }} 
                    />
                  </div>
                )}

                {videoUpload.isError && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{videoUpload.error}</span>
                  </p>
                )}

                <div>
                  <label className="block text-[11px] text-white/50 mb-1">
                    OR PASTE CLOUDINARY VIDEO URL (.MP4 / HLS)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/pegfrsqo/video/upload/..."
                    className="w-full bg-[#0A0A0A] border border-white/15 px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                {cloudinaryPublicId && (
                  <div className="text-[11px] text-white/50 flex items-center gap-2">
                    <span>Cloudinary Public ID:</span>
                    <code className="text-emerald-400 bg-white/5 px-1.5 py-0.5 rounded">{cloudinaryPublicId}</code>
                  </div>
                )}
              </div>
            )}

            {/* Google Drive Video Stream Input */}
            {videoSourceType === 'google-drive' && (
              <div>
                <label className="block text-[11px] text-white/50 mb-1">
                  GOOGLE DRIVE STREAM / PREVIEW URL
                </label>
                <input
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/xxxxx/preview"
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-white focus:outline-none"
                />
              </div>
            )}

            {/* YouTube Embed ID */}
            {videoSourceType === 'youtube' && (
              <div>
                <label className="block text-[11px] text-white/50 mb-1">
                  YOUTUBE VIDEO ID
                </label>
                <input
                  type="text"
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="e.g. dQw4w9WgXcQ"
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-white focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Poster Thumbnail Section */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest text-white/80 font-bold">
              VIDEO POSTER THUMBNAIL
            </label>
            {cloudinaryPublicId && (
              <button
                type="button"
                onClick={() => setThumbnail(getVideoPosterUrl(cloudinaryPublicId))}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
              >
                + AUTO-GENERATE FROM CLOUDINARY
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Poster image URL or upload custom poster below..."
                className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />

              <input
                ref={posterFileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePosterFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => posterFileInputRef.current?.click()}
                disabled={posterUpload.isUploading}
                className="px-3.5 py-2 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {posterUpload.isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>UPLOADING POSTER ({posterUpload.progress}%)...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>UPLOAD CUSTOM POSTER</span>
                  </>
                )}
              </button>

              {posterUpload.isUploading && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-200" 
                    style={{ width: `${posterUpload.progress}%` }} 
                  />
                </div>
              )}
            </div>

            <div className="w-full aspect-video bg-[#141414] border border-white/10 overflow-hidden relative flex items-center justify-center">
              {thumbnail ? (
                <img 
                  src={getOptimizedImageUrl(thumbnail, { width: 600 })} 
                  alt="Poster preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center font-mono text-[10px] text-white/30">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-30" />
                  <span>NO POSTER SET</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Case Study: The Project, The Edit, The Result */}
        <div className="p-5 bg-[#0A0A0A] border border-white/10 space-y-4 font-mono text-xs">
          <label className="block text-xs uppercase tracking-widest text-white/80 font-bold">
            THREE-ACT EDITORIAL BREAKDOWN
          </label>

          <div>
            <label className="block text-white/50 text-[11px] mb-1">1. THE DIRECTIVE</label>
            <textarea
              rows={2}
              value={theProject}
              onChange={(e) => setTheProject(e.target.value)}
              placeholder="What was the creative vision or client challenge?"
              className="w-full bg-[#121212] border border-white/15 p-2.5 text-white focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-white/50 text-[11px] mb-1">2. THE EDIT WORKFLOW</label>
            <textarea
              rows={2}
              value={theEdit}
              onChange={(e) => setTheEdit(e.target.value)}
              placeholder="Techniques, rhythm pacing, sound sculpting and color grading choices..."
              className="w-full bg-[#121212] border border-white/15 p-2.5 text-white focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-white/50 text-[11px] mb-1">3. THE RESULT</label>
            <textarea
              rows={2}
              value={theResult}
              onChange={(e) => setTheResult(e.target.value)}
              placeholder="Viewer retention, engagement metrics, awards or client reception..."
              className="w-full bg-[#121212] border border-white/15 p-2.5 text-white focus:outline-none text-xs"
            />
          </div>
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

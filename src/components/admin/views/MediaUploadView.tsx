import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  ArrowLeft, 
  Cloud, 
  FileText, 
  Image as ImageIcon, 
  Film,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  X,
  ExternalLink,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
  User,
  Award,
  Layers
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { MediaItem } from '../../../types';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { 
  CloudinaryFolder, 
  getOptimizedImageUrl, 
  getVideoPosterUrl, 
  formatBytes,
  validateUploadFile
} from '../../../lib/cloudinary';
import { formatGoogleDriveVideoUrl } from '../../../lib/firebase/storage';

interface MediaUploadViewProps {
  onBackToLibrary: () => void;
}

type MediaCategory = 'profile' | 'graphics' | 'videos' | 'credentials' | 'other';

const CATEGORY_CONFIG: Record<MediaCategory, { label: string; folder: CloudinaryFolder; icon: any; description: string }> = {
  profile: {
    label: 'Profile Photo',
    folder: 'portfolio/profile',
    icon: User,
    description: 'Personal headshots, avatars, and identity portraits'
  },
  graphics: {
    label: 'Graphic Project',
    folder: 'portfolio/graphics',
    icon: ImageIcon,
    description: 'Posters, social creatives, brand identity artworks and vector assets'
  },
  videos: {
    label: 'Video Project',
    folder: 'portfolio/videos',
    icon: Film,
    description: 'Showreels, cinematic edits, commercial reels and short-form cuts'
  },
  credentials: {
    label: 'Credential / Certificate',
    folder: 'portfolio/credentials',
    icon: Award,
    description: 'Verified certificates, hackathon awards and academic honors'
  },
  other: {
    label: 'Other Media',
    folder: 'portfolio/other',
    icon: Layers,
    description: 'Logos, press clippings, background banners and general media'
  }
};

export const MediaUploadView: React.FC<MediaUploadViewProps> = ({ onBackToLibrary }) => {
  const { addMediaItem, logActivity } = usePortfolioData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode: Cloudinary upload vs External Google Drive / URL ingest
  const [pipelineMode, setPipelineMode] = useState<'cloudinary' | 'google-drive'>('cloudinary');

  // Category selection (automatically binds folder)
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('graphics');
  
  // Custom asset title / name
  const [assetTitle, setAssetTitle] = useState('');
  
  // Local preview before upload
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // Completed items in this session
  const [recentUploads, setRecentUploads] = useState<MediaItem[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Manual Google Drive / External Ingest State
  const [driveName, setDriveName] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [driveCategory, setDriveCategory] = useState<MediaCategory>('videos');
  const [driveError, setDriveError] = useState<string | null>(null);

  // Cloudinary hook instance
  const {
    file,
    progress,
    stage,
    result,
    error,
    isUploading,
    isSuccess,
    isError,
    selectFile,
    startUpload,
    cancel,
    retry,
    reset
  } = useCloudinaryUpload({
    folder: CATEGORY_CONFIG[selectedCategory].folder,
    maxSizeMB: selectedCategory === 'videos' ? 100 : 25,
    onSuccess: async (uploadResult) => {
      // Create Firestore metadata record
      const isVideo = uploadResult.resource_type === 'video';
      const fallbackTitle = assetTitle.trim() || file?.name || `Asset ${Date.now()}`;
      
      const newMedia: MediaItem = {
        id: `media-${Date.now()}`,
        name: fallbackTitle,
        url: uploadResult.secure_url,
        type: isVideo ? 'video' : 'image',
        size: formatBytes(uploadResult.bytes),
        format: uploadResult.format,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        usedIn: [CATEGORY_CONFIG[selectedCategory].label],
        source: 'cloudinary',
        cloudinaryPublicId: uploadResult.public_id,
        thumbnailUrl: uploadResult.thumbnail_url || (isVideo ? getVideoPosterUrl(uploadResult.public_id) : getOptimizedImageUrl(uploadResult.secure_url, { width: 400 })),
        category: CATEGORY_CONFIG[selectedCategory].folder
      };

      await addMediaItem(newMedia);
      await logActivity('Uploaded to Cloudinary', `${newMedia.name} (${newMedia.size})`, 'UPLOADED', 'MEDIA');

      setRecentUploads(prev => [newMedia, ...prev]);
      setSaveSuccessNotice(`Saved metadata to Firestore for "${newMedia.name}"`);
      setTimeout(() => setSaveSuccessNotice(null), 4000);
    }
  });

  // Handle file selection
  const handleFileChange = (incomingFile: File) => {
    // Validate file
    const validation = validateUploadFile(incomingFile, selectedCategory === 'videos' ? 100 : 25);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    selectFile(incomingFile);
    if (!assetTitle) {
      setAssetTitle(incomingFile.name.replace(/\.[^/.]+$/, ''));
    }

    if (incomingFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(incomingFile);
      setLocalPreviewUrl(url);
    } else {
      setLocalPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleReset = () => {
    reset();
    setLocalPreviewUrl(null);
    setAssetTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    if (!file) return;
    startUpload(CATEGORY_CONFIG[selectedCategory].folder);
  };

  // Google Drive Manual Ingest
  const handleRegisterDriveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setDriveError(null);

    const trimmed = driveUrl.trim();
    if (!trimmed) {
      setDriveError('Please enter a Google Drive video link.');
      return;
    }

    const formatted = formatGoogleDriveVideoUrl(trimmed);
    const finalUrl = formatted.valid ? formatted.embedUrl : trimmed;
    const finalTitle = driveName.trim() || `Google Drive Video (${new Date().toLocaleDateString()})`;

    const driveMediaItem: MediaItem = {
      id: `media-gdrive-${Date.now()}`,
      name: finalTitle,
      url: finalUrl,
      type: 'video',
      size: 'Cloud Stream',
      format: 'mp4',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      usedIn: ['Google Drive Stream'],
      source: 'google-drive',
      category: CATEGORY_CONFIG[driveCategory].folder
    };

    await addMediaItem(driveMediaItem);
    await logActivity('Registered Google Drive Video', finalTitle, 'UPLOADED', 'MEDIA');

    setRecentUploads(prev => [driveMediaItem, ...prev]);
    setSaveSuccessNotice(`Saved Google Drive video record "${finalTitle}" to Firestore`);
    setTimeout(() => setSaveSuccessNotice(null), 4000);
    setDriveName('');
    setDriveUrl('');
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLibrary}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Back to Media Library"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <span>ASSET PIPELINE</span>
              <span>//</span>
              <span className="text-emerald-400">CLOUDINARY STORAGE</span>
            </span>
            <h1 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
              MEDIA UPLOADER & INGESTION
            </h1>
          </div>
        </div>

        <button
          onClick={onBackToLibrary}
          className="text-xs font-mono text-white/60 hover:text-white uppercase transition-colors cursor-pointer self-start sm:self-auto"
        >
          VIEW MEDIA LIBRARY →
        </button>
      </div>

      {/* Pipeline Mode Switcher */}
      <div className="p-4 bg-[#0A0A0A] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-xs gap-3">
        <div className="flex items-center space-x-2.5">
          <Cloud className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold uppercase tracking-wider">PIPELINE DESTINATION:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPipelineMode('cloudinary')}
            className={`px-3 py-1.5 text-[11px] uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              pipelineMode === 'cloudinary'
                ? 'bg-white text-black font-bold'
                : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>CLOUDINARY CDN (pegfrsqo)</span>
          </button>
          <button
            type="button"
            onClick={() => setPipelineMode('google-drive')}
            className={`px-3 py-1.5 text-[11px] uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              pipelineMode === 'google-drive'
                ? 'bg-white text-black font-bold'
                : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>GOOGLE DRIVE LINK</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* -------------------- 1. CLOUDINARY UPLOAD PIPELINE -------------------- */}
      {pipelineMode === 'cloudinary' && (
        <div className="space-y-6">

          {/* Category / Destination Folder Selector */}
          <div className="p-4 bg-[#0E0E0E] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono uppercase tracking-widest text-white/60">
                1. SELECT MEDIA CATEGORY (AUTO-ROUTED TO CLOUDINARY FOLDER)
              </label>
              <span className="text-[10px] font-mono text-emerald-400">
                PATH: {CATEGORY_CONFIG[selectedCategory].folder}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as MediaCategory[]).map((catKey) => {
                const config = CATEGORY_CONFIG[catKey];
                const IconComponent = config.icon;
                const isSelected = selectedCategory === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(catKey);
                    }}
                    className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[74px] ${
                      isSelected 
                        ? 'bg-white text-black border-white shadow-md' 
                        : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-2 ${isSelected ? 'text-black' : 'text-white/50'}`} />
                    <span className="text-xs font-mono font-bold uppercase tracking-tight leading-tight">
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-mono text-white/40">
              {CATEGORY_CONFIG[selectedCategory].description}
            </p>
          </div>

          {/* Asset Title Input */}
          <div className="p-4 bg-[#0E0E0E] border border-white/10 space-y-2">
            <label className="block text-[11px] font-mono uppercase tracking-widest text-white/60">
              2. ASSET TITLE / METADATA LABEL (OPTIONAL)
            </label>
            <input
              type="text"
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
              placeholder="e.g. Modern Architecture Poster Cut 01"
              disabled={isUploading}
              className="w-full bg-[#141414] border border-white/15 px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-white/50"
            />
          </div>

          {/* Drag & Drop File Upload Card */}
          <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept={selectedCategory === 'videos' ? 'video/mp4,video/webm,video/quicktime' : 'image/*,application/pdf'}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-white/50 p-10 text-center space-y-4 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03]"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    CLICK TO BROWSE OR DRAG AND DROP FILE
                  </p>
                  <p className="text-xs text-white/40 font-mono mt-1">
                    {selectedCategory === 'videos' 
                      ? 'MP4, WEBM, MOV (Max 100MB)' 
                      : 'JPG, PNG, WEBP, SVG, PDF (Max 25MB)'}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/50">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>DIRECT UNSIGNED UPLOAD TO PRESET: portfolio_media</span>
                </div>
              </div>
            ) : (
              /* Selected File Information & Live Progress Card */
              <div className="space-y-4 font-mono text-xs">
                
                {/* File Header */}
                <div className="flex items-center justify-between p-4 bg-[#141414] border border-white/10">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {file.type.startsWith('video/') ? (
                        <Film className="w-5 h-5 text-white/80" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-white/80" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-white truncate max-w-[280px] sm:max-w-md">
                        {file.name}
                      </div>
                      <div className="text-[11px] text-white/40 flex items-center gap-2">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span>{file.type || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {!isUploading && !isSuccess && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Pre-Upload Preview (Images) */}
                {localPreviewUrl && !result && (
                  <div className="p-3 bg-black/40 border border-white/10 rounded flex items-center justify-center max-h-48 overflow-hidden">
                    <img 
                      src={localPreviewUrl} 
                      alt="Local preview" 
                      className="max-h-44 object-contain rounded"
                    />
                  </div>
                )}

                {/* Upload Status & Progress Bar */}
                {stage !== 'idle' && (
                  <div className="space-y-2 p-4 bg-[#111114] border border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
                        {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {isError && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                        <span className="font-bold uppercase tracking-wider text-white">
                          {stage === 'uploading' && `UPLOADING TO CLOUDINARY... ${progress}%`}
                          {stage === 'processing' && 'PROCESSING CLOUDINARY TRANSFORMATIONS...'}
                          {stage === 'success' && 'UPLOAD COMPLETED SUCCESSFULLY!'}
                          {stage === 'error' && 'UPLOAD FAILED'}
                        </span>
                      </div>
                      <span className="text-white/60 font-bold">{progress}%</span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-200 ${
                          isError ? 'bg-red-500' : isSuccess ? 'bg-emerald-400' : 'bg-white'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Error display */}
                    {error && (
                      <p className="text-red-400 text-[11px] pt-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Success Post-Upload Result Card */}
                {result && (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>ASSET READY & SAVED TO FIRESTORE</span>
                      </span>
                      <span className="text-[10px] text-white/40">
                        {result.resource_type.toUpperCase()} // {result.format.toUpperCase()}
                      </span>
                    </div>

                    {/* Post-Upload Image / Poster Preview */}
                    <div className="flex items-center gap-4 bg-black/60 p-3 border border-white/10">
                      {result.resource_type === 'video' ? (
                        <div className="relative w-28 h-20 bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={getVideoPosterUrl(result.public_id)}
                            alt="Video Poster"
                            className="w-full h-full object-cover"
                          />
                          <Film className="w-5 h-5 text-white/80 absolute" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-neutral-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={getOptimizedImageUrl(result.secure_url, { width: 160, height: 160, crop: 'fill' })}
                            alt="Uploaded asset"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-1 overflow-hidden">
                        <p className="text-white font-bold truncate">{result.original_filename || file.name}</p>
                        <p className="text-[11px] text-white/40 font-mono">Public ID: {result.public_id}</p>
                        <p className="text-[11px] text-white/40 font-mono">{formatBytes(result.bytes)}</p>
                      </div>
                    </div>

                    {/* Cloudinary URL + Copy */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value={result.secure_url}
                        className="flex-1 bg-black/50 border border-white/15 px-2.5 py-1.5 text-[11px] text-white/80 font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(result.secure_url)}
                        className="px-3 py-1.5 bg-white text-black font-mono font-bold text-[11px] hover:bg-white/90 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedUrl === result.secure_url ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>COPY URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  {!isUploading && !isSuccess && (
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>START CLOUDINARY UPLOAD</span>
                    </button>
                  )}

                  {isUploading && (
                    <button
                      type="button"
                      onClick={cancel}
                      className="px-4 py-2 bg-red-950/80 border border-red-500/50 text-red-200 font-mono text-xs uppercase hover:bg-red-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>CANCEL UPLOAD</span>
                    </button>
                  )}

                  {isError && (
                    <button
                      type="button"
                      onClick={retry}
                      className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>RETRY UPLOAD</span>
                    </button>
                  )}

                  {(isSuccess || isError) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 bg-white/10 border border-white/15 text-white font-mono text-xs uppercase hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>UPLOAD ANOTHER FILE</span>
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- 2. GOOGLE DRIVE INGESTION -------------------- */}
      {pipelineMode === 'google-drive' && (
        <form onSubmit={handleRegisterDriveVideo} className="p-6 bg-[#0C0C0C] border border-white/10 space-y-5 font-mono text-xs">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">
              EXTERNAL STREAMING INGESTION
            </span>
            <h3 className="text-base font-bold text-white uppercase">
              REGISTER GOOGLE DRIVE VIDEO STREAM
            </h3>
            <p className="text-white/60 text-[11px] font-sans mt-1">
              Recommended for large master videos (500MB+) that should stream directly from Google Drive rather than Cloudinary storage.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-white/60 uppercase mb-1">VIDEO PROJECT TITLE</label>
              <input
                type="text"
                value={driveName}
                onChange={(e) => setDriveName(e.target.value)}
                placeholder="e.g. Master Cinema Film 4K Cut"
                className="w-full bg-[#141414] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-white/60 uppercase mb-1">GOOGLE DRIVE SHAREABLE URL</label>
              <input
                type="url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/1a2b3c.../view?usp=sharing"
                className="w-full bg-[#141414] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white/50"
              />
              <span className="text-[10px] text-white/40 mt-1 block">
                Make sure the Google Drive link permission is set to "Anyone with the link can view".
              </span>
            </div>

            {driveError && (
              <p className="text-red-400 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{driveError}</span>
              </p>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>SAVE TO FIRESTORE MEDIA LIBRARY</span>
            </button>
          </div>
        </form>
      )}

      {/* Recent Uploads in this session */}
      {recentUploads.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              RECENTLY SAVED IN THIS SESSION ({recentUploads.length})
            </h3>
            <button
              onClick={onBackToLibrary}
              className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
            >
              MANAGE IN MEDIA LIBRARY →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentUploads.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#0C0C0C] border border-white/10 flex items-center justify-between gap-3 font-mono text-xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {item.type === 'video' ? (
                      <Film className="w-4 h-4 text-white/70" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-white/70" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-white font-bold truncate">{item.name}</p>
                    <p className="text-[10px] text-white/40">{item.source?.toUpperCase()} • {item.size}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(item.url)}
                  className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Copy URL"
                >
                  {copiedUrl === item.url ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

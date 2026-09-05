import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Search, 
  Grid, 
  List, 
  Copy, 
  Check, 
  Trash2, 
  UploadCloud, 
  ExternalLink,
  Cloud,
  Eye,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { MediaItem } from '../../../types';
import { getOptimizedImageUrl, getVideoPosterUrl, getCloudinaryCloudName } from '../../../lib/cloudinary';

interface MediaLibraryViewProps {
  onNavigateUpload: () => void;
  onRequestDelete: (id: string, name: string) => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  onNavigateUpload,
  onRequestDelete
}) => {
  const { mediaItems } = usePortfolioData();

  const [filterType, setFilterType] = useState<'ALL' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<'ALL' | 'cloudinary' | 'google-drive' | 'external'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const cloudName = getCloudinaryCloudName();

  const filteredItems = mediaItems.filter(item => {
    if (filterType !== 'ALL' && item.type.toUpperCase() !== filterType) return false;
    if (filterSource !== 'ALL' && item.source !== filterSource) return false;
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) || 
        item.url.toLowerCase().includes(q) ||
        (item.cloudinaryPublicId && item.cloudinaryPublicId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMediaThumbnail = (item: MediaItem) => {
    if (item.thumbnailUrl) {
      return getOptimizedImageUrl(item.thumbnailUrl, { width: 400, height: 225, crop: 'fill' });
    }
    if (item.cloudinaryPublicId && item.type === 'video') {
      return getVideoPosterUrl(item.cloudinaryPublicId);
    }
    if (item.type === 'image') {
      return getOptimizedImageUrl(item.url, { width: 400, height: 225, crop: 'fill' });
    }
    return item.url;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Storage Snapshot Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            DIGITAL ASSET MANAGEMENT // CLOUDINARY CDN
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase">
            MEDIA ASSET LIBRARY
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
            Browse, inspect, and copy Cloudinary CDN links and video assets with Firestore metadata sync.
          </p>
        </div>

        <button
          onClick={onNavigateUpload}
          className="px-4 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>UPLOAD NEW ASSET</span>
        </button>
      </div>

      {/* Storage Pipeline Card */}
      <div className="p-4 bg-[#0A0A0A] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase">STORAGE PIPELINE</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                CLOUDINARY ACTIVE
              </span>
            </div>
            <span className="text-[10px] text-white/40 block mt-0.5">
              Cloud: {cloudName} // Unsigned preset: portfolio_media // Global CDN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-white font-bold">{mediaItems.length} INDEXED ASSETS</span>
            <span className="text-[10px] text-emerald-400 block">Firestore Metadata Synced</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Type Tabs */}
          <div className="flex items-center space-x-1 border-b border-white/10 pb-2 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'ALL' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              ALL ({mediaItems.length})
            </button>

            <button
              onClick={() => setFilterType('IMAGE')}
              className={`px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'IMAGE' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>IMAGES</span>
            </button>

            <button
              onClick={() => setFilterType('VIDEO')}
              className={`px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'VIDEO' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>VIDEOS</span>
            </button>

            <button
              onClick={() => setFilterType('DOCUMENT')}
              className={`px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'DOCUMENT' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>DOCS</span>
            </button>
          </div>

          {/* Search & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file or public ID..."
                className="w-full bg-[#111] border border-white/15 pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center border border-white/15 bg-[#111]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Source & Category Subfilters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-white/50">
          <span className="flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>SOURCE:</span>
          </span>
          {(['ALL', 'cloudinary', 'google-drive', 'external'] as const).map(src => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              className={`px-2 py-0.5 uppercase cursor-pointer border ${
                filterSource === src
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-950/40'
                  : 'border-white/10 text-white/40 hover:text-white'
              }`}
            >
              {src}
            </button>
          ))}

          <span className="ml-2">FOLDER:</span>
          {['ALL', 'portfolio/graphics', 'portfolio/videos', 'portfolio/credentials', 'portfolio/profile', 'portfolio/other'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-0.5 cursor-pointer border ${
                filterCategory === cat
                  ? 'border-white text-white bg-white/10'
                  : 'border-white/10 text-white/40 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'ALL FOLDERS' : cat.replace('portfolio/', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid or List */}
      {filteredItems.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-[#0C0C0C] border border-dashed border-white/15 my-8 font-mono">
          <UploadCloud className="w-8 h-8 mx-auto text-white/30 mb-2" />
          <h3 className="text-sm font-bold text-white uppercase">NO MEDIA ASSETS MATCHING</h3>
          <p className="text-xs text-white/40 mt-1">Upload assets or refine your filter query.</p>
          <button
            onClick={onNavigateUpload}
            className="mt-4 px-4 py-2 bg-white text-black text-xs font-bold uppercase cursor-pointer"
          >
            + UPLOAD MEDIA
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0C0C0C] border border-white/10 hover:border-white/30 transition-all flex flex-col group overflow-hidden"
            >
              {/* Media Visual Area */}
              <div className="aspect-video bg-[#141414] relative overflow-hidden flex items-center justify-center">
                {item.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={getMediaThumbnail(item)} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-70" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Film className="w-6 h-6 text-white drop-shadow" />
                    </div>
                  </div>
                ) : item.type === 'document' ? (
                  <div className="p-4 text-center">
                    <FileText className="w-8 h-8 text-white/50 mx-auto mb-1" />
                    <span className="font-mono text-[9px] text-white/40 uppercase">DOCUMENT</span>
                  </div>
                ) : (
                  <img 
                    src={getMediaThumbnail(item)} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                )}

                {/* Source Badge */}
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 uppercase font-bold tracking-wider ${
                    item.source === 'cloudinary'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : item.source === 'google-drive'
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                      : 'bg-black/80 text-white/60 border border-white/20'
                  }`}>
                    {item.source || 'media'}
                  </span>
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewMedia(item)}
                    title="Inspect Full Media"
                    className="p-2 bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopyUrl(item)}
                    title="Copy Direct URL"
                    className="p-2 bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onRequestDelete(item.id, item.name)}
                    title="Delete permanently"
                    className="p-2 bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="p-3 font-mono text-[11px] flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white truncate text-xs" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-white/40 text-[10px] mt-1">
                    <span>{item.size}</span>
                    <span className="uppercase">{item.format}</span>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-white/5 text-[9px] text-white/40 truncate flex justify-between">
                  <span>FOLDER: <span className="text-white/70">{item.category?.replace('portfolio/', '') || 'root'}</span></span>
                  <span className="text-emerald-400">{item.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-[#0C0C0C] border border-white/10 overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 text-[10px] uppercase">
                <th className="p-3">PREVIEW</th>
                <th className="p-3">FILE NAME</th>
                <th className="p-3">SOURCE</th>
                <th className="p-3">FOLDER</th>
                <th className="p-3">SIZE</th>
                <th className="p-3">FORMAT</th>
                <th className="p-3">UPLOADED</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3">
                    <div className="w-10 h-8 bg-[#151515] border border-white/10 overflow-hidden flex items-center justify-center">
                      {item.type === 'image' ? (
                        <img src={getMediaThumbnail(item)} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-3.5 h-3.5 text-white/50" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-bold text-white text-xs truncate max-w-xs">{item.name}</td>
                  <td className="p-3">
                    <span className="text-[10px] text-emerald-400 uppercase">{item.source || 'external'}</span>
                  </td>
                  <td className="p-3 text-white/60 text-[11px]">{item.category?.replace('portfolio/', '') || '—'}</td>
                  <td className="p-3 text-white/60">{item.size}</td>
                  <td className="p-3 uppercase text-white/40">{item.format}</td>
                  <td className="p-3 text-white/40 text-[10px]">{item.uploadedAt}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="p-1 text-white/60 hover:text-white cursor-pointer"
                        title="Inspect"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyUrl(item)}
                        className="p-1 text-white/60 hover:text-white cursor-pointer"
                        title="Copy URL"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onRequestDelete(item.id, item.name)}
                        className="p-1 text-white/40 hover:text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Media Inspection Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0E0E0E] border border-white/20 max-w-2xl w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-white uppercase truncate">{previewMedia.name}</span>
              <button onClick={() => setPreviewMedia(null)} className="text-white/40 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center overflow-hidden border border-white/10">
              {previewMedia.type === 'video' ? (
                previewMedia.source === 'google-drive' ? (
                  <iframe 
                    src={previewMedia.url} 
                    className="w-full h-full border-0" 
                    title={previewMedia.name} 
                    allow="autoplay" 
                  />
                ) : (
                  <video 
                    src={previewMedia.url} 
                    controls 
                    className="max-w-full max-h-full" 
                    poster={previewMedia.thumbnailUrl || (previewMedia.cloudinaryPublicId ? getVideoPosterUrl(previewMedia.cloudinaryPublicId) : undefined)} 
                  />
                )
              ) : (
                <img src={previewMedia.url} alt={previewMedia.name} className="max-w-full max-h-full object-contain" />
              )}
            </div>

            <div className="space-y-2 text-[11px] text-white/70">
              <div className="flex justify-between">
                <span>DIRECT URL:</span>
                <span className="text-white truncate max-w-sm font-mono">{previewMedia.url}</span>
              </div>
              {previewMedia.cloudinaryPublicId && (
                <div className="flex justify-between">
                  <span>CLOUDINARY PUBLIC ID:</span>
                  <span className="text-emerald-400 font-mono">{previewMedia.cloudinaryPublicId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>FOLDER / SOURCE:</span>
                <span className="text-white">{previewMedia.category || 'default'} // {previewMedia.source || 'external'}</span>
              </div>
              <div className="flex justify-between">
                <span>SIZE & FORMAT:</span>
                <span className="text-white">{previewMedia.size} // {previewMedia.format.toUpperCase()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => handleCopyUrl(previewMedia)}
                className="px-4 py-2 bg-white text-black font-bold uppercase cursor-pointer"
              >
                {copiedId === previewMedia.id ? 'COPIED!' : 'COPY DIRECT URL'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

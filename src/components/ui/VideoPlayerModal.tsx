import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoProject } from '../../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  X, 
  Server, 
  RotateCcw,
  Sparkles,
  Cloud
} from 'lucide-react';
import { getVideoPosterUrl } from '../../lib/cloudinary';
import { formatGoogleDriveVideoUrl } from '../../lib/firebase/storage';

interface VideoPlayerModalProps {
  project: VideoProject | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ project, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const rawDrive = project?.driveUrl || (project?.videoUrl?.includes('drive.google.com') ? project.videoUrl : '');
  const driveInfo = rawDrive ? formatGoogleDriveVideoUrl(rawDrive) : { valid: false, embedUrl: '' };

  const isCloudinary = 
    project?.videoSourceType === 'cloudinary' || 
    Boolean(project?.cloudinaryPublicId) || 
    Boolean(project?.videoUrl && project.videoUrl.includes('res.cloudinary.com'));

  const isGoogleDrive = 
    project?.videoSourceType === 'google-drive' || 
    driveInfo.valid || 
    Boolean(rawDrive);

  const driveEmbedSrc = driveInfo.embedUrl || (rawDrive ? (rawDrive.includes('/preview') ? rawDrive : rawDrive.replace(/\/view(\?.*)?$/, '/preview')) : '');

  const posterUrl = 
    project?.thumbnail || 
    (project?.cloudinaryPublicId ? getVideoPosterUrl(project.cloudinaryPublicId) : undefined);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && videoRef.current) {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  if (!project) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.play().catch(() => setIsPlaying(false));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        key="video-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#060608]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-10"
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-[#0d0d12] border border-white/15 rounded-xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Top Bar with Project Information */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#09090c] border-b border-white/10 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold tracking-wider text-white uppercase truncate max-w-[200px] sm:max-w-md">
                {project.title}
              </span>
              <span className="text-white/40 hidden sm:inline">[{project.year}]</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Storage Pipeline Indicator */}
              <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded text-[10px] text-white/60">
                {isCloudinary ? (
                  <>
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">SOURCE: CLOUDINARY CDN</span>
                  </>
                ) : isGoogleDrive ? (
                  <>
                    <Server className="w-3 h-3 text-blue-400" />
                    <span>SOURCE: GOOGLE DRIVE STREAM</span>
                  </>
                ) : (
                  <>
                    <Server className="w-3 h-3 text-white/50" />
                    <span>SOURCE: DIRECT STREAM</span>
                  </>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                title="Close player (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Player Display Area */}
          <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
            {isGoogleDrive && driveEmbedSrc ? (
              <iframe
                src={driveEmbedSrc}
                className="w-full h-full border-0"
                title={project.title}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : project.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  poster={posterUrl}
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  playsInline
                  className="w-full h-full object-contain cursor-pointer"
                />

                {/* Centered Large Play Overlay when paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer z-10"
                  >
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </button>
                )}
              </>
            ) : (
              <div className="text-center p-8 text-white/50 font-mono text-xs">
                VIDEO SOURCE CURRENTLY UNAVAILABLE
              </div>
            )}

            {/* Bottom Scrubber & Controls Bar (Only for native HTML5 video stream) */}
            {!isGoogleDrive && project.videoUrl && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-200">
                {/* Progress bar */}
                <div
                  onClick={handleSeek}
                  className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full mb-3 cursor-pointer relative transition-all"
                >
                  <div
                    className="h-full bg-white rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow" />
                  </div>
                </div>

                {/* Controls */}
              <div className="flex items-center justify-between font-mono text-xs text-white">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 hover:text-white/80 transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 hover:text-white/80 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] text-white/70">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-white/10 rounded font-mono text-white/70">
                    1080P MASTER
                  </span>
                  <button
                    onClick={() => {
                      if (!videoRef.current) return;
                      if (videoRef.current.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                      }
                    }}
                    className="p-1.5 hover:text-white/80 transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Bottom Footnote with Technical Metadata */}
          <div className="p-4 bg-[#09090c] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60 font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-white/40">ROLE:</span>
              <span className="text-white">{project.role}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white/40">TOOLS:</span>
              <span className="text-white">{project.tools.join(', ')}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

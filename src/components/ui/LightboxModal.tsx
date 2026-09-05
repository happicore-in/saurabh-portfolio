import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface LightboxModalProps {
  images: { url: string; caption: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentItem = images[currentIndex];

  const handleNext = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.8 : 1));
  };

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#060608]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between z-20 pb-4 border-b border-white/10">
          <div className="font-mono text-xs text-white/60">
            <span className="text-white font-bold">{currentIndex + 1}</span>
            <span className="mx-2 text-white/30">/</span>
            <span>{images.length}</span>
            <span className="ml-4 text-white/40 hidden sm:inline">HIGH RESOLUTION ASSET VIEW</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleZoom}
              className="p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title={zoomLevel > 1 ? 'Reset Zoom' : 'Zoom In'}
            >
              {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Artwork Canvas with pan/zoom capability */}
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
          {/* Previous Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer backdrop-blur-md"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Active Image */}
          <div className="w-full h-full flex items-center justify-center p-2">
            <motion.img
              key={currentItem.url}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: zoomLevel }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              src={currentItem.url}
              alt={currentItem.caption}
              className={`max-h-[78vh] max-w-full object-contain rounded-md shadow-2xl transition-transform duration-200 ${
                zoomLevel > 1 ? 'cursor-grab' : 'cursor-zoom-in'
              }`}
              onClick={toggleZoom}
            />
          </div>

          {/* Next Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer backdrop-blur-md"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Caption Bar */}
        <div className="z-20 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 font-mono">
          <p className="text-white text-sm font-medium tracking-wide">
            {currentItem.caption}
          </p>
          <div className="flex items-center space-x-2 text-white/40 text-[11px] mt-2 sm:mt-0">
            <span>USE ARROW KEYS OR DRAG TO NAVIGATE</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

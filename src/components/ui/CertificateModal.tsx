import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Credential } from '../../types';
import { getOptimizedImageUrl } from '../../lib/cloudinary';
import { ChevronLeft, ChevronRight, X, ExternalLink, Award, ZoomIn, ZoomOut } from 'lucide-react';

interface CertificateModalProps {
  credentials: Credential[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  credentials,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomed(false);
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
  }, [isOpen, currentIndex, credentials.length]);

  if (!isOpen || credentials.length === 0) return null;

  const current = credentials[currentIndex];

  const handleNext = () => {
    setZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % credentials.length);
  };

  const handlePrev = () => {
    setZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + credentials.length) % credentials.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="cert-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#060608]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 z-20">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-white/80" />
            <div className="font-mono text-xs">
              <span className="text-white font-bold tracking-wider">
                DOCUMENT #{current.number}
              </span>
              <span className="mx-2 text-white/30">|</span>
              <span className="text-white/60 uppercase">{current.category}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setZoomed(!zoomed)}
              className="p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title={zoomed ? 'Reset Zoom' : 'Zoom In'}
            >
              {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

            {current.verificationUrl && (
              <a
                href={current.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white hover:text-[#08080a] text-white rounded-lg text-xs font-mono transition-colors"
              >
                <span>VERIFY CREDENTIAL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Certificate Preview Canvas */}
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
          {/* Previous Arrow */}
          {credentials.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Certificate Display Area */}
          <div className="max-w-4xl max-h-[74vh] flex flex-col items-center justify-center p-2">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoomed ? 1.4 : 1 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-[#0e0e12]"
            >
              <img
                src={getOptimizedImageUrl(current.image, { width: 1600, crop: 'limit' })}
                alt={current.title}
                className="max-h-[60vh] w-auto object-contain rounded select-none cursor-pointer"
                onClick={() => setZoomed(!zoomed)}
              />
            </motion.div>
          </div>

          {/* Next Arrow */}
          {credentials.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Details Footer */}
        <div className="pt-3 border-t border-white/10 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <h3 className="text-white text-sm font-bold tracking-tight">
              {current.title}
            </h3>
            <p className="text-white/60 text-[11px] mt-0.5">
              ISSUED BY: {current.issuedBy} · {current.year}
            </p>
          </div>

          <p className="text-white/50 text-[11px] max-w-md line-clamp-2">
            {current.description}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

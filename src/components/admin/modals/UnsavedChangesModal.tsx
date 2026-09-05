import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onStay: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onStay,
  onDiscard,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0E0E0E] border border-white/20 max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-950/40 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">
              UNSAVED CHANGES
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mt-2 font-mono">
              You have unsaved changes in this form. If you navigate away now, all draft modifications will be lost.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-2 font-mono text-xs">
          <button
            onClick={onStay}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 cursor-pointer uppercase tracking-wider"
          >
            STAY ON PAGE
          </button>
          
          <button
            onClick={onDiscard}
            className="px-3.5 py-2 text-white/50 hover:text-red-300 hover:bg-red-950/20 border border-transparent cursor-pointer uppercase tracking-wider"
          >
            DISCARD
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-white text-black font-bold hover:bg-white/90 cursor-pointer uppercase tracking-wider"
          >
            SAVE CHANGES
          </button>
        </div>

      </div>
    </div>
  );
};

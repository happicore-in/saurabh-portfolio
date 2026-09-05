import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'DELETE ITEM?',
  message = 'This action cannot be undone. It will be permanently removed from your CMS database and public portfolio.',
  itemName,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0E0E0E] border border-red-500/30 max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
        
        {/* Top Danger Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-950/50 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">
              {title}
            </h3>
            {itemName && (
              <p className="font-mono text-xs text-white/80 mt-1 px-2 py-1 bg-white/5 border border-white/10 truncate">
                {itemName}
              </p>
            )}
            <p className="text-xs text-white/60 leading-relaxed mt-3">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3 font-mono text-xs">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/15 transition-colors cursor-pointer uppercase tracking-wider"
          >
            CANCEL
          </button>
          
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider shadow-lg shadow-red-950"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CONFIRM DELETE</span>
          </button>
        </div>

      </div>
    </div>
  );
};

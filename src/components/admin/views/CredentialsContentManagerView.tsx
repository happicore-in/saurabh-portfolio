import React, { useState, useRef } from 'react';
import { Award, Plus, Trash2, Edit3, CheckCircle2, ExternalLink, X, ShieldCheck, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { Credential } from '../../../types';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { getOptimizedImageUrl } from '../../../lib/cloudinary';

export const CredentialsContentManagerView: React.FC = () => {
  const { credentials, addCredential, updateCredential, deleteCredential } = usePortfolioData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Web Development');
  const [issuedBy, setIssuedBy] = useState('');
  const [year, setYear] = useState('2025');
  const [verifyUrl, setVerifyUrl] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [image, setImage] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const credUpload = useCloudinaryUpload({
    folder: 'portfolio/credentials',
    maxSizeMB: 25,
    onSuccess: (res) => {
      setImage(res.secure_url);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      credUpload.selectFile(file);
      credUpload.startUpload('portfolio/credentials');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNumber('');
    setTitle('');
    setCategory('Web Development');
    setIssuedBy('');
    setYear('2025');
    setVerifyUrl('');
    setCredentialId('');
    setImage('');
    credUpload.reset();
  };

  const handleStartEdit = (item: Credential) => {
    setEditingId(item.id);
    setNumber(item.number);
    setTitle(item.title);
    setCategory(item.category);
    setIssuedBy(item.issuedBy);
    setYear(item.year);
    setVerifyUrl(item.verifyUrl || item.verificationUrl || '');
    setCredentialId(item.credentialId || '');
    setImage(item.image || '');
  };

  const handleSave = () => {
    if (!title.trim() || !issuedBy.trim()) {
      setNotice('Title and Issuing Organization are required.');
      return;
    }

    const nextNumber = number.trim() || String(credentials.length + 1).padStart(2, '0');

    const payload: Credential = {
      id: editingId === 'new' ? `cred-${Date.now()}` : (editingId || `cred-${Date.now()}`),
      number: nextNumber,
      title,
      category,
      issuedBy,
      year,
      verifyUrl: verifyUrl || undefined,
      credentialId: credentialId || undefined,
      image: image || undefined
    };

    if (editingId && editingId !== 'new') {
      updateCredential(editingId, payload);
      setNotice(`Updated credential "${title}"`);
    } else {
      addCredential(payload);
      setNotice(`Added credential "${title}"`);
    }

    resetForm();
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            CONTENT MANAGEMENT // ARCHIVE
          </span>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            CERTIFICATES & ACCREDITED CREDENTIALS
          </h1>
        </div>

        {!editingId && (
          <button
            onClick={() => {
              resetForm();
              setNumber(String(credentials.length + 1).padStart(2, '0'));
              setEditingId('new');
            }}
            className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ADD CREDENTIAL</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Editing/Creation Form */}
      {editingId && (
        <div className="p-6 bg-[#0E0E0E] border border-white/20 space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold uppercase text-white">
              {editingId === 'new' ? 'REGISTER NEW CREDENTIAL' : 'EDIT CREDENTIAL ENTRY'}
            </span>
            <button onClick={resetForm} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                NUMBER (INDEX)
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                CREDENTIAL TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Modern Web Engineering"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              >
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                ISSUED BY (ORGANIZATION) *
              </label>
              <input
                type="text"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                placeholder="e.g. Meta / Google / IIT Madras"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                ISSUANCE YEAR
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                VERIFICATION LINK URL
              </label>
              <input
                type="url"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                placeholder="https://coursera.org/verify/..."
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                CREDENTIAL ID / CERTIFICATE HASH
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. CERT-9842104"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Cloudinary Certificate Image Upload */}
          <div className="p-4 bg-[#141414] border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/80">
                CERTIFICATE IMAGE / BADGE (CLOUDINARY)
              </label>
              <span className="text-[10px] text-emerald-400">
                TARGET: portfolio/credentials
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={credUpload.isUploading}
                    className="px-3 py-2 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {credUpload.isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>UPLOADING ({credUpload.progress}%)...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>UPLOAD CERTIFICATE</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or paste direct image URL..."
                  className="w-full bg-[#0E0E0E] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
                />

                {credUpload.isUploading && (
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-200" 
                      style={{ width: `${credUpload.progress}%` }} 
                    />
                  </div>
                )}
              </div>

              <div className="h-20 bg-[#0A0A0A] border border-white/10 overflow-hidden flex items-center justify-center">
                {image ? (
                  <img 
                    src={getOptimizedImageUrl(image, { width: 300, height: 160, crop: 'fill' })} 
                    alt="Certificate preview" 
                    className="h-full w-full object-contain p-1" 
                  />
                ) : (
                  <span className="text-[10px] text-white/30 font-mono">NO IMAGE ATTACHED</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-white/50 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-white text-black font-bold uppercase"
            >
              SAVE CREDENTIAL
            </button>
          </div>
        </div>
      )}

      {/* Credentials Table (Section 23) */}
      <div className="bg-[#0C0C0C] border border-white/10 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 text-[10px] uppercase tracking-wider">
              <th className="p-3.5 w-16">NO.</th>
              <th className="p-3.5">CREDENTIAL TITLE</th>
              <th className="p-3.5">CATEGORY</th>
              <th className="p-3.5">ISSUED BY</th>
              <th className="p-3.5">YEAR</th>
              <th className="p-3.5">VERIFICATION</th>
              <th className="p-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {credentials.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-3.5 text-white/40 font-bold">
                  {c.number}
                </td>

                <td className="p-3.5">
                  <div className="font-bold text-white text-xs">
                    {c.title}
                  </div>
                  {c.credentialId && (
                    <span className="text-[10px] text-white/40 block mt-0.5">
                      ID: {c.credentialId}
                    </span>
                  )}
                </td>

                <td className="p-3.5 text-white/70">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] uppercase">
                    {c.category}
                  </span>
                </td>

                <td className="p-3.5 text-white/80 font-bold">
                  {c.issuedBy}
                </td>

                <td className="p-3.5 text-white/60">
                  {c.year}
                </td>

                <td className="p-3.5">
                  {c.verifyUrl ? (
                    <a
                      href={c.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>VERIFIED</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-white/30 text-[10px]">RECORD VERIFIED</span>
                  )}
                </td>

                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleStartEdit(c)}
                      className="p-1.5 text-white/60 hover:text-white hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCredential(c.id)}
                      className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-950/20"
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

    </div>
  );
};

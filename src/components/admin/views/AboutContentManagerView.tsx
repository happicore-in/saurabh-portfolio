import React, { useState, useRef } from 'react';
import { Save, CheckCircle2, User, GraduationCap, Compass, BookOpen, UploadCloud, Loader2 } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { getOptimizedImageUrl } from '../../../lib/cloudinary';

export const AboutContentManagerView: React.FC = () => {
  const { personalInfo, updatePersonalInfo } = usePortfolioData();

  const [name, setName] = useState(personalInfo.name);
  const [tagline, setTagline] = useState(personalInfo.tagline);
  const [bio, setBio] = useState(personalInfo.bio);
  const [portraitUrl, setPortraitUrl] = useState(personalInfo.portraitUrl || '');
  const [statusTag, setStatusTag] = useState(personalInfo.statusTag || 'AVAILABLE FOR COMMISSIONS & FULL-TIME');
  const [location, setLocation] = useState(personalInfo.location || 'India // Remote Global');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const portraitUpload = useCloudinaryUpload({
    folder: 'portfolio/profile',
    maxSizeMB: 25,
    onSuccess: (res) => {
      setPortraitUrl(res.secure_url);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      portraitUpload.selectFile(file);
      portraitUpload.startUpload('portfolio/profile');
    }
  };

  // Education state
  const [institution, setInstitution] = useState(personalInfo.education.institution);
  const [degree, setDegree] = useState(personalInfo.education.degree);
  const [gradYear, setGradYear] = useState(personalInfo.education.year);

  // Creative Philosophy
  const [ethos, setEthos] = useState(personalInfo.philosophy.ethos);
  const [principles, setPrinciples] = useState<string[]>(personalInfo.philosophy.principles);
  const [newPrinciple, setNewPrinciple] = useState('');

  const [notice, setNotice] = useState(false);

  const handleSave = () => {
    updatePersonalInfo({
      name,
      tagline,
      bio,
      portraitUrl,
      statusTag,
      location,
      education: {
        institution,
        degree,
        year: gradYear,
        highlights: personalInfo.education.highlights
      },
      philosophy: {
        ethos,
        principles
      }
    });

    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  const addPrinciple = () => {
    if (newPrinciple.trim()) {
      setPrinciples([...principles, newPrinciple.trim()]);
      setNewPrinciple('');
    }
  };

  const removePrinciple = (index: number) => {
    setPrinciples(principles.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4 sticky top-16 bg-[#050505] py-4 z-20">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            CONTENT MANAGEMENT // PERSONA & DOSSIER
          </span>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            ABOUT SAURABH & BIOGRAPHY
          </h1>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>SAVE ABOUT CONTENT</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>About dossier updated! Changes reflect on public /about page immediately.</span>
        </div>
      )}

      {/* 01. Personal Identity & Bio */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-5">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <User className="w-4 h-4 text-white/60" />
          <span>IDENTITY, HEADLINE & EDITORIAL BIOGRAPHY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              DISPLAY NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 px-3.5 py-2 text-sm text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              PRIMARY TAGLINE / TITLE
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 px-3.5 py-2 text-sm text-white font-mono focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            EDITORIAL BIOGRAPHY PARAGRAPH
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 p-3.5 text-sm text-white focus:outline-none focus:border-white leading-relaxed font-light"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                PORTRAIT PHOTO (CLOUDINARY)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={portraitUpload.isUploading}
                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                {portraitUpload.isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>UPLOADING ({portraitUpload.progress}%)</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3 h-3" />
                    <span>UPLOAD PHOTO</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {portraitUrl && (
                <div className="w-14 h-14 bg-[#181818] border border-white/20 overflow-hidden shrink-0">
                  <img
                    src={getOptimizedImageUrl(portraitUrl, { width: 100, height: 100, crop: 'thumb', gravity: 'face' })}
                    alt="Portrait Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="url"
                  value={portraitUrl}
                  onChange={(e) => setPortraitUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>
            {portraitUpload.error && (
              <p className="text-[10px] font-mono text-red-400">{portraitUpload.error}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              LOCATION & TIMEZONE
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 02. Academic Credentials & Education */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <GraduationCap className="w-4 h-4 text-white/60" />
          <span>EDUCATION & ACADEMIC BACKGROUND</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="md:col-span-2">
            <label className="block text-white/60 uppercase mb-1">INSTITUTION</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 uppercase mb-1">DEGREE / STUDY</label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 03. Creative Philosophy & Ethos */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <Compass className="w-4 h-4 text-white/60" />
          <span>CREATIVE ETHOS & GUIDING PRINCIPLES</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            PHILOSOPHY STATEMENT
          </label>
          <textarea
            rows={3}
            value={ethos}
            onChange={(e) => setEthos(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 p-3 text-xs font-mono text-white focus:outline-none leading-relaxed"
          />
        </div>

        <div className="font-mono text-xs space-y-2">
          <label className="block text-white/60 uppercase tracking-wider">
            CORE PRINCIPLES ({principles.length})
          </label>
          
          <div className="space-y-1.5">
            {principles.map((principle, idx) => (
              <div key={idx} className="p-2.5 bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-white/80">{principle}</span>
                <button
                  onClick={() => removePrinciple(idx)}
                  className="text-white/30 hover:text-red-400 text-xs px-2"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newPrinciple}
              onChange={(e) => setNewPrinciple(e.target.value)}
              placeholder="e.g. Relentless reduction of visual clutter"
              className="flex-1 bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
            />
            <button
              onClick={addPrinciple}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black uppercase font-bold border border-white/20"
            >
              + ADD PRINCIPLE
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

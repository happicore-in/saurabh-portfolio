import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { ExperienceItem } from '../../../types';

export const ExperienceContentManagerView: React.FC = () => {
  const { experience, addExperienceItem, updateExperienceItem, deleteExperienceItem } = usePortfolioData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('Remote / India');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setRole('');
    setOrganization('');
    setPeriod('');
    setLocation('Remote / India');
    setDescription('');
    setHighlights([]);
    setHighlightInput('');
  };

  const handleStartEdit = (item: ExperienceItem) => {
    setEditingId(item.id);
    setRole(item.role);
    setOrganization(item.organization);
    setPeriod(item.period);
    setLocation(item.location || 'Remote / India');
    setDescription(item.description);
    setHighlights(item.highlights || []);
  };

  const handleSave = () => {
    if (!role.trim() || !organization.trim()) {
      setNotice('Role and Organization are required fields.');
      return;
    }

    const payload: ExperienceItem = {
      id: editingId || `exp-${Date.now()}`,
      role,
      organization,
      period: period || 'Present',
      location,
      description,
      highlights
    };

    if (editingId) {
      updateExperienceItem(editingId, payload);
      setNotice(`Updated "${role} @ ${organization}"`);
    } else {
      addExperienceItem(payload);
      setNotice(`Added "${role} @ ${organization}"`);
    }

    resetForm();
    setTimeout(() => setNotice(null), 3000);
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            CONTENT MANAGEMENT // TIMELINE
          </span>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            EXPERIENCE & CAREER HISTORY
          </h1>
        </div>

        {!editingId && (
          <button
            onClick={() => {
              resetForm();
              setEditingId('new');
            }}
            className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ADD EXPERIENCE</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Editing/Creation Card */}
      {editingId && (
        <div className="p-6 bg-[#0E0E0E] border border-white/20 space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold uppercase text-white">
              {editingId === 'new' ? 'NEW CAREER POSITION' : 'EDIT POSITION'}
            </span>
            <button
              onClick={resetForm}
              className="text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                ROLE / TITLE *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Video Editor & Designer"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                ORGANIZATION / STUDIO *
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Happicore Creative Studio"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                PERIOD / TIMEFRAME
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. 2023 — Present"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                LOCATION
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote / Chennai, India"
                className="w-full bg-[#141414] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              POSITION DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key responsibilities and creative leadership scope..."
              className="w-full bg-[#141414] border border-white/15 p-3 text-xs text-white focus:outline-none leading-relaxed"
            />
          </div>

          {/* Highlights */}
          <div className="space-y-2 font-mono text-xs">
            <label className="block text-white/60 uppercase">KEY IMPACT HIGHLIGHTS</label>
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white/5 border border-white/10">
                <span className="text-white/80">{h}</span>
                <button
                  type="button"
                  onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                  className="text-white/30 hover:text-red-400"
                >
                  REMOVE
                </button>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Add bullet highlight..."
                className="flex-1 bg-[#141414] border border-white/15 px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black uppercase text-xs font-bold"
              >
                + ADD
              </button>
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
              SAVE POSITION
            </button>
          </div>
        </div>
      )}

      {/* Existing Experience Items List */}
      <div className="space-y-4">
        {experience.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-[#0C0C0C] border border-white/10 hover:border-white/20 transition-all font-mono text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div>
                <span className="text-white font-bold text-sm block">{item.role}</span>
                <span className="text-white/60 text-xs">@ {item.organization}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[10px]">
                  {item.period}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 text-white/60 hover:text-white hover:bg-white/10"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteExperienceItem(item.id)}
                    className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-950/20"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-3 text-white/70 font-sans text-xs leading-relaxed">
              {item.description}
            </p>

            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-3 space-y-1 text-white/50 text-[11px] list-disc list-inside">
                {item.highlights.map((hl, idx) => (
                  <li key={idx}>{hl}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

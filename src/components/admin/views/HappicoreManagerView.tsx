import React, { useState } from 'react';
import { Sparkles, Save, CheckCircle2, Plus, X, Globe, Layers, ArrowUpRight } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';

export const HappicoreManagerView: React.FC = () => {
  const { happicoreData, updateHappicoreData } = usePortfolioData();

  const [tagline, setTagline] = useState(happicoreData.tagline);
  const [description, setDescription] = useState(happicoreData.description);
  const [services, setServices] = useState<string[]>(happicoreData.services);
  const [newService, setNewService] = useState('');
  const [externalUrl, setExternalUrl] = useState(happicoreData.externalUrl || 'https://happicore.studio');
  const [notice, setNotice] = useState(false);

  const handleSave = () => {
    updateHappicoreData({
      tagline,
      description,
      services,
      externalUrl
    });

    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (item: string) => {
    setServices(services.filter(s => s !== item));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4 sticky top-16 bg-[#050505] py-4 z-20">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            INDEPENDENT STUDIO // VENTURE
          </span>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            HAPPICORE CREATIVE WORKSPACE
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
            Configure Saurabh&apos;s independent studio brand, offered service matrix and portfolio tie-ins.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>SAVE STUDIO CONFIG</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Happicore workspace data saved! Updates live on public /happicore page.</span>
        </div>
      )}

      {/* Brand Identity & Mission */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-5">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <Sparkles className="w-4 h-4 text-white/60" />
          <span>STUDIO BRAND IDENTITY & TAGLINE</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            STUDIO SLOGAN / MOTTO
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            WORKSPACE ETHOS & DESCRIPTION
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 p-3.5 text-sm text-white focus:outline-none focus:border-white leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
            EXTERNAL STUDIO URL / LAB DOMAIN
          </label>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
          />
        </div>
      </div>

      {/* Services Offered Matrix (Section 28) */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="font-bold text-white uppercase tracking-wider">
            SERVICES OFFERED BY HAPPICORE ({services.length})
          </span>
          <span className="text-[10px] text-white/40">COMMERCIAL COMMISSIONS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {services.map((serv) => (
            <div key={serv} className="p-3 bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <span className="text-white font-bold">{serv}</span>
              <button
                onClick={() => removeService(serv)}
                className="text-white/30 hover:text-red-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
            placeholder="Add new creative service..."
            className="flex-1 bg-[#121212] border border-white/15 px-3 py-2 text-white focus:outline-none"
          />
          <button
            onClick={addService}
            className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black uppercase font-bold border border-white/20"
          >
            + ADD SERVICE
          </button>
        </div>
      </div>

    </div>
  );
};

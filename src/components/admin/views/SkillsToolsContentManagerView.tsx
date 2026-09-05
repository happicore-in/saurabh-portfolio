import React, { useState } from 'react';
import { Wrench, Plus, X, Save, CheckCircle2, Globe, Palette, Film, Sparkles } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';

export const SkillsToolsContentManagerView: React.FC = () => {
  const { tools, updateToolsList } = usePortfolioData();

  const [webTools, setWebTools] = useState<string[]>(tools.web);
  const [graphicTools, setGraphicTools] = useState<string[]>(tools.graphic);
  const [videoTools, setVideoTools] = useState<string[]>(tools.video);

  const [inputWeb, setInputWeb] = useState('');
  const [inputGraphic, setInputGraphic] = useState('');
  const [inputVideo, setInputVideo] = useState('');

  const [notice, setNotice] = useState(false);

  const handleSaveAll = () => {
    updateToolsList({
      web: webTools,
      graphic: graphicTools,
      video: videoTools
    });

    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  const addTool = (category: 'web' | 'graphic' | 'video', value: string) => {
    if (!value.trim()) return;
    const trimmed = value.trim();
    if (category === 'web' && !webTools.includes(trimmed)) {
      setWebTools([...webTools, trimmed]);
      setInputWeb('');
    } else if (category === 'graphic' && !graphicTools.includes(trimmed)) {
      setGraphicTools([...graphicTools, trimmed]);
      setInputGraphic('');
    } else if (category === 'video' && !videoTools.includes(trimmed)) {
      setVideoTools([...videoTools, trimmed]);
      setInputVideo('');
    }
  };

  const removeTool = (category: 'web' | 'graphic' | 'video', item: string) => {
    if (category === 'web') setWebTools(webTools.filter(x => x !== item));
    if (category === 'graphic') setGraphicTools(graphicTools.filter(x => x !== item));
    if (category === 'video') setVideoTools(videoTools.filter(x => x !== item));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4 sticky top-16 bg-[#050505] py-4 z-20">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            CONTENT MANAGEMENT // PROFICIENCIES
          </span>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            SKILLS, FRAMEWORKS & CREATIVE TOOLS
          </h1>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>SAVE TOOL MATRICES</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Skills and tools successfully updated across all public sections.</span>
        </div>
      )}

      {/* 01. Web Development Stack */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center space-x-2 font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <Globe className="w-4 h-4 text-white/60" />
          <span>WEB DEVELOPMENT TECHNOLOGIES ({webTools.length})</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {webTools.map((item) => (
            <span key={item} className="px-3 py-1 bg-white/10 border border-white/15 text-white flex items-center gap-2">
              <span>{item}</span>
              <button onClick={() => removeTool('web', item)} className="text-white/40 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={inputWeb}
            onChange={(e) => setInputWeb(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool('web', inputWeb); } }}
            placeholder="Add web framework or library..."
            className="flex-1 bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
          />
          <button
            onClick={() => addTool('web', inputWeb)}
            className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black uppercase font-bold border border-white/20"
          >
            + ADD
          </button>
        </div>
      </div>

      {/* 02. Graphic Design Suite */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center space-x-2 font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <Palette className="w-4 h-4 text-white/60" />
          <span>GRAPHIC DESIGN & EDITORIAL SUITE ({graphicTools.length})</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {graphicTools.map((item) => (
            <span key={item} className="px-3 py-1 bg-white/10 border border-white/15 text-white flex items-center gap-2">
              <span>{item}</span>
              <button onClick={() => removeTool('graphic', item)} className="text-white/40 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={inputGraphic}
            onChange={(e) => setInputGraphic(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool('graphic', inputGraphic); } }}
            placeholder="Add graphic design tool..."
            className="flex-1 bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
          />
          <button
            onClick={() => addTool('graphic', inputGraphic)}
            className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black uppercase font-bold border border-white/20"
          >
            + ADD
          </button>
        </div>
      </div>

      {/* 03. Video & Audio Post-Production */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center space-x-2 font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          <Film className="w-4 h-4 text-white/60" />
          <span>VIDEO EDITING & MOTION RIGS ({videoTools.length})</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {videoTools.map((item) => (
            <span key={item} className="px-3 py-1 bg-white/10 border border-white/15 text-white flex items-center gap-2">
              <span>{item}</span>
              <button onClick={() => removeTool('video', item)} className="text-white/40 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={inputVideo}
            onChange={(e) => setInputVideo(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool('video', inputVideo); } }}
            placeholder="Add video editing or color tool..."
            className="flex-1 bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
          />
          <button
            onClick={() => addTool('video', inputVideo)}
            className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black uppercase font-bold border border-white/20"
          >
            + ADD
          </button>
        </div>
      </div>

    </div>
  );
};

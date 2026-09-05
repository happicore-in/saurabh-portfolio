import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PageRoute, CursorState, Credential } from '../types';
import { PERSONAL_INFO, CREDENTIALS_DATA, SKILLS_MATRIX, TOOLS_DATA } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { CertificateModal } from '../components/ui/CertificateModal';
import { downloadResume } from '../utils/resumeDownload';
import { ToolLogo } from '../components/ToolLogo';
import { 
  Download, 
  ArrowUpRight, 
  ArrowRight,
  Award, 
  ExternalLink, 
  GraduationCap, 
  CheckCircle2, 
  Briefcase, 
  Film, 
  Code, 
  Palette,
  Eye,
  Sparkles,
  Mail
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  anchorId?: string;
  setCursorState: (state: CursorState) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  anchorId,
  setCursorState,
}) => {
  const { personalInfo, credentials, tools } = usePortfolioData();
  const info = personalInfo || PERSONAL_INFO;
  const allCredentials = credentials.length > 0 ? credentials : CREDENTIALS_DATA;
  const allTools = tools && tools.length > 0 ? tools : TOOLS_DATA;

  const [selectedCredFilter, setSelectedCredFilter] = useState<string>('ALL');
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [activeCertIndex, setActiveCertIndex] = useState<number>(0);

  // Auto-scroll to anchor if provided from footer
  useEffect(() => {
    if (anchorId) {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [anchorId]);

  const credentialFilters = ['ALL', 'VIDEO', 'WEB', 'GRAPHIC', 'ACADEMIC'];

  const filteredCredentials = selectedCredFilter === 'ALL'
    ? allCredentials
    : allCredentials.filter((c) => c.category === selectedCredFilter);

  const openCertAt = (index: number) => {
    setActiveCertIndex(index);
    setCertModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto text-[#f2f2f5] pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* ========================================================= */}
      {/* 01. ABOUT — HERO                                          */}
      {/* ========================================================= */}
      <section className="mb-14 sm:mb-20 border-b border-white/10 pb-12 sm:pb-16">
        <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-3">
          BIOGRAPHY & CREDENTIALS // 05
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={`${info.portraitUrl ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <h1 className="font-display text-4xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none mb-6 break-words">
              {info.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-sm text-white/60 uppercase tracking-widest mb-6">
              <span>VIDEO EDITOR</span>
              <span className="text-white/20">·</span>
              <span>WEB DEVELOPER</span>
              <span className="text-white/20">·</span>
              <span>GRAPHIC DESIGNER</span>
            </div>
            <p className="text-base sm:text-2xl text-white/80 font-light leading-relaxed">
              A creative practitioner operating at the intersection of video storytelling, visual design, and interactive web engineering.
            </p>
          </div>

          {info.portraitUrl && (
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 bg-[#0e0e14] shadow-2xl">
                <img
                  src={getOptimizedImageUrl(info.portraitUrl, { width: 600, height: 750, crop: 'fill' })}
                  alt={info.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] text-white/70 tracking-widest uppercase flex items-center justify-between">
                  <span>{info.name}</span>
                  <span className="text-white/40">CREATIVE DIRECTOR</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 02. EDITORIAL INTRODUCTION                                */}
      {/* ========================================================= */}
      <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/10 pb-20">
        <div className="space-y-4">
          <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase block">
            02 // EDITORIAL INTRO
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
            &ldquo;I operate as a hybrid creative — bridging rhythm, code, and visual clarity into cohesive brand moments.&rdquo;
          </p>
          <p className="text-base text-white/70 leading-relaxed">
            Rather than siloing video from web and design, I consider them mutual multipliers. Dynamic video editing teaches rhythmic timing that informs user experience transitions; graphic design enforces typographic discipline across responsive web code.
          </p>
        </div>

        <div className="space-y-4 md:border-l md:border-white/10 md:pl-10">
          <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase block">
            WORKFLOW PHILOSOPHY
          </span>
          <p className="text-base text-white/70 leading-relaxed">
            My workflow combines technical precision with artistic direction. With an academic background in Data Science and Applications at IIT Madras, I approach design challenges with analytical problem-solving and clean algorithmic execution.
          </p>
          <p className="text-base text-white/70 leading-relaxed">
            Whether engineering an interactive portfolio engine, cutting a high-octane 4K festival recap, or drafting poster identities for national student events, I hold craft to an uncompromising standard.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 03. EXPERIENCE (ID: experience)                           */}
      {/* ========================================================= */}
      <section id="experience" className="mb-24 border-b border-white/10 pb-20 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
              03 // PRODUCTION TRACK RECORD
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              EXPERIENCE
            </h2>
          </div>
          <span className="font-mono text-xs text-white/40">
            [ VERIFIED PRODUCTION ROLES ]
          </span>
        </div>

        {/* Experience Item */}
        <div className="p-8 rounded-2xl bg-[#0c0c10] border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs text-white/40 tracking-widest uppercase block mb-1">
                ROLE & INVOLVEMENT
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Web Operations / Video Editor / Graphic Designer
              </h3>
              <p className="font-mono text-sm text-white/70 mt-1">
                The Sportify / Paradox 2026 / Student Community, IIT Madras
              </p>
            </div>

            <span className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full font-mono text-xs text-white/90 whitespace-nowrap">
              2024 – PRESENT
            </span>
          </div>

          <p className="text-base text-white/80 leading-relaxed max-w-4xl">
            Leading end-to-end video editing, web design, and creative graphics for student events, annual sports symposiums, and digital media initiatives across the IIT Madras ecosystem.
          </p>

          <div className="space-y-3 pt-2">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest block">
              KEY PRODUCTION HIGHLIGHTS:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start space-x-3 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                <span><strong>Fest Aftermovies:</strong> Edited multi-camera fest aftermovies for Paradox 2026 with custom sound design.</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                <span><strong>Event Graphics:</strong> Designed official merchandise, match flyers, social kits, and certificate templates.</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                <span><strong>Digital Presence:</strong> Maintained web portals and digital registration systems for attendees.</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                <span><strong>Community Engagement:</strong> Produced high-velocity social video promos reaching thousands across collegiate networks.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 04. SKILLS MATRIX                                         */}
      {/* ========================================================= */}
      <section className="mb-24 border-b border-white/10 pb-20">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
            04 // MULTI-DISCIPLINARY CAPABILITIES
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            SKILLS MATRIX
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* VIDEO SKILLS */}
          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <Film className="w-5 h-5 text-white" />
              <h3 className="font-display text-xl font-bold text-white">
                VIDEO
              </h3>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {SKILLS_MATRIX.video.map((skill) => (
                <div key={skill} className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-white/80">{skill}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              ))}
            </div>
          </div>

          {/* WEB SKILLS */}
          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <Code className="w-5 h-5 text-white" />
              <h3 className="font-display text-xl font-bold text-white">
                WEB
              </h3>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {SKILLS_MATRIX.web.map((skill) => (
                <div key={skill} className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-white/80">{skill}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              ))}
            </div>
          </div>

          {/* GRAPHIC SKILLS */}
          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <Palette className="w-5 h-5 text-white" />
              <h3 className="font-display text-xl font-bold text-white">
                GRAPHIC
              </h3>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {SKILLS_MATRIX.graphic.map((skill) => (
                <div key={skill} className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-white/80">{skill}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Creative Software & Technical Tools Grid */}
        <div className="mt-14 pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase block mb-1">
                SOFTWARE & PRODUCTION STACK
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase">
                CREATIVE TOOLS ARCHITECTURE
              </h3>
            </div>
            <span className="font-mono text-xs text-white/40">
              [ {allTools.length} VERIFIED PRODUCTION SUITES ]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTools.map((tool) => (
              <div
                key={tool.name}
                onMouseEnter={() => setCursorState('open')}
                onMouseLeave={() => setCursorState('default')}
                className="p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/25 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center p-2 shadow-inner group-hover:border-white/30 transition-colors">
                    <ToolLogo name={tool.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/60 uppercase">
                    {tool.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-base font-bold text-white group-hover:text-white/90 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                    {tool.experienceLevel}
                  </p>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-sans line-clamp-2">
                  {tool.roleDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 05. CREDENTIALS MATRIX (INSIDE ABOUT AS MANDATED)          */}
      {/* ========================================================= */}
      <section id="credentials" className="mb-24 border-b border-white/10 pb-20 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
              05 // VERIFIED CERTIFICATES & DIPLOMAS
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              CREDENTIALS MATRIX
            </h2>
          </div>
          <p className="font-mono text-xs text-white/50 max-w-sm">
            Click any certificate row or preview to inspect the full-resolution document and verification record.
          </p>
        </div>

        {/* Filters */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
          {credentialFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedCredFilter(filter)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                selectedCredFilter === filter
                  ? 'bg-white text-[#08080a] font-semibold'
                  : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Credentials Table / Grid Matrix */}
        <div className="space-y-4">
          {filteredCredentials.map((cred, idx) => (
            <div
              key={cred.id}
              onClick={() => openCertAt(idx)}
              onMouseEnter={() => setCursorState('open')}
              onMouseLeave={() => setCursorState('default')}
              className="p-5 rounded-xl bg-[#0c0c10] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer grid grid-cols-1 sm:grid-cols-12 gap-4 items-center group"
            >
              {/* Document Number & Category */}
              <div className="sm:col-span-3 flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                  #{cred.number}
                </span>
                <span className="px-2.5 py-0.5 bg-white/5 rounded font-mono text-[10px] text-white/60 uppercase">
                  {cred.category}
                </span>
              </div>

              {/* Title & Issuer */}
              <div className="sm:col-span-6">
                <h3 className="font-display font-bold text-base text-white group-hover:text-white/80 transition-colors">
                  {cred.title}
                </h3>
                <p className="font-mono text-xs text-white/50 mt-0.5">
                  {cred.issuedBy} · {cred.year}
                </p>
              </div>

              {/* Actions: Verification & Preview Trigger */}
              <div className="sm:col-span-3 flex items-center justify-end space-x-3">
                {cred.verificationUrl && (
                  <span className="text-[11px] font-mono text-white/40 hidden md:inline">
                    VERIFIED
                  </span>
                )}
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 06. EDUCATION (ID: education)                             */}
      {/* ========================================================= */}
      <section id="education" className="mb-24 border-b border-white/10 pb-20 scroll-mt-28">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-2">
            06 // ACADEMIC FOUNDATION
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            EDUCATION
          </h2>
        </div>

        <div className="p-8 rounded-2xl bg-[#0c0c10] border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-white/80" />
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  DEGREE PROGRAM
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {PERSONAL_INFO.education.degree}
              </h3>
              <p className="font-mono text-base text-white/70">
                {PERSONAL_INFO.education.institution}
              </p>
            </div>

            <span className="px-3.5 py-1.5 bg-white/10 border border-white/10 rounded-full font-mono text-xs text-white/90">
              {PERSONAL_INFO.education.period}
            </span>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest block">
              ACADEMIC & INTELLECTUAL HIGHLIGHTS:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONAL_INFO.education.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 07. HAPPICORE STUDIO SPOTLIGHT                             */}
      {/* ========================================================= */}
      <section className="mb-24 border-b border-white/10 pb-20">
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest block">
              07 // INDEPENDENT CREATIVE WORKSPACE
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {PERSONAL_INFO.studio.name}
            </h3>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              {PERSONAL_INFO.studio.description}
            </p>
          </div>

          <a
            href={PERSONAL_INFO.studio.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setCursorState('open')}
            onMouseLeave={() => setCursorState('default')}
            className="px-6 py-3.5 bg-white text-[#08080a] font-mono text-xs font-bold tracking-wider uppercase rounded-full hover:bg-white/90 transition-all inline-flex items-center space-x-2 shrink-0 self-start md:self-auto"
          >
            <span>VISIT @HAPPICORE</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 08. RESUME DOWNLOAD (LARGE EXPLICIT BUTTON)               */}
      {/* ========================================================= */}
      <section className="text-center py-12">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block">
            08 // CURRICULUM VITAE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            WANT THE FULL ARCHIVE?
          </h2>
          <p className="text-sm text-white/60">
            Download Saurabh&apos;s complete verified curriculum vitae covering film editing credits, web projects, and software proficiencies.
          </p>

          <div className="pt-2">
            <button
              onClick={downloadResume}
              onMouseEnter={() => setCursorState('open')}
              onMouseLeave={() => setCursorState('default')}
              className="px-8 py-4 bg-white text-[#08080a] font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-200 cursor-pointer inline-flex items-center space-x-3 shadow-2xl"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD RESUME ↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 09. COLLABORATION & CONTACT CTA                            */}
      {/* ========================================================= */}
      <section className="mt-16 pt-16 border-t border-white/10 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block">
            09 // INITIATE COLLABORATION
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            HAVE A PROJECT IN MIND?
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed font-light">
            Whether you need a dynamic video edit, bespoke web platform, or striking brand graphics, let&apos;s build something exceptional together.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              onMouseEnter={() => setCursorState('contact')}
              onMouseLeave={() => setCursorState('default')}
              className="px-8 py-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/90 hover:scale-105 transition-all cursor-pointer inline-flex items-center space-x-2"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`mailto:${info?.email || PERSONAL_INFO.email}`}
              onMouseEnter={() => setCursorState('contact')}
              onMouseLeave={() => setCursorState('default')}
              className="px-6 py-4 bg-white/5 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors inline-flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>{info?.email || PERSONAL_INFO.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      <CertificateModal
        credentials={filteredCredentials}
        initialIndex={activeCertIndex}
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
      />

    </div>
  );
};

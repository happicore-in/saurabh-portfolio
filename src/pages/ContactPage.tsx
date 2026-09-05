import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, CursorState } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { submitInquiry } from '../lib/firebase/firestore';
import { 
  Mail, 
  Instagram, 
  Linkedin, 
  Send, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
  setCursorState: (state: CursorState) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  setCursorState,
}) => {
  const { personalInfo } = usePortfolioData();
  const info = personalInfo || PERSONAL_INFO;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    service: 'VIDEO EDITING',
    budget: '$500 - $1,500',
    timeline: 'Within 2-4 Weeks',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const services = [
    'VIDEO EDITING',
    'WEB DEVELOPMENT',
    'GRAPHIC DESIGN',
    'MULTIPLE SERVICES',
  ];

  const budgets = [
    'Under $500',
    '$500 - $1,500',
    '$1,500 - $5,000',
    '$5,000+',
  ];

  const timelines = [
    'Urgent (Under 1 Week)',
    'Within 2-4 Weeks',
    'Flexible / Long-term',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, Project Details).');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const subject = formData.subject.trim() || `${formData.service} Project Inquiry`;
      const res = await submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: subject,
        service: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message.trim(),
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Failed to dispatch inquiry. Please reach out directly via email.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error communicating with database. Please reach out directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      service: 'VIDEO EDITING',
      budget: '$500 - $1,500',
      timeline: 'Within 2-4 Weeks',
      message: '',
    });
    setIsSuccess(false);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto text-[#f2f2f5] pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* 01. CONTACT — HERO */}
      <section className="mb-12 sm:mb-20 border-b border-white/10 pb-10 sm:pb-16">
        <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-3">
          INQUIRIES & COLLABORATION // 06
        </span>
        <h1 className="font-display text-3xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none mb-6 break-words">
          LET&apos;S WORK TOGETHER.
        </h1>
        <p className="font-mono text-sm sm:text-xl text-white/70 tracking-tight">
          START A CONVERSATION.
        </p>
      </section>

      {/* Grid: Direct Details + Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* 02. DIRECT CONTACT DETAILS & AVAILABILITY */}
        <div className="lg:col-span-5 space-y-10">
          
          <div className="space-y-4">
            <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase block">
              DIRECT CHANNELS
            </span>
            <p className="text-sm text-white/70 leading-relaxed">
              Have a project pitch, video cut inquiry, or website build? Drop an email or message via Instagram. Response times are typically within 24 hours.
            </p>
          </div>

          {/* Contact Direct Cards */}
          <div className="space-y-3">
            
            {/* Email */}
            <a
              href={`mailto:${info?.email || PERSONAL_INFO.email}`}
              onMouseEnter={() => setCursorState('contact')}
              onMouseLeave={() => setCursorState('default')}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/80">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                    EMAIL
                  </span>
                  <span className="font-mono text-xs text-white font-medium group-hover:text-white/80">
                    {info?.email || PERSONAL_INFO.email}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* Instagram (Happicore) */}
            <a
              href={info.studio?.instagramUrl || PERSONAL_INFO.studio.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorState('open')}
              onMouseLeave={() => setCursorState('default')}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/80">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                    STUDIO INSTAGRAM
                  </span>
                  <span className="font-mono text-xs text-white font-medium group-hover:text-white/80">
                    {info.studio?.handle || PERSONAL_INFO.studio.handle}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* LinkedIn */}
            <a
              href={info.linkedin || PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorState('open')}
              onMouseLeave={() => setCursorState('default')}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/80">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                    LINKEDIN
                  </span>
                  <span className="font-mono text-xs text-white font-medium group-hover:text-white/80">
                    {info.linkedinDisplay || PERSONAL_INFO.linkedinDisplay || 'linkedin.com/in/saurabh-creative'}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

          </div>

          {/* Availability Status */}
          <div className="p-6 rounded-2xl bg-[#0c0c10] border border-white/10 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                CURRENT FREELANCE STATUS
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Available for commissioned video editing, digital experience design, and graphic identity systems.
            </p>
            <div className="font-mono text-[11px] text-white/40 flex items-center space-x-2 pt-1">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span>TIMEZONE: IST (UTC+5:30) · GLOBAL REMOTE</span>
            </div>
          </div>

        </div>

        {/* 03. INTERACTIVE CONTACT FORM */}
        <div className="lg:col-span-7 bg-[#0c0c10] border border-white/10 rounded-2xl p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-white">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  MESSAGE DISPATCHED
                </h3>

                <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your project brief has been recorded. Saurabh will review your requirements and respond shortly.
                </p>

                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-white text-[#08080a] font-mono text-xs font-semibold rounded-lg hover:bg-white/90 transition-all cursor-pointer"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {errorMsg && (
                  <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-lg text-xs font-mono text-red-200 flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-white/60 tracking-wider uppercase block">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 focus:border-white focus:bg-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs text-white/60 tracking-wider uppercase block">
                      YOUR EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 focus:border-white focus:bg-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Project Subject / Title */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/60 tracking-wider uppercase block">
                    PROJECT TITLE / SUBJECT *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand Commercial Video Reel & Motion Identity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 focus:border-white focus:bg-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all font-sans"
                  />
                </div>

                {/* Service Needed Chips */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/60 tracking-wider uppercase block">
                    SERVICE NEEDED:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {services.map((srv) => (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => setFormData({ ...formData, service: srv })}
                        className={`p-2.5 rounded-lg font-mono text-[11px] tracking-wider uppercase border transition-all cursor-pointer text-center ${
                          formData.service === srv
                            ? 'bg-white text-[#08080a] border-white font-bold'
                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:border-white/30'
                        }`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Budget & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-white/60 tracking-wider uppercase block">
                      PROJECT BUDGET:
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 bg-[#121218] border border-white/15 focus:border-white rounded-xl text-sm text-white outline-none font-mono text-xs"
                    >
                      {budgets.map((b) => (
                        <option key={b} value={b} className="bg-[#121218] text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-white/60 tracking-wider uppercase block">
                      TIMELINE / DEADLINE:
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 bg-[#121218] border border-white/15 focus:border-white rounded-xl text-sm text-white outline-none font-mono text-xs"
                    >
                      {timelines.map((t) => (
                        <option key={t} value={t} className="bg-[#121218] text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/60 tracking-wider uppercase block">
                    PROJECT DETAILS / MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about the goals, scope, and vision for your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 focus:border-white focus:bg-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all font-sans resize-y"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => setCursorState('open')}
                    onMouseLeave={() => setCursorState('default')}
                    className="w-full py-4 bg-white text-[#08080a] font-mono text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-white/90 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING BRIEF...</span>
                    ) : (
                      <>
                        <span>SEND MESSAGE</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Mail, Share2, Save, CheckCircle2, Plus, X, Globe, ExternalLink, Inbox, Trash2, Check, Clock, User } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { 
  InquiryItem, 
  subscribeToInquiries, 
  updateInquiryStatus, 
  deleteInquiry 
} from '../../../lib/firebase/firestore';

interface ContactManagerViewProps {
  initialTab?: 'inquiries' | 'details' | 'social';
}

export const ContactManagerView: React.FC<ContactManagerViewProps> = ({ initialTab = 'inquiries' }) => {
  const { contactInfo, updateContactInfo, socialLinks, updateSocialLinks } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<'inquiries' | 'details' | 'social'>(initialTab);

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  // Contact details with defensive fallbacks
  const [email, setEmail] = useState(contactInfo?.email || 'saurabhcore31@gmail.com');
  const [location, setLocation] = useState(contactInfo?.location || 'Mau, Uttar Pradesh, India');
  const [responseTime, setResponseTime] = useState(contactInfo?.responseTime || 'Within 24 hours');
  const [freelanceStatus, setFreelanceStatus] = useState(contactInfo?.freelanceStatus || 'AVAILABLE FOR FREELANCE');

  // Social links
  const [links, setLinks] = useState(socialLinks || []);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [notice, setNotice] = useState<string | null>(null);

  // Sync with updated contactInfo from context/Firestore
  useEffect(() => {
    if (contactInfo) {
      if (contactInfo.email) setEmail(contactInfo.email);
      if (contactInfo.location) setLocation(contactInfo.location);
      if (contactInfo.responseTime) setResponseTime(contactInfo.responseTime);
      if (contactInfo.freelanceStatus) setFreelanceStatus(contactInfo.freelanceStatus);
    }
  }, [contactInfo]);

  useEffect(() => {
    if (socialLinks && socialLinks.length > 0) {
      setLinks(socialLinks);
    }
  }, [socialLinks]);

  useEffect(() => {
    const unsub = subscribeToInquiries(
      (data) => {
        setInquiries(data);
        setInquiriesLoading(false);
      },
      () => {
        setInquiriesLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (id: string, status: InquiryItem['status']) => {
    try {
      await updateInquiryStatus(id, status);
      setNotice(`Inquiry marked as ${status}`);
      setTimeout(() => setNotice(null), 3000);
    } catch {
      setNotice('Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm('Permanently remove this client inquiry?')) {
      try {
        await deleteInquiry(id);
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        setNotice('Inquiry removed');
        setTimeout(() => setNotice(null), 3000);
      } catch {
        setNotice('Failed to delete inquiry');
      }
    }
  };

  const handleSaveContact = () => {
    updateContactInfo({
      email,
      location,
      responseTime,
      freelanceStatus
    });
    setNotice('Contact details updated successfully!');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSaveSocials = () => {
    updateSocialLinks(links);
    setNotice('Social channels updated successfully!');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAddSocial = () => {
    if (newPlatform.trim() && newUrl.trim()) {
      const updated = [...links, { platform: newPlatform.trim(), url: newUrl.trim() }];
      setLinks(updated);
      updateSocialLinks(updated);
      setNewPlatform('');
      setNewUrl('');
      setNotice(`Added ${newPlatform.trim()} link`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleRemoveSocial = (platform: string) => {
    const updated = links.filter(l => l.platform !== platform);
    setLinks(updated);
    updateSocialLinks(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4 sticky top-16 bg-[#050505] py-4 z-20">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            COMMUNICATIONS // CHANNELS
          </span>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            CONTACT DETAILS & SOCIAL PRESENCE
          </h1>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3 py-2 uppercase tracking-wider flex items-center gap-1.5 ${
              activeTab === 'inquiries' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>INQUIRIES ({inquiries.length})</span>
            {inquiries.filter(i => i.status === 'new').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-2 uppercase tracking-wider ${
              activeTab === 'details' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            CONTACT INFO
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-2 uppercase tracking-wider ${
              activeTab === 'social' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            SOCIAL LINKS ({links.length})
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* 00. Client Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 font-bold text-white uppercase tracking-wider">
                <Inbox className="w-4 h-4 text-white/60" />
                <span>RECEIVED CLIENT INQUIRIES</span>
              </div>
              <span className="text-white/40 text-[11px]">
                {inquiries.length} TOTAL INQUIRIES
              </span>
            </div>

            {inquiriesLoading ? (
              <div className="py-12 text-center text-white/40">
                LOADING INQUIRIES FROM FIRESTORE...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Inbox className="w-8 h-8 text-white/20 mx-auto" />
                <p className="text-white/40">No inquiries received yet.</p>
                <p className="text-[11px] text-white/30">Submissions from the public Contact page will appear here in real time.</p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-4 border transition-colors ${
                      inq.status === 'new'
                        ? 'bg-white/[0.04] border-white/25'
                        : 'bg-white/[0.01] border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{inq.name}</span>
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                              inq.status === 'new'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : inq.status === 'contacted'
                                ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                                : inq.status === 'archived'
                                ? 'bg-white/5 text-white/40 border border-white/10'
                                : 'bg-white/10 text-white/70 border border-white/15'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <a
                          href={`mailto:${inq.email}?subject=Re: Portfolio Inquiry from ${encodeURIComponent(inq.name)}`}
                          className="text-white/60 hover:text-white underline text-xs mt-0.5 inline-block"
                        >
                          {inq.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => handleUpdateStatus(inq.id!, inq.status === 'new' ? 'read' : 'contacted')}
                          title="Change status"
                          className="px-2.5 py-1 bg-white/10 hover:bg-white hover:text-black border border-white/20 text-[10px] text-white transition-colors cursor-pointer"
                        >
                          {inq.status === 'new' ? 'MARK READ' : 'MARK CONTACTED'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(inq.id!, 'archived')}
                          title="Archive"
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-white/50 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          ARCHIVE
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id!)}
                          title="Delete"
                          className="p-1 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-white/50 mb-3 bg-white/[0.02] p-2.5 border border-white/5">
                      <div>
                        <span className="text-white/30 block text-[9px] uppercase">SERVICE:</span>
                        <span className="text-white font-medium">{inq.service || 'General'}</span>
                      </div>
                      <div>
                        <span className="text-white/30 block text-[9px] uppercase">BUDGET:</span>
                        <span className="text-white font-medium">{inq.budget || 'Flexible'}</span>
                      </div>
                      <div>
                        <span className="text-white/30 block text-[9px] uppercase">TIMELINE:</span>
                        <span className="text-white font-medium">{inq.timeline || 'Flexible'}</span>
                      </div>
                    </div>

                    <p className="text-white/80 font-sans text-xs whitespace-pre-wrap leading-relaxed">
                      {inq.message}
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40">
                      <span>{inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleString() : 'Recent'}</span>
                      <a
                        href={`mailto:${inq.email}?subject=Project Discussion - ${encodeURIComponent(inq.service || 'Portfolio')}`}
                        className="text-white font-mono hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        <span>REPLY VIA EMAIL →</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 01. Contact Details (Section 29) */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-5">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              <Mail className="w-4 h-4 text-white/60" />
              <span>DIRECT INQUIRY DETAILS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                  PRIMARY CONTACT EMAIL *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                  PRIMARY LOCATION
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                  TYPICAL RESPONSE TIME
                </label>
                <input
                  type="text"
                  value={responseTime}
                  onChange={(e) => setResponseTime(e.target.value)}
                  placeholder="Within 24 hours"
                  className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
                  COMMISSION AVAILABILITY STATUS
                </label>
                <select
                  value={freelanceStatus}
                  onChange={(e) => setFreelanceStatus(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                >
                  <option value="AVAILABLE FOR COMMISSIONS & FULL-TIME">AVAILABLE FOR COMMISSIONS & FULL-TIME</option>
                  <option value="CURRENTLY BOOKED (LIMITED AVAILABILITY)">CURRENTLY BOOKED (LIMITED AVAILABILITY)</option>
                  <option value="STUDIO COMMISSIONS ONLY VIA HAPPICORE">STUDIO COMMISSIONS ONLY VIA HAPPICORE</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={handleSaveContact}
                className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE CONTACT SETTINGS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 02. Social Links (Section 30) */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
            <div className="flex items-center space-x-2 font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              <Share2 className="w-4 h-4 text-white/60" />
              <span>ACTIVE SOCIAL PROFILE CHANNELS</span>
            </div>

            <div className="space-y-2 pt-2">
              {links.map((link, idx) => (
                <div key={idx} className="p-3 bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <span className="font-bold text-white text-xs block uppercase">{link.platform}</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/50 text-[11px] truncate block hover:underline">
                      {link.url}
                    </a>
                  </div>
                  <button
                    onClick={() => handleRemoveSocial(link.platform)}
                    className="p-1.5 text-white/30 hover:text-red-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Channel */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="font-bold text-white uppercase block">CONNECT NEW CHANNEL</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  placeholder="Platform (e.g. Behance, Vimeo, X)"
                  className="bg-[#121212] border border-white/15 px-3 py-2 text-white focus:outline-none"
                />
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="md:col-span-2 bg-[#121212] border border-white/15 px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddSocial}
                className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black uppercase font-bold border border-white/20 transition-colors cursor-pointer"
              >
                + ADD SOCIAL LINK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

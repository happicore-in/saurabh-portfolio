import React, { useState, useMemo } from 'react';
import { 
  Inbox, 
  Search, 
  Trash2, 
  Mail, 
  Check, 
  Reply, 
  Clock, 
  ExternalLink, 
  User, 
  X, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { InquiryItem } from '../../../lib/firebase/firestore';

export const InquiriesView: React.FC = () => {
  const { inquiries, unreadInquiriesCount, updateInquiryStatus, deleteInquiry } = usePortfolioData();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      // Tab filter
      if (filterTab === 'unread') {
        if (inq.read && inq.status !== 'new') return false;
      } else if (filterTab === 'replied') {
        if (inq.status !== 'replied') return false;
      } else if (filterTab === 'archived') {
        if (inq.status !== 'archived') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = inq.name.toLowerCase().includes(q);
        const matchesEmail = inq.email.toLowerCase().includes(q);
        const matchesSubject = (inq.subject || '').toLowerCase().includes(q);
        const matchesMessage = inq.message.toLowerCase().includes(q);
        const matchesService = (inq.service || '').toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesSubject || matchesMessage || matchesService;
      }

      return true;
    });
  }, [inquiries, filterTab, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    const unread = inquiries.filter(i => !i.read || i.status === 'new').length;
    const replied = inquiries.filter(i => i.status === 'replied').length;
    const archived = inquiries.filter(i => i.status === 'archived').length;
    return { all: inquiries.length, unread, replied, archived };
  }, [inquiries]);

  // Actions
  const handleMarkRead = async (inq: InquiryItem) => {
    if (!inq.id) return;
    setIsProcessing(true);
    try {
      await updateInquiryStatus(inq.id, 'read', true);
      showNotice(`Marked inquiry from "${inq.name}" as read`);
      if (selectedInquiry?.id === inq.id) {
        setSelectedInquiry({ ...selectedInquiry, status: 'read', read: true });
      }
    } catch (err: any) {
      showNotice(err?.message || 'Failed to update inquiry');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkUnread = async (inq: InquiryItem) => {
    if (!inq.id) return;
    setIsProcessing(true);
    try {
      await updateInquiryStatus(inq.id, 'new', false);
      showNotice(`Marked inquiry from "${inq.name}" as unread`);
      if (selectedInquiry?.id === inq.id) {
        setSelectedInquiry({ ...selectedInquiry, status: 'new', read: false });
      }
    } catch (err: any) {
      showNotice(err?.message || 'Failed to update inquiry');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkReplied = async (inq: InquiryItem) => {
    if (!inq.id) return;
    setIsProcessing(true);
    try {
      await updateInquiryStatus(inq.id, 'replied', true);
      showNotice(`Marked inquiry from "${inq.name}" as replied`);
      if (selectedInquiry?.id === inq.id) {
        setSelectedInquiry({ ...selectedInquiry, status: 'replied', read: true });
      }
    } catch (err: any) {
      showNotice(err?.message || 'Failed to update inquiry');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    setIsProcessing(true);
    try {
      await deleteInquiry(deleteConfirmId);
      if (selectedInquiry?.id === deleteConfirmId) {
        setSelectedInquiry(null);
      }
      setDeleteConfirmId(null);
      showNotice('Inquiry permanently deleted');
    } catch (err: any) {
      showNotice(err?.message || 'Failed to delete inquiry');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to format date
  const formatDate = (raw: any) => {
    if (!raw) return 'Recent';
    try {
      let dateObj: Date;
      if (typeof raw.toDate === 'function') {
        dateObj = raw.toDate();
      } else if (raw.seconds) {
        dateObj = new Date(raw.seconds * 1000);
      } else if (typeof raw === 'string' || typeof raw === 'number') {
        dateObj = new Date(raw);
      } else {
        return 'Recent';
      }
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-20">
      
      {/* 01. Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4 sticky top-16 bg-[#050505] py-4 z-20">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
            PORTFOLIO // COMMUNICATIONS
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
              CLIENT INQUIRIES
            </h1>
            {unreadInquiriesCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-black animate-pulse">
                {unreadInquiriesCount} NEW
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#101014] border border-white/15 focus:border-white rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-white/30 outline-none w-48 sm:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center justify-between gap-2 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-white/40 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 02. Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 font-mono text-xs">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded uppercase tracking-wider transition-colors cursor-pointer ${
            filterTab === 'all'
              ? 'bg-white text-black font-bold'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          ALL ({counts.all})
        </button>
        <button
          onClick={() => setFilterTab('unread')}
          className={`px-3 py-1.5 rounded uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
            filterTab === 'unread'
              ? 'bg-white text-black font-bold'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>UNREAD / NEW</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            filterTab === 'unread' ? 'bg-black text-white' : 'bg-emerald-400 text-black font-bold'
          }`}>
            {counts.unread}
          </span>
        </button>
        <button
          onClick={() => setFilterTab('replied')}
          className={`px-3 py-1.5 rounded uppercase tracking-wider transition-colors cursor-pointer ${
            filterTab === 'replied'
              ? 'bg-white text-black font-bold'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          REPLIED ({counts.replied})
        </button>
        <button
          onClick={() => setFilterTab('archived')}
          className={`px-3 py-1.5 rounded uppercase tracking-wider transition-colors cursor-pointer ${
            filterTab === 'archived'
              ? 'bg-white text-black font-bold'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          ARCHIVED ({counts.archived})
        </button>
      </div>

      {/* 03. Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[#0c0c10] border border-white/10 rounded-xl p-8">
          <Inbox className="w-10 h-10 text-white/20 mx-auto" />
          <h3 className="font-mono text-sm uppercase text-white tracking-wider">
            {inquiries.length === 0 ? 'No Inquiries Yet' : 'No Matching Inquiries'}
          </h3>
          <p className="text-xs text-white/50 max-w-md mx-auto font-sans leading-relaxed">
            {inquiries.length === 0 
              ? 'When visitors submit the contact form on your portfolio website, their project briefs will appear here in real time with push and email notifications.' 
              : 'Try clearing your search query or selecting a different filter tab.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inq) => {
            const isUnread = !inq.read || inq.status === 'new';
            const isSelected = selectedInquiry?.id === inq.id;

            return (
              <div
                key={inq.id}
                className={`p-5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-white bg-white/[0.06] shadow-lg shadow-white/5'
                    : isUnread
                    ? 'border-white/25 bg-white/[0.03] hover:border-white/40'
                    : 'border-white/10 bg-[#0c0c10] hover:border-white/20'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/10 pb-3.5 mb-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Unread indicator */}
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
                      )}
                      
                      <h4 className="font-display font-bold text-white text-base">
                        {inq.name}
                      </h4>

                      {/* Status badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider ${
                        inq.status === 'new' || isUnread
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : inq.status === 'replied'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                          : inq.status === 'archived'
                          ? 'bg-white/5 text-white/40 border border-white/10'
                          : 'bg-white/10 text-white/70 border border-white/20'
                      }`}>
                        {inq.status?.toUpperCase() || (isUnread ? 'NEW' : 'READ')}
                      </span>

                      {/* Subject */}
                      <span className="text-white/60 font-mono text-xs truncate max-w-xs sm:max-w-md">
                        — {inq.subject || inq.service || 'Portfolio Project'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-white/50 pt-0.5">
                      <a
                        href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Portfolio Inquiry')}`}
                        className="hover:text-white underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3 text-white/40" />
                        <span>{inq.email}</span>
                      </a>
                      <span className="inline-flex items-center gap-1 text-white/40">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(inq.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto font-mono text-xs">
                    {/* Read / Unread toggle */}
                    {isUnread ? (
                      <button
                        onClick={() => handleMarkRead(inq)}
                        disabled={isProcessing}
                        className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-white hover:text-black border border-white/20 text-[11px] text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Mark as Read"
                      >
                        <Check className="w-3 h-3" />
                        <span>MARK READ</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkUnread(inq)}
                        disabled={isProcessing}
                        className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/15 border border-white/15 text-[11px] text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Mark as Unread"
                      >
                        <span>MARK UNREAD</span>
                      </button>
                    )}

                    {/* Replied button */}
                    {inq.status !== 'replied' && (
                      <button
                        onClick={() => handleMarkReplied(inq)}
                        disabled={isProcessing}
                        className="px-2.5 py-1.5 rounded bg-blue-950/40 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-[11px] text-blue-300 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Mark as Replied"
                      >
                        <Reply className="w-3 h-3" />
                        <span>REPLIED</span>
                      </button>
                    )}

                    {/* Quick Mail reply */}
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Portfolio Inquiry')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Direct Email Reply"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteConfirmId(inq.id || null)}
                      className="p-1.5 rounded bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-500/40 text-white/40 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Brief metadata chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px] bg-black/40 p-3 rounded-lg border border-white/5 mb-3.5">
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase tracking-wider">SERVICE REQUESTED:</span>
                    <span className="text-white font-medium">{inq.service || 'General Inquiry'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase tracking-wider">BUDGET RANGE:</span>
                    <span className="text-white font-medium">{inq.budget || 'Flexible'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase tracking-wider">PROJECT TIMELINE:</span>
                    <span className="text-white font-medium">{inq.timeline || 'Immediate'}</span>
                  </div>
                </div>

                {/* Message preview or expanded */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block">
                    PROJECT BRIEF / MESSAGE:
                  </span>
                  <p className="text-sm text-white/90 font-sans leading-relaxed whitespace-pre-wrap">
                    {inq.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 04. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f14] border border-white/20 rounded-xl max-w-md w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-red-400 font-bold uppercase tracking-wider text-sm border-b border-white/10 pb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>CONFIRM INQUIRY REMOVAL</span>
            </div>

            <p className="text-white/70 font-sans text-sm leading-relaxed">
              Are you sure you want to permanently delete this inquiry? This action cannot be undone and will remove all records from Firestore.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isProcessing}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-white font-mono uppercase transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white font-mono uppercase font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

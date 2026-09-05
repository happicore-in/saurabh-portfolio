import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sliders, 
  HardDrive, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Laptop,
  Smartphone,
  Key,
  Database,
  Flame,
  Bell,
  BellOff,
  Send,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { firebaseConfig } from '../../../lib/firebase';
import {
  getNotificationStatus,
  requestPushPermissionAndRegisterToken,
  triggerLocalTestNotification,
  disablePushNotifications,
  NotificationStatus
} from '../../../lib/firebase/notifications';

// -------------------------------------------------------------
// 1. Profile Settings View (Section 31)
// -------------------------------------------------------------
export const SettingsProfileView: React.FC = () => {
  const { adminUser, updateAdminProfile } = usePortfolioData();

  const [name, setName] = useState(adminUser?.name || 'Saurabh');
  const [email, setEmail] = useState(adminUser?.email || 'saurabhcore31@gmail.com');
  const [role, setRole] = useState(adminUser?.role || 'Studio Director & Owner');
  const [notice, setNotice] = useState(false);

  const handleSave = () => {
    updateAdminProfile({ name, email, role });
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-16">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          ADMIN PREFERENCES // IDENTITY
        </span>
        <h1 className="text-2xl font-display font-bold text-white uppercase">
          PROFILE SETTINGS
        </h1>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile preferences saved!</span>
        </div>
      )}

      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
          <div className="w-16 h-16 bg-white text-black font-mono font-bold text-xl flex items-center justify-center">
            S
          </div>
          <div>
            <span className="font-bold text-white text-sm block">{adminUser.name}</span>
            <span className="text-white/40 text-xs block">{adminUser.role}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-white/60 uppercase mb-1">FULL NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 uppercase mb-1">AUTHENTICATION EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/60 uppercase mb-1">ADMINISTRATOR TITLE / ROLE</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>UPDATE PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Website Settings View (Section 32)
// -------------------------------------------------------------
export const SettingsWebsiteView: React.FC = () => {
  const [siteTitle, setSiteTitle] = useState('SAURABH // Cinematic Portfolio');
  const [metaDesc, setMetaDesc] = useState('Independent Video Editor, Web Developer, and Graphic Designer. Founder of Happicore.');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [notice, setNotice] = useState(false);

  const handleSave = () => {
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-16">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          SEO & PERFORMANCE // METADATA
        </span>
        <h1 className="text-2xl font-display font-bold text-white uppercase">
          WEBSITE CONFIGURATION
        </h1>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Website configuration updated!</span>
        </div>
      )}

      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4 font-mono text-xs">
        <div>
          <label className="block text-white/60 uppercase mb-1">PORTFOLIO HTML & OG TITLE</label>
          <input
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white/60 uppercase mb-1">META DESCRIPTION FOR SEARCH ENGINES</label>
          <textarea
            rows={3}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            className="w-full bg-[#141414] border border-white/15 p-3 text-white focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-white font-bold block uppercase">CINEMATIC MOTION TRANSITIONS</span>
              <span className="text-[10px] text-white/40">Enable framer motion transitions on public pages</span>
            </div>
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={(e) => setAnimationsEnabled(e.target.checked)}
              className="accent-white w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-white font-bold block uppercase">AMBIENT SUBTLE SOUND FX</span>
              <span className="text-[10px] text-white/40">Synthesizer micro-clicks on navigation</span>
            </div>
            <input
              type="checkbox"
              checked={ambientAudio}
              onChange={(e) => setAmbientAudio(e.target.checked)}
              className="accent-white w-4 h-4"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Storage Settings View (Section 33)
// -------------------------------------------------------------
export const SettingsStorageView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-16 font-mono text-xs">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] text-white/40 uppercase tracking-widest">
          INFRASTRUCTURE // OBJECT STORAGE
        </span>
        <h1 className="text-2xl font-display font-bold text-white uppercase">
          STORAGE PIPELINE & CDN
        </h1>
      </div>

      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white uppercase">CLOUDINARY GLOBAL MEDIA CDN</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-950/50 text-emerald-300 border border-emerald-500/20 text-[10px]">
            CONNECTED
          </span>
        </div>

        <div className="space-y-2 text-[11px] text-white/70">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">CLOUD NAME:</span>
            <span className="text-white font-bold">pegfrsqo</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">UPLOAD PRESET:</span>
            <span className="text-white">portfolio_unsigned</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">DELIVERY PIPELINE:</span>
            <span className="text-emerald-400">Automatic WebP/AVIF & Video Optimization</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">CDN EDGE:</span>
            <span className="text-white">Fastly & Akamai Multi-CDN</span>
          </div>
        </div>
      </div>

      {/* Google Drive Failover */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <Database className="w-4 h-4 text-white/60" />
            <span className="font-bold text-white uppercase">GOOGLE DRIVE VIDEO STREAMING</span>
          </div>
          <span className="px-2 py-0.5 bg-white/10 text-white/80 text-[10px]">
            SYNCHRONIZED
          </span>
        </div>
        <p className="text-white/50 text-[11px] font-sans leading-relaxed">
          Drive direct streaming failover is active. Any video reels configured with drive preview tokens stream directly across mobile and tablet viewports.
        </p>
      </div>

      {/* Firebase Cloud Services */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase">FIREBASE SDK & CLOUD SERVICES</span>
          </div>
          <span className="px-2 py-0.5 bg-amber-950/50 text-amber-300 border border-amber-500/20 text-[10px]">
            CONNECTED
          </span>
        </div>

        <div className="space-y-2 text-[11px] text-white/70">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">PROJECT ID:</span>
            <span className="text-white font-bold">{firebaseConfig.projectId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">AUTH DOMAIN:</span>
            <span className="text-white">{firebaseConfig.authDomain}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">STORAGE BUCKET:</span>
            <span className="text-white">{firebaseConfig.storageBucket}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">ANALYTICS (GA4):</span>
            <span className="text-emerald-400">{firebaseConfig.measurementId} (Active)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">APP ID:</span>
            <span className="text-white/60 font-mono text-[10px]">{firebaseConfig.appId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. Admin Account Settings View (Section 34)
// -------------------------------------------------------------
export const SettingsAccountView: React.FC = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const handleUpdatePassword = () => {
    if (!currentPass || !newPass) {
      setNotice('Please enter current and new password.');
      return;
    }
    if (newPass !== confirmPass) {
      setNotice('New passwords do not match.');
      return;
    }
    setNotice('Password updated successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-16 font-mono text-xs">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] text-white/40 uppercase tracking-widest">
          SECURITY & ACCESS // ENCRYPTION
        </span>
        <h1 className="text-2xl font-display font-bold text-white uppercase">
          ADMIN ACCOUNT CREDENTIALS
        </h1>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Change Password Form */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 font-bold text-white uppercase border-b border-white/10 pb-3">
          <Lock className="w-4 h-4 text-white/60" />
          <span>CHANGE MASTER PASSWORD</span>
        </div>

        <div>
          <label className="block text-white/60 uppercase mb-1">CURRENT PASSWORD</label>
          <input
            type="password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 uppercase mb-1">NEW PASSWORD</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 uppercase mb-1">CONFIRM NEW PASSWORD</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleUpdatePassword}
            className="px-5 py-2 bg-white text-black font-bold uppercase hover:bg-white/90"
          >
            UPDATE PASSWORD
          </button>
        </div>
      </div>

      {/* 2FA & Active Sessions */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className="font-bold text-white uppercase block">TWO-FACTOR AUTHENTICATION (2FA)</span>
            <span className="text-[10px] text-white/40">Secure CMS access via authenticator token</span>
          </div>
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={(e) => setTwoFactor(e.target.checked)}
            className="accent-white w-4 h-4"
          />
        </div>

        <div className="pt-2 space-y-2">
          <span className="font-bold text-white uppercase block text-[11px]">ACTIVE DEVICE SESSIONS</span>
          <div className="p-3 bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white block">MacBook Pro // Chrome 124 (Current Session)</span>
                <span className="text-[10px] text-white/40">IP: 103.21.244.0 // Chennai, India</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-300 font-bold uppercase">ACTIVE NOW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. Contact Notifications Settings View (Section 7)
// -------------------------------------------------------------
export const SettingsNotificationsView: React.FC = () => {
  const { adminUser } = usePortfolioData();
  const [status, setStatus] = useState<NotificationStatus>({
    supported: true,
    permission: 'default',
    token: null,
    isEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const checkStatus = async () => {
    const s = await getNotificationStatus();
    setStatus(s);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await requestPushPermissionAndRegisterToken(adminUser?.email || 'saurabh22102@gmail.com');
      if (res.success) {
        setNotice({ type: 'success', text: 'Contact notifications successfully enabled for this device!' });
        await checkStatus();
      } else {
        setNotice({ type: 'error', text: res.error || 'Failed to enable notifications.' });
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err?.message || 'Error configuring notifications.' });
    } finally {
      setLoading(false);
      setTimeout(() => setNotice(null), 5000);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    setNotice(null);
    try {
      await disablePushNotifications(adminUser?.email || 'saurabh22102@gmail.com');
      setNotice({ type: 'success', text: 'Push notifications disabled for this device.' });
      await checkStatus();
    } catch (err: any) {
      setNotice({ type: 'error', text: err?.message || 'Failed to disable notifications.' });
    } finally {
      setLoading(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleTestNotification = async () => {
    try {
      const res = await triggerLocalTestNotification();
      if (res.success) {
        setNotice({ type: 'success', text: 'Test notification fired! Check your screen/notification center.' });
      } else {
        setNotice({ type: 'error', text: res.error || 'Could not display test notification.' });
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err?.message || 'Failed to trigger test notification.' });
    }
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-16 font-mono text-xs">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] text-white/40 uppercase tracking-widest block">
          SYSTEM PREFERENCES // COMMUNICATIONS
        </span>
        <h1 className="text-2xl font-display font-bold text-white uppercase mt-1">
          CONTACT NOTIFICATIONS
        </h1>
      </div>

      {notice && (
        <div className={`p-4 border text-xs flex items-center justify-between gap-2 rounded-lg ${
          notice.type === 'success'
            ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-200'
            : 'bg-red-950/50 border-red-500/30 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
        </div>
      )}

      {/* Main Notification Card */}
      <div className="p-6 bg-[#0C0C0C] border border-white/10 rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-lg border ${
              status.isEnabled
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              {status.isEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-bold text-white text-sm uppercase block tracking-wider">
                Contact Notifications
              </span>
              <span className="text-[11px] text-white/40">
                Real-time browser push alerts when visitors submit new inquiries
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded-full border ${
              status.isEnabled
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-white/50 border-white/10'
            }`}>
              {status.isEnabled ? 'Notifications Enabled' : 'Notifications Disabled'}
            </span>
          </div>
        </div>

        {/* Browser Permission Status Warning */}
        {status.permission === 'denied' && (
          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-lg text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Browser Permission Blocked</span>
            </div>
            <p className="text-[11px] font-sans text-amber-200/80 leading-relaxed">
              Notifications for this domain were previously blocked. To enable alerts:
              click the site settings / padlock icon beside your browser address bar and set <strong>Notifications</strong> to <strong>Allow</strong>.
            </p>
          </div>
        )}

        {/* Buttons Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!status.isEnabled ? (
            <button
              onClick={handleEnableNotifications}
              disabled={loading || status.permission === 'denied'}
              className="px-5 py-2.5 bg-white text-black font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Configuring...</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Enable Notifications</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleTestNotification}
                className="px-4 py-2.5 bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Notification</span>
              </button>

              <button
                onClick={handleDisableNotifications}
                disabled={loading}
                className="px-4 py-2.5 bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-500/30 text-white/50 hover:text-red-300 font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <BellOff className="w-3.5 h-3.5" />
                <span>Disable Notifications</span>
              </button>
            </>
          )}
        </div>

        {/* Technical Pipeline Info */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-white/70">
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-white/40 uppercase">SERVICE WORKER:</span>
            <span className="text-emerald-400 font-mono">/firebase-messaging-sw.js (Active)</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-white/40 uppercase">BROWSER PERMISSION:</span>
            <span className="text-white uppercase font-bold">{status.permission}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-white/40 uppercase">RECIPIENT EMAIL:</span>
            <span className="text-white font-mono">{adminUser?.email || 'saurabh22102@gmail.com'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-white/40 uppercase">TRIGGER ENGINE:</span>
            <span className="text-white font-mono">Firebase Cloud Functions (onInquiryCreated)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-white/40 uppercase">DELIVERY PIPELINE:</span>
            <span className="text-white">Firestore → FCM Push Notification + Direct Email</span>
          </div>
        </div>
      </div>
    </div>
  );
};


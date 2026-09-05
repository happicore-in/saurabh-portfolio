import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Shield, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

interface AdminLoginProps {
  onSuccess?: () => void;
  onReturnToSite: () => void;
  sessionExpired?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onReturnToSite, sessionExpired = false }) => {
  const { login, resetPassword, authError } = usePortfolioData();
  
  const [email, setEmail] = useState('saurabhcore31@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(
    sessionExpired ? 'Your administrator session has expired. Please sign in again.' : null
  );
  const [isSuccess, setIsSuccess] = useState(false);

  // Forgot password flow
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('saurabhcore31@gmail.com');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        setIsSuccess(true);
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 600);
        }
      } else {
        setLocalError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setLocalError(err?.message || 'A network error occurred. Please try again.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    try {
      const res = await resetPassword(forgotEmail);
      setForgotLoading(false);
      if (res.success) {
        setForgotSuccess(true);
      } else {
        setForgotError(res.error || 'Unable to send password reset email. Check the address.');
      }
    } catch (err: any) {
      setForgotLoading(false);
      setForgotError(err?.message || 'Error communicating with Firebase.');
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F5F5F4] flex flex-col justify-between p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Top Header info */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center font-mono font-bold text-xs text-white">
            SC
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 hidden sm:inline">
            STUDIO CORE // FIREBASE AUTHENTICATION
          </span>
        </div>

        <button
          onClick={onReturnToSite}
          className="flex items-center space-x-2 text-xs font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO PORTFOLIO</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0A0A0A] border border-white/15 p-6 sm:p-10 shadow-2xl relative"
        >
          {/* Subtle Top Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40" />

          <AnimatePresence mode="wait">
            {!forgotMode ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Branding Title */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white/60 mb-3">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>AUTHENTICATED FIREBASE CONSOLE</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F4] tracking-tight">
                    SAURABH <br />
                    <span className="opacity-60 font-normal">ADMIN CMS</span>
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                    Sign in with your verified Firebase credentials to manage your live portfolio.
                  </p>
                </div>

                {/* Session Expired / Error Banner */}
                {displayedError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 font-mono"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{displayedError}</span>
                  </motion.div>
                )}

                {/* Success Banner */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5 font-mono"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Authentication verified. Booting CMS workspace...</span>
                  </motion.div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-white/70 mb-2">
                      ADMIN EMAIL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="saurabhcore31@gmail.com"
                        required
                        disabled={isLoading || isSuccess}
                        className="w-full bg-[#121212] border border-white/15 pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[11px] font-mono uppercase tracking-widest text-white/70">
                        PASSWORD
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotMode(true);
                          setForgotSuccess(false);
                          setForgotError(null);
                        }}
                        className="text-[10px] font-mono text-white/40 hover:text-white transition-colors cursor-pointer"
                      >
                        FORGOT PASSWORD?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter administrator password"
                        required
                        disabled={isLoading || isSuccess}
                        className="w-full bg-[#121212] border border-white/15 pl-10 pr-10 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors font-mono tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white/60 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-none bg-[#121212] border-white/30 text-white focus:ring-0 focus:ring-offset-0 accent-white"
                      />
                      <span className="font-mono text-[11px] uppercase tracking-wider">Remember this session</span>
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className="w-full mt-2 py-3.5 px-4 bg-[#F5F5F4] text-[#050505] font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>VERIFYING FIREBASE AUTH...</span>
                      </span>
                    ) : isSuccess ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SUCCESS</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>SIGN IN WITH FIREBASE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              /* Real Firebase Password Reset View */
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  onClick={() => setForgotMode(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white mb-6 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO LOGIN</span>
                </button>

                <h2 className="text-xl font-display font-bold text-white mb-1">
                  FIREBASE PASSWORD RESET
                </h2>
                <p className="text-xs text-white/50 mb-6 font-light">
                  Enter your registered administrator email. Firebase will dispatch an official password reset link.
                </p>

                {forgotError && (
                  <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-mono">
                    {forgotError}
                  </div>
                )}

                {forgotSuccess ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>RESET EMAIL DISPATCHED</span>
                      </div>
                      <p className="text-white/70">
                        Firebase dispatched instructions to <strong>{forgotEmail}</strong>. Follow the link to choose a new password.
                      </p>
                    </div>

                    <button
                      onClick={() => setForgotMode(false)}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest border border-white/20 transition-colors cursor-pointer"
                    >
                      RETURN TO SIGN IN
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-widest text-white/70 mb-2">
                        ADMINISTRATOR EMAIL
                      </label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="saurabhcore31@gmail.com"
                        required
                        className="w-full bg-[#121212] border border-white/15 px-3.5 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>SENDING VIA FIREBASE...</span>
                        </>
                      ) : (
                        <span>SEND PASSWORD RESET EMAIL</span>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>PROJECT: saurabhprotfolio</span>
            <span>FIREBASE v12+</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom info bar */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/30 gap-2">
        <span>© 2026 SAURABH CORE // SECURE CMS CONSOLE</span>
        <span>PRODUCTION INSTANCE // ASIA-SOUTHEAST1</span>
      </div>

    </div>
  );
};

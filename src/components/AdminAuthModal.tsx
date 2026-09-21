import React, { useState } from 'react';
import { Lock, ShieldCheck, X, AlertCircle, KeyRound, Mail, CheckCircle2, Shield } from 'lucide-react';
import { useAcademyStore } from '@/services/academyState';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const { verifyAdminPasscode } = useAcademyStore();
  const [authMode, setAuthMode] = useState<'passcode' | 'account'>('passcode');
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('admin@cyberaiacademy.com');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let isValid = false;

    if (authMode === 'passcode') {
      isValid = verifyAdminPasscode(passcode);
    } else {
      // Account mode
      const trimmedEmail = email.trim().toLowerCase();
      const isEmailValid = trimmedEmail === 'admin@cyberaiacademy.com' || trimmedEmail === 'admin@networkhome.edu.pk' || trimmedEmail === 'admin';
      const isPassValid = verifyAdminPasscode(password);
      isValid = isEmailValid && isPassValid;
    }

    if (isValid) {
      if (rememberMe) {
        localStorage.setItem('cyberai_admin_session', 'true');
      } else {
        sessionStorage.setItem('cyberai_admin_session', 'true');
      }
      setError(null);
      setPasscode('');
      setPassword('');
      onSuccess();
    } else {
      setError(authMode === 'passcode' ? 'Invalid Passcode. Please check PIN and try again.' : 'Invalid Email or Password.');
    }
  };

  const handleUseDefault = (code: string) => {
    if (authMode === 'passcode') {
      setPasscode(code);
    } else {
      setPassword(code);
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-slate-800 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left space-y-5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close Admin Login Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-14 h-14 bg-gradient-to-br from-[#002D62] to-[#005073] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-900/20">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-display font-extrabold text-[#002D62]">
            Administrator Portal
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Manage courses, thumbnails, syllabus chapters, student records, and Google Sheets sync.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('passcode'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'passcode' 
                ? 'bg-white text-[#002D62] shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Quick Passcode
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('account'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'account' 
                ? 'bg-white text-[#002D62] shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Staff Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          {authMode === 'passcode' ? (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex justify-between items-center">
                <span>Admin Passcode / PIN</span>
                <span className="text-[10px] text-slate-400 font-normal">Default: 1234 or admin123</span>
              </label>
              <input 
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter PIN (e.g. 1234)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#002D62] text-slate-900 font-mono text-center tracking-widest text-base shadow-inner"
                autoFocus
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Administrator Email</label>
                <input 
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cyberaiacademy.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#002D62] text-slate-800 font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex justify-between items-center">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-400 font-normal">Default: admin123</span>
                </label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#002D62] text-slate-800 font-mono text-base"
                />
              </div>
            </div>
          )}

          {/* Remember Me Checkbox & Quick Fill */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#002D62] focus:ring-[#002D62] accent-[#002D62] w-3.5 h-3.5"
              />
              <span>Remember login on this device</span>
            </label>

            <button
              type="button"
              onClick={() => handleUseDefault('1234')}
              className="text-[#007A87] hover:underline text-[11px] font-semibold"
            >
              Fill PIN 1234
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#002D62] to-[#005073] hover:from-[#001D42] hover:to-[#003D5C] text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Authenticate & Access Console
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3 h-3" />
          <span>Secured Network Home Management Gateway</span>
        </div>

      </div>
    </div>
  );
}

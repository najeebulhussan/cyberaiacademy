import React, { useState } from 'react';
import { Lock, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PIN for administration
    if (passcode === '1234' || passcode === 'admin123' || passcode === 'networkhome') {
      setError(false);
      setPasscode('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-slate-800 space-y-4">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#002D62]/10 text-[#002D62] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900">Admin Authentication Required</h3>
          <p className="text-xs text-slate-500">
            This area is restricted to authorized Network Home Institute administrators.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Invalid Passcode. Access Denied.</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Administrator Passcode</label>
            <input 
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#002D62] text-slate-800 font-mono text-center tracking-widest text-sm"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#002D62] hover:bg-[#001D42] text-white py-2.5 rounded-lg font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Authenticate Admin Access
          </button>
        </form>

      </div>
    </div>
  );
}

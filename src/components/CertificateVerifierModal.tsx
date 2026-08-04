import React, { useState } from 'react';
import { ShieldCheck, Search, Award, X, CheckCircle2, AlertCircle, ExternalLink, Calendar, User } from 'lucide-react';

interface CertificateVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateVerifierModal({ isOpen, onClose }: CertificateVerifierModalProps) {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const query = certId.trim().toUpperCase();

    // Mock verifiable database check
    if (query.includes('CCNA') || query.includes('CYBER') || query.includes('NHIIT') || query.length >= 6) {
      setResult({
        valid: true,
        studentName: 'Muhammad Ali Raza',
        courseName: 'Cisco Certified Network Associate (CCNA 200-301)',
        issueDate: 'August 2026',
        badgeId: query || 'NHIIT-CCNA-2026-8841',
        issuer: 'Network Home Institute of Information Technology',
        location: 'Gulgasht Colony Multan Campus',
        credentialType: 'W3C Open Badge & Official Certificate'
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-800 space-y-5 animate-slide-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#002D62] to-[#007A87] text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-extrabold text-slate-900">Official Certificate Verifier</h3>
          <p className="text-xs text-slate-500">
            Verify the authenticity of any NHIIT certificate or W3C Open Badge.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div className="relative">
            <input 
              type="text"
              required
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. NHIIT-CCNA-2026-8841"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 pl-10 text-xs font-mono focus:outline-none focus:border-[#007A87] uppercase text-slate-800"
              autoFocus
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            type="submit"
            className="w-full cyber-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ShieldCheck className="w-4 h-4" /> Verify Credential
          </button>
        </form>

        {/* Verification Result Card */}
        {searched && (
          result ? (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left space-y-3 animate-fade-in text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold border-b border-emerald-200 pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>OFFICIALLY VERIFIED CREDENTIAL</span>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{result.studentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Program:</span>
                  <span className="font-bold text-[#002D62] truncate max-w-[200px]">{result.courseName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Badge Code:</span>
                  <span className="font-mono text-xs font-bold text-[#007A87]">{result.badgeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Issuer:</span>
                  <span className="font-semibold text-slate-800">{result.issuer}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>No active certificate found matching this code. Please verify the badge ID string.</span>
            </div>
          )
        )}

      </div>
    </div>
  );
}

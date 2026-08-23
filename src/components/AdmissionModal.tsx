import React, { useState } from 'react';
import { X, Send, CheckCircle, MapPin, Phone, Mail, Award, BookOpen } from 'lucide-react';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdmissionModal({ isOpen, onClose }: AdmissionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('CCNA: Introduction to Networks');
  const [mode, setMode] = useState<'On-Campus Multan' | 'Online AI Sandbox'>('On-Campus Multan');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-800 space-y-5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#005073]/10 text-[#005073] uppercase">
              Multan Campus Admissions
            </span>
            <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            Network Home Admission Inquiry
          </h3>
          <p className="text-xs text-slate-500">
            311-B Bosan Road, Opp. PTCL Exchange, Gulgasht Colony, Multan
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-accentGreen/10 text-accentGreen rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Inquiry Submitted Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Our Multan admissions desk will contact you shortly at <span className="font-mono text-accentCyan font-bold">{phone}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Full Name *</label>
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Muhammad Ali"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#005073] text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">WhatsApp / Phone *</label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0333-3017333"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#005073] text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#005073] text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Select Target Certification / Program</label>
              <select 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#005073] text-slate-800"
              >
                <option value="CCNA: Introduction to Networks">Cisco CCNA 200-301 (Routing & Switching)</option>
                <option value="CCNP Enterprise Architecture">Cisco CCNP Enterprise & Routing</option>
                <option value="Cisco CyberOps Associate">Cisco CyberOps Associate (SOC Analyst)</option>
                <option value="Python & Network Automation">Python & Network Automation (Ansible)</option>
                <option value="AI & Machine Learning Essentials">AI & Machine Learning Essentials</option>
                <option value="Graphic & Video Editing">Graphic Design & Video Editing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Preferred Mode of Study</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('On-Campus Multan')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'On-Campus Multan'
                      ? 'bg-[#005073] text-white border-[#005073]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Physical Multan Campus
                </button>
                <button
                  type="button"
                  onClick={() => setMode('Online AI Sandbox')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'Online AI Sandbox'
                      ? 'bg-[#005073] text-white border-[#005073]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Online AI Interactive
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#007A87] hover:bg-[#005073] text-white py-3 rounded-lg font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Send className="w-3.5 h-3.5" /> Submit Admission Request
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

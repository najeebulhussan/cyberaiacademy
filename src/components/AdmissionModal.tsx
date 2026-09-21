import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, MapPin, Phone, Mail, Award, BookOpen, Globe, Sparkles } from 'lucide-react';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export default function AdmissionModal({ isOpen, onClose, defaultCourse }: AdmissionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState(defaultCourse || 'CCNA: Introduction to Networks');
  const [mode, setMode] = useState<'Dual (Online + In-Person)' | 'On-Campus Multan' | 'Online AI Sandbox'>('Dual (Online + In-Person)');

  useEffect(() => {
    if (defaultCourse) {
      setCourse(defaultCourse);
    }
  }, [defaultCourse]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-left">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-800 space-y-5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#005073]/10 text-[#005073] uppercase">
              Online & In-Person Admissions
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-display font-extrabold text-slate-900">
            Course Admission Inquiry
          </h3>
          <p className="text-xs text-slate-500">
            Available 100% <strong>Online Worldwide</strong> & <strong>In-Person</strong> at 311-B Bosan Road, Gulgasht Colony, Multan.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Inquiry Submitted Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Our admissions coordinator will contact you shortly at <span className="font-mono text-[#007A87] font-bold">{phone}</span> regarding your enrollment in <span className="font-bold text-slate-900">{course}</span> ({mode}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Full Name *</label>
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Muhammad Ali"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#005073] text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">WhatsApp / Phone *</label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92-333-3017333"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#005073] text-slate-800 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#005073] text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Select Target Certification / Program</label>
              <select 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#005073] text-slate-800 font-semibold cursor-pointer"
              >
                <optgroup label="Cisco Official Programs">
                  <option value="CCNA: Introduction to Networks">Cisco CCNA 200-301 (Routing & Switching)</option>
                  <option value="CCNP Enterprise: Core Networking (ENCOR)">Cisco CCNP Enterprise & Routing</option>
                  <option value="Cisco CyberOps Associate">Cisco CyberOps Associate (SOC Analyst)</option>
                  <option value="Cisco DevNet Associate">Cisco DevNet Associate (NetDevOps)</option>
                  <option value="Network Security & Firewalls">Cisco Network Security & ASA Firewalls</option>
                </optgroup>
                <optgroup label="Cloud, Linux & DevOps">
                  <option value="RHCSA: Red Hat Certified System Administrator">Red Hat RHCSA Linux (RHEL 9)</option>
                  <option value="AWS Cloud Solutions Architect">AWS Cloud Solutions Architect & DevOps</option>
                  <option value="Docker & Kubernetes Orchestration">Docker & Kubernetes Orchestration</option>
                </optgroup>
                <optgroup label="Cybersecurity & Ethical Hacking">
                  <option value="CEH: Certified Ethical Hacker v13">Certified Ethical Hacker (CEH v13)</option>
                  <option value="Cyber Smart: Protecting Yourself in an AI World">Cyber Smart: AI-Powered Digital World</option>
                  <option value="CompTIA Security+">CompTIA Security+ SY0-701</option>
                </optgroup>
                <optgroup label="Python & NetDevOps">
                  <option value="Python Essentials & Automation">Python Essentials & Network Automation</option>
                  <option value="Ansible Infrastructure Automation">Ansible Infrastructure Automation</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Preferred Mode of Study</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('Dual (Online + In-Person)')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    mode === 'Dual (Online + In-Person)'
                      ? 'bg-[#002D62] text-white border-[#002D62] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dual Hybrid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('On-Campus Multan')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    mode === 'On-Campus Multan'
                      ? 'bg-[#005073] text-white border-[#005073] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>In-Person Campus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('Online AI Sandbox')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    mode === 'Online AI Sandbox'
                      ? 'bg-[#007A87] text-white border-[#007A87] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Online</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#002D62] to-[#007A87] hover:from-[#001D42] hover:to-[#005073] text-white py-3.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3 hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" /> Submit Admission Request
            </button>
          </form>
        )}

      </div>
    </div>
  );
}


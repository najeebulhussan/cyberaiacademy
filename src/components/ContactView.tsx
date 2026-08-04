import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Building2, Globe } from 'lucide-react';

export default function ContactView() {
  const [formData, setFormData] = useState({ name: '', phone: '', course: 'CCNA Routing & Switching', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 py-6 text-slate-800 animate-fade-in text-left">
      
      {/* HEADER BANNER */}
      <div className="nhiit-glass-dark rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl space-y-4">
        <div className="particle w-4 h-4 bg-white/20" style={{ top: '15%', left: '10%' }} />
        <div className="particle w-3 h-3 bg-white/15" style={{ top: '65%', right: '15%' }} />

        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/20 text-accentCyan inline-block">
            CONTACT & CAMPUS DIRECTIONS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Get in Touch with Network Home
          </h1>
          <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed">
            Have questions about course admissions, physical hardware lab access, or certification exam vouchers? Visit our Multan campus or send us a message.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTACT CARDS */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="nhiit-glass-card rounded-3xl p-6 space-y-5 border border-white/80 shadow-xl">
            <h3 className="text-xl font-display font-extrabold text-slate-900">Multan Campus Address</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002D62]/10 text-[#002D62] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">311-B Bosan Road</span>
                  <span className="text-slate-600">Opposite PTCL Exchange, Gulgasht Colony, Multan, Punjab, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#007A87]/10 text-[#007A87] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Call / WhatsApp Support</span>
                  <span className="text-slate-600 font-mono">+92-300-6302484</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accentGreen/10 text-accentGreen flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Official Email</span>
                  <span className="text-slate-600 font-mono">info@networkhome.com.pk</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Campus Hours</span>
                  <span className="text-slate-600">Monday – Saturday: 9:00 AM – 7:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href="https://wa.me/923006302484" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Chat Directly on WhatsApp
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DIRECT INQUIRY FORM */}
        <div className="lg:col-span-7">
          <div className="nhiit-glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-white/80 shadow-xl">
            <h3 className="text-2xl font-display font-extrabold text-slate-900">Send an Instant Inquiry</h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-emerald-800 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold">Inquiry Received Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for contacting Network Home Institute. Our counselor will contact you within 2 business hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="cyber-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-block"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">Your Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Muhammad Usman"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#007A87]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">Phone / WhatsApp Number *</label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0300-1234567"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#007A87]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Select Course / Track of Interest</label>
                  <select 
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#007A87] font-semibold cursor-pointer"
                  >
                    <option value="CCNA Routing & Switching">Cisco CCNA (200-301) Enterprise Routing</option>
                    <option value="CCNP Enterprise">CCNP Enterprise Core (ENCOR & ENARSI)</option>
                    <option value="RHCSA Linux">Red Hat RHCSA EX200 Linux</option>
                    <option value="AWS Cloud Architect">AWS Cloud Solutions Architect</option>
                    <option value="DevOps Engineering">Enterprise DevOps & Kubernetes</option>
                    <option value="Cyber Security CEH">CyberOps & Ethical Hacking (CEH)</option>
                    <option value="Fortinet Firewall">Fortinet FortiGate Firewall (NSE 4)</option>
                    <option value="Python Automation">Python Network Automation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Message / Inquiry Details</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your background or batch timing preferences..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#007A87]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full cyber-btn py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" /> Send Instant Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

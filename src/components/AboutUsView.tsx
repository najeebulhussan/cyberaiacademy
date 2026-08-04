import React from 'react';
import { Building2, Award, Shield, CheckCircle2, MapPin, Users, Target, Sparkles, Server, BookOpen } from 'lucide-react';

export default function AboutUsView() {
  return (
    <div className="space-y-12 py-6 text-slate-800 animate-fade-in text-left">
      
      {/* HERO BANNER */}
      <div className="nhiit-glass-dark rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl space-y-4">
        <div className="particle w-4 h-4 bg-white/20" style={{ top: '15%', left: '10%' }} />
        <div className="particle w-3 h-3 bg-white/15" style={{ top: '65%', right: '15%' }} />

        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/20 text-accentCyan inline-block">
            ABOUT NETWORK HOME INSTITUTE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            15+ Years of Excellence in Multan
          </h1>
          <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed">
            Network Home Institute of Information Technology (NHIIT) is South Punjab's premier Cisco Networking Academy, Red Hat Linux, AWS Cloud, and Cyber Security training institution located on Bosan Road, Multan.
          </p>
        </div>
      </div>

      {/* MISSION & VISION GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="nhiit-glass-card rounded-3xl p-8 space-y-4 border border-white/80 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#002D62]/10 text-[#002D62] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900">Our Mission</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            To empower students, engineers, and IT professionals with practical, industry-aligned hands-on skills in enterprise networking, cybersecurity, cloud architecture, and automation that bridge the gap between academic theory and high-paying global IT careers.
          </p>
        </div>

        <div className="nhiit-glass-card rounded-3xl p-8 space-y-4 border border-white/80 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#007A87]/10 text-[#007A87] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900">Our Vision</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            To serve as the premier technology innovation hub in Pakistan, producing certified CCIE, RHCSA, AWS, and CEH professionals who lead cloud infrastructure and cyber defense projects globally.
          </p>
        </div>
      </div>

      {/* CORE HIGHLIGHTS */}
      <div className="nhiit-glass-card rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 text-center">
          Why Students & Employers Choose NHIIT
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="space-y-2 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#002D62] font-bold text-sm">
              <Server className="w-5 h-5 text-[#007A87]" />
              <span>Physical Router Racks</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real Cisco 4331 ISR routers, Catalyst 2960 switches, ASA firewalls, and RHEL server racks at our Multan campus.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#002D62] font-bold text-sm">
              <Award className="w-5 h-5 text-accentGreen" />
              <span>Cisco Academy Partner</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official Cisco Networking Academy curricula, W3C digital open badges, and direct exam preparation.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#002D62] font-bold text-sm">
              <Users className="w-5 h-5 text-[#002D62]" />
              <span>5,000+ Alumni Network</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Over 5,000 certified graduates working in top telecom firms, SOC threat centers, and software houses worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* CAMPUS LOCATION CARD */}
      <div className="nhiit-glass-card rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accentGreen font-bold text-xs uppercase font-mono">
            <MapPin className="w-4 h-4" /> Physical Campus Address
          </div>
          <h3 className="text-xl font-bold text-slate-900">311-B Bosan Road, Gulgasht Colony, Multan</h3>
          <p className="text-xs text-slate-500">Opposite PTCL Exchange, Bosan Road Multan, Punjab, Pakistan</p>
        </div>
        <a 
          href="https://maps.google.com/?q=Bosan+Road+Multan" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cyber-btn px-6 py-3 rounded-xl text-xs font-bold shrink-0 inline-flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" /> Get Directions on Google Maps
        </a>
      </div>

    </div>
  );
}

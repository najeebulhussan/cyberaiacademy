import React, { useState } from 'react';
import { Course, useAcademyStore } from '@/services/academyState';
import { useScrollReveal, useAnimatedCounter } from '@/hooks/useScrollReveal';
import AdmissionModal from '@/components/AdmissionModal';
import { 
  Shield, Cpu, Award, Clock, ArrowRight, Play, CheckCircle2, 
  Server, Terminal, Cloud, Lock, Users, Layers, ExternalLink, 
  BookOpen, Sparkles, MapPin, ChevronRight, FileText
} from 'lucide-react';

interface Home2ViewProps {
  onNavigateToTab: (tab: 'explore' | 'home2' | 'programs' | 'about' | 'admissions' | 'contact' | 'learning' | 'player' | 'tutor' | 'badges' | 'admin') => void;
}

export default function Home2View({ onNavigateToTab }: Home2ViewProps) {
  const { courses } = useAcademyStore();
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Scroll reveal hooks
  const reveal1 = useScrollReveal();
  const reveal2 = useScrollReveal();
  const reveal3 = useScrollReveal();
  const reveal4 = useScrollReveal();

  const yearsCounter = useAnimatedCounter(15);
  const studentsCounter = useAnimatedCounter(5000);

  return (
    <div className="space-y-20 py-6 text-slate-800 animate-fade-in text-left">
      
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION (HOME 2 - LIGHT EXECUTIVE BLUE DESIGN)          */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#F0F5FF] via-[#E6EFFF] to-[#F8FAFC] p-8 md:p-12 lg:p-16 overflow-hidden border border-blue-100 shadow-xl">
        
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* LEFT COLUMN: HERO CONTENT (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Status Badges */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-sm text-xs font-semibold text-[#002D62]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Cisco Academy Partner • Gulgasht Colony, Multan</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono shadow-sm">
                <span>🔥 Admissions Open 2026</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-display font-black text-slate-900 leading-[1.1] tracking-tight">
                Master the <br />
                Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">IT</span>
              </h1>
              
              <h2 className="text-lg sm:text-xl font-bold text-blue-900 tracking-tight">
                Enterprise IT. Real Hardware. AI-Powered Future.
              </h2>
            </div>

            {/* Sub-headline Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
              South Punjab's premier institute for <strong>Cisco CCNA/CCNP, Red Hat RHCSA Linux, AWS Cloud, DevOps & Ethical Hacking</strong>. Train on physical Cisco 4331 router racks at 311-B Bosan Road Multan alongside 24/7 AI cloud sandboxes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <button 
                onClick={() => onNavigateToTab('programs')}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-7 py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>Explore All Programs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>Virtual Campus Tour</span>
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </button>
            </div>

            {/* Key Statistics Ribbon */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-blue-200/60 text-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs">15+</span>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">15+</div>
                  <div className="text-[10px] text-slate-500">Years of Excellence</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">5,000+</div>
                  <div className="text-[10px] text-slate-500">Students Trained</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">100%</div>
                  <div className="text-[10px] text-slate-500">Hands-on Labs</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">Official</div>
                  <div className="text-[10px] text-slate-500">Cisco Academy Partner</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D HARDWARE ROUTER GRAPHIC (5 COLS) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Main 3D Floating Router Platform Container */}
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              
              {/* Glowing Pedestal Platform Glow */}
              <div className="absolute w-72 h-44 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-40 rounded-full blur-2xl transform rotate-12 animate-pulse pointer-events-none" />

              {/* Hardware Graphic / Router Rack Box */}
              <div className="relative z-10 w-full max-w-sm rounded-3xl p-6 bg-white/80 backdrop-blur-2xl border-2 border-white shadow-2xl space-y-4 text-center hero-image-float">
                
                {/* Router Hardware Image */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-4 border border-slate-800 shadow-inner">
                  <img 
                    src="/network_home_hero.jpg" 
                    alt="Cisco 4331 ISR Hardware Router" 
                    className="w-full h-48 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">Cisco 4331 ISR Router Rack</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-900">Multan Physical Lab Rack R1</div>
                  <div className="text-xs text-slate-500">Connected to 2960-X Switches & ASA Firewalls</div>
                </div>

              </div>

              {/* Floating Orbit Chip 1: Cisco 4331 */}
              <div className="absolute -top-2 left-2 z-20 px-3.5 py-2 rounded-2xl bg-white/95 border border-blue-200 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold text-slate-800">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] leading-tight">Cisco 4331</div>
                  <div className="text-[9px] text-slate-400 font-normal">ISR Router</div>
                </div>
              </div>

              {/* Floating Orbit Chip 2: AI-Powered */}
              <div className="absolute top-6 -right-2 z-20 px-3.5 py-2 rounded-2xl bg-white/95 border border-blue-200 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold text-slate-800">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] leading-tight">AI-Powered</div>
                  <div className="text-[9px] text-slate-400 font-normal">Learning</div>
                </div>
              </div>

              {/* Floating Orbit Chip 3: Cloud Lab */}
              <div className="absolute bottom-12 -right-4 z-20 px-3.5 py-2 rounded-2xl bg-white/95 border border-blue-200 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold text-slate-800">
                <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <Cloud className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] leading-tight">Cloud Lab</div>
                  <div className="text-[9px] text-slate-400 font-normal">24/7 Access</div>
                </div>
              </div>

              {/* Floating Orbit Chip 4: Linux */}
              <div className="absolute bottom-2 left-6 z-20 px-3.5 py-2 rounded-2xl bg-white/95 border border-blue-200 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold text-slate-800">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] leading-tight">Linux</div>
                  <div className="text-[9px] text-slate-400 font-normal">RHCSA Ready</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ★ FEATURED: CYBER SMART INTERACTIVE COURSE BANNER              */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative rounded-3xl overflow-hidden border border-cyan-200/60 shadow-xl bg-gradient-to-br from-[#050912] via-[#0b1a33] to-[#071525]">
        <div className="absolute inset-0 bg-[url('/cybersmart-course/assets/img/hero.webp')] bg-cover bg-center opacity-15" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid lg:grid-cols-12 gap-8 p-8 md:p-12 items-center">
          
          {/* LEFT: Course Info */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 uppercase tracking-widest">
                ★ NEW INTERACTIVE COURSE
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                FREE • 13 Modules • 12 Labs
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight tracking-tight">
              Cyber Smart: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">AI-Powered</span> Digital Safety
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              By <strong className="text-cyan-300">Najeeb ul Hassan</strong> (Focal Person & PRO, NCCIA). Learn to protect your phone, accounts, systems, social media and AI data with hands-on labs, quizzes, and a downloadable certificate.
            </p>

            <div className="flex flex-wrap gap-3">
              {['📱 Mobile Security', '🔐 Account Protection', '💻 System Hardening', '🤖 AI Safety', '🛡️ Incident Response'].map((tag, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="/cybersmart-course/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-7 py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Play className="w-4 h-4" /> Launch Interactive Course
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
              <button 
                onClick={() => onNavigateToTab('programs')}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                View All Courses
              </button>
            </div>
          </div>

          {/* RIGHT: Course Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm">
                <img 
                  src="/cybersmart-course/assets/img/hero.webp" 
                  alt="Cyber Smart Course" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Cyber Smart</div>
                      <div className="text-[10px] text-slate-400">AI-Powered Digital World</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Modules', value: '13' },
                      { label: 'Labs', value: '12' },
                      { label: 'Duration', value: '~6hr' }
                    ].map((stat, i) => (
                      <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                        <div className="text-sm font-black text-cyan-400">{stat.value}</div>
                        <div className="text-[9px] text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Certificate on completion • Offline capable
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 z-20 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-extrabold shadow-lg border border-cyan-400/50">
                🎓 FREE COURSE
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 2. OUR PROGRAMS SECTION - 5 VERTICAL GLASS CARDS                 */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section ref={reveal1} className="reveal space-y-8 text-center">
        
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-50 border border-blue-200 text-blue-600 uppercase tracking-widest">
            OUR PROGRAMS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900">
            Industry-Relevant. <span className="text-blue-600">Future-Ready.</span>
          </h2>
        </div>

        {/* 5 Vertical Program Cards Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: "Physical Router Racks",
              desc: "Hands-on training on real Cisco hardware labs.",
              icon: Server,
              color: "bg-blue-50 text-blue-600"
            },
            {
              title: "Cyber SOC Lab",
              desc: "Real-world security operations & monitoring.",
              icon: Shield,
              color: "bg-indigo-50 text-indigo-600"
            },
            {
              title: "RHCSA Linux RHEL",
              desc: "Industry-ready Linux administration skills.",
              icon: Terminal,
              color: "bg-red-50 text-red-600"
            },
            {
              title: "AWS Cloud & DevOps",
              desc: "Build, deploy & automate in the cloud.",
              icon: Cloud,
              color: "bg-cyan-50 text-cyan-600"
            },
            {
              title: "W3C Digital Badges",
              desc: "Recognized skills for your future.",
              icon: Award,
              color: "bg-emerald-50 text-emerald-600"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                onClick={() => onNavigateToTab('programs')}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <button 
            onClick={() => onNavigateToTab('programs')}
            className="bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-xl font-bold text-xs shadow-sm inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <span>View All Programs</span>
            <Layers className="w-4 h-4" />
          </button>
        </div>

      </section>


      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 3. METRIC STATS BANNER                                           */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section ref={reveal2} className="reveal bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-100 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-900">5000+</div>
            <div className="text-xs text-slate-500 font-semibold">Students Trained</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-900">100+</div>
            <div className="text-xs text-slate-500 font-semibold">Enterprise Partners</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-900">24/7</div>
            <div className="text-xs text-slate-500 font-semibold">Lab & Cloud Access</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-900">100%</div>
            <div className="text-xs text-slate-500 font-semibold">Hands-on Learning</div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 4. WHY CHOOSE NETWORK HOME SECTION                               */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section ref={reveal3} className="reveal grid lg:grid-cols-12 gap-10 items-center">
        
        {/* LEFT COLUMN: WHY CHOOSE TEXT & POINTS */}
        <div className="lg:col-span-6 space-y-6">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-50 border border-blue-200 text-blue-600 uppercase tracking-widest">
            WHY CHOOSE NETWORK HOME?
          </span>

          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 leading-tight">
            More Than Education, <br />
            We <span className="text-blue-600">Build Careers</span>.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We combine enterprise-grade infrastructure, expert certified mentors, and real-world hands-on projects to transform students into high-earning IT professionals.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Official Cisco Academy Partner",
              "Real Hardware, Real Experience",
              "24/7 AI-Powered Cloud Labs",
              "Industry Certified Trainers",
              "Career Guidance & Placement Support"
            ].map((point, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onNavigateToTab('about')}
              className="bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-xl font-bold text-xs shadow-sm inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: VIDEO SHOWCASE CONTAINER */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xl space-y-4">
            
            {/* Video Thumbnail */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
              <img 
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80" 
                alt="Multan Campus Cyber SOC Room"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white text-xs">
                <div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">311-B Bosan Road Multan</span>
                  <span className="font-extrabold text-sm">Tour Our Physical Cyber SOC Lab</span>
                </div>
              </div>
            </div>

            {/* Metrics Under Video */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl text-center">
              <div>
                <div className="text-[10px] text-slate-500 font-semibold">Live Labs</div>
                <div className="text-base font-extrabold text-slate-900">24/7</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-semibold">Active Students</div>
                <div className="text-base font-extrabold text-slate-900">1,248+</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-semibold">Success Rate</div>
                <div className="text-base font-extrabold text-blue-600">100%</div>
              </div>
            </div>

          </div>
        </div>

      </section>


      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 5. OUR TECHNOLOGY PARTNERS                                       */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section ref={reveal4} className="reveal space-y-6 text-center">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          OUR TECHNOLOGY PARTNERS
        </span>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80">
          <div className="font-display font-black text-xl tracking-tight text-blue-900 flex items-center gap-1">
            <span className="text-blue-600">CISCO</span> NETWORKING ACADEMY
          </div>
          <div className="font-display font-bold text-lg text-red-700">
            Red Hat
          </div>
          <div className="font-display font-bold text-lg text-amber-600">
            AWS Cloud
          </div>
          <div className="font-display font-bold text-lg text-slate-800">
            Linux RHEL
          </div>
          <div className="font-display font-bold text-lg text-indigo-700">
            DevOps Institute
          </div>
          <div className="font-display font-bold text-lg text-blue-700">
            Python PCAP
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 6. DARK CALL-TO-ACTION FOOTER BANNER                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="rounded-3xl bg-slate-950 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/10 text-cyan-300 border border-white/20">
              🔥 ADMISSIONS OPEN 2026
            </span>

            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight">
              Your Future in Tech <br />
              <span className="text-blue-400">Starts Here.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Join thousands of certified students who are already building the future with Network Home Institute Multan.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => setIsAdmissionOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-xl font-bold text-xs shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                Apply Now
              </button>

              <button 
                onClick={() => onNavigateToTab('contact')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-xs transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Download Brochure
              </button>
            </div>
          </div>

          {/* Right 4 Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white">Easy Admission Process</div>
              <div className="text-[10px] text-slate-400">Simple steps to get started.</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white">Flexible Batches</div>
              <div className="text-[10px] text-slate-400">Morning, Evening & Weekend.</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white">Scholarship Opportunities</div>
              <div className="text-[10px] text-slate-400">Merit-based scholarships.</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white">Career Support</div>
              <div className="text-[10px] text-slate-400">Internships & Placements.</div>
            </div>
          </div>

        </div>
      </section>

      {/* ADMISSION MODAL */}
      <AdmissionModal isOpen={isAdmissionOpen} onClose={() => setIsAdmissionOpen(false)} />

    </div>
  );
}

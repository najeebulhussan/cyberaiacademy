import React, { useState } from 'react';
import { Course, useAcademyStore } from '@/services/academyState';
import { useScrollReveal, useAnimatedCounter } from '@/hooks/useScrollReveal';
import CampusLabsShowcase from '@/components/CampusLabsShowcase';
import FacultyShowcase from '@/components/FacultyShowcase';
import { Shield, Cpu, Award, Clock, ArrowRight, X, BookOpen, Star, Network, Brain, Code, Monitor, Laptop, User, Leaf, Cloud } from 'lucide-react';

interface ExploreViewProps {
  onNavigateToTab: (tab: 'learning' | 'player' | 'tutor') => void;
}

export default function ExploreView({ onNavigateToTab }: ExploreViewProps) {
  const { courses, enrollInCourse, enrollInPathway, profile, pathways } = useAcademyStore();
  const [filter, setFilter] = useState<'All' | 'Networking' | 'Cybersecurity' | 'Programming' | 'Automation' | 'IoT & Analytics' | 'Operating Systems' | 'NetAcad'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<any | null>(null);

  // Animation hooks
  const reveal = useScrollReveal();
  const yearsCounter = useAnimatedCounter(15);
  const gradsCounter = useAnimatedCounter(5000);

  const filteredCourses = courses.filter((course) => {
    if (filter === 'All') return true;
    if (filter === 'NetAcad') return course.provider === 'NetAcad' || course.provider === 'Hybrid';
    return course.category === filter;
  });

  const handleEnrollAndLaunch = (course: Course) => {
    if (course.enrollmentStatus === 'not_enrolled') {
      enrollInCourse(course.id);
    }
    setSelectedCourse(null);
    onNavigateToTab('player');
  };

  const handleEnrollPathway = (pathway: any) => {
    enrollInPathway(pathway.title, pathway.courseIds);
    setSelectedPathway(null);
    onNavigateToTab('learning');
  };

  const handleSubjectClick = (category: typeof filter) => {
    setFilter(category);
    setTimeout(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-20 py-8 text-slate-800 page-enter">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#002D62] via-[#003B7A] to-[#005073] text-white p-8 md:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-700/50 animate-glow-breathe">
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 pointer-events-none hero-grid-bg">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Particles */}
        <div className="particle w-3 h-3" style={{ top: '15%', left: '10%' }} />
        <div className="particle w-2 h-2" style={{ top: '60%', left: '85%' }} />
        <div className="particle w-4 h-4" style={{ top: '80%', left: '30%' }} />
        <div className="particle w-2.5 h-2.5" style={{ top: '25%', right: '20%' }} />
        <div className="particle w-1.5 h-1.5" style={{ top: '45%', left: '55%' }} />

        {/* Orbit Ring Decorations */}
        <div className="absolute top-1/2 right-[-100px] w-[300px] h-[300px] border border-white/5 rounded-full animate-orbit pointer-events-none" />
        <div className="absolute top-1/2 right-[-60px] w-[220px] h-[220px] border border-white/8 rounded-full animate-orbit-reverse pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-semibold text-accentCyan animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
              <span>Network Home Institute • Gulgasht Colony, Multan</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-display font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: '0.15s' }}>
              Master Next-Gen Tech with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#00F2FE] via-white to-[#1E824C] animate-gradient-text">
                Physical Hardware & AI Labs
              </span>
            </h1>

            <p className="text-slate-200/90 text-sm md:text-base leading-relaxed max-w-xl font-sans animate-slide-up" style={{ animationDelay: '0.3s' }}>
              South Punjab's premier Cisco Networking Academy. Prepare for CCNA, CCNP, CyberOps, Python Automation, and AI Data Science certifications with hands-on router racks and 24/7 AI cloud sandboxes.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 animate-slide-up" style={{ animationDelay: '0.45s' }}>
              <button 
                onClick={() => onNavigateToTab('player')}
                className="cyber-btn px-7 py-3.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer border border-white/20 hover:scale-105 transition-transform"
              >
                <Cpu className="w-4 h-4" /> Try Interactive AI Sandbox
              </button>
              <button 
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-7 py-3.5 rounded-xl font-bold transition-all text-xs cursor-pointer backdrop-blur-sm hover:scale-105"
              >
                Explore Course Catalog
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative flex justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-full max-w-sm aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group hero-image-float">
              <img 
                src="/network_home_hero.jpg"
                alt="Network Home Bosan Road Multan Hardware Lab"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-mono font-bold text-accentGreen uppercase tracking-wider">Bosan Road Multan Lab Racks</span>
                <h3 className="text-sm font-bold">Cisco Router 4331 & Switch 2960 Hardware Lab</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ANIMATED STATS BANNER ═══════════ */}
      <section ref={reveal} className="reveal nhiit-glass-card grid grid-cols-2 md:grid-cols-4 gap-6 py-8 px-8 rounded-3xl text-center">
        <div className="space-y-1" ref={yearsCounter.ref}>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#002D62] tracking-tight">{yearsCounter.count}+ Years</h3>
          <p className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider stat-underline revealed">Excellence in Multan</p>
        </div>
        <div className="space-y-1 border-l border-slate-200" ref={gradsCounter.ref}>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#002D62] tracking-tight">{gradsCounter.count.toLocaleString()}+</h3>
          <p className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider stat-underline revealed">Certified Graduates</p>
        </div>
        <div className="space-y-1 border-l border-slate-200">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#002D62] tracking-tight">100%</h3>
          <p className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider">Practical Hands-on Labs</p>
        </div>
        <div className="space-y-1 border-l border-slate-200 col-span-2 md:col-span-1">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-accentGreen tracking-tight">Official</h3>
          <p className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider">Cisco Academy Partner</p>
        </div>
      </section>

      {/* ═══════════ SUBJECT AREAS ═══════════ */}
      <section ref={reveal} className="reveal space-y-8 py-4">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Subject Areas</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto stagger-children">
          {[
            { icon: <Shield className="w-6 h-6" />, label: 'Cybersecurity', cat: 'Cybersecurity' as const, color: 'from-red-500 to-orange-500' },
            { icon: <Network className="w-6 h-6" />, label: 'Networking', cat: 'Networking' as const, color: 'from-blue-500 to-cyan-500' },
            { icon: <Brain className="w-6 h-6" />, label: 'AI & Data Science', cat: 'IoT & Analytics' as const, color: 'from-purple-500 to-indigo-500' },
            { icon: <Code className="w-6 h-6" />, label: 'Programming', cat: 'Programming' as const, color: 'from-emerald-500 to-teal-500' },
            { icon: <Monitor className="w-6 h-6" />, label: 'Information Technology', cat: 'Operating Systems' as const, color: 'from-amber-500 to-orange-500' },
            { icon: <Laptop className="w-6 h-6" />, label: 'Digital Literacy', cat: 'Operating Systems' as const, color: 'from-sky-500 to-blue-500' },
            { icon: <User className="w-6 h-6" />, label: 'Professional Skills', cat: 'All' as const, color: 'from-pink-500 to-rose-500' },
            { icon: <Cloud className="w-6 h-6" />, label: 'Cisco Packet Tracer', cat: 'Automation' as const, color: 'from-teal-500 to-green-500' },
          ].map((subject, i) => (
            <div 
              key={i}
              onClick={() => handleSubjectClick(subject.cat)}
              className="nhiit-glass-card flex items-center gap-4 p-4 rounded-2xl cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${subject.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                {subject.icon}
              </div>
              <span className="font-sans font-bold text-slate-800 text-sm group-hover:text-[#007A87] transition-colors">{subject.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <button 
            onClick={() => {
              setFilter('All');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cyber-btn-outline rounded-full px-6 py-2 text-xs"
          >
            Explore Full Catalog
          </button>
        </div>
      </section>

      {/* ═══════════ PHYSICAL MULTAN CAMPUS LABS SHOWCASE ═══════════ */}
      <section ref={reveal} className="reveal">
        <CampusLabsShowcase />
      </section>

      {/* ═══════════ CAREER PATHWAYS ═══════════ */}
      <section ref={reveal} className="reveal" id="pathways-section">
        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-display font-bold text-slate-900">Network Home Career Pathways</h2>
          <p className="text-slate-600 text-sm max-w-xl">
            Select a structured learning pathway that directly aligns with global certifications and real-world high-paying jobs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 stagger-children">
          {pathways.map((path, idx) => (
            <div 
              key={path.id} 
              onClick={() => setSelectedPathway(path)}
              className="nhiit-glass-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div>
                <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-50/60 to-white/40 border-b border-slate-100/80">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: path.color }} />
                  <span className="text-xs font-mono font-bold tracking-wider" style={{ color: path.color }}>
                    {path.career.toUpperCase()}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-accentCyan transition-colors duration-300">
                    {path.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {path.description}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-slate-100/80">
                <div>
                  <span className="text-[10px] block font-mono text-slate-500 uppercase tracking-wider">Avg Salary</span>
                  <span className="text-md font-bold text-accentGreen font-mono">{path.salary}/yr</span>
                </div>
                <div 
                  className="px-4 py-1.5 rounded-xl border text-xs font-mono transition-all group-hover:scale-105 group-hover:shadow-sm"
                  style={{ borderColor: path.color, color: path.color }}
                >
                  Configure Plan →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ WHY NETWORK HOME ═══════════ */}
      <section ref={reveal} className="reveal space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold nhiit-glass-pill text-[#005073] uppercase tracking-wider inline-block shadow-sm">
            South Punjab Premier IT Institute
          </span>
          <h2 className="text-3xl font-display font-bold text-slate-900">Why Network Home Institute?</h2>
          <p className="text-slate-600 text-sm">
            Located at 311-B Bosan Road, Gulgasht Colony Multan. Combining physical hands-on hardware labs with state-of-the-art AI learning environments.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {[
            { icon: <Shield className="w-6 h-6" />, title: 'Physical Racks & AI Sandboxes', desc: 'Train on physical Cisco routers and switches at our Multan campus alongside 24/7 AI-powered cloud code verification sandboxes.', color: 'bg-[#005073]', bgColor: 'bg-[#005073]/10' },
            { icon: <Award className="w-6 h-6" />, title: 'Cisco & Global Certifications', desc: 'Prepare for CCNA, CCNP, CyberOps, Python, and AI Machine Learning certifications with official curricula and practical mock exams.', color: 'bg-[#007A87]', bgColor: 'bg-[#007A87]/10' },
            { icon: <Cpu className="w-6 h-6" />, title: 'University & Industry Internships', desc: 'Direct pathways for On-the-Job Training (OJT), university research partnerships, and hiring recruitment in top tech firms.', color: 'bg-accentGreen', bgColor: 'bg-accentGreen/10' },
          ].map((item, i) => (
            <div 
              key={i}
              className="nhiit-glass-card p-6 rounded-3xl space-y-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center text-[${item.color === 'bg-[#005073]' ? '#005073' : item.color === 'bg-[#007A87]' ? '#007A87' : '#1E824C'}]`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CERTIFIED EXPERT FACULTY SHOWCASE ═══════════ */}
      <section ref={reveal} className="reveal">
        <FacultyShowcase />
      </section>

      {/* ═══════════ FEATURED COURSES ═══════════ */}
      <section ref={reveal} className="reveal" id="catalog-section">
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Featured Courses</h2>
        
        {/* Filter chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'IoT & Analytics', 'Operating Systems', 'NetAcad'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-300 ${
                filter === category 
                  ? 'bg-accentCyan/10 border-accentCyan text-accentCyan shadow-glow scale-105'
                  : 'bg-white border-slate-200 text-slate-650 hover:text-slate-900 hover:border-slate-350 hover:scale-[1.03]'
              }`}
            >
              {category === 'NetAcad' ? 'NetAcad Linked' : category}
            </button>
          ))}
        </div>

        {/* Courses Section Header */}
        <div className="pt-2 pb-4 text-center md:text-left">
          <h2 className="text-3xl font-display font-light text-slate-800 tracking-tight">
            Popular <span className="font-bold text-[#007A87] border-b-2 border-[#007A87] pb-0.5">free</span> online courses
          </h2>
        </div>

        {/* Courses grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {filteredCourses.slice(0, 8).map((course, idx) => {
            const difficultyColor = course.difficulty === 'Beginner' ? 'bg-emerald-500' : course.difficulty === 'Intermediate' ? 'bg-[#007A87]' : 'bg-amber-500';
            return (
              <div 
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="nhiit-glass-card group rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between animate-slide-up"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div>
                  <div 
                    className="h-36 bg-cover bg-center p-3 flex justify-between items-start relative overflow-hidden"
                    style={{ backgroundImage: `url(${course.imageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className={`relative z-10 px-2.5 py-0.5 rounded-md text-[8px] font-extrabold text-white font-sans tracking-wider uppercase ${difficultyColor} shadow-sm`}>
                      {course.difficulty}
                    </span>
                    <button className="relative z-10 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-850 shadow-sm transition-all hover:scale-110">
                      <span className="text-[10px]">🔗</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[9px] font-sans font-bold text-slate-400 block tracking-wide">
                      {course.provider === 'NetAcad' ? 'Network Home Institute' : 'Python Institute'}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                      <span>📖</span>
                      <span>Course | Self-paced, Instructor-led</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-slate-900 leading-tight group-hover:text-accentCyan transition-colors duration-300 line-clamp-2 min-h-[40px] pt-1">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-3 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-[11px] text-slate-650 font-sans">
                    <span>🕒</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-accentGreen font-sans">
                    <span>🔓</span>
                    <span>Free</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-6">
          <button 
            onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="cyber-btn-outline rounded-full px-6 py-2 text-xs"
          >
            View All Free Courses
          </button>
        </div>
      </section>

      {/* ═══════════ TESTIMONIAL ═══════════ */}
      <section ref={reveal} className="reveal-scale relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#002D62]/5 to-white border border-slate-200/80 shadow-sm text-center overflow-hidden">
        <span className="absolute top-4 left-6 text-9xl text-slate-100 font-serif font-black pointer-events-none select-none">"</span>
        <blockquote className="text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed italic relative z-10 text-slate-700">
          "Network Home Institute gave me the real-world skills to land my dream job in Cybersecurity. The combination of Cisco curriculum and AI tutoring is unmatched."
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002D62] to-[#007A87] flex items-center justify-center font-bold text-white text-sm shadow-md">
            SJ
          </div>
          <div className="text-left text-sm">
            <h4 className="font-semibold text-slate-900">Sarah J.</h4>
            <p className="text-slate-500 text-xs">Security Analyst @ Cisco</p>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER CTA ═══════════ */}
      <section ref={reveal} className="reveal p-8 md:p-16 rounded-3xl bg-gradient-to-br from-[#002D62] to-[#005073] text-center space-y-6 text-white relative overflow-hidden">
        <div className="particle w-4 h-4 bg-white/20" style={{ top: '20%', left: '15%' }} />
        <div className="particle w-3 h-3 bg-white/15" style={{ top: '70%', right: '20%' }} />
        <div className="particle w-2 h-2 bg-white/25" style={{ bottom: '15%', left: '45%' }} />
        
        <h2 className="text-3xl font-display font-bold relative z-10">Start Your Journey Today</h2>
        <p className="text-slate-200/80 max-w-md mx-auto text-sm leading-relaxed relative z-10">
          Join thousands of learners. Gain the skills you need for the career you want at Network Home Multan.
        </p>
        <button
          onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="relative z-10 bg-white text-[#002D62] hover:bg-white/90 px-8 py-3 rounded-xl text-sm font-bold inline-block transition-all hover:scale-105 shadow-lg cursor-pointer"
        >
          Browse All Courses
        </button>
      </section>

      {/* ═══════════ COURSE MODAL ═══════════ */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl text-slate-850 animate-slide-up">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accentCyan/10 text-accentCyan">
                {selectedCourse.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-accentGreen bg-accentGreen/5 text-accentGreen">
                {selectedCourse.provider}
              </span>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900">{selectedCourse.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{selectedCourse.description}</p>
            
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] block font-mono text-slate-500 uppercase">Duration</span>
                <span className="font-bold text-slate-800">{selectedCourse.duration}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] block font-mono text-slate-500 uppercase">Labs Included</span>
                <span className="font-bold text-slate-800">{selectedCourse.modulesCount} Chapters</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] block font-mono text-slate-500 uppercase">Credential</span>
                <span className="font-bold text-accentGreen truncate block">{selectedCourse.badgeName || 'W3C Badge'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">Detailed Course Syllabus</h4>
              <div className="max-h-[180px] overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                {selectedCourse.syllabusOutline && selectedCourse.syllabusOutline.map((chapter, index) => (
                  <div key={index} className="p-2.5 text-xs text-slate-700 flex items-start gap-2 hover:bg-slate-50 transition-colors">
                    <span className="text-accentCyan font-bold">•</span>
                    <span>{chapter}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleEnrollAndLaunch(selectedCourse)}
              className="w-full cyber-btn py-3 rounded-lg font-bold"
            >
              {selectedCourse.enrollmentStatus === 'not_enrolled' ? 'Confirm Enrollment & Start' : 'Resume Course'}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ PATHWAY MODAL ═══════════ */}
      {selectedPathway && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl text-slate-800 animate-slide-up">
            <button 
              onClick={() => setSelectedPathway(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider bg-accentCyan/10 text-accentCyan inline-block">
              PATHWAY PLANNER
            </span>
            <h3 className="text-2xl font-display font-bold text-slate-900">{selectedPathway.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{selectedPathway.longDesc}</p>
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 uppercase">Target Career Role</span>
                <span className="font-bold text-accentGreen">{selectedPathway.career} (Avg {selectedPathway.salary})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 uppercase">Certifications Aligned</span>
                <span className="font-bold text-slate-800 text-right max-w-xs">{selectedPathway.certifications}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 uppercase">Required Courses</span>
                <span className="font-bold text-accentCyan">{selectedPathway.courseIds.length} Core Modules</span>
              </div>
            </div>

            <button
              onClick={() => handleEnrollPathway(selectedPathway)}
              className="w-full cyber-btn py-3 rounded-lg font-bold"
            >
              Apply Pathway Target & Enroll All Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

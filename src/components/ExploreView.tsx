import React, { useState } from 'react';
import { Course, useAcademyStore } from '@/services/academyState';
import { Shield, Cpu, Award, Clock, ArrowRight, X, BookOpen, Star, Network, Brain, Code, Monitor, Laptop, User, Leaf, Cloud } from 'lucide-react';

interface ExploreViewProps {
  onNavigateToTab: (tab: 'learning' | 'player' | 'tutor') => void;
}

export default function ExploreView({ onNavigateToTab }: ExploreViewProps) {
  const { courses, enrollInCourse, enrollInPathway, profile, pathways } = useAcademyStore();
  const [filter, setFilter] = useState<'All' | 'Networking' | 'Cybersecurity' | 'Programming' | 'Automation' | 'IoT & Analytics' | 'Operating Systems' | 'NetAcad'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<any | null>(null);

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
    <div className="space-y-16 py-8 text-slate-800">
      {/* HERO GRID SECTION */}
      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#002D62] via-[#003B7A] to-[#005073] text-white p-8 md:p-12 lg:p-14 overflow-hidden shadow-xl border border-slate-700/50">
        {/* Background Decorative Tech Lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none -z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Campus Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-semibold text-accentCyan">
              <span className="shrink-0 text-accentGreen">🏛️</span>
              <span>Network Home Institute • Gulgasht Colony, Multan</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-extrabold text-white leading-[1.15] tracking-tight">
              Master Next-Gen Tech with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-accentCyan via-white to-accentGreen bg-clip-text text-transparent">
                Physical Hardware & AI Labs
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl font-sans">
              South Punjab's premier Cisco Networking Academy. Prepare for CCNA, CCNP, CyberOps, Python Automation, and AI Data Science certifications with hands-on router racks and 24/7 AI cloud sandboxes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => onNavigateToTab('player')}
                className="bg-[#007A87] hover:bg-[#005073] text-white px-7 py-3.5 rounded-xl font-bold transition-all text-xs shadow-lg flex items-center gap-2 cursor-pointer border border-white/20 hover:scale-105"
              >
                <Cpu className="w-4 h-4" /> Try Interactive AI Sandbox
              </button>
              <button 
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-7 py-3.5 rounded-xl font-bold transition-all text-xs cursor-pointer backdrop-blur-sm"
              >
                Explore Course Catalog
              </button>
            </div>
          </div>

          {/* Right Graphic Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-sm aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80"
                alt="Network Home Bosan Road Multan Hardware Lab"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-mono font-bold text-accentGreen uppercase tracking-wider">Boson Road Multan Lab Racks</span>
                <h3 className="text-sm font-bold">Cisco Router 4331 & Switch 2960 Hardware Lab</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#002D62] tracking-tight">15+ Years</h3>
          <p className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider">Excellence in Multan</p>
        </div>
        <div className="space-y-1 border-l border-slate-200">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#002D62] tracking-tight">5,000+</h3>
          <p className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider">Certified Graduates</p>
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

      {/* SUBJECT AREAS SECTION */}
      <section className="space-y-8 py-4">
        <div className="text-center">
          <h2 className="text-3xl font-sans font-light text-slate-800 tracking-tight">Subject Areas</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div 
            onClick={() => handleSubjectClick('Cybersecurity')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">Cybersecurity</span>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => handleSubjectClick('Networking')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <Network className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">Networking</span>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => handleSubjectClick('IoT & Analytics')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">AI & Data Science</span>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => handleSubjectClick('Programming')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <Code className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">Programming</span>
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => handleSubjectClick('Operating Systems')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <Monitor className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">Information Technology</span>
          </div>

          {/* Card 6 */}
          <div 
            onClick={() => handleSubjectClick('Operating Systems')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">Digital Literacy</span>
          </div>

          {/* Card 7 */}
          <div 
            onClick={() => handleSubjectClick('All')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <User className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">Professional Skills</span>
          </div>

          {/* Card 8 */}
          <div 
            onClick={() => handleSubjectClick('All')}
            className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-slate-800 text-sm">Sustainability</span>
          </div>

          {/* Centered Row 3 */}
          <div className="sm:col-span-2 lg:col-span-4 flex justify-center pt-2">
            <div 
              onClick={() => handleSubjectClick('Automation')}
              className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-205 hover:border-slate-350 cursor-pointer shadow-sm hover:shadow transition-all group max-w-sm w-full justify-center"
            >
              <div className="p-2 text-[#72B13B] group-hover:scale-105 transition-transform shrink-0">
                <Cloud className="w-6 h-6" />
              </div>
              <span className="font-sans font-bold text-slate-800 text-sm">Cisco Packet Tracer</span>
            </div>
          </div>
        </div>

        {/* Explore Full Catalog Button */}
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => {
              setFilter('All');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border border-[#72B13B] text-[#72B13B] hover:bg-[#72B13B] hover:text-white rounded-full px-6 py-2 font-semibold transition-all text-xs cursor-pointer bg-white"
          >
            Explore Full Catalog
          </button>
        </div>
      </section>

      {/* CAREER PATHWAYS */}
      <section id="pathways-section" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-slate-900">Network Home Career Pathways</h2>
          <p className="text-slate-600 text-sm max-w-xl">
            Select a structured learning pathway that directly aligns with global certifications and real-world high-paying jobs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {pathways.map((path) => (
            <div 
              key={path.id} 
              onClick={() => setSelectedPathway(path)}
              className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: path.color }} />
                  <span className="text-xs font-mono font-bold tracking-wider" style={{ color: path.color }}>
                    {path.career.toUpperCase()}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-accentCyan transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {path.description}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-[10px] block font-mono text-slate-500 uppercase tracking-wider">Avg Salary</span>
                  <span className="text-md font-bold text-accentGreen font-mono">{path.salary}/yr</span>
                </div>
                <div 
                  className="px-4 py-1.5 rounded border text-xs font-mono transition-all group-hover:bg-slate-50"
                  style={{ borderColor: path.color, color: path.color }}
                >
                  Configure Plan
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY NETWORK HOME INSTITUTE */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#005073]/10 text-[#005073] uppercase tracking-wider">
            South Punjab Premier IT Institute
          </span>
          <h2 className="text-3xl font-display font-bold text-slate-900">Why Network Home Institute?</h2>
          <p className="text-slate-600 text-sm">
            Located at 311-B Bosan Road, Gulgasht Colony Multan. Combining physical hands-on hardware labs with state-of-the-art AI learning environments.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-[#005073]/10 flex items-center justify-center text-[#005073]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Physical Racks & AI Sandboxes</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Train on physical Cisco routers and switches at our Multan campus alongside 24/7 AI-powered cloud code verification sandboxes.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-[#007A87]/10 flex items-center justify-center text-[#007A87]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cisco & Global Certifications</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Prepare for CCNA, CCNP, CyberOps, Python, and AI Machine Learning certifications with official curricula and practical mock exams.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-accentGreen/10 flex items-center justify-center text-accentGreen">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">University & Industry Internships</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Direct pathways for On-the-Job Training (OJT), university research partnerships, and hiring recruitment in top tech firms.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES CATALOG */}
      <section id="catalog-section" className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-slate-900">Featured Courses</h2>
        
        {/* Filter chips */}
        <div className="flex flex-wrap gap-3">
          {(['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'IoT & Analytics', 'Operating Systems', 'NetAcad'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                filter === category 
                  ? 'bg-accentCyan/10 border-accentCyan text-accentCyan shadow-glow'
                  : 'bg-white border-slate-200 text-slate-650 hover:text-slate-900 hover:border-slate-350'
              }`}
            >
              {category === 'NetAcad' ? 'NetAcad Linked' : category}
            </button>
          ))}
        </div>

        {/* SUBHEADER: POPULAR FREE ONLINE COURSES */}
        <div className="pt-6 pb-2 text-center md:text-left">
          <h2 className="text-3xl font-display font-light text-slate-800 tracking-tight">
            Popular <span className="font-bold text-[#72B13B] border-b-2 border-[#72B13B] pb-0.5">free</span> online courses
          </h2>
        </div>

        {/* Courses grid with navigation arrows */}
        <div className="relative px-2">
          {/* Left Arrow Icon */}
          <div className="hidden lg:flex absolute left-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-slate-250 bg-white items-center justify-center text-[#72B13B] cursor-pointer hover:bg-slate-50 shadow-sm">
            <span className="font-bold text-sm">‹</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.slice(0, 8).map((course) => {
              const difficultyColor = course.difficulty === 'Beginner' ? 'bg-[#72B13B]' : course.difficulty === 'Intermediate' ? 'bg-[#007A87]' : 'bg-[#D97706]';
              return (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="group bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] hover:border-slate-300 hover:shadow"
                >
                  <div>
                    {/* Course Header Thumbnail Image */}
                    <div 
                      className="h-36 bg-cover bg-center p-3 flex justify-between items-start relative overflow-hidden"
                      style={{ backgroundImage: `url(${course.imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-black/5" />
                      
                      {/* Left tag beginner/intermediate */}
                      <span className={`relative z-10 px-2 py-0.5 rounded-[3px] text-[8px] font-extrabold text-white font-sans tracking-wider uppercase ${difficultyColor}`}>
                        {course.difficulty}
                      </span>
                      
                      {/* Right Share button */}
                      <button className="relative z-10 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-850 shadow-sm transition-colors">
                        <span className="text-[10px]">🔗</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      {/* Provider text */}
                      <span className="text-[9px] font-sans font-bold text-slate-400 block tracking-wide">
                        {course.provider === 'NetAcad' ? 'Network Home Institute' : 'Python Institute'}
                      </span>
                      
                      {/* Course type */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                        <span>📖</span>
                        <span>Course | Self-paced, Instructor-led</span>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-sm font-sans font-bold text-slate-900 leading-tight group-hover:text-accentCyan transition-colors line-clamp-2 min-h-[40px] pt-1">
                        {course.title}
                      </h3>

                      {/* Course description */}
                      <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom details */}
                  <div className="px-4 pb-4 pt-3 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-[11px] text-slate-650 font-sans">
                      <span>🕒</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-650 font-sans">
                      <span>🔓</span>
                      <span>Free</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Icon */}
          <div className="hidden lg:flex absolute right-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-slate-250 bg-white items-center justify-center text-[#72B13B] cursor-pointer hover:bg-slate-50 shadow-sm">
            <span className="font-bold text-sm">›</span>
          </div>
        </div>

        {/* View All Free Courses Button */}
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-[#72B13B] text-[#72B13B] hover:bg-[#72B13B] hover:text-white rounded-full px-6 py-2 font-semibold transition-all text-xs cursor-pointer bg-white"
          >
            View All Free Courses
          </button>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative p-8 md:p-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center overflow-hidden">
        <span className="absolute top-4 left-6 text-9xl text-slate-100 font-serif font-black pointer-events-none select-none">“</span>
        <blockquote className="text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed italic relative z-10 text-slate-700">
          "CyberAI Academy gave me the real-world skills to land my dream job in Cybersecurity. The combination of Cisco curriculum and AI tutoring is unmatched."
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-accentPurple/20 flex items-center justify-center font-bold text-accentPurple">
            SJ
          </div>
          <div className="text-left text-sm">
            <h4 className="font-semibold text-slate-900">Sarah J.</h4>
            <p className="text-slate-500 text-xs">Security Analyst @ Cisco</p>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="p-8 md:p-16 rounded-2xl bg-gradient-to-br from-accentPurple/5 to-white border border-slate-200 text-center space-y-6">
        <h2 className="text-3xl font-display font-bold text-slate-900">Start Your Journey Today</h2>
        <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
          Join millions of learners worldwide. Gain the skills you need for the career you want.
        </p>
        <button
          onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="cyber-btn px-8 py-3 rounded-lg text-sm inline-block"
        >
          Browse All Courses
        </button>
      </section>

      {/* COURSE MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl text-slate-850">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-950"
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

            {/* Detailed Course Syllabus Outline */}
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

      {/* PATHWAY MODAL */}
      {selectedPathway && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl text-slate-800">
            <button 
              onClick={() => setSelectedPathway(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-950"
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

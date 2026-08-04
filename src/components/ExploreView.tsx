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
      <section className="grid lg:grid-cols-12 gap-8 items-center pt-6 pb-12 relative overflow-hidden">
        {/* Decorative backdrop blobs */}
        <div className="absolute top-0 left-10 w-72 h-72 bg-accentCyan/5 rounded-full blur-3xl -z-10" />
        
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Hot news pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-[11px] text-slate-700 leading-tight">
            <span className="shrink-0">🔥</span>
            <span>
              The cybersecurity job market is hot! See why 5 million learners began their journey with our{' '}
              <a href="#catalog-section" className="font-bold underline text-[#72B13B] hover:text-[#5d942e]">
                free Intro to Cybersecurity course
              </a>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-sans font-light text-slate-900 leading-[1.1] tracking-tight">
            Build your skills. <br />
            <span className="font-extrabold text-[#002D62]">Build your future.</span>
          </h1>

          {/* Description */}
          <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
            <p>
              Free online courses. In-person learning. Certification-aligned pathways designed to help you stand out in the job market. From AI and Cybersecurity to Networking and Digital Literacy, it's all here.
            </p>
            <p className="font-semibold text-slate-800">
              Are you ready to begin, change, or propel your career?
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#72B13B] hover:bg-[#609A2E] text-white px-8 py-3 rounded-full font-bold transition-all text-xs shadow-sm cursor-pointer"
            >
              Start Learning
            </button>
            <button 
              onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-[#72B13B] text-[#72B13B] hover:bg-[#72B13B]/5 px-8 py-3 rounded-full font-bold transition-all text-xs cursor-pointer bg-white"
            >
              Explore Subjects
            </button>
          </div>
        </div>

        {/* Right graphic collage column */}
        <div className="lg:col-span-5 relative flex justify-center items-center gap-4 min-h-[340px]">
          {/* Background SVG Grid and Wavy Lines */}
          <div className="absolute inset-0 -z-10 opacity-70 flex justify-center items-center pointer-events-none">
            {/* Grid dot matrix */}
            <svg width="240" height="240" viewBox="0 0 240 240" className="absolute left-4 bottom-4 text-slate-200" fill="currentColor">
              <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" />
              </pattern>
              <rect width="240" height="240" fill="url(#dotPattern)" />
            </svg>
            {/* Decorative wavy lines */}
            <svg viewBox="0 0 200 200" className="absolute right-0 top-0 w-64 h-64 text-accentCyan/10" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M 0,100 C 50,50 50,150 100,100 C 150,50 150,150 200,100" />
              <path d="M 0,120 C 50,70 50,170 100,120 C 150,70 150,170 200,120" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Left tall portrait image */}
          <div className="translate-y-4">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
              alt="Cisco NetAcad student" 
              className="w-40 h-64 md:w-44 md:h-72 object-cover rounded-t-[80px] rounded-b-[80px] border border-slate-100 shadow-md transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>

          {/* Right landscape stack images */}
          <div className="flex flex-col gap-4">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
              alt="Group of learners studying"
              className="w-48 h-32 md:w-52 md:h-36 object-cover rounded-[24px] border border-slate-100 shadow-md transition-transform duration-500 hover:scale-[1.02]"
            />
            <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=80"
              alt="Learner working from home"
              className="w-48 h-32 md:w-52 md:h-36 object-cover rounded-[24px] border border-slate-100 shadow-md transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 px-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
        <div className="space-y-1">
          <h3 className="text-3xl font-sans font-bold text-slate-800 tracking-tight">28.3 million</h3>
          <p className="text-[10px] font-sans font-medium text-slate-500 leading-normal">Students since our start in 1997</p>
        </div>
        <div className="space-y-1 border-l border-slate-200">
          <h3 className="text-3xl font-sans font-bold text-slate-800 tracking-tight">31,300</h3>
          <p className="text-[10px] font-sans font-medium text-slate-500 leading-normal">Educators around the world</p>
        </div>
        <div className="space-y-1 border-l border-slate-200">
          <h3 className="text-3xl font-sans font-bold text-slate-800 tracking-tight">12,200</h3>
          <p className="text-[10px] font-sans font-medium text-slate-500 leading-normal">Organizations offering our courses</p>
        </div>
        <div className="space-y-1 border-l border-slate-200 col-span-1">
          <h3 className="text-3xl font-sans font-bold text-slate-800 tracking-tight">195</h3>
          <p className="text-[10px] font-sans font-medium text-slate-500 leading-normal">Countries where we serve learners</p>
        </div>
        <div className="space-y-1 border-l border-slate-200 col-span-2 md:col-span-1">
          <h3 className="text-3xl font-sans font-bold text-slate-800 tracking-tight">97%</h3>
          <p className="text-[10px] font-sans font-medium text-slate-500 leading-normal">Students obtained a job or pathway</p>
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
          <h2 className="text-3xl font-display font-bold text-slate-900">Cisco & CyberAI Career Pathways</h2>
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

      {/* WHY CYBERAI ACADEMY */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-center text-slate-900">Why CyberAI Academy?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-accentPurple/10 flex items-center justify-center text-accentPurple">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">AI-Powered Tutoring</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Get 24/7 personalized assistance from our integrated AI copilot trained on official networking logs.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-accentCyan/10 flex items-center justify-center text-accentCyan">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Cisco NetAcad Integration</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Access official, industry-recognized networking and security curricula linked to live grade sync services.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-accentGreen/10 flex items-center justify-center text-accentGreen">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Verifiable Digital Credentials</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Earn cryptographically signed W3C Open Badges to showcase your skills on LinkedIn and Credly.
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
                        {course.provider === 'NetAcad' ? 'Cisco Networking Academy' : 'Python Institute'}
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

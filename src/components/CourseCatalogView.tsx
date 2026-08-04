import React, { useState, useMemo } from 'react';
import { Course, useAcademyStore } from '@/services/academyState';
import { Search, Filter, BookOpen, Clock, ShieldCheck, Cpu, Award, X, CheckCircle2, ChevronRight, Server, Shield, Cloud, Terminal, Code } from 'lucide-react';

interface CourseCatalogViewProps {
  onNavigateToTab: (tab: 'learning' | 'player' | 'tutor') => void;
  initialCategory?: string;
}

export default function CourseCatalogView({ onNavigateToTab, initialCategory = 'All' }: CourseCatalogViewProps) {
  const { courses, enrollInCourse } = useAcademyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = [
    { id: 'All', label: 'All Programs', icon: BookOpen },
    { id: 'Networking', label: 'Cisco Networking', icon: Server },
    { id: 'Cybersecurity', label: 'Cyber Security & CEH', icon: Shield },
    { id: 'Automation', label: 'AWS Cloud & DevOps', icon: Cloud },
    { id: 'Programming', label: 'Python & NetDevOps', icon: Code },
    { id: 'Operating Systems', label: 'RedHat Linux & Systems', icon: Terminal },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Category match
      const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
      
      // Difficulty match
      const difficultyMatch = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const searchMatch = !query || (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        (course.badgeName && course.badgeName.toLowerCase().includes(query)) ||
        (course.syllabusOutline && course.syllabusOutline.some(s => s.toLowerCase().includes(query)))
      );

      return categoryMatch && difficultyMatch && searchMatch;
    });
  }, [courses, selectedCategory, selectedDifficulty, searchQuery]);

  const handleEnrollAndLaunch = (course: Course) => {
    if (course.enrollmentStatus === 'not_enrolled') {
      enrollInCourse(course.id);
    }
    setSelectedCourse(null);
    onNavigateToTab('player');
  };

  return (
    <div className="space-y-10 py-6 text-slate-800 animate-fade-in">
      
      {/* PAGE HEADER */}
      <div className="nhiit-glass-dark rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl space-y-4">
        <div className="particle w-4 h-4 bg-white/20" style={{ top: '15%', left: '10%' }} />
        <div className="particle w-2 h-2 bg-white/30" style={{ top: '70%', right: '15%' }} />

        <div className="max-w-3xl space-y-3 relative z-10 text-left">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/20 text-accentCyan inline-block">
            ACADEMIC PROGRAMS & CERTIFICATIONS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Explore All Professional Courses
          </h1>
          <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed">
            Official Cisco Networking Academy, Red Hat Linux, AWS Cloud, DevOps, and Certified Ethical Hacker (CEH) certification tracks with 100% hands-on physical hardware lab access at Multan campus.
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="pt-4 grid sm:grid-cols-12 gap-4 relative z-10">
          <div className="sm:col-span-8 relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses (e.g. CCNA, RHCSA, AWS, CEH, Python, DevNet, Fortinet)..."
              className="w-full bg-white/95 border border-white/40 text-slate-900 placeholder:text-slate-500 rounded-2xl p-3.5 pl-11 text-xs focus:outline-none focus:ring-2 focus:ring-[#007A87] shadow-lg font-sans"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-white/95 border border-white/40 text-slate-900 rounded-2xl p-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007A87] shadow-lg cursor-pointer"
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner Level</option>
              <option value="Intermediate">Intermediate Level</option>
              <option value="Advanced">Advanced Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOMAIN CATEGORY TABS */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-[#002D62] to-[#007A87] text-white shadow-lg scale-105' 
                  : 'nhiit-glass-card text-slate-700 hover:text-slate-950'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-accentCyan' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* RESULTS COUNT & ACTIVE FILTER CHIPS */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-2">
        <span className="font-semibold">
          Showing <span className="font-bold text-[#002D62]">{filteredCourses.length}</span> Course Programs
        </span>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#007A87] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear search filter
          </button>
        )}
      </div>

      {/* COURSES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
        {filteredCourses.map((course, idx) => {
          const difficultyColor = course.difficulty === 'Beginner' ? 'bg-emerald-500' : course.difficulty === 'Intermediate' ? 'bg-[#007A87]' : 'bg-amber-500';
          
          return (
            <div 
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="nhiit-glass-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between animate-slide-up"
              style={{ animationDelay: `${(idx % 6) * 0.06}s` }}
            >
              <div>
                {/* Thumbnail Header Image */}
                <div 
                  className="h-44 bg-cover bg-center p-4 flex justify-between items-start relative overflow-hidden"
                  style={{ backgroundImage: `url(${course.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />
                  
                  <span className={`relative z-10 px-3 py-1 rounded-lg text-[9px] font-extrabold text-white font-sans tracking-wider uppercase ${difficultyColor} shadow-md`}>
                    {course.difficulty}
                  </span>

                  <span className="relative z-10 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold bg-white/90 text-slate-800 shadow-sm backdrop-blur-md">
                    {course.provider === 'NetAcad' ? 'NetAcad Official' : 'Hybrid Lab'}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3 text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    <span>{course.category}</span>
                    <span>{course.modulesCount} Modules</span>
                  </div>

                  <h3 className="text-lg font-display font-extrabold text-slate-900 leading-snug group-hover:text-[#007A87] transition-colors duration-300 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-slate-100/80 mt-auto text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#007A87]" />
                  <span>{course.duration}</span>
                </div>
                <div className="text-accentGreen font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Syllabus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="nhiit-glass-card rounded-3xl p-12 text-center space-y-3 text-slate-600">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No matching programs found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or category filters.</p>
          <button 
            onClick={() => { setSelectedCategory('All'); setSelectedDifficulty('All'); setSearchQuery(''); }}
            className="cyber-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-block"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* DETAILED COURSE MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl text-slate-850 animate-slide-up text-left">
            
            <button 
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-accentCyan/10 text-accentCyan">
                {selectedCourse.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold border border-accentGreen bg-accentGreen/5 text-accentGreen">
                {selectedCourse.provider} Provider
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                {selectedCourse.difficulty}
              </span>
            </div>

            <h3 className="text-2xl font-display font-extrabold text-slate-900">{selectedCourse.title}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{selectedCourse.description}</p>
            
            <div className="grid grid-cols-3 gap-4 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] block font-mono text-slate-500 uppercase">Total Duration</span>
                <span className="font-bold text-slate-900">{selectedCourse.duration}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] block font-mono text-slate-500 uppercase">Chapters / Labs</span>
                <span className="font-bold text-slate-900">{selectedCourse.modulesCount} Chapters</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] block font-mono text-slate-500 uppercase">Aligned Credential</span>
                <span className="font-bold text-accentGreen truncate block">{selectedCourse.badgeName || 'W3C Open Badge'}</span>
              </div>
            </div>

            {/* Detailed Course Syllabus Outline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center justify-between">
                <span>Detailed Syllabus & Lab Outline</span>
                <span className="text-[10px] text-accentCyan font-normal">Physical Racks + Cloud Lab</span>
              </h4>
              
              <div className="max-h-[200px] overflow-y-auto border border-slate-200/80 rounded-2xl divide-y divide-slate-100 bg-slate-50/50">
                {selectedCourse.syllabusOutline && selectedCourse.syllabusOutline.map((chapter, index) => (
                  <div key={index} className="p-3 text-xs text-slate-700 flex items-start gap-2.5 hover:bg-slate-100/60 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[#007A87] shrink-0 mt-0.5" />
                    <span className="leading-snug">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleEnrollAndLaunch(selectedCourse)}
              className="w-full cyber-btn py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              {selectedCourse.enrollmentStatus === 'not_enrolled' ? 'Confirm Free Enrollment & Launch LMS' : 'Resume Course in LMS'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

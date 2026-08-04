import React, { useState, useEffect } from 'react';
import ExploreView from '@/components/ExploreView';
import DashboardView from '@/components/DashboardView';
import LmsView from '@/components/LmsView';
import MentorView from '@/components/MentorView';
import BadgesView from '@/components/BadgesView';
import AdminView from '@/components/AdminView';
import AdmissionModal from '@/components/AdmissionModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { Shield, BookOpen, User, Cpu, ExternalLink, Menu, X, Search, Globe, Bell, HelpCircle, Grid, ChevronDown, MapPin, Phone } from 'lucide-react';
import { useAcademyStore } from '@/services/academyState';

export default function App() {
  const { profile } = useAcademyStore();
  const [activeTab, setActiveTab] = useState<'explore' | 'learning' | 'player' | 'tutor' | 'badges' | 'admin'>('explore');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDowntime, setShowDowntime] = useState(true);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);

  // Sync tab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['explore', 'learning', 'player', 'tutor', 'badges', 'admin'].includes(hash)) {
        setActiveTab(hash as any);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on init

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetTab = (tab: 'explore' | 'learning' | 'player' | 'tutor' | 'badges' | 'admin') => {
    setActiveTab(tab);
    window.location.hash = tab;
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between selection:bg-accentCyan/20">
      
      {/* 1. TOP MULTAN CAMPUS CONTACT BAR */}
      <div className="bg-[#002D62] text-white py-2 px-4 text-xs font-sans relative z-50 transition-all flex flex-col md:flex-row items-center justify-between gap-2 shadow-inner border-b border-white/10">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-1.5 text-accentCyan">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-slate-200">311-B Bosan Road, Opp. PTCL Exchange, Gulgasht Colony, Multan</span>
          </div>
          <div className="flex items-center gap-1.5 text-accentGreen">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono text-slate-200">0334-8632929 | 0333-7077776</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdmissionOpen(true)}
            className="bg-[#007A87] hover:bg-[#005073] text-white px-3 py-1 rounded text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
          >
            🎓 Admissions Open - Apply Now
          </button>
        </div>
      </div>

      {/* 2. OFFICIAL CISCO NETACAD HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-250 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo: Cisco style */}
          <div 
            onClick={() => handleSetTab('explore')}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <div className="flex flex-col text-slate-900 leading-none">
              <span className="font-sans font-extrabold text-sm tracking-wider text-[#005073]">Network Home</span>
              <span className="font-sans font-bold text-xs text-[#007A87]">Institute of Information Technology</span>
            </div>
          </div>

          {/* Explore dropdown button */}
          <button 
            onClick={() => handleSetTab('explore')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 bg-slate-50 transition-all"
          >
            <Grid className="w-3.5 h-3.5" /> Explore
          </button>

          {/* Center Search Input Box */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative">
            <input 
              type="text"
              placeholder="Search for courses, articles and resources"
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-accentCyan focus:bg-white text-slate-700"
            />
            <Search className="w-3.5 h-3.5 text-slate-450 absolute left-2.5" />
            <div className="absolute right-2.5 flex items-center gap-0.5 border-l border-slate-300 pl-2 text-[10px] font-semibold text-slate-500 cursor-pointer hover:text-slate-800">
              Learner <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Navigation links & tabs */}
          <nav className="hidden xl:flex items-center gap-0.5">
            <button 
              onClick={() => handleSetTab('explore')}
              className={`px-3 py-2 text-xs font-semibold rounded transition-all ${
                activeTab === 'explore' 
                  ? 'text-accentCyan border-b-2 border-accentCyan font-bold' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Explore Catalog
            </button>
            <button 
              onClick={() => handleSetTab('learning')}
              className={`px-3 py-2 text-xs font-semibold rounded transition-all ${
                activeTab === 'learning' 
                  ? 'text-accentCyan border-b-2 border-accentCyan font-bold' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              My Learning
            </button>
            <button 
              onClick={() => handleSetTab('player')}
              className={`px-3 py-2 text-xs font-semibold rounded transition-all ${
                activeTab === 'player' 
                  ? 'text-accentCyan border-b-2 border-accentCyan font-bold' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Course Player
            </button>
            <button 
              onClick={() => handleSetTab('tutor')}
              className={`px-3 py-2 text-xs font-semibold rounded transition-all ${
                activeTab === 'tutor' 
                  ? 'text-accentCyan border-b-2 border-accentCyan font-bold' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              AI Tutor
            </button>
            <button 
              onClick={() => handleSetTab('badges')}
              className={`px-3 py-2 text-xs font-semibold rounded transition-all ${
                activeTab === 'badges' 
                  ? 'text-accentCyan border-b-2 border-accentCyan font-bold' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Credentials
            </button>
            <button 
              onClick={() => handleSetTab('admin')}
              className={`px-3 py-2 text-xs font-semibold rounded transition-all ${
                activeTab === 'admin' 
                  ? 'text-accentCyan border-b-2 border-accentCyan font-bold' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Admin Panel
            </button>
          </nav>

          {/* Right Action icons & buttons */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <span className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">Teach</span>
            <span className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">Partner</span>
            <div className="w-px bg-slate-300 h-4" />
            
            <Globe className="w-4 h-4 text-slate-500 hover:text-slate-800 cursor-pointer" />
            <span className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer font-mono">EN</span>
            <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-800 cursor-pointer" />
            <Bell className="w-4 h-4 text-slate-500 hover:text-slate-800 cursor-pointer" />
            
            <button 
              onClick={() => handleSetTab('learning')}
              className="px-4 py-1.5 rounded border border-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer bg-white"
            >
              Login
            </button>
            <button 
              onClick={() => handleSetTab('explore')}
              className="px-4 py-1.5 rounded bg-[#72B13B] hover:bg-[#609A2E] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Sign up
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="xl:hidden flex items-center gap-2">
            {/* Minimal search trigger */}
            <button onClick={() => handleSetTab('explore')} className="p-1.5 text-slate-500 hover:text-slate-800 md:hidden">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-950 p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white p-4 space-y-2.5 shadow-lg">
            <button 
              onClick={() => handleSetTab('explore')}
              className={`w-full text-left px-4 py-2 rounded text-xs font-semibold ${
                activeTab === 'explore' ? 'bg-accentCyan/10 text-accentCyan font-bold' : 'text-slate-650'
              }`}
            >
              Explore Catalog
            </button>
            <button 
              onClick={() => handleSetTab('learning')}
              className={`w-full text-left px-4 py-2 rounded text-xs font-semibold ${
                activeTab === 'learning' ? 'bg-accentCyan/10 text-accentCyan font-bold' : 'text-slate-650'
              }`}
            >
              My Learning
            </button>
            <button 
              onClick={() => handleSetTab('player')}
              className={`w-full text-left px-4 py-2 rounded text-xs font-semibold ${
                activeTab === 'player' ? 'bg-accentCyan/10 text-accentCyan font-bold' : 'text-slate-650'
              }`}
            >
              Course Player
            </button>
            <button 
              onClick={() => handleSetTab('tutor')}
              className={`w-full text-left px-4 py-2 rounded text-xs font-semibold ${
                activeTab === 'tutor' ? 'bg-accentCyan/10 text-accentCyan font-bold' : 'text-slate-650'
              }`}
            >
              AI Tutor
            </button>
            <button 
              onClick={() => handleSetTab('badges')}
              className={`w-full text-left px-4 py-2 rounded text-xs font-semibold ${
                activeTab === 'badges' ? 'bg-accentCyan/10 text-accentCyan font-bold' : 'text-slate-650'
              }`}
            >
              Credentials
            </button>
            <button 
              onClick={() => handleSetTab('admin')}
              className={`w-full text-left px-4 py-2 rounded text-xs font-semibold ${
                activeTab === 'admin' ? 'bg-accentCyan/10 text-accentCyan font-bold' : 'text-slate-650'
              }`}
            >
              Admin Panel
            </button>
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between px-4 text-xs">
              <a 
                href="https://netacad.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                NetAcad <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button className="px-4 py-1.5 rounded border border-slate-800 text-slate-800 text-xs font-semibold bg-white">
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT WORKSPACE VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'explore' && <ExploreView onNavigateToTab={handleSetTab} />}
        {activeTab === 'learning' && <DashboardView />}
        {activeTab === 'player' && <LmsView />}
        {activeTab === 'tutor' && <MentorView />}
        {activeTab === 'badges' && <BadgesView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* FOOTER AREA */}
      <footer className="border-t border-slate-200/80 bg-slate-50 py-8 mt-16 text-center text-xs text-textSecondary">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2 font-display font-bold text-slate-800">
            <Shield className="w-4 h-4 text-accentCyan" /> Network Home Institute of Information Technology
          </div>
          <p>© 2026 Network Home Institute of Information Technology. All Rights Reserved.</p>
        </div>
      </footer>

      {/* ADMISSION INQUIRY MODAL */}
      <AdmissionModal isOpen={isAdmissionOpen} onClose={() => setIsAdmissionOpen(false)} />

      {/* FLOATING WHATSAPP CHAT SUPPORT */}
      <WhatsAppWidget />

    </div>
  );
}

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

      {/* 2. OFFICIAL NETWORK HOME HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleSetTab('explore')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#002D62] to-[#007A87] text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
              NH
            </div>
            <div className="flex flex-col text-slate-900 leading-none">
              <span className="font-sans font-extrabold text-sm tracking-wide text-[#002D62]">Network Home</span>
              <span className="font-sans font-semibold text-[10px] text-[#007A87] tracking-tight">Institute of IT • Multan</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button 
              onClick={() => handleSetTab('explore')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'explore' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Programs
            </button>
            <button 
              onClick={() => handleSetTab('learning')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'learning' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Dashboard
            </button>
            <button 
              onClick={() => handleSetTab('player')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'player' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#007A87]" /> LMS Player
            </button>
            <button 
              onClick={() => handleSetTab('tutor')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'tutor' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-accentPurple" /> AI Tutor
            </button>
            <button 
              onClick={() => handleSetTab('badges')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'badges' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-accentGreen" /> Credentials
            </button>
            <button 
              onClick={() => handleSetTab('admin')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'admin' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Admin
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => setIsAdmissionOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#007A87] hover:bg-[#005073] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
            >
              Inquire Admission
            </button>
            <button 
              onClick={() => handleSetTab('learning')}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer bg-white"
            >
              Student Portal
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-950 p-2 rounded-lg bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 shadow-xl animate-fade-in">
            <button 
              onClick={() => handleSetTab('explore')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'explore' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Programs Catalog
            </button>
            <button 
              onClick={() => handleSetTab('learning')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'learning' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" /> Student Dashboard
            </button>
            <button 
              onClick={() => handleSetTab('player')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'player' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Cpu className="w-4 h-4 text-[#007A87]" /> LMS Code Player
            </button>
            <button 
              onClick={() => handleSetTab('tutor')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'tutor' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-accentPurple" /> AI Tutor
            </button>
            <button 
              onClick={() => handleSetTab('badges')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'badges' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-accentGreen" /> Credentials Locker
            </button>
            <button 
              onClick={() => handleSetTab('admin')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'admin' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Admin Console
            </button>
            
            <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdmissionOpen(true);
                }}
                className="w-full py-2.5 rounded-lg bg-[#007A87] text-white text-xs font-bold text-center shadow-sm"
              >
                🎓 Apply For Admission (Multan)
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

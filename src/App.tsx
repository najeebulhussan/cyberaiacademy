import React, { useState, useEffect } from 'react';
import Home2View from '@/components/Home2View';
import CourseCatalogView from '@/components/CourseCatalogView';
import AboutUsView from '@/components/AboutUsView';
import AdmissionsView from '@/components/AdmissionsView';
import ContactView from '@/components/ContactView';
import DashboardView from '@/components/DashboardView';
import LmsView from '@/components/LmsView';
import MentorView from '@/components/MentorView';
import BadgesView from '@/components/BadgesView';
import AdminView from '@/components/AdminView';
import AdmissionModal from '@/components/AdmissionModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import AdminAuthModal from '@/components/AdminAuthModal';
import CertificateVerifierModal from '@/components/CertificateVerifierModal';
import { Shield, BookOpen, User, Cpu, ExternalLink, Menu, X, Search, Globe, Bell, HelpCircle, Grid, ChevronDown, MapPin, Phone, Lock, ShieldCheck, Layers, Info, Calendar, Mail, Sparkles } from 'lucide-react';
import { useAcademyStore } from '@/services/academyState';

export default function App() {
  const { profile } = useAcademyStore();
  const [activeTab, setActiveTab] = useState<'explore' | 'home2' | 'programs' | 'about' | 'admissions' | 'contact' | 'learning' | 'player' | 'tutor' | 'badges' | 'admin'>('home2');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'theme2' | 'theme1'>('theme2');

  // Sync tab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['explore', 'home2', 'programs', 'about', 'admissions', 'contact', 'learning', 'player', 'tutor', 'badges', 'admin'].includes(hash)) {
        setActiveTab(hash as any);
      } else if (!hash) {
        setActiveTab('home2');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on init

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetTab = (tab: 'explore' | 'home2' | 'programs' | 'about' | 'admissions' | 'contact' | 'learning' | 'player' | 'tutor' | 'badges' | 'admin') => {
    if (tab === 'admin' && !isAdminAuthenticated) {
      setIsAdminAuthOpen(true);
      return;
    }
    setActiveTab(tab);
    window.location.hash = tab;
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-accentCyan/20 transition-colors duration-300 ${activeTheme === 'theme2' ? 'bg-white text-slate-800' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* 1. TOP MULTAN CAMPUS CONTACT BAR */}
      <div className="bg-[#002D62] text-white py-2 px-4 text-xs font-sans relative z-50 transition-all flex flex-col md:flex-row items-center justify-between gap-2 shadow-inner border-b border-white/10">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-1.5 text-accentCyan">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-slate-200">311-B Bosan Road, Opp. PTCL Exchange, Gulgasht Colony, Multan</span>
          </div>
          <div className="flex items-center gap-1.5 text-accentGreen">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono text-slate-200">+92-333-3017333</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTheme(activeTheme === 'theme2' ? 'theme1' : 'theme2')}
            className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer border border-white/20"
            title="Toggle between Theme 2 (Executive Light) & Theme 1 (Classic Dark)"
          >
            🎨 {activeTheme === 'theme2' ? 'Theme 2 (Light)' : 'Theme 1 (Dark)'}
          </button>
          <button 
            onClick={() => setIsAdmissionOpen(true)}
            className="bg-[#007A87] hover:bg-[#005073] text-white px-3 py-1 rounded text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
          >
            🎓 Admissions Open - Apply Now
          </button>
        </div>
      </div>

      {/* 2. OFFICIAL NETWORK HOME HEADER NAVBAR (GLOSSY GLASS) */}
      <header className={`sticky top-0 z-40 w-full transition-all ${activeTheme === 'theme2' ? 'glass-nav' : 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo with 3D Glass Badge */}
          <div 
            onClick={() => handleSetTab('home2')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            <div className="nhiit-logo-badge p-1 rounded-xl bg-gradient-to-br from-white/80 via-blue-50/50 to-white/30 backdrop-blur-md border border-white/80 shadow-md">
              <img 
                src="/logo.png" 
                alt="NHIIT Logo" 
                className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
            </div>
            <div className={`flex flex-col leading-none ${activeTheme === 'theme2' ? 'text-slate-900' : 'text-white'}`}>
              <span className="font-sans font-extrabold text-sm tracking-wide text-[#002D62] group-hover:text-[#007A87] transition-colors">Network Home</span>
              <span className="font-sans font-semibold text-[10px] text-[#007A87] tracking-tight">Institute of IT • Multan</span>
            </div>
          </div>

          {/* Desktop Navigation Links (Home 2 is default Home, Main Home 1 is hidden) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button 
              onClick={() => handleSetTab('home2')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'home2' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : activeTheme === 'theme2' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#007A87]" /> Home
            </button>
            <button 
              onClick={() => handleSetTab('programs')}
              className={`px-2.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'programs' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : activeTheme === 'theme2' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#007A87]" /> Courses & Programs
            </button>
            <button 
              onClick={() => handleSetTab('admissions')}
              className={`px-2.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'admissions' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : activeTheme === 'theme2' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-accentGreen" /> Admissions
            </button>
            <button 
              onClick={() => handleSetTab('about')}
              className={`px-2.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'about' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : activeTheme === 'theme2' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-[#002D62]" /> About Us
            </button>
            <button 
              onClick={() => handleSetTab('contact')}
              className={`px-2.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'contact' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : activeTheme === 'theme2' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-600" /> Contact
            </button>
            <button 
              onClick={() => handleSetTab('player')}
              className={`px-2.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'player' 
                  ? 'text-[#005073] bg-[#005073]/10 font-bold' 
                  : activeTheme === 'theme2' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#007A87]" /> LMS Player
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
              onClick={() => handleSetTab('home2')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'home2' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={() => handleSetTab('programs')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'programs' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-[#007A87]" /> Courses & Programs
            </button>
            <button 
              onClick={() => handleSetTab('admissions')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'admissions' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-accentGreen" /> Admissions
            </button>
            <button 
              onClick={() => handleSetTab('about')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'about' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Info className="w-4 h-4 text-[#002D62]" /> About Us
            </button>
            <button 
              onClick={() => handleSetTab('contact')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                activeTab === 'contact' ? 'bg-[#005073]/10 text-[#005073]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Mail className="w-4 h-4 text-amber-600" /> Contact
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
        {activeTab === 'home2' && <Home2View onNavigateToTab={handleSetTab} />}
        {activeTab === 'explore' && <Home2View onNavigateToTab={handleSetTab} />}
        {activeTab === 'programs' && <CourseCatalogView onNavigateToTab={handleSetTab} />}
        {activeTab === 'about' && <AboutUsView />}
        {activeTab === 'admissions' && <AdmissionsView />}
        {activeTab === 'contact' && <ContactView />}
        {activeTab === 'learning' && <DashboardView />}
        {activeTab === 'player' && <LmsView />}
        {activeTab === 'tutor' && <MentorView />}
        {activeTab === 'badges' && <BadgesView />}
        {activeTab === 'admin' && (isAdminAuthenticated ? <AdminView /> : <Home2View onNavigateToTab={handleSetTab} />)}
      </main>

      {/* FOOTER AREA */}
      <footer className="border-t border-slate-200/80 bg-slate-50 py-8 mt-16 text-center text-xs text-textSecondary">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2 font-display font-bold text-slate-800">
            <Shield className="w-4 h-4 text-accentCyan" /> Network Home Institute of Information Technology
          </div>
          <p>© 2026 Network Home Institute of Information Technology. All Rights Reserved.</p>
          
          <div className="flex items-center justify-center gap-4 text-[10px] pt-2">
            <button 
              onClick={() => setIsVerifierOpen(true)} 
              className="text-[#007A87] hover:text-[#005073] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Verify Student Certificate
            </button>
            <span className="text-slate-300">•</span>
            <button 
              onClick={() => handleSetTab('admin')} 
              className="text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Lock className="w-3 h-3" /> Staff Portal
            </button>
          </div>
        </div>
      </footer>

      {/* ADMISSION INQUIRY MODAL */}
      <AdmissionModal isOpen={isAdmissionOpen} onClose={() => setIsAdmissionOpen(false)} />

      {/* PUBLIC CERTIFICATE VERIFIER MODAL */}
      <CertificateVerifierModal isOpen={isVerifierOpen} onClose={() => setIsVerifierOpen(false)} />

      {/* ADMIN AUTHENTICATION LOCK MODAL */}
      <AdminAuthModal 
        isOpen={isAdminAuthOpen} 
        onClose={() => setIsAdminAuthOpen(false)} 
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminAuthenticated(true);
          setActiveTab('admin');
          window.location.hash = 'admin';
        }} 
      />

      {/* FLOATING WHATSAPP CHAT SUPPORT */}
      <WhatsAppWidget />

    </div>
  );
}

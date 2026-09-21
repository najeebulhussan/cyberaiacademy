import React, { useState, useMemo, useRef } from 'react';
import { useAcademyStore, Course, Pathway } from '@/services/academyState';
import { 
  Settings, Shield, Plus, Edit2, Trash2, Copy, Database, Terminal, RefreshCw, 
  CheckCircle, Info, Search, Image as ImageIcon, Upload, Download, Globe, Lock, 
  KeyRound, Sparkles, ExternalLink, Eye, BookOpen, Layers, AlertCircle, X, 
  ChevronDown, LogOut, Check, ArrowRight, Clock, Award, ShieldCheck, Filter
} from 'lucide-react';

// Preset NetAcad Official Thumbnails Gallery
const NETACAD_THUMBNAIL_PRESETS = [
  { label: 'CCNA: Intro to Networks (ITN)', path: '/netacad-thumbnails/ccna-itn.png', category: 'Networking' },
  { label: 'CCNA: Switching & Routing (SRWE)', path: '/netacad-thumbnails/ccna-srwe.png', category: 'Networking' },
  { label: 'CCNA: Enterprise Automation (ENSA)', path: '/netacad-thumbnails/ccna-ensa.png', category: 'Networking' },
  { label: 'Networking Essentials', path: '/netacad-thumbnails/networking-essentials.png', category: 'Networking' },
  { label: 'CCST Networking', path: '/netacad-thumbnails/ccst-networking.png', category: 'Networking' },
  { label: 'CCNP Enterprise ENCOR', path: '/netacad-thumbnails/ccnp-enterprise.png', category: 'Networking' },
  { label: 'CCNP Advanced Routing ENARSI', path: '/netacad-thumbnails/ccnp-advanced-routing.png', category: 'Networking' },
  { label: 'Introduction to Cybersecurity', path: '/netacad-thumbnails/intro-cyber.png', category: 'Cybersecurity' },
  { label: 'Cybersecurity Essentials', path: '/netacad-thumbnails/cybersecurity-essentials.png', category: 'Cybersecurity' },
  { label: 'CCST Cybersecurity / Endpoint', path: '/netacad-thumbnails/endpoint-security.png', category: 'Cybersecurity' },
  { label: 'Cisco CyberOps Associate', path: '/netacad-thumbnails/cyberops.png', category: 'Cybersecurity' },
  { label: 'Network Defense', path: '/netacad-thumbnails/network-defense.png', category: 'Cybersecurity' },
  { label: 'Network Security', path: '/netacad-thumbnails/network-security.png', category: 'Cybersecurity' },
  { label: 'Ethical Hacker (CEH v12)', path: '/netacad-thumbnails/ethical-hacker.png', category: 'Cybersecurity' },
  { label: 'Fortinet FortiGate (NSE 4)', path: '/netacad-thumbnails/cyber-threat-management.png', category: 'Cybersecurity' },
  { label: 'Industrial Cybersecurity', path: '/netacad-thumbnails/industrial-cybersecurity.png', category: 'Cybersecurity' },
  { label: 'Security Operations & SOC', path: '/netacad-thumbnails/security-operations.png', category: 'Cybersecurity' },
  { label: 'Introduction to Splunk', path: '/netacad-thumbnails/splunk-intro.png', category: 'Cybersecurity' },
  { label: 'Python Essentials 1', path: '/netacad-thumbnails/python-essentials-1.jpg', category: 'Programming' },
  { label: 'Python Essentials 2', path: '/netacad-thumbnails/python-essentials-2.jpg', category: 'Programming' },
  { label: 'JavaScript Essentials 1', path: '/netacad-thumbnails/javascript-essentials.jpg', category: 'Programming' },
  { label: 'Cisco DevNet Associate', path: '/netacad-thumbnails/devnet.png', category: 'Automation' },
  { label: 'Network Automation with Ansible', path: '/netacad-thumbnails/network-automation.png', category: 'Automation' },
  { label: 'AWS Solutions Architect (SAA-C03)', path: '/netacad-thumbnails/aws-cloud.png', category: 'Automation' },
  { label: 'Enterprise DevOps Track', path: '/netacad-thumbnails/cloud-devops.jpg', category: 'Automation' },
  { label: 'Introduction to IoT', path: '/netacad-thumbnails/intro-iot.png', category: 'IoT & Analytics' },
  { label: 'Data Analytics Essentials', path: '/netacad-thumbnails/data-analytics.png', category: 'IoT & Analytics' },
  { label: 'NDG Linux Essentials', path: '/netacad-thumbnails/linux-essentials.jpg', category: 'Operating Systems' },
  { label: 'IT Essentials Hardware/Software', path: '/netacad-thumbnails/it-essentials.jpg', category: 'Operating Systems' },
  { label: 'RedHat RHCSA Linux Admin', path: '/netacad-thumbnails/rhcsa-linux.png', category: 'Operating Systems' },
  { label: 'Cyber Smart AI Security', path: '/cybersmart-course/assets/img/hero.webp', category: 'Cybersecurity' },
];

interface AdminViewProps {
  onLogout?: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export default function AdminView({ onLogout, onNavigateToTab }: AdminViewProps) {
  const { 
    courses, 
    pathways, 
    profile, 
    apiLogs, 
    addCourse, 
    editCourse, 
    deleteCourse, 
    duplicateCourse,
    importCourses,
    addPathway, 
    deletePathway, 
    updateProfile, 
    resetDatabase,
    getAdminPasscode,
    setAdminPasscode,
  } = useAcademyStore();

  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'pathways' | 'profile' | 'security' | 'api' | 'sheets'>('courses');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Course Search & Filter State ---
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');

  // --- Google Sheets Webhook State ---
  const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx_jnSxJ5VldKya0WsTDG8woz0dgJh3ORBQOIxJWy2oU5WOARUwtTUTVO0U09m4pou5/exec';
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState(() => localStorage.getItem('cybersmart_google_sheet_webhook') || DEFAULT_WEBHOOK_URL);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testWebhookResult, setTestWebhookResult] = useState<string | null>(null);

  // --- Course Form State ---
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('Networking');
  const [courseProvider, setCourseProvider] = useState<Course['provider']>('NetAcad');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDiff, setCourseDiff] = useState<Course['difficulty']>('Beginner');
  const [courseDur, setCourseDur] = useState('17 hours');
  const [courseImageUrl, setCourseImageUrl] = useState('/netacad-thumbnails/ccna-itn.png');
  const [courseDeliveryMode, setCourseDeliveryMode] = useState<Course['deliveryMode']>('Online & On-Campus');
  const [courseBadge, setCourseBadge] = useState('');
  const [courseOutlineRaw, setCourseOutlineRaw] = useState(
    "Chapter 1: Networking Today & Global Connections\nChapter 2: Basic Switch and End Device Configuration\nChapter 3: Protocols and Communication Models\nChapter 4: Physical Layer & Network Media\nChapter 5: Final Hands-On Verification Lab"
  );
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  // --- Security / Passcode State ---
  const [currentPin, setCurrentPin] = useState(getAdminPasscode());
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- Pathway Form State ---
  const [pathTitle, setPathTitle] = useState('');
  const [pathCareer, setPathCareer] = useState('');
  const [pathSalary, setPathSalary] = useState('PKR 250,000/mo');
  const [pathCert, setPathCert] = useState('');
  const [pathDesc, setPathDesc] = useState('');
  const [pathSelectedCourses, setPathSelectedCourses] = useState<string[]>([]);

  // --- Profile Form State ---
  const [profileName, setProfileName] = useState(profile.name);
  const [profileRank, setProfileRank] = useState(profile.rank);
  const [profileXp, setProfileXp] = useState(profile.xp);
  const [profileHours, setProfileHours] = useState(profile.studyHours);

  // --- Notification Toast ---
  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // --- Filtered Courses ---
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchCat = filterCategory === 'All' || c.category === filterCategory;
      const q = courseSearchQuery.toLowerCase().trim();
      const matchQuery = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [courses, filterCategory, courseSearchQuery]);

  // --- Save / Create Course ---
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim()) {
      alert("Please fill in Course Title and Description.");
      return;
    }

    const syllabusOutline = courseOutlineRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (editingCourseId) {
      editCourse(editingCourseId, {
        title: courseTitle.trim(),
        category: courseCategory,
        provider: courseProvider,
        description: courseDesc.trim(),
        difficulty: courseDiff,
        duration: courseDur.trim(),
        imageUrl: courseImageUrl.trim() || '/netacad-thumbnails/ccna-itn.png',
        deliveryMode: courseDeliveryMode || 'Online & On-Campus',
        modulesCount: syllabusOutline.length,
        badgeName: courseBadge.trim() || undefined,
        syllabusOutline,
      });
      triggerNotification(`✅ Course "${courseTitle.trim()}" updated successfully!`);
      setEditingCourseId(null);
    } else {
      const generatedId = `course-${Date.now()}`;
      const newCourse: Course = {
        id: generatedId,
        title: courseTitle.trim(),
        category: courseCategory,
        provider: courseProvider,
        description: courseDesc.trim(),
        difficulty: courseDiff,
        duration: courseDur.trim() || '15 hours',
        imageUrl: courseImageUrl.trim() || '/netacad-thumbnails/ccna-itn.png',
        deliveryMode: courseDeliveryMode || 'Online & On-Campus',
        modulesCount: syllabusOutline.length,
        badgeName: courseBadge.trim() || undefined,
        badgeColor: '#00F2FE',
        enrollmentStatus: 'not_enrolled',
        progress: 0,
        syllabusOutline,
      };
      addCourse(newCourse);
      triggerNotification(`🎉 New course "${courseTitle.trim()}" published to catalog!`);
    }

    // Reset form to clean default
    handleResetForm();
  };

  const handleResetForm = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseDesc('');
    setCourseBadge('');
    setCourseDur('17 hours');
    setCourseCategory('Networking');
    setCourseProvider('NetAcad');
    setCourseDiff('Beginner');
    setCourseDeliveryMode('Online & On-Campus');
    setCourseImageUrl('/netacad-thumbnails/ccna-itn.png');
    setCourseOutlineRaw("Chapter 1: Welcome & Course Overview\nChapter 2: Core Concepts & Principles\nChapter 3: Interactive Configuration Labs\nChapter 4: Final Certification Examination");
  };

  const handleEditInit = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseCategory(course.category);
    setCourseProvider(course.provider);
    setCourseDesc(course.description);
    setCourseDiff(course.difficulty);
    setCourseDur(course.duration);
    setCourseImageUrl(course.imageUrl || '/netacad-thumbnails/ccna-itn.png');
    setCourseDeliveryMode(course.deliveryMode || 'Online & On-Campus');
    setCourseBadge(course.badgeName || '');
    setCourseOutlineRaw(course.syllabusOutline.join('\n'));
    setActiveSubTab('courses');
    
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDuplicate = (course: Course) => {
    const cloned = duplicateCourse(course.id);
    if (cloned) {
      triggerNotification(`📋 Duplicated "${course.title}" as a new course template!`);
      handleEditInit(cloned);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size is large. Recommended size under 2MB for fast loading.");
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCourseImageUrl(event.target.result as string);
          triggerNotification("Image uploaded and loaded into preview!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- JSON Export / Import ---
  const handleExportCatalog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cyberai_courses_catalog_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification("📥 Course catalog exported to JSON file!");
  };

  const handleImportCatalog = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            importCourses(parsed);
            triggerNotification(`🎉 Successfully imported ${parsed.length} courses!`);
          } else {
            alert("Invalid JSON format. Expected an array of courses.");
          }
        } catch (err: any) {
          alert(`Failed to parse JSON file: ${err.message}`);
        }
      };
      reader.readAsText(file);
    }
  };

  // --- Password Management ---
  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);
    if (!newPin.trim()) {
      setPinChangeMsg({ type: 'error', text: 'Please enter a new passcode.' });
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setPinChangeMsg({ type: 'error', text: 'New Passcode and Confirmation do not match.' });
      return;
    }
    setAdminPasscode(newPin.trim());
    setCurrentPin(newPin.trim());
    setNewPin('');
    setConfirmPin('');
    setPinChangeMsg({ type: 'success', text: 'Admin passcode updated successfully!' });
    triggerNotification("🔒 Administrator Passcode changed!");
  };

  const handleLogout = () => {
    localStorage.removeItem('cyberai_admin_session');
    sessionStorage.removeItem('cyberai_admin_session');
    if (onLogout) {
      onLogout();
    } else if (onNavigateToTab) {
      onNavigateToTab('home2');
    } else {
      window.location.reload();
    }
  };

  // --- Google Sheets Webhook Handlers ---
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cybersmart_google_sheet_webhook', sheetWebhookUrl.trim());
    triggerNotification("Google Sheets Webhook URL saved successfully!");
  };

  const handleTestWebhook = async () => {
    if (!sheetWebhookUrl.trim()) {
      setTestWebhookResult("⚠️ Please enter a Webhook URL first.");
      return;
    }
    setIsTestingWebhook(true);
    setTestWebhookResult(null);
    try {
      await fetch(sheetWebhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: 'Cyber Smart: AI-Powered Digital World',
          event: 'ADMIN_TEST_CONNECTION',
          name: 'Administrator',
          phone: '+92-333-3017333',
          email: 'admin@cyberaiacademy.com',
          progress: '100% (Admin Test)',
          score: '100%',
          status: 'Connection Verified',
          timestamp: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
          action: 'Webhook connection ping from CyberAI Admin Portal'
        })
      });
      setTestWebhookResult("✅ Test row sent to your Google Sheet! Check your spreadsheet.");
    } catch (err: any) {
      setTestWebhookResult(`❌ Error testing webhook: ${err.message || 'Check URL'}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  // --- Pathway Handlers ---
  const handleSavePathway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathTitle.trim() || !pathCareer.trim() || pathSelectedCourses.length === 0) {
      alert("Please enter title, career, and select at least one course.");
      return;
    }

    const newPath: Pathway = {
      id: `pathway-${Date.now()}`,
      title: pathTitle.trim(),
      career: pathCareer.trim(),
      salary: pathSalary.trim(),
      certifications: pathCert.trim() || 'Cisco & Corvit Verifiable Certifications',
      courseIds: pathSelectedCourses,
      color: '#007A87',
      description: pathDesc.trim(),
      longDesc: pathDesc.trim(),
    };

    addPathway(newPath);
    triggerNotification("Career Pathway created successfully!");
    
    setPathTitle('');
    setPathCareer('');
    setPathDesc('');
    setPathSelectedCourses([]);
  };

  const togglePathCourseSelection = (courseId: string) => {
    if (pathSelectedCourses.includes(courseId)) {
      setPathSelectedCourses(pathSelectedCourses.filter(id => id !== courseId));
    } else {
      setPathSelectedCourses([...pathSelectedCourses, courseId]);
    }
  };

  // --- Profile Handlers ---
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      rank: profileRank,
      xp: Number(profileXp),
      studyHours: Number(profileHours)
    });
    triggerNotification("Student profile parameters updated!");
  };

  return (
    <div className="space-y-8 py-6 text-slate-800 font-sans text-left animate-fade-in" ref={formTopRef}>
      
      {/* 1. TOP EXECUTIVE ADMIN HEADER */}
      <section className="bg-gradient-to-r from-[#002D62] via-[#003D5C] to-[#005073] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-white/10 text-cyan-300 border border-white/20 uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Authorized Admin Console
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live CMS Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Academy Course & Portal Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-sans">
            Easily update course titles, select official Cisco NetAcad thumbnails, customize syllabus outlines, manage delivery modes, and configure Google Sheets sync.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={handleExportCatalog}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download full course catalog backup as JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" /> Export JSON
          </button>
          
          <label className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Upload className="w-3.5 h-3.5 text-cyan-300" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportCatalog} className="hidden" />
          </label>

          <button 
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Lock session and log out of Administrator Portal"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </section>

      {/* 2. NOTIFICATION TOAST */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2.5 max-w-xl mx-auto animate-fade-in shadow-md font-semibold">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. NAVIGATION TABS */}
      <section className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'courses' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" /> Courses & Thumbnails ({courses.length})
        </button>
        <button
          onClick={() => setActiveSubTab('pathways')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'pathways' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" /> Career Pathways ({pathways.length})
        </button>
        <button
          onClick={() => setActiveSubTab('sheets')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'sheets' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>📊</span> Google Sheets Sync
        </button>
        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'security' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4 text-cyan-400" /> Security & Passcode
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'profile' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>👤</span> Student Defaults
        </button>
        <button
          onClick={() => setActiveSubTab('api')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'api' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-cyan-400" /> REST API Stream
        </button>
      </section>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: COURSE MANAGEMENT & THUMBNAIL EDITOR                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'courses' && (
        <div className="space-y-10">
          
          {/* COURSE FORM + LIVE VISUAL CARD PREVIEW GRID */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 7 COLS: COURSE EDITOR FORM */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-extrabold text-[#002D62] flex items-center gap-2">
                    {editingCourseId ? <Edit2 className="w-5 h-5 text-[#007A87]" /> : <Plus className="w-5 h-5 text-[#007A87]" />}
                    {editingCourseId ? 'Edit Course Details' : 'Create & Publish New Course'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingCourseId ? `Editing course ID: ${editingCourseId}` : 'Fill in the details below to add a new course to the academy catalog.'}
                  </p>
                </div>

                {editingCourseId && (
                  <button 
                    type="button" 
                    onClick={handleResetForm}
                    className="px-3 py-1.5 text-xs font-bold text-slate-650 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-5 text-xs">
                
                {/* 1. Course Title */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex justify-between">
                    <span>Course Name / Title *</span>
                    <span className="text-[10px] text-slate-400 font-normal">Official track title</span>
                  </label>
                  <input 
                    type="text" 
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. CCNA: Introduction to Networks (ITN)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-900 font-semibold text-sm"
                    required
                  />
                </div>

                {/* 2. THUMBNAIL SELECTOR & UPLOADER (KEY FEATURE) */}
                <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#007A87]" /> Course Thumbnail Image *
                    </label>
                    <span className="text-[10px] text-slate-500">Local or Web URL</span>
                  </div>

                  <div className="grid sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <input 
                        type="text" 
                        value={courseImageUrl}
                        onChange={(e) => setCourseImageUrl(e.target.value)}
                        placeholder="/netacad-thumbnails/ccna-itn.png or https://..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-4 flex gap-1.5">
                      {/* Pick Preset Gallery Button */}
                      <button
                        type="button"
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="flex-1 bg-[#002D62] hover:bg-[#001D42] text-white py-2 px-2 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                        title="Pick from authentic Cisco NetAcad thumbnails"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Presets
                      </button>

                      {/* File Upload Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 px-2.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Upload thumbnail image from your computer"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  {/* Thumbnail Quick Chips */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5">Quick Select NetAcad Presets:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {NETACAD_THUMBNAIL_PRESETS.slice(0, 8).map(preset => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => setCourseImageUrl(preset.path)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            courseImageUrl === preset.path 
                              ? 'bg-[#007A87] text-white font-bold' 
                              : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {preset.label.split(':')[0]}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#007A87] hover:underline bg-white border border-[#007A87]/30"
                      >
                        + View All 31 Presets
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Category & Specialization Track & Delivery Mode */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Category Track</label>
                    <select 
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800 font-semibold"
                    >
                      <option value="Networking">Networking</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Programming">Programming</option>
                      <option value="Automation">Automation</option>
                      <option value="IoT & Analytics">IoT & Analytics</option>
                      <option value="Operating Systems">Operating Systems</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Delivery Mode</label>
                    <select 
                      value={courseDeliveryMode}
                      onChange={(e) => setCourseDeliveryMode(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800 font-semibold"
                    >
                      <option value="Online & On-Campus">Online & On-Campus (Both)</option>
                      <option value="Online">Online Only</option>
                      <option value="On-Campus">On-Campus Only (Multan)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Provider Brand</label>
                    <select 
                      value={courseProvider}
                      onChange={(e) => setCourseProvider(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800 font-semibold"
                    >
                      <option value="NetAcad">Cisco NetAcad Linked</option>
                      <option value="CyberAI">CyberAI Initiative</option>
                      <option value="Hybrid">Hybrid/Corvit Affiliate</option>
                    </select>
                  </div>
                </div>

                {/* 4. Difficulty, Duration, Credly Badge */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Difficulty Level</label>
                    <select 
                      value={courseDiff}
                      onChange={(e) => setCourseDiff(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Duration</label>
                    <input 
                      type="text" 
                      value={courseDur}
                      onChange={(e) => setCourseDur(e.target.value)}
                      placeholder="e.g. 24 hours or 2 Months"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Credly Badge Name</label>
                    <input 
                      type="text" 
                      value={courseBadge}
                      onChange={(e) => setCourseBadge(e.target.value)}
                      placeholder="e.g. CCNA Specialist"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                    />
                  </div>
                </div>

                {/* 5. Course Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Course Overview & Description *</label>
                  <textarea 
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Provide a comprehensive description of learning objectives and lab hands-on skills..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800 leading-relaxed text-xs"
                    required
                  />
                </div>

                {/* 6. Chapter Syllabus Outline */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block">Chapter Syllabus Outline (One line per chapter / module)</label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {courseOutlineRaw.split('\n').filter(l => l.trim().length > 0).length} Chapters
                    </span>
                  </div>
                  <textarea 
                    value={courseOutlineRaw}
                    onChange={(e) => setCourseOutlineRaw(e.target.value)}
                    rows={5}
                    placeholder="Chapter 1: ...&#10;Chapter 2: ...&#10;Chapter 3: ..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono focus:outline-none focus:ring-2 focus:ring-[#007A87] text-[11px] text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-[#002D62] to-[#005073] hover:from-[#001D42] hover:to-[#003D5C] text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {editingCourseId ? 'Save & Update Course Metadata' : 'Publish New Course to Catalog'}
                  </button>
                  {editingCourseId && (
                    <button 
                      type="button" 
                      onClick={handleResetForm}
                      className="px-5 py-3.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* RIGHT 5 COLS: LIVE CARD VISUAL PREVIEW */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#007A87]" /> Live Catalog Card Preview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Real-time rendering
                </span>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left space-y-0 transition-transform">
                
                {/* Thumbnail Preview Area */}
                <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden group">
                  <img 
                    src={courseImageUrl || '/netacad-thumbnails/ccna-itn.png'} 
                    alt={courseTitle || 'Course Thumbnail Preview'} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e: any) => {
                      e.target.src = '/netacad-thumbnails/ccna-itn.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  
                  {/* Top Badge: Category & Provider */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#002D62]/90 text-white backdrop-blur-md shadow">
                      {courseCategory}
                    </span>
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 backdrop-blur-md shadow">
                      {courseProvider}
                    </span>
                  </div>

                  {/* Delivery Mode Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {courseDeliveryMode || 'Online & On-Campus'}
                    </span>
                  </div>

                  {/* Bottom Duration & Modules Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-xs">
                    <span className="font-semibold text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-300" /> {courseDur || '17 hours'}
                    </span>
                    <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {courseOutlineRaw.split('\n').filter(l => l.trim().length > 0).length} Chapters
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 space-y-3">
                  <h4 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {courseTitle || 'Course Title Preview'}
                  </h4>
                  
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {courseDesc || 'Course summary description will appear here as students browse the catalog.'}
                  </p>

                  {/* Difficulty & Badge Pill */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      courseDiff === 'Advanced' ? 'bg-red-50 text-red-700' :
                      courseDiff === 'Intermediate' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {courseDiff}
                    </span>

                    {courseBadge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 flex items-center gap-1">
                        <Award className="w-3 h-3" /> {courseBadge}
                      </span>
                    )}
                  </div>

                  {/* Simulated Action */}
                  <div className="pt-2 flex gap-2">
                    <div className="flex-1 bg-[#007A87] text-white py-2 rounded-xl text-xs font-bold text-center opacity-90 cursor-default">
                      View Course Details
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Info Box */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#002D62]">
                  <Info className="w-4 h-4" /> Admin Pro-Tip
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Changes made here save instantly to the global storage and immediately update the student Course Catalog, LMS Player, and Career Pathways.
                </p>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* COURSE INVENTORY LISTING TABLE & SEARCH BAR                               */}
          {/* ========================================================================= */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-display font-extrabold text-[#002D62] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#007A87]" /> Active Course Catalog Inventory
                </h3>
                <p className="text-xs text-slate-500">
                  Total of <strong>{courses.length} courses</strong> active in the academy database.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'Operating Systems', 'IoT & Analytics'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterCategory === cat 
                        ? 'bg-[#002D62] text-white font-bold' 
                        : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                type="text"
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                placeholder="Search catalog by course title, category, or syllabus keywords..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-900 font-sans"
              />
            </div>

            {/* Course Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map(course => (
                <div 
                  key={course.id} 
                  className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-all hover:shadow-md ${
                    editingCourseId === course.id ? 'border-[#007A87] bg-cyan-50/20 ring-2 ring-[#007A87]/20' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Thumbnail & Badges */}
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-950">
                      <img 
                        src={course.imageUrl || '/netacad-thumbnails/ccna-itn.png'} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e: any) => { e.target.src = '/netacad-thumbnails/ccna-itn.png'; }}
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#002D62]/90 text-white">
                          {course.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/70 text-white">
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Course Title & Summary */}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-2" title={course.title}>
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {course.provider}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                        {course.deliveryMode || 'Online & On-Campus'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                        {course.syllabusOutline.length} Chapters
                      </span>
                    </div>

                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button 
                      onClick={() => handleEditInit(course)}
                      className="flex-1 bg-[#002D62] hover:bg-[#001D42] text-white py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Edit this course's name, thumbnail, or chapters"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>

                    <button 
                      onClick={() => handleDuplicate(course)}
                      className="p-1.5 hover:bg-slate-100 text-slate-650 rounded-lg border border-slate-200 transition-colors"
                      title="Duplicate as new course template"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => {
                        if(window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
                          deleteCourse(course.id);
                          triggerNotification(`Course deleted from catalog.`);
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CAREER PATHWAYS CREATOR                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'pathways' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-display font-extrabold text-[#002D62] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#007A87]" /> Career Pathways & Roadmaps
            </h3>
            <p className="text-xs text-slate-500">
              Bundle multiple courses into guided career milestones (e.g. Senior Network Architect, SOC Cyber Analyst).
            </p>
          </div>

          <form onSubmit={handleSavePathway} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Pathway Title</label>
                <input 
                  type="text" 
                  value={pathTitle}
                  onChange={(e) => setPathTitle(e.target.value)}
                  placeholder="e.g. Cisco Enterprise Network Architect Track"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Target Career Job Role</label>
                <input 
                  type="text" 
                  value={pathCareer}
                  onChange={(e) => setPathCareer(e.target.value)}
                  placeholder="e.g. Senior Network Architect"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Average Estimated Salary</label>
                <input 
                  type="text" 
                  value={pathSalary}
                  onChange={(e) => setPathSalary(e.target.value)}
                  placeholder="e.g. PKR 250,000/mo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Certifications Awarded</label>
                <input 
                  type="text" 
                  value={pathCert}
                  onChange={(e) => setPathCert(e.target.value)}
                  placeholder="e.g. Cisco CCNA & CCNP Enterprise"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Pathway Roadmap Description</label>
              <textarea 
                value={pathDesc}
                onChange={(e) => setPathDesc(e.target.value)}
                placeholder="Describe the progression path and campus lab training..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
              />
            </div>

            {/* Course Assignment Checklist */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Select Courses Included in this Pathway</label>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 border border-slate-200 bg-slate-50 p-4 rounded-2xl max-h-48 overflow-y-auto">
                {courses.map(course => (
                  <label key={course.id} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input 
                      type="checkbox"
                      checked={pathSelectedCourses.includes(course.id)}
                      onChange={() => togglePathCourseSelection(course.id)}
                      className="accent-[#002D62] w-4 h-4 rounded"
                    />
                    <span className="font-semibold text-xs text-slate-800 truncate">{course.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#002D62] to-[#005073] hover:from-[#001D42] hover:to-[#003D5C] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Create & Launch Pathway
            </button>
          </form>

          {/* Existing Pathways List */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Current Career Pathways ({pathways.length})</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {pathways.map(p => (
                <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-slate-900">{p.title}</h5>
                    <p className="text-xs text-slate-500 font-mono">{p.career} • {p.salary}</p>
                    <span className="text-[10px] text-slate-600 block">{p.courseIds.length} Courses Assigned</span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete pathway "${p.title}"?`)) {
                        deletePathway(p.id);
                        triggerNotification("Pathway removed.");
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: GOOGLE SHEETS SYNC INTEGRATION                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'sheets' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-display font-extrabold text-[#002D62] flex items-center gap-2">
                <span className="text-xl">📊</span> Google Sheets Real-Time Sync
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically log all admissions, student quiz results, and verified certificates to your Google Spreadsheet.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {sheetWebhookUrl ? '✓ Connected' : 'Setup Required'}
            </span>
          </div>

          <form onSubmit={handleSaveWebhook} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span>Google Apps Script Webhook URL</span>
                <span className="text-[10px] text-slate-400 font-normal">Starts with https://script.google.com/macros/s/.../exec</span>
              </label>
              <input
                type="url"
                value={sheetWebhookUrl}
                onChange={(e) => setSheetWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#007A87] font-mono text-slate-800"
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="submit"
                className="bg-[#002D62] hover:bg-[#001D42] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                💾 Save Webhook URL
              </button>

              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isTestingWebhook ? '⏳ Sending Ping...' : '⚡ Send Test Ping to Sheet'}
              </button>
            </div>

            {testWebhookResult && (
              <div className={`p-3.5 rounded-xl text-xs font-medium ${testWebhookResult.startsWith('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                {testWebhookResult}
              </div>
            )}
          </form>

          {/* Quick Setup Instructions */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-slate-50 p-6 space-y-3 text-left">
            <h4 className="text-xs font-bold text-[#002D62] flex items-center gap-1.5">
              <span>📖</span> How Google Sheet Integration Works:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed font-sans">
              <li>Open <strong><a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">sheets.new</a></strong> in your browser to create a new spreadsheet.</li>
              <li>Go to <strong>Extensions ➔ Apps Script</strong>.</li>
              <li>Paste the ready-made script from <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">GOOGLE_SHEETS_SETUP.md</code>.</li>
              <li>Click <strong>Deploy ➔ New deployment</strong>, select <strong>Web app</strong> (Execute as: <em>Me</em>, Access: <em>Anyone</em>), and paste the Webhook URL above.</li>
            </ol>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: SECURITY & ADMIN PASSCODE MANAGEMENT                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'security' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-display font-extrabold text-[#002D62] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#007A87]" /> Administrator Passcode & Security Settings
            </h3>
            <p className="text-xs text-slate-500">
              Update your administrator login passcode or reset database defaults.
            </p>
          </div>

          <form onSubmit={handleChangePasscode} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Current Passcode</label>
              <input 
                type="text" 
                value={currentPin}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">New Passcode / PIN</label>
                <input 
                  type="password" 
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] font-mono text-slate-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Confirm New Passcode</label>
                <input 
                  type="password" 
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm new PIN..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] font-mono text-slate-900"
                  required
                />
              </div>
            </div>

            {pinChangeMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${pinChangeMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {pinChangeMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="bg-[#002D62] hover:bg-[#001D42] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Update Administrator Passcode
            </button>
          </form>

          {/* Database Reset Danger Zone */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-sm text-red-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Reset Database to Factory Defaults
            </h4>
            <p className="text-xs text-slate-500">
              Restores all default 27 Cisco NetAcad courses, official thumbnail paths, initial badges, and career pathways.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all courses and database records to factory defaults? Any custom courses will be erased.")) {
                  resetDatabase();
                  triggerNotification("Factory defaults restored successfully!");
                }
              }}
              className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Restore Factory Defaults
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: STUDENT PROFILE DEFAULTS                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-display font-extrabold text-[#002D62]">
              👤 Student Profile & XP Defaults
            </h3>
            <p className="text-xs text-slate-500">
              Configure baseline student experience points, study hours, and honorary ranks.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Default Student Name</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800 font-semibold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Honorary Rank</label>
                <input 
                  type="text" 
                  value={profileRank}
                  onChange={(e) => setProfileRank(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Baseline XP</label>
                <input 
                  type="number" 
                  value={profileXp}
                  onChange={(e) => setProfileXp(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Total Study Hours</label>
                <input 
                  type="number" 
                  value={profileHours}
                  onChange={(e) => setProfileHours(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007A87] text-slate-800"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="bg-[#002D62] hover:bg-[#001D42] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Student Parameters
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 6: REST API SIMULATOR LOGS                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'api' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xl font-display font-extrabold text-[#002D62] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#007A87]" /> Live REST API Request Stream
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live JSON Logging Active</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 font-mono text-[11px] text-slate-300 space-y-2 h-[340px] overflow-y-auto">
            {apiLogs.length === 0 ? (
              <div className="text-slate-500 text-center py-20">No recent API transactions recorded yet.</div>
            ) : (
              apiLogs.map((log, idx) => {
                const methodColor = log.method === 'GET' ? 'text-blue-400' : log.method === 'POST' ? 'text-green-400' : log.method === 'DELETE' ? 'text-red-400' : 'text-yellow-400';
                return (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-900 pb-1 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className={`${methodColor} font-bold`}>[{log.method}]</span>
                      <span className="text-slate-200">{log.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="text-emerald-400">{log.status} OK</span>
                      <span className="text-slate-500 text-[9px]">{log.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRESET NETACAD THUMBNAIL GALLERY PICKER MODAL                             */}
      {/* ========================================================================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-display font-extrabold text-[#002D62] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#007A87]" /> Official Cisco NetAcad Thumbnail Gallery
                </h3>
                <p className="text-xs text-slate-500">
                  Click any thumbnail to instantly apply it to your course.
                </p>
              </div>
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-1.5 bg-white">
              {['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'Operating Systems', 'IoT & Analytics'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    galleryCategoryFilter === cat ? 'bg-[#002D62] text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="p-6 overflow-y-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {NETACAD_THUMBNAIL_PRESETS
                .filter(p => galleryCategoryFilter === 'All' || p.category === galleryCategoryFilter)
                .map((preset) => (
                  <div 
                    key={preset.path}
                    onClick={() => {
                      setCourseImageUrl(preset.path);
                      setIsGalleryModalOpen(false);
                      triggerNotification(`Selected thumbnail: ${preset.label}`);
                    }}
                    className={`group cursor-pointer rounded-2xl border-2 p-2.5 space-y-2 transition-all hover:scale-[1.02] hover:shadow-lg ${
                      courseImageUrl === preset.path ? 'border-[#007A87] bg-cyan-50/30' : 'border-slate-200 hover:border-[#007A87]/50'
                    }`}
                  >
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
                      <img 
                        src={preset.path} 
                        alt={preset.label} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {courseImageUrl === preset.path && (
                        <div className="absolute inset-0 bg-[#007A87]/40 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white text-[#007A87] flex items-center justify-center font-bold shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-xs text-slate-800 truncate" title={preset.label}>{preset.label}</span>
                      <span className="text-[9px] font-mono uppercase text-slate-400 shrink-0">{preset.category}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Gallery
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

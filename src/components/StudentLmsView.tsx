import React, { useState, useEffect, useMemo } from 'react';
import { useAcademyStore, StudentRosterItem, StudentAssignment, Course } from '@/services/academyState';
import { 
  BookOpen, Play, CheckCircle2, Award, Clock, Terminal, Shield, 
  Layers, User, Calendar, FileText, Check, AlertTriangle, ArrowRight, 
  ExternalLink, Sparkles, HelpCircle, Download, Printer, RotateCcw, 
  Search, Eye, ChevronRight, X, Flame, Bell, Cpu, QrCode, Bookmark,
  Video, Code, CheckSquare, MessageSquare, Info, ShieldCheck, Star
} from 'lucide-react';

interface StudentLmsViewProps {
  onNavigateToTab?: (tab: any) => void;
  defaultSubTab?: 'courses' | 'classroom' | 'assignments' | 'gradebook' | 'certificates' | 'id_card';
}

export default function StudentLmsView({ onNavigateToTab, defaultSubTab = 'courses' }: StudentLmsViewProps) {
  const { 
    courses, 
    students, 
    certificates, 
    assignments, 
    activeStudentId, 
    activeStudent, 
    setActiveStudentId, 
    submitAssignment,
    updateProgress,
    enrollInCourse
  } = useAcademyStore();

  // Active LMS navigation subtab
  const [activeTab, setActiveTab] = useState<'courses' | 'classroom' | 'assignments' | 'gradebook' | 'certificates' | 'id_card'>(defaultSubTab);

  // Switch Student Profile Modal
  const [isSwitchStudentOpen, setIsSwitchStudentOpen] = useState(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    enrolledCourseTitle: 'Cisco Certified Network Associate (CCNA 200-301)'
  });

  // Classroom Active Course & Lesson State
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'ccna-itn');
  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [classroomMode, setClassroomMode] = useState<'lecture' | 'video' | 'lab' | 'quiz' | 'notes'>('lecture');

  // Video Player Simulation State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35); // percentage
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1);

  // Lesson Personal Notes (stored per course + chapter in localStorage)
  const notesKey = `lms_notes_${selectedCourse?.id}_${selectedChapterIdx}`;
  const [lessonNotes, setLessonNotes] = useState<string>('');
  const [notesSavedToast, setNotesSavedToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(notesKey);
    setLessonNotes(saved || `# My Personal Notes - ${selectedCourse?.syllabusOutline[selectedChapterIdx] || 'Lesson'}\n\n- Key Concept 1:\n- Cisco CLI syntax:\n- Questions for instructor:`);
  }, [selectedCourseId, selectedChapterIdx]);

  const handleSaveNotes = () => {
    localStorage.setItem(notesKey, lessonNotes);
    setNotesSavedToast(true);
    setTimeout(() => setNotesSavedToast(false), 2500);
  };

  // Lab Sandbox Simulator State
  const [labCode, setLabCode] = useState<string>(
`# Hands-on Cisco Automation Task
import socket

def test_gateway_connectivity(gateway_ip):
    print(f"Pinging Cisco Default Gateway: {gateway_ip}...")
    # Simulated ICMP socket probe
    return True

gateway = "192.168.1.1"
status = test_gateway_connectivity(gateway)
print(f"Gateway {gateway} Status: REACHABLE (0% loss, avg=1.8ms)")
`
  );
  const [labOutput, setLabOutput] = useState<string>('Terminal ready. Click "Execute Code" to run the local container.');
  const [isExecutingLab, setIsExecutingLab] = useState(false);
  const [labCompleted, setLabCompleted] = useState(false);

  const handleRunLab = () => {
    setIsExecutingLab(true);
    setLabOutput('Spawning Multan Campus Container multan-node-01 (Python 3.12)...\nExecuting script assertions...');
    setTimeout(() => {
      setIsExecutingLab(false);
      setLabOutput(
`[SUCCESS]multan-node-01: Execution Finished.
------------------------------------------------
Pinging Cisco Default Gateway: 192.168.1.1...
Gateway 192.168.1.1 Status: REACHABLE (0% loss, avg=1.8ms)
[ASSERTION PASSED] 4 ICMP packets verified.
Status Code: 200 OK • Grade Recorded in LMS: 100/100`
      );
      setLabCompleted(true);
      updateProgress(selectedCourse.id, 5);
    }, 1200);
  };

  // Chapter Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const chapterQuestions = useMemo(() => [
    {
      id: 1,
      q: `What is the primary function of a Default Gateway in an IPv4 network?`,
      options: [
        'To resolve domain names into numerical IP addresses',
        'To route traffic destined for remote networks outside the local subnet',
        'To dynamically assign IP addresses to DHCP client workstations',
        'To encrypt payload packets at the physical Layer 1 media'
      ],
      correct: 1,
      explanation: 'A default gateway (typically a router interface) forwards packets whose destination IP lies outside the source host\'s local broadcast domain.'
    },
    {
      id: 2,
      q: `Which Cisco IOS command is used to encrypt all plaintext passwords stored in the running configuration?`,
      options: [
        'enable secret 5',
        'service password-encryption',
        'crypto key generate rsa',
        'ip ssh version 2'
      ],
      correct: 1,
      explanation: 'service password-encryption applies Cisco type 7 reversible hashing to all passwords in configuration files.'
    },
    {
      id: 3,
      q: `In a /26 IPv4 subnet, how many usable host addresses are available?`,
      options: ['64 hosts', '62 hosts', '30 hosts', '126 hosts'],
      correct: 1,
      explanation: '32 - 26 = 6 host bits. 2^6 = 64 total addresses. Minus network & broadcast = 62 usable host addresses.'
    },
    {
      id: 4,
      q: `Which 802.1Q field identifies the VLAN to which an Ethernet frame belongs?`,
      options: ['FCS Checksum', 'VLAN ID (VID) 12-bit Tag', 'EtherType 0x0800', 'Preamble'],
      correct: 1,
      explanation: 'The 802.1Q header inserts a 4-byte Tag Protocol Identifier (TPID) containing a 12-bit VLAN ID (VID) supporting up to 4096 VLANs.'
    }
  ], [selectedChapterIdx]);

  const handleQuizOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleGradeQuiz = () => {
    let correct = 0;
    chapterQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correct++;
    });
    const pct = Math.round((correct / chapterQuestions.length) * 100);
    setQuizScore(pct);
    setQuizSubmitted(true);
    if (pct >= 75) {
      updateProgress(selectedCourse.id, 10);
    }
  };

  // Assignment Submission Modal State
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState<StudentAssignment | null>(null);
  const [asgSubmissionText, setAsgSubmissionText] = useState('');
  const [isSubmittingAsg, setIsSubmittingAsg] = useState(false);
  const [asgSuccessToast, setAsgSuccessToast] = useState(false);

  const handleSubmitAssignmentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgForSubmit || !asgSubmissionText.trim()) return;

    setIsSubmittingAsg(true);
    setTimeout(() => {
      submitAssignment(selectedAsgForSubmit.id, asgSubmissionText);
      setIsSubmittingAsg(false);
      setSelectedAsgForSubmit(null);
      setAsgSubmissionText('');
      setAsgSuccessToast(true);
      setTimeout(() => setAsgSuccessToast(false), 3000);
    }, 1000);
  };

  // Certificate Viewer Modal State
  const [viewingCertificate, setViewingCertificate] = useState<any | null>(null);

  // Student Courses Filtered
  const studentCourses = useMemo(() => {
    // Return courses where student is enrolled or relevant to student's course title
    return courses;
  }, [courses]);

  return (
    <div className="py-6 space-y-8 animate-fade-in text-slate-800 text-left">

      {/* ===================================================================== */}
      {/* 1. STUDENT IDENTITY BANNER & TOP QUICK ACTIONS                        */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-br from-[#002D62] via-[#003875] to-[#007A87] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#00F2FE_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Student Profile Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-cyan-400/60 p-1 shadow-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={activeStudent.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`} 
                  alt={activeStudent.name}
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#002D62] flex items-center justify-center" title="Active Online">
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                  {activeStudent.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  {activeStudent.rollNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {activeStudent.status} Student
                </span>
              </div>

              <div className="text-xs text-slate-200 flex flex-wrap items-center gap-3 pt-0.5">
                <span className="font-semibold text-cyan-200">{activeStudent.enrolledCourseTitle}</span>
                <span className="text-white/40">•</span>
                <span className="text-slate-300">Multan Campus (Bosan Rd)</span>
                <span className="text-white/40">•</span>
                <span className="text-amber-300 font-bold font-mono">GPA: {activeStudent.gpa || '3.92'}</span>
              </div>
            </div>
          </div>

          {/* Quick Header Switcher & ID Card Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsSwitchStudentOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-105"
            >
              <User className="w-4 h-4 text-cyan-300" />
              <span>Switch Student</span>
            </button>

            <button
              onClick={() => setActiveTab('id_card')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-105"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Digital Student ID</span>
            </button>
          </div>

        </div>

        {/* Quick Academic Metric Badges */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Attendance</div>
            <div className="text-lg font-bold text-emerald-300 mt-0.5">{activeStudent.attendancePercent}% Present</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Lab Mastery</div>
            <div className="text-lg font-bold text-cyan-300 mt-0.5">{activeStudent.labScore}/100 Pts</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Course Progress</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">{activeStudent.progress}% Done</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Multan Batch</div>
            <div className="text-lg font-bold text-white mt-0.5">{activeStudent.batch || 'Spring 2026-A'}</div>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 2. LMS MAIN TAB NAVIGATION BAR                                        */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 shadow-inner">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'courses' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>My Enrolled Courses</span>
        </button>

        <button
          onClick={() => setActiveTab('classroom')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'classroom'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <Play className={`w-4 h-4 ${activeTab === 'classroom' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Interactive Classroom</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <FileText className={`w-4 h-4 ${activeTab === 'assignments' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Labs & Assignments</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-800 text-[10px] font-bold">
            {assignments.filter(a => a.status === 'Pending').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gradebook')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'gradebook'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <Award className={`w-4 h-4 ${activeTab === 'gradebook' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Gradebook & Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${activeTab === 'certificates' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Certificates</span>
        </button>

        <button
          onClick={() => setActiveTab('id_card')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'id_card'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <QrCode className={`w-4 h-4 ${activeTab === 'id_card' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Student ID Card</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 3. SUB-TAB 1: MY ENROLLED COURSES                                      */}
      {/* ===================================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display font-extrabold text-slate-900">Current Enrolments & Programs</h3>
              <p className="text-xs text-slate-500">Pick any course below to continue your interactive classroom lecture and lab work.</p>
            </div>
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('programs');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#007A87]" />
              <span>Explore More Courses</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isSelected = selectedCourseId === course.id;

              return (
                <div 
                  key={course.id}
                  className={`bg-white border rounded-3xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                    isSelected ? 'border-[#007A87] ring-2 ring-[#007A87]/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Course Header Image & Category */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950">
                      <img 
                        src={course.imageUrl || '/netacad-thumbnails/ccna-itn.png'} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-cyan-300 text-[10px] font-mono font-bold">
                        {course.category}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                        {course.duration}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {course.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono font-semibold">
                        <span className="text-slate-500">{course.modulesCount || 12} Modules</span>
                        <span className="text-[#007A87] font-bold">{course.progress}% Completed</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#002D62] to-[#007A87] rounded-full transition-all duration-500" 
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setSelectedChapterIdx(0);
                        setActiveTab('classroom');
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] hover:from-[#001D42] hover:to-[#005D67] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-cyan-300" />
                      <span>Resume Classroom</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SUB-TAB 2: COMPREHENSIVE INTERACTIVE CLASSROOM & LECTURE PLAYER    */}
      {/* ===================================================================== */}
      {activeTab === 'classroom' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Syllabus & Modules Navigation Tree */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 max-h-[820px] flex flex-col">
            <div className="space-y-1 pb-3 border-b border-slate-100">
              <div className="text-[10px] font-bold text-[#007A87] uppercase font-mono tracking-wider">
                {selectedCourse.category} Curriculum
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {selectedCourse.title}
              </h4>
            </div>

            {/* Course Selector Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Course:</label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedChapterIdx(0);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Modules Outline List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {(selectedCourse.syllabusOutline || []).map((chText, idx) => {
                const isSelected = selectedChapterIdx === idx;
                const isCompleted = idx < Math.floor((selectedCourse.progress / 100) * (selectedCourse.syllabusOutline.length || 1));

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedChapterIdx(idx);
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className={`w-full text-left p-3 rounded-2xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#002D62] text-white shadow-md' 
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${
                      isSelected 
                        ? 'bg-cyan-400 text-slate-950' 
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </span>
                    <span className="font-semibold leading-snug line-clamp-2">
                      {chText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Completion Button */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  updateProgress(selectedCourse.id, 10);
                }}
                className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mark Lesson Complete (+10%)</span>
              </button>
            </div>
          </div>

          {/* Right Area: Classroom Content Player (Lecture / Video / Lab / Quiz / Notes) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Classroom Mode Switcher Bar */}
            <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setClassroomMode('lecture')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    classroomMode === 'lecture' 
                      ? 'bg-[#002D62] text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Theory & Notes</span>
                </button>

                <button
                  onClick={() => setClassroomMode('video')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    classroomMode === 'video' 
                      ? 'bg-[#002D62] text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Classroom</span>
                </button>

                <button
                  onClick={() => setClassroomMode('lab')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    classroomMode === 'lab' 
                      ? 'bg-[#002D62] text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Interactive Lab Sandbox</span>
                </button>

                <button
                  onClick={() => setClassroomMode('quiz')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    classroomMode === 'quiz' 
                      ? 'bg-[#002D62] text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Graded Assessment</span>
                </button>

                <button
                  onClick={() => setClassroomMode('notes')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    classroomMode === 'notes' 
                      ? 'bg-[#002D62] text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>My Notepad</span>
                </button>
              </div>

              {/* Direct Bridge to Visual Packet Tracer */}
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('labs');
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#007A87] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Launch this topic in Visual Cisco Packet Tracer"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                <span>Open Visual Packet Tracer</span>
                <ArrowRight className="w-3 h-3 text-[#007A87]" />
              </button>
            </div>

            {/* 1. LECTURE & THEORY MODE */}
            {classroomMode === 'lecture' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-bold text-[#007A87] uppercase font-mono">
                    Module {selectedChapterIdx + 1} • Lecture Reading
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 mt-1">
                    {selectedCourse.syllabusOutline[selectedChapterIdx] || 'Lesson Overview'}
                  </h3>
                </div>

                {/* Structured Lesson Content */}
                <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                  <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 space-y-1">
                    <div className="font-bold text-[#005073] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#007A87]" />
                      <span>Cisco NetAcad Certification Objectives</span>
                    </div>
                    <p className="text-slate-600">
                      This module directly aligns with the Cisco CCNA 200-301 & CyberOps Blueprint. Master interface configuration, routing logic, packet encapsulation headers, and defense mechanisms.
                    </p>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 pt-2">1. Core Technical Principles</h4>
                  <p>
                    In enterprise campus networking, reliable communication requires deterministic packet routing across multiple OSI layers. Devices examine Layer 2 frames (MAC address tables) and Layer 3 IPv4/IPv6 packet headers to make forwarding decisions.
                  </p>

                  {/* Cisco IOS Command Syntax Box */}
                  <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span>Cisco IOS Configuration Blueprint</span>
                      <span>EXEC Mode</span>
                    </div>
                    <div className="text-slate-400">Router&gt; enable</div>
                    <div className="text-slate-400">Router# configure terminal</div>
                    <div className="text-slate-200">Router(config)# hostname Multan-Gateway-01</div>
                    <div className="text-cyan-300">Router(config)# interface GigabitEthernet0/0/0</div>
                    <div className="text-slate-200">Router(config-if)# ip address 192.168.1.1 255.255.255.0</div>
                    <div className="text-emerald-400">Router(config-if)# no shutdown</div>
                    <div className="text-slate-400">Router(config-if)# exit</div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 pt-2">2. Hardware Implementation & Best Practices</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Always assign descriptions to interfaces (`description Link to Multan Distribution Switch`).</li>
                    <li>Secure administrative lines using SSH Version 2 with 2048-bit RSA keys rather than unencrypted Telnet.</li>
                    <li>Utilize 802.1Q trunking on interconnecting switch ports to segregate broadcast domains into distinct VLANs.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 2. VIDEO CLASSROOM MODE */}
            {classroomMode === 'video' && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-white font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">
                      HD Recorded Lecture • {selectedCourse.syllabusOutline[selectedChapterIdx]}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    1080p 60FPS
                  </span>
                </div>

                {/* Simulated Video Canvas */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-900 via-slate-950 to-[#002D62] rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 shadow-inner group">
                  {/* Watermark */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>Network Home Institute of IT • Multan Campus</span>
                    <span className="text-cyan-400">Instructor: Engr. Najeeb Ul Hussan</span>
                  </div>

                  {/* Play Button & Center Indicator */}
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="w-16 h-16 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-400/20 transition-all hover:scale-110 cursor-pointer"
                    >
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </button>
                    <span className="text-xs text-slate-300 font-sans">
                      {isVideoPlaying ? 'Playing Lecture Stream...' : 'Click to Play Lecture'}
                    </span>
                  </div>

                  {/* Video Scrubber & Playback Controls */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>18:45</span>
                      <span>35:20</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${videoProgress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <div className="flex items-center gap-3 text-slate-400">
                        <button onClick={() => setVideoPlaybackRate(1)} className={`hover:text-white ${videoPlaybackRate === 1 ? 'text-cyan-300 font-bold' : ''}`}>1x</button>
                        <button onClick={() => setVideoPlaybackRate(1.25)} className={`hover:text-white ${videoPlaybackRate === 1.25 ? 'text-cyan-300 font-bold' : ''}`}>1.25x</button>
                        <button onClick={() => setVideoPlaybackRate(1.5)} className={`hover:text-white ${videoPlaybackRate === 1.5 ? 'text-cyan-300 font-bold' : ''}`}>1.5x</button>
                        <button onClick={() => setVideoPlaybackRate(2)} className={`hover:text-white ${videoPlaybackRate === 2 ? 'text-cyan-300 font-bold' : ''}`}>2x</button>
                      </div>
                      <span className="text-slate-500">Audio: Cisco Lab Studio Stereo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. HANDS-ON LAB SANDBOX */}
            {classroomMode === 'lab' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#007A87]" />
                      <span>Interactive Python & Cisco Automation Sandbox</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Write and run verification scripts directly inside the Multan Campus virtual container.
                    </p>
                  </div>
                  <button
                    onClick={handleRunLab}
                    disabled={isExecutingLab}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] hover:from-[#001D42] hover:to-[#005D67] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-cyan-300" />
                    <span>{isExecutingLab ? 'Executing Script...' : 'Execute Script'}</span>
                  </button>
                </div>

                {/* Code Editor Area */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                  <div className="bg-slate-900 px-4 py-2 text-[11px] font-mono text-cyan-400 flex items-center justify-between border-b border-slate-800">
                    <span>lab_script.py (Python 3.12)</span>
                    <span className="text-slate-500 text-[10px]">Cisco Network Automation</span>
                  </div>
                  <textarea
                    value={labCode}
                    onChange={(e) => setLabCode(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-950 text-slate-200 p-4 font-mono text-xs focus:outline-none resize-none"
                  />
                </div>

                {/* Terminal Output */}
                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Terminal Output:</div>
                  <pre className="text-[11px] text-emerald-400 whitespace-pre-wrap">{labOutput}</pre>
                </div>
              </div>
            )}

            {/* 4. GRADED CHAPTER QUIZ */}
            {classroomMode === 'quiz' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#007A87] uppercase font-mono">
                      Module Assessment • Graded
                    </span>
                    <h3 className="text-lg font-display font-extrabold text-slate-900 mt-0.5">
                      Check Your Understanding: {selectedCourse.syllabusOutline[selectedChapterIdx]}
                    </h3>
                  </div>
                  {quizSubmitted && (
                    <div className={`px-4 py-2 rounded-2xl font-mono font-bold text-xs ${
                      quizScore >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Score: {quizScore}% {quizScore >= 75 ? '• PASSED (+10 XP)' : '• RETAKE RECOMMENDED'}
                    </div>
                  )}
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                  {chapterQuestions.map((q, qIdx) => {
                    const selected = quizAnswers[qIdx];
                    const isRight = selected === q.correct;

                    return (
                      <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="font-bold text-xs text-slate-900 flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#002D62] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {qIdx + 1}
                          </span>
                          <span>{q.q}</span>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 pl-7">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selected === optIdx;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                                  isChosen 
                                    ? quizSubmitted 
                                      ? isRight 
                                        ? 'bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold' 
                                        : 'bg-red-100 border border-red-400 text-red-950 font-bold'
                                      : 'bg-[#002D62] text-white font-bold'
                                    : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === q.correct && (
                                  <span className="text-[10px] font-bold text-emerald-700 font-mono">Correct Answer</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation when submitted */}
                        {quizSubmitted && (
                          <div className="pl-7 text-[11px] text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-100">
                            💡 Explanation: {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {Object.keys(quizAnswers).length} of {chapterQuestions.length} answered
                  </span>
                  <button
                    onClick={handleGradeQuiz}
                    disabled={Object.keys(quizAnswers).length < chapterQuestions.length || quizSubmitted}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      Object.keys(quizAnswers).length < chapterQuestions.length || quizSubmitted
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-md hover:scale-105'
                    }`}
                  >
                    Submit Quiz & Record Grade
                  </button>
                </div>
              </div>
            )}

            {/* 5. PERSONAL NOTES NOTEPAD */}
            {classroomMode === 'notes' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#007A87]" />
                      <span>My Personal Study Notes</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Auto-saved to your browser storage specifically for this lesson.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 rounded-xl bg-[#002D62] hover:bg-[#001D42] text-white text-xs font-bold cursor-pointer"
                  >
                    {notesSavedToast ? '✓ Saved!' : 'Save Notes'}
                  </button>
                </div>

                <textarea
                  value={lessonNotes}
                  onChange={(e) => setLessonNotes(e.target.value)}
                  rows={12}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#007A87]"
                  placeholder="Type notes, copy Cisco commands, or write questions here..."
                />
              </div>
            )}

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. SUB-TAB 3: LABS & ASSIGNMENT SUBMISSION PORTAL                       */}
      {/* ===================================================================== */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display font-extrabold text-slate-900">Assigned Labs & Technical Projects</h3>
              <p className="text-xs text-slate-500">Submit your Cisco switch/router configs or Python code for automated rubric grading.</p>
            </div>
            {asgSuccessToast && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs animate-slide-up flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Assignment Submitted & Graded!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((asg) => {
              const isPending = asg.status === 'Pending';
              const isSubmitted = asg.status === 'Submitted';
              const isGraded = asg.status === 'Graded';

              return (
                <div key={asg.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#007A87] bg-cyan-50 px-2.5 py-0.5 rounded-full">
                        {asg.courseTitle}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isGraded ? 'bg-emerald-100 text-emerald-800' : isSubmitted ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {asg.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-slate-900 leading-snug">{asg.title}</h4>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{asg.module} • Due: {asg.dueDate}</div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {asg.instructions}
                    </p>

                    {/* Feedback if Graded */}
                    {asg.studentScore !== undefined && (
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-emerald-900">
                          <span>Grade Earned:</span>
                          <span className="font-mono text-sm">{asg.studentScore} / {asg.maxPoints} pts</span>
                        </div>
                        {asg.feedback && (
                          <div className="text-[11px] text-emerald-800">{asg.feedback}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">Max Points: {asg.maxPoints}</span>
                    <button
                      onClick={() => {
                        setSelectedAsgForSubmit(asg);
                        setAsgSubmissionText(asg.submittedContent || asg.starterTemplate || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#002D62] hover:bg-[#001D42] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Terminal className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{isGraded ? 'View Submission' : isSubmitted ? 'Resubmit Solution' : 'Submit Lab Solution'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. SUB-TAB 4: ACADEMIC GRADEBOOK & MULTAN CAMPUS SCHEDULE             */}
      {/* ===================================================================== */}
      {activeTab === 'gradebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Transcript & Performance Summary */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-display font-extrabold text-slate-900">Official Academic Transcript</h3>
                <p className="text-xs text-slate-500">Cumulative performance record across exams, quizzes, and hands-on laboratory modules.</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-cyan-50 text-[#007A87] font-mono font-bold text-xs">
                Term: Spring 2026
              </span>
            </div>

            {/* Weighted Grade Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Evaluation Component</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Score Earned</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Packet Tracer Lab Projects</td>
                    <td className="py-3 px-4 font-mono text-slate-600">40%</td>
                    <td className="py-3 px-4 font-mono text-cyan-700 font-bold">98 / 100</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">A+</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Verified</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Chapter Formative Quizzes</td>
                    <td className="py-3 px-4 font-mono text-slate-600">20%</td>
                    <td className="py-3 px-4 font-mono text-cyan-700 font-bold">95 / 100</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">A</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Passed</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Midterm Practical Assessment</td>
                    <td className="py-3 px-4 font-mono text-slate-600">20%</td>
                    <td className="py-3 px-4 font-mono text-cyan-700 font-bold">94 / 100</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">A</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Verified</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Final Certification Capstone</td>
                    <td className="py-3 px-4 font-mono text-slate-600">20%</td>
                    <td className="py-3 px-4 font-mono text-cyan-700 font-bold">96 / 100</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">A+</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Graduated</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* GPA Summary Footprint */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#002D62] text-white flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-cyan-300 uppercase">Cumulative Grade Point Average</div>
                <div className="text-xl font-extrabold text-white mt-0.5">3.92 / 4.00 (Distinction Honors)</div>
              </div>
              <div className="text-right text-[11px] text-slate-300">
                Total Credit Units: 18.0 Completed
              </div>
            </div>
          </div>

          {/* Multan Campus Weekly Timetable */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calendar className="w-4 h-4 text-[#007A87]" />
              <span>Campus Class Timetable</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-1">
                <div className="flex justify-between items-center font-bold text-[#002D62]">
                  <span>Mon & Wed • 04:00 PM - 06:00 PM</span>
                  <span className="text-[10px] bg-cyan-200 text-cyan-900 px-1.5 rounded">Lab 3</span>
                </div>
                <div className="font-semibold text-slate-800">Cisco Enterprise Switching & VLANs</div>
                <div className="text-slate-500 text-[11px]">Instructor: Engr. Najeeb Ul Hussan</div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1">
                <div className="flex justify-between items-center font-bold text-indigo-900">
                  <span>Tue & Thu • 06:00 PM - 08:00 PM</span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 rounded">Lab 1</span>
                </div>
                <div className="font-semibold text-slate-800">CyberOps Threat Intelligence & SIEM</div>
                <div className="text-slate-500 text-[11px]">Hands-on Packet Dissection</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                <div className="flex justify-between items-center font-bold text-emerald-900">
                  <span>Saturday • 02:00 PM - 05:00 PM</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 rounded">Main Hall</span>
                </div>
                <div className="font-semibold text-slate-800">Cisco Hardware Hackathon & Capstone</div>
                <div className="text-slate-500 text-[11px]">Live Physical Rack Patching</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. SUB-TAB 5: VERIFIABLE CERTIFICATES & AWARDS                        */}
      {/* ===================================================================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-extrabold text-slate-900">Verifiable Credentials & Certificates</h3>
              <p className="text-xs text-slate-500">Official verifiable credentials issued by Network Home Institute of IT & Cisco NetAcad.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono font-bold text-[#007A87] bg-cyan-50 px-2 py-0.5 rounded-full">
                    {cert.id}
                  </span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{cert.grade}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-bold text-base text-slate-900">{cert.courseTitle}</h4>
                  <div className="text-xs text-slate-600">Issued to: <span className="font-bold text-slate-900">{cert.studentName}</span></div>
                  <div className="text-[11px] text-slate-500">Issue Date: {cert.issueDate} • Verification Score: {cert.score}%</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 font-mono text-[10px] text-slate-500 break-all border border-slate-100">
                  SHA-256 Hash: {cert.verificationHash}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setViewingCertificate(cert)}
                    className="px-4 py-2 rounded-xl bg-[#002D62] hover:bg-[#001D42] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>View Official Certificate</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToTab) onNavigateToTab('explore');
                    }}
                    className="text-xs font-bold text-[#007A87] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Public Verify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. SUB-TAB 6: DIGITAL STUDENT IDENTITY CARD                           */}
      {/* ===================================================================== */}
      {activeTab === 'id_card' && (
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-display font-extrabold text-slate-900">Official Digital Student Identity Card</h3>
            <p className="text-xs text-slate-500">Scan QR Code or barcode at Multan Campus gate for lab entry & library clearance.</p>
          </div>

          {/* Realistic Student ID Card (Executive Dimensions) */}
          <div className="w-full max-w-md aspect-[1.58/1] rounded-3xl bg-gradient-to-br from-[#002D62] via-[#001D42] to-slate-950 text-white p-6 shadow-2xl border-2 border-cyan-400/40 relative overflow-hidden flex flex-col justify-between select-none">
            {/* Glossy Hologram Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Card Bar: Logo & Institution */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="NHIIT Logo" className="w-8 h-8 object-contain" />
                <div>
                  <div className="text-xs font-black tracking-wide text-white uppercase">Network Home</div>
                  <div className="text-[9px] text-cyan-300 font-mono tracking-tight">Institute of IT • Multan</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono font-bold">
                VALID 2026-2027
              </span>
            </div>

            {/* Middle: Photo & Student Credentials */}
            <div className="relative z-10 flex items-center gap-4 py-2">
              <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-cyan-300/60 shadow-md shrink-0">
                <img 
                  src={activeStudent.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`}
                  alt={activeStudent.name}
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="space-y-1 font-mono">
                <div className="text-sm font-display font-extrabold text-white tracking-tight">{activeStudent.name}</div>
                <div className="text-[10px] text-cyan-300 font-bold">ID: {activeStudent.rollNumber}</div>
                <div className="text-[10px] text-slate-300 line-clamp-1">{activeStudent.enrolledCourseTitle}</div>
                <div className="text-[9px] text-slate-400">Batch: {activeStudent.batch || 'Spring 2026-A'}</div>
              </div>
            </div>

            {/* Bottom Bar: Barcode & Security Seal */}
            <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between">
              {/* Simulated Barcode */}
              <div className="space-y-0.5">
                <div className="flex gap-0.5 items-center h-5">
                  {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 4, 2, 3, 5, 1, 2, 4, 1, 3, 2].map((w, i) => (
                    <div key={i} className="bg-white h-full" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <div className="text-[8px] font-mono text-slate-400 tracking-widest">{activeStudent.rollNumber}</div>
              </div>

              <div className="text-right text-[8px] font-mono text-slate-400">
                <div>Multan Campus Direct</div>
                <div className="text-cyan-300 font-bold">+92-333-3017333</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-cyan-300" />
            <span>Print Student Identity Card</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 9. MODALS: SWITCH STUDENT PROFILE                                     */}
      {/* ===================================================================== */}
      {isSwitchStudentOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#007A87]" />
                <span>Select Student Profile</span>
              </h4>
              <button onClick={() => setIsSwitchStudentOpen(false)} className="text-slate-400 hover:text-slate-950 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Choose an enrolled Multan Campus student account to load their course enrolments, lab submissions, and grades:
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {students.map((std) => {
                const isCurrent = std.id === activeStudentId;

                return (
                  <div
                    key={std.id}
                    onClick={() => {
                      setActiveStudentId(std.id);
                      setIsSwitchStudentOpen(false);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent ? 'bg-cyan-50 border-[#007A87] ring-1 ring-[#007A87]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img 
                          src={std.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80`} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{std.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{std.rollNumber} • {std.enrolledCourseTitle}</div>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#002D62] text-white text-[10px] font-bold">Active</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL: ASSIGNMENT SUBMISSION DRAWER */}
      {selectedAsgForSubmit && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#007A87] uppercase">Assignment Portal</span>
                <h4 className="text-base font-display font-bold text-slate-900">{selectedAsgForSubmit.title}</h4>
              </div>
              <button onClick={() => setSelectedAsgForSubmit(null)} className="text-slate-400 hover:text-slate-950 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-600 border border-slate-100">
              <span className="font-bold text-slate-800">Task Objective:</span> {selectedAsgForSubmit.instructions}
            </div>

            <form onSubmit={handleSubmitAssignmentForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste your Cisco Configuration Commands / Python Script:
                </label>
                <textarea
                  value={asgSubmissionText}
                  onChange={(e) => setAsgSubmissionText(e.target.value)}
                  rows={8}
                  placeholder="enable&#10;configure terminal&#10;hostname Router1..."
                  className="w-full bg-slate-950 text-cyan-300 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#007A87]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsgForSubmit(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAsg}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {isSubmittingAsg ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Syntax...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit Solution for Grading</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. MODAL: OFFICIAL CERTIFICATE VIEWER */}
      {viewingCertificate && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button 
              onClick={() => setViewingCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Certificate Canvas Frame */}
            <div className="border-8 border-double border-amber-600/50 p-8 rounded-2xl bg-amber-50/20 space-y-6 text-center">
              <div className="flex justify-center items-center gap-3">
                <img src="/logo.png" alt="" className="w-12 h-12 object-contain" />
                <div>
                  <div className="text-sm font-display font-black text-[#002D62] tracking-wider uppercase">Network Home</div>
                  <div className="text-[10px] text-[#007A87] font-bold">Institute of Information Technology • Multan</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Certificate of Technical Competence</div>
                <div className="text-xs text-slate-600">This is to certify that</div>
                <div className="text-2xl font-display font-extrabold text-[#002D62] underline decoration-amber-400 underline-offset-4">
                  {viewingCertificate.studentName}
                </div>
                <div className="text-xs text-slate-600 max-w-md mx-auto pt-1">
                  has demonstrated verified competency and successfully fulfilled all laboratory and theoretical curriculum requirements for
                </div>
                <div className="text-lg font-display font-bold text-[#007A87] pt-1">
                  {viewingCertificate.courseTitle}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-200 text-xs font-mono">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Issue Date</div>
                  <div className="font-bold text-slate-800">{viewingCertificate.issueDate}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Honors & Grade</div>
                  <div className="font-bold text-amber-600">{viewingCertificate.grade} ({viewingCertificate.score}%)</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Credential ID</div>
                  <div className="font-bold text-slate-800">{viewingCertificate.id}</div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 text-[10px] text-slate-500 font-mono">
                <div>Director: {viewingCertificate.directorName}</div>
                <div className="text-cyan-700 font-bold">Cisco NetAcad Academy ID: #3017333</div>
                <div>Instructor: {viewingCertificate.instructorName}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#002D62] hover:bg-[#001D42] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4 text-cyan-300" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

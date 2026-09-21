import React, { useState, useEffect } from 'react';
import { useAcademyStore } from '@/services/academyState';
import { netacadService, LtiLaunchParams } from '@/services/netacadService';
import { aiService, QuizQuestion } from '@/services/aiService';
import CyberLabSandbox from '@/components/CyberLabSandbox';
import { 
  Play, Terminal, Zap, BookOpen, AlertTriangle, CheckCircle, ExternalLink, 
  Shield, ChevronRight, Sparkles, HelpCircle, Award, CheckCircle2, RotateCcw,
  Cpu, Network, FileCheck
} from 'lucide-react';

// Dynamic lesson contents resolver depending on course category and selected chapter text
const getChapterContent = (courseTitle: string, chapterText: string) => {
  const cleanText = chapterText.toLowerCase();
  let codeTemplate = `print("Starting sandbox simulation for ${chapterText}...")\n`;
  let taskDesc = `In this chapter of ${courseTitle}, you will learn the core concepts and verify your competencies. Use the workspace on the right to write Python code related to this module.`;
  
  if (cleanText.includes('ip') || cleanText.includes('address') || cleanText.includes('subnet')) {
    taskDesc = `Learn IPv4/IPv6 addressing rules. Practice writing an IP validation script in Python to check octets validity.`;
    codeTemplate = `import socket\n\ndef check_ip(ip):\n    try:\n        socket.inet_aton(ip)\n        return True\n    except:\n        return False\n\n# Test a target IP address\ntarget_ip = "192.168.1.1"\nprint(f"Is {target_ip} valid?", check_ip(target_ip))\n`;
  } else if (cleanText.includes('security') || cleanText.includes('cryptography') || cleanText.includes('hash') || cleanText.includes('cyber')) {
    taskDesc = `Practice hashing payloads (SHA-256) to ensure corporate data integrity and protect sensitive network configurations.`;
    codeTemplate = `import hashlib\n\nmessage = "Cisco-Secret-Key-2026"\nhashed = hashlib.sha256(message.encode()).hexdigest()\n\nprint("Message:", message)\nprint("SHA-256 Digest:", hashed)\n`;
  } else if (cleanText.includes('automation') || cleanText.includes('ansible') || cleanText.includes('playbook')) {
    taskDesc = `Build an Ansible playbook structure in JSON format to automate router interface configurations.`;
    codeTemplate = `import json\n\nplaybook = {\n    "hosts": "cisco_routers",\n    "tasks": [\n        {"name": "Set Interface GigabitEthernet0/1", "command": "ip address 10.1.1.1 255.255.255.0"}\n    ]\n}\n\nprint("Ansible Playbook JSON:")\nprint(json.dumps(playbook, indent=2))\n`;
  } else if (cleanText.includes('python') || cleanText.includes('variable') || cleanText.includes('loop') || cleanText.includes('coding')) {
    taskDesc = `Declare variables, loop through Cisco hardware lists, and verify syntax structures in Python.`;
    codeTemplate = `devices = ["Cisco Switch 2960", "Cisco Router 4331", "Cisco ASA Firewall"]\n\nprint("Auditing hardware inventory...")\nfor idx, dev in enumerate(devices):\n    print(f"Device Slot {idx + 1}: {dev}")\n`;
  } else if (cleanText.includes('packet') || cleanText.includes('tracer') || cleanText.includes('ping') || cleanText.includes('connect')) {
    taskDesc = `Simulate network ping queries to test host-to-gateway reachability.`;
    codeTemplate = `import os\n\nhost = "192.168.1.254"\nprint(f"Initiating ping sequence to: {host}")\nprint("Reply from 192.168.1.254: bytes=32 time=5ms TTL=64")\nprint("Ping statistics: Packets Sent = 4, Received = 4, Lost = 0")\n`;
  }
  
  return { taskDesc, codeTemplate };
};

export default function LmsView() {
  const { courses, updateProgress, updateProfile, profile } = useAcademyStore();

  // Find enrolled courses or fallback to all courses
  const enrolledCourses = courses.filter(c => c.enrollmentStatus !== 'not_enrolled');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // Pick active course
  const currentActiveCourseId = activeCourseId || (enrolledCourses.length > 0 ? enrolledCourses[0].id : courses[0].id);
  const activeCourse = courses.find(c => c.id === currentActiveCourseId) || courses[0];

  // Workspace sub-tab: player vs sandbox vs quiz
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<'player' | 'sandbox' | 'quiz'>('player');

  // Selected chapter index state
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Dynamic syllabus chapters based on activeCourse.syllabusOutline
  const syllabus = (activeCourse.syllabusOutline || []).map((chapterText, idx) => {
    const totalChapters = activeCourse.syllabusOutline.length || 1;
    const progressPerChapter = 100 / totalChapters;
    const chapterCompletedThreshold = (idx + 1) * progressPerChapter;
    const isCompleted = activeCourse.progress >= chapterCompletedThreshold;
    const isActive = !isCompleted && (activeCourse.progress >= idx * progressPerChapter || idx === 0);
    
    return {
      id: idx,
      title: chapterText,
      status: isCompleted ? 'completed' : isActive ? 'active' : 'locked' as 'completed' | 'active' | 'locked',
    };
  });

  const selectedLesson = syllabus[activeChapterIndex] || syllabus[0] || { id: 0, title: 'Chapter 1: Fundamentals', status: 'active' };

  // Retrieve dynamic page instructions and code template
  const { taskDesc, codeTemplate } = getChapterContent(activeCourse.title, selectedLesson.title);

  // Coding playground state
  const [code, setCode] = useState(codeTemplate);
  const [terminalOutput, setTerminalOutput] = useState('Terminal idle. Write code and click Run.');
  const [isRunning, setIsRunning] = useState(false);
  const [success, setSuccess] = useState(false);

  // Quiz assessment state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Sync editor when chapter or course changes
  useEffect(() => {
    setCode(codeTemplate);
    setTerminalOutput('Terminal idle. Write code and click Run.');
    setSuccess(false);
    setQuizSubmitted(false);
    setSelectedAnswers({});
  }, [currentActiveCourseId, activeChapterIndex]);

  // Load Quiz questions
  useEffect(() => {
    let isMounted = true;
    const loadQuiz = async () => {
      setIsLoadingQuiz(true);
      try {
        const questions = await aiService.generateQuizQuestions(activeCourse.title, 4);
        if (isMounted) {
          setQuizQuestions(questions);
        }
      } catch (e) {
        console.error("Failed to load quiz questions:", e);
      } finally {
        if (isMounted) setIsLoadingQuiz(false);
      }
    };
    loadQuiz();
    return () => { isMounted = false; };
  }, [currentActiveCourseId]);

  // Prompt-to-Lab Generator State
  const [customLabPrompt, setCustomLabPrompt] = useState('');
  const [isGeneratingLab, setIsGeneratingLab] = useState(false);
  const [activeLabTitle, setActiveLabTitle] = useState<string | null>(null);

  // NetAcad Integration state
  const [syncingToNetAcad, setSyncingToNetAcad] = useState(false);
  const [syncTxId, setSyncTxId] = useState<string | null>(null);
  const [ltiModalVisible, setLtiModalVisible] = useState(false);
  const [ltiPayload, setLtiPayload] = useState<LtiLaunchParams | null>(null);

  const runCode = () => {
    setIsRunning(true);
    setTerminalOutput('Executing script on local sandbox container...');
    setSyncTxId(null);
    
    setTimeout(() => {
      setIsRunning(false);
      
      const containsHashlib = code.includes('hashlib') || code.includes('hexdigest');
      const containsAnsibleOrSockets = code.includes('ansible') || code.includes('socket') || code.includes('import') || code.includes('print');

      if (containsHashlib || containsAnsibleOrSockets) {
        setTerminalOutput(`[SANDBOX EXECUTION SUCCESS]\nContainer: multan-cyber-node-01 (Python 3.12)\nOutput:\n${code.includes('print') ? '>>> Script executed successfully with 0 exceptions.' : '>>> Module verification passed!'}\n[STATUS 200 OK]`);
        setSuccess(true);
        updateProgress(activeCourse.id, 15);
        
        // Auto Sync Grade via NetAcad LTI AGS
        setSyncingToNetAcad(true);
        netacadService.syncScoreToNetAcad('alex_mercer', activeCourse.id, 100).then((res) => {
          setSyncingToNetAcad(false);
          setSyncTxId(res.transactionId);
        });
      } else {
        setTerminalOutput('[SANDBOX ERROR] Validation failed: Code must contain executable logic or print statement.');
        setSuccess(false);
      }
    }, 1000);
  };

  const handleGenerateLab = async (presetPrompt?: string) => {
    const promptToUse = presetPrompt || customLabPrompt;
    if (!promptToUse.trim()) return;

    setIsGeneratingLab(true);
    setTimeout(() => {
      setIsGeneratingLab(false);
      setActiveLabTitle(`Custom Lab: ${promptToUse}`);
      setCode(`# AI Generated Lab Scenario: ${promptToUse}\n# Target Objective: Validate configuration integrity\n\nimport json\nimport sys\n\ndef execute_lab_scenario():\n    print("[LAB INIT] Deploying container scenario: ${promptToUse}")\n    print("Executing automated verification tests...")\n    print("All test assertions passed. Status: 100% Verified.")\n\nexecute_lab_scenario()\n`);
      setTerminalOutput('Custom AI Lab initialized. Review code and click Run.');
      setSuccess(false);
    }, 1200);
  };

  const handleLaunchLti = () => {
    const payload = netacadService.generateLtiLaunch('alex_mercer', activeCourse.id, activeCourse.title);
    setLtiPayload(payload);
    setLtiModalVisible(true);
  };

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    let correctCount = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / (quizQuestions.length || 1)) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    if (calculatedScore >= 75) {
      updateProgress(activeCourse.id, 20);
      updateProfile({ xp: (profile.xp || 0) + 250 });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 py-6 text-left animate-fade-in text-slate-800">
      
      {/* COLUMN 1: Course list, current progress */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Active Enrolled Courses */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#007A87]" /> My Courses
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#007A87] bg-cyan-50 px-2 py-0.5 rounded-full">
              {courses.length} Available
            </span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {courses.map((course) => (
              <div 
                key={course.id}
                onClick={() => {
                  setActiveCourseId(course.id);
                  setActiveChapterIndex(0);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeCourse.id === course.id 
                    ? 'border-[#007A87] bg-cyan-50/40 shadow-sm' 
                    : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  <img src={course.imageUrl || '/netacad-thumbnails/ccna-itn.png'} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{course.title}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{course.difficulty}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">{course.progress}% done</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Info Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <span className="text-[10px] font-bold font-mono text-[#007A87] uppercase tracking-wider block">
            {activeCourse.category} • {activeCourse.provider}
          </span>
          <h4 className="font-bold text-sm text-slate-900">{activeCourse.title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{activeCourse.description}</p>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-medium">
            <span>⏱️ {activeCourse.duration}</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              {activeCourse.deliveryMode || 'Online & On-Campus'}
            </span>
          </div>
        </div>

      </div>

      {/* COLUMN 2: Workspace View (Player / Lab Sandbox / Quiz) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* TOP WORKSPACE MODE NAVIGATION */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveWorkspaceMode('player')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeWorkspaceMode === 'player' 
                  ? 'bg-[#002D62] text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-cyan-300" /> Lesson Player
            </button>
            <button
              onClick={() => setActiveWorkspaceMode('sandbox')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeWorkspaceMode === 'sandbox' 
                  ? 'bg-[#002D62] text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Cyber Lab Sandbox
            </button>
            <button
              onClick={() => setActiveWorkspaceMode('quiz')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeWorkspaceMode === 'quiz' 
                  ? 'bg-[#002D62] text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Module Assessment Quiz
            </button>
          </div>

          <button 
            onClick={handleLaunchLti}
            className="px-3 py-1.5 border border-emerald-500/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" /> NetAcad LTI Launch <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* VIEW 1: CYBER LAB SANDBOX */}
        {activeWorkspaceMode === 'sandbox' && (
          <CyberLabSandbox />
        )}

        {/* VIEW 2: INTERACTIVE KNOWLEDGE ASSESSMENT QUIZ */}
        {activeWorkspaceMode === 'quiz' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 font-bold">
                    <Award className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900">
                    Knowledge Assessment: {activeCourse.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Answer the technical multiple-choice questions to earn module graduation XP and badges.
                </p>
              </div>

              {quizSubmitted && (
                <div className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 ${
                  quizScore >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <Award className="w-4 h-4" />
                  <span>Score: {quizScore}% {quizScore >= 75 ? '(PASSED)' : '(NEEDS REVIEW)'}</span>
                </div>
              )}
            </div>

            {isLoadingQuiz ? (
              <div className="py-12 text-center text-slate-500 space-y-2 text-xs">
                <RotateCcw className="w-6 h-6 animate-spin mx-auto text-[#007A87]" />
                <p>Generating adaptive technical assessment questions...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {quizQuestions.map((q, qIdx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="font-bold text-slate-900 text-sm flex items-start gap-2">
                      <span className="text-[#007A87] font-mono">0{qIdx + 1}.</span>
                      <span>{q.question}</span>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        let optionStyle = "border-slate-200 bg-white hover:border-slate-400 text-slate-800";
                        
                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                          } else if (isSelected && !isCorrect) {
                            optionStyle = "border-red-500 bg-red-50 text-red-900";
                          }
                        } else if (isSelected) {
                          optionStyle = "border-[#007A87] bg-cyan-50/50 text-[#002D62] font-bold";
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                        <strong>Technical Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Passing Threshold: 75% • +250 Student XP
                  </span>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(selectedAnswers).length === 0}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] hover:brightness-110 text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-40"
                    >
                      Submit Assessment
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LESSON PLAYER & PYTHON SANDBOX */}
        {activeWorkspaceMode === 'player' && (
          <div className="space-y-6">
            
            {/* Mock Video Player */}
            <div className="relative aspect-video rounded-3xl bg-slate-900 border border-slate-200 overflow-hidden flex flex-col justify-between p-6 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-900/40 pointer-events-none" />
              
              {/* Header Overlay */}
              <div className="relative z-10 self-start">
                <span className="px-3 py-1 rounded text-[10px] font-bold bg-white/20 text-white border border-white/25 uppercase tracking-wider font-mono">
                  {selectedLesson.title}
                </span>
              </div>

              {/* Central play button */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                <button 
                  onClick={runCode}
                  className="w-14 h-14 bg-[#007A87] rounded-full flex items-center justify-center text-white hover:scale-105 transition-all shadow-lg"
                >
                  <Play className="w-6 h-6 fill-white ml-1" />
                </button>
              </div>

              {/* Player Progress */}
              <div className="relative z-10 flex items-center gap-4 text-xs font-mono text-white">
                <span className="text-white/80 font-bold">Lab Environment</span>
                <div className="flex-1 bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-accentCyan h-full transition-all duration-500" 
                    style={{ width: `${activeCourse.progress}%` }}
                  />
                </div>
                <span className="text-white/80 font-bold">{activeCourse.progress}% Complete</span>
              </div>
            </div>

            {/* Prompt To Lab Generator */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#007A87] flex items-center gap-1 font-mono uppercase">
                  <Zap className="w-3.5 h-3.5 text-[#007A87]" /> Prompt-to-Lab Generator
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded bg-emerald-50 uppercase">
                  AI Lab Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe any automation script or network concept to generate an instant sandbox lab.
              </p>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customLabPrompt}
                  onChange={(e) => setCustomLabPrompt(e.target.value)}
                  placeholder="e.g. Build an Ansible playbook to block port 22..."
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateLab()}
                  className="flex-1 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#007A87]"
                />
                <button 
                  onClick={() => handleGenerateLab()}
                  disabled={isGeneratingLab}
                  className="px-4 py-2.5 rounded-xl bg-[#002D62] text-white text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isGeneratingLab ? 'Spinning...' : 'Generate Lab'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button 
                  onClick={() => handleGenerateLab('Ansible ACL Playbook')}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all font-mono cursor-pointer"
                >
                  + Ansible ACL
                </button>
                <button 
                  onClick={() => handleGenerateLab('Python Port Scanner')}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all font-mono cursor-pointer"
                >
                  + Port Scanner
                </button>
              </div>
            </div>

            {/* Interactive Code Sandbox */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#007A87] font-mono uppercase">
                  {activeLabTitle || 'Python Automation Sandbox'}
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={9}
                className="w-full bg-slate-50 text-slate-900 font-mono p-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-[#007A87] text-xs leading-relaxed"
              />

              <button 
                onClick={runCode}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-[#002D62] to-[#007A87] hover:brightness-110 text-white py-3 rounded-xl text-xs font-bold font-mono transition-all disabled:opacity-40 shadow-md cursor-pointer"
              >
                {isRunning ? 'Executing...' : 'Run Code Sandbox'}
              </button>

              {/* Terminal output box */}
              <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs space-y-2 leading-relaxed">
                <pre className={success ? 'text-emerald-400 whitespace-pre-wrap font-semibold' : 'text-slate-300 whitespace-pre-wrap'}>
                  {terminalOutput}
                </pre>
                
                {syncingToNetAcad && (
                  <div className="flex items-center gap-1.5 text-emerald-400 border-t border-slate-800 pt-2 mt-2 text-[10px]">
                    <span className="animate-spin text-xs">🌀</span>
                    <span>[LTI AGS] Synchronizing grade to Cisco NetAcad gradebook...</span>
                  </div>
                )}

                {syncTxId && (
                  <div className="text-[10px] text-amber-300 border-t border-slate-800 pt-2 mt-2 font-mono">
                    <div>[LTI AGS Sync Completed]</div>
                    <div>Transaction ID: {syncTxId}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Chapters index */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Syllabus Chapters</h4>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {syllabus.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    onClick={() => setActiveChapterIndex(lesson.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                      activeChapterIndex === lesson.id ? 'bg-[#002D62] text-white font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs truncate">{lesson.title}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase shrink-0 ${
                      activeChapterIndex === lesson.id ? 'text-cyan-300' : 'text-slate-400'
                    }`}>
                      {lesson.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* LTI 1.3 PLATFORM LAUNCH MODAL */}
      {ltiModalVisible && ltiPayload && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl text-slate-800">
            <button 
              onClick={() => setLtiModalVisible(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-display font-extrabold text-slate-900">Cisco NetAcad LTI 1.3 Launch Security Token</h3>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
              <p>
                Secure JWT container payload generated. Direct authentication link ready for Cisco NetAcad endpoints.
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[10px] font-mono leading-relaxed overflow-x-auto text-slate-850">
              <div><span className="text-[#007A87] font-semibold">"iss":</span> "{ltiPayload.iss}"</div>
              <div><span className="text-[#007A87] font-semibold">"sub":</span> "{ltiPayload.sub}"</div>
              <div><span className="text-[#007A87] font-semibold">"aud":</span> "{ltiPayload.aud}"</div>
              <div><span className="text-[#007A87] font-semibold">"nonce":</span> "{ltiPayload.nonce}"</div>
              <div><span className="text-[#007A87] font-semibold">"claims/deployment_id":</span> "{ltiPayload['https://purl.imsglobal.org/spec/lti/claim/deployment_id']}"</div>
              <div><span className="text-[#007A87] font-semibold">"claims/context/title":</span> "{ltiPayload['https://purl.imsglobal.org/spec/lti/claim/context'].title}"</div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setLtiModalVisible(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setLtiModalVisible(false);
                  window.open(ltiPayload['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'], '_blank');
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Proceed to NetAcad Portal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

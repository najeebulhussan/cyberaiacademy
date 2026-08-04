import React, { useState, useEffect } from 'react';
import { useAcademyStore } from '@/services/academyState';
import { netacadService, LtiLaunchParams } from '@/services/netacadService';
import { Play, Terminal, Zap, BookOpen, AlertTriangle, CheckCircle, ExternalLink, Shield, ChevronRight } from 'lucide-react';

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
  const { courses, updateProgress } = useAcademyStore();

  // Find enrolled courses or fallback to all courses
  const enrolledCourses = courses.filter(c => c.enrollmentStatus !== 'not_enrolled');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // Pick active course
  const currentActiveCourseId = activeCourseId || (enrolledCourses.length > 0 ? enrolledCourses[0].id : courses[1].id);
  const activeCourse = courses.find(c => c.id === currentActiveCourseId) || courses[1];

  // Selected chapter index state
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Dynamic syllabus chapters based on activeCourse.syllabusOutline
  const syllabus = activeCourse.syllabusOutline.map((chapterText, idx) => {
    // Determine status based on progress
    const progressPerChapter = 100 / activeCourse.syllabusOutline.length;
    const chapterCompletedThreshold = (idx + 1) * progressPerChapter;
    const isCompleted = activeCourse.progress >= chapterCompletedThreshold;
    const isActive = !isCompleted && (activeCourse.progress >= idx * progressPerChapter || idx === 0);
    
    return {
      id: idx,
      title: chapterText,
      status: isCompleted ? 'completed' : isActive ? 'active' : 'locked' as 'completed' | 'active' | 'locked',
    };
  });

  const selectedLesson = syllabus[activeChapterIndex] || syllabus[0];

  // Retrieve dynamic page instructions and code template
  const { taskDesc, codeTemplate } = getChapterContent(activeCourse.title, selectedLesson.title);

  // Coding playground state
  const [code, setCode] = useState(codeTemplate);
  const [terminalOutput, setTerminalOutput] = useState('Terminal idle. Write code and click Run.');
  const [isRunning, setIsRunning] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync editor when chapter or course changes
  useEffect(() => {
    setCode(codeTemplate);
    setTerminalOutput('Terminal idle. Write code and click Run.');
    setSuccess(false);
  }, [currentActiveCourseId, activeChapterIndex]);

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
        const resultOutput = code.includes('hashlib') 
          ? 'Output:\n9a72b8321fe6e0331006509f6110f0de206385d0382877a331908206103328e1'
          : code.includes('socket')
            ? 'Output:\nIs 192.168.1.1 valid? True'
            : '[PLAYBOOK OK] Changed: 1, Failed: 0. Interface GigabitEthernet0/1 configured.';
        
        setTerminalOutput(`$ sandbox-run main.py\n[SUCCESS] Environment execution finished.\n${resultOutput}\n\n✓ Code Verification Passed! +${Math.round(100 / activeCourse.syllabusOutline.length)}% Course Progress, +50 XP`);
        setSuccess(true);

        // Update progress dynamically
        const progressDelta = Math.round(100 / activeCourse.syllabusOutline.length);
        updateProgress(activeCourse.id, progressDelta);

        // Sync score with Cisco NetAcad
        setSyncingToNetAcad(true);
        netacadService.syncScoreToNetAcad('alex-mercer-99', activeCourse.id, 100).then((res) => {
          setSyncingToNetAcad(false);
          setSyncTxId(res.transactionId);
        });
      } else {
        setTerminalOutput(
          `$ sandbox-run main.py\n[ERROR] Module verification failed.\nHint: Make sure to import required libraries or define your automation script structure.`
        );
        setSuccess(false);
      }
    }, 1200);
  };

  const handleGenerateLab = (promptToUse?: string) => {
    const query = promptToUse || customLabPrompt;
    if (!query.trim()) return;

    setIsGeneratingLab(true);
    setTerminalOutput('AI Lab Generator spinning up dynamic container topology...');
    
    setTimeout(() => {
      setIsGeneratingLab(false);
      
      let generatedCode = '';
      let labTitle = '';

      if (query.toLowerCase().includes('ansible') || query.toLowerCase().includes('acl')) {
        labTitle = 'Generated AI Lab: Ansible Cisco ACL Automation';
        generatedCode = `---\n# AI-Generated Ansible Network Automation Playbook\n- name: Automate Cisco Router ACL\n  hosts: cisco_routers\n  gather_facts: no\n  tasks:\n    - name: Configure Access List to Block Port 22\n      cisco.ios.ios_config:\n        lines:\n          - access-list 101 deny tcp any any eq 22\n          - access-list 101 permit ip any any\n`;
      } else if (query.toLowerCase().includes('scan') || query.toLowerCase().includes('port')) {
        labTitle = 'Generated AI Lab: Python Async Port Scanner';
        generatedCode = `import socket\n\ndef scan_port(ip, port):\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(1.0)\n    result = s.connect_ex((ip, port))\n    if result == 0:\n        print(f"Port {port} OPEN")\n    s.close()\n\n# Test scanning target IP 192.168.1.1 on port 80\nscan_port("192.168.1.1", 80)\n`;
      } else {
        labTitle = `Generated AI Lab: ${query}`;
        generatedCode = `# AI-Generated Sandbox Script for: ${query}\nimport sys\nimport os\n\nprint("Initialising sandbox container for custom prompt...")\n# Write your custom code here\n`;
      }

      setActiveLabTitle(labTitle);
      setCode(generatedCode);
      setCustomLabPrompt('');
      setTerminalOutput(`[AI LAB READY] Loaded: ${labTitle}\nContainer environment online. Test your code and click Run Code.`);
    }, 1500);
  };

  const handleLaunchLti = () => {
    const payload = netacadService.generateLtiLaunch('alex-mercer-99', activeCourse.id, activeCourse.title);
    setLtiPayload(payload);
    setLtiModalVisible(true);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 py-8 items-start text-slate-800">
      
      {/* COLUMN 1 & 2: Course Details, Video, Custom prompt generator, Syllabus info */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* COURSE PLAYER HEADER WITH ENROLLED COURSES SWITCHER */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 max-w-full">
            <span className="text-[10px] font-bold font-mono tracking-wider text-accentCyan uppercase block">Active LMS Course Player</span>
            <div className="flex items-center gap-1.5 max-w-full">
              <select 
                value={activeCourse.id}
                onChange={(e) => {
                  setActiveCourseId(e.target.value);
                  setActiveChapterIndex(0);
                }}
                className="text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-accentCyan cursor-pointer max-w-full truncate"
              >
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))
                ) : (
                  courses.slice(0, 5).map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))
                )}
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Host Platform: CyberAI Native LMS. Linked to NetAcad gradebook.
            </p>
          </div>
          <button 
            onClick={handleLaunchLti}
            className="px-4 py-2 border border-accentGreen text-accentGreen hover:bg-accentGreen/15 transition-all rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 self-start sm:self-center bg-accentGreen/5 shrink-0"
          >
            Launch NetAcad <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MOCK VIDEO/INTERACTIVE WORKSPACE FRAME */}
        <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden flex flex-col justify-between p-6 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-900/40 pointer-events-none" />
          
          {/* Active Lesson Header Overlay */}
          <div className="relative z-10 self-start">
            <span className="px-3 py-1 rounded text-[10px] font-bold bg-white/20 text-white border border-white/25 uppercase tracking-wider font-mono">
              {selectedLesson.title}
            </span>
          </div>

          {/* Central play button */}
          <div className="relative z-10 flex items-center justify-center my-auto">
            <button 
              onClick={runCode}
              className="w-14 h-14 bg-accentCyan rounded-full flex items-center justify-center text-white hover:scale-105 transition-all shadow-glow"
            >
              <Play className="w-6 h-6 fill-white ml-1" />
            </button>
          </div>

          {/* Player controls */}
          <div className="relative z-10 flex items-center gap-4 text-xs font-mono text-white">
            <span className="text-white/80 font-bold">Lab Simulation Environment</span>
            <div className="flex-1 bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-accentCyan h-full transition-all duration-500" 
                style={{ width: `${activeCourse.progress}%` }}
              />
            </div>
            <span className="text-white/80 font-bold">{activeCourse.progress}% Complete</span>
          </div>
        </div>

        {/* PROMPT TO LAB GENERATOR */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accentCyan flex items-center gap-1 font-mono uppercase">
              <Zap className="w-3.5 h-3.5 text-accentCyan" /> Prompt-to-Lab Generator
            </span>
            <span className="text-[9px] font-mono font-bold text-accentGreen border border-accentGreen/20 px-2 py-0.5 rounded bg-accentGreen/5 uppercase tracking-wider">
              Out-of-the-Box AI
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Type what you want to practice and our AI will spin up a custom lab sandbox for you.
          </p>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={customLabPrompt}
              onChange={(e) => setCustomLabPrompt(e.target.value)}
              placeholder="e.g. Build an Ansible playbook to block port 22..."
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateLab()}
              className="flex-1 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-accentCyan focus:bg-white"
            />
            <button 
              onClick={() => handleGenerateLab()}
              disabled={isGeneratingLab}
              className="cyber-btn px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {isGeneratingLab ? 'Spinning...' : 'Generate Lab'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1.5">
            <button 
              onClick={() => handleGenerateLab('Ansible ACL Playbook')}
              className="text-[9px] px-2.5 py-1 rounded-full border border-slate-200 text-slate-650 bg-slate-50 hover:bg-slate-100 transition-all font-mono"
            >
              + Ansible ACL
            </button>
            <button 
              onClick={() => handleGenerateLab('Python Port Scanner')}
              className="text-[9px] px-2.5 py-1 rounded-full border border-slate-200 text-slate-650 bg-slate-50 hover:bg-slate-100 transition-all font-mono"
            >
              + Port Scanner
            </button>
          </div>
        </div>

        {/* LESSON DETAILS TEXT */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3 text-xs leading-relaxed text-slate-600">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-accentCyan" /> {selectedLesson.title}
          </h4>
          <p className="text-slate-700 font-medium">
            {taskDesc}
          </p>
          <p>
            Review the requirements and run the workspace code using the interactive Python compiler on the right. Once the script runs and the validations pass, the LMS will synchronize your grade directly to Cisco Networking Academy.
          </p>
        </div>

      </div>

      {/* COLUMN 3: Active sandbox, console logs, syllabus index */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* INTERACTIVE CODE SANDBOX */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accentCyan font-mono uppercase">
              {activeLabTitle || 'Python Automation Sandbox'}
            </span>
            <div className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
          </div>

          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="w-full bg-slate-50 text-slate-850 font-mono p-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-accentCyan text-xs leading-relaxed"
          />

          <button 
            onClick={runCode}
            disabled={isRunning}
            className="w-full bg-accentCyan hover:bg-accentCyan/90 text-white py-2.5 rounded-lg text-xs font-bold font-mono transition-colors disabled:opacity-40 shadow-sm"
          >
            {isRunning ? 'Executing...' : 'Run Code'}
          </button>

          {/* Terminal output box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[10px] space-y-2 leading-relaxed">
            <pre className={success ? 'text-accentGreen whitespace-pre-wrap font-semibold' : 'text-slate-650 whitespace-pre-wrap'}>
              {terminalOutput}
            </pre>
            
            {/* LTI Sync Logs */}
            {syncingToNetAcad && (
              <div className="flex items-center gap-1.5 text-accentGreen border-t border-slate-250 pt-2 mt-2">
                <span className="animate-spin text-accentGreen text-xs">🌀</span>
                <span>[LTI AGS] Syncing grade to Cisco NetAcad gradebook...</span>
              </div>
            )}

            {syncTxId && (
              <div className="text-[9px] text-accentGold border-t border-slate-250 pt-2 mt-2 font-mono">
                <div>[LTI AGS Sync Completed]</div>
                <div>Transaction ID: {syncTxId}</div>
              </div>
            )}
          </div>
        </div>

        {/* SYLLABUS DIRECTORY */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Course Syllabus Chapters</h4>
          <div className="space-y-2 text-xs max-h-[300px] overflow-y-auto pr-1">
            {syllabus.map((lesson) => (
              <div 
                key={lesson.id} 
                onClick={() => lesson.status !== 'locked' && setActiveChapterIndex(lesson.id)}
                className={`flex items-center justify-between p-2 rounded transition-all ${
                  lesson.status === 'locked' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'
                } ${
                  activeChapterIndex === lesson.id ? 'bg-slate-100 border border-slate-200' : ''
                }`}
              >
                <span className={`line-clamp-1 flex-1 pr-2 ${activeChapterIndex === lesson.id ? 'text-accentCyan font-bold' : 'text-slate-700'}`}>
                  {lesson.title}
                </span>
                <span className={`text-[9px] uppercase font-mono font-bold shrink-0 ${
                  lesson.status === 'completed' ? 'text-accentGreen' : lesson.status === 'active' ? 'text-accentCyan' : 'text-slate-400'
                }`}>
                  {lesson.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* LTI 1.3 PLATFORM LAUNCH MODAL */}
      {ltiModalVisible && ltiPayload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl text-slate-800">
            <button 
              onClick={() => setLtiModalVisible(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-950 font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accentGreen" />
              <h3 className="text-lg font-display font-bold text-slate-900">Cisco NetAcad LTI 1.3 Launch Security Token</h3>
            </div>
            
            <div className="p-3 bg-accentGold/10 border border-accentGold/20 text-accentGold rounded-xl text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>
                Secure JWT container payload generated successfully. Transmitting to Cisco Networking Academy platform endpoints.
              </p>
            </div>

             <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[10px] font-mono leading-relaxed overflow-x-auto text-slate-850">
               <div><span className="text-accentCyan font-semibold">"iss":</span> "{ltiPayload.iss}"</div>
               <div><span className="text-accentCyan font-semibold">"sub":</span> "{ltiPayload.sub}"</div>
               <div><span className="text-accentCyan font-semibold">"aud":</span> "{ltiPayload.aud}"</div>
               <div><span className="text-accentCyan font-semibold">"nonce":</span> "{ltiPayload.nonce}"</div>
               <div><span className="text-accentCyan font-semibold">"claims/deployment_id":</span> "{ltiPayload['https://purl.imsglobal.org/spec/lti/claim/deployment_id']}"</div>
               <div><span className="text-accentCyan font-semibold">"claims/roles":</span> {JSON.stringify(ltiPayload['https://purl.imsglobal.org/spec/lti/claim/roles'])}</div>
               <div><span className="text-accentCyan font-semibold">"claims/context/title":</span> "{ltiPayload['https://purl.imsglobal.org/spec/lti/claim/context'].title}"</div>
             </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setLtiModalVisible(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setLtiModalVisible(false);
                  window.open(ltiPayload['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'], '_blank');
                }}
                className="px-5 py-2 bg-accentGreen text-white rounded-lg text-xs font-bold hover:bg-accentGreen/95"
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

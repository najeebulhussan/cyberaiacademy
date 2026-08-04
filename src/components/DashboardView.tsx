import React, { useState, useEffect } from 'react';
import { useAcademyStore } from '@/services/academyState';
import { netacadService } from '@/services/netacadService';
import { Shield, Award, CheckCircle, Flame, Clock, Trophy, Play, Terminal, HelpCircle, Activity } from 'lucide-react';

interface NodeItem {
  id: string;
  label: string;
  category: string;
  description: string;
  status: 'completed' | 'active' | 'locked';
  x: number; // percentage width
  y: number; // pixel height
}

const NODES: NodeItem[] = [
  { id: '1', label: 'Linux Essentials & Commands', category: 'Operating Systems', description: 'Prerequisite for operations. NDG Linux command basics.', status: 'completed', x: 50, y: 40 },
  { id: '2', label: 'CCNA: Intro to Networks', category: 'Networking', description: 'Underlying network architectures, packets, protocol structures.', status: 'completed', x: 25, y: 130 },
  { id: '3', label: 'Introduction to Cybersecurity', category: 'Cybersecurity', description: 'Essential threat intelligence, CIA triad, defense guidelines.', status: 'completed', x: 75, y: 130 },
  { id: '4', label: 'Python Essentials I', category: 'Programming', description: 'Write basic automation functions and script handlers.', status: 'active', x: 50, y: 220 },
  { id: '5', label: 'Cisco CyberOps Associate', category: 'Cybersecurity', description: 'Security Operations, log parsing, threat detection playbooks.', status: 'active', x: 85, y: 220 },
  { id: '6', label: 'Cisco DevNet Associate', category: 'Automation', description: 'REST APIs, Git controllers, software routing configs.', status: 'locked', x: 25, y: 310 },
  { id: '7', label: 'Network Automation Playbooks', category: 'Automation', description: 'Trigger Ansible tasks, apply ACLs via Python automation.', status: 'locked', x: 50, y: 310 },
];

export default function DashboardView() {
  const { courses, badges, profile, updateProgress } = useAcademyStore();
  const [selectedNode, setSelectedNode] = useState<NodeItem>(NODES[3]);
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  // NETACAD SS LINKAGE SIMULATION
  const [netacadStatus, setNetacadStatus] = useState({
    linked: true,
    netacadUserId: 'alex_mercer@netacad.edu',
    syncedCoursesCount: 2,
    lastSynced: new Date().toISOString().split('T')[0]
  });
  const [syncing, setSyncing] = useState(false);

  const triggerNetacadSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setNetacadStatus({
        linked: true,
        netacadUserId: 'alex_mercer@netacad.edu',
        syncedCoursesCount: 3,
        lastSynced: new Date().toISOString().split('T')[0]
      });
    }, 1200);
  };

  // Compute Career Goal progress
  const targetPathwayCourses = profile.targetPathway
    ? (profile.targetPathway.includes('Cybersecurity')
        ? courses.filter(c => ['intro-cyber', 'networking-essentials', 'cyberops'].includes(c.id))
        : courses.filter(c => ['python-essentials-1', 'devnet', 'network-automation-ansible'].includes(c.id)))
    : [];

  const avgPathwayProgress = targetPathwayCourses.length > 0
    ? Math.round(targetPathwayCourses.reduce((sum, c) => sum + c.progress, 0) / targetPathwayCourses.length)
    : 0;

  // CODING DUEL STATES
  const [inDuel, setInDuel] = useState(false);
  const [duelTimer, setDuelTimer] = useState(45);
  const [botProgress, setBotProgress] = useState(0);
  const [userCode, setUserCode] = useState(
`# CyberAI Duel: Write a Python script to filter IP packets matching subnet 192.168.1.0/24
def parse_subnet_ips(packet_list):
    # TODO: Write logic to filter IPs and return list
    pass`
  );
  const [duelFinished, setDuelFinished] = useState(false);
  const [duelWinner, setDuelWinner] = useState<'user' | 'bot' | null>(null);
  const [refereeLog, setRefereeLog] = useState('Standby. Click Find Match to seek a network programmer bot.');

  useEffect(() => {
    let timer: any;
    let botTimer: any;

    if (inDuel && !duelFinished) {
      // Countdown timer
      timer = setInterval(() => {
        setDuelTimer((prev) => {
          if (prev <= 1) {
            setDuelFinished(true);
            setDuelWinner('bot');
            setRefereeLog('Time expired! Cyber Bot 9000 finishes its Ansible automation scripts and wins the duel.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Bot progress speed simulation
      botTimer = setInterval(() => {
        setBotProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 2;
          if (next >= 100) {
            setDuelFinished(true);
            setDuelWinner('bot');
            setRefereeLog('System Match: Cyber Bot 9000 submits a certified parse solution and wins the duel! (+0 XP)');
            clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(botTimer);
    };
  }, [inDuel, duelFinished]);

  const startDuel = () => {
    setInDuel(true);
    setDuelTimer(45);
    setBotProgress(0);
    setDuelFinished(false);
    setDuelWinner(null);
    setRefereeLog('Race active! Code a script to parse 192.168.1.0/24 IP subnets faster than the AI Bot.');
    setUserCode(
`# CyberAI Duel: Write a Python script to filter IP packets matching subnet 192.168.1.0/24
def parse_subnet_ips(packet_list):
    # Complete your python script here:
    
`
    );
  };

  const submitUserCode = () => {
    if (duelFinished) return;
    setDuelFinished(true);
    setDuelWinner('user');
    setRefereeLog('Referee Review: Solution parsed. Cryptographic verification success! You win! (+250 XP)');
    // Increment progress
    updateProgress('devnet', 10);
  };

  // Weekly Checklist Mock
  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 1, text: 'Complete Cisco Intro to Cybersecurity', done: true },
    { id: 2, text: 'Perform LTI launch in Linux Essentials Lab', done: true },
    { id: 3, text: 'Practice 2 Coding Duels against Cyber Bot', done: false },
    { id: 4, text: 'Solve the Ansible routing sync code sandbox', done: false },
  ]);

  const toggleGoal = (id: number) => {
    setWeeklyGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  return (
    <div className="space-y-12 py-8 text-slate-800">
      
      {/* USER PROFILE RANK CARD */}
      <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accentCyan to-accentPurple p-1">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xl text-slate-900">
              AM
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-black text-slate-900">{profile.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentCyan/10 text-accentCyan">
                {profile.rank}
              </span>
            </div>
            <p className="text-xs text-slate-500">Linked to Cisco NetAcad Platform</p>
          </div>
        </div>

        <div className="flex gap-6 text-sm">
          <div className="space-y-1">
            <span className="text-[10px] block font-mono text-slate-500 uppercase tracking-wider">Experience</span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Flame className="w-4 h-4 text-accentGold" /> {profile.xp} XP
            </div>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-6">
            <span className="text-[10px] block font-mono text-slate-500 uppercase tracking-wider">Study Time</span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Clock className="w-4 h-4 text-accentCyan" /> {profile.studyHours} hrs
            </div>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-6">
            <span className="text-[10px] block font-mono text-slate-500 uppercase tracking-wider">Credentials</span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Trophy className="w-4 h-4 text-accentPurple" /> {profile.certificatesCount} Earned
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PATHWAY TRACKER & SYNC PANEL */}
        <div className="md:col-span-1 space-y-8">
          
          {/* Active Career Goal Progress */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Current Target Plan</span>
              <h4 className="text-md font-bold text-slate-900">{profile.targetPathway || 'No Active Career Target'}</h4>
            </div>

            {profile.targetPathway && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Certification Readiness</span>
                  <span className="font-bold text-accentCyan font-mono">{avgPathwayProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-accentCyan to-accentPurple h-full rounded-full transition-all duration-700" 
                    style={{ width: `${avgPathwayProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block leading-relaxed">
                  Completing NetAcad modules unlocks the final cryptographic exam and W3C digital badge.
                </span>
              </div>
            )}
          </div>

          {/* Cisco NetAcad Linkage panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Cisco NetAcad Linkage</h4>
                <p className="text-xs text-slate-500">SAML SSO Account Status</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-accentGreen/10 text-accentGreen border border-accentGreen/20">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center text-[10px] font-mono text-slate-700">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[8px] uppercase">Student ID</span>
                <span className="font-semibold block text-slate-800 truncate">alex_mercer</span>
              </div>
              <div className="border-x border-slate-200 space-y-0.5">
                <span className="text-slate-500 text-[8px] uppercase">Linked tracks</span>
                <span className="font-semibold block text-slate-800">{netacadStatus.syncedCoursesCount} synced</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[8px] uppercase">Last sync</span>
                <span className="font-semibold block text-slate-800">{netacadStatus.lastSynced}</span>
              </div>
            </div>

            <button 
              onClick={triggerNetacadSync}
              disabled={syncing}
              className="w-full cyber-btn py-2.5 rounded-lg text-xs font-semibold"
            >
              {syncing ? 'Synchronizing LTI Grades...' : 'Sync with Cisco NetAcad'}
            </button>
          </div>

          {/* Weekly Goals checklist */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900">Weekly Target Goals</h4>
              <p className="text-xs text-slate-500">Complete tasks to earn XP and rank up.</p>
            </div>
            
            <div className="space-y-2.5 pt-2">
              {weeklyGoals.map((g) => (
                <div 
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    g.done ? 'bg-accentGreen border-accentGreen text-slate-900' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {g.done && <CheckCircle className="w-3 h-3 text-white fill-current" />}
                  </div>
                  <span className={`text-xs ${g.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {g.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (2/3): SVG CONSTELLATION MAP & CODING DUEL ARENA */}
        <div className="md:col-span-2 space-y-8">
          
          {/* CONSTELLATION SKILL TREE MAP */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Interactive Skill Tree Constellation</h4>
              <p className="text-xs text-slate-500">Click nodes to view prerequisites and aligned courses.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-2">
              {/* SVG Visual Pane */}
              <div className="md:col-span-2 relative h-[300px] border border-slate-200 bg-slate-50 rounded-xl overflow-hidden shadow-inner">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Node connection lines */}
                  <line x1="180" y1="40" x2="80" y2="130" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3" />
                  <line x1="180" y1="40" x2="280" y2="130" stroke="#00FF87" strokeWidth="2" />
                  <line x1="280" y1="130" x2="180" y2="220" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3" />
                  <line x1="280" y1="130" x2="320" y2="220" stroke="#E2E8F0" strokeWidth="1.5" />
                  <line x1="80" y1="130" x2="100" y2="310" stroke="#E2E8F0" strokeWidth="1.5" />
                  <line x1="180" y1="220" x2="100" y2="310" stroke="#E2E8F0" strokeWidth="1.5" />
                </svg>

                {/* Node buttons */}
                {NODES.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`absolute w-6 h-6 rounded-full -translate-x-3 -translate-y-3 flex items-center justify-center transition-all ${
                      selectedNode?.id === node.id 
                        ? 'bg-slate-900 border-2 scale-125 z-10 shadow-md' 
                        : 'bg-white border hover:scale-110 shadow-sm'
                    }`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}px`,
                      borderColor: node.status === 'completed' ? '#15803D' : node.status === 'active' ? '#0284C7' : '#94A3B8'
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      node.status === 'completed' ? 'bg-accentGreen' : node.status === 'active' ? 'bg-accentCyan' : 'bg-slate-300'
                    }`} />
                  </button>
                ))}
              </div>

              {/* Selected Node Details */}
              <div className="md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between text-xs space-y-4 shadow-sm">
                <div className="space-y-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider uppercase ${
                    selectedNode.status === 'completed' ? 'bg-accentGreen/15 text-accentGreen' : selectedNode.status === 'active' ? 'bg-accentCyan/15 text-accentCyan' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {selectedNode.status.toUpperCase()}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedNode.label}</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedNode.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="block text-[8px] text-slate-500 font-mono uppercase">Category</span>
                  <span className="font-semibold text-slate-700">{selectedNode.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CODING DUEL ARENA */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  ⚔️ AI Co-Pilot Coding Duels
                </h4>
                <p className="text-xs text-slate-500">Multiplayer automation scripting race against AI bot in real-time.</p>
              </div>
              {!inDuel && (
                <button 
                  onClick={startDuel}
                  className="cyber-btn px-4 py-2 rounded-lg text-xs"
                >
                  Find Match
                </button>
              )}
            </div>

            {inDuel && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                {/* Scoreboard */}
                <div className="grid grid-cols-3 gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-xs">
                  <div className="text-left space-y-0.5">
                    <span className="text-accentCyan font-bold">{profile.name} (You)</span>
                    <span className="block text-[9px] text-accentGreen font-mono uppercase tracking-wider">Coding...</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full border mx-auto font-mono bg-white shadow-sm ${
                    duelTimer < 15 ? 'border-red-500 text-red-500 animate-pulse' : 'border-slate-300 text-slate-600'
                  }`}>
                    {duelTimer}s
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-accentPurple font-bold">Cyber Bot 9000</span>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">{botProgress}%</span>
                      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-accentPurple h-full" style={{ width: `${botProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referee Feed */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
                  <span className="text-accentCyan mr-1 font-semibold">🎙️ Referee:</span>
                  <span className={duelWinner === 'user' ? 'text-accentGreen font-semibold' : 'text-slate-600'}>
                    {refereeLog}
                  </span>
                </div>

                {/* Textarea input code */}
                <div className="space-y-2">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    disabled={duelFinished}
                    rows={6}
                    className="w-full bg-slate-50 text-slate-850 font-mono p-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-accentCyan text-xs leading-relaxed"
                  />
                  <button
                    onClick={submitUserCode}
                    disabled={duelFinished}
                    className="w-full bg-accentGreen hover:bg-accentGreen/90 text-white py-2.5 rounded-lg text-xs font-bold font-mono transition-colors disabled:opacity-40"
                  >
                    Submit Code Solution
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VERIFIABLE CREDENTIALS */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900">Verifiable Badges & Credentials</h4>
              <p className="text-xs text-slate-500">Cryptographically signed Open Badges & W3C Verifiable Credentials.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm" style={{ backgroundColor: badge.color }}>
                      {badge.name[0]}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{badge.name}</h5>
                      <span className="text-[10px] text-slate-500 font-mono block">Earned: {badge.earnedDate}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedBadge(badge)}
                    className="text-[10px] px-3 py-1 rounded border border-accentCyan text-accentCyan hover:bg-accentCyan/15 transition-all font-mono"
                  >
                    Verify
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CREDENTIAL VERIFICATION MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl text-slate-850">
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
            <h3 className="text-lg font-display font-bold text-slate-900">Credential Cryptographic Verification</h3>

            <div className="flex flex-col items-center text-center space-y-2 py-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-4xl text-white mb-2 shadow-lg" style={{ backgroundColor: selectedBadge.color }}>
                {selectedBadge.name[0]}
              </div>
              <h4 className="font-bold text-slate-900">{selectedBadge.name}</h4>
              <p className="text-xs text-slate-500 px-4">{selectedBadge.description}</p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-[10px] font-mono leading-relaxed text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Standard</span>
                <span className="text-slate-800 font-semibold">Open Badges 3.0 / W3C VC</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Issuer</span>
                <span className="text-slate-800 font-semibold">Cisco NetAcad & CyberAI</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Recipient</span>
                <span className="text-slate-800 font-semibold">{profile.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Status</span>
                <span className="text-accentGreen font-semibold">✓ Valid cryptosignature</span>
              </div>
              <div className="pt-2">
                <span className="block text-slate-500 mb-1">Cryptographic Hash</span>
                <span className="text-accentCyan block break-all leading-normal bg-slate-100 p-2 rounded border border-slate-200">
                  {selectedBadge.hash}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full cyber-btn py-2.5 rounded-lg font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

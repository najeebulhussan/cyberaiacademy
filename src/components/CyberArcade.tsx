import React, { useState } from 'react';
import { Shield, Zap, Terminal, Trophy, Flame, Play, Sparkles, CheckCircle2, Lock, Cpu, RotateCcw, AlertTriangle } from 'lucide-react';

export default function CyberArcade() {
  // Game 1: Cyber Defense Challenge
  const [defenseScore, setDefenseScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [attackStatus, setAttackStatus] = useState<'idle' | 'under_attack' | 'defended' | 'cracked'>('idle');
  const [gameLog, setGameLog] = useState<string>('Click "START CYBER DEFENSE" to launch live hacker attack simulation!');

  // Game 2: Career Quiz Persona Matcher
  const [quizStep, setQuizStep] = useState(0);
  const [persona, setPersona] = useState<{ title: string; salary: string; cert: string; match: string } | null>(null);

  const startAttack = () => {
    setAttackStatus('under_attack');
    setGameLog('⚠️ INCOMING SYN-FLOOD DDOS ATTACK FROM IP 185.220.101.5! DEPLOY FIREWALL SHIELD NOW!');
  };

  const handleDefend = () => {
    if (attackStatus !== 'under_attack') return;
    setAttackStatus('defended');
    const newScore = defenseScore + 250;
    setDefenseScore(newScore);
    if (newScore >= 500) setLevel(2);
    if (newScore >= 1000) setLevel(3);
    setGameLog('⚡ CRITICAL SUCCESS! DDoS Attack Mitigation Active. Blocked 45,000 rogue IP packets. +250 XP Awarded!');
  };

  const handleCrackHash = () => {
    setAttackStatus('cracked');
    setDefenseScore((prev) => prev + 150);
    setGameLog('🔓 HASH CRACKED: SHA-256 Digest decoded ➔ Passcode: "CyberGuardian2026". +150 XP!');
  };

  const resetGame = () => {
    setAttackStatus('idle');
    setGameLog('Simulation reset. Select an attack pattern to test your cyber defense skills!');
  };

  const selectPersona = (type: 'cyber' | 'ai' | 'networking') => {
    if (type === 'cyber') {
      setPersona({
        title: 'SOC Cyber Defense Specialist 🛡️',
        salary: '$92,000 / year',
        cert: 'Cisco CCST & CyberOps Associate',
        match: '98% Match'
      });
    } else if (type === 'ai') {
      setPersona({
        title: 'AI & MLOps Automation Engineer 🤖',
        salary: '$115,000 / year',
        cert: 'Python Essentials & Cisco DevNet',
        match: '96% Match'
      });
    } else {
      setPersona({
        title: 'Enterprise Network Architect 🌐',
        salary: '$105,000 / year',
        cert: 'Cisco CCNA 200-301 & CCNP Enterprise',
        match: '99% Match'
      });
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* HEADER TITLE */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-gradient-to-r from-accentCyan to-accentGreen text-slate-950 inline-flex items-center gap-1.5 uppercase shadow-glow">
          <Flame className="w-3.5 h-3.5 fill-slate-950 animate-bounce" /> Gamified Cyber Arcade & Challenge Arena
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900">
          Play, Hack & Test Your Tech Superpowers!
        </h2>
        <p className="text-slate-600 text-xs md:text-sm">
          Interactive hands-on challenges built directly into Network Home Institute. Earn XP, stop live cyber attacks, and unlock your career match!
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* GAME 1: CYBER DEFENSE ARENA */}
        <div className="lg:col-span-7 bg-slate-950 border-2 border-[#007A87] rounded-3xl p-6 shadow-[0_0_30px_rgba(0,122,135,0.25)] space-y-6 text-white relative overflow-hidden">
          
          {/* Top Bar Scoreboard */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accentGold animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Cyber Rank</span>
                <span className="text-xs font-bold font-mono text-accentGreen">Level {level} Cyber Defender</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Earned XP Score</span>
              <span className="text-lg font-bold font-mono text-accentCyan">+{defenseScore} XP</span>
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className={`p-6 rounded-2xl border transition-all duration-500 text-center space-y-4 ${
            attackStatus === 'under_attack' 
              ? 'bg-red-950/80 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse' 
              : attackStatus === 'defended'
                ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : attackStatus === 'cracked'
                  ? 'bg-cyan-950/80 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-slate-800/80 border border-slate-700">
              {attackStatus === 'under_attack' && <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />}
              {attackStatus === 'defended' && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
              {attackStatus === 'cracked' && <Sparkles className="w-8 h-8 text-cyan-400" />}
              {attackStatus === 'idle' && <Shield className="w-8 h-8 text-accentCyan" />}
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold font-mono">
                {attackStatus === 'under_attack' && '⚠️ RED ALERT: UNDER HEAVY CYBER ATTACK!'}
                {attackStatus === 'defended' && '🛡️ ATTACK MITIGATED! FIREWALL SECURED'}
                {attackStatus === 'cracked' && '🔓 HASH CRACKED SUCCESSFULLY!'}
                {attackStatus === 'idle' && 'SYSTEM READY FOR CYBER DEFENSE TEST'}
              </h4>
              <p className="text-xs font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                {gameLog}
              </p>
            </div>
          </div>

          {/* Game Action Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={startAttack}
              className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Flame className="w-4 h-4" /> Simulate Attack
            </button>

            <button
              onClick={handleDefend}
              disabled={attackStatus !== 'under_attack'}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white p-3 rounded-xl font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Shield className="w-4 h-4" /> Deploy Shield
            </button>

            <button
              onClick={handleCrackHash}
              className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 col-span-2 sm:col-span-1"
            >
              <Lock className="w-4 h-4" /> Crack Hash
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button 
              onClick={resetGame} 
              className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Simulator
            </button>
          </div>
        </div>

        {/* GAME 2: CAREER MATCH & SALARY CALCULATOR */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xl space-y-5 text-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#007A87] uppercase tracking-wider block">
              Interactive Quiz
            </span>
            <h3 className="text-xl font-display font-bold text-slate-900">
              Find Your Tech Superpower & Salary Match
            </h3>
            <p className="text-xs text-slate-500">
              Select what excites you most to discover your career track at Network Home Multan:
            </p>
          </div>

          {/* Quiz Selection Cards */}
          <div className="space-y-2.5">
            <button
              onClick={() => selectPersona('cyber')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#007A87] bg-slate-50 hover:bg-slate-100/80 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Hacking & Defensive Cyber Security</h4>
                  <span className="text-[10px] text-slate-500">Stopping hackers, SOC logs, PCAP forensic audits</span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-[#007A87]" />
            </button>

            <button
              onClick={() => selectPersona('ai')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#007A87] bg-slate-50 hover:bg-slate-100/80 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">AI Coding & Python Automation</h4>
                  <span className="text-[10px] text-slate-500">LLM bots, Ansible playbooks, Data Science</span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-[#007A87]" />
            </button>

            <button
              onClick={() => selectPersona('networking')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#007A87] bg-slate-50 hover:bg-slate-100/80 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cisco Routers, Switches & Cloud Racks</h4>
                  <span className="text-[10px] text-slate-500">CCNA routing, VLANs, enterprise infrastructure</span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-[#007A87]" />
            </button>
          </div>

          {/* Matched Persona Result Display */}
          {persona && (
            <div className="p-4 rounded-2xl bg-[#002D62] text-white space-y-2 animate-fade-in shadow-lg border border-[#007A87]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-accentGreen uppercase tracking-wider">{persona.match}</span>
                <span className="text-[10px] font-mono text-accentCyan font-bold">Multan Campus Approved</span>
              </div>
              <h4 className="text-sm font-bold text-white">{persona.title}</h4>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700">
                <span className="text-slate-300">Avg Salary: <strong className="text-accentGreen font-mono">{persona.salary}</strong></span>
                <span className="text-slate-300">Goal: <strong className="text-accentCyan">{persona.cert}</strong></span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

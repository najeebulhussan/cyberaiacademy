import React, { useState } from 'react';
import { Network, Server, Shield, Cpu, Play, CheckCircle2, RefreshCw, Zap, Terminal, Activity } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'ai_server' | 'pc';
  ip: string;
  status: 'online' | 'pinging' | 'secured';
}

export default function NetworkSimulator() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', name: 'Multan Core Router 4331', type: 'router', ip: '192.168.1.1', status: 'online' },
    { id: '2', name: 'Bosan Rd Catalyst Switch', type: 'switch', ip: '192.168.1.2', status: 'online' },
    { id: '3', name: 'Network Home ASA Firewall', type: 'firewall', ip: '10.0.0.1', status: 'secured' },
    { id: '4', name: 'AI Model Cloud Server', type: 'ai_server', ip: '10.0.0.10', status: 'online' },
  ]);

  const [activeTab, setActiveTab] = useState<'ping' | 'firewall' | 'ai'>('ping');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Network Home Bosan Road Multan Hardware Simulator Ready.',
    '[INFO] Physical Racks Online: Cisco 4331, Catalyst 2960, ASA Firewall.',
    'Select a simulation test below to simulate live packet flows...'
  ]);

  const runSimulation = (mode: 'ping' | 'firewall' | 'ai') => {
    setIsSimulating(true);
    setLogs((prev) => [`[INIT] Spinning up container topology for ${mode.toUpperCase()} simulation...`, ...prev]);

    setTimeout(() => {
      if (mode === 'ping') {
        setLogs((prev) => [
          '✓ [SUCCESS] 4 Packets Transmitted: 0% Loss. Avg Latency: 2.1ms.',
          '[PING] Sending 64 bytes ICMP payload to 192.168.1.1 (Cisco Router 4331)...',
          ...prev
        ]);
      } else if (mode === 'firewall') {
        setLogs((prev) => [
          '🛡️ [SECURITY AUDIT] ASA Firewall Rule #101 PASSED: Blocked Unauthorized TCP Port 22 Portscan.',
          '[FIREWALL] Inspecting packet headers against CIA Triad Security Rules...',
          ...prev
        ]);
      } else {
        setLogs((prev) => [
          '🤖 [AI MODEL] Generated Ansible Playbook: Successfully pushed VLAN 10 config to 2 devices.',
          '[AI MESH] Executing LLM prompt-to-code automation routine...',
          ...prev
        ]);
      }
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#002D62] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 overflow-hidden relative">
      {/* Background Neon Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="simGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00F2FE" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#simGrid)" />
        </svg>
      </div>

      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accentCyan/10 border border-accentCyan/30 text-accentCyan text-xs font-mono font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse text-accentGreen" /> Interactive Hardware Simulator
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            Multan Campus Network & AI Topology Lab
          </h3>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button 
            onClick={() => { setActiveTab('ping'); runSimulation('ping'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ping' ? 'bg-accentCyan text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" /> ICMP Ping Test
          </button>
          <button 
            onClick={() => { setActiveTab('firewall'); runSimulation('firewall'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'firewall' ? 'bg-accentGreen text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Firewall Audit
          </button>
          <button 
            onClick={() => { setActiveTab('ai'); runSimulation('ai'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ai' ? 'bg-accentPurple text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> AI Automation
          </button>
        </div>
      </div>

      {/* Topology Nodes Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        {nodes.map((node) => (
          <div 
            key={node.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-accentCyan/50 rounded-2xl p-4 space-y-3 transition-all duration-300 hover:scale-[1.03] group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-accentCyan/10 text-accentCyan flex items-center justify-center group-hover:bg-accentCyan group-hover:text-slate-950 transition-colors">
                {node.type === 'router' && <Network className="w-5 h-5" />}
                {node.type === 'switch' && <Server className="w-5 h-5" />}
                {node.type === 'firewall' && <Shield className="w-5 h-5" />}
                {node.type === 'ai_server' && <Cpu className="w-5 h-5" />}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-accentGreen animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white truncate" title={node.name}>{node.name}</h4>
              <span className="text-[10px] font-mono text-slate-400 block">{node.ip}</span>
            </div>

            <div className="pt-1 flex items-center justify-between border-t border-slate-800 text-[9px] font-mono text-accentGreen">
              <span>ONLINE</span>
              <span>100Gbps</span>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Output Log Window */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-[11px] space-y-2 relative z-10 shadow-inner">
        <div className="flex items-center justify-between text-slate-500 border-b border-slate-850 pb-2 text-[10px]">
          <span className="flex items-center gap-1.5 text-accentCyan font-bold">
            <Terminal className="w-3.5 h-3.5" /> Multan Campus Hardware Sandbox Log
          </span>
          <button 
            onClick={() => runSimulation(activeTab)}
            disabled={isSimulating}
            className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-accentGreen"
          >
            <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} /> {isSimulating ? 'Executing...' : 'Re-Run Test'}
          </button>
        </div>

        <div className="h-28 overflow-y-auto space-y-1.5 pr-2 leading-relaxed text-slate-300">
          {logs.map((log, index) => (
            <div 
              key={index}
              className={
                log.includes('SUCCESS') || log.includes('PASSED') 
                  ? 'text-accentGreen font-bold' 
                  : log.includes('INIT') 
                    ? 'text-accentCyan' 
                    : 'text-slate-300'
              }
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

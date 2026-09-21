import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, Shield, Network, Cpu, Play, CheckCircle2, RefreshCw, 
  Zap, Activity, Award, HelpCircle, ChevronRight, Copy, Check, 
  Sparkles, Lock, Server, Laptop, Layers, ArrowRight, CornerDownLeft
} from 'lucide-react';
import { useAcademyStore } from '@/services/academyState';

interface LabMission {
  id: string;
  title: string;
  category: 'Cisco Routing' | 'Linux Security' | 'AI Automation' | 'Firewall Defense';
  objective: string;
  recommendedMode: 'cisco' | 'linux' | 'python';
  initialHint: string;
  targetCommands: string[];
  requiredStateKey: string;
  xpReward: number;
}

const MISSIONS: LabMission[] = [
  {
    id: 'm1',
    title: 'Configure Multan Core Router OSPF Area 0',
    category: 'Cisco Routing',
    objective: 'Enter Global Configuration mode, enable OSPF process 1, and advertise the 192.168.1.0/24 subnet to Backbone Area 0.',
    recommendedMode: 'cisco',
    initialHint: 'Type "enable", then "conf t", then "router ospf 1", then "network 192.168.1.0 0.0.0.255 area 0".',
    targetCommands: ['router ospf 1', 'network 192.168.1.0 0.0.0.255 area 0'],
    requiredStateKey: 'ospf_configured',
    xpReward: 350,
  },
  {
    id: 'm2',
    title: 'Detect & Block Unauthorized SSH Port Scan',
    category: 'Linux Security',
    objective: 'Run a SYN Stealth Port Scan with nmap, then deploy an iptables firewall drop rule on TCP Port 22.',
    recommendedMode: 'linux',
    initialHint: 'Run "nmap -sS 10.0.0.1", then execute "iptables -A INPUT -p tcp --dport 22 -j DROP".',
    targetCommands: ['nmap', 'iptables -A INPUT -p tcp --dport 22 -j DROP'],
    requiredStateKey: 'ssh_firewall_blocked',
    xpReward: 400,
  },
  {
    id: 'm3',
    title: 'Deploy AI-Powered Network Threat Audit',
    category: 'AI Automation',
    objective: 'Execute the autonomous AI security agent to scan packet payloads and isolate malicious command-and-control beacons.',
    recommendedMode: 'linux',
    initialHint: 'Type "ai-audit --scan-threats" in the Linux terminal.',
    targetCommands: ['ai-audit --scan-threats'],
    requiredStateKey: 'ai_threat_isolated',
    xpReward: 500,
  },
];

export default function CyberLabSandbox() {
  const { profile, updateProfile } = useAcademyStore();
  const [activeMode, setActiveMode] = useState<'cisco' | 'linux' | 'python'>('cisco');
  const [activeMission, setActiveMission] = useState<LabMission>(MISSIONS[0]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [labState, setLabState] = useState<Record<string, boolean>>({});
  const [copiedHint, setCopiedHint] = useState(false);

  // Terminal Lines
  const [terminalLines, setTerminalLines] = useState<{ id: string; type: 'input' | 'output' | 'system' | 'success' | 'error'; text: string }[]>([
    { id: '1', type: 'system', text: '╔═══════════════════════════════════════════════════════════════════╗' },
    { id: '2', type: 'system', text: '║   NETWORK HOME INSTITUTE OF IT - VIRTUAL CYBER HARDWARE LAB RACK ║' },
    { id: '3', type: 'system', text: '║   Multan Campus Physical Topology • Cisco IOS XE 17.3 / Kali 2026 ║' },
    { id: '4', type: 'system', text: '╚═══════════════════════════════════════════════════════════════════╝' },
    { id: '5', type: 'output', text: 'Type "help" or "?" to view available lab commands, or complete the active mission above.' }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const promptPrefix = activeMode === 'cisco' 
    ? (labState.cisco_config_mode ? 'Router(config)#' : labState.cisco_privileged ? 'Router#' : 'Router>') 
    : activeMode === 'linux' 
      ? 'root@multan-cyberlab:~# ' 
      : '>>> ';

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    // Add to history
    setCommandHistory(prev => [rawCmd, ...prev]);
    setHistoryIndex(-1);
    setInputVal('');

    // Append user command
    const newLines = [...terminalLines, { id: `cmd-${Date.now()}`, type: 'input' as const, text: `${promptPrefix}${rawCmd}` }];

    const lower = rawCmd.toLowerCase();

    // Check Mission target validation
    let missionCompleteTriggered = false;
    if (activeMission.targetCommands.some(tc => lower.includes(tc.toLowerCase()))) {
      if (!labState[activeMission.requiredStateKey]) {
        setLabState(prev => ({ ...prev, [activeMission.requiredStateKey]: true }));
        if (!completedMissions.includes(activeMission.id)) {
          setCompletedMissions(prev => [...prev, activeMission.id]);
          missionCompleteTriggered = true;
          updateProfile({ xp: (profile.xp || 0) + activeMission.xpReward });
        }
      }
    }

    // --- CISCO IOS ENGINE ---
    if (activeMode === 'cisco') {
      if (lower === 'clear' || lower === 'cls') {
        setTerminalLines([{ id: `init-${Date.now()}`, type: 'system', text: 'Cisco IOS Screen Cleared.' }]);
        return;
      }
      if (lower === 'help' || lower === '?') {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Cisco IOS Commands:
  enable                      - Enter privileged EXEC mode
  disable                     - Return to user EXEC mode
  conf t / configure terminal - Enter global configuration mode
  router ospf <process-id>    - Configure OSPF routing protocol
  network <net> <mask> area   - Define subnets for OSPF
  show ip int brief           - Display IP interface status table
  show ip route               - Display routing table
  show running-config         - Display active device running configuration
  ping <ip_address>           - Test ICMP echo reachability
  traceroute <ip_address>     - Trace packet routing hops
  exit / end                  - Exit current configuration mode`
        });
      } else if (lower === 'enable' || lower === 'en') {
        setLabState(prev => ({ ...prev, cisco_privileged: true }));
        newLines.push({ id: `out-${Date.now()}`, type: 'output', text: 'Password: [Verified]. Entered Privileged EXEC Mode.' });
      } else if (lower === 'disable') {
        setLabState(prev => ({ ...prev, cisco_privileged: false, cisco_config_mode: false }));
        newLines.push({ id: `out-${Date.now()}`, type: 'output', text: 'Returned to User EXEC Mode.' });
      } else if (lower === 'conf t' || lower === 'configure terminal') {
        setLabState(prev => ({ ...prev, cisco_config_mode: true, cisco_privileged: true }));
        newLines.push({ id: `out-${Date.now()}`, type: 'output', text: 'Enter configuration commands, one per line. End with CNTL/Z or "exit".' });
      } else if (lower === 'exit' || lower === 'end') {
        setLabState(prev => ({ ...prev, cisco_config_mode: false }));
        newLines.push({ id: `out-${Date.now()}`, type: 'output', text: 'Exited configuration mode.' });
      } else if (lower.startsWith('router ospf')) {
        newLines.push({ id: `out-${Date.now()}`, type: 'output', text: '% OSPF-5-ADJCHG: Process 1, Nbr 192.168.1.2 on GigabitEthernet0/0/0 from LOADING to FULL, Done.' });
      } else if (lower.startsWith('network') && lower.includes('area 0')) {
        newLines.push({ id: `out-${Date.now()}`, type: 'success', text: '✓ Subnet 192.168.1.0/24 bound to OSPF Area 0 Backbone. Routing adjacencies synchronized.' });
      } else if (lower === 'show ip int brief' || lower === 'sh ip int br') {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   192.168.1.1     YES manual up                    up      
GigabitEthernet0/0/1   10.0.0.1        YES manual up                    up      
GigabitEthernet0/0/2   unassigned      YES unset  administratively down down    
Loopback0              1.1.1.1         YES manual up                    up`
        });
      } else if (lower === 'show ip route' || lower === 'sh ip route') {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Codes: C - connected, S - static, O - OSPF, B - BGP
Gateway of last resort is 10.0.0.254 to network 0.0.0.0

C    192.168.1.0/24 is directly connected, GigabitEthernet0/0/0
O    172.16.10.0/24 [110/2] via 192.168.1.2, 00:04:12, GigabitEthernet0/0/0
O    172.16.20.0/24 [110/2] via 192.168.1.2, 00:04:12, GigabitEthernet0/0/0
C    10.0.0.0/24 is directly connected, GigabitEthernet0/0/1`
        });
      } else if (lower.startsWith('ping')) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${rawCmd.split(' ')[1] || '192.168.1.2'}, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`
        });
      } else {
        newLines.push({ id: `out-${Date.now()}`, type: 'output', text: `Command executed: "${rawCmd}". Configuration updated in NVRAM buffer.` });
      }
    } 
    // --- LINUX SOC ANALYST ENGINE ---
    else if (activeMode === 'linux') {
      if (lower === 'clear') {
        setTerminalLines([{ id: `init-${Date.now()}`, type: 'system', text: 'Linux Bash Terminal Cleared.' }]);
        return;
      }
      if (lower === 'help') {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Linux Security Shell Utilities:
  nmap -sS <ip>               - TCP SYN Stealth Port Scan
  iptables -L -v -n           - List active packet filtering rules
  iptables -A INPUT ...       - Append firewall filtering rule
  ai-audit --scan-threats     - Launch autonomous AI threat detector
  wireshark --dump            - Capture & inspect raw packet streams
  systemctl status <service>  - Check security daemons (snort, suricata)
  cat /var/log/auth.log       - Inspect SSH brute-force login attempts`
        });
      } else if (lower.startsWith('nmap')) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-21 23:05 PKT
Nmap scan report for multan-gw.local (10.0.0.1)
Host is up (0.00042s latency).
Not shown: 996 closed tcp ports
PORT     STATE SERVICE VERSION
22/tcp   OPEN  ssh     OpenSSH 9.6p1 (Ubuntu)
80/tcp   OPEN  http    nginx 1.24.0 (Academy Portal)
443/tcp  OPEN  https   nginx 1.24.0 (TLS 1.3 Strict)
8080/tcp OPEN  http-proxy AI Telemetry API Gateway

Nmap done: 1 IP address (1 host up) scanned in 1.18 seconds`
        });
      } else if (lower.includes('iptables') && (lower.includes('drop') || lower.includes('-a input'))) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `🛡️ [FIREWALL RULE INSERTED] Target: DROP | Protocol: TCP | Dport: 22 (SSH) | Source: 0.0.0.0/0\nChain INPUT policy updated. Unauthorized brute-force scanners are now dropped.`
        });
      } else if (lower === 'iptables -l' || lower === 'iptables -l -v -n') {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Chain INPUT (policy ACCEPT 1420 packets, 184K bytes)
 pkts bytes target     prot opt in     out     source               destination         
  312 18720 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22
 1204  142K ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED`
        });
      } else if (lower.includes('ai-audit')) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `🤖 [CYBERAI THREAT ENGINE v4.2] Initiating Real-Time Deep Packet Inspection...
[1/4] Collecting PCAP stream from Bosan Road Core Switch... [OK]
[2/4] Analyzing entropy & payload vectors against MITRE ATT&CK Framework... [OK]
[3/4] THREAT IDENTIFIED: Potential C2 Beacon on Port 8443 (Confidence: 98.7%)
[4/4] ACTION TAKEN: Threat automatically quarantined via dynamic BGP Flowspec. Network Secured!`
        });
      } else if (lower.includes('cat') && lower.includes('auth.log')) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Sep 21 22:58:14 multan-cyberlab sshd[4190]: Failed password for invalid user admin from 198.51.100.42 port 49152 ssh2
Sep 21 22:58:16 multan-cyberlab sshd[4192]: Failed password for invalid user root from 198.51.100.42 port 49154 ssh2
Sep 21 22:58:18 multan-cyberlab sshd[4195]: Failed password for invalid user cisco from 198.51.100.42 port 49158 ssh2
Sep 21 22:58:20 multan-cyberlab sshd[4201]: Connection closed by authenticating user 198.51.100.42 [preauth]`
        });
      } else {
        newLines.push({ id: `out-${Date.now()}`, type: 'output', text: `Linux Command executed: ${rawCmd}` });
      }
    }
    // --- PYTHON NETDEVOP ENGINE ---
    else {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `>>> # Executing Python Netmiko Script...\nfrom netmiko import ConnectHandler\nrouter = {'device_type': 'cisco_ios', 'host': '192.168.1.1'}\nprint("Connected to Multan Core Router 4331: Status 200 OK")`
      });
    }

    if (missionCompleteTriggered) {
      newLines.push({
        id: `m-comp-${Date.now()}`,
        type: 'success',
        text: `🎉 [MISSION COMPLETE] "${activeMission.title}" accomplished! Awarded +${activeMission.xpReward} XP to your CyberAI Student Profile!`
      });
    }

    setTerminalLines(newLines);
  };

  const copyHintToClipboard = (text: string) => {
    setInputVal(text.replace(/["']/g, ''));
    setCopiedHint(true);
    setTimeout(() => setCopiedHint(false), 2000);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col space-y-0">
      
      {/* 1. TOP HEADER & MODE SELECTOR */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002D62] to-[#007A87] text-accentCyan flex items-center justify-center border border-cyan-400/30 shadow-lg shadow-cyan-950/50">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-white text-base sm:text-lg">
                Interactive Cyber Lab & Cisco Sandbox
              </h3>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE RACK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Execute live simulated Cisco IOS & Linux commands on Multan campus virtual hardware.
            </p>
          </div>
        </div>

        {/* CLI Environment Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 self-stretch md:self-auto justify-between">
          <button
            onClick={() => setActiveMode('cisco')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'cisco' ? 'bg-[#007A87] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-cyan-300" /> Cisco IOS CLI
          </button>
          <button
            onClick={() => setActiveMode('linux')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'linux' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-300" /> Linux Security
          </button>
          <button
            onClick={() => setActiveMode('python')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'python' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-300" /> Python Netmiko
          </button>
        </div>
      </div>

      {/* 2. GUIDED MISSIONS BAR */}
      <div className="bg-slate-900/60 px-6 py-3 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0">Guided Missions:</span>
          {MISSIONS.map((m, idx) => {
            const isDone = completedMissions.includes(m.id);
            const isSelected = activeMission.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMission(m);
                  setActiveMode(m.recommendedMode);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                    : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="font-mono text-[10px] text-slate-500">0{idx+1}</span>}
                <span className="truncate max-w-[130px]">{m.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-amber-400 font-mono font-bold bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> +{activeMission.xpReward} XP
          </span>
        </div>
      </div>

      {/* 3. ACTIVE MISSION BANNER */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 px-6 py-3 border-b border-slate-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider">🎯 Mission Objective:</span>
            <span className="font-semibold text-slate-200">{activeMission.objective}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Hint: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">{activeMission.initialHint}</code></span>
            <button
              onClick={() => copyHintToClipboard(activeMission.targetCommands[0])}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-bold cursor-pointer"
              title="Paste hint command into prompt"
            >
              {copiedHint ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHint ? 'Pasted!' : 'Auto-Fill'}</span>
            </button>
          </div>
        </div>

        {completedMissions.includes(activeMission.id) && (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shrink-0 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
          </span>
        )}
      </div>

      {/* 4. TERMINAL SCREEN DISPLAY */}
      <div className="p-6 bg-[#050B14] font-mono text-xs sm:text-sm min-h-[340px] max-h-[460px] overflow-y-auto space-y-2 select-text">
        {terminalLines.map((line) => {
          let lineClass = "text-slate-300";
          if (line.type === 'system') lineClass = "text-cyan-400 font-bold";
          if (line.type === 'input') lineClass = "text-amber-300 font-bold";
          if (line.type === 'success') lineClass = "text-emerald-400 font-bold";
          if (line.type === 'error') lineClass = "text-rose-400 font-bold";

          return (
            <div key={line.id} className={`whitespace-pre-wrap leading-relaxed ${lineClass}`}>
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* 5. INTERACTIVE CLI COMMAND INPUT FORM */}
      <form onSubmit={handleCommandSubmit} className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center gap-2">
        <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 shrink-0">
          {promptPrefix}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Type a command (e.g. "${activeMission.targetCommands[0] || 'help'}")`}
          className="flex-1 bg-transparent border-none text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-slate-600"
          autoFocus
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#002D62] to-[#007A87] hover:brightness-110 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Run</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* 6. HARDWARE RACK STATUS STRIP */}
      <div className="bg-slate-950 px-6 py-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Cisco Core 4331: <strong>192.168.1.1 (Up)</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Catalyst 2960: <strong>VLAN 10,20 (Active)</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${labState.ssh_firewall_blocked ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>ASA 5506-X: <strong>{labState.ssh_firewall_blocked ? 'Protected' : 'Audit Ready'}</strong></span>
          </span>
        </div>

        <button
          onClick={() => {
            setTerminalLines([
              { id: `rst-${Date.now()}`, type: 'system', text: '══ Virtual Topology Reset. Hardware buffers cleared. ══' }
            ]);
            setLabState({});
          }}
          className="text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
          title="Reset Lab Environment"
        >
          <RefreshCw className="w-3 h-3" /> Reset Rack
        </button>
      </div>

    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Network, Shield, Terminal, Play, Cpu, Server, Laptop, 
  Database, Globe, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, 
  Layers, Award, Sparkles, Send, Eye, DollarSign, TrendingUp, Filter, 
  Lock, Zap, FileText, Check, ChevronRight, HelpCircle, Flame, RotateCcw
} from 'lucide-react';
import CyberLabSandbox from '@/components/CyberLabSandbox';

// ============================================================================
// 1. TOPOLOGY TYPES & PRESETS FOR VISUAL PACKET TRACER
// ============================================================================
interface TopologyDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'server' | 'pc';
  ip: string;
  mac: string;
  gateway?: string;
  x: number; // percentage on canvas (0-100)
  y: number; // percentage on canvas (0-100)
  status: 'online' | 'pinging' | 'warning';
}

interface TopologyLink {
  id: string;
  source: string;
  target: string;
  label?: string;
  status: 'active' | 'transmitting';
}

const TOPOLOGY_PRESETS: { [key: string]: { name: string; desc: string; devices: TopologyDevice[]; links: TopologyLink[] } } = {
  branch: {
    name: '1. Basic Branch Office LAN',
    desc: 'Two client PCs connected via Catalyst 2960 Switch to a Cisco 4331 Edge Router gateway.',
    devices: [
      { id: 'pc1', name: 'Sales-PC-01', type: 'pc', ip: '192.168.1.10', mac: '00:50:79:66:68:01', gateway: '192.168.1.1', x: 15, y: 70, status: 'online' },
      { id: 'pc2', name: 'Finance-PC-02', type: 'pc', ip: '192.168.1.20', mac: '00:50:79:66:68:02', gateway: '192.168.1.1', x: 15, y: 25, status: 'online' },
      { id: 'sw1', name: 'Catalyst-2960-Switch', type: 'switch', ip: '192.168.1.2', mac: '00:0C:85:AA:01:01', gateway: '192.168.1.1', x: 50, y: 50, status: 'online' },
      { id: 'r1', name: 'Cisco-4331-Router', type: 'router', ip: '192.168.1.1', mac: '00:0C:85:FF:AA:01', x: 85, y: 50, status: 'online' },
    ],
    links: [
      { id: 'l1', source: 'pc1', target: 'sw1', label: 'Fa0/1', status: 'active' },
      { id: 'l2', source: 'pc2', target: 'sw1', label: 'Fa0/2', status: 'active' },
      { id: 'l3', source: 'sw1', target: 'r1', label: 'Gig0/0/1', status: 'active' },
    ]
  },
  dmz: {
    name: '2. Enterprise Perimeter & ASA DMZ',
    desc: 'Perimeter Cisco ASA 5506-X Firewall isolating an internal LAN workstation from an external Web Server DMZ.',
    devices: [
      { id: 'pc1', name: 'Admin-Workstation', type: 'pc', ip: '10.0.1.50', mac: '00:50:79:11:22:33', gateway: '10.0.1.1', x: 15, y: 50, status: 'online' },
      { id: 'fw1', name: 'Cisco-ASA-5506X', type: 'firewall', ip: '10.0.1.1', mac: '00:0C:85:DE:AD:01', x: 50, y: 50, status: 'online' },
      { id: 'srv1', name: 'Public-Web-Server', type: 'server', ip: '172.16.10.80', mac: '00:50:79:99:88:77', gateway: '172.16.10.1', x: 85, y: 25, status: 'online' },
      { id: 'srv2', name: 'Secure-Database', type: 'server', ip: '192.168.100.10', mac: '00:50:79:44:55:66', gateway: '192.168.100.1', x: 85, y: 75, status: 'online' },
    ],
    links: [
      { id: 'l1', source: 'pc1', target: 'fw1', label: 'Inside (Sec 100)', status: 'active' },
      { id: 'l2', source: 'fw1', target: 'srv1', label: 'DMZ (Sec 50)', status: 'active' },
      { id: 'l3', source: 'fw1', target: 'srv2', label: 'Core DB (Sec 90)', status: 'active' },
    ]
  },
  multan_isp: {
    name: '3. Multan Campus Core & Cloud WAN',
    desc: 'Network Home Multan Campus Core connected across PTCL Optical Fiber backbones to AWS Cloud & Cisco NetAcad Datacenter.',
    devices: [
      { id: 'r1', name: 'Multan-Campus-Edge', type: 'router', ip: '10.200.1.1', mac: '00:0C:85:12:34:56', x: 15, y: 50, status: 'online' },
      { id: 'sw1', name: 'Distribution-Switch', type: 'switch', ip: '10.200.1.2', mac: '00:0C:85:65:43:21', gateway: '10.200.1.1', x: 45, y: 25, status: 'online' },
      { id: 'fw1', name: 'PTCL-Edge-Firewall', type: 'firewall', ip: '182.180.1.1', mac: '00:0C:85:77:88:99', x: 50, y: 75, status: 'online' },
      { id: 'srv1', name: 'AWS-Cloud-Gateway', type: 'server', ip: '54.239.28.85', mac: '00:1A:C1:22:33:44', x: 85, y: 35, status: 'online' },
      { id: 'srv2', name: 'NetAcad-LTI-Platform', type: 'server', ip: '72.163.4.161', mac: '00:1A:C1:55:66:77', x: 85, y: 70, status: 'online' },
    ],
    links: [
      { id: 'l1', source: 'r1', target: 'sw1', label: '10G Trunk', status: 'active' },
      { id: 'l2', source: 'r1', target: 'fw1', label: 'BGP WAN', status: 'active' },
      { id: 'l3', source: 'fw1', target: 'srv1', label: 'AWS VPN', status: 'active' },
      { id: 'l4', source: 'fw1', target: 'srv2', label: 'NetAcad Direct', status: 'active' },
    ]
  }
};

// ============================================================================
// 2. SUBNET CALCULATOR ENGINE UTILITIES
// ============================================================================
function calculateSubnetDetails(ipStr: string, cidr: number) {
  const parts = ipStr.trim().split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return null;
  }

  // Calculate Subnet Mask
  const maskBits = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  const maskParts = [
    (maskBits >>> 24) & 255,
    (maskBits >>> 16) & 255,
    (maskBits >>> 8) & 255,
    maskBits & 255
  ];
  const subnetMask = maskParts.join('.');

  // Wildcard Mask
  const wildcardParts = maskParts.map(p => 255 - p);
  const wildcardMask = wildcardParts.join('.');

  // Numeric IP
  const ipNum = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;

  // Network Address
  const netNum = (ipNum & maskBits) >>> 0;
  const netParts = [
    (netNum >>> 24) & 255,
    (netNum >>> 16) & 255,
    (netNum >>> 8) & 255,
    netNum & 255
  ];
  const networkAddress = netParts.join('.');

  // Broadcast Address
  const bcastNum = (netNum | (~maskBits >>> 0)) >>> 0;
  const bcastParts = [
    (bcastNum >>> 24) & 255,
    (bcastNum >>> 16) & 255,
    (bcastNum >>> 8) & 255,
    bcastNum & 255
  ];
  const broadcastAddress = bcastParts.join('.');

  // Total and Usable Hosts
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : Math.max(0, totalHosts - 2);

  // Usable Range
  let firstHost = 'N/A';
  let lastHost = 'N/A';
  if (usableHosts > 0) {
    const firstNum = netNum + 1;
    const lastNum = bcastNum - 1;
    firstHost = `${(firstNum >>> 24) & 255}.${(firstNum >>> 16) & 255}.${(firstNum >>> 8) & 255}.${firstNum & 255}`;
    lastHost = `${(lastNum >>> 24) & 255}.${(lastNum >>> 16) & 255}.${(lastNum >>> 8) & 255}.${lastNum & 255}`;
  }

  // IP Class
  let ipClass = 'Class A';
  if (parts[0] >= 128 && parts[0] <= 191) ipClass = 'Class B';
  else if (parts[0] >= 192 && parts[0] <= 223) ipClass = 'Class C';
  else if (parts[0] >= 224 && parts[0] <= 239) ipClass = 'Class D (Multicast)';
  else if (parts[0] >= 240) ipClass = 'Class E (Experimental)';

  // Private RFC 1918
  const isPrivate = (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );

  return {
    subnetMask,
    wildcardMask,
    networkAddress,
    broadcastAddress,
    totalHosts,
    usableHosts,
    firstHost,
    lastHost,
    usableRange: `${firstHost} — ${lastHost}`,
    ipClass,
    isPrivate: isPrivate ? 'Private (RFC 1918)' : 'Public Internet Routable',
    binaryMask: maskParts.map(p => p.toString(2).padStart(8, '0')).join('.')
  };
}

interface InteractiveLabsHubProps {
  onNavigateToTab?: (tab: any) => void;
  defaultSubTab?: 'topology' | 'subnetting' | 'soc' | 'career' | 'sandbox';
}

export default function InteractiveLabsHub({ onNavigateToTab, defaultSubTab = 'topology' }: InteractiveLabsHubProps) {
  // Main Sub-Tab State
  const [activeTab, setActiveTab] = useState<'topology' | 'subnetting' | 'soc' | 'career' | 'sandbox'>(defaultSubTab);

  // --------------------------------------------------------------------------
  // TAB 1: VISUAL PACKET TRACER STATE
  // --------------------------------------------------------------------------
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('branch');
  const currentPreset = TOPOLOGY_PRESETS[selectedPresetKey] || TOPOLOGY_PRESETS.branch;
  const [devices, setDevices] = useState<TopologyDevice[]>(currentPreset.devices);
  const [links, setLinks] = useState<TopologyLink[]>(currentPreset.links);
  const [selectedDevice, setSelectedDevice] = useState<TopologyDevice | null>(null);
  const [sourceDevId, setSourceDevId] = useState<string>('pc1');
  const [destDevId, setDestDevId] = useState<string>('r1');
  const [isPinging, setIsPinging] = useState(false);
  const [pingProgress, setPingProgress] = useState<number>(0); // 0 to 100
  const [packetInspection, setPacketInspection] = useState<any | null>(null);
  const [pingLog, setPingLog] = useState<string[]>([
    '[INIT] Virtual Cisco Packet Simulation Environment initialized.',
    '[READY] Select source & destination devices and click "Send Ping / Test ICMP" to animate packet transmission.'
  ]);

  // Sync devices when preset changes
  useEffect(() => {
    const p = TOPOLOGY_PRESETS[selectedPresetKey];
    if (p) {
      setDevices(p.devices);
      setLinks(p.links);
      setSelectedDevice(null);
      setSourceDevId(p.devices[0]?.id || 'pc1');
      setDestDevId(p.devices[p.devices.length - 1]?.id || 'r1');
      setPingLog([
        `[LOAD] Loaded topology template: "${p.name}".`,
        `[STATUS] ${p.devices.length} hardware nodes and ${p.links.length} physical links active.`
      ]);
    }
  }, [selectedPresetKey]);

  // Execute Ping Animation
  const handleLaunchPing = () => {
    if (isPinging) return;
    const src = devices.find(d => d.id === sourceDevId);
    const dst = devices.find(d => d.id === destDevId);
    if (!src || !dst) return;

    setIsPinging(true);
    setPingProgress(0);

    setPingLog(prev => [
      `[PING] Sending 4 64-byte ICMP Echo Requests from ${src.name} (${src.ip}) to ${dst.name} (${dst.ip})...`,
      ...prev
    ]);

    // Inspect packet details
    setPacketInspection({
      source: src,
      dest: dst,
      layer2: {
        srcMac: src.mac,
        dstMac: dst.mac,
        ethertype: '0x0800 (IPv4)'
      },
      layer3: {
        srcIp: src.ip,
        dstIp: dst.ip,
        ttl: 64,
        protocol: '1 (ICMP)'
      },
      layer4: {
        icmpType: 'Type 8 (Echo Request)',
        seqNumber: 1,
        payloadSize: '32 bytes ("abcdefghijklmnopqrstuvw")'
      }
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setPingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsPinging(false);
        setPingLog(prev => [
          `✓ [SUCCESS] Reply from ${dst.ip}: bytes=32 time=2.1ms TTL=64`,
          `✓ [SUCCESS] 4 Packets Transmitted, 4 Received, 0% Loss. Round-trip min/avg/max = 1.8/2.1/2.4 ms.`,
          ...prev
        ]);
      }
    }, 80);
  };

  // --------------------------------------------------------------------------
  // TAB 2: SUBNETTING NINJA STATE & SPEED DRILL
  // --------------------------------------------------------------------------
  const [calcIp, setCalcIp] = useState('192.168.10.45');
  const [calcCidr, setCalcCidr] = useState(27);
  const subnetResult = useMemo(() => calculateSubnetDetails(calcIp, calcCidr), [calcIp, calcCidr]);

  // Speed Drill State
  const [drillActive, setDrillActive] = useState(false);
  const [drillScore, setDrillScore] = useState(0);
  const [drillStreak, setDrillStreak] = useState(0);
  const [drillTimeLeft, setDrillTimeLeft] = useState(60);
  const [drillQuestion, setDrillQuestion] = useState<{
    scenario: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  } | null>(null);
  const [drillFeedback, setDrillFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  const generateDrillQuestion = () => {
    const drillPool = [
      {
        scenario: 'What is the Network Address for the host 192.168.1.50/28?',
        options: ['192.168.1.0', '192.168.1.32', '192.168.1.48', '192.168.1.64'],
        correctIndex: 2,
        explanation: 'For /28, the block size is 16 (256-240). Multiples of 16 are 0, 16, 32, 48, 64. 50 lies in 192.168.1.48.'
      },
      {
        scenario: 'What is the Broadcast Address for 10.1.5.130/26?',
        options: ['10.1.5.191', '10.1.5.128', '10.1.5.255', '10.1.5.192'],
        correctIndex: 0,
        explanation: 'For /26, block size is 64. Subnets are .0, .64, .128, .192. Next subnet starts at .192, so broadcast is 10.1.5.191.'
      },
      {
        scenario: 'How many usable host IP addresses are available in a /29 subnet?',
        options: ['6 hosts', '8 hosts', '14 hosts', '2 hosts'],
        correctIndex: 0,
        explanation: 'Total addresses = 2^(32-29) = 8. Subtracting Network and Broadcast gives 6 usable hosts.'
      },
      {
        scenario: 'What is the Subnet Mask corresponding to CIDR notation /22?',
        options: ['255.255.252.0', '255.255.248.0', '255.255.254.0', '255.255.255.0'],
        correctIndex: 0,
        explanation: 'Third octet has 6 network bits (11111100 in binary = 252), producing 255.255.252.0.'
      },
      {
        scenario: 'What is the Wildcard Mask for Cisco ACLs matching a 255.255.255.240 mask?',
        options: ['0.0.0.15', '0.0.0.31', '0.0.0.240', '0.0.0.7'],
        correctIndex: 0,
        explanation: 'Subtract each octet from 255: 255-255=0, 255-240=15 ➔ 0.0.0.15.'
      },
      {
        scenario: 'Which of the following is a valid RFC 1918 Private IP address?',
        options: ['172.32.1.1', '192.169.1.1', '172.25.100.5', '11.0.0.1'],
        correctIndex: 2,
        explanation: 'Class B private addresses span 172.16.0.0 to 172.31.255.255. 172.25.x.x is private.'
      }
    ];

    const random = drillPool[Math.floor(Math.random() * drillPool.length)];
    setDrillQuestion(random);
    setDrillFeedback(null);
  };

  const startDrill = () => {
    setDrillActive(true);
    setDrillScore(0);
    setDrillStreak(0);
    setDrillTimeLeft(60);
    generateDrillQuestion();
  };

  const answerDrill = (optionIdx: number) => {
    if (!drillQuestion || !drillActive) return;

    if (optionIdx === drillQuestion.correctIndex) {
      setDrillScore(s => s + 100 + drillStreak * 20);
      setDrillStreak(s => s + 1);
      setDrillFeedback({ correct: true, message: `✅ Correct! ${drillQuestion.explanation}` });
    } else {
      setDrillStreak(0);
      setDrillFeedback({
        correct: false,
        message: `❌ Incorrect. Correct answer: "${drillQuestion.options[drillQuestion.correctIndex]}". ${drillQuestion.explanation}`
      });
    }

    setTimeout(() => {
      generateDrillQuestion();
    }, 1600);
  };

  // Drill Timer
  useEffect(() => {
    let timer: any = null;
    if (drillActive && drillTimeLeft > 0) {
      timer = setInterval(() => {
        setDrillTimeLeft(t => t - 1);
      }, 1000);
    } else if (drillActive && drillTimeLeft === 0) {
      setDrillActive(false);
    }
    return () => clearInterval(timer);
  }, [drillActive, drillTimeLeft]);

  // --------------------------------------------------------------------------
  // TAB 3: SOC CYBER THREAT MATRIX & LIVE DEFENSE SIMULATOR
  // --------------------------------------------------------------------------
  const [threatLevel, setThreatLevel] = useState<'CRITICAL' | 'ELEVATED' | 'SECURED'>('ELEVATED');
  const [activeIncidentId, setActiveIncidentId] = useState<string>('ddos');
  const [mitigationStepsTaken, setMitigationStepsTaken] = useState<string[]>([]);
  const [socLogs, setSocLogs] = useState<string[]>([
    '[SIEM ALERT] 185.220.101.5 initiated anomalous TCP SYN flood on port 443.',
    '[TELEMETRY] Multan Campus Core edge router reports 420,000 pps bandwidth spike.',
    '[SOC QUEUE] Severity 1 Ticket Generated: Incident #CORV-2026-881'
  ]);

  const ATTACK_SCENARIOS: { [key: string]: {
    title: string;
    vector: string;
    cve: string;
    severity: string;
    target: string;
    description: string;
    mitigationActions: { id: string; label: string; actionLog: string }[];
  } } = {
    ddos: {
      title: 'Volumetric TCP SYN-Flood DDoS Attack',
      vector: 'Network Layer (L4) Saturation',
      cve: 'CWE-400 (Resource Exhaustion)',
      severity: 'CRITICAL (9.8)',
      target: '311-B Bosan Road PTCL Optical Gateway',
      description: 'Botnet nodes flooding border Cisco 4331 router with uncompleted half-open SYN handshakes.',
      mitigationActions: [
        { id: 'syn_cookies', label: '1. Enable TCP SYN Cookies & Half-Open Limit', actionLog: '🛡️ SYN Cookies activated on Cisco IOS. Dropped 380,000 spoofed connection requests.' },
        { id: 'rate_limit', label: '2. Deploy BGP Flowspec & Rate Limiter on ISP Interface', actionLog: '⚡ BGP Flowspec rule injected to PTCL gateway. Traffic throttled to 25 Mbps.' },
        { id: 'acl_block', label: '3. Blackhole Rogue Subnet CIDR /24 via ACL', actionLog: '✅ Access Control List rule #110 applied. Blocked 185.220.101.0/24 permanently.' }
      ]
    },
    bruteforce: {
      title: 'SSH Dictionary Attack on Core Switch CLI',
      vector: 'Credential Access (MITRE T1110)',
      cve: 'CWE-307 (Improper Restriction of Excessive Authentication)',
      severity: 'HIGH (8.4)',
      target: 'Catalyst 2960 Management VLAN (192.168.1.2)',
      description: 'Automated Hydra password spraying bot attempting root and cisco/admin default logins.',
      mitigationActions: [
        { id: 'fail2ban', label: '1. Enable Login Block-For Threshold (Cisco IOS)', actionLog: '🔒 Executed "login block-for 300 attempts 3 within 60". Lockout policy activated.' },
        { id: 'ssh_keys', label: '2. Enforce RSA 4096-bit SSH Key Authentication', actionLog: '🔑 Disabled password authentication. Allowed only authorized NetAcad faculty keys.' },
        { id: 'mgmt_vlan', label: '3. Restrict Management Access to In-Band Bastion Host', actionLog: '✅ Applied VTY ACL permitting only 10.0.1.100 jumpbox IP.' }
      ]
    },
    ransomware: {
      title: 'Lateral Worm Propagation (SMB EternalBlue Exploit)',
      vector: 'Lateral Movement (MITRE T1210)',
      cve: 'CVE-2017-0144 (MS17-010 SMBv1)',
      severity: 'EMERGENCY (10.0)',
      target: 'Campus Physical Lab Workstations',
      description: 'Malicious payload attempting to spread across subnets encrypting student disk drives.',
      mitigationActions: [
        { id: 'isolate_vlan', label: '1. Instantly Isolate Infected Lab VLAN', actionLog: '🚨 Port isolation command issued. Blocked all peer-to-peer broadcast domains.' },
        { id: 'block_445', label: '2. Drop Port 445 (SMB) at Edge ASA Firewall', actionLog: '🛡️ Firewall rule #205 dropped TCP 445 cross-subnet traffic.' },
        { id: 'siem_kill', label: '3. Push Autonomous Endpoint Quarantine Agent', actionLog: '✅ Terminated payload process PID 4412 across all infected Windows endpoints.' }
      ]
    }
  };

  const currentScenario = ATTACK_SCENARIOS[activeIncidentId] || ATTACK_SCENARIOS.ddos;

  const handleApplyMitigation = (actionId: string, actionLog: string) => {
    if (mitigationStepsTaken.includes(actionId)) return;

    const newSteps = [...mitigationStepsTaken, actionId];
    setMitigationStepsTaken(newSteps);
    setSocLogs(prev => [actionLog, ...prev]);

    if (newSteps.length === currentScenario.mitigationActions.length) {
      setThreatLevel('SECURED');
      setSocLogs(prev => [
        `🎉 [INCIDENT RESOLVED] Threat neutralized! Incident #CORV-2026-881 marked CLOSED. All network systems operating normally.`,
        ...prev
      ]);
    } else {
      setThreatLevel('ELEVATED');
    }
  };

  const handleResetScenario = (scenarioKey: string) => {
    setActiveIncidentId(scenarioKey);
    setMitigationStepsTaken([]);
    setThreatLevel('CRITICAL');
    setSocLogs([
      `[SIMULATION START] Scenario "${ATTACK_SCENARIOS[scenarioKey].title}" activated!`,
      `[THREAT LEVEL: CRITICAL] Review mitigation playbooks below to restore system security.`
    ]);
  };

  // --------------------------------------------------------------------------
  // TAB 4: CAREER ROADMAP & SALARY ROI CALCULATOR STATE
  // --------------------------------------------------------------------------
  const [selectedCareerTrack, setSelectedCareerTrack] = useState<'network' | 'cyber' | 'cloud' | 'linux'>('network');
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior' | 'lead'>('mid');
  const [currency, setCurrency] = useState<'PKR' | 'AED' | 'USD'>('PKR');

  const CAREER_TRACKS = {
    network: {
      title: 'Enterprise Network & Infrastructure Engineering',
      icon: Network,
      roles: ['Network Support Engineer', 'Cisco Network Specialist', 'Enterprise Network Architect'],
      certifications: ['Cisco CCST Networking', 'Cisco CCNA (200-301)', 'CCNP Enterprise ENCOR'],
      curriculumIds: ['ccna-200-301', 'ccnp-enterprise', 'devnet-associate'],
      timeline: '4 to 8 months',
      baseSalaryPkr: { entry: 90000, mid: 220000, senior: 420000, lead: 750000 },
      baseSalaryAed: { entry: 8000, mid: 16000, senior: 28000, lead: 45000 },
      baseSalaryUsd: { entry: 3500, mid: 6500, senior: 11000, lead: 16000 },
      milestones: [
        { stage: 'Stage 1: Foundation', desc: 'OSI Model, IPv4/IPv6 Subnetting, ARP, ICMP, Packet Tracer Labs' },
        { stage: 'Stage 2: Core CCNA', desc: 'VLANs, Trunking, Spanning Tree (STP), OSPFv2, NAT, EtherChannel' },
        { stage: 'Stage 3: Advanced NetAcad', desc: 'Enterprise WAN, BGP, Cisco 4331 Hardware Racks, Network Security ACLs' },
        { stage: 'Stage 4: NetDevOps Automation', desc: 'Python Netmiko, RESTCONF, Ansible, Cisco DNA Center & SD-WAN' }
      ]
    },
    cyber: {
      title: 'Cybersecurity, Ethical Hacking & SOC Defense',
      icon: Shield,
      roles: ['SOC Tier-1 Analyst', 'Penetration Tester / Ethical Hacker', 'Lead Security Architect'],
      certifications: ['Cisco CCST Cybersecurity', 'Cisco CyberOps Associate', 'CEH v12 / CompTIA Sec+'],
      curriculumIds: ['ethical-hacker', 'cyberops', 'security-operations'],
      timeline: '5 to 9 months',
      baseSalaryPkr: { entry: 110000, mid: 260000, senior: 480000, lead: 850000 },
      baseSalaryAed: { entry: 9500, mid: 18000, senior: 32000, lead: 50000 },
      baseSalaryUsd: { entry: 4000, mid: 7500, senior: 12500, lead: 18000 },
      milestones: [
        { stage: 'Stage 1: Security Fundamentals', desc: 'CIA Triad, Cryptography, Hash Functions, Port Scanning, WireShark' },
        { stage: 'Stage 2: Offensive Security', desc: 'Metasploit, Nmap, Web App Exploitation (OWASP Top 10), Privilege Escalation' },
        { stage: 'Stage 3: Defensive SOC Operations', desc: 'Splunk SIEM, Elastic Security, Incident Response Playbooks, PCAP Forensics' },
        { stage: 'Stage 4: Zero Trust & AI Sec', desc: 'Autonomous Threat Hunting, LLM Prompt Injection Defense, Cloud IAM' }
      ]
    },
    cloud: {
      title: 'AWS Cloud Architecture & DevOps Automation',
      icon: Globe,
      roles: ['Cloud Support Engineer', 'DevOps Solutions Architect', 'Cloud Infrastructure Lead'],
      certifications: ['AWS Certified Cloud Practitioner', 'AWS Solutions Architect (SAA-C03)', 'Certified Kubernetes Admin'],
      curriculumIds: ['aws-cloud', 'cloud-devops', 'python-essentials-1'],
      timeline: '4 to 7 months',
      baseSalaryPkr: { entry: 120000, mid: 280000, senior: 520000, lead: 900000 },
      baseSalaryAed: { entry: 10000, mid: 20000, senior: 34000, lead: 52000 },
      baseSalaryUsd: { entry: 4500, mid: 8000, senior: 13000, lead: 19000 },
      milestones: [
        { stage: 'Stage 1: Linux & Virtualization', desc: 'Command Line, Bash Scripting, SSH, File Permissions, Docker Basics' },
        { stage: 'Stage 2: AWS Core Services', desc: 'VPC, EC2, S3, IAM, Route 53, Application Load Balancers, Auto Scaling' },
        { stage: 'Stage 3: Infrastructure as Code', desc: 'Terraform, CloudFormation, CI/CD with GitHub Actions, Jenkins' },
        { stage: 'Stage 4: Cloud Native & K8s', desc: 'Kubernetes Pods, Services, Ingress, Monitoring with Prometheus & Grafana' }
      ]
    },
    linux: {
      title: 'Red Hat Enterprise Linux (RHEL) & Systems Admin',
      icon: Terminal,
      roles: ['Linux System Administrator', 'Enterprise Infrastructure Engineer', 'Site Reliability Engineer (SRE)'],
      certifications: ['NDG Linux Essentials', 'Red Hat RHCSA (EX200)', 'Red Hat Certified Engineer (EX294)'],
      curriculumIds: ['rhcsa-linux', 'linux-essentials', 'network-automation'],
      timeline: '3 to 6 months',
      baseSalaryPkr: { entry: 85000, mid: 210000, senior: 400000, lead: 700000 },
      baseSalaryAed: { entry: 7500, mid: 15000, senior: 26000, lead: 42000 },
      baseSalaryUsd: { entry: 3200, mid: 6000, senior: 10000, lead: 15000 },
      milestones: [
        { stage: 'Stage 1: Command Line Mastery', desc: 'System Navigation, Vim, File Hierarchy, User & Group Administration' },
        { stage: 'Stage 2: Storage & Networking', desc: 'LVM Partitions, Stratis, VDO, nmcli Configuration, FirewallD Rules' },
        { stage: 'Stage 3: Security & Services', desc: 'SELinux Enforcing, Systemd Daemons, Cron Jobs, SSH Hardening' },
        { stage: 'Stage 4: Enterprise Ansible', desc: 'Automating Red Hat Workstations, Multi-Host Deployment Playbooks' }
      ]
    }
  };

  const currentTrack = CAREER_TRACKS[selectedCareerTrack];

  const currentSalary = useMemo(() => {
    if (currency === 'PKR') {
      const val = currentTrack.baseSalaryPkr[experienceLevel];
      return `PKR ${val.toLocaleString()} / month`;
    } else if (currency === 'AED') {
      const val = currentTrack.baseSalaryAed[experienceLevel];
      return `AED ${val.toLocaleString()} / month`;
    } else {
      const val = currentTrack.baseSalaryUsd[experienceLevel];
      return `$${val.toLocaleString()} / month`;
    }
  }, [selectedCareerTrack, experienceLevel, currency]);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="space-y-10 py-6 text-slate-800 animate-fade-in text-left">
      
      {/* 1. TOP EXECUTIVE HEADER BANNER */}
      <section className="bg-gradient-to-r from-[#002D62] via-[#00426E] to-[#005073] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Next-Gen Hands-On Lab Suite
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 inline-flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live Hardware Telemetry
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Interactive Tech & Cyber Labs
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Experience real enterprise hardware in your browser. Practice Cisco topology packet flows, master IPv4/IPv6 subnetting, mitigate live SOC cyberattacks, and plan your high-income IT career.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={() => onNavigateToTab?.('player')}
            className="cyber-btn px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            <Play className="w-4 h-4 text-slate-950" />
            <span>Launch LMS Player</span>
          </button>
        </div>

        {/* Ambient Grid Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="hubGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F2FE" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hubGrid)" />
          </svg>
        </div>
      </section>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 p-2 bg-slate-100/80 rounded-2xl border border-slate-200 shadow-inner">
        <button
          onClick={() => setActiveTab('topology')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'topology'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <Network className={`w-4 h-4 ${activeTab === 'topology' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Visual Packet Tracer</span>
        </button>

        <button
          onClick={() => setActiveTab('subnetting')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'subnetting'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <Cpu className={`w-4 h-4 ${activeTab === 'subnetting' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Subnetting Ninja & CIDR Drill</span>
        </button>

        <button
          onClick={() => setActiveTab('soc')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'soc'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <Shield className={`w-4 h-4 ${activeTab === 'soc' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>SOC Cyber Threat Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'career'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${activeTab === 'career' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>Career Roadmap & ROI Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sandbox'
              ? 'bg-[#002D62] text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
        >
          <Terminal className={`w-4 h-4 ${activeTab === 'sandbox' ? 'text-cyan-300' : 'text-[#007A87]'}`} />
          <span>CLI Terminal Sandbox</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 3. TAB 1: VISUAL PACKET TRACER & TOPOLOGY BUILDER                      */}
      {/* ===================================================================== */}
      {activeTab === 'topology' && (
        <div className="space-y-6">
          
          {/* Controls Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-slate-900 flex items-center gap-2">
                <Network className="w-5 h-5 text-[#007A87]" />
                <span>Visual Cisco Packet Tracer Lab</span>
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                {currentPreset.desc} Click on any hardware node to inspect IP/MAC parameters or trigger an animated ICMP test.
              </p>
            </div>

            {/* Presets Picker */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Topology:</span>
              <select
                value={selectedPresetKey}
                onChange={(e) => setSelectedPresetKey(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#007A87] cursor-pointer shadow-sm"
              >
                <option value="branch">1. Basic Branch Office LAN</option>
                <option value="dmz">2. Enterprise Perimeter & ASA DMZ</option>
                <option value="multan_isp">3. Multan Campus Core & Cloud WAN</option>
              </select>
            </div>
          </div>

          {/* Interactive Visual Canvas Area */}
          <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[560px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-6">
            
            {/* SVG Background Grid & Cable Links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <pattern id="canvasGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
                <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#007A87" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#canvasGrid)" />

              {/* Render Connecting Cables */}
              {links.map((link) => {
                const srcDev = devices.find(d => d.id === link.source);
                const tgtDev = devices.find(d => d.id === link.target);
                if (!srcDev || !tgtDev) return null;

                const isTransmitting = isPinging && (
                  (link.source === sourceDevId || link.target === sourceDevId) ||
                  (link.source === destDevId || link.target === destDevId)
                );

                return (
                  <g key={link.id}>
                    {/* Glow Underlay */}
                    {isTransmitting && (
                      <line
                        x1={`${srcDev.x}%`}
                        y1={`${srcDev.y}%`}
                        x2={`${tgtDev.x}%`}
                        y2={`${tgtDev.y}%`}
                        stroke="#00F2FE"
                        strokeWidth="5"
                        strokeOpacity="0.4"
                        strokeDasharray="6,6"
                      />
                    )}
                    {/* Primary Physical Cable */}
                    <line
                      x1={`${srcDev.x}%`}
                      y1={`${srcDev.y}%`}
                      x2={`${tgtDev.x}%`}
                      y2={`${tgtDev.y}%`}
                      stroke={isTransmitting ? '#00F2FE' : '#334155'}
                      strokeWidth={isTransmitting ? '3' : '2'}
                    />
                    {/* Cable Port Label */}
                    {link.label && (
                      <text
                        x={`${(srcDev.x + tgtDev.x) / 2}%`}
                        y={`${(srcDev.y + tgtDev.y) / 2 - 2}%`}
                        fill="#94A3B8"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {link.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Animated Glowing Packet Traveling Along Wire */}
              {isPinging && (
                (() => {
                  const srcDev = devices.find(d => d.id === sourceDevId);
                  const dstDev = devices.find(d => d.id === destDevId);
                  if (!srcDev || !dstDev) return null;

                  const currentX = srcDev.x + (dstDev.x - srcDev.x) * (pingProgress / 100);
                  const currentY = srcDev.y + (dstDev.y - srcDev.y) * (pingProgress / 100);

                  return (
                    <g>
                      <circle cx={`${currentX}%`} cy={`${currentY}%`} r="12" fill="#00F2FE" opacity="0.3" />
                      <circle cx={`${currentX}%`} cy={`${currentY}%`} r="6" fill="#00F2FE" />
                      <circle cx={`${currentX}%`} cy={`${currentY}%`} r="3" fill="#FFFFFF" />
                    </g>
                  );
                })()
              )}
            </svg>

            {/* Top Toolbar Overlay */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[11px] font-bold">Simulator Engine: Cisco IOS 16.9.4 & Linux Bridge</span>
              </div>

              {/* Quick Ping Controller */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 px-1 font-bold">From:</span>
                <select
                  value={sourceDevId}
                  onChange={(e) => setSourceDevId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>
                  ))}
                </select>

                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />

                <span className="text-[10px] font-mono uppercase text-slate-400 px-1 font-bold">To:</span>
                <select
                  value={destDevId}
                  onChange={(e) => setDestDevId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>
                  ))}
                </select>

                <button
                  onClick={handleLaunchPing}
                  disabled={isPinging}
                  className={`px-3.5 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                    isPinging 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 cursor-wait' 
                      : 'bg-gradient-to-r from-[#00F2FE] to-[#007A87] hover:brightness-110 text-slate-950 font-extrabold'
                  }`}
                >
                  {isPinging ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Transmitting ({pingProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 text-slate-950" />
                      <span>Send Ping / Test ICMP</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Render Devices On Canvas */}
            <div className="relative z-10 w-full h-full pointer-events-none">
              {devices.map((device) => {
                const isSelected = selectedDevice?.id === device.id;
                const isSource = sourceDevId === device.id;
                const isDest = destDevId === device.id;

                let IconComponent = Laptop;
                if (device.type === 'router') {
                  IconComponent = Network;
                } else if (device.type === 'switch') {
                  IconComponent = Layers;
                } else if (device.type === 'firewall') {
                  IconComponent = Shield;
                } else if (device.type === 'server') {
                  IconComponent = Server;
                }

                return (
                  <div
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    style={{ left: `${device.x}%`, top: `${device.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer flex flex-col items-center group transition-transform hover:scale-110 ${
                      isSelected ? 'scale-110' : ''
                    }`}
                  >
                    {/* Ring Highlight */}
                    <div className={`relative p-3.5 rounded-2xl backdrop-blur-md transition-all shadow-xl ${
                      isSelected 
                        ? 'bg-slate-800 border-2 border-cyan-400 shadow-cyan-500/20' 
                        : isSource
                        ? 'bg-slate-900/90 border border-cyan-400'
                        : isDest
                        ? 'bg-slate-900/90 border border-emerald-400'
                        : 'bg-slate-900/80 border border-slate-800 hover:border-slate-600'
                    }`}>
                      <IconComponent className={`w-7 h-7 ${
                        device.type === 'router' ? 'text-emerald-400' :
                        device.type === 'switch' ? 'text-blue-400' :
                        device.type === 'firewall' ? 'text-amber-400' :
                        device.type === 'server' ? 'text-purple-400' : 'text-cyan-400'
                      }`} />

                      {/* Source / Target Tag */}
                      {isSource && (
                        <span className="absolute -top-2.5 -left-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-400 text-slate-950 uppercase shadow">
                          SRC
                        </span>
                      )}
                      {isDest && (
                        <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-400 text-slate-950 uppercase shadow">
                          DST
                        </span>
                      )}
                    </div>

                    {/* Labels */}
                    <div className="mt-1.5 text-center space-y-0.5">
                      <span className="text-[11px] font-bold text-white block truncate max-w-[120px] drop-shadow">
                        {device.name}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 block bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        {device.ip}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Terminal Log Output */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-800 max-h-24 overflow-y-auto font-mono text-[11px] space-y-1 text-slate-300">
              {pingLog.slice(0, 3).map((line, idx) => (
                <div key={idx} className={line.includes('SUCCESS') ? 'text-emerald-400' : line.includes('PING') ? 'text-cyan-300' : 'text-slate-400'}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Device Inspector & Packet Dissector Panels */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Device Hardware Inspector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#007A87]" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Node Telemetry & Parameters
                  </h4>
                </div>
                {selectedDevice ? (
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    STATUS: ONLINE (0% LOSS)
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">Click any device to inspect</span>
                )}
              </div>

              {selectedDevice ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Device Name</span>
                      <span className="font-extrabold text-slate-800">{selectedDevice.name}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Device Role</span>
                      <span className="font-extrabold text-[#007A87] uppercase">{selectedDevice.type}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">IPv4 Address</span>
                      <span className="font-mono font-bold text-slate-900">{selectedDevice.ip}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Layer 2 MAC Address</span>
                      <span className="font-mono font-bold text-slate-700">{selectedDevice.mac}</span>
                    </div>
                  </div>

                  {selectedDevice.gateway && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-slate-400">Default Gateway</span>
                      <span className="font-mono font-bold text-slate-800">{selectedDevice.gateway}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setSourceDevId(selectedDevice.id)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-[#002D62] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Set as Ping Source
                    </button>
                    <button
                      onClick={() => setDestDevId(selectedDevice.id)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-[#007A87] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Set as Ping Destination
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Eye className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Click on any router, switch, firewall, or PC in the canvas above to inspect live telemetry.</p>
                </div>
              )}
            </div>

            {/* OSI Packet Dissector / Inspector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Live OSI Packet Dissector (Wireshark Style)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full font-bold border border-cyan-200">
                  PROTOCOL: ICMP (ECHO)
                </span>
              </div>

              {packetInspection ? (
                <div className="space-y-2.5 text-xs font-mono">
                  {/* Layer 2 Ethernet Frame */}
                  <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1 text-left">
                    <div className="flex items-center justify-between text-blue-900 font-bold">
                      <span>Layer 2: Ethernet II Frame</span>
                      <span className="text-[10px] text-blue-600">Type: {packetInspection.layer2.ethertype}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Src: <span className="font-bold">{packetInspection.layer2.srcMac}</span> ➔ Dst: <span className="font-bold">{packetInspection.layer2.dstMac}</span>
                    </div>
                  </div>

                  {/* Layer 3 IP Header */}
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1 text-left">
                    <div className="flex items-center justify-between text-emerald-900 font-bold">
                      <span>Layer 3: IPv4 Datagram Header</span>
                      <span className="text-[10px] text-emerald-600">TTL: {packetInspection.layer3.ttl}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Source IP: <span className="font-bold text-slate-900">{packetInspection.layer3.srcIp}</span> ➔ Destination IP: <span className="font-bold text-slate-900">{packetInspection.layer3.dstIp}</span>
                    </div>
                  </div>

                  {/* Layer 4 ICMP Payload */}
                  <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1 text-left">
                    <div className="flex items-center justify-between text-purple-900 font-bold">
                      <span>Layer 4 / Payload: ICMP Control Message</span>
                      <span className="text-[10px] text-purple-600">Seq: #{packetInspection.layer4.seqNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Message Type: <span className="font-bold text-purple-950">{packetInspection.layer4.icmpType}</span> (Checksum: 0x4d12)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Click "Send Ping / Test ICMP" above to capture and dissect real-time packet headers.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. TAB 2: SUBNETTING NINJA & CIDR MASTERY ENGINE                      */}
      {/* ===================================================================== */}
      {activeTab === 'subnetting' && (
        <div className="space-y-8">
          
          {/* Top Intro Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#007A87]" />
                <span>CCNA Subnetting Ninja & CIDR Mastery Engine</span>
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                Master the highest-scoring skill of Cisco 200-301 CCNA. Calculate subnet masks, wildcard masks, usable host ranges, and test your speed in the 60-second challenge.
              </p>
            </div>

            <button
              onClick={startDrill}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <Flame className="w-4 h-4 text-slate-950" />
              <span>{drillActive ? 'Restart 60s Speed Drill' : 'Launch 60s Speed Drill'}</span>
            </button>
          </div>

          {/* 60-SECOND SPEED DRILL CHALLENGE MODAL / HERO */}
          {drillActive && drillQuestion && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#002D62] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/50 shadow-2xl space-y-6 animate-slide-up relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">Rapid-Fire CCNA Drill</span>
                    <h4 className="text-base font-extrabold text-white">Subnetting Speed Challenge</h4>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Score</span>
                    <span className="text-lg font-mono font-black text-cyan-300">{drillScore} XP</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-mono font-bold text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>{drillTimeLeft}s</span>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Scenario:</span>
                <p className="text-lg sm:text-xl font-display font-bold text-white leading-relaxed">
                  {drillQuestion.scenario}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                {drillQuestion.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => answerDrill(oIdx)}
                    className="p-4 rounded-2xl bg-slate-800/80 hover:bg-[#007A87] hover:text-white border border-slate-700 text-slate-100 text-left font-mono text-xs font-bold transition-all shadow-md flex items-center justify-between group cursor-pointer"
                  >
                    <span>{opt}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>

              {/* Feedback Toast */}
              {drillFeedback && (
                <div className={`p-4 rounded-2xl border text-xs font-mono leading-relaxed animate-fade-in ${
                  drillFeedback.correct 
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' 
                    : 'bg-red-950/80 border-red-500/50 text-red-200'
                }`}>
                  {drillFeedback.message}
                </div>
              )}
            </div>
          )}

          {/* VISUAL SUBNET CALCULATOR */}
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Column: Input Form & Bit-Boundary Slider */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
              <div className="space-y-1">
                <h4 className="text-base font-display font-extrabold text-slate-900">
                  Interactive IP & Mask Configurator
                </h4>
                <p className="text-xs text-slate-500">
                  Input any IPv4 address and slide the CIDR prefix to inspect bit allocations.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    IPv4 Address
                  </label>
                  <input
                    type="text"
                    value={calcIp}
                    onChange={(e) => setCalcIp(e.target.value)}
                    placeholder="e.g. 192.168.10.45"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#007A87] text-slate-900 shadow-inner"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      CIDR Prefix Mask: <span className="text-[#007A87] font-black font-mono">/{calcCidr}</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {subnetResult?.subnetMask}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="30"
                    value={calcCidr}
                    onChange={(e) => setCalcCidr(parseInt(e.target.value, 10))}
                    className="w-full accent-[#007A87] cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>/8 (Class A)</span>
                    <span>/16 (Class B)</span>
                    <span>/24 (Class C)</span>
                    <span>/30 (P2P Link)</span>
                  </div>
                </div>

                {/* Quick Presets Chips */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Quick Scenarios:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'LAN /24', ip: '192.168.1.1', cidr: 24 },
                      { label: 'Small Office /27', ip: '192.168.10.45', cidr: 27 },
                      { label: 'WAN Link /30', ip: '10.0.0.1', cidr: 30 },
                      { label: 'Campus Core /22', ip: '172.16.50.10', cidr: 22 },
                      { label: 'Enterprise /16', ip: '10.200.0.1', cidr: 16 }
                    ].map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setCalcIp(s.ip); setCalcCidr(s.cidr); }}
                        className="px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold bg-slate-100 hover:bg-[#002D62] hover:text-white text-slate-700 transition-all cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Calculated Architecture Telemetry */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
              {subnetResult ? (
                <div className="space-y-6">
                  
                  {/* Top Stats Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-100 text-left">
                      <span className="text-[10px] font-mono text-cyan-700 uppercase font-bold block">Network ID</span>
                      <span className="text-xs sm:text-sm font-mono font-black text-cyan-950">{subnetResult.networkAddress}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-left">
                      <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold block">Broadcast</span>
                      <span className="text-xs sm:text-sm font-mono font-black text-emerald-950">{subnetResult.broadcastAddress}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-left">
                      <span className="text-[10px] font-mono text-purple-700 uppercase font-bold block">Usable Hosts</span>
                      <span className="text-xs sm:text-sm font-mono font-black text-purple-950">{subnetResult.usableHosts.toLocaleString()}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-left">
                      <span className="text-[10px] font-mono text-amber-700 uppercase font-bold block">Wildcard Mask</span>
                      <span className="text-xs sm:text-sm font-mono font-black text-amber-950">{subnetResult.wildcardMask}</span>
                    </div>
                  </div>

                  {/* Detailed Table */}
                  <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 text-xs overflow-hidden">
                    <div className="p-3 bg-slate-50/70 flex justify-between items-center">
                      <span className="text-slate-500 font-bold">Usable Host Range:</span>
                      <span className="font-mono font-bold text-slate-900">{subnetResult.usableRange}</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-500 font-bold">Subnet Mask:</span>
                      <span className="font-mono font-bold text-[#007A87]">{subnetResult.subnetMask}</span>
                    </div>
                    <div className="p-3 bg-slate-50/70 flex justify-between items-center">
                      <span className="text-slate-500 font-bold">IP Class & Scope:</span>
                      <span className="font-bold text-slate-800">{subnetResult.ipClass} • {subnetResult.isPrivate}</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-500 font-bold">Total IP Addresses in Block:</span>
                      <span className="font-mono font-bold text-slate-900">{subnetResult.totalHosts.toLocaleString()} IPs</span>
                    </div>
                  </div>

                  {/* Binary Bit-Boundary Representation */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">32-Bit Binary Mask:</span>
                      <span className="text-cyan-400">{calcCidr} Network Bits • {32 - calcCidr} Host Bits</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 tracking-wider overflow-x-auto">
                      {subnetResult.binaryMask}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs">Invalid IP address format. Please enter a valid 4-octet IPv4 string (e.g. 192.168.1.1).</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. TAB 3: SOC CYBER THREAT MATRIX & ATTACK SIMULATOR                   */}
      {/* ===================================================================== */}
      {activeTab === 'soc' && (
        <div className="space-y-8">
          
          {/* Top Incident Status Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-red-100 text-red-600">
                  <Shield className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-display font-extrabold text-slate-900">
                  Multan SOC Cyber Threat Matrix & Incident Response
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">
                Real-time simulated cyber warfare defending the 311-B Bosan Road network against DDoS attacks, brute-force incursions, and ransomware worms.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 shadow-sm border ${
                threatLevel === 'CRITICAL' 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : threatLevel === 'ELEVATED'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  threatLevel === 'CRITICAL' ? 'bg-red-500' : threatLevel === 'ELEVATED' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span>DEFCON STATUS: {threatLevel}</span>
              </div>
            </div>
          </div>

          {/* Scenario Selector Chips */}
          <div className="grid sm:grid-cols-3 gap-4">
            {Object.keys(ATTACK_SCENARIOS).map((key) => {
              const sc = ATTACK_SCENARIOS[key];
              const isSelected = activeIncidentId === key;
              return (
                <div
                  key={key}
                  onClick={() => handleResetScenario(key)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-sm text-left space-y-2 ${
                    isSelected 
                      ? 'border-red-500 bg-red-50/30 ring-2 ring-red-500/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      CVSS: {sc.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{sc.cve}</span>
                  </div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900">{sc.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{sc.description}</p>
                </div>
              );
            })}
          </div>

          {/* Live Defense Workspace */}
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Mitigation Playbook */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase block">Active Target</span>
                  <h4 className="text-base font-extrabold text-slate-900">{currentScenario.target}</h4>
                </div>
                <button
                  onClick={() => handleResetScenario(activeIncidentId)}
                  className="text-xs text-slate-400 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Attack
                </button>
              </div>

              {/* Step-by-Step Defense Actions */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Incident Response Mitigation Playbook:
                </span>

                {currentScenario.mitigationActions.map((action) => {
                  const isDone = mitigationStepsTaken.includes(action.id);
                  return (
                    <div
                      key={action.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isDone 
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950' 
                          : 'bg-slate-50 border-slate-200 hover:border-[#007A87]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isDone ? <Check className="w-4 h-4" /> : '!'}
                        </div>
                        <span className="font-bold text-xs text-slate-800">{action.label}</span>
                      </div>

                      <button
                        onClick={() => handleApplyMitigation(action.id, action.actionLog)}
                        disabled={isDone}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-800 cursor-default' 
                            : 'bg-[#002D62] hover:bg-[#001D42] text-white shadow-sm'
                        }`}
                      >
                        {isDone ? 'Applied ✓' : 'Deploy Action'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Mitigation Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-500">Threat Containment Progress:</span>
                  <span className="text-[#007A87]">
                    {Math.round((mitigationStepsTaken.length / currentScenario.mitigationActions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#007A87] to-emerald-500 transition-all duration-500"
                    style={{ width: `${(mitigationStepsTaken.length / currentScenario.mitigationActions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Live SIEM Security Event Stream */}
            <div className="lg:col-span-5 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-red-400" /> Live SIEM Syslog Telemetry
                  </span>
                  <span className="text-slate-500">Port 514 UDP</span>
                </div>
                <span className="text-[10px] text-slate-400">Capturing real-time alerts from Cisco ASA and Snort IDS</span>
              </div>

              <div className="space-y-2 font-mono text-[11px] max-h-72 overflow-y-auto pr-1">
                {socLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-xl border leading-relaxed ${
                      log.includes('RESOLVED') || log.includes('✅') || log.includes('🛡️')
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : log.includes('ALERT') || log.includes('THREAT') || log.includes('CRITICAL')
                        ? 'bg-red-950/40 border-red-500/40 text-red-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Multan Security Operations Center</span>
                <span className="text-emerald-400 font-bold">24/7 SIEM Active</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. TAB 4: CAREER ROADMAP & SALARY ROI CALCULATOR                      */}
      {/* ===================================================================== */}
      {activeTab === 'career' && (
        <div className="space-y-8">
          
          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>IT Career Roadmap & Regional Salary ROI Calculator</span>
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                Explore your step-by-step career pathway from beginner to senior architect, with verified market salary benchmarks across Pakistan, Gulf, and Global remote markets.
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              {(['PKR', 'AED', 'USD'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    currency === c ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Track Selector Buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(['network', 'cyber', 'cloud', 'linux'] as const).map(trackKey => {
              const trk = CAREER_TRACKS[trackKey];
              const Icon = trk.icon;
              const isSelected = selectedCareerTrack === trackKey;
              return (
                <button
                  key={trackKey}
                  onClick={() => setSelectedCareerTrack(trackKey)}
                  className={`p-5 rounded-3xl border-2 text-left transition-all hover:scale-[1.02] shadow-sm cursor-pointer space-y-3 ${
                    isSelected 
                      ? 'border-[#007A87] bg-cyan-50/40 ring-2 ring-[#007A87]/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isSelected ? 'bg-[#007A87] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 leading-tight">{trk.title}</h4>
                    <span className="text-[11px] font-mono text-slate-500 mt-1 block">Est. {trk.timeline}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Roadmap & Live Salary Dashboard */}
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left: Step-by-Step Curriculum Milestones */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#007A87]">Target Certification Pathway</span>
                <h4 className="text-lg font-display font-extrabold text-slate-900">{currentTrack.title}</h4>
              </div>

              {/* Milestone Timeline */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {currentTrack.milestones.map((ms, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-1">
                    <div className="w-6 h-6 rounded-full bg-[#007A87] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md ring-4 ring-white">
                      {idx + 1}
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex-1 space-y-1">
                      <h5 className="font-extrabold text-xs text-slate-900">{ms.stage}</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{ms.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono mr-2">Target Certifications:</span>
                {currentTrack.certifications.map((cert, cIdx) => (
                  <span key={cIdx} className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Dynamic Interactive Salary Calculator */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#002D62] via-[#003D5C] to-[#005073] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase text-cyan-300 font-bold">Compensation Benchmarks</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                    2026 Verified Data
                  </span>
                </div>

                {/* Experience Tier Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 uppercase font-mono">Seniority Level:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'entry', label: 'Entry (0-1 yr)' },
                      { key: 'mid', label: 'Mid-Level (2-3 yrs)' },
                      { key: 'senior', label: 'Senior (4-6 yrs)' },
                      { key: 'lead', label: 'Architect (7+ yrs)' },
                    ].map(tier => (
                      <button
                        key={tier.key}
                        onClick={() => setExperienceLevel(tier.key as any)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          experienceLevel === tier.key 
                            ? 'bg-cyan-400 text-slate-950 font-extrabold shadow' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Expected Salary Display */}
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1 text-center">
                  <span className="text-[11px] uppercase font-mono text-cyan-300 font-bold">Expected Market Compensation:</span>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white">{currentSalary}</div>
                  <span className="text-[10px] text-slate-300">Based on industry placement records & international remote work</span>
                </div>

                {/* Typical Job Roles */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-300 uppercase font-bold">Typical Career Roles:</span>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {currentTrack.roles.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onNavigateToTab?.('admissions')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accentCyan to-[#007A87] hover:brightness-110 text-slate-950 font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Enroll in This Pathway at Multan Campus</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. TAB 5: CYBER LAB CLI SANDBOX (CISCO IOS, LINUX & PYTHON)           */}
      {/* ===================================================================== */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <CyberLabSandbox />
        </div>
      )}

    </div>
  );
}

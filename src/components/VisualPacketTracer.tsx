import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Network, Server, Shield, Laptop, Layers, ArrowRight, Play, 
  RotateCcw, CheckCircle2, AlertTriangle, Zap, Terminal, Activity, 
  Eye, RefreshCw, Scissors, Plus, Trash2, Send, ChevronRight, 
  Sliders, Globe, HelpCircle, Sparkles, Check, X, Wifi, Radio,
  Lock, KeyRound, Clock, HardDrive, Download, Upload
} from 'lucide-react';

// ============================================================================
// TOPOLOGY TYPES & LAB MODELS
// ============================================================================
export interface TracerDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'server' | 'pc' | 'laptop' | 'ap';
  ip: string;
  mac: string;
  gateway?: string;
  vlan?: number;
  role?: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  status: 'online' | 'warning' | 'offline';
}

export interface TracerLink {
  id: string;
  source: string;
  target: string;
  label?: string;
  cableType: 'copper' | 'fiber' | 'serial' | 'wireless';
  status: 'active' | 'severed';
  bandwidth?: string;
}

export interface TracerLab {
  id: string;
  name: string;
  category: 'CCNA 1 ITN' | 'CCNA 2 SRWE' | 'CCNA 3 ENSA' | 'CCNP' | 'Cyber Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  objective: string;
  verificationChallenge: {
    sourceId: string;
    targetId: string;
    protocol: 'ICMP' | 'HTTP' | 'DNS' | 'ARP';
    expectedSuccess: boolean;
    hint: string;
  };
  devices: TracerDevice[];
  links: TracerLink[];
}

// 8 Production Cisco NetAcad Labs
export const ADVANCED_LABS: TracerLab[] = [
  {
    id: 'lab1',
    name: '1. Basic Branch Office LAN (CCNA 1 - ITN)',
    category: 'CCNA 1 ITN',
    difficulty: 'Beginner',
    description: 'Two branch PCs connected via Catalyst 2960 Switch to a Cisco 4331 Edge Gateway router.',
    objective: 'Verify default gateway reachability, test ICMP Echo response, and inspect Layer 2/3 headers.',
    verificationChallenge: {
      sourceId: 'pc1',
      targetId: 'r1',
      protocol: 'ICMP',
      expectedSuccess: true,
      hint: 'Ping from Sales-PC-01 (192.168.1.10) to Cisco 4331 Gateway (192.168.1.1).'
    },
    devices: [
      { id: 'pc1', name: 'Sales-PC-01', type: 'pc', ip: '192.168.1.10', mac: '00:50:79:66:68:01', gateway: '192.168.1.1', x: 15, y: 70, status: 'online' },
      { id: 'pc2', name: 'Finance-PC-02', type: 'pc', ip: '192.168.1.20', mac: '00:50:79:66:68:02', gateway: '192.168.1.1', x: 15, y: 25, status: 'online' },
      { id: 'sw1', name: 'Catalyst-2960-SW', type: 'switch', ip: '192.168.1.2', mac: '00:0C:85:AA:01:01', gateway: '192.168.1.1', x: 50, y: 50, status: 'online' },
      { id: 'r1', name: 'Cisco-4331-Gateway', type: 'router', ip: '192.168.1.1', mac: '00:0C:85:FF:AA:01', x: 85, y: 50, status: 'online' },
    ],
    links: [
      { id: 'l1', source: 'pc1', target: 'sw1', label: 'Fa0/1', cableType: 'copper', status: 'active', bandwidth: '100 Mbps' },
      { id: 'l2', source: 'pc2', target: 'sw1', label: 'Fa0/2', cableType: 'copper', status: 'active', bandwidth: '100 Mbps' },
      { id: 'l3', source: 'sw1', target: 'r1', label: 'Gig0/0/1', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
    ]
  },
  {
    id: 'lab2',
    name: '2. Inter-VLAN Routing (Router-on-a-Stick 802.1Q)',
    category: 'CCNA 2 SRWE',
    difficulty: 'Intermediate',
    description: 'VLAN 10 (Sales) and VLAN 20 (Engineering) routed across 802.1Q subinterfaces Gig0/0.10 & Gig0/0.20.',
    objective: 'Test communication across isolated VLAN boundaries via trunking encapsulation on Cisco 4331.',
    verificationChallenge: {
      sourceId: 'v10_pc',
      targetId: 'v20_pc',
      protocol: 'ICMP',
      expectedSuccess: true,
      hint: 'Ping from VLAN 10 Host (192.168.10.10) to VLAN 20 Host (192.168.20.20).'
    },
    devices: [
      { id: 'v10_pc', name: 'Sales-VLAN10', type: 'pc', ip: '192.168.10.10', mac: '00:50:79:10:10:01', gateway: '192.168.10.1', vlan: 10, x: 15, y: 30, status: 'online' },
      { id: 'v20_pc', name: 'Eng-VLAN20', type: 'pc', ip: '192.168.20.20', mac: '00:50:79:20:20:01', gateway: '192.168.20.1', vlan: 20, x: 15, y: 70, status: 'online' },
      { id: 'trunk_sw', name: 'Catalyst-Trunk-SW', type: 'switch', ip: '192.168.1.254', mac: '00:0C:85:BB:22:01', x: 50, y: 50, status: 'online' },
      { id: 'roas_r1', name: 'Cisco-ROAS-Router', type: 'router', ip: '192.168.10.1 / 192.168.20.1', mac: '00:0C:85:CC:33:01', x: 85, y: 50, status: 'online' }
    ],
    links: [
      { id: 'l1', source: 'v10_pc', target: 'trunk_sw', label: 'VLAN 10 Access', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l2', source: 'v20_pc', target: 'trunk_sw', label: 'VLAN 20 Access', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l3', source: 'trunk_sw', target: 'roas_r1', label: '802.1Q Trunk (Gig0/0)', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' }
    ]
  },
  {
    id: 'lab3',
    name: '3. Enterprise Perimeter ASA 5506-X Firewall DMZ',
    category: 'Cyber Security',
    difficulty: 'Intermediate',
    description: 'Cisco ASA 5506-X enforcing 3 security zones: Inside (Sec 100), DMZ (Sec 50), and Outside Internet (Sec 0).',
    objective: 'Verify stateful packet inspection allowing outbound traffic while blocking unrequested inbound connections.',
    verificationChallenge: {
      sourceId: 'in_pc',
      targetId: 'dmz_web',
      protocol: 'HTTP',
      expectedSuccess: true,
      hint: 'Execute HTTP GET from Inside Workstation (10.0.1.50) to DMZ Web Server (172.16.10.80).'
    },
    devices: [
      { id: 'in_pc', name: 'Inside-Workstation', type: 'pc', ip: '10.0.1.50', mac: '00:50:79:01:00:50', gateway: '10.0.1.1', x: 15, y: 50, status: 'online' },
      { id: 'asa_fw', name: 'Cisco-ASA-5506X', type: 'firewall', ip: '10.0.1.1', mac: '00:0C:85:DD:44:01', x: 50, y: 50, status: 'online' },
      { id: 'dmz_web', name: 'DMZ-Nginx-Web', type: 'server', ip: '172.16.10.80', mac: '00:50:79:02:00:80', gateway: '172.16.10.1', x: 85, y: 25, status: 'online' },
      { id: 'out_dns', name: 'Cloudflare-DNS', type: 'server', ip: '1.1.1.1', mac: '00:1A:C1:01:01:01', x: 85, y: 75, status: 'online' }
    ],
    links: [
      { id: 'l1', source: 'in_pc', target: 'asa_fw', label: 'Inside (Sec 100)', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l2', source: 'asa_fw', target: 'dmz_web', label: 'DMZ (Sec 50)', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l3', source: 'asa_fw', target: 'out_dns', label: 'Outside (Sec 0)', cableType: 'fiber', status: 'active', bandwidth: '10 Gbps' }
    ]
  },
  {
    id: 'lab4',
    name: '4. Dynamic OSPF Multi-Router Backbone & Auto-Reroute',
    category: 'CCNA 3 ENSA',
    difficulty: 'Advanced',
    description: '3 Cisco Routers in a redundant triangle mesh running Single-Area OSPF Area 0.',
    objective: 'Cut the primary Link 1 and observe dynamic OSPF convergence rerouting traffic along the backup path.',
    verificationChallenge: {
      sourceId: 'r_multan',
      targetId: 'r_karachi',
      protocol: 'ICMP',
      expectedSuccess: true,
      hint: 'Ping R3-Karachi from R1-Multan. Then cut the direct link to test OSPF dynamic reroute.'
    },
    devices: [
      { id: 'r_multan', name: 'R1-Multan-Core', type: 'router', ip: '10.0.12.1', mac: '00:0C:85:01:01:01', x: 20, y: 50, status: 'online' },
      { id: 'r_lahore', name: 'R2-Lahore-Edge', type: 'router', ip: '10.0.23.2', mac: '00:0C:85:02:02:02', x: 50, y: 20, status: 'online' },
      { id: 'r_karachi', name: 'R3-Karachi-Hub', type: 'router', ip: '10.0.13.3', mac: '00:0C:85:03:03:03', x: 80, y: 50, status: 'online' },
      { id: 'pc_host', name: 'Multan-Admin-PC', type: 'pc', ip: '192.168.1.100', mac: '00:50:79:01:01:00', gateway: '10.0.12.1', x: 10, y: 80, status: 'online' }
    ],
    links: [
      { id: 'l_primary', source: 'r_multan', target: 'r_karachi', label: 'Primary Link (Cost 10)', cableType: 'fiber', status: 'active', bandwidth: '10 Gbps' },
      { id: 'l_backup1', source: 'r_multan', target: 'r_lahore', label: 'OSPF Link 1 (Cost 10)', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l_backup2', source: 'r_lahore', target: 'r_karachi', label: 'OSPF Link 2 (Cost 10)', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l_host', source: 'pc_host', target: 'r_multan', label: 'LAN Access', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' }
    ]
  },
  {
    id: 'lab5',
    name: '5. Enterprise LACP EtherChannel Aggregation',
    category: 'CCNP',
    difficulty: 'Advanced',
    description: 'Dual bundled 1 Gbps physical links between Core Switch and Distribution Switch combined into Port-Channel 1.',
    objective: 'Demonstrate 2 Gbps aggregated throughput and verify Spanning Tree loop avoidance with IEEE 802.3ad.',
    verificationChallenge: {
      sourceId: 'srv_a',
      targetId: 'srv_b',
      protocol: 'ICMP',
      expectedSuccess: true,
      hint: 'Transfer high-bandwidth data across aggregated Port-Channel 1.'
    },
    devices: [
      { id: 'srv_a', name: 'Storage-SAN-01', type: 'server', ip: '10.10.10.1', mac: '00:50:79:AA:BB:01', x: 15, y: 50, status: 'online' },
      { id: 'sw_core', name: 'Catalyst-3850-Core', type: 'switch', ip: '10.10.10.254', mac: '00:0C:85:38:50:01', x: 40, y: 50, status: 'online' },
      { id: 'sw_dist', name: 'Catalyst-2960-Dist', type: 'switch', ip: '10.10.10.253', mac: '00:0C:85:29:60:01', x: 65, y: 50, status: 'online' },
      { id: 'srv_b', name: 'Backup-Node-02', type: 'server', ip: '10.10.10.2', mac: '00:50:79:AA:BB:02', x: 88, y: 50, status: 'online' }
    ],
    links: [
      { id: 'l1', source: 'srv_a', target: 'sw_core', label: '10G Fiber', cableType: 'fiber', status: 'active', bandwidth: '10 Gbps' },
      { id: 'l_lacp1', source: 'sw_core', target: 'sw_dist', label: 'Po1: Gig1/0/1', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l_lacp2', source: 'sw_core', target: 'sw_dist', label: 'Po1: Gig1/0/2', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l2', source: 'sw_dist', target: 'srv_b', label: '10G Fiber', cableType: 'fiber', status: 'active', bandwidth: '10 Gbps' }
    ]
  },
  {
    id: 'lab6',
    name: '6. Enterprise Wireless LAN (WLC) & Catalyst AP',
    category: 'CCNA 2 SRWE',
    difficulty: 'Intermediate',
    description: 'Executive Laptop and Staff Device connecting over 802.11ax Wi-Fi 6 to a Catalyst 9115 AP managed by Cisco 9800 WLC.',
    objective: 'Inspect 802.11 RF association frames and CAPWAP tunnel encapsulation back to central controller.',
    verificationChallenge: {
      sourceId: 'laptop_exec',
      targetId: 'corp_intranet',
      protocol: 'HTTP',
      expectedSuccess: true,
      hint: 'Connect over SSID "CyberAI-Enterprise" and fetch corporate portal.'
    },
    devices: [
      { id: 'laptop_exec', name: 'Executive-MacBook', type: 'laptop', ip: '172.20.1.105', mac: 'F0:18:98:AA:11:22', gateway: '172.20.1.1', x: 15, y: 30, status: 'online' },
      { id: 'ap_catalyst', name: 'Catalyst-9115-AP', type: 'ap', ip: '172.20.1.20', mac: '00:0C:85:91:15:01', x: 40, y: 40, status: 'online' },
      { id: 'wlc_9800', name: 'Cisco-9800-WLC', type: 'server', ip: '172.20.1.1', mac: '00:0C:85:98:00:01', x: 65, y: 50, status: 'online' },
      { id: 'corp_intranet', name: 'Multan-Intranet-Srv', type: 'server', ip: '10.50.0.10', mac: '00:50:79:50:00:10', x: 88, y: 50, status: 'online' }
    ],
    links: [
      { id: 'l_wifi', source: 'laptop_exec', target: 'ap_catalyst', label: '802.11ax (SSID: CyberAI)', cableType: 'wireless', status: 'active', bandwidth: '1.2 Gbps' },
      { id: 'l_capwap', source: 'ap_catalyst', target: 'wlc_9800', label: 'CAPWAP Tunnel', cableType: 'copper', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l_corp', source: 'wlc_9800', target: 'corp_intranet', label: 'Core Trunk', cableType: 'copper', status: 'active', bandwidth: '10 Gbps' }
    ]
  },
  {
    id: 'lab7',
    name: '7. Dual-Homed BGP WAN Gateway & ISP Failover',
    category: 'CCNP',
    difficulty: 'Advanced',
    description: 'Enterprise Edge Router (AS 65001) peered via eBGP with PTCL Telecom (AS 17557) and Nayatel Optical (AS 23949).',
    objective: 'Cut PTCL ISP link and verify seamless autonomous failover of Internet traffic to Nayatel backbone.',
    verificationChallenge: {
      sourceId: 'edge_r1',
      targetId: 'root_dns',
      protocol: 'DNS',
      expectedSuccess: true,
      hint: 'Resolve external domain through active upstream BGP peer.'
    },
    devices: [
      { id: 'edge_r1', name: 'Border-BGP-Router', type: 'router', ip: '182.180.1.1', mac: '00:0C:85:B6:01:01', role: 'AS 65001', x: 20, y: 50, status: 'online' },
      { id: 'isp_ptcl', name: 'PTCL-BGP-Peer', type: 'router', ip: '182.180.1.2', mac: '00:0C:85:17:55:01', role: 'AS 17557', x: 55, y: 25, status: 'online' },
      { id: 'isp_nayatel', name: 'Nayatel-BGP-Peer', type: 'router', ip: '110.36.1.1', mac: '00:0C:85:23:94:01', role: 'AS 23949', x: 55, y: 75, status: 'online' },
      { id: 'root_dns', name: 'Google-Public-DNS', type: 'server', ip: '8.8.8.8', mac: '00:1A:C1:08:08:08', x: 88, y: 50, status: 'online' }
    ],
    links: [
      { id: 'l_ptcl', source: 'edge_r1', target: 'isp_ptcl', label: 'eBGP Primary (AS 17557)', cableType: 'fiber', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l_nayatel', source: 'edge_r1', target: 'isp_nayatel', label: 'eBGP Backup (AS 23949)', cableType: 'fiber', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l_inet1', source: 'isp_ptcl', target: 'root_dns', label: 'Global Transit', cableType: 'fiber', status: 'active', bandwidth: '100 Gbps' },
      { id: 'l_inet2', source: 'isp_nayatel', target: 'root_dns', label: 'Global Transit', cableType: 'fiber', status: 'active', bandwidth: '100 Gbps' }
    ]
  },
  {
    id: 'lab8',
    name: '8. Zero Trust Remote VPN & IPsec Crypto Tunnel',
    category: 'Cyber Security',
    difficulty: 'Advanced',
    description: 'Remote Teleworker workstation connecting across the public Internet via IPsec IKEv2 ESP tunnel to Multan Campus ASA.',
    objective: 'Inspect encrypted IPsec ESP payload protecting sensitive Active Directory and file server communications.',
    verificationChallenge: {
      sourceId: 'remote_tele',
      targetId: 'hq_filesrv',
      protocol: 'HTTP',
      expectedSuccess: true,
      hint: 'Tunnel secure encrypted traffic through public Internet gateway.'
    },
    devices: [
      { id: 'remote_tele', name: 'Home-Workstation', type: 'pc', ip: '192.168.100.5', mac: '00:50:79:AA:00:05', gateway: '192.168.100.1', x: 15, y: 50, status: 'online' },
      { id: 'pub_cloud', name: 'Public-Internet-WAN', type: 'router', ip: '203.135.10.1', mac: '00:0C:85:20:00:01', x: 40, y: 50, status: 'online' },
      { id: 'hq_asa', name: 'Multan-HQ-ASA', type: 'firewall', ip: '115.186.15.1', mac: '00:0C:85:11:50:01', x: 65, y: 50, status: 'online' },
      { id: 'hq_filesrv', name: 'Campus-AD-Server', type: 'server', ip: '10.0.0.15', mac: '00:50:79:10:00:15', x: 88, y: 50, status: 'online' }
    ],
    links: [
      { id: 'l_rem', source: 'remote_tele', target: 'pub_cloud', label: 'Home ISP Link', cableType: 'copper', status: 'active', bandwidth: '100 Mbps' },
      { id: 'l_vpn', source: 'pub_cloud', target: 'hq_asa', label: 'IPsec IKEv2 ESP Tunnel', cableType: 'fiber', status: 'active', bandwidth: '1 Gbps' },
      { id: 'l_hq', source: 'hq_asa', target: 'hq_filesrv', label: 'Internal Trusted Core', cableType: 'copper', status: 'active', bandwidth: '10 Gbps' }
    ]
  }
];

// Supported transmission protocols
export type TransmissionProtocol = 'ICMP' | 'HTTP' | 'DNS' | 'ARP' | 'DHCP';

export default function VisualPacketTracer({ onNavigateToTab }: { onNavigateToTab?: (tab: any) => void } = {}) {
  // Current Lab Preset
  const [selectedLabId, setSelectedLabId] = useState<string>('lab1');
  const activeLab = ADVANCED_LABS.find(l => l.id === selectedLabId) || ADVANCED_LABS[0];

  // Dynamic Devices & Links on Canvas
  const [devices, setDevices] = useState<TracerDevice[]>(activeLab.devices);
  const [links, setLinks] = useState<TracerLink[]>(activeLab.links);

  // Selected Device for Inspector / CLI Console
  const [selectedDevice, setSelectedDevice] = useState<TracerDevice | null>(null);
  const [isCliOpen, setIsCliOpen] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<{ type: 'input' | 'output' | 'system'; text: string }[]>([]);

  // Transmission Configuration
  const [sourceDevId, setSourceDevId] = useState<string>(activeLab.devices[0]?.id || 'pc1');
  const [destDevId, setDestDevId] = useState<string>(activeLab.devices[activeLab.devices.length - 1]?.id || 'r1');
  const [protocol, setProtocol] = useState<TransmissionProtocol>('ICMP');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 0.5x, 1x, 2x

  // Animation State
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [activeHopIndex, setActiveHopIndex] = useState(0);
  const [pathNodes, setPathNodes] = useState<TracerDevice[]>([]);
  const [packetDissection, setPacketDissection] = useState<any | null>(null);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    `[READY] Visual Cisco Packet Tracer loaded "${activeLab.name}".`,
    `[INFO] Category: ${activeLab.category} • Objective: ${activeLab.objective}`
  ]);

  // Lab Challenge Completion Tracking
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state when lab changes
  useEffect(() => {
    const lab = ADVANCED_LABS.find(l => l.id === selectedLabId);
    if (lab) {
      setDevices(lab.devices);
      setLinks(lab.links);
      setSelectedDevice(null);
      setIsCliOpen(false);
      setChallengeCompleted(false);
      setSourceDevId(lab.devices[0]?.id || '');
      setDestDevId(lab.devices[lab.devices.length - 1]?.id || '');
      setSimulationLog([
        `[LAB INITIALIZED] Loaded "${lab.name}".`,
        `[OBJECTIVE] ${lab.objective}`
      ]);
    }
  }, [selectedLabId]);

  // Compute Network Path from Source to Destination (Dijkstra-inspired graph traverse)
  const computeActivePath = (srcId: string, dstId: string): TracerDevice[] => {
    // Build adjacency map considering only active (non-severed) links
    const adj: Record<string, string[]> = {};
    devices.forEach(d => { adj[d.id] = []; });

    links.forEach(l => {
      if (l.status === 'active') {
        adj[l.source]?.push(l.target);
        adj[l.target]?.push(l.source);
      }
    });

    // BFS shortest path
    const queue: string[][] = [[srcId]];
    const visited = new Set<string>([srcId]);

    while (queue.length > 0) {
      const currentPath = queue.shift()!;
      const currentNodeId = currentPath[currentPath.length - 1];

      if (currentNodeId === dstId) {
        return currentPath.map(id => devices.find(d => d.id === id)!).filter(Boolean);
      }

      for (const neighbor of (adj[currentNodeId] || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...currentPath, neighbor]);
        }
      }
    }

    return []; // No viable path (link severed)
  };

  // Launch Packet Transmission
  const handleStartTransmission = () => {
    if (isTransmitting) return;

    const src = devices.find(d => d.id === sourceDevId);
    const dst = devices.find(d => d.id === destDevId);
    if (!src || !dst) {
      showToast('⚠️ Please select both a valid Source and Destination node.');
      return;
    }

    const calculatedPath = computeActivePath(src.id, dst.id);

    if (calculatedPath.length < 2) {
      setSimulationLog(prev => [
        `❌ [HOST UNREACHABLE] No active path found from ${src.name} to ${dst.name}! Link may be severed.`,
        ...prev
      ]);
      showToast('❌ Destination host unreachable. Check for severed physical links.');
      return;
    }

    setPathNodes(calculatedPath);
    setIsTransmitting(true);
    setProgress(0);
    setActiveHopIndex(0);

    // Build Packet Dissection
    let l4Info = 'ICMP Type 8 (Echo Request), Checksum 0x4B3A';
    if (protocol === 'HTTP') l4Info = 'TCP Port 80 (HTTP GET /index.html), Seq #101, ACK #0, SYN=1';
    else if (protocol === 'DNS') l4Info = 'UDP Port 53, Query: "cyberaiacademy.com" (IN A)';
    else if (protocol === 'ARP') l4Info = `ARP Who-has ${dst.ip}? Tell ${src.ip} (Hardware type 1)`;
    else if (protocol === 'DHCP') l4Info = 'DHCP Discover, Client MAC: ' + src.mac;

    setPacketDissection({
      protocol,
      source: src,
      dest: dst,
      pathSummary: calculatedPath.map(p => p.name).join(' ➔ '),
      layer2: {
        srcMac: src.mac,
        dstMac: calculatedPath[1]?.mac || dst.mac,
        type: protocol === 'ARP' ? '0x0806 (ARP)' : '0x0800 (IPv4)',
        vlan: src.vlan ? `802.1Q VLAN ${src.vlan}` : 'Untagged'
      },
      layer3: {
        srcIp: src.ip,
        dstIp: dst.ip,
        ttl: 64,
        protocolNum: protocol === 'ICMP' ? '1 (ICMP)' : protocol === 'HTTP' ? '6 (TCP)' : '17 (UDP)'
      },
      layer4: l4Info
    });

    setSimulationLog(prev => [
      `[TRANSMIT] Generating ${protocol} packet from ${src.name} (${src.ip}) to ${dst.name} (${dst.ip})...`,
      `[PATH] Forwarding path: ${calculatedPath.map(n => n.name).join(' ➔ ')}`,
      ...prev
    ]);

    // Animate across path
    const intervalMs = Math.round(50 / simulationSpeed);
    let p = 0;
    const interval = setInterval(() => {
      p += 3;
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        setIsTransmitting(false);

        setSimulationLog(prev => [
          `✓ [COMPLETED] ${protocol} exchange successful! RTT = ${(Math.random() * 2 + 1.2).toFixed(2)}ms (0% packet loss).`,
          ...prev
        ]);

        // Check if verified the lab challenge
        const isMatch = (
          activeLab.verificationChallenge.sourceId === src.id &&
          activeLab.verificationChallenge.targetId === dst.id &&
          (activeLab.verificationChallenge.protocol === protocol || activeLab.verificationChallenge.protocol === 'ICMP')
        );

        if (isMatch) {
          setChallengeCompleted(true);
          showToast('🎉 Lab Challenge Objective Verified & Completed!');
        }
      }
    }, intervalMs);
  };

  // Toggle/Sever a physical cable link
  const handleToggleLink = (linkId: string) => {
    setLinks(prev => prev.map(l => {
      if (l.id === linkId) {
        const nextStatus = l.status === 'active' ? 'severed' : 'active';
        showToast(nextStatus === 'severed' ? `✂️ Link ${l.label || l.id} severed!` : `🔌 Link restored!`);
        return { ...l, status: nextStatus };
      }
      return l;
    }));
  };

  // Open CLI Console on Device
  const handleOpenCli = (device: TracerDevice) => {
    setSelectedDevice(device);
    setIsCliOpen(true);
    setCliHistory([
      { type: 'system', text: `Connected to ${device.name} [${device.ip}] via Direct Console Port.` },
      { type: 'system', text: `System Architecture: ${device.type.toUpperCase()} • Type "help" or "?" for commands.` }
    ]);
  };

  // Execute Console Commands
  const handleCliCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim() || !selectedDevice) return;

    const cmd = cliInput.trim();
    const cmdLower = cmd.toLowerCase();
    const newHistory = [...cliHistory, { type: 'input' as const, text: cmd }];

    if (cmdLower === 'help' || cmdLower === '?') {
      newHistory.push({
        type: 'output',
        text: 'Available Commands:\n  show ip interface brief\n  show ip route\n  show vlan brief\n  show mac address-table\n  show access-list\n  ping <ip>\n  ipconfig\n  clear'
      });
    } else if (cmdLower === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    } else if (cmdLower.includes('show ip int') || cmdLower.includes('ipconfig') || cmdLower.includes('ifconfig')) {
      newHistory.push({
        type: 'output',
        text: `Interface                  IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0/0       ${selectedDevice.ip}     YES manual up                    up\nGigabitEthernet0/0/1       10.0.0.1        YES manual up                    up\nMAC: ${selectedDevice.mac}  Gateway: ${selectedDevice.gateway || 'N/A'}`
      });
    } else if (cmdLower.includes('show ip route')) {
      newHistory.push({
        type: 'output',
        text: `Codes: C - connected, S - static, O - OSPF, B - BGP\n\nGateway of last resort is ${selectedDevice.gateway || '192.168.1.1'} to network 0.0.0.0\n\nC    192.168.1.0/24 is directly connected, GigabitEthernet0/0/0\nO    10.0.0.0/8 [110/2] via 10.0.12.2, 00:14:22, GigabitEthernet0/0/1\nS*   0.0.0.0/0 [1/0] via ${selectedDevice.gateway || '192.168.1.1'}`
      });
    } else if (cmdLower.includes('show vlan')) {
      newHistory.push({
        type: 'output',
        text: `VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Fa0/3 - Fa0/24\n10   Sales                            active    Fa0/1\n20   Engineering                      active    Fa0/2`
      });
    } else if (cmdLower.startsWith('ping')) {
      const target = cmd.split(' ')[1] || '192.168.1.1';
      newHistory.push({
        type: 'output',
        text: `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`
      });
    } else {
      newHistory.push({
        type: 'output',
        text: `% Command "${cmd}" executed successfully. Device status: NORMAL.`
      });
    }

    setCliHistory(newHistory);
    setCliInput('');
  };

  // Calculate current animated packet position along multi-hop path
  const currentPacketCoords = useMemo(() => {
    if (!isTransmitting || pathNodes.length < 2) return null;

    const totalSegments = pathNodes.length - 1;
    const segmentPct = 100 / totalSegments;
    const currentSegmentIndex = Math.min(Math.floor(progress / segmentPct), totalSegments - 1);
    const segmentProgress = (progress % segmentPct) / segmentPct;

    const n1 = pathNodes[currentSegmentIndex];
    const n2 = pathNodes[currentSegmentIndex + 1];

    if (!n1 || !n2) return null;

    return {
      x: n1.x + (n2.x - n1.x) * segmentProgress,
      y: n1.y + (n2.y - n1.y) * segmentProgress
    };
  }, [isTransmitting, progress, pathNodes]);

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. TOP LAB SELECTOR & CONTROLS RIBBON */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#007A87]/10 text-[#007A87] border border-[#007A87]/20 uppercase">
              {activeLab.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeLab.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              activeLab.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {activeLab.difficulty} Level
            </span>
            {challengeCompleted && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" /> Objective Completed
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900">
            {activeLab.name}
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {activeLab.description} <strong>Objective:</strong> {activeLab.objective}
          </p>
        </div>

        {/* Lab Dropdown Picker */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase font-mono">Select Lab:</span>
          <select
            value={selectedLabId}
            onChange={(e) => setSelectedLabId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007A87] cursor-pointer shadow-sm"
          >
            {ADVANCED_LABS.map(lab => (
              <option key={lab.id} value={lab.id}>{lab.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. MAIN VISUAL INTERACTIVE PACKET TRACER CANVAS */}
      <div className="relative w-full aspect-[16/9] min-h-[440px] max-h-[580px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-6 select-none">
        
        {/* SVG Cable Network & Topology Grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <pattern id="tracerGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tracerGrid)" />

          {/* Render Cable Links */}
          {links.map((link) => {
            const srcDev = devices.find(d => d.id === link.source);
            const tgtDev = devices.find(d => d.id === link.target);
            if (!srcDev || !tgtDev) return null;

            const isSevered = link.status === 'severed';
            const isCableTransmitting = isTransmitting && (
              pathNodes.some(n => n.id === link.source) && pathNodes.some(n => n.id === link.target)
            );

            let strokeColor = '#334155';
            let strokeDash = undefined;
            if (isSevered) {
              strokeColor = '#EF4444';
              strokeDash = '6,6';
            } else if (isCableTransmitting) {
              strokeColor = '#00F2FE';
            } else if (link.cableType === 'fiber') {
              strokeColor = '#F59E0B'; // Amber for fiber
            } else if (link.cableType === 'wireless') {
              strokeColor = '#8B5CF6';
              strokeDash = '4,4';
            }

            return (
              <g key={link.id}>
                {/* Glow Underlay on Transmit */}
                {isCableTransmitting && !isSevered && (
                  <line
                    x1={`${srcDev.x}%`}
                    y1={`${srcDev.y}%`}
                    x2={`${tgtDev.x}%`}
                    y2={`${tgtDev.y}%`}
                    stroke="#00F2FE"
                    strokeWidth="6"
                    strokeOpacity="0.4"
                    strokeDasharray="6,6"
                  />
                )}

                {/* Cable Wire */}
                <line
                  x1={`${srcDev.x}%`}
                  y1={`${srcDev.y}%`}
                  x2={`${tgtDev.x}%`}
                  y2={`${tgtDev.y}%`}
                  stroke={strokeColor}
                  strokeWidth={isCableTransmitting ? '3' : '2'}
                  strokeDasharray={strokeDash}
                />

                {/* Midpoint Port Label & Cable Cut Button */}
                <g 
                  transform={`translate(${(srcDev.x + tgtDev.x) / 2 * 10}, ${(srcDev.y + tgtDev.y) / 2 * 10})`}
                  className="pointer-events-auto cursor-pointer"
                >
                  <text
                    x={`${(srcDev.x + tgtDev.x) / 2}%`}
                    y={`${(srcDev.y + tgtDev.y) / 2 - 2}%`}
                    fill={isSevered ? '#EF4444' : '#94A3B8'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none font-bold"
                  >
                    {link.label} {isSevered ? '(LINK DOWN)' : ''}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Animated Packet Gliding Along Path */}
          {currentPacketCoords && (
            <g>
              <circle cx={`${currentPacketCoords.x}%`} cy={`${currentPacketCoords.y}%`} r="14" fill="#00F2FE" opacity="0.3" />
              <circle cx={`${currentPacketCoords.x}%`} cy={`${currentPacketCoords.y}%`} r="7" fill={protocol === 'HTTP' ? '#10B981' : protocol === 'DNS' ? '#8B5CF6' : '#00F2FE'} />
              <circle cx={`${currentPacketCoords.x}%`} cy={`${currentPacketCoords.y}%`} r="3" fill="#FFFFFF" />
            </g>
          )}
        </svg>

        {/* Top Floating Control Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Protocol & Transmission Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-1 font-bold">Protocol:</span>
            {(['ICMP', 'HTTP', 'DNS', 'ARP'] as const).map(p => (
              <button
                key={p}
                onClick={() => setProtocol(p)}
                className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                  protocol === p 
                    ? 'bg-gradient-to-r from-cyan-400 to-[#007A87] text-slate-950 font-black shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-700 mx-1" />

            <span className="text-[10px] font-mono uppercase text-slate-400 px-1 font-bold">From:</span>
            <select
              value={sourceDevId}
              onChange={(e) => setSourceDevId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer"
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
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer"
            >
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>
              ))}
            </select>

            <button
              onClick={handleStartTransmission}
              disabled={isTransmitting}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                isTransmitting 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 cursor-wait' 
                  : 'bg-gradient-to-r from-[#00F2FE] to-[#007A87] hover:brightness-110 text-slate-950 font-extrabold'
              }`}
            >
              {isTransmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Forwarding ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>Send {protocol} Packet</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Cable Link Failure Testing Buttons */}
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800">
            <Scissors className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Sever / Cut Link:</span>
            {links.slice(0, 2).map((lnk, idx) => (
              <button
                key={lnk.id}
                onClick={() => handleToggleLink(lnk.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  lnk.status === 'severed' 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-300'
                }`}
              >
                {lnk.status === 'severed' ? `Re-connect ${lnk.label || `L${idx+1}`}` : `Cut ${lnk.label || `L${idx+1}`}`}
              </button>
            ))}
          </div>

        </div>

        {/* Devices Node Rendering on Canvas */}
        <div className="relative z-10 w-full h-full pointer-events-none">
          {devices.map((device) => {
            const isSelected = selectedDevice?.id === device.id;
            const isSource = sourceDevId === device.id;
            const isDest = destDevId === device.id;

            let IconComponent = Laptop;
            if (device.type === 'router') IconComponent = Network;
            else if (device.type === 'switch') IconComponent = Layers;
            else if (device.type === 'firewall') IconComponent = Shield;
            else if (device.type === 'server') IconComponent = Server;
            else if (device.type === 'ap') IconComponent = Radio;

            return (
              <div
                key={device.id}
                style={{ left: `${device.x}%`, top: `${device.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer flex flex-col items-center group transition-transform hover:scale-110 ${
                  isSelected ? 'scale-110' : ''
                }`}
              >
                {/* Node Chassis Box */}
                <div 
                  onClick={() => setSelectedDevice(device)}
                  className={`relative p-3.5 rounded-2xl backdrop-blur-md transition-all shadow-2xl ${
                    isSelected 
                      ? 'bg-slate-800 border-2 border-cyan-400 shadow-cyan-500/30' 
                      : isSource
                      ? 'bg-slate-900 border-2 border-cyan-400'
                      : isDest
                      ? 'bg-slate-900 border-2 border-emerald-400'
                      : 'bg-slate-900/90 border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <IconComponent className={`w-7 h-7 ${
                    device.type === 'router' ? 'text-emerald-400' :
                    device.type === 'switch' ? 'text-blue-400' :
                    device.type === 'firewall' ? 'text-amber-400' :
                    device.type === 'server' ? 'text-purple-400' :
                    device.type === 'ap' ? 'text-pink-400' : 'text-cyan-400'
                  }`} />

                  {/* SRC / DST Badge */}
                  {isSource && (
                    <span className="absolute -top-2.5 -left-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-black bg-cyan-400 text-slate-950 uppercase shadow">
                      SRC
                    </span>
                  )}
                  {isDest && (
                    <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-black bg-emerald-400 text-slate-950 uppercase shadow">
                      DST
                    </span>
                  )}
                </div>

                {/* Device Labels */}
                <div className="mt-1.5 text-center space-y-0.5">
                  <span className="text-[11px] font-bold text-white block truncate max-w-[130px] drop-shadow">
                    {device.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 block bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                    {device.ip}
                  </span>
                </div>

                {/* Hover Quick Action Buttons */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCli(device);
                    }}
                    className="p-1 rounded bg-[#007A87] hover:bg-cyan-500 text-slate-950 text-[9px] font-mono font-bold flex items-center gap-1 px-1.5 shadow"
                    title="Open Device CLI Console"
                  >
                    <Terminal className="w-2.5 h-2.5" /> CLI
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Status / Packet Summary Footer */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-800 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] text-cyan-300 font-bold">
              {simulationLog[0] || 'Simulation engine running.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">Speed:</span>
            {[0.5, 1, 2].map(spd => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  simulationSpeed === spd ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. HARDWARE INSPECTOR, WIRESHARK DISSECTOR & INTEGRATED CONSOLE */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Node Parameters & Direct CLI Trigger */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#007A87]" />
              <h4 className="text-sm font-bold text-slate-900">
                Hardware Node Telemetry
              </h4>
            </div>
            {selectedDevice && (
              <button
                onClick={() => handleOpenCli(selectedDevice)}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" /> Open CLI Console
              </button>
            )}
          </div>

          {selectedDevice ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Host Name</span>
                  <span className="font-extrabold text-slate-900">{selectedDevice.name}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Device Class</span>
                  <span className="font-extrabold text-[#007A87] uppercase">{selectedDevice.type}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">IPv4 Configuration</span>
                  <span className="font-mono font-bold text-slate-900">{selectedDevice.ip}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Layer 2 MAC</span>
                  <span className="font-mono font-bold text-slate-700">{selectedDevice.mac}</span>
                </div>
              </div>

              {selectedDevice.gateway && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Default Gateway:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedDevice.gateway}</span>
                </div>
              )}

              {selectedDevice.vlan && (
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs flex justify-between items-center text-blue-900">
                  <span className="text-[10px] uppercase font-mono text-blue-600 font-bold">Assigned VLAN:</span>
                  <span className="font-mono font-bold">VLAN {selectedDevice.vlan}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setSourceDevId(selectedDevice.id)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-[#002D62] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Set as Source
                </button>
                <button
                  onClick={() => setDestDevId(selectedDevice.id)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-[#007A87] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Set as Destination
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Eye className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Click any router, switch, firewall, server, or PC on the canvas above to inspect hardware telemetry.</p>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Live Wireshark Frame Dissector */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Live Frame Dissector (Wireshark Model)
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              FRAME CAPTURE: {protocol}
            </span>
          </div>

          {packetDissection ? (
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
                <div className="flex justify-between items-center text-blue-900 font-bold">
                  <span>Layer 2: Ethernet II Frame Header</span>
                  <span className="text-[10px] text-blue-600">{packetDissection.layer2.type} • {packetDissection.layer2.vlan}</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Source MAC: <span className="font-bold text-slate-900">{packetDissection.layer2.srcMac}</span> ➔ Destination: <span className="font-bold text-slate-900">{packetDissection.layer2.dstMac}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <div className="flex justify-between items-center text-emerald-900 font-bold">
                  <span>Layer 3: IPv4 Packet Header</span>
                  <span className="text-[10px] text-emerald-600">TTL: {packetDissection.layer3.ttl} • Protocol: {packetDissection.layer3.protocolNum}</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Source IP: <span className="font-bold text-slate-900">{packetDissection.layer3.srcIp}</span> ➔ Destination: <span className="font-bold text-slate-900">{packetDissection.layer3.dstIp}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                <div className="flex justify-between items-center text-purple-900 font-bold">
                  <span>Layer 4 / Payload: {protocol} Payload</span>
                  <span className="text-[10px] text-purple-600">Checksum Verified</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Payload Details: <span className="font-bold text-purple-950">{packetDissection.layer4}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 text-cyan-300 text-[11px] flex justify-between items-center">
                <span>Forwarding Route:</span>
                <span className="font-bold">{packetDissection.pathSummary}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Network className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Click "Send {protocol} Packet" above to dissect and view Layer 2, Layer 3, and Layer 4 headers.</p>
            </div>
          )}
        </div>

      </div>

      {/* 4. INTEGRATED DEVICE CONSOLE CLI MODAL */}
      {isCliOpen && selectedDevice && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-white font-mono animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Console CLI — {selectedDevice.name} ({selectedDevice.ip})
                </h4>
              </div>
              <button
                onClick={() => setIsCliOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Screen */}
            <div className="h-64 overflow-y-auto space-y-1.5 text-xs text-slate-300 p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              {cliHistory.map((line, idx) => (
                <div key={idx} className={line.type === 'system' ? 'text-cyan-400' : line.type === 'input' ? 'text-emerald-400 font-bold' : 'text-slate-200 whitespace-pre-wrap'}>
                  {line.type === 'input' ? `${selectedDevice.name}# ${line.text}` : line.text}
                </div>
              ))}
            </div>

            {/* Input Line */}
            <form onSubmit={handleCliCommandSubmit} className="flex items-center gap-2">
              <span className="text-emerald-400 text-xs font-bold">{selectedDevice.name}#</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder='Type "show ip route", "show ip interface brief", "show vlan", "ping 192.168.1.1"...'
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono font-bold animate-slide-up flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

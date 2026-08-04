import { useState, useEffect } from 'react';
import { aiService } from './aiService';

export interface Course {
  id: string;
  title: string;
  category: 'Networking' | 'Cybersecurity' | 'Programming' | 'Automation' | 'IoT & Analytics' | 'Operating Systems';
  provider: 'CyberAI' | 'NetAcad' | 'Hybrid';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  badgeName?: string;
  badgeColor?: string;
  enrollmentStatus: 'not_enrolled' | 'in_progress' | 'completed';
  progress: number; // 0 to 100
  imageUrl: string;
  syllabusOutline: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  earnedDate: string;
  hash: string;
}

export interface UserProfile {
  name: string;
  rank: string;
  xp: number;
  studyHours: number;
  certificatesCount: number;
  targetPathway?: string;
}

export interface Pathway {
  id: string;
  title: string;
  career: string;
  salary: string;
  certifications: string;
  courseIds: string[];
  color: string;
  description: string;
  longDesc: string;
}

const INITIAL_COURSES: Course[] = [
  // --- NETWORKING AREA ---
  {
    id: 'ccna-itn',
    title: 'CCNA: Introduction to Networks (ITN)',
    category: 'Networking',
    provider: 'NetAcad',
    description: 'Covers the architecture, structure, functions and components of the Internet and other computer networks, aligning with the CCNA exam.',
    difficulty: 'Beginner',
    duration: '17 hours',
    modulesCount: 17,
    badgeName: 'CCNA Network Starter',
    badgeColor: '#00F2FE',
    enrollmentStatus: 'completed',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Networking Today & Global Connections",
      "Chapter 2: Basic Switch and End Device Configuration",
      "Chapter 3: Protocols and Communication Models",
      "Chapter 4: Physical Layer & Network Media",
      "Chapter 5: Number Systems (Binary & Hexadecimal)",
      "Chapter 6: Data Link Layer Access",
      "Chapter 7: Ethernet Switching Concepts",
      "Chapter 8: Network Layer Protocols & Routing",
      "Chapter 9: Address Resolution (ARP & NDP)",
      "Chapter 10: Basic Router Configuration",
      "Chapter 11: IPv4 Addressing & Subnetting",
      "Chapter 12: IPv6 Addressing & Network Allocation",
      "Chapter 13: ICMP Diagnostics & Testing",
      "Chapter 14: Transport Layer Services (TCP & UDP)",
      "Chapter 15: Application Layer Protocols (HTTP, DNS, DHCP)",
      "Chapter 16: Network Security Fundamentals",
      "Chapter 17: Build a Small Network & Test Topology"
    ]
  },
  {
    id: 'ccna-srwe',
    title: 'CCNA: Switching, Routing, and Wireless Essentials (SRWE)',
    category: 'Networking',
    provider: 'NetAcad',
    description: 'Focuses on switching technologies and router operations that support small-to-medium business networks, including wireless LANs (WLANs).',
    difficulty: 'Intermediate',
    duration: '24 hours',
    modulesCount: 16,
    badgeName: 'CCNA Routing Specialist',
    badgeColor: '#00FF87',
    enrollmentStatus: 'in_progress',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Basic Device Configuration & Port Settings",
      "Chapter 2: Switching Concepts & MAC Address Tables",
      "Chapter 3: VLANs & Inter-VLAN Routing Configurations",
      "Chapter 4: Redundant Networks & Spanning Tree Protocol (STP)",
      "Chapter 5: EtherChannel Link Aggregation",
      "Chapter 6: DHCPv4 Server and Client Configurations",
      "Chapter 7: SLAAC and DHCPv6 Configuration Rules",
      "Chapter 8: FHRP Concepts (HSRP Configuration)",
      "Chapter 9: LAN Security Concepts & Threat Mitigation",
      "Chapter 10: Switch Security Configuration (Port Security)",
      "Chapter 11: WLAN Concepts & Wireless Protocols",
      "Chapter 12: WLAN Configuration & WPA2 Enterprise",
      "Chapter 13: Routing Concepts & Packet Forwarding",
      "Chapter 14: IP Static Routing Configuration",
      "Chapter 15: Troubleshoot Static and Default Routes"
    ]
  },
  {
    id: 'ccna-ensa',
    title: 'CCNA: Enterprise Networking, Security, and Automation (ENSA)',
    category: 'Networking',
    provider: 'NetAcad',
    description: 'Describes the architectures and considerations associated with designing, securing, operating, and troubleshooting enterprise networks.',
    difficulty: 'Advanced',
    duration: '28 hours',
    modulesCount: 14,
    badgeName: 'Cisco Enterprise Architect',
    badgeColor: '#FF9F00',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Single-Area OSPFv2 Concepts",
      "Chapter 2: Single-Area OSPFv2 Configuration",
      "Chapter 3: Network Security Concepts & Firewalls",
      "Chapter 4: Access Control Lists (ACLs) Configuration",
      "Chapter 5: NAT for IPv4 (Static, Dynamic, PAT)",
      "Chapter 6: WAN Concepts & Tunneling Methods",
      "Chapter 7: VPN and IPsec Tunnel Security",
      "Chapter 8: QoS Concepts & Traffic Management",
      "Chapter 9: Network Management (SNMP, Syslog, NTP)",
      "Chapter 10: Network Design & Star Topologies",
      "Chapter 11: Network Troubleshooting Methodologies",
      "Chapter 12: Network Virtualization (VMs & Containers)",
      "Chapter 13: Network Automation & SDN Controllers",
      "Chapter 14: REST APIs and JSON payload parsing"
    ]
  },
  {
    id: 'networking-essentials',
    title: 'Networking Essentials',
    category: 'Networking',
    provider: 'NetAcad',
    description: 'Learn routing, switching, and basic IP addressing rules required to build and secure local area networks.',
    difficulty: 'Beginner',
    duration: '22 hours',
    modulesCount: 9,
    badgeName: 'NetAcad Network Associate',
    badgeColor: '#00F2FE',
    enrollmentStatus: 'in_progress',
    progress: 30,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Communications in a Connected World",
      "Module 2: Network Components & Connections",
      "Module 3: Cisco IOS CLI commands & Device Config",
      "Module 4: Network Protocols & Communication Models",
      "Module 5: Ethernet and Local Area Networks",
      "Module 6: IPv4 and IPv6 Subnets and Addressing",
      "Module 7: DHCP, DNS, and Gateway Routing Services",
      "Module 8: Protecting Your Network & Basic Security",
      "Module 9: Troubleshooting Network connectivity issues"
    ]
  },
  {
    id: 'ccst-networking',
    title: 'Cisco Certified Support Technician (CCST) Networking',
    category: 'Networking',
    provider: 'NetAcad',
    description: 'Prepares you for entry-level networking support roles. Validates knowledge of networking basics and troubleshooting.',
    difficulty: 'Beginner',
    duration: '20 hours',
    modulesCount: 12,
    badgeName: 'Cisco CCST Network Tech',
    badgeColor: '#FF007F',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Standard OSI & TCP/IP Model layers",
      "Chapter 2: Physical Network Connections & Media",
      "Chapter 3: IPv4 and IPv6 Address Allocations",
      "Chapter 4: Basic Protocol Services (DHCP, DNS, NAT)",
      "Chapter 5: Router & Switch Functions in Topologies",
      "Chapter 6: Wireless LAN basics & WPA3 Protocols",
      "Chapter 7: Basic Security Audits & Asset Defense",
      "Chapter 8: Diagnostic Commands (Ping, Traceroute, Arp)",
      "Chapter 9: Entry-level Troubleshooting scenarios"
    ]
  },

  // --- CYBERSECURITY AREA ---
  {
    id: 'intro-cyber',
    title: 'Introduction to Cybersecurity',
    category: 'Cybersecurity',
    provider: 'NetAcad',
    description: 'Learn the fundamentals of cybersecurity, data confidentiality, network security protocols, and standard compliance frameworks to protect digital assets.',
    difficulty: 'Beginner',
    duration: '15 hours',
    modulesCount: 5,
    badgeName: 'NetAcad Cyber Starter',
    badgeColor: '#00A854',
    enrollmentStatus: 'completed',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: The Global Need for Cybersecurity Shielding",
      "Module 2: Attacker Tactics, Malware types, and Vulnerabilities",
      "Module 3: Protecting Personal Privacy and Secret Keys",
      "Module 4: Protecting Corporate IT Systems and Firewalls",
      "Module 5: Pathways to Careers in Cyber Defense & Security Ops"
    ]
  },
  {
    id: 'cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    category: 'Cybersecurity',
    provider: 'NetAcad',
    description: 'Provides a deeper dive into tactical cybersecurity, vulnerability testing, digital forensics, and network defense controls.',
    difficulty: 'Intermediate',
    duration: '30 hours',
    modulesCount: 8,
    badgeName: 'Cisco Cyber Guard',
    badgeColor: '#7F00FF',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Cybersecurity Concepts & The Cybersecurity Cube",
      "Module 2: Malware threats, Trojan Vectors, and Countermeasures",
      "Module 3: The Art of Securing Devices and Hardening OS",
      "Module 4: Cryptographic Hashing Algorithms & Public Key Infrastructure",
      "Module 5: Implementing Access Control & Firewalls",
      "Module 6: Protecting the Network Infrastructure",
      "Module 7: Vulnerability and Risk Assessments",
      "Module 8: Incident Handling and Disaster Recovery Policies"
    ]
  },
  {
    id: 'ccst-cybersecurity',
    title: 'Cisco Certified Support Technician (CCST) Cybersecurity',
    category: 'Cybersecurity',
    provider: 'NetAcad',
    description: 'Entry-level cybersecurity certification path covering threat detection, asset security, and incident response playbook basics.',
    difficulty: 'Beginner',
    duration: '20 hours',
    modulesCount: 10,
    badgeName: 'Cisco CCST Cyber Analyst',
    badgeColor: '#00F2FE',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: CIA Triad & Core Security Principles",
      "Module 2: Network threats, DDoS Vectors, and Spoofing Attacks",
      "Module 3: Authentication and Identity Control Policies",
      "Module 4: Safeguarding Endpoints and Server Infrastructure",
      "Module 5: Basic Firewalls, IPS, and VPN configurations",
      "Module 6: Operating System Auditing and Log monitoring",
      "Module 7: Incident Response frameworks & Threat Classification"
    ]
  },
  {
    id: 'cyberops',
    title: 'Cisco CyberOps Associate',
    category: 'Cybersecurity',
    provider: 'NetAcad',
    description: 'Master security operations, threat classification, log monitoring, and incident response playbook execution. Aligns with Cisco CyberOps exam.',
    difficulty: 'Intermediate',
    duration: '30 hours',
    modulesCount: 28,
    badgeName: 'SOC Analyst Defender',
    badgeColor: '#00F2FE',
    enrollmentStatus: 'in_progress',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Danger Threat actor tactics and malware classifications",
      "Module 2: Windows Operating System Security & Audit Logging",
      "Module 3: Linux OS commands, Processes, and Log Audits",
      "Module 4: Network Protocols, Headers, and PCAP Analysis",
      "Module 5: IP Ethernet Services (ARP, DHCP, DNS routing)",
      "Module 6: Cryptographic Principles (AES, SHA, Public Key)",
      "Module 7: Security Monitoring (Wireshark, Snort, SIEM Logs)",
      "Module 8: Threat Intelligence Feeds and incident categorization"
    ]
  },
  {
    id: 'network-defense',
    title: 'Network Defense',
    category: 'Cybersecurity',
    provider: 'NetAcad',
    description: 'Learn practical methods to protect, detect, and respond to network attacks. Aligns with industrial threat frameworks.',
    difficulty: 'Intermediate',
    duration: '25 hours',
    modulesCount: 11,
    badgeName: 'Network Defense Specialist',
    badgeColor: '#00FF87',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Defense-in-Depth network designs",
      "Module 2: Hardening Switch configurations & VLAN safety",
      "Module 3: Configure Cisco IOS Access Lists (ACLs)",
      "Module 4: Firewall technologies (Stateful vs Packet filters)",
      "Module 5: Configuring NAT and PAT protocols",
      "Module 6: VPN tunnel setups & Cryptographic key exchanges",
      "Module 7: Intrusion Detection and Prevention systems",
      "Module 8: Responding to active security incidents"
    ]
  },

  // --- PROGRAMMING AREA ---
  {
    id: 'python-essentials-1',
    title: 'Python Essentials 1',
    category: 'Programming',
    provider: 'NetAcad',
    description: 'Master variables, loops, conditional execution, lists, and basic function writing in official Cisco Python path.',
    difficulty: 'Beginner',
    duration: '30 hours',
    modulesCount: 4,
    badgeName: 'Cisco Python Specialist I',
    badgeColor: '#FF9F00',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Python environment installation and basics",
      "Chapter 2: Data types, Variables, Operators, and Console I/O",
      "Chapter 3: Control structures: If-Else, Loops (For, While)",
      "Chapter 4: Lists, Array Operations, and Matrix layouts"
    ]
  },
  {
    id: 'python-essentials-2',
    title: 'Python Essentials 2',
    category: 'Programming',
    provider: 'NetAcad',
    description: 'Advanced Python structures, object-oriented programming (OOP), file parsing, exceptions, and packages.',
    difficulty: 'Intermediate',
    duration: '40 hours',
    modulesCount: 4,
    badgeName: 'Cisco Python Specialist II',
    badgeColor: '#B24FFF',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Modules, Packages, and PIP package manager",
      "Chapter 2: Advanced Strings, Tuples, Dictionaries, and Lists",
      "Chapter 3: Object-Oriented Programming (OOP) Classes and Methods",
      "Chapter 4: File processing, Exceptions, and Sys packages"
    ]
  },
  {
    id: 'javascript-essentials-1',
    title: 'JavaScript Essentials 1',
    category: 'Programming',
    provider: 'NetAcad',
    description: 'Learn the fundamentals of web programming, including JavaScript variables, scopes, functions, and standard ES6 operations.',
    difficulty: 'Beginner',
    duration: '35 hours',
    modulesCount: 6,
    badgeName: 'Cisco JavaScript Developer',
    badgeColor: '#00F2FE',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: JavaScript in the Browser & Execution Engines",
      "Module 2: Variables, Scopes, Constants, and Primitive types",
      "Module 3: Arrays, Conditionals, and Loop iterators (For/Of)",
      "Module 4: Functions, Parameter bindings, Closures, and Arrows",
      "Module 5: DOM Document trees, Event handlers, and Forms validation"
    ]
  },

  // --- AUTOMATION AREA ---
  {
    id: 'devnet',
    title: 'Cisco DevNet Associate',
    category: 'Automation',
    provider: 'NetAcad',
    description: 'Learn to use APIs, software deployment pipelines, and NetDevOps automation playbooks using Ansible, Git, and Cisco platforms.',
    difficulty: 'Intermediate',
    duration: '25 hours',
    modulesCount: 8,
    badgeName: 'DevNet Automation Architect',
    badgeColor: '#7F00FF',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Git Version Control and Collaboration workflows",
      "Module 2: REST APIs, HTTP protocols, headers, and status codes",
      "Module 3: JSON, XML, and YAML data structures parsing",
      "Module 4: Cisco platforms (DNA Center, IOS-XE APIs)",
      "Module 5: Docker Containerization and CI/CD pipelines",
      "Module 6: Infrastructure as Code (IaC) and network automation"
    ]
  },
  {
    id: 'network-automation-ansible',
    title: 'Network Automation with Python & Ansible',
    category: 'Automation',
    provider: 'Hybrid',
    description: 'Cisco DevNet basics combined with hands-on playbook testing, router configuration, and YAML scripting.',
    difficulty: 'Advanced',
    duration: '15 hours',
    modulesCount: 6,
    badgeName: 'Network Automator Pro',
    badgeColor: '#FF9F00',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Introduction to Network Programmability",
      "Module 2: Python Paramiko and Netmiko script routines",
      "Module 3: Ansible inventory templates & YAML playbook syntax",
      "Module 4: Automating VLAN and Router Interface configurations",
      "Module 5: Configuring Cisco devices with Jinja2 templates",
      "Module 6: Code verification pipelines for configuration playbooks"
    ]
  },

  // --- IOT & DATA ANALYTICS AREA ---
  {
    id: 'intro-iot',
    title: 'Introduction to IoT and Digital Transformation',
    category: 'IoT & Analytics',
    provider: 'NetAcad',
    description: 'Explore how IoT connects physical devices to secure data pipelines and automates corporate processes.',
    difficulty: 'Beginner',
    duration: '6 hours',
    modulesCount: 3,
    badgeName: 'Cisco IoT Novice',
    badgeColor: '#00FF87',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: What is IoT and Digital Transformation concepts",
      "Module 2: Hardware sensors, controllers (Arduino & Raspberry Pi)",
      "Module 3: Secure networking and automated smart environments"
    ]
  },
  {
    id: 'data-analytics-essentials',
    title: 'Data Analytics Essentials',
    category: 'IoT & Analytics',
    provider: 'NetAcad',
    description: 'Learn to collect, clean, analyze, and visualize corporate dataset metrics using Python and SQL.',
    difficulty: 'Beginner',
    duration: '30 hours',
    modulesCount: 8,
    badgeName: 'Cisco Data Analyst',
    badgeColor: '#FF007F',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Introduction to Data Analysis lifecycle",
      "Module 2: Working with data tables, columns, and CSV formats",
      "Module 3: Cleaning databases, dropping null values, and parsing text",
      "Module 4: Querying tables using standard SQL commands",
      "Module 5: Creating charts, histograms, and data visualizations",
      "Module 6: Reporting insights & formatting business metrics summaries"
    ]
  },

  // --- OPERATING SYSTEMS AREA ---
  {
    id: 'linux-unhatched',
    title: 'NDG Linux Unhatched',
    category: 'Operating Systems',
    provider: 'NetAcad',
    description: 'A quick entry-level intro to the Linux command line. Learn folder commands, basic file access, and absolute paths.',
    difficulty: 'Beginner',
    duration: '8 hours',
    modulesCount: 4,
    badgeName: 'NDG Linux Novice',
    badgeColor: '#7F00FF',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Linux Tux history and shell environment",
      "Chapter 2: Folder navigation commands (ls, cd, pwd)",
      "Chapter 3: Simple file modifications (touch, mkdir, cp, rm)",
      "Chapter 4: Basic diagnostic queries (whoami, date, free)"
    ]
  },
  {
    id: 'linux-essentials',
    title: 'NDG Linux Essentials',
    category: 'Operating Systems',
    provider: 'NetAcad',
    description: 'Deep dive into Linux administration, shell scripting, command line utilities, permissions, and security settings.',
    difficulty: 'Intermediate',
    duration: '70 hours',
    modulesCount: 16,
    badgeName: 'NDG Linux Certified Essentials',
    badgeColor: '#00F2FE',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Selecting a Linux distro & kernel versions",
      "Chapter 2: Bash Shell variables and CLI controls",
      "Chapter 3: Reading help files (man, info, --help)",
      "Chapter 4: Advanced file and folder operations",
      "Chapter 5: Redirects (stdin, stdout, stderr, pipes)",
      "Chapter 6: System administration, users, groups, and permissions",
      "Chapter 7: Writing shell scripts and scheduling cron tasks"
    ]
  },
  {
    id: 'it-essentials',
    title: 'IT Essentials: Hardware & Software',
    category: 'Operating Systems',
    provider: 'NetAcad',
    description: 'Covers physical computer hardware components, system building, operating system diagnostics, and customer support rules.',
    difficulty: 'Beginner',
    duration: '80 hours',
    modulesCount: 14,
    badgeName: 'Cisco IT Specialist',
    badgeColor: '#FF9F00',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Chapter 1: Hardware components (Motherboard, RAM, CPU, Storage)",
      "Chapter 2: System building & ESD anti-static safety",
      "Chapter 3: Diagnostics & troubleshooting hardware boot issues",
      "Chapter 4: OS installations (Windows 11, Linux distributions)",
      "Chapter 5: Configuring smart printer networks and routing modems",
      "Chapter 6: Local device security configurations"
    ]
  },

  // --- ENTERPRISE CORVIT SYSTEMS & CLOUD TRACKS ---
  {
    id: 'ccnp-enterprise',
    title: 'CCNP Enterprise: Core & Advanced Routing (ENCOR & ENARSI)',
    category: 'Networking',
    provider: 'NetAcad',
    description: 'Advanced enterprise routing protocols (BGP, OSPF, EIGRP), Layer 3 switching, MPLS VPNs, SD-WAN, and enterprise network architecture.',
    difficulty: 'Advanced',
    duration: '90 hours',
    modulesCount: 24,
    badgeName: 'CCNP Enterprise Master',
    badgeColor: '#002D62',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Dual-Stack Architecture (IPv4 & IPv6 Core Routing)",
      "Module 2: Advanced Single & Multi-Area OSPFv3 Operations",
      "Module 3: BGP Path Attributes, Peering & Route Filtering",
      "Module 4: Enterprise Layer 3 Redundancy & HSRP / VRRP",
      "Module 5: MPLS L3VPN Architecture & Label Switching",
      "Module 6: Cisco SD-WAN Viptela Architecture & Controllers",
      "Module 7: Infrastructure Security (CoPP, 802.1X, AAA)",
      "Module 8: Python Netmiko & RESTCONF Network Programmability"
    ]
  },
  {
    id: 'rhcsa-linux',
    title: 'Red Hat Certified System Administrator (RHCSA EX200)',
    category: 'Operating Systems',
    provider: 'Hybrid',
    description: 'Enterprise RHEL 9 system administration, LVM volume management, Systemd services, SELinux security policies, and Shell scripting.',
    difficulty: 'Intermediate',
    duration: '80 hours',
    modulesCount: 18,
    badgeName: 'RedHat RHCSA Linux Admin',
    badgeColor: '#CC0000',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: RHEL Installation & Command Line Shell Mastery",
      "Module 2: User & Group Management with Password Policies",
      "Module 3: File Permissions, ACLs, and Sticky Bits",
      "Module 4: Disk Partitioning, File Systems (xfs, ext4), & LVM Volumes",
      "Module 5: Managing Systemd Services, Targets & Bootloader",
      "Module 6: SELinux Security Contexts, Booleans & Port Tagging",
      "Module 7: Firewalld Configuration & SSH Key Authentication",
      "Module 8: Bash Shell Scripting & Automated Cron Jobs"
    ]
  },
  {
    id: 'aws-cloud-architect',
    title: 'AWS Certified Solutions Architect (SAA-C03)',
    category: 'Automation',
    provider: 'Hybrid',
    description: 'Architecting resilient, cost-effective, multi-tier cloud applications on Amazon Web Services (EC2, S3, VPC, RDS, Lambda, IAM).',
    difficulty: 'Intermediate',
    duration: '60 hours',
    modulesCount: 20,
    badgeName: 'AWS Cloud Solutions Architect',
    badgeColor: '#FF9900',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: AWS Global Infrastructure & Cloud Architecture Principles",
      "Module 2: Identity & Access Management (IAM) Policies & Roles",
      "Module 3: Virtual Private Cloud (VPC), Subnets, Route Tables & NAT",
      "Module 4: Elastic Compute Cloud (EC2) Instances & Auto Scaling Groups",
      "Module 5: S3 Storage Classes, Bucket Policies & Glacier Archiving",
      "Module 6: Relational Database Service (RDS), Aurora & DynamoDB",
      "Module 7: Serverless Computing with AWS Lambda & API Gateway",
      "Module 8: AWS CloudWatch Monitoring, CloudTrail Auditing & Security"
    ]
  },
  {
    id: 'devops-engineering',
    title: 'Enterprise DevOps & Cloud Native Track',
    category: 'Automation',
    provider: 'Hybrid',
    description: 'Master Docker containerization, Kubernetes cluster orchestration, Terraform Infrastructure-as-Code, and Jenkins CI/CD automation.',
    difficulty: 'Advanced',
    duration: '90 hours',
    modulesCount: 22,
    badgeName: 'DevOps Cloud Specialist',
    badgeColor: '#00F2FE',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Git Distributed Version Control & Feature Branch Workflows",
      "Module 2: Dockerfile Creation, Image Optimization & Container Networking",
      "Module 3: Kubernetes Architecture, Pods, Deployments & Services",
      "Module 4: Ingress Controllers, Helm Charts & Storage Volumes",
      "Module 5: Terraform Declarative Infrastructure Provisioning",
      "Module 6: Ansible Playbook Automation for Multi-Server Deployment",
      "Module 7: Jenkins & GitHub Actions CI/CD Pipeline Automation",
      "Module 8: Prometheus & Grafana Monitoring & Log Aggregation"
    ]
  },
  {
    id: 'fortinet-nse4',
    title: 'Fortinet FortiGate Firewall Administrator (NSE 4)',
    category: 'Cybersecurity',
    provider: 'Hybrid',
    description: 'Configure FortiGate Next-Generation Firewalls, Security Profiles, SSL-VPN Tunnels, Intrusion Prevention (IPS), and HA High Availability.',
    difficulty: 'Intermediate',
    duration: '45 hours',
    modulesCount: 16,
    badgeName: 'Fortinet FortiGate Admin',
    badgeColor: '#CC0000',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: FortiGate Architecture, Deployment Modes & System Settings",
      "Module 2: Firewall Security Policies, NAT & Port Forwarding",
      "Module 3: Authentication, LDAP Integration & Captive Portals",
      "Module 4: FortiGuard Antivirus, Web Filtering & Application Control",
      "Module 5: Intrusion Prevention System (IPS) & SSL Inspection",
      "Module 6: IPsec & SSL-VPN Remote Access Tunnel Setup",
      "Module 7: FortiGate High Availability (HA) Clustering & VRRP",
      "Module 8: FortiAnalyzer Log Analysis & Threat Reporting"
    ]
  },
  {
    id: 'ceh-ethical-hacking',
    title: 'Certified Ethical Hacker (CEH v12)',
    category: 'Cybersecurity',
    provider: 'Hybrid',
    description: 'Offensive security, network scanning, vulnerability analysis, web application exploitation, Metasploit, and wireless network hacking.',
    difficulty: 'Advanced',
    duration: '75 hours',
    modulesCount: 20,
    badgeName: 'CEH Ethical Hacking Master',
    badgeColor: '#7F00FF',
    enrollmentStatus: 'not_enrolled',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    syllabusOutline: [
      "Module 1: Footprinting, OSINT Reconnaissance & Social Engineering",
      "Module 2: Nmap Network Scanning, Port Audits & OS Fingerprinting",
      "Module 3: Vulnerability Assessment with Nessus & OpenVAS",
      "Module 4: System Hacking, Privilege Escalation & Password Cracking",
      "Module 5: Malware Threats, Trojans, Backdoors & Ransomware",
      "Module 6: Web Application Vulnerabilities (SQLi, XSS, CSRF)",
      "Module 7: Metasploit Framework Exploitation & Payload Delivery",
      "Module 8: Wireless Network Hacking (WPA2/WPA3 Cracking)"
    ]
  }
];

const INITIAL_PATHWAYS: Pathway[] = [
  {
    id: 'cisco-enterprise-path',
    title: 'Cisco Enterprise Network Architect Track',
    career: 'Senior Network Architect',
    salary: '$110,000',
    certifications: 'Cisco CCNA (200-301) & CCNP Enterprise (350-401 ENCOR)',
    courseIds: ['ccna-itn', 'ccna-srwe', 'ccna-ensa', 'ccnp-enterprise'],
    color: '#002D62',
    description: 'From network fundamentals to enterprise BGP routing, Cisco 4331 hardware racks, MPLS VPNs, and SD-WAN architecture.',
    longDesc: 'The ultimate networking career pathway. Master physical router racks at Multan campus and progress from associate routing to enterprise-class BGP/OSPF topologies and network automation.',
  },
  {
    id: 'cybersec-ops',
    title: 'Cybersecurity & Ethical Hacking Track',
    career: 'SOC Cyber Analyst & Ethical Hacker',
    salary: '$95,000',
    certifications: 'Cisco CyberOps Associate, Fortinet NSE4 & CEH v12',
    courseIds: ['intro-cyber', 'cyberops', 'fortinet-nse4', 'ceh-ethical-hacking'],
    color: '#CC0000',
    description: 'Complete defensive and offensive cybersecurity path covering SIEM logs, Wireshark, FortiGate Firewalls, and Metasploit ethical hacking.',
    longDesc: 'Designed to turn students into certified Security Operations Analysts and Penetration Testers capable of safeguarding enterprise infrastructures.',
  },
  {
    id: 'devops-cloud-path',
    title: 'Cloud & DevOps Engineering Track',
    career: 'Cloud & DevOps Engineer',
    salary: '$115,000',
    certifications: 'RHCSA RHEL Linux, AWS Solutions Architect & DevOps Track',
    courseIds: ['linux-essentials', 'rhcsa-linux', 'aws-cloud-architect', 'devops-engineering'],
    color: '#007A87',
    description: 'Enterprise Red Hat Linux administration combined with AWS Cloud architecture, Docker containers, and Kubernetes CI/CD automation.',
    longDesc: 'Build in-demand cloud skills. Learn RHEL system administration, provision AWS cloud infrastructure with Terraform, and orchestrate microservices with Kubernetes.',
  },
  {
    id: 'netdevops-auto',
    title: 'Python & Network Automation Track',
    career: 'NetDevOps Automation Architect',
    salary: '$105,000',
    certifications: 'Cisco Certified DevNet Associate & PCAP Python Specialist',
    courseIds: ['python-essentials-1', 'python-essentials-2', 'devnet', 'network-automation-ansible'],
    color: '#6D28D9',
    description: 'Automate network infrastructure using Python, Ansible, and Terraform, and deploy machine learning models inside secure pipelines.',
    longDesc: 'Learn the principles of Infrastructure as Code (IaC). You will build playbooks to configure routers, deploy automated API requests, and scale networks safely.',
  }
];

const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-cyber-starter',
    name: 'NetAcad Cyber Starter',
    description: 'Successfully completed the Introduction to Cybersecurity course on Cisco NetAcad.',
    category: 'Cybersecurity',
    icon: 'shield.fill',
    color: '#00A854',
    earnedDate: '2026-07-10',
    hash: '0x8f2a9d1c7b5e4f3a2c1b0a9f8e7d6c5b4a3a2b1c',
  },
];

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Mercer',
  rank: 'AI Guardian',
  xp: 1450,
  studyHours: 42,
  certificatesCount: 1,
};

// Global Store with LocalStorage Persistence & Live API Logging
class AcademyStore {
  private courses: Course[] = [];
  private badges: Badge[] = [];
  private profile: UserProfile = INITIAL_PROFILE;
  private pathways: Pathway[] = [];
  private chatLogs: { sender: 'user' | 'mentor'; text: string; time: string }[] = [
    { sender: 'mentor', text: 'Hello Alex! I am your CyberAI Mentor. How can I help you master your cybersecurity or automation studies today?', time: '20:52' },
  ];
  
  // simulated API logging
  public apiLogs: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; endpoint: string; status: number; timestamp: string }[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      this.courses = localStorage.getItem('netacad_courses') 
        ? JSON.parse(localStorage.getItem('netacad_courses')!) 
        : INITIAL_COURSES;

      this.badges = localStorage.getItem('netacad_badges') 
        ? JSON.parse(localStorage.getItem('netacad_badges')!) 
        : INITIAL_BADGES;

      this.profile = localStorage.getItem('netacad_profile') 
        ? JSON.parse(localStorage.getItem('netacad_profile')!) 
        : INITIAL_PROFILE;

      this.pathways = localStorage.getItem('netacad_pathways') 
        ? JSON.parse(localStorage.getItem('netacad_pathways')!) 
        : INITIAL_PATHWAYS;
        
      this.logApiRequest('GET', '/api/v1/init', 200);
    } catch (e) {
      this.courses = INITIAL_COURSES;
      this.badges = INITIAL_BADGES;
      this.profile = INITIAL_PROFILE;
      this.pathways = INITIAL_PATHWAYS;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('netacad_courses', JSON.stringify(this.courses));
      localStorage.setItem('netacad_badges', JSON.stringify(this.badges));
      localStorage.setItem('netacad_profile', JSON.stringify(this.profile));
      localStorage.setItem('netacad_pathways', JSON.stringify(this.pathways));
    } catch (e) {
      console.error("Storage save failed:", e);
    }
  }

  private logApiRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, status: number) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.apiLogs = [{ method, endpoint, status, timestamp }, ...this.apiLogs].slice(0, 50); // limit to 50 logs
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- GETTERS ---
  getCourses() {
    this.logApiRequest('GET', '/api/v1/courses', 200);
    return this.courses;
  }

  getBadges() {
    this.logApiRequest('GET', '/api/v1/badges', 200);
    return this.badges;
  }

  getProfile() {
    this.logApiRequest('GET', '/api/v1/profile', 200);
    return this.profile;
  }

  getPathways() {
    this.logApiRequest('GET', '/api/v1/pathways', 200);
    return this.pathways;
  }

  getChatLogs() {
    return this.chatLogs;
  }

  // --- MUTATORS & ADMIN PANEL ACTIONS ---
  addCourse(newCourse: Course) {
    this.courses = [newCourse, ...this.courses];
    this.saveToStorage();
    this.logApiRequest('POST', `/api/v1/courses/${newCourse.id}`, 201);
    this.notify();
  }

  editCourse(courseId: string, updatedFields: Partial<Course>) {
    this.courses = this.courses.map(c => c.id === courseId ? { ...c, ...updatedFields } : c);
    this.saveToStorage();
    this.logApiRequest('PUT', `/api/v1/courses/${courseId}`, 200);
    this.notify();
  }

  deleteCourse(courseId: string) {
    this.courses = this.courses.filter(c => c.id !== courseId);
    this.saveToStorage();
    this.logApiRequest('DELETE', `/api/v1/courses/${courseId}`, 200);
    this.notify();
  }

  addPathway(newPathway: Pathway) {
    this.pathways = [...this.pathways, newPathway];
    this.saveToStorage();
    this.logApiRequest('POST', `/api/v1/pathways/${newPathway.id}`, 201);
    this.notify();
  }

  deletePathway(pathwayId: string) {
    this.pathways = this.pathways.filter(p => p.id !== pathwayId);
    this.saveToStorage();
    this.logApiRequest('DELETE', `/api/v1/pathways/${pathwayId}`, 200);
    this.notify();
  }

  updateProfile(updatedFields: Partial<UserProfile>) {
    this.profile = { ...this.profile, ...updatedFields };
    this.saveToStorage();
    this.logApiRequest('PUT', '/api/v1/profile', 200);
    this.notify();
  }

  setTargetPathway(pathwayName: string) {
    this.profile.targetPathway = pathwayName;
    this.saveToStorage();
    this.logApiRequest('PUT', '/api/v1/profile/target-pathway', 200);
    this.notify();
  }

  enrollInPathway(pathwayName: string, courseIds: string[]) {
    this.profile.targetPathway = pathwayName;
    this.courses = this.courses.map((c) => {
      if (courseIds.includes(c.id) && c.enrollmentStatus === 'not_enrolled') {
        return { ...c, enrollmentStatus: 'in_progress' };
      }
      return c;
    });
    this.saveToStorage();
    this.logApiRequest('POST', `/api/v1/pathways/enroll`, 200);
    this.notify();
  }

  enrollInCourse(courseId: string) {
    this.courses = this.courses.map((c) => {
      if (c.id === courseId && c.enrollmentStatus === 'not_enrolled') {
        return { ...c, enrollmentStatus: 'in_progress' };
      }
      return c;
    });
    this.saveToStorage();
    this.logApiRequest('POST', `/api/v1/courses/${courseId}/enroll`, 200);
    this.notify();
  }

  updateProgress(courseId: string, delta: number) {
    this.courses = this.courses.map((c) => {
      if (c.id === courseId) {
        const nextProgress = Math.min(c.progress + delta, 100);
        let nextStatus = c.enrollmentStatus;
        if (nextProgress >= 100) {
          nextStatus = 'completed';
          // Award badge if not already earned
          if (c.badgeName && !this.badges.some((b) => b.name === c.badgeName)) {
            const newBadge: Badge = {
              id: `badge-${c.id}`,
              name: c.badgeName,
              description: `Successfully completed the ${c.title} course.`,
              category: c.category,
              icon: c.category === 'Cybersecurity' ? 'shield.fill' : c.category === 'Networking' ? 'network' : 'gearshape.fill',
              color: c.badgeColor || '#00F2FE',
              earnedDate: new Date().toISOString().split('T')[0],
              hash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            };
            this.badges = [...this.badges, newBadge];
            this.profile.certificatesCount += 1;
            this.profile.xp += 500;
            this.logApiRequest('POST', `/api/v1/badges/award/${c.id}`, 201);
          }
        }
        return { ...c, progress: nextProgress, enrollmentStatus: nextStatus };
      }
      return c;
    });
    this.profile.xp += delta * 5;
    this.profile.studyHours += Math.round(delta * 0.1);
    this.saveToStorage();
    this.logApiRequest('PUT', `/api/v1/courses/${courseId}/progress`, 200);
    this.notify();
  }

  async sendChatMessage(text: string) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.chatLogs = [...this.chatLogs, { sender: 'user', text, time }];
    this.notify();

    try {
      this.logApiRequest('POST', '/api/v1/mentor/chat', 200);
      const responseText = await aiService.getMentorResponse(text, this.chatLogs.slice(0, -1));
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.chatLogs = [...this.chatLogs, { sender: 'mentor', text: responseText, time: replyTime }];
      this.notify();
    } catch (err) {
      console.error("Chat error:", err);
    }
  }

  resetDatabase() {
    this.courses = INITIAL_COURSES;
    this.badges = INITIAL_BADGES;
    this.profile = INITIAL_PROFILE;
    this.pathways = INITIAL_PATHWAYS;
    this.saveToStorage();
    this.logApiRequest('POST', '/api/v1/db/reset', 200);
    this.notify();
  }
}

export const academyStore = new AcademyStore();

export function useAcademyStore() {
  const [courses, setCourses] = useState<Course[]>(academyStore.getCourses());
  const [badges, setBadges] = useState<Badge[]>(academyStore.getBadges());
  const [profile, setProfile] = useState<UserProfile>(academyStore.getProfile());
  const [pathways, setPathways] = useState<Pathway[]>(academyStore.getPathways());
  const [chatLogs, setChatLogs] = useState(academyStore.getChatLogs());
  const [apiLogs, setApiLogs] = useState(academyStore.apiLogs);

  useEffect(() => {
    const unsubscribe = academyStore.subscribe(() => {
      setCourses(academyStore.getCourses());
      setBadges(academyStore.getBadges());
      setProfile(academyStore.getProfile());
      setPathways(academyStore.getPathways());
      setChatLogs(academyStore.getChatLogs());
      setApiLogs([...academyStore.apiLogs]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    courses,
    badges,
    profile,
    pathways,
    chatLogs,
    apiLogs,
    enrollInCourse: (id: string) => academyStore.enrollInCourse(id),
    enrollInPathway: (name: string, ids: string[]) => academyStore.enrollInPathway(name, ids),
    updateProgress: (id: string, delta: number) => academyStore.updateProgress(id, delta),
    sendChatMessage: (text: string) => academyStore.sendChatMessage(text),
    setTargetPathway: (name: string) => academyStore.setTargetPathway(name),
    
    // Admin functions
    addCourse: (course: Course) => academyStore.addCourse(course),
    editCourse: (id: string, fields: Partial<Course>) => academyStore.editCourse(id, fields),
    deleteCourse: (id: string) => academyStore.deleteCourse(id),
    addPathway: (pathway: Pathway) => academyStore.addPathway(pathway),
    deletePathway: (id: string) => academyStore.deletePathway(id),
    updateProfile: (fields: Partial<UserProfile>) => academyStore.updateProfile(fields),
    resetDatabase: () => academyStore.resetDatabase(),
  };
}

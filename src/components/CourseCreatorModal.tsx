import React, { useState, useEffect, useRef } from 'react';
import { Course, useAcademyStore } from '@/services/academyState';
import { aiService } from '@/services/aiService';
import { 
  Wand2, Sparkles, BookOpen, Layers, Image as ImageIcon, CheckCircle, 
  Upload, X, Check, Award, Clock, ShieldCheck, Plus, Trash2, Copy, 
  Eye, RefreshCw, Globe, Server, Shield, Cloud, Terminal, Code, Cpu, 
  DollarSign, Star, AlertCircle, ArrowRight
} from 'lucide-react';

// Preset NetAcad Official Thumbnails
export const NETACAD_THUMBNAIL_PRESETS = [
  { label: 'CCNA: Intro to Networks (ITN)', path: '/netacad-thumbnails/ccna-itn.png', category: 'Networking' },
  { label: 'CCNA: Switching & Routing (SRWE)', path: '/netacad-thumbnails/ccna-srwe.png', category: 'Networking' },
  { label: 'CCNA: Enterprise Automation (ENSA)', path: '/netacad-thumbnails/ccna-ensa.png', category: 'Networking' },
  { label: 'Networking Essentials', path: '/netacad-thumbnails/networking-essentials.png', category: 'Networking' },
  { label: 'CCST Networking', path: '/netacad-thumbnails/ccst-networking.png', category: 'Networking' },
  { label: 'CCNP Enterprise ENCOR', path: '/netacad-thumbnails/ccnp-enterprise.png', category: 'Networking' },
  { label: 'CCNP Advanced Routing ENARSI', path: '/netacad-thumbnails/ccnp-advanced-routing.png', category: 'Networking' },
  { label: 'Introduction to Cybersecurity', path: '/netacad-thumbnails/intro-cyber.png', category: 'Cybersecurity' },
  { label: 'Cybersecurity Essentials', path: '/netacad-thumbnails/cybersecurity-essentials.png', category: 'Cybersecurity' },
  { label: 'CCST Cybersecurity / Endpoint', path: '/netacad-thumbnails/endpoint-security.png', category: 'Cybersecurity' },
  { label: 'Cisco CyberOps Associate', path: '/netacad-thumbnails/cyberops.png', category: 'Cybersecurity' },
  { label: 'Network Defense', path: '/netacad-thumbnails/network-defense.png', category: 'Cybersecurity' },
  { label: 'Network Security', path: '/netacad-thumbnails/network-security.png', category: 'Cybersecurity' },
  { label: 'Ethical Hacker (CEH v12)', path: '/netacad-thumbnails/ethical-hacker.png', category: 'Cybersecurity' },
  { label: 'Fortinet FortiGate (NSE 4)', path: '/netacad-thumbnails/cyber-threat-management.png', category: 'Cybersecurity' },
  { label: 'Industrial Cybersecurity', path: '/netacad-thumbnails/industrial-cybersecurity.png', category: 'Cybersecurity' },
  { label: 'Security Operations & SOC', path: '/netacad-thumbnails/security-operations.png', category: 'Cybersecurity' },
  { label: 'Introduction to Splunk', path: '/netacad-thumbnails/splunk-intro.png', category: 'Cybersecurity' },
  { label: 'Python Essentials 1', path: '/netacad-thumbnails/python-essentials-1.jpg', category: 'Programming' },
  { label: 'Python Essentials 2', path: '/netacad-thumbnails/python-essentials-2.jpg', category: 'Programming' },
  { label: 'JavaScript Essentials 1', path: '/netacad-thumbnails/javascript-essentials.jpg', category: 'Programming' },
  { label: 'Cisco DevNet Associate', path: '/netacad-thumbnails/devnet.png', category: 'Automation' },
  { label: 'Network Automation with Ansible', path: '/netacad-thumbnails/network-automation.png', category: 'Automation' },
  { label: 'AWS Solutions Architect (SAA-C03)', path: '/netacad-thumbnails/aws-cloud.png', category: 'Automation' },
  { label: 'Enterprise DevOps Track', path: '/netacad-thumbnails/cloud-devops.jpg', category: 'Automation' },
  { label: 'Introduction to IoT', path: '/netacad-thumbnails/intro-iot.png', category: 'IoT & Analytics' },
  { label: 'Data Analytics Essentials', path: '/netacad-thumbnails/data-analytics.png', category: 'IoT & Analytics' },
  { label: 'NDG Linux Essentials', path: '/netacad-thumbnails/linux-essentials.jpg', category: 'Operating Systems' },
  { label: 'IT Essentials Hardware/Software', path: '/netacad-thumbnails/it-essentials.jpg', category: 'Operating Systems' },
  { label: 'RedHat RHCSA Linux Admin', path: '/netacad-thumbnails/rhcsa-linux.png', category: 'Operating Systems' },
  { label: 'Cyber Smart AI Security', path: '/cybersmart-course/assets/img/hero.webp', category: 'Cybersecurity' },
];

// Quick Blueprints / Course Templates
const COURSE_BLUEPRINTS = [
  {
    title: 'Cisco Certified Network Associate (CCNA 200-301)',
    category: 'Networking' as Course['category'],
    provider: 'NetAcad' as Course['provider'],
    difficulty: 'Intermediate' as Course['difficulty'],
    duration: '60 hours',
    imageUrl: '/netacad-thumbnails/ccna-itn.png',
    deliveryMode: 'Online & On-Campus' as Course['deliveryMode'],
    badgeName: 'Cisco CCNA Associate',
    tuitionFee: 'PKR 45,000',
    description: 'Master networking fundamentals, IP services, security fundamentals, automation, and programmable network devices aligned with Cisco 200-301 CCNA certification.',
    syllabus: [
      'Chapter 1: Network Fundamentals, Architecture & Topologies',
      'Chapter 2: Network Access, VLANs & Trunking (802.1Q)',
      'Chapter 3: IP Connectivity, Static Routing & OSPFv2 Routing',
      'Chapter 4: IP Services: DHCP, DNS, SNMP & Syslog',
      'Chapter 5: Security Fundamentals: Access Control Lists (ACLs) & Port Security',
      'Chapter 6: Network Automation & Programmability (REST APIs & JSON)',
      'Chapter 7: Comprehensive Cisco Packet Tracer & Physical Lab Practical'
    ]
  },
  {
    title: 'Cisco CyberOps Associate & SOC Analyst',
    category: 'Cybersecurity' as Course['category'],
    provider: 'NetAcad' as Course['provider'],
    difficulty: 'Intermediate' as Course['difficulty'],
    duration: '40 hours',
    imageUrl: '/netacad-thumbnails/cyberops.png',
    deliveryMode: 'Online & On-Campus' as Course['deliveryMode'],
    badgeName: 'Cisco Certified CyberOps Associate',
    tuitionFee: 'PKR 45,000',
    description: 'Learn how Security Operations Center (SOC) teams detect and respond to cybersecurity threats, analyze network telemetry, and apply the MITRE ATT&CK framework.',
    syllabus: [
      'Chapter 1: Security Operations & SOC Principles',
      'Chapter 2: Network Infrastructure & Telemetry Analysis',
      'Chapter 3: Endpoint Security & Windows/Linux Forensics',
      'Chapter 4: Attack Methods & MITRE ATT&CK Mapping',
      'Chapter 5: Incident Investigation & Security Event Monitoring (SIEM)',
      'Chapter 6: Hands-On Multan Campus SOC Incident Response Lab'
    ]
  },
  {
    title: 'Certified Ethical Hacker (CEH v12)',
    category: 'Cybersecurity' as Course['category'],
    provider: 'Hybrid' as Course['provider'],
    difficulty: 'Advanced' as Course['difficulty'],
    duration: '50 hours',
    imageUrl: '/netacad-thumbnails/ethical-hacker.png',
    deliveryMode: 'Online & On-Campus' as Course['deliveryMode'],
    badgeName: 'Certified Ethical Hacker Specialist',
    tuitionFee: 'PKR 55,000',
    description: 'Master offensive security, penetration testing methodologies, vulnerability analysis, and ethical hacking tactics used by top corporate red teams.',
    syllabus: [
      'Chapter 1: Information Gathering & Reconnaissance (OSINT)',
      'Chapter 2: Port Scanning, Enumeration & Vulnerability Assessment',
      'Chapter 3: System Hacking & Password Cracking Techniques',
      'Chapter 4: Web Application Attacks: SQLi, XSS, CSRF & SSRF',
      'Chapter 5: Wireless Network & Active Directory Exploitation',
      'Chapter 6: Final Red Team vs. Blue Team Enterprise Penetration Lab'
    ]
  },
  {
    title: 'AWS Certified Solutions Architect (SAA-C03)',
    category: 'Automation' as Course['category'],
    provider: 'CyberAI' as Course['provider'],
    difficulty: 'Intermediate' as Course['difficulty'],
    duration: '45 hours',
    imageUrl: '/netacad-thumbnails/aws-cloud.png',
    deliveryMode: 'Online & On-Campus' as Course['deliveryMode'],
    badgeName: 'AWS Certified Solutions Architect',
    tuitionFee: 'PKR 48,000',
    description: 'Architect secure, resilient, high-performing, and cost-optimized cloud architectures on Amazon Web Services utilizing VPCs, EC2, S3, IAM, and Lambda.',
    syllabus: [
      'Chapter 1: Cloud Principles & Global AWS Infrastructure',
      'Chapter 2: Virtual Private Clouds (VPCs), Subnetting & Security Groups',
      'Chapter 3: High Availability: Elastic Load Balancers & Auto Scaling',
      'Chapter 4: Storage Solutions: S3, EBS, EFS & DynamoDB',
      'Chapter 5: Serverless Architecture with AWS Lambda & API Gateway',
      'Chapter 6: Hands-on Cloud Deployment & Well-Architected Review'
    ]
  },
  {
    title: 'Python Network Automation with Ansible & Netmiko',
    category: 'Programming' as Course['category'],
    provider: 'NetAcad' as Course['provider'],
    difficulty: 'Intermediate' as Course['difficulty'],
    duration: '35 hours',
    imageUrl: '/netacad-thumbnails/python-essentials-1.jpg',
    deliveryMode: 'Online & On-Campus' as Course['deliveryMode'],
    badgeName: 'NetDevOps Automation Engineer',
    tuitionFee: 'PKR 40,000',
    description: 'Automate multi-vendor network operations using Python, Netmiko, NAPALM, Jinja2 templating, and Ansible playbooks to eliminate manual CLI configurations.',
    syllabus: [
      'Chapter 1: Python Data Structures, Functions & File I/O for Engineers',
      'Chapter 2: Connecting to Routers via Netmiko SSH & Paramiko',
      'Chapter 3: Automated Configuration Backups & Parsing with TextFSM',
      'Chapter 4: Declarative Infrastructure with Ansible Playbooks',
      'Chapter 5: RESTCONF, NETCONF & YANG Data Modeling on Cisco Devices',
      'Chapter 6: Final Capstone: Autonomous Network Provisioning Pipeline'
    ]
  },
  {
    title: 'AI-Powered Threat Hunting & Autonomous SIEM',
    category: 'Cybersecurity' as Course['category'],
    provider: 'CyberAI' as Course['provider'],
    difficulty: 'Advanced' as Course['difficulty'],
    duration: '40 hours',
    imageUrl: '/netacad-thumbnails/security-operations.png',
    deliveryMode: 'Online & On-Campus' as Course['deliveryMode'],
    badgeName: 'AI Cybersecurity Architect',
    tuitionFee: 'PKR 60,000',
    description: 'Harness Large Language Models, agentic workflows, and machine learning anomaly detection to supercharge cyber threat detection and autonomous incident response.',
    syllabus: [
      'Chapter 1: Machine Learning Foundations for Cybersecurity Telemetry',
      'Chapter 2: Securing AI Models: OWASP Top 10 for LLMs & Prompt Injection',
      'Chapter 3: Automated Anomaly Detection on PCAP & Auth Logs with Scikit-Learn',
      'Chapter 4: Autonomous SIEM Integration with Splunk & Elastic Agent',
      'Chapter 5: Deploying LLM Copilots for Real-Time Threat Remediation',
      'Chapter 6: Live Hardware Lab: Neutralizing AI-Generated Malware Beacons'
    ]
  }
];

interface CourseCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course | null;
  onSaved?: (course: Course) => void;
}

export default function CourseCreatorModal({ isOpen, onClose, courseToEdit, onSaved }: CourseCreatorModalProps) {
  const { addCourse, editCourse } = useAcademyStore();

  // Mode Selection: 'builder' | 'ai' | 'blueprints'
  const [creationMode, setCreationMode] = useState<'builder' | 'ai' | 'blueprints'>('builder');
  const [activeBuilderTab, setActiveBuilderTab] = useState<'basics' | 'media' | 'syllabus' | 'badging'>('basics');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Course['category']>('Networking');
  const [provider, setProvider] = useState<Course['provider']>('NetAcad');
  const [difficulty, setDifficulty] = useState<Course['difficulty']>('Beginner');
  const [duration, setDuration] = useState('24 hours');
  const [deliveryMode, setDeliveryMode] = useState<Course['deliveryMode']>('Online & On-Campus');
  const [tuitionFee, setTuitionFee] = useState('Free');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [description, setDescription] = useState('');
  const [badgeName, setBadgeName] = useState('');
  const [badgeColor, setBadgeColor] = useState('#00F2FE');
  const [imageUrl, setImageUrl] = useState('/netacad-thumbnails/ccna-itn.png');
  const [syllabusOutline, setSyllabusOutline] = useState<string[]>([
    'Chapter 1: Core Fundamentals & Industry Standards',
    'Chapter 2: Architecture, Protocols & Media',
    'Chapter 3: Configuration, Routing & Security Settings',
    'Chapter 4: Hands-On Multan Campus Physical Lab Exam'
  ]);
  const [syllabusRawInput, setSyllabusRawInput] = useState('');
  const [isRawSyllabusMode, setIsRawSyllabusMode] = useState(false);

  // AI Generator Form State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Gallery Picker State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification / Feedback State
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Populate when courseToEdit changes
  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title);
      setCategory(courseToEdit.category);
      setProvider(courseToEdit.provider);
      setDifficulty(courseToEdit.difficulty);
      setDuration(courseToEdit.duration);
      setDeliveryMode(courseToEdit.deliveryMode || 'Online & On-Campus');
      setTuitionFee(courseToEdit.tuitionFee || 'Free');
      setIsFeatured(!!courseToEdit.isFeatured);
      setStatus(courseToEdit.status || 'published');
      setDescription(courseToEdit.description);
      setBadgeName(courseToEdit.badgeName || '');
      setBadgeColor(courseToEdit.badgeColor || '#00F2FE');
      setImageUrl(courseToEdit.imageUrl || '/netacad-thumbnails/ccna-itn.png');
      const outline = courseToEdit.syllabusOutline && courseToEdit.syllabusOutline.length > 0 
        ? courseToEdit.syllabusOutline 
        : ['Chapter 1: Introduction', 'Chapter 2: Core Concepts', 'Chapter 3: Final Lab'];
      setSyllabusOutline(outline);
      setSyllabusRawInput(outline.join('\n'));
      setCreationMode('builder');
    } else {
      resetForm();
    }
  }, [courseToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setCategory('Networking');
    setProvider('NetAcad');
    setDifficulty('Beginner');
    setDuration('20 hours');
    setDeliveryMode('Online & On-Campus');
    setTuitionFee('Free');
    setIsFeatured(false);
    setStatus('published');
    setDescription('');
    setBadgeName('');
    setBadgeColor('#00F2FE');
    setImageUrl('/netacad-thumbnails/ccna-itn.png');
    const defaultOutline = [
      'Chapter 1: Core Fundamentals & Industry Standards',
      'Chapter 2: Architecture, Protocols & Media',
      'Chapter 3: Configuration, Routing & Security Settings',
      'Chapter 4: Hands-On Multan Campus Physical Lab Exam'
    ];
    setSyllabusOutline(defaultOutline);
    setSyllabusRawInput(defaultOutline.join('\n'));
    setAiPrompt('');
  };

  if (!isOpen) return null;

  // Apply Blueprint Preset
  const handleApplyBlueprint = (bp: typeof COURSE_BLUEPRINTS[0]) => {
    setTitle(bp.title);
    setCategory(bp.category);
    setProvider(bp.provider);
    setDifficulty(bp.difficulty);
    setDuration(bp.duration);
    setImageUrl(bp.imageUrl);
    setDeliveryMode(bp.deliveryMode);
    setBadgeName(bp.badgeName);
    setTuitionFee(bp.tuitionFee);
    setDescription(bp.description);
    setSyllabusOutline(bp.syllabus);
    setSyllabusRawInput(bp.syllabus.join('\n'));
    setCreationMode('builder');
    showToast(`Applied blueprint: "${bp.title}"! Review & publish.`);
  };

  // Generate with AI
  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a course topic or concept.");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const generated = await aiService.generateCourseCurriculum(
        aiPrompt.trim(),
        category,
        difficulty,
        duration
      );

      setTitle(generated.title);
      setCategory(generated.category);
      setProvider(generated.provider);
      setDifficulty(generated.difficulty);
      setDuration(generated.duration);
      setDescription(generated.description);
      setBadgeName(generated.badgeName);
      setImageUrl(generated.imageUrl);
      setDeliveryMode(generated.deliveryMode);
      setSyllabusOutline(generated.syllabusOutline);
      setSyllabusRawInput(generated.syllabusOutline.join('\n'));

      setIsGeneratingAi(false);
      setCreationMode('builder');
      showToast(`🤖 AI generated course curriculum for "${generated.title}"!`);
    } catch (err: any) {
      setIsGeneratingAi(false);
      alert("AI generation failed: " + (err.message || String(err)));
    }
  };

  // Add Chapter to Syllabus
  const handleAddChapter = () => {
    const nextChapterNum = syllabusOutline.length + 1;
    const updated = [...syllabusOutline, `Chapter ${nextChapterNum}: Advanced Hands-On Lab & Practical Verification`];
    setSyllabusOutline(updated);
    setSyllabusRawInput(updated.join('\n'));
  };

  // Remove Chapter
  const handleRemoveChapter = (index: number) => {
    if (syllabusOutline.length <= 1) {
      alert("A course must have at least 1 chapter.");
      return;
    }
    const updated = syllabusOutline.filter((_, idx) => idx !== index);
    setSyllabusOutline(updated);
    setSyllabusRawInput(updated.join('\n'));
  };

  // Update specific chapter
  const handleChapterTextChange = (index: number, text: string) => {
    const updated = [...syllabusOutline];
    updated[index] = text;
    setSyllabusOutline(updated);
    setSyllabusRawInput(updated.join('\n'));
  };

  // Sync raw input to array
  const handleRawSyllabusBlur = () => {
    const parsed = syllabusRawInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (parsed.length > 0) {
      setSyllabusOutline(parsed);
    }
  };

  // Handle custom image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size exceeds 2MB limit. Please upload a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          showToast("Custom thumbnail uploaded!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save / Submit Course
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in Course Title and Description.");
      return;
    }

    const finalSyllabus = isRawSyllabusMode 
      ? syllabusRawInput.split('\n').map(s => s.trim()).filter(s => s.length > 0)
      : syllabusOutline;

    if (finalSyllabus.length === 0) {
      alert("Please specify at least 1 chapter in the syllabus.");
      return;
    }

    if (courseToEdit) {
      const updatedFields: Partial<Course> = {
        title: title.trim(),
        category,
        provider,
        difficulty,
        duration: duration.trim(),
        deliveryMode,
        tuitionFee: tuitionFee.trim() || 'Free',
        isFeatured,
        status,
        description: description.trim(),
        badgeName: badgeName.trim() || undefined,
        badgeColor,
        imageUrl: imageUrl.trim() || '/netacad-thumbnails/ccna-itn.png',
        syllabusOutline: finalSyllabus,
        modulesCount: finalSyllabus.length
      };
      editCourse(courseToEdit.id, updatedFields);
      showToast(`✅ Course "${title.trim()}" updated successfully!`);
      if (onSaved) onSaved({ ...courseToEdit, ...updatedFields } as Course);
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: title.trim(),
        category,
        provider,
        difficulty,
        duration: duration.trim() || '20 hours',
        deliveryMode,
        tuitionFee: tuitionFee.trim() || 'Free',
        isFeatured,
        status,
        description: description.trim(),
        badgeName: badgeName.trim() || `${title.trim()} Specialist`,
        badgeColor,
        enrollmentStatus: 'not_enrolled',
        progress: 0,
        imageUrl: imageUrl.trim() || '/netacad-thumbnails/ccna-itn.png',
        syllabusOutline: finalSyllabus,
        modulesCount: finalSyllabus.length
      };
      addCourse(newCourse);
      showToast(`🎉 New course "${title.trim()}" published to catalog!`);
      if (onSaved) onSaved(newCourse);
    }

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden relative animate-slide-up text-left">
        
        {/* 1. MODAL TOP HEADER */}
        <div className="bg-gradient-to-r from-[#002D62] via-[#003D5C] to-[#007A87] text-white p-5 sm:p-6 flex items-center justify-between gap-4 shrink-0 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 text-cyan-300 border border-white/20">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
                {courseToEdit ? '✏️ Edit Course Program' : '🚀 Course Studio & Curriculum Architect'}
              </h2>
            </div>
            <p className="text-xs text-slate-200/90">
              Create, customize, and publish new accredited programs with instant Cisco NetAcad thumbnail matching.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-4 py-2 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* 2. CREATION METHOD TOGGLE PILLS (ONLY IF CREATING NEW) */}
        {!courseToEdit && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Creation Mode:</span>
              <button
                type="button"
                onClick={() => setCreationMode('builder')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  creationMode === 'builder'
                    ? 'bg-[#002D62] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Course Builder
              </button>

              <button
                type="button"
                onClick={() => setCreationMode('ai')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  creationMode === 'ai'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" /> AI One-Click Architect
              </button>

              <button
                type="button"
                onClick={() => setCreationMode('blueprints')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  creationMode === 'blueprints'
                    ? 'bg-[#007A87] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Industry Blueprints ({COURSE_BLUEPRINTS.length})
              </button>
            </div>

            <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hidden sm:inline-block">
              Auto-Save Active
            </span>
          </div>
        )}

        {/* 3. MAIN WORKSPACE SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* MODE: AI ARCHITECT */}
          {creationMode === 'ai' && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                  <Wand2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-extrabold text-slate-900">
                  AI Curriculum & Course Generator
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Type any cybersecurity, networking, AI, or cloud engineering topic. Our AI will automatically construct the course description, syllabus modules, practical lab scenarios, and match the ideal Cisco thumbnail.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Course Topic or Subject Prompt *
                  </label>
                  <input 
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Cisco Enterprise SD-WAN & Multi-Cloud Security"
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007A87] shadow-inner"
                    autoFocus
                  />
                </div>

                {/* Suggested Prompt Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast Industry Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Zero Trust Architecture & Cisco ISE",
                      "AI-Powered Threat Hunting with Splunk",
                      "Kubernetes DevSecOps & Container Security",
                      "Post-Quantum Cryptography & TLS 1.3",
                      "Ethical Hacking & Active Directory Exploits"
                    ].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAiPrompt(preset)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 text-[11px] font-medium text-slate-700 transition-all cursor-pointer shadow-2xs"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-800 uppercase mb-1">Target Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                    >
                      <option value="Networking">Networking</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Programming">Programming</option>
                      <option value="Automation">Automation & DevOps</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="IoT & Analytics">IoT & Analytics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 uppercase mb-1">Target Skill Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAi}
                  disabled={isGeneratingAi}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isGeneratingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isGeneratingAi ? 'Architecting Course & Labs...' : 'Generate Full Course with AI'}</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE: BLUEPRINT TEMPLATES */}
          {creationMode === 'blueprints' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-slate-900">
                    Pre-Engineered Course Blueprints
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any blueprint to pre-fill the entire syllabus, description, and official NetAcad thumbnail.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {COURSE_BLUEPRINTS.map((bp) => (
                  <div
                    key={bp.title}
                    onClick={() => handleApplyBlueprint(bp)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#007A87] bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
                        <img src={bp.imageUrl} alt={bp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute top-2 left-2 bg-[#002D62] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          {bp.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#007A87] transition-colors line-clamp-2">
                        {bp.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {bp.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                      <span>{bp.syllabus.length} Chapters</span>
                      <span className="text-[#007A87] font-bold flex items-center gap-1">
                        Use Template <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE: MANUAL BUILDER WIZARD */}
          {creationMode === 'builder' && (
            <form onSubmit={handleSaveCourse} className="space-y-6">
              
              {/* Builder Subtabs */}
              <div className="flex border-b border-slate-200 gap-2 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveBuilderTab('basics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeBuilderTab === 'basics' ? 'bg-[#002D62] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> 1. Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBuilderTab('media')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeBuilderTab === 'media' ? 'bg-[#002D62] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> 2. Thumbnail & Media
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBuilderTab('syllabus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeBuilderTab === 'syllabus' ? 'bg-[#002D62] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> 3. Syllabus Chapters ({syllabusOutline.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBuilderTab('badging')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeBuilderTab === 'badging' ? 'bg-[#002D62] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" /> 4. Certification & Tuition
                </button>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Left Side: Form Controls */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* TAB 1: BASICS */}
                  {activeBuilderTab === 'basics' && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Cisco Certified Network Associate (CCNA 200-301)"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:outline-none focus:border-[#007A87]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-800 uppercase mb-1">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                          >
                            <option value="Networking">Networking</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Programming">Programming</option>
                            <option value="Automation">Automation & DevOps</option>
                            <option value="Operating Systems">Operating Systems</option>
                            <option value="IoT & Analytics">IoT & Analytics</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 uppercase mb-1">Provider Partner</label>
                          <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                          >
                            <option value="NetAcad">Cisco Networking Academy</option>
                            <option value="CyberAI">CyberAI Academy</option>
                            <option value="Hybrid">Hybrid Multi-Partner</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-800 uppercase mb-1">Skill Level</label>
                          <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 uppercase mb-1">Estimated Hours</label>
                          <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g. 24 hours"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 uppercase mb-1">Delivery Mode</label>
                          <select
                            value={deliveryMode}
                            onChange={(e) => setDeliveryMode(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
                          >
                            <option value="Online & On-Campus">Online & On-Campus</option>
                            <option value="Online">Online Only</option>
                            <option value="On-Campus">On-Campus Only</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                          Full Course Description *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Comprehensive summary of technologies, practical outcomes, and target audience..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-[#007A87]"
                          />
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Mark as Featured Course
                          </span>
                        </label>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Status:</span>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-bold"
                          >
                            <option value="published">Published (Visible)</option>
                            <option value="draft">Draft (Hidden)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: THUMBNAIL & MEDIA */}
                  {activeBuilderTab === 'media' && (
                    <div className="space-y-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-[#007A87]" /> Selected Course Thumbnail
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsGalleryOpen(true)}
                            className="font-bold text-[#007A87] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Browse 31 NetAcad Presets Gallery
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="w-full sm:w-48 aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shrink-0 shadow-md">
                            <img src={imageUrl || '/netacad-thumbnails/ccna-itn.png'} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="w-full space-y-2">
                            <input
                              type="text"
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              placeholder="/netacad-thumbnails/... or https://"
                              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" /> Upload File from PC
                              </button>
                              <input 
                                ref={fileInputRef} 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="hidden" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Thumbnail Row */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Popular Thumbnails:</span>
                        <div className="grid grid-cols-4 gap-2">
                          {NETACAD_THUMBNAIL_PRESETS.slice(0, 8).map(p => (
                            <div 
                              key={p.path}
                              onClick={() => setImageUrl(p.path)}
                              className={`aspect-[16/9] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                                imageUrl === p.path ? 'border-[#007A87] ring-2 ring-[#007A87]/30' : 'border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              <img src={p.path} alt={p.label} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SYLLABUS BUILDER */}
                  {activeBuilderTab === 'syllabus' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-bold text-slate-800 uppercase tracking-wider block">
                            Modules & Chapters ({syllabusOutline.length})
                          </label>
                          <span className="text-[11px] text-slate-500">Each module appears in the LMS player and curriculum breakdown.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsRawSyllabusMode(!isRawSyllabusMode)}
                          className="text-[11px] font-bold text-[#007A87] hover:underline cursor-pointer"
                        >
                          {isRawSyllabusMode ? 'Switch to Interactive Cards' : 'Switch to Bulk Text Paste'}
                        </button>
                      </div>

                      {isRawSyllabusMode ? (
                        <textarea
                          rows={8}
                          value={syllabusRawInput}
                          onChange={(e) => setSyllabusRawInput(e.target.value)}
                          onBlur={handleRawSyllabusBlur}
                          placeholder="Chapter 1: Intro&#10;Chapter 2: Routing Protocols&#10;Chapter 3: Final Lab"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-slate-900 leading-relaxed"
                        />
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {syllabusOutline.map((chapter, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                              <span className="font-mono font-bold text-[#007A87] w-6 shrink-0">{idx + 1}.</span>
                              <input
                                type="text"
                                value={chapter}
                                onChange={(e) => handleChapterTextChange(idx, e.target.value)}
                                className="flex-1 bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveChapter(idx)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Remove chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isRawSyllabusMode && (
                        <button
                          type="button"
                          onClick={handleAddChapter}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Another Chapter
                        </button>
                      )}
                    </div>
                  )}

                  {/* TAB 4: BADGING & TUITION */}
                  {activeBuilderTab === 'badging' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-800 uppercase mb-1">
                            Tuition Fee (PKR or Free)
                          </label>
                          <input
                            type="text"
                            value={tuitionFee}
                            onChange={(e) => setTuitionFee(e.target.value)}
                            placeholder="e.g. PKR 45,000 or Free"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 uppercase mb-1">
                            Badge Accent Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={badgeColor}
                              onChange={(e) => setBadgeColor(e.target.value)}
                              className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={badgeColor}
                              onChange={(e) => setBadgeColor(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono text-slate-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                          Official Badge / Certification Title
                        </label>
                        <input
                          type="text"
                          value={badgeName}
                          onChange={(e) => setBadgeName(e.target.value)}
                          placeholder="e.g. Cisco Certified Network Associate Specialist"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation / Save Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeBuilderTab === 'media') setActiveBuilderTab('basics');
                        else if (activeBuilderTab === 'syllabus') setActiveBuilderTab('media');
                        else if (activeBuilderTab === 'badging') setActiveBuilderTab('syllabus');
                      }}
                      disabled={activeBuilderTab === 'basics'}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      Back
                    </button>

                    <div className="flex items-center gap-2">
                      {activeBuilderTab !== 'badging' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (activeBuilderTab === 'basics') setActiveBuilderTab('media');
                            else if (activeBuilderTab === 'media') setActiveBuilderTab('syllabus');
                            else if (activeBuilderTab === 'syllabus') setActiveBuilderTab('badging');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          Next Step <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] hover:brightness-110 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{courseToEdit ? 'Save Changes' : 'Publish Course'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Side: Real-Time Live Card Preview */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#007A87]" /> Live Student Card Preview</span>
                    <span className="text-emerald-600">Exact Visual Appearance</span>
                  </div>

                  {/* PREVIEW CARD */}
                  <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                    <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                      <img 
                        src={imageUrl || '/netacad-thumbnails/ccna-itn.png'} 
                        alt="Course Card Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="bg-[#002D62]/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          {category}
                        </span>
                        {isFeatured && (
                          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-0.5 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-slate-950" /> FEATURED
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                        {difficulty}
                      </div>

                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-md text-[10px] font-mono">
                        {provider}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="font-display font-extrabold text-base text-slate-900 line-clamp-1">
                          {title || 'Your Course Title Here'}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {description || 'Comprehensive program covering industry theory, practical Cisco lab topologies, and certification exam preparation...'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 font-semibold">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#007A87]" /> {duration}
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          {deliveryMode}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 font-mono">
                        <span className="text-slate-400">{syllabusOutline.length} Chapters & Labs</span>
                        <span className="text-lg font-extrabold text-[#002D62] font-sans">{tuitionFee || 'Free'}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </form>
          )}

        </div>

        {/* 4. NETACAD 31 PRESETS GALLERY MODAL OVERLAY */}
        {isGalleryOpen && (
          <div className="absolute inset-0 z-20 bg-white flex flex-col animate-fade-in">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-display font-extrabold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#007A87]" /> Choose from 31 Official NetAcad Thumbnails
                </h3>
                <p className="text-xs text-slate-500">
                  Select an authentic Cisco Networking Academy thumbnail to apply to this course.
                </p>
              </div>
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="p-3 border-b border-slate-100 flex flex-wrap gap-1 bg-white">
              {['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'Operating Systems', 'IoT & Analytics'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    galleryFilter === cat ? 'bg-[#002D62] text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {NETACAD_THUMBNAIL_PRESETS
                .filter(p => galleryFilter === 'All' || p.category === galleryFilter)
                .map((preset) => (
                  <div
                    key={preset.path}
                    onClick={() => {
                      setImageUrl(preset.path);
                      setIsGalleryOpen(false);
                      showToast(`Thumbnail selected: ${preset.label}`);
                    }}
                    className={`group cursor-pointer rounded-2xl border-2 p-2 space-y-2 transition-all hover:shadow-md hover:scale-[1.02] ${
                      imageUrl === preset.path ? 'border-[#007A87] bg-cyan-50/40' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
                      <img src={preset.path} alt={preset.label} className="w-full h-full object-cover" />
                      {imageUrl === preset.path && (
                        <div className="absolute inset-0 bg-[#007A87]/40 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white text-[#007A87] flex items-center justify-center font-bold">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 truncate" title={preset.label}>
                      {preset.label}
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50">
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Gallery
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

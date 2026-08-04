import React, { useState } from 'react';
import { Server, Shield, Cpu, Monitor, MapPin, Clock, CheckCircle2, ChevronRight, Sparkles, Building2, Calendar } from 'lucide-react';

interface LabFacility {
  id: string;
  title: string;
  category: string;
  icon: any;
  image: string;
  description: string;
  hardwareSpecs: string[];
  batchTimes: string;
}

export default function CampusLabsShowcase() {
  const [activeTab, setActiveTab] = useState<'racks' | 'soc' | 'ai' | 'design'>('racks');

  const facilities: Record<string, LabFacility> = {
    racks: {
      id: 'racks',
      title: 'Cisco Routing & Switching Hardware Rack Lab',
      category: 'Enterprise Networking',
      icon: Server,
      image: '/network_home_hero.jpg',
      description: 'Physical Cisco 4331 ISR Routers, Catalyst 2960-X Switches, and Patch Panels mounted in enterprise server racks for 100% real hardware CCNA & CCNP CLI configuration.',
      hardwareSpecs: [
        'Cisco 4331 ISR Routers with VIC/HWIC Modules',
        'Catalyst 2960-S & 3560 Layer 3 Switches',
        'Optical Fiber & Twisted Pair Patch Panels',
        'Serial WAN Cable Converters & Console Servers'
      ],
      batchTimes: 'Morning (9:00 AM - 12:00 PM) | Evening (4:00 PM - 7:00 PM)'
    },
    soc: {
      id: 'soc',
      title: 'Cyber Security & Threat Operations (SOC) Lab',
      category: 'Defensive & Offensive Cyber',
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      description: 'Dedicated Threat Monitoring environment featuring Cisco ASA 5506-X Firewalls, Splunk SIEM log monitors, Kali Linux penetration testing rigs, and Wireshark packet capture stations.',
      hardwareSpecs: [
        'Cisco ASA 5506-X Next-Gen Firewalls',
        'Dual-Monitor SOC Analyst Monitoring Stations',
        'Isolated Sandbox VLANs for Malware Analysis',
        'Hardware Security Appliances & Intrusion Detection (IDS)'
      ],
      batchTimes: 'Evening (5:00 PM - 8:00 PM) | Weekend Special (Sat & Sun)'
    },
    ai: {
      id: 'ai',
      title: 'AI, Python & Supercomputing Workstation Lab',
      category: 'AI & Data Science',
      icon: Cpu,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      description: 'High-performance workstations equipped with NVIDIA CUDA GPUs for training Deep Learning models, Python data pipelines, PyTorch neural networks, and DevOps automation.',
      hardwareSpecs: [
        'NVIDIA RTX GPU Accelerators for Machine Learning',
        '64GB DDR5 RAM High-Speed Workstations',
        'Local LLM Inference & Automation Clusters',
        'Ansible & Terraform Infrastructure-as-Code Stacks'
      ],
      batchTimes: 'Morning (10:00 AM - 1:00 PM) | Evening (6:00 PM - 9:00 PM)'
    },
    design: {
      id: 'design',
      title: 'Digital Media & Graphic Design Studio',
      category: 'Creative Technology',
      icon: Monitor,
      image: 'https://images.unsplash.com/photo-1542744094-3a3172720449?w=800&auto=format&fit=crop&q=80',
      description: 'Creative design hub equipped with high-color-accuracy IPS displays, Adobe Creative Cloud suites, Figma UI/UX prototyping tools, and digital vector illustration stations.',
      hardwareSpecs: [
        'Color-Calibrated IPS Ultra-Wide Displays',
        'Adobe Illustrator, Photoshop & Premiere Pro Suites',
        'Drawing Graphics Tablets for Vector Illustration',
        'UI/UX Wireframing & Prototyping Software'
      ],
      batchTimes: 'Afternoon (2:00 PM - 5:00 PM) | Weekend Batches'
    }
  };

  const current = facilities[activeTab];
  const IconComponent = current.icon;

  return (
    <section className="space-y-8 py-6">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold nhiit-glass-pill text-[#005073] uppercase tracking-wider inline-block shadow-sm">
          Physical Multan Campus Facilities
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
          World-Class Hardware & AI Infrastructure
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          311-B Bosan Road, Opp. PTCL Exchange, Gulgasht Colony, Multan. Step inside South Punjab's most advanced IT labs.
        </p>
      </div>

      {/* LAB SELECTOR TAB BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: 'racks', label: 'Cisco Router Racks', icon: Server },
          { id: 'soc', label: 'Cyber Security SOC', icon: Shield },
          { id: 'ai', label: 'AI Supercomputing', icon: Cpu },
          { id: 'design', label: 'Digital Design Studio', icon: Monitor },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#002D62] to-[#007A87] text-white shadow-lg scale-105'
                  : 'nhiit-glass-card text-slate-700 hover:text-slate-950'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-accentCyan' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FEATURED LAB SHOWCASE CONTAINER */}
      <div className="nhiit-glass-card rounded-3xl p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center border border-white/80 shadow-2xl">
        
        {/* Left Column: Image with Glass Badge Overlay */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-xl aspect-video sm:aspect-4/3 group">
          <img 
            src={current.image} 
            alt={current.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-[10px] font-mono font-bold text-accentGreen uppercase tracking-wider">
              {current.category}
            </span>
            <h3 className="text-lg font-bold">{current.title}</h3>
          </div>
        </div>

        {/* Right Column: Specifications & Campus Details */}
        <div className="lg:col-span-6 space-y-5 text-left">
          
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#007A87]/10 text-[#007A87] text-[10px] font-mono font-bold uppercase tracking-wider inline-block">
              Multan Campus On-Site Facility
            </span>
            <h3 className="text-2xl font-display font-extrabold text-slate-900">{current.title}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{current.description}</p>
          </div>

          {/* Hardware Specs Checklist */}
          <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accentCyan" /> Physical Equipment & Software Stack
            </h4>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {current.hardwareSpecs.map((spec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentGreen shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Batch Timing Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-slate-600 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#007A87]" />
              <div>
                <span className="font-semibold text-slate-800 block">Batch Schedules</span>
                <span className="text-[11px] text-slate-500">{current.batchTimes}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#002D62] font-semibold">
              <MapPin className="w-4 h-4 text-accentGreen" />
              <span>311-B Bosan Road, Multan</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

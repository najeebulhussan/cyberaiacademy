import React from 'react';
import { Award, Star, CheckCircle, ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  role: string;
  certification: string;
  experience: string;
  rating: number;
  image: string;
  specialties: string[];
}

export default function FacultyShowcase() {
  const facultyMembers: FacultyMember[] = [
    {
      id: '1',
      name: 'Engr. Najeeb Ul Hussan',
      role: 'Lead Instructor & CCIE Network Architect',
      certification: 'Cisco Certified Internetwork Expert (CCIE) & CyberOps',
      experience: '15+ Years Industry & Academic Experience',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      specialties: ['Cisco CCNA / CCNP Enterprise', 'BGP & OSPF Routing', 'ASA Security & VPNs']
    },
    {
      id: '2',
      name: 'Engr. Farhan Shah',
      role: 'Head of Cybersecurity & SOC Operations',
      certification: 'Certified Ethical Hacker (CEH) & Cisco CyberOps',
      experience: '12+ Years Enterprise Threat Defense',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      specialties: ['SIEM & Splunk Analysis', 'Penetration Testing', 'Incident Response']
    },
    {
      id: '3',
      name: 'Ms. Ayesha Malik',
      role: 'Senior AI & Python Automation Specialist',
      certification: 'Python Certified Associate & MLOps Lead',
      experience: '8+ Years AI Data Engineering',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      specialties: ['Python Data Science', 'Deep Learning Models', 'Ansible Network Automation']
    }
  ];

  return (
    <section className="space-y-8 py-6">
      
      {/* HEADER */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold nhiit-glass-pill text-[#005073] uppercase tracking-wider inline-block shadow-sm">
          Certified Expert Instructors
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
          Learn from CCIE & Industry Veterans
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          Our faculty members combine global Cisco certifications with hands-on enterprise consulting experience to guide Multan students.
        </p>
      </div>

      {/* FACULTY CARDS GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {facultyMembers.map((member) => (
          <div 
            key={member.id}
            className="nhiit-glass-card rounded-3xl p-6 space-y-5 text-left border border-white/80 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              
              {/* Avatar + Rating */}
              <div className="flex items-center gap-4">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#007A87]/30 shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#007A87] transition-colors">{member.name}</h3>
                  <span className="text-xs font-semibold text-[#005073] block">{member.role}</span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{member.rating} / 5.0 Rating</span>
                  </div>
                </div>
              </div>

              {/* Cert Badge Info */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-accentGreen font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">{member.certification}</span>
                </div>
                <span className="text-[10px] text-slate-500 block font-mono">{member.experience}</span>
              </div>

              {/* Specialties */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Specializations</span>
                <div className="flex flex-wrap gap-1.5">
                  {member.specialties.map((spec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50/80 text-[#002D62] text-[10px] font-semibold">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-[#007A87]" /> Active Multan Batches</span>
              <span className="text-accentGreen font-mono font-bold">Verified Educator</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

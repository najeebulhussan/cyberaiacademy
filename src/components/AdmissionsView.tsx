import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, DollarSign, HelpCircle, ChevronDown, ChevronUp, BookOpen, Shield, Award } from 'lucide-react';
import AdmissionModal from '@/components/AdmissionModal';

export default function AdmissionsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Are courses available both Online and In-Person?",
      a: "Yes! Every single program and certification track is available in two formats: (1) In-Person physical classroom and hardware labs at 311-B Bosan Road Multan, and (2) 100% Live Online Interactive classes with 24/7 AI-guided cloud sandboxes from anywhere worldwide."
    },
    {
      q: "How do I apply for physical or online batches?",
      a: "You can apply directly using our Admissions Inquiry form online or visit our Multan campus at 311-B Bosan Road. Admission counseling and batch registrations are open Monday to Saturday from 9:00 AM to 7:00 PM."
    },
    {
      q: "What physical lab hardware will I get access to?",
      a: "On-campus students get direct hands-on access to physical Cisco 4331 ISR Routers, Catalyst 2960-X Switches, Cisco ASA Firewalls, RHEL 9 Linux server racks, and high-performance workstations."
    },
    {
      q: "Are installment plans available for course fees?",
      a: "Yes! We offer flexible fee payment plans (Monthly Installments in PKR) for CCNA, CCNP, RHCSA, AWS, CEH, and DevOps certification tracks."
    },
    {
      q: "Do you offer official Cisco NetAcad W3C digital open badges?",
      a: "Yes. As an official Cisco Networking Academy partner, students who complete their modules receive official Cisco W3C digital open badges verifiable on Credly and our public verifier portal."
    },
    {
      q: "What are the batch timings for working professionals and students?",
      a: "We offer Morning (9:00 AM - 12:00 PM), Afternoon (2:00 PM - 5:00 PM), Evening (5:00 PM - 8:00 PM), and Weekend Special (Saturday & Sunday) batches for both online and physical sessions."
    }
  ];

  return (
    <div className="space-y-12 py-6 text-slate-800 animate-fade-in text-left">
      
      {/* HEADER BANNER */}
      <div className="nhiit-glass-dark rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl space-y-4">
        <div className="particle w-4 h-4 bg-white/20" style={{ top: '15%', left: '10%' }} />
        <div className="particle w-3 h-3 bg-white/15" style={{ top: '65%', right: '15%' }} />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/20 text-accentCyan inline-block">
              ONLINE & ON-CAMPUS ADMISSIONS
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 inline-flex items-center gap-1.5">
              <span>🌐 Online & 🏫 In-Person Available</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Admissions Open — Fall & Spring Batches
          </h1>
          <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed">
            Join South Punjab's top Cisco & IT academy. Study <strong>In-Person</strong> with 1-on-1 router rack time at 311-B Bosan Road Multan or <strong>100% Live Online</strong> with 24/7 cloud sandbox access from anywhere in the world.
          </p>

          <div className="pt-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#007A87] hover:bg-[#005073] text-white px-7 py-3.5 rounded-xl font-bold text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 border border-white/20"
            >
              🎓 Apply for Online / In-Person Batch
            </button>
          </div>
        </div>
      </div>

      {/* ADMISSION STEPS */}
      <div className="nhiit-glass-card rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 text-center">
          Simple 4-Step Admission Process
        </h2>

        <div className="grid sm:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Submit Inquiry', desc: 'Fill out our online application or visit 311-B Bosan Road Multan.' },
            { step: '02', title: 'Counseling & Lab Tour', desc: 'Meet our CCIE certified instructors and tour our hardware lab racks.' },
            { step: '03', title: 'Select Batch Timing', desc: 'Choose Morning, Evening, or Weekend batch schedule that suits you.' },
            { step: '04', title: 'Start Classes & Labs', desc: 'Receive your NetAcad portal login and begin practical lab sessions.' }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 relative">
              <span className="text-2xl font-display font-black text-[#007A87]/30 block">{item.step}</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="nhiit-glass-card rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Admissions FAQ
          </h2>
          <p className="text-xs text-slate-600">Everything you need to know about joining Network Home Multan.</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white/80 transition-all">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-slate-900 text-sm cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#007A87] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}

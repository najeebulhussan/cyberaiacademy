import React, { useState } from 'react';
import { useAcademyStore } from '@/services/academyState';
import { Shield, Network, Award, Search, CheckCircle, Lock, ExternalLink, Share2, Clipboard, Globe, X } from 'lucide-react';

interface VerificationModalProps {
  badge: any;
  onClose: () => void;
}

function VerificationModal({ badge, onClose }: VerificationModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(badge.hash || '0xabc123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl text-slate-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-950"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-accentGreen/10 text-accentGreen rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Credly Verified Credential</h3>
          <p className="text-xs text-slate-500">Official digital badge issued by Cisco Systems, Inc.</p>
        </div>

        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-500">Credential Name</span>
            <span className="font-bold text-slate-800 text-right max-w-[200px] truncate">{badge.title}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-500">Issuer Authority</span>
            <span className="font-bold text-slate-800">Cisco Networking Academy</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-500">Verification Platform</span>
            <span className="font-bold text-[#005073] flex items-center gap-1">
              Credly Verified <Globe className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-500">Status</span>
            <span className="font-bold text-accentGreen flex items-center gap-1">
              Active / Validated <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-500">Recipient Name</span>
            <span className="font-bold text-slate-850">Alex Mercer</span>
          </div>
          <div className="space-y-1 pt-1.5">
            <span className="text-slate-500 block">Cryptographic Hash (SHA-256)</span>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-250 font-mono text-[9px] text-slate-700">
              <span className="truncate flex-1">{badge.hash || '0x4f8e7d6c5b4a3a2b1c0a9f8e7d6c5b4a3a2b1c'}</span>
              <button 
                onClick={handleCopy}
                className="text-accentCyan hover:text-accentCyan/80 p-0.5 shrink-0"
              >
                {copied ? 'Copied!' : <Clipboard className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <a 
            href="https://www.credly.com/organizations/cisco/badges"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-slate-350 hover:bg-slate-50 py-2.5 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1"
          >
            View on Credly <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button 
            onClick={onClose}
            className="flex-1 bg-accentPurple text-white py-2.5 rounded-lg text-xs font-bold hover:bg-accentPurple/95 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BadgesView() {
  const { courses } = useAcademyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Earned' | 'In Progress' | 'Locked'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Networking' | 'Cybersecurity' | 'Programming' | 'Automation' | 'Operating Systems'>('All');
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  // Map courses to their badge data
  const badgesList = courses.map((course) => {
    // Generate dummy hash if earned
    const generatedHash = course.enrollmentStatus === 'completed' 
      ? `0x${course.id}f8e7d6c5b4a3a2b1c0a9f8e7d6c5b4a3a2b1c`
      : undefined;

    return {
      id: `badge-${course.id}`,
      courseId: course.id,
      title: course.badgeName || `${course.title.replace('CCNA: ', '')} Badge`,
      courseTitle: course.title,
      category: course.category,
      provider: course.provider,
      status: course.enrollmentStatus === 'completed' 
        ? 'Earned' 
        : course.enrollmentStatus === 'in_progress' 
          ? 'In Progress' 
          : 'Locked',
      progress: course.progress,
      hash: generatedHash,
    };
  });

  // Filter badges
  const filteredBadges = badgesList.filter((badge) => {
    const matchesSearch = badge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          badge.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || badge.status === statusFilter;
    
    let matchesCategory = categoryFilter === 'All' || badge.category === categoryFilter;
    if (categoryFilter === 'Operating Systems') {
      matchesCategory = badge.category === 'Operating Systems';
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Dynamic Badge SVG Generator based on category and status
  const renderBadgeIcon = (badge: any) => {
    const isEarned = badge.status === 'Earned';
    const isInProgress = badge.status === 'In Progress';
    
    // Choose theme colors
    let primaryColor = '#007A87'; // Cisco Teal
    let accentColor = '#002D62'; // Cisco Navy
    let iconSymbol = '⚙️';

    if (badge.category === 'Networking') {
      primaryColor = '#005073';
      accentColor = '#00F2FE';
      iconSymbol = '🌐';
    } else if (badge.category === 'Cybersecurity') {
      primaryColor = '#1E824C';
      accentColor = '#00A854';
      iconSymbol = '🛡️';
    } else if (badge.category === 'Programming') {
      primaryColor = '#D97706';
      accentColor = '#FF9F00';
      iconSymbol = '💻';
    } else if (badge.category === 'Automation') {
      primaryColor = '#4F46E5';
      accentColor = '#7F00FF';
      iconSymbol = '🤖';
    } else if (badge.category === 'Operating Systems') {
      primaryColor = '#0369A1';
      accentColor = '#38BDF8';
      iconSymbol = '🐧';
    }

    const filterStyle = isEarned 
      ? {} 
      : isInProgress 
        ? { filter: 'saturate(0.5) opacity(0.8)' } 
        : { filter: 'grayscale(1) opacity(0.35)' };

    return (
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center" style={filterStyle}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Hexagon Border */}
          <polygon 
            points="50,3 93,28 93,78 50,97 7,78 7,28" 
            fill={accentColor} 
            stroke={primaryColor} 
            strokeWidth="3" 
          />
          {/* Inner Hexagon */}
          <polygon 
            points="50,9 87,31 87,74 50,91 13,74 13,31" 
            fill="#FFFFFF" 
            stroke={primaryColor} 
            strokeWidth="1" 
          />
          {/* Top arch text brand */}
          <path id="archPath" d="M 22,35 A 32,32 0 0,1 78,35" fill="none" />
          <text fontSize="7" fontWeight="bold" fill={primaryColor} letterSpacing="1">
            <textPath href="#archPath" startOffset="50%" textAnchor="middle">
              CISCO SYSTEMS
            </textPath>
          </text>
          
          {/* Center Icon */}
          <text x="50" y="58" fontSize="22" textAnchor="middle" dominantBaseline="middle">
            {iconSymbol}
          </text>
          
          {/* Bottom brand category */}
          <text x="50" y="78" fontSize="6.5" fontWeight="bold" fill={accentColor} textAnchor="middle">
            {badge.category.toUpperCase()}
          </text>
        </svg>

        {/* Lock Overlay */}
        {badge.status === 'Locked' && (
          <div className="absolute inset-0 bg-slate-900/10 rounded-full flex items-center justify-center">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        )}

        {/* Progress Overlay */}
        {badge.status === 'In Progress' && (
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-accentCyan text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white shadow-md">
            {badge.progress}%
          </div>
        )}
      </div>
    );
  };

  const handleShare = (badge: any) => {
    alert(`Successfully generated Credly verifiable share link for: ${badge.title}. Link copied to clipboard!`);
  };

  return (
    <div className="space-y-8 py-8">
      
      {/* HEADER SECTION */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-accentCyan/10 text-accentCyan inline-block uppercase">
          Credential Locker
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
          Cisco Networking Academy Credentials
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Official digital badges issued in partnership with Credly. Track your progress, verify core network and security competencies, and share certificates directly to LinkedIn and recruitment portfolios.
        </p>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <input 
              type="text" 
              placeholder="Search badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-350 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-accentCyan text-slate-700"
            />
            <Search className="w-4 h-4 text-slate-450 absolute left-3 top-2.5" />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
            {(['All', 'Earned', 'In Progress', 'Locked'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  statusFilter === status 
                    ? 'bg-accentCyan/10 border-accentCyan text-accentCyan font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 items-center border-t border-slate-200 pt-3">
          <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
          {(['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'Operating Systems'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
                categoryFilter === category 
                  ? 'bg-accentPurple/10 border-accentPurple text-accentPurple font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* BADGES GRID */}
      <section className="max-w-6xl mx-auto">
        {filteredBadges.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl bg-slate-50 max-w-md mx-auto">
            <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800">No Badges Found</h3>
            <p className="text-xs text-slate-500 mt-1">Adjust your filters to see more Cisco credentials.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
              <div 
                key={badge.id}
                className={`bg-white border rounded-xl p-5 text-center flex flex-col justify-between transition-all ${
                  badge.status === 'Earned' 
                    ? 'border-accentGreen/30 shadow-sm hover:shadow-md hover:border-accentGreen/50' 
                    : badge.status === 'In Progress'
                      ? 'border-accentCyan/30 shadow-sm'
                      : 'border-slate-200 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="space-y-4">
                  {/* Badge Image */}
                  {renderBadgeIcon(badge)}

                  {/* Badge Text */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      {badge.provider}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 min-h-[40px]">
                      {badge.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      Issued for completing {badge.courseTitle}.
                    </p>
                  </div>
                </div>

                {/* Bottom Actions based on status */}
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  {badge.status === 'Earned' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedBadge(badge)}
                        className="flex-1 bg-accentGreen hover:bg-accentGreen/95 text-white py-1.5 rounded text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                      >
                        Verify Credential
                      </button>
                      <button 
                        onClick={() => handleShare(badge)}
                        className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-250 rounded text-[11px] font-bold transition-all"
                        title="Share Badge"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {badge.status === 'In Progress' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Course Progress</span>
                        <span className="font-bold text-accentCyan">{badge.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className="bg-accentCyan h-1.5 rounded-full" 
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                      <a 
                        href="#player"
                        className="block w-full bg-accentCyan hover:bg-accentCyan/90 text-white py-1.5 rounded text-[11px] font-bold text-center transition-colors"
                      >
                        Resume Course Labs
                      </a>
                    </div>
                  )}

                  {badge.status === 'Locked' && (
                    <a 
                      href="#explore"
                      className="block w-full border border-slate-350 hover:bg-slate-50 text-slate-650 py-1.5 rounded text-[11px] font-bold text-center transition-all"
                    >
                      View Syllabus & Enroll
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* VERIFICATION DIALOG MODAL */}
      {selectedBadge && (
        <VerificationModal 
          badge={selectedBadge} 
          onClose={() => setSelectedBadge(null)} 
        />
      )}

    </div>
  );
}

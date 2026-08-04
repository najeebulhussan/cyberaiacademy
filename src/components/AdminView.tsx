import React, { useState } from 'react';
import { useAcademyStore, Course, Pathway } from '@/services/academyState';
import { Settings, Shield, Plus, Edit2, Trash2, Database, Terminal, RefreshCw, CheckCircle, Info } from 'lucide-react';

export default function AdminView() {
  const { 
    courses, 
    pathways, 
    profile, 
    apiLogs, 
    addCourse, 
    editCourse, 
    deleteCourse, 
    addPathway, 
    deletePathway, 
    updateProfile, 
    resetDatabase 
  } = useAcademyStore();

  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'pathways' | 'profile' | 'api'>('courses');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Course Form State ---
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('Networking');
  const [courseProvider, setCourseProvider] = useState<Course['provider']>('NetAcad');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDiff, setCourseDiff] = useState<Course['difficulty']>('Beginner');
  const [courseDur, setCourseDur] = useState('10 hours');
  const [courseBadge, setCourseBadge] = useState('');
  const [courseOutlineRaw, setCourseOutlineRaw] = useState(
    "Chapter 1: Welcome & Course Overview\nChapter 2: Essential Terminology & Setup\nChapter 3: Interactive Verification Exercises\nChapter 4: Final Certification Examination"
  );
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // --- Pathway Form State ---
  const [pathTitle, setPathTitle] = useState('');
  const [pathCareer, setPathCareer] = useState('');
  const [pathSalary, setPathSalary] = useState('$90,000');
  const [pathCert, setPathCert] = useState('');
  const [pathDesc, setPathDesc] = useState('');
  const [pathSelectedCourses, setPathSelectedCourses] = useState<string[]>([]);

  // --- Profile Form State ---
  const [profileName, setProfileName] = useState(profile.name);
  const [profileRank, setProfileRank] = useState(profile.rank);
  const [profileXp, setProfileXp] = useState(profile.xp);
  const [profileHours, setProfileHours] = useState(profile.studyHours);

  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Course handlers
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim()) return;

    const syllabusOutline = courseOutlineRaw.split('\n').filter(line => line.trim().length > 0);
    
    if (editingCourseId) {
      editCourse(editingCourseId, {
        title: courseTitle,
        category: courseCategory,
        provider: courseProvider,
        description: courseDesc,
        difficulty: courseDiff,
        duration: courseDur,
        modulesCount: syllabusOutline.length,
        badgeName: courseBadge || undefined,
        syllabusOutline,
      });
      triggerNotification("Course details updated successfully in database!");
      setEditingCourseId(null);
    } else {
      const newId = `course-${Date.now()}`;
      const newCourse: Course = {
        id: newId,
        title: courseTitle,
        category: courseCategory,
        provider: courseProvider,
        description: courseDesc,
        difficulty: courseDiff,
        duration: courseDur,
        modulesCount: syllabusOutline.length,
        badgeName: courseBadge || undefined,
        enrollmentStatus: 'not_enrolled',
        progress: 0,
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        syllabusOutline,
      };
      addCourse(newCourse);
      triggerNotification("New course added successfully to the catalog!");
    }

    // Reset form
    setCourseTitle('');
    setCourseDesc('');
    setCourseBadge('');
  };

  const handleEditInit = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseCategory(course.category);
    setCourseProvider(course.provider);
    setCourseDesc(course.description);
    setCourseDiff(course.difficulty);
    setCourseDur(course.duration);
    setCourseBadge(course.badgeName || '');
    setCourseOutlineRaw(course.syllabusOutline.join('\n'));
    setActiveSubTab('courses');
  };

  // Pathway handlers
  const handleSavePathway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathTitle.trim() || !pathCareer.trim() || pathSelectedCourses.length === 0) {
      alert("Please enter title, career, and select at least one course.");
      return;
    }

    const newPath: Pathway = {
      id: `pathway-${Date.now()}`,
      title: pathTitle,
      career: pathCareer,
      salary: pathSalary,
      certifications: pathCert || 'W3C Verifiable Certifications',
      courseIds: pathSelectedCourses,
      color: '#007A87',
      description: pathDesc,
      longDesc: pathDesc,
    };

    addPathway(newPath);
    triggerNotification("Pathway created and aligned to career routes!");
    
    // Reset
    setPathTitle('');
    setPathCareer('');
    setPathDesc('');
    setPathSelectedCourses([]);
  };

  const togglePathCourseSelection = (courseId: string) => {
    if (pathSelectedCourses.includes(courseId)) {
      setPathSelectedCourses(pathSelectedCourses.filter(id => id !== courseId));
    } else {
      setPathSelectedCourses([...pathSelectedCourses, courseId]);
    }
  };

  // Profile handlers
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      rank: profileRank,
      xp: Number(profileXp),
      studyHours: Number(profileHours)
    });
    triggerNotification("Student profile parameters updated!");
  };

  return (
    <div className="space-y-8 py-8">
      {/* TITLE BAR */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#72B13B]/10 text-[#72B13B] uppercase">
              Management Portal
            </span>
            <span className="w-2 h-2 rounded-full bg-accentGreen animate-ping" />
          </div>
          <h1 className="text-3xl font-display font-bold text-[#002D62]">
            Academy Administrator Console
          </h1>
          <p className="text-xs text-slate-500">
            Fully customizable CMS controls. Directly updates the global store and simulates JSON REST API requests.
          </p>
        </div>

        <button 
          onClick={() => {
            if(window.confirm("Are you sure you want to reset the store to defaults? This will erase custom courses.")) {
              resetDatabase();
              triggerNotification("Database reset successfully!");
            }
          }}
          className="px-4 py-2 border border-accentGold text-accentGold hover:bg-accentGold/5 text-xs font-semibold rounded-lg flex items-center gap-1.5 bg-white transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Database Defaults
        </button>
      </section>

      {/* NOTIFICATION TOAST */}
      {successMsg && (
        <div className="bg-accentGreen/10 border border-accentGreen/20 text-accentGreen p-3.5 rounded-xl text-xs flex items-center gap-2 max-w-md mx-auto animate-fade-in shadow-sm font-sans font-semibold">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ADMIN SUB-NAVIGATION TABS */}
      <section className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
            activeSubTab === 'courses' 
              ? 'bg-[#002D62] text-white' 
              : 'bg-slate-50 text-slate-650 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          📚 Course Management
        </button>
        <button
          onClick={() => setActiveSubTab('pathways')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
            activeSubTab === 'pathways' 
              ? 'bg-[#002D62] text-white' 
              : 'bg-slate-50 text-slate-650 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          🛣️ Career Pathways
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
            activeSubTab === 'profile' 
              ? 'bg-[#002D62] text-white' 
              : 'bg-slate-50 text-slate-650 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          👤 Student Profile Settings
        </button>
        <button
          onClick={() => setActiveSubTab('api')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'api' 
              ? 'bg-[#002D62] text-white' 
              : 'bg-slate-50 text-slate-650 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" /> REST API Simulator Logs
        </button>
      </section>

      {/* TAB CONTENT AREAS */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE CONTROL COMPONENT */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: COURSE MANAGEMENT */}
          {activeSubTab === 'courses' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-accentCyan" /> {editingCourseId ? 'Edit Cisco Course' : 'Create New Cisco Course'}
              </h3>
              
              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Course Title</label>
                    <input 
                      type="text" 
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g. CCNA: Network Programmability Operations"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700 font-sans"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Duration (hours)</label>
                    <input 
                      type="text" 
                      value={courseDur}
                      onChange={(e) => setCourseDur(e.target.value)}
                      placeholder="e.g. 24 hours"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Category</label>
                    <select 
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-750"
                    >
                      <option value="Networking">Networking</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Programming">Programming</option>
                      <option value="Automation">Automation</option>
                      <option value="IoT & Analytics">IoT & Analytics</option>
                      <option value="Operating Systems">Operating Systems</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Provider Brand</label>
                    <select 
                      value={courseProvider}
                      onChange={(e) => setCourseProvider(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-750"
                    >
                      <option value="NetAcad">Cisco NetAcad Linked</option>
                      <option value="CyberAI">CyberAI Initiative</option>
                      <option value="Hybrid">Hybrid/Affiliate</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Difficulty</label>
                    <select 
                      value={courseDiff}
                      onChange={(e) => setCourseDiff(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-750"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Course Description</label>
                  <textarea 
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Enter short description details..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700 leading-normal"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Credly Badge Name (Optional)</label>
                    <input 
                      type="text" 
                      value={courseBadge}
                      onChange={(e) => setCourseBadge(e.target.value)}
                      placeholder="e.g. Cisco Automation Architect"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Badge HEX Color Theme</label>
                    <input 
                      type="color" 
                      value={courseBadge ? '#007A87' : '#E2E8F0'}
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none cursor-not-allowed opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Chapter Syllabus Outline (One chapter per line)</label>
                  <textarea 
                    value={courseOutlineRaw}
                    onChange={(e) => setCourseOutlineRaw(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:border-accentCyan text-[11px] text-slate-700 leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    className="flex-1 bg-accentCyan hover:bg-accentCyan/95 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {editingCourseId ? 'Update Course Metadata' : 'Save & Publish Course'}
                  </button>
                  {editingCourseId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingCourseId(null);
                        setCourseTitle('');
                        setCourseDesc('');
                      }}
                      className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg font-bold"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PATHWAY CREATOR */}
          {activeSubTab === 'pathways' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-accentCyan" /> Create Career Pathway
              </h3>

              <form onSubmit={handleSavePathway} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Pathway Title</label>
                    <input 
                      type="text" 
                      value={pathTitle}
                      onChange={(e) => setPathTitle(e.target.value)}
                      placeholder="e.g. Cisco DevSecOps Operations"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Target Job Career Role</label>
                    <input 
                      type="text" 
                      value={pathCareer}
                      onChange={(e) => setPathCareer(e.target.value)}
                      placeholder="e.g. DevSecOps Architect"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Average Annual Salary</label>
                    <input 
                      type="text" 
                      value={pathSalary}
                      onChange={(e) => setPathSalary(e.target.value)}
                      placeholder="e.g. $110,000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Associated Certifications</label>
                    <input 
                      type="text" 
                      value={pathCert}
                      onChange={(e) => setPathCert(e.target.value)}
                      placeholder="e.g. Cisco CyberOps & DevNet Associate"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Pathway Career Description</label>
                  <textarea 
                    value={pathDesc}
                    onChange={(e) => setPathDesc(e.target.value)}
                    placeholder="Provide a detailed roadmap description..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700 leading-normal"
                  />
                </div>

                {/* Course Selection Checklist */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 block">Assign Course Modules to this Pathway</label>
                  <div className="grid sm:grid-cols-2 gap-2 border border-slate-200 bg-slate-50 p-4 rounded-xl max-h-[160px] overflow-y-auto">
                    {courses.map(course => (
                      <label key={course.id} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-150 cursor-pointer hover:bg-slate-50/50">
                        <input 
                          type="checkbox"
                          checked={pathSelectedCourses.includes(course.id)}
                          onChange={() => togglePathCourseSelection(course.id)}
                          className="accent-accentCyan"
                        />
                        <span className="font-sans font-semibold text-[11px] text-slate-700 truncate">{course.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accentCyan hover:bg-accentCyan/95 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Create & Launch Pathway
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: STUDENT PROFILE SETTINGS */}
          {activeSubTab === 'profile' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                👤 Student Registry Profile Settings
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Student Username</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Honorary Rank Designation</label>
                    <input 
                      type="text" 
                      value={profileRank}
                      onChange={(e) => setProfileRank(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Initial Experience Points (XP)</label>
                    <input 
                      type="number" 
                      value={profileXp}
                      onChange={(e) => setProfileXp(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Total Study Hours</label>
                    <input 
                      type="number" 
                      value={profileHours}
                      onChange={(e) => setProfileHours(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-accentCyan text-slate-700"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accentCyan hover:bg-accentCyan/95 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Apply Profile Modifications
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: API SIMULATOR LOGS */}
          {activeSubTab === 'api' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-5 h-5 text-accentCyan" /> REST API Request Stream
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Live JSON Logging Active</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Whenever views load courses, enroll, or update progress, the frontend transmits REST API HTTP requests. The logs below show the simulated request traces:
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-300 space-y-2 h-[260px] overflow-y-auto">
                {apiLogs.length === 0 ? (
                  <div className="text-slate-500 text-center py-16">No recent API transactions. Try editing courses or changing tabs.</div>
                ) : (
                  apiLogs.map((log, idx) => {
                    const methodColor = log.method === 'GET' ? 'text-blue-400' : log.method === 'POST' ? 'text-green-400' : log.method === 'DELETE' ? 'text-red-400' : 'text-yellow-400';
                    return (
                      <div key={idx} className="flex items-center justify-between border-b border-slate-900 pb-1 text-[9.5px]">
                        <div className="flex items-center gap-2">
                          <span className={`${methodColor} font-bold`}>[{log.method}]</span>
                          <span className="text-slate-200">{log.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="text-accentGreen">{log.status} OK</span>
                          <span className="text-slate-500 text-[8px]">{log.timestamp}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ACTIVE DATABASE VISUALIZER */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* DATABASE SUMMARY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-accentCyan" /> Simulated JSON Database
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Published Courses</span>
                <span className="font-bold text-slate-800 font-mono">{courses.length}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Career Pathways</span>
                <span className="font-bold text-slate-800 font-mono">{pathways.length}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Student Badges</span>
                <span className="font-bold text-slate-800 font-mono">{profile.certificatesCount} Earned</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Database Engine</span>
                <span className="font-bold text-accentGreen flex items-center gap-0.5">
                  LocalStorage <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* ACTIVE DATABASE RECORDS LIST */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Database Records</span>
              <span className="text-[10px] text-slate-400">Total {courses.length}</span>
            </h4>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
              {courses.map(course => (
                <div key={course.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-2 group hover:border-slate-300">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="text-[8px] font-mono font-bold uppercase text-slate-400 block">{course.category} ({course.provider})</span>
                    <h5 className="font-bold text-slate-800 truncate" title={course.title}>{course.title}</h5>
                    <span className="text-[10px] text-slate-500 block">{course.syllabusOutline.length} Syllabus Chapters</span>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleEditInit(course)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm(`Are you sure you want to delete course: ${course.title}?`)) {
                          deleteCourse(course.id);
                          triggerNotification("Course deleted successfully!");
                        }
                      }}
                      className="p-1 hover:bg-slate-200 rounded text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

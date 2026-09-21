import React, { useState, useMemo, useRef } from 'react';
import { useAcademyStore, Course, Pathway, StudentRosterItem, IssuedCertificate } from '@/services/academyState';
import { aiService } from '@/services/aiService';
import { 
  Settings, Shield, Plus, Edit2, Trash2, Copy, Database, Terminal, RefreshCw, 
  CheckCircle, Info, Search, Image as ImageIcon, Upload, Download, Globe, Lock, 
  KeyRound, Sparkles, ExternalLink, Eye, BookOpen, Layers, AlertCircle, X, 
  ChevronDown, LogOut, Check, ArrowRight, Clock, Award, ShieldCheck, Filter,
  GraduationCap, Users, Printer, FileSpreadsheet, Wand2, QrCode, FileText,
  Calendar, Phone, Mail, CheckCircle2, UserCheck, BarChart3, TrendingUp
} from 'lucide-react';

// Preset NetAcad Official Thumbnails Gallery
const NETACAD_THUMBNAIL_PRESETS = [
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

interface AdminViewProps {
  onLogout?: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export default function AdminView({ onLogout, onNavigateToTab }: AdminViewProps) {
  const { 
    courses, 
    pathways, 
    profile, 
    students,
    certificates,
    apiLogs, 
    addCourse, 
    editCourse, 
    deleteCourse, 
    duplicateCourse,
    importCourses,
    addPathway, 
    deletePathway, 
    updateProfile, 
    resetDatabase,
    getAdminPasscode,
    setAdminPasscode,
    addStudent,
    updateStudent,
    deleteStudent,
    issueCertificate,
    revokeCertificate,
  } = useAcademyStore();

  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'gradebook' | 'certificates' | 'pathways' | 'security' | 'sheets' | 'profile' | 'api'>('courses');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Course Search & Filter State ---
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');

  // --- AI Course Architect State ---
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const [aiCategoryHint, setAiCategoryHint] = useState<Course['category']>('Cybersecurity');
  const [aiDifficultyHint, setAiDifficultyHint] = useState<Course['difficulty']>('Intermediate');
  const [aiDurationHint, setAiDurationHint] = useState('24 hours');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // --- Google Sheets Webhook State ---
  const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx_jnSxJ5VldKya0WsTDG8woz0dgJh3ORBQOIxJWy2oU5WOARUwtTUTVO0U09m4pou5/exec';
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState(() => localStorage.getItem('cybersmart_google_sheet_webhook') || DEFAULT_WEBHOOK_URL);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testWebhookResult, setTestWebhookResult] = useState<string | null>(null);

  // --- Course Form State ---
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('Networking');
  const [courseProvider, setCourseProvider] = useState<Course['provider']>('NetAcad');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDiff, setCourseDiff] = useState<Course['difficulty']>('Beginner');
  const [courseDur, setCourseDur] = useState('17 hours');
  const [courseImageUrl, setCourseImageUrl] = useState('/netacad-thumbnails/ccna-itn.png');
  const [courseDeliveryMode, setCourseDeliveryMode] = useState<Course['deliveryMode']>('Online & On-Campus');
  const [courseBadge, setCourseBadge] = useState('');
  const [courseOutlineRaw, setCourseOutlineRaw] = useState(
    "Chapter 1: Networking Today & Global Connections\nChapter 2: Basic Switch and End Device Configuration\nChapter 3: Protocols and Communication Models\nChapter 4: Physical Layer & Network Media\nChapter 5: Final Hands-On Verification Lab"
  );
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  // --- Security / Passcode State ---
  const [currentPin, setCurrentPin] = useState(getAdminPasscode());
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- Pathway Form State ---
  const [pathTitle, setPathTitle] = useState('');
  const [pathCareer, setPathCareer] = useState('');
  const [pathSalary, setPathSalary] = useState('PKR 250,000/mo');
  const [pathCert, setPathCert] = useState('');
  const [pathDesc, setPathDesc] = useState('');
  const [pathSelectedCourses, setPathSelectedCourses] = useState<string[]>([]);

  // --- Student Gradebook State ---
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStdName, setNewStdName] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdPhone, setNewStdPhone] = useState('');
  const [newStdRoll, setNewStdRoll] = useState('');
  const [newStdCourse, setNewStdCourse] = useState('Cisco Certified Network Associate (CCNA 200-301)');

  // --- Certificate Studio State ---
  const [certStdName, setCertStdName] = useState('Muhammad Ali Raza');
  const [certCourseTitle, setCertCourseTitle] = useState('Cisco Certified Network Associate (CCNA 200-301)');
  const [certCategory, setCertCategory] = useState('Networking');
  const [certGrade, setCertGrade] = useState<'Honors' | 'Distinction' | 'Pass'>('Distinction');
  const [certScore, setCertScore] = useState(98);
  const [certTemplate, setCertTemplate] = useState<'netacad-gold' | 'executive-blue' | 'cyber-dark'>('netacad-gold');
  const [certDirector, setCertDirector] = useState('Engr. Najeeb Ul Hussan');
  const [certInstructor, setCertInstructor] = useState('Lead NetAcad Instructor');
  const [certIssueDate, setCertIssueDate] = useState('September 2026');

  // --- Profile Form State ---
  const [profileName, setProfileName] = useState(profile.name);
  const [profileRank, setProfileRank] = useState(profile.rank);
  const [profileXp, setProfileXp] = useState(profile.xp);
  const [profileHours, setProfileHours] = useState(profile.studyHours);

  // --- Notification Toast ---
  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // --- Filtered Courses ---
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchCat = filterCategory === 'All' || c.category === filterCategory;
      const q = courseSearchQuery.toLowerCase().trim();
      const matchQuery = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [courses, filterCategory, courseSearchQuery]);

  // --- Filtered Students ---
  const filteredStudents = useMemo(() => {
    const q = studentSearchQuery.toLowerCase().trim();
    return students.filter(s => 
      !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.enrolledCourseTitle.toLowerCase().includes(q)
    );
  }, [students, studentSearchQuery]);

  // --- Save / Create Course ---
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim()) {
      alert("Please fill in Course Title and Description.");
      return;
    }

    const syllabusOutline = courseOutlineRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (editingCourseId) {
      editCourse(editingCourseId, {
        title: courseTitle.trim(),
        category: courseCategory,
        provider: courseProvider,
        description: courseDesc.trim(),
        difficulty: courseDiff,
        duration: courseDur.trim(),
        imageUrl: courseImageUrl.trim() || '/netacad-thumbnails/ccna-itn.png',
        deliveryMode: courseDeliveryMode || 'Online & On-Campus',
        modulesCount: syllabusOutline.length,
        badgeName: courseBadge.trim() || undefined,
        syllabusOutline,
      });
      triggerNotification(`✅ Course "${courseTitle.trim()}" updated successfully!`);
      setEditingCourseId(null);
    } else {
      const generatedId = `course-${Date.now()}`;
      const newCourse: Course = {
        id: generatedId,
        title: courseTitle.trim(),
        category: courseCategory,
        provider: courseProvider,
        description: courseDesc.trim(),
        difficulty: courseDiff,
        duration: courseDur.trim() || '15 hours',
        imageUrl: courseImageUrl.trim() || '/netacad-thumbnails/ccna-itn.png',
        deliveryMode: courseDeliveryMode || 'Online & On-Campus',
        modulesCount: syllabusOutline.length,
        badgeName: courseBadge.trim() || undefined,
        badgeColor: '#00F2FE',
        enrollmentStatus: 'not_enrolled',
        progress: 0,
        syllabusOutline,
      };
      addCourse(newCourse);
      triggerNotification(`🎉 New course "${courseTitle.trim()}" published to catalog!`);
    }

    handleResetForm();
  };

  const handleResetForm = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseDesc('');
    setCourseBadge('');
    setCourseDur('17 hours');
    setCourseCategory('Networking');
    setCourseProvider('NetAcad');
    setCourseDiff('Beginner');
    setCourseImageUrl('/netacad-thumbnails/ccna-itn.png');
    setCourseDeliveryMode('Online & On-Campus');
    setCourseOutlineRaw(
      "Chapter 1: Networking Today & Global Connections\nChapter 2: Basic Switch and End Device Configuration\nChapter 3: Protocols and Communication Models\nChapter 4: Physical Layer & Network Media\nChapter 5: Final Hands-On Verification Lab"
    );
  };

  const handleEditClick = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseCategory(course.category);
    setCourseProvider(course.provider);
    setCourseDesc(course.description);
    setCourseDiff(course.difficulty);
    setCourseDur(course.duration);
    setCourseImageUrl(course.imageUrl || '/netacad-thumbnails/ccna-itn.png');
    setCourseDeliveryMode(course.deliveryMode || 'Online & On-Campus');
    setCourseBadge(course.badgeName || '');
    setCourseOutlineRaw(
      Array.isArray(course.syllabusOutline) && course.syllabusOutline.length > 0
        ? course.syllabusOutline.join('\n')
        : "Chapter 1: Core Fundamentals & Theory\nChapter 2: Hands-on Lab Configuration\nChapter 3: Comprehensive Final Exam"
    );

    setActiveSubTab('courses');
    formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteCourse = (courseId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the course "${title}"?`)) {
      deleteCourse(courseId);
      triggerNotification(`🗑️ Course "${title}" removed.`);
    }
  };

  const handleDuplicateCourse = (courseId: string) => {
    const duplicated = duplicateCourse(courseId);
    if (duplicated) {
      triggerNotification(`📋 Course duplicated as "${duplicated.title}"!`);
      handleEditClick(duplicated);
    }
  };

  // --- AI Course Generation ---
  const handleGenerateWithAi = async () => {
    if (!aiPromptTopic.trim()) {
      alert("Please enter a course topic or concept.");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const generated = await aiService.generateCourseCurriculum(
        aiPromptTopic.trim(),
        aiCategoryHint,
        aiDifficultyHint,
        aiDurationHint
      );

      setCourseTitle(generated.title);
      setCourseCategory(generated.category);
      setCourseProvider(generated.provider);
      setCourseDesc(generated.description);
      setCourseDiff(generated.difficulty);
      setCourseDur(generated.duration);
      setCourseBadge(generated.badgeName);
      setCourseImageUrl(generated.imageUrl);
      setCourseDeliveryMode(generated.deliveryMode);
      setCourseOutlineRaw(generated.syllabusOutline.join('\n'));

      setIsAiModalOpen(false);
      setIsGeneratingAi(false);
      triggerNotification(`🤖 AI Curriculum Generated for "${generated.title}"! Review & click Publish below.`);
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      setIsGeneratingAi(false);
      alert("AI Generation failed: " + (err.message || String(err)));
    }
  };

  // --- Custom Image File Upload Handler ---
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size is too large (max 2MB). Please select a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCourseImageUrl(reader.result);
          triggerNotification("Custom thumbnail uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Catalog Backup Export & Import ---
  const handleExportCatalog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cyberai_catalog_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification("Catalog exported to JSON file!");
  };

  const handleImportCatalog = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            importCourses(parsed);
            triggerNotification(`Successfully imported ${parsed.length} courses!`);
          } else {
            alert("Invalid JSON structure. Expected an array of courses.");
          }
        } catch (err) {
          alert("Error parsing JSON file. Please ensure it is valid.");
        }
      };
      reader.readAsText(file);
    }
  };

  // --- Gradebook CSV Export ---
  const handleExportGradebookCsv = () => {
    const headers = ["Roll Number", "Student Name", "Email", "Phone", "Enrolled Program", "Progress (%)", "Attendance (%)", "Lab Score (%)", "Status", "Enrollment Date", "Certificate ID"];
    const rows = students.map(s => [
      s.rollNumber,
      `"${s.name}"`,
      s.email,
      s.phone,
      `"${s.enrolledCourseTitle}"`,
      s.progress,
      s.attendancePercent,
      s.labScore,
      s.status,
      s.enrollmentDate,
      s.certificateId || 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cyberai_student_gradebook_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    triggerNotification("Student gradebook exported to CSV!");
  };

  // --- Student Creation Handler ---
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName.trim() || !newStdEmail.trim()) {
      alert("Please fill in Student Name and Email.");
      return;
    }
    const newStudentItem: StudentRosterItem = {
      id: `std-${Date.now()}`,
      name: newStdName.trim(),
      email: newStdEmail.trim(),
      phone: newStdPhone.trim() || '+92 300 0000000',
      rollNumber: newStdRoll.trim() || `NH-2026-${Math.floor(100 + Math.random() * 900)}`,
      enrolledCourseTitle: newStdCourse,
      progress: 0,
      attendancePercent: 100,
      labScore: 90,
      status: 'Active',
      enrollmentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    addStudent(newStudentItem);
    setIsAddStudentOpen(false);
    setNewStdName('');
    setNewStdEmail('');
    setNewStdPhone('');
    setNewStdRoll('');
    triggerNotification(`🎓 Student "${newStudentItem.name}" enrolled in roster!`);
  };

  // --- Certificate Issue Handler ---
  const handleIssueNewCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStdName.trim() || !certCourseTitle.trim()) {
      alert("Please enter student name and course title.");
      return;
    }

    const certSerial = `NHIIT-${certCategory.substring(0, 4).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: IssuedCertificate = {
      id: certSerial,
      studentName: certStdName.trim(),
      courseTitle: certCourseTitle.trim(),
      courseCategory: certCategory,
      issueDate: certIssueDate || 'September 2026',
      issuer: 'Network Home Institute of Information Technology',
      directorName: certDirector.trim() || 'Engr. Najeeb Ul Hussan',
      instructorName: certInstructor.trim() || 'Lead NetAcad Instructor',
      grade: certGrade,
      score: Number(certScore) || 95,
      template: certTemplate,
      verificationHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    issueCertificate(newCert);
    triggerNotification(`🏆 Certificate #${certSerial} officially issued and registered for ${newCert.studentName}!`);
  };

  const handlePrintCert = () => {
    window.print();
  };

  // --- Password Management ---
  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);
    if (!newPin.trim()) {
      setPinChangeMsg({ type: 'error', text: 'Please enter a new passcode.' });
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setPinChangeMsg({ type: 'error', text: 'New Passcode and Confirmation do not match.' });
      return;
    }
    setAdminPasscode(newPin.trim());
    setCurrentPin(newPin.trim());
    setNewPin('');
    setConfirmPin('');
    setPinChangeMsg({ type: 'success', text: 'Admin passcode updated successfully!' });
    triggerNotification("🔒 Administrator Passcode changed!");
  };

  const handleLogout = () => {
    localStorage.removeItem('cyberai_admin_session');
    sessionStorage.removeItem('cyberai_admin_session');
    if (onLogout) {
      onLogout();
    } else if (onNavigateToTab) {
      onNavigateToTab('home2');
    } else {
      window.location.reload();
    }
  };

  // --- Google Sheets Webhook Handlers ---
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cybersmart_google_sheet_webhook', sheetWebhookUrl.trim());
    triggerNotification("Google Sheets Webhook URL saved successfully!");
  };

  const handleTestWebhook = async () => {
    if (!sheetWebhookUrl.trim()) {
      setTestWebhookResult("⚠️ Please enter a Webhook URL first.");
      return;
    }
    setIsTestingWebhook(true);
    setTestWebhookResult(null);
    try {
      await fetch(sheetWebhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: 'Cyber Smart: AI-Powered Digital World',
          event: 'ADMIN_TEST_CONNECTION',
          name: 'Administrator',
          phone: '+92-333-3017333',
          email: 'admin@cyberaiacademy.com',
          progress: '100% (Admin Test)',
          score: '100%',
          status: 'Connection Verified',
          timestamp: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
          action: 'Webhook connection ping from CyberAI Admin Portal'
        })
      });
      setTestWebhookResult("✅ Test row sent to your Google Sheet! Check your spreadsheet.");
    } catch (err: any) {
      setTestWebhookResult(`❌ Error testing webhook: ${err.message || 'Check URL'}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  // --- Pathway Handlers ---
  const handleSavePathway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathTitle.trim() || !pathCareer.trim() || pathSelectedCourses.length === 0) {
      alert("Please enter title, career, and select at least one course.");
      return;
    }

    const newPath: Pathway = {
      id: `pathway-${Date.now()}`,
      title: pathTitle.trim(),
      career: pathCareer.trim(),
      salary: pathSalary.trim(),
      certifications: pathCert.trim() || 'Cisco & Corvit Verifiable Certifications',
      courseIds: pathSelectedCourses,
      color: '#007A87',
      description: pathDesc.trim(),
      longDesc: pathDesc.trim(),
    };

    addPathway(newPath);
    triggerNotification("Career Pathway created successfully!");
    
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

  // --- Profile Handlers ---
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
    <div className="space-y-8 py-6 text-slate-800 font-sans text-left animate-fade-in" ref={formTopRef}>
      
      {/* 1. TOP EXECUTIVE ADMIN HEADER */}
      <section className="bg-gradient-to-r from-[#002D62] via-[#003D5C] to-[#005073] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-white/10 text-cyan-300 border border-white/20 uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Authorized Admin Console
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live CMS & Analytics Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Academy Management & Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-sans">
            AI course generator, official Cisco NetAcad thumbnail gallery, student gradebook & roster, and instant verifiable certificate studio.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg font-mono"
          >
            <Wand2 className="w-4 h-4 text-slate-950" /> AI Course Architect
          </button>

          <button 
            onClick={handleExportCatalog}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download full course catalog backup as JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" /> Export JSON
          </button>
          
          <label className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Upload className="w-3.5 h-3.5 text-cyan-300" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportCatalog} className="hidden" />
          </label>

          <button 
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Lock session and log out of Administrator Portal"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </section>

      {/* 2. NOTIFICATION TOAST */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2.5 max-w-xl mx-auto animate-fade-in shadow-md font-semibold">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. NAVIGATION TABS */}
      <section className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'courses' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" /> Courses & Thumbnails ({courses.length})
        </button>

        <button
          onClick={() => setActiveSubTab('gradebook')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'gradebook' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" /> Student Gradebook ({students.length})
        </button>

        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'certificates' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" /> Certificate Studio ({certificates.length})
        </button>

        <button
          onClick={() => setActiveSubTab('pathways')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pathways' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" /> Career Pathways ({pathways.length})
        </button>

        <button
          onClick={() => setActiveSubTab('sheets')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'sheets' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>📊</span> Google Sheets Sync
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'security' 
              ? 'bg-[#002D62] text-white shadow-md' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4 text-cyan-400" /> Security & Passcode
        </button>
      </section>

      {/* 4. SUBTAB VIEW: COURSES & THUMBNAILS */}
      {activeSubTab === 'courses' && (
        <div className="space-y-8">
          
          {/* COURSE EDITOR FORM */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#002D62]/10 text-[#002D62]">
                    <Edit2 className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-display font-extrabold text-slate-900">
                    {editingCourseId ? '✏️ Edit Existing Course' : '➕ Create / Publish New Course'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Configure course titles, thumbnails, syllabi, and delivery modes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md cursor-pointer font-mono"
                >
                  <Wand2 className="w-4 h-4" /> AI Generate
                </button>
                {editingCourseId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Left Column: Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g. Cisco Certified Network Associate (CCNA 200-301)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#007A87] text-slate-900 shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#007A87] text-slate-900"
                      >
                        <option value="Networking">Networking</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Programming">Programming</option>
                        <option value="Automation">Automation & DevOps</option>
                        <option value="IoT & Analytics">IoT & Data Analytics</option>
                        <option value="Operating Systems">Operating Systems & Linux</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Skill Level
                      </label>
                      <select
                        value={courseDiff}
                        onChange={(e) => setCourseDiff(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#007A87] text-slate-900"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced / Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Delivery Mode
                      </label>
                      <select
                        value={courseDeliveryMode}
                        onChange={(e) => setCourseDeliveryMode(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#007A87] text-slate-900"
                      >
                        <option value="Online & On-Campus">Online & On-Campus (Hybrid)</option>
                        <option value="Online">Online (Self-Paced / Remote)</option>
                        <option value="On-Campus">On-Campus (Instructor-Led Lab)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={courseDur}
                        onChange={(e) => setCourseDur(e.target.value)}
                        placeholder="e.g. 24 hours / 6 weeks"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#007A87] text-slate-900"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Course Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={courseDesc}
                      onChange={(e) => setCourseDesc(e.target.value)}
                      placeholder="Comprehensive overview of skills, technologies, and career outcomes..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#007A87] text-slate-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Badge / Certification Awarded
                    </label>
                    <input
                      type="text"
                      value={courseBadge}
                      onChange={(e) => setCourseBadge(e.target.value)}
                      placeholder="e.g. Cisco CCNA Network Specialist"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#007A87] text-slate-900"
                    />
                  </div>
                </div>

                {/* Right Column: Thumbnail & Syllabus */}
                <div className="space-y-4">
                  
                  {/* Thumbnail Selector */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#007A87]" /> Course Thumbnail Image
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="text-xs font-bold text-[#007A87] hover:text-[#005073] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Choose from 31 NetAcad Presets
                      </button>
                    </div>

                    {/* Image Preview & URL */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-full sm:w-44 aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative shrink-0 shadow-sm">
                        <img 
                          src={courseImageUrl || '/netacad-thumbnails/ccna-itn.png'} 
                          alt="Thumbnail Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute('src', '/netacad-thumbnails/ccna-itn.png');
                          }}
                        />
                      </div>
                      <div className="w-full space-y-2 text-xs">
                        <input
                          type="text"
                          value={courseImageUrl}
                          onChange={(e) => setCourseImageUrl(e.target.value)}
                          placeholder="/netacad-thumbnails/... or https://"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#007A87]"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-slate-500" /> Upload Custom Image
                          </button>
                          <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageFileUpload} 
                            className="hidden" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Modules Outline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Syllabus Outline / Chapters (One per line)
                    </label>
                    <textarea
                      rows={7}
                      value={courseOutlineRaw}
                      onChange={(e) => setCourseOutlineRaw(e.target.value)}
                      placeholder="Chapter 1: Intro&#10;Chapter 2: Protocols&#10;Chapter 3: Final Lab"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#007A87] text-slate-900 leading-relaxed"
                    />
                  </div>

                </div>

              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] hover:brightness-110 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingCourseId ? 'Save & Update Course' : 'Publish New Course'}</span>
                </button>
              </div>

            </form>
          </section>

          {/* COURSE INVENTORY TABLE & CATALOG MANAGER */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-display font-extrabold text-slate-900">
                  Active Course Inventory ({filteredCourses.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Search, edit thumbnails, duplicate, or delete courses.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={courseSearchQuery}
                  onChange={(e) => setCourseSearchQuery(e.target.value)}
                  placeholder="Search course title or ID..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#007A87] text-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'IoT & Analytics', 'Operating Systems'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-[#002D62] text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Courses Grid / Table */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((c) => (
                <div 
                  key={c.id} 
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                    <img 
                      src={c.imageUrl || '/netacad-thumbnails/ccna-itn.png'} 
                      alt={c.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#002D62]/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      {c.category}
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {c.difficulty}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1" title={c.title}>
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {c.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
                      <span>⏱️ {c.duration}</span>
                      <span className="text-[#007A87] font-bold">{c.deliveryMode || 'Online & On-Campus'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-[#002D62] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDuplicateCourse(c.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-all cursor-pointer"
                        title="Duplicate Course"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs transition-all cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>

        </div>
      )}

      {/* 5. SUBTAB VIEW: STUDENT GRADEBOOK & ROSTER */}
      {activeSubTab === 'gradebook' && (
        <div className="space-y-8">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                <span>Total Enrolled</span>
                <Users className="w-4 h-4 text-[#007A87]" />
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900">{students.length} Students</div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 100% Active Multan Campus
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                <span>Average Attendance</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900">
                {Math.round(students.reduce((acc, s) => acc + s.attendancePercent, 0) / (students.length || 1))}%
              </div>
              <div className="text-[11px] text-slate-500">Biometric Verified</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                <span>Avg Lab Score</span>
                <BarChart3 className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900">
                {Math.round(students.reduce((acc, s) => acc + s.labScore, 0) / (students.length || 1))}%
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">Passing Standards Met</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                <span>Graduates</span>
                <GraduationCap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900">
                {students.filter(s => s.status === 'Graduated').length} Certified
              </div>
              <div className="text-[11px] text-amber-600 font-bold">W3C Badges Issued</div>
            </div>
          </div>

          {/* Student Roster Table */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-display font-extrabold text-slate-900">
                  Student Gradebook & Enrollment Roster
                </h3>
                <p className="text-xs text-slate-500">
                  Track student attendance, progress, lab performance, and issue graduation credentials.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#007A87] hover:bg-[#005073] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Enroll Student
                </button>

                <button
                  onClick={handleExportGradebookCsv}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-sm">
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Search by student name, roll number, or course..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#007A87] text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Student & Roll No</th>
                    <th className="p-3.5">Enrolled Program</th>
                    <th className="p-3.5">Progress</th>
                    <th className="p-3.5">Attendance</th>
                    <th className="p-3.5">Lab Score</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{std.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{std.rollNumber} • {std.phone}</div>
                      </td>
                      <td className="p-3.5 max-w-[220px]">
                        <span className="font-semibold text-[#002D62] truncate block" title={std.enrolledCourseTitle}>
                          {std.enrolledCourseTitle}
                        </span>
                        <span className="text-[10px] text-slate-400">Enrolled: {std.enrollmentDate}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>{std.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${std.progress === 100 ? 'bg-emerald-500' : 'bg-[#007A87]'}`} 
                              style={{ width: `${std.progress}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {std.attendancePercent}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                          {std.labScore}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          std.status === 'Graduated' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {std.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {std.status !== 'Graduated' ? (
                          <button
                            onClick={() => {
                              updateStudent(std.id, { status: 'Graduated', progress: 100 });
                              setCertStdName(std.name);
                              setCertCourseTitle(std.enrolledCourseTitle);
                              setActiveSubTab('certificates');
                              triggerNotification(`Student ${std.name} marked 100% complete! Proceeding to certificate studio.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                          >
                            Graduate & Certify
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setCertStdName(std.name);
                              setCertCourseTitle(std.enrolledCourseTitle);
                              setActiveSubTab('certificates');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                          >
                            View Cert
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${std.name} from student roster?`)) {
                              deleteStudent(std.id);
                              triggerNotification(`Student record deleted.`);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>

        </div>
      )}

      {/* 6. SUBTAB VIEW: CERTIFICATE STUDIO & DESIGNER */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-8">
          
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left: Certificate Configuration Controls */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Award className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900">
                    Certificate Studio
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Issue, preview, and print verifiable student credentials.
                </p>
              </div>

              <form onSubmit={handleIssueNewCert} className="space-y-4 text-xs">
                
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={certStdName}
                    onChange={(e) => setCertStdName(e.target.value)}
                    placeholder="e.g. Muhammad Ali Raza"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Accredited Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={certCourseTitle}
                    onChange={(e) => setCertCourseTitle(e.target.value)}
                    placeholder="e.g. Cisco Certified Network Associate (CCNA 200-301)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Honors / Grade
                    </label>
                    <select
                      value={certGrade}
                      onChange={(e) => setCertGrade(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                    >
                      <option value="Distinction">Distinction (95%+)</option>
                      <option value="Honors">Honors (90%+)</option>
                      <option value="Pass">Pass (80%+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Final Score (%)
                    </label>
                    <input
                      type="number"
                      min={70}
                      max={100}
                      value={certScore}
                      onChange={(e) => setCertScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Visual Theme Template
                    </label>
                    <select
                      value={certTemplate}
                      onChange={(e) => setCertTemplate(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                    >
                      <option value="netacad-gold">NetAcad Official Gold</option>
                      <option value="executive-blue">Executive Classic Blue</option>
                      <option value="cyber-dark">Cyber AI Dark Hologram</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={certIssueDate}
                      onChange={(e) => setCertIssueDate(e.target.value)}
                      placeholder="e.g. September 2026"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Director Signature Name
                  </label>
                  <input
                    type="text"
                    value={certDirector}
                    onChange={(e) => setCertDirector(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div className="pt-3 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" /> Issue & Register Credential
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintCert}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>

              </form>
            </div>

            {/* Right: Real-time Live Certificate Canvas Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>Live Certificate Preview Canvas</span>
                <span className="text-[#007A87] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution Ready</span>
              </div>

              {/* CERTIFICATE DISPLAY FRAME */}
              <div className={`p-8 rounded-3xl border-4 shadow-2xl relative overflow-hidden transition-all ${
                certTemplate === 'cyber-dark' 
                  ? 'bg-slate-950 text-white border-cyan-500/40 shadow-cyan-950/50' 
                  : certTemplate === 'executive-blue'
                    ? 'bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 text-slate-900 border-[#002D62]'
                    : 'bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-slate-900 border-amber-600/60'
              }`}>
                
                {/* Certificate Inner Border */}
                <div className={`p-6 border-2 border-dashed rounded-2xl space-y-6 text-center relative ${
                  certTemplate === 'cyber-dark' ? 'border-cyan-400/30' : 'border-amber-600/40'
                }`}>
                  
                  {/* Header Crest */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 border shadow-sm">
                      <img src="/logo.png" alt="NHIIT" className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#007A87]">
                        Network Home Institute of IT • Cisco NetAcad Partner
                      </span>
                      <h4 className="text-lg font-display font-extrabold uppercase tracking-wide">
                        Certificate of Excellence & Completion
                      </h4>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                      <Award className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-2 py-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      This is to officially certify that
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#002D62] tracking-tight">
                      {certStdName || 'Student Name'}
                    </h2>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      has successfully satisfied all rigorous theoretical benchmarks, hands-on physical laboratory examinations, and graduation requirements for:
                    </p>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#007A87]">
                      {certCourseTitle || 'Course Title'}
                    </h3>
                  </div>

                  {/* Grade Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold font-mono">
                    <span>Grade: {certGrade} ({certScore}%)</span>
                    <span>•</span>
                    <span>Multan Campus</span>
                  </div>

                  {/* Signatures & Hash */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left items-end">
                    <div className="space-y-1">
                      <div className="border-b border-slate-400 pb-1 font-signature text-sm text-slate-800">
                        {certDirector}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Executive Director</div>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 mx-auto bg-slate-900 rounded-lg p-1 text-cyan-300 flex items-center justify-center">
                        <QrCode className="w-8 h-8" />
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">Scan to Verify</div>
                    </div>

                    <div className="space-y-1 text-right">
                      <div className="border-b border-slate-400 pb-1 font-signature text-sm text-slate-800">
                        {certInstructor}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Lead Instructor</div>
                    </div>
                  </div>

                  <div className="text-[9px] font-mono text-slate-400 text-center truncate">
                    Cryptographic Verification Hash: 0x8f4b7a1239c0e451b689a7f34e2c019d8841ae01
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* 7. SUBTAB VIEW: CAREER PATHWAYS */}
      {activeSubTab === 'pathways' && (
        <div className="space-y-8">
          
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="p-2 rounded-xl bg-[#002D62]/10 text-[#002D62]">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-display font-extrabold text-slate-900">
                  Career Pathway Architect
                </h2>
                <p className="text-xs text-slate-500">
                  Link multiple courses into high-paying enterprise technology career roadmaps.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePathway} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pathway Title *</label>
                  <input
                    type="text"
                    required
                    value={pathTitle}
                    onChange={(e) => setPathTitle(e.target.value)}
                    placeholder="e.g. AI-Powered SOC Analyst Track"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Job Role *</label>
                  <input
                    type="text"
                    required
                    value={pathCareer}
                    onChange={(e) => setPathCareer(e.target.value)}
                    placeholder="e.g. Tier-2 SOC Analyst / Threat Hunter"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expected Salary Bracket</label>
                  <input
                    type="text"
                    value={pathSalary}
                    onChange={(e) => setPathSalary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Certifications Aligned</label>
                  <input
                    type="text"
                    value={pathCert}
                    onChange={(e) => setPathCert(e.target.value)}
                    placeholder="e.g. Cisco CyberOps Associate + Splunk Core"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={pathDesc}
                  onChange={(e) => setPathDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select Included Courses ({pathSelectedCourses.length} selected)
                </label>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => togglePathCourseSelection(c.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                        pathSelectedCourses.includes(c.id) 
                          ? 'bg-[#007A87] text-white border-[#007A87]' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={pathSelectedCourses.includes(c.id)}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <span className="truncate font-semibold">{c.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#002D62] to-[#007A87] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Save & Publish Career Pathway
              </button>
            </form>
          </section>

          {/* Pathways List */}
          <div className="grid md:grid-cols-2 gap-6">
            {pathways.map((p) => (
              <div key={p.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
                    <div className="text-xs text-[#007A87] font-semibold">{p.career}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete pathway "${p.title}"?`)) {
                        deletePathway(p.id);
                        triggerNotification(`Pathway deleted.`);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700">{p.courseIds.length} Courses Linked</span>
                  <span className="font-mono font-bold text-emerald-600">{p.salary}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 8. SUBTAB VIEW: GOOGLE SHEETS SYNC */}
      {activeSubTab === 'sheets' && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-xl font-display font-extrabold text-slate-900">
                Google Sheets Real-Time Sync Webhook
              </h2>
              <p className="text-xs text-slate-500">
                Automatically post student enrollments, exam scores, and certificate verifications to your Google Sheet.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveWebhook} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Google Apps Script Webhook URL
              </label>
              <input
                type="url"
                required
                value={sheetWebhookUrl}
                onChange={(e) => setSheetWebhookUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#007A87]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#002D62] hover:bg-[#003D5C] text-white text-xs font-bold cursor-pointer"
              >
                Save Webhook URL
              </button>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isTestingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>{isTestingWebhook ? 'Sending Test...' : 'Test Webhook Connection'}</span>
              </button>
            </div>

            {testWebhookResult && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                {testWebhookResult}
              </div>
            )}
          </form>
        </section>
      )}

      {/* 9. SUBTAB VIEW: SECURITY & PASSCODE */}
      {activeSubTab === 'security' && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 max-w-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <span className="p-2 rounded-xl bg-[#002D62]/10 text-[#002D62]">
              <KeyRound className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-display font-extrabold text-slate-900">
                Administrator Security Settings
              </h2>
              <p className="text-xs text-slate-500">
                Change your secret PIN / Passcode for administrator access.
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePasscode} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">New Passcode / PIN</label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new admin PIN..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Confirm New Passcode</label>
              <input
                type="password"
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Re-enter new admin PIN..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono"
              />
            </div>

            {pinChangeMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                pinChangeMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {pinChangeMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#002D62] hover:bg-[#003D5C] text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Update Passcode
            </button>
          </form>
        </section>
      )}

      {/* AI COURSE ARCHITECT MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-800 space-y-5 animate-slide-up max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <Wand2 className="w-6 h-6 text-slate-950" />
              </div>
              <h3 className="text-xl font-display font-extrabold text-slate-900">
                AI Course & Lab Architect
              </h3>
              <p className="text-xs text-slate-500">
                Enter any emerging cybersecurity or networking concept to auto-generate a comprehensive Cisco NetAcad-aligned syllabus.
              </p>
            </div>

            {/* Topic Input */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Course Concept / Topic *
                </label>
                <input
                  type="text"
                  value={aiPromptTopic}
                  onChange={(e) => setAiPromptTopic(e.target.value)}
                  placeholder="e.g. AI-Powered Threat Hunting & Autonomous SIEM"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "AI in Offensive Cybersecurity",
                    "Post-Quantum Cryptography & TLS 1.3",
                    "Cisco SD-WAN & Multi-Cloud Routing",
                    "Zero Trust Identity Architecture",
                    "DevSecOps & Kubernetes Hardening"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAiPromptTopic(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 border border-slate-200 text-[11px] font-medium transition-all text-slate-700 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={aiCategoryHint}
                    onChange={(e) => setAiCategoryHint(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Networking">Networking</option>
                    <option value="Automation">Automation</option>
                    <option value="Programming">Programming</option>
                    <option value="Operating Systems">Operating Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Skill Level</label>
                  <select
                    value={aiDifficultyHint}
                    onChange={(e) => setAiDifficultyHint(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isGeneratingAi}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGeneratingAi ? 'Architecting Curriculum...' : 'Generate Full Course with AI'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ENROLL STUDENT MODAL */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-800 space-y-5 animate-slide-up">
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-slate-900">
                Enroll Student in Roster
              </h3>
              <p className="text-xs text-slate-500">
                Add a new active learner to the Multan campus gradebook.
              </p>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  placeholder="e.g. Bilal Hassan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newStdEmail}
                  onChange={(e) => setNewStdEmail(e.target.value)}
                  placeholder="bilal.hassan@networkhome.edu.pk"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newStdPhone}
                    onChange={(e) => setNewStdPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStdRoll}
                    onChange={(e) => setNewStdRoll(e.target.value)}
                    placeholder="NH-2026-CS-099"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Program</label>
                <select
                  value={newStdCourse}
                  onChange={(e) => setNewStdCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#007A87] hover:bg-[#005073] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Enroll Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NETACAD PRESETS GALLERY MODAL */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-extrabold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#007A87]" /> NetAcad Official Course Thumbnails
                </h3>
                <p className="text-xs text-slate-500">
                  Select any high-resolution thumbnail from Cisco Networking Academy catalog.
                </p>
              </div>
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-1.5 bg-white">
              {['All', 'Networking', 'Cybersecurity', 'Programming', 'Automation', 'Operating Systems', 'IoT & Analytics'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    galleryCategoryFilter === cat ? 'bg-[#002D62] text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="p-6 overflow-y-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {NETACAD_THUMBNAIL_PRESETS
                .filter(p => galleryCategoryFilter === 'All' || p.category === galleryCategoryFilter)
                .map((preset) => (
                  <div 
                    key={preset.path}
                    onClick={() => {
                      setCourseImageUrl(preset.path);
                      setIsGalleryModalOpen(false);
                      triggerNotification(`Selected thumbnail: ${preset.label}`);
                    }}
                    className={`group cursor-pointer rounded-2xl border-2 p-2.5 space-y-2 transition-all hover:scale-[1.02] hover:shadow-lg ${
                      courseImageUrl === preset.path ? 'border-[#007A87] bg-cyan-50/30' : 'border-slate-200 hover:border-[#007A87]/50'
                    }`}
                  >
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
                      <img 
                        src={preset.path} 
                        alt={preset.label} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {courseImageUrl === preset.path && (
                        <div className="absolute inset-0 bg-[#007A87]/40 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white text-[#007A87] flex items-center justify-center font-bold shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-xs text-slate-800 truncate" title={preset.label}>{preset.label}</span>
                      <span className="text-[9px] font-mono uppercase text-slate-400 shrink-0">{preset.category}</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Gallery
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export interface ChatMessage {
  sender: 'user' | 'mentor';
  text: string;
  time: string;
}

const SYSTEM_PROMPT = `
You are the "CyberAI Academy Mentor", an elite AI copilot for students studying Artificial Intelligence, network automation, and cybersecurity. 
You are deeply knowledgeable about Cisco Networking Academy (NetAcad) curriculum (CCNA, CyberOps Associate, DevNet Associate, Python Essentials).
Your mission is to help the user master these concepts by:
1. Explaining complex topics simply using technical details, diagrams, or analogies.
2. Writing or debugging automation scripts (Python, Ansible, Terraform).
3. Keeping your answers relatively concise, encouraging, and structured in Markdown.
4. Keeping context of the current student's status. The student's name is Alex Mercer.
`;

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
];

export interface GeneratedCourseData {
  title: string;
  category: 'Networking' | 'Cybersecurity' | 'Programming' | 'Automation' | 'IoT & Analytics' | 'Operating Systems';
  provider: 'CyberAI' | 'NetAcad' | 'Hybrid';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  badgeName: string;
  imageUrl: string;
  deliveryMode: 'Online & On-Campus' | 'Online' | 'On-Campus';
  syllabusOutline: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

class AiService {
  private getApiKey(): string {
    // Search Vite environment variables
    const envKey = (import.meta.env.VITE_GEMINI_API_KEY || 
                    import.meta.env.EXPO_PUBLIC_GEMINI_API_KEY ||
                    '');
    return envKey;
  }

  isLiveMode(): boolean {
    return !!this.getApiKey();
  }

  async getMentorResponse(userPrompt: string, history: ChatMessage[]): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return this.getSimulatedFallback(userPrompt);
    }

    // Prepare contents payload
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    let lastError = '';

    // Iterate through candidate models until one succeeds
    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return replyText;
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          lastError = errorData.error?.message || `HTTP ${response.status}`;
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    console.warn('Gemini API Fallback:', lastError);
    return this.getSimulatedFallback(userPrompt);
  }

  /**
   * Generates a complete Cisco NetAcad / CyberAI course outline using AI.
   */
  async generateCourseCurriculum(
    prompt: string, 
    categoryHint?: string, 
    difficultyHint?: 'Beginner' | 'Intermediate' | 'Advanced',
    durationHint?: string
  ): Promise<GeneratedCourseData> {
    const apiKey = this.getApiKey();
    if (apiKey) {
      try {
        const aiPrompt = `You are a Cisco Networking Academy (NetAcad) and Cyber AI Curriculum Architect.
Generate a comprehensive professional course curriculum based on the topic: "${prompt}".
Category preferred: ${categoryHint || 'Cybersecurity or Networking'}
Difficulty preferred: ${difficultyHint || 'Intermediate'}
Duration preferred: ${durationHint || '20 hours'}

Return ONLY a valid JSON object with the following exact structure:
{
  "title": "Clear, professional course title",
  "category": "Networking",
  "provider": "NetAcad",
  "description": "2-3 sentences comprehensive overview.",
  "difficulty": "Beginner",
  "duration": "24 hours",
  "badgeName": "Badge Name",
  "imageUrl": "/netacad-thumbnails/ccna-itn.png",
  "deliveryMode": "Online & On-Campus",
  "syllabusOutline": [
    "Chapter 1: Intro",
    "Chapter 2: Concept",
    "Chapter 3: Deep Dive",
    "Chapter 4: Configuration",
    "Chapter 5: Hands-on Lab",
    "Chapter 6: Capstone Project"
  ]
}`;

        for (const model of CANDIDATE_MODELS) {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
                generationConfig: { temperature: 0.5, maxOutputTokens: 1200 }
              })
            }
          );
          if (resp.ok) {
            const data = await resp.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);
              if (parsed.title && Array.isArray(parsed.syllabusOutline)) {
                parsed.imageUrl = this.pickBestThumbnail(parsed.category, parsed.title);
                return parsed;
              }
            }
          }
        }
      } catch (err) {
        console.warn('AI Course Generation fallback activated:', err);
      }
    }

    return this.generateSimulatedCourse(prompt, categoryHint, difficultyHint, durationHint);
  }

  /**
   * Generates interactive quiz questions for a given topic.
   */
  async generateQuizQuestions(topic: string, count: number = 4): Promise<QuizQuestion[]> {
    const apiKey = this.getApiKey();
    if (apiKey) {
      try {
        const prompt = `Generate ${count} high-quality multiple choice technical questions on "${topic}" for Cisco NetAcad & Cyber AI students.
Return ONLY a valid JSON array:
[
  {
    "id": "q1",
    "question": "Clear technical question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Detailed explanation."
  }
]`;

        for (const model of CANDIDATE_MODELS) {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.4, maxOutputTokens: 1200 }
              })
            }
          );
          if (resp.ok) {
            const data = await resp.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);
              if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Quiz generation fallback:', e);
      }
    }

    return this.getSimulatedQuiz(topic, count);
  }

  private pickBestThumbnail(category?: string, title?: string): string {
    const t = (title || '').toLowerCase();
    const c = (category || '').toLowerCase();

    if (t.includes('ethical') || t.includes('hack') || t.includes('ceh')) return '/netacad-thumbnails/ethical-hacker.png';
    if (t.includes('cyberops') || t.includes('soc')) return '/netacad-thumbnails/cyberops.png';
    if (t.includes('fortigate') || t.includes('firewall') || t.includes('threat')) return '/netacad-thumbnails/cyber-threat-management.png';
    if (t.includes('devnet') || t.includes('ansible') || t.includes('terraform')) return '/netacad-thumbnails/devnet.png';
    if (t.includes('aws') || t.includes('cloud')) return '/netacad-thumbnails/aws-cloud.png';
    if (t.includes('python')) return '/netacad-thumbnails/python-essentials-1.jpg';
    if (t.includes('linux') || t.includes('redhat')) return '/netacad-thumbnails/rhcsa-linux.png';
    if (t.includes('splunk') || t.includes('siem')) return '/netacad-thumbnails/splunk-intro.png';
    if (t.includes('iot') || t.includes('smart')) return '/netacad-thumbnails/intro-iot.png';
    if (t.includes('data') || t.includes('analytics')) return '/netacad-thumbnails/data-analytics.png';
    if (t.includes('ccnp')) return '/netacad-thumbnails/ccnp-enterprise.png';
    if (t.includes('switching') || t.includes('routing')) return '/netacad-thumbnails/ccna-srwe.png';
    if (t.includes('network') || c.includes('network')) return '/netacad-thumbnails/ccna-itn.png';
    if (c.includes('cyber')) return '/netacad-thumbnails/cybersecurity-essentials.png';
    if (c.includes('prog')) return '/netacad-thumbnails/python-essentials-2.jpg';
    if (c.includes('auto')) return '/netacad-thumbnails/network-automation.png';
    return '/netacad-thumbnails/ccna-itn.png';
  }

  private generateSimulatedCourse(
    topic: string, 
    catHint?: string, 
    diffHint?: 'Beginner' | 'Intermediate' | 'Advanced',
    durHint?: string
  ): GeneratedCourseData {
    const raw = topic.trim();
    const lower = raw.toLowerCase();
    
    let category: GeneratedCourseData['category'] = (catHint as any) || 'Cybersecurity';
    let difficulty: GeneratedCourseData['difficulty'] = diffHint || 'Intermediate';
    let duration = durHint || '20 hours';
    let title = raw;
    let badgeName = `${raw} Specialist`;
    let chapters: string[] = [];

    if (lower.includes('ai') || lower.includes('artificial') || lower.includes('llm') || lower.includes('machine learning')) {
      category = 'Cybersecurity';
      title = raw.startsWith('AI') ? raw : `AI in ${raw}`;
      badgeName = 'AI Defense & Security Architect';
      duration = '24 hours';
      chapters = [
        "Chapter 1: Foundations of Artificial Intelligence & Machine Learning in IT",
        "Chapter 2: Adversarial Attacks, Prompt Injections & Model Poisoning Vectors",
        "Chapter 3: Securing LLMs & Agentic AI Architectures (OWASP LLM Top 10)",
        "Chapter 4: Deploying AI-Powered SIEM & Autonomous Threat Hunting",
        "Chapter 5: Automated Anomaly Detection with Scikit-Learn & PyTorch",
        "Chapter 6: Hands-On Multan Campus Lab: Deploying AI Network Intrusion Detection",
        "Chapter 7: Final Capstone: Autonomous Red Team vs. Blue Team AI Simulation"
      ];
    } else if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure') || lower.includes('devops')) {
      category = 'Automation';
      title = raw.includes('Cloud') ? raw : `Enterprise Cloud Security & ${raw}`;
      badgeName = 'Cloud Security & DevOps Practitioner';
      duration = '28 hours';
      chapters = [
        "Chapter 1: Cloud Architecture, Shared Responsibility Model & Zero Trust",
        "Chapter 2: Identity & Access Management (IAM) Least-Privilege Policies",
        "Chapter 3: Infrastructure as Code (IaC) Security with Terraform & Sentinel",
        "Chapter 4: Container & Kubernetes Cluster Security (K8s Hardening)",
        "Chapter 5: CI/CD Pipeline DevSecOps & Automated Vulnerability Scanning",
        "Chapter 6: Hands-On Multan Campus Lab: Securing AWS VPC & GuardDuty SIEM",
        "Chapter 7: Final Capstone: Zero-Trust Multi-Cloud Architecture Deployment"
      ];
    } else if (lower.includes('ethic') || lower.includes('hack') || lower.includes('pen') || lower.includes('red team')) {
      category = 'Cybersecurity';
      title = raw.includes('Ethical') ? raw : `Advanced Ethical Hacking & ${raw}`;
      badgeName = 'Certified Offensive Security Specialist';
      duration = '32 hours';
      chapters = [
        "Chapter 1: Offensive Security Methodologies & Reconnaissance (OSINT)",
        "Chapter 2: Network Scanning, Port Analysis & Vulnerability Mapping with Nmap",
        "Chapter 3: Web Application Exploitation (SQLi, XSS, SSRF, CSRF)",
        "Chapter 4: Active Directory Attacks & Lateral Movement Techniques",
        "Chapter 5: Privilege Escalation on Linux & Windows Enterprise Rigs",
        "Chapter 6: Hands-On Multan Campus Lab: Exploiting & Patching Vulnerable Server",
        "Chapter 7: Final Red Teaming Challenge: Corporate Network Takeover & Remediation"
      ];
    } else if (lower.includes('cisco') || lower.includes('switch') || lower.includes('rout') || lower.includes('network') || lower.includes('ospf')) {
      category = 'Networking';
      title = raw.includes('Cisco') ? raw : `Cisco Enterprise Networking: ${raw}`;
      badgeName = 'Cisco Enterprise Routing Master';
      duration = '30 hours';
      chapters = [
        "Chapter 1: Enterprise Network Architecture & High Availability Design",
        "Chapter 2: Advanced OSPFv2 / OSPFv3 Multi-Area Routing & Tuning",
        "Chapter 3: Border Gateway Protocol (BGP) Peering & Path Selection",
        "Chapter 4: Enterprise Switching: STP, RSTP, MSTP & EtherChannel Optimization",
        "Chapter 5: Quality of Service (QoS) Queuing, Policing & Traffic Shaping",
        "Chapter 6: Hands-On Multan Campus Lab: Configuring Cisco Core 4331 & 2960 Racks",
        "Chapter 7: Final Practical Exam: Enterprise Backbone Failover Troubleshooting"
      ];
    } else {
      chapters = [
        `Chapter 1: Introduction to ${raw} & Core Industry Principles`,
        `Chapter 2: Architecture, Protocols & Fundamental Frameworks`,
        `Chapter 3: Configuration, Implementation & Best Practice Standards`,
        `Chapter 4: Threat Modeling, Vulnerability Assessment & Mitigation`,
        `Chapter 5: Automation, Scripting & Real-World Integration`,
        `Chapter 6: Hands-On Multan Campus Lab: Practical Execution & Verification`,
        `Chapter 7: Final Comprehensive Certification Project & Oral Defense`
      ];
    }

    return {
      title,
      category,
      provider: 'NetAcad',
      description: `Comprehensive industry-aligned program covering ${raw}. Students master theoretical concepts, execute physical hardware & software labs at the Multan campus, and earn an industry-recognized certification badge.`,
      difficulty,
      duration,
      badgeName,
      imageUrl: this.pickBestThumbnail(category, title),
      deliveryMode: 'Online & On-Campus',
      syllabusOutline: chapters
    };
  }

  private getSimulatedQuiz(topic: string, count: number): QuizQuestion[] {
    const defaultQuizzes: QuizQuestion[] = [
      {
        id: 'q1',
        question: 'Which routing protocol uses Dijkstra\'s Shortest Path First (SPF) algorithm and supports hierarchical area design?',
        options: ['RIPv2 (Routing Information Protocol)', 'OSPF (Open Shortest Path First)', 'EIGRP (Enhanced Interior Gateway)', 'BGP (Border Gateway Protocol)'],
        correctIndex: 1,
        explanation: 'OSPF is a link-state routing protocol that utilizes Dijkstra\'s SPF algorithm to calculate loop-free shortest paths and organizes networks into Area 0 (Backbone) and normal areas.'
      },
      {
        id: 'q2',
        question: 'What is the primary mechanism used in Zero-Trust Architecture to ensure security across enterprise networks?',
        options: ['Implicit trust based on corporate IP subnet', 'Continuous authentication & least-privilege authorization for every request', 'Single perimeter firewall at the border router', 'Disabling all encrypted TLS traffic for deep packet inspection'],
        correctIndex: 1,
        explanation: 'Zero-Trust operates under the principle of "Never Trust, Always Verify", requiring strict identity verification and microsegmentation regardless of where the traffic originates.'
      },
      {
        id: 'q3',
        question: 'In Python network automation, which library is specifically engineered to establish multi-vendor SSH connections to Cisco IOS, Arista EOS, and Juniper JunOS devices?',
        options: ['Requests', 'Netmiko / Paramiko', 'Pandas', 'Flask'],
        correctIndex: 1,
        explanation: 'Netmiko (built on top of Paramiko) is the industry standard Python library for SSH automation across network devices with built-in command handling and prompt detection.'
      },
      {
        id: 'q4',
        question: 'Which layer of the OSI model does an ASA Stateful Firewall inspect to maintain session state tables (TCP SYN/ACK sequence tracking)?',
        options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 4 (Transport) and Layer 3 (Network)', 'Layer 7 only (Application)'],
        correctIndex: 2,
        explanation: 'Stateful firewalls inspect Layer 3 (IP addresses) and Layer 4 (TCP/UDP port numbers, SYN/ACK sequence flags) to allow return traffic automatically through dynamic state tables.'
      }
    ];

    return defaultQuizzes.slice(0, count);
  }

  private getSimulatedFallback(userPrompt: string): string {
    const p = userPrompt.toLowerCase();
    if (p.includes('subnet')) {
      return `**Subnetting Breakdown:**\n\nA /24 network provides 256 IP addresses (254 usable for hosts). Dividing a /24 into two /25 subnets gives 128 addresses each (126 usable).\n- **Subnet 1:** 192.168.1.0/25 (Host Range: .1 to .126)\n- **Subnet 2:** 192.168.1.128/25 (Host Range: .129 to .254)`;
    }
    if (p.includes('jailbreak') || p.includes('prompt')) {
      return `**Prompt Injection & Security:**\n\nPrompt Injection occurs when untrusted user input alters the intended behavior of an LLM. To defend your AI applications:\n1. Use strict System Prompts.\n2. Sanitize and quote user inputs.\n3. Deploy guardrail models (like Llama Guard or NeMo Guardrails).`;
    }
    if (p.includes('ansible') || p.includes('terraform')) {
      return `**Ansible vs. Terraform:**\n\n- **Ansible:** Configuration Management tool. Agentless, uses YAML & SSH. Perfect for configuring Cisco IOS switches, OS patches, and application setups.\n- **Terraform:** Infrastructure as Code (IaC) tool. Declarative state management, ideal for provisioning cloud VPCs, VMs, and security groups.`;
    }
    return `Great question! In modern AI and cybersecurity engineering, the key is combining automated infrastructure playbooks (Ansible/Terraform) with continuous monitoring and least-privilege security. Try running a script in our **LMS Player** or **Cyber Lab Sandbox**!`;
  }
}

export const aiService = new AiService();

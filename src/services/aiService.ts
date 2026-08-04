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
      return `[OFFLINE MODE] Please configure a valid Gemini API key to enable live AI responses.`;
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

    // Fallback response if API key is invalid/expired or models return 404
    console.warn('Gemini API Fallback:', lastError);
    return this.getSimulatedFallback(userPrompt);
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
    return `Great question! In modern AI and cybersecurity engineering, the key is combining automated infrastructure playbooks (Ansible/Terraform) with continuous monitoring and least-privilege security. Try running a script in our **LMS Player** code sandbox!`;
  }
}

export const aiService = new AiService();

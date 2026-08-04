import React, { useState, useRef, useEffect } from 'react';
import { useAcademyStore } from '@/services/academyState';
import { Cpu, Send, Info, MessageSquare, Terminal } from 'lucide-react';

export default function MentorView() {
  const { chatLogs, sendChatMessage } = useAcademyStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInput('');
    setIsTyping(true);
    await sendChatMessage(text);
    setIsTyping(false);
  };

  const suggestions = [
    'Explain Subnetting',
    'What is Prompt Injection?',
    'Ansible vs Terraform',
    'How does OSPF work?',
    'Write a Python port scanner',
    'Explain Zero Trust Architecture',
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between py-6 text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accentPurple/10 rounded-full flex items-center justify-center text-accentPurple">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-md font-display font-bold text-slate-900">CyberAI Academy Mentor</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
                <span className="text-[9px] font-mono text-accentGreen font-bold uppercase tracking-wider">AI Copilot Online</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] uppercase font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            Gemini 1.5 Flash Connected
          </span>
        </div>
        <p className="text-xs text-slate-650 leading-normal">
          Your active study assistant. Trained on Cisco NetAcad curricula, DevSecOps models, and cloud-automation templates.
        </p>
      </div>

      {/* CHAT MESSAGES SCROLL LOG */}
      <div className="flex-1 overflow-y-auto my-4 pr-2 space-y-4">
        {chatLogs.length === 1 && (
          <div className="bg-white border border-slate-200/80 p-8 rounded-2xl max-w-lg mx-auto text-center space-y-4 my-8 shadow-sm">
            <div className="w-12 h-12 bg-accentCyan/10 text-accentCyan rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-slate-900">Ask me anything about Cybersecurity & AI</h3>
              <p className="text-xs text-slate-500">
                I can explain concepts, write code snippets, debug automation playbooks, and quiz you on networking essentials.
              </p>
            </div>
          </div>
        )}

        {chatLogs.map((msg, index) => {
          const isMentor = msg.sender === 'mentor';
          return (
            <div key={index} className={`flex ${isMentor ? 'justify-start' : 'justify-end'}`}>
              <div 
                className={`max-w-[75%] px-4 py-3 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                  isMentor 
                    ? 'bg-white border-slate-200 border-l-2 border-l-accentCyan rounded-tl-sm text-slate-700 shadow-sm' 
                    : 'bg-accentPurple text-white border-accentPurple/20 rounded-tr-sm shadow-sm'
                }`}
              >
                {/* Parse Markdown-like tags (bold and lists) safely */}
                <div className="whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, lIdx) => {
                    let formattedLine = line;
                    // Mocks bullet styling
                    if (formattedLine.startsWith('- ') || formattedLine.startsWith('* ')) {
                      return (
                        <div key={lIdx} className="flex gap-2 pl-2 py-0.5">
                          <span className="text-accentCyan font-bold">•</span>
                          <span>{formattedLine.substring(2)}</span>
                        </div>
                      );
                    }
                    return <div key={lIdx}>{formattedLine}</div>;
                  })}
                </div>
                <span className={`block text-[8px] text-right pt-1 font-mono ${isMentor ? 'text-slate-400' : 'text-white/60'}`}>{msg.time}</span>
              </div>
            </div>
          );
        })}

        {/* TYPING DOTS STREAMING INDICATOR */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 border-l-2 border-l-accentCyan px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-accentCyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-accentCyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-accentCyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK SUGGESTIONS CHIPS */}
      <div className="flex flex-wrap gap-2 shrink-0 py-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSend(s)}
            className="text-[10px] px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-350 transition-all font-mono shadow-sm cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* INPUT MESSAGE CHAT BAR */}
      <div className="flex gap-3 pt-3 shrink-0 border-t border-slate-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your NetAcad lessons..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          className="flex-1 bg-white text-slate-800 border border-slate-200 rounded-full px-5 py-3 text-xs focus:outline-none focus:border-accentCyan focus:ring-1 focus:ring-accentCyan"
        />
        <button
          onClick={() => handleSend(input)}
          className="w-11 h-11 bg-accentCyan hover:bg-accentCyan/90 rounded-full flex items-center justify-center text-white hover:scale-105 transition-all shadow-glow shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4 ml-0.5 text-white" />
        </button>
      </div>

    </div>
  );
}

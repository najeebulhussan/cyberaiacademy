import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export default function WhatsAppWidget() {
  const phoneNumber = '923348632929';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    'Hello Network Home Institute Multan! I would like to inquire about admissions and course schedules.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group cursor-pointer border-2 border-white"
      title="Chat with Network Home Multan Admissions"
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold font-sans pr-1">
        Multan Campus Chat
      </span>
    </a>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm DevCanvas Assistant. Ask me anything about building portfolios, exporting code, or running your site locally.",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I could not process that.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // The landing and auth pages are self-contained; no floating chat there.
  if (pathname === '/' || pathname === '/signin' || pathname === '/signup') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 bg-[#8A5A2B] text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(138,90,43,0.4)] hover:shadow-[0_0_45px_rgba(138,90,43,0.6)] transition-all duration-200"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X size={20} strokeWidth={2} />
        ) : (
          <MessageCircle size={20} strokeWidth={2} />
        )}
      </motion.button>

      {/* Chat popup */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="w-[380px] h-[520px] bg-[#F7EFE2] border border-[#D6A15F]/40 rounded-2xl shadow-[0_0_50px_rgba(10,4,2,0.3)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#8A5A2B] text-white p-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle size={18} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold leading-tight">DevCanvas Assistant</h4>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'ml-auto text-right'
                    : 'mr-auto text-left'
                }`}
              >
                <div
                  className={`inline-block px-4 py-3 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#8A5A2B] text-white rounded-tr-none'
                      : 'bg-[#FFFFFF] border border-[#D6A15F]/30 text-[#2E180E] rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="mr-auto flex items-center gap-2 text-[10px] text-[#8A5A3A]/60 font-mono uppercase animate-pulse">
                <Loader2 size={14} className="animate-spin" />
                typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSend} className="p-3 bg-[#FFFFFF] border-t border-[#D6A15F]/30 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about portfolios, zip export, deploy..."
              className="flex-1 px-4 py-3 bg-[#F7EFE2]/50 border border-[#D6A15F]/40 rounded-full text-[#2E180E] text-xs placeholder:text-[#8A5A3A]/50 outline-none focus:border-[#8A5A2B] focus:ring-1 focus:ring-[#8A5A2B] font-mono"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-[#8A5A2B] text-white rounded-full flex items-center justify-center hover:bg-[#A65A3A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}

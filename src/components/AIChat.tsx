import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Download, Copy, Image as ImageIcon, Code, ArrowDown, Trash2, Command } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'bot';
  content: string;
  type?: 'text' | 'image' | 'code';
  timestamp: number;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: "Cortex Assistant Online. System ready for technical queries.", 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const sysPrompt = "You are Cortex Assistant, a professional high-performance utility AI. Provide technical, direct, and precise answers. No advertising. Support markdown. Use professional terminology. If the user asks for code, provide it in code blocks. If the user asks for an image, strictly use markdown format ![image](https://pollinations.ai/p/prompt?width=1024&height=1024&nologo=true).";
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(input)}?model=openai&system=${encodeURIComponent(sysPrompt)}`);
      const data = await response.text();

      setMessages(prev => [...prev, {
        role: 'bot',
        content: data,
        timestamp: Date.now()
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Potential toast logic
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">AI Assistant</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMessages([messages[0]])} className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white/60 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 no-scrollbar scroll-smooth">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={i}
            className={cn(
              "flex items-start gap-4",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg border",
              msg.role === 'user' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-500" : "bg-white/5 border-white/10 text-white/40"
            )}>
              {msg.role === 'user' ? <User size={18} /> : <Command size={18} />}
            </div>
            <div className={cn(
              "max-w-[85%] space-y-2",
              msg.role === 'user' ? "text-right" : "text-left"
            )}>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-cyan-500 text-black font-medium" : "bg-white/[0.02] border border-white/5 text-white/90"
              )}>
                <ReactMarkdown className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl">
                  {msg.content}
                </ReactMarkdown>
              </div>
              <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-white/20">
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                {msg.role === 'bot' && (
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(msg.content)} className="hover:text-cyan-500 transition-colors flex items-center gap-1">
                      <Copy size={10} /> Copy
                    </button>
                    {(msg.content.includes('![') || msg.content.includes('https://pollinations.ai')) && (
                        <button 
                          onClick={async () => {
                            const match = msg.content.match(/\((https:\/\/pollinations\.ai\/p\/[^)]+)\)/);
                            if (match) {
                              const url = match[1];
                              const response = await fetch(url);
                              const blob = await response.blob();
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(blob);
                              link.download = `necro_extraction_${Date.now()}.png`;
                              link.click();
                            }
                          }}
                          className="hover:text-cyan-500 transition-colors flex items-center gap-1"
                        >
                            <Download size={10} /> Download
                        </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-4 text-cyan-500 animate-pulse">
            <Bot size={18} className="animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Analyzing Request...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/40">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-cyan-500/40 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Initialize command..."
            className="flex-1 bg-transparent border-none outline-none py-2 text-sm font-mono placeholder:text-white/10"
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Paperclip, Trash2, FileText, FileCode, Archive, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
  files?: Array<{ name: string; type: string }>;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('necro-chat-history');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('necro-chat-history', JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
      files: attachedFiles.map(f => ({ name: f.name, type: f.type })),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(input)}?model=openai&system=${encodeURIComponent("You are NecroCore, a high-performance utility AI kernel. Provide technical, direct, and precise extraction logic. Support markdown. No simulations or demos, real technical analysis only.")}`);
      const data = await response.text();
      
      const botMsg: Message = {
        role: 'bot',
        content: data,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: `System Error: ${err instanceof Error ? err.message : 'Connectivity failed'}. Please try again.`, timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('Clear neural history?')) {
      setMessages([]);
      localStorage.removeItem('necro-chat-history');
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] glass-card">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Bot size={18} className="text-cyan-500" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Neural Engine Kernel</h2>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-cyan-500 animate-pulse" />
              <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Protocol Active</span>
            </div>
          </div>
        </div>
        <button onClick={clearHistory} className="p-2 hover:bg-white/5 rounded-sm text-white/20 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#050505]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
            <Bot size={48} className="mb-4" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-black italic">Awaiting Directive Input</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[75%] group`}>
              <div className={`p-5 rounded-sm border ${
                msg.role === 'user' 
                  ? 'bg-white/5 border-white/20 text-white' 
                  : 'bg-black border-cyan-500/20 text-white/90'
              }`}>
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {msg.files.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-[8px] font-black uppercase tracking-widest">
                        {f.name.endsWith('.zip') ? <Archive size={10}/> : f.type.includes('text') ? <FileText size={10}/> : <FileCode size={10}/>}
                        {f.name}
                      </div>
                    ))}
                  </div>
                )}
                <div className="markdown-body prose prose-invert prose-xs max-w-none text-xs leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              <div className={`mt-2 text-[8px] font-black uppercase tracking-[0.2em] px-1 ${msg.role === 'user' ? 'text-right text-white/20' : 'text-left text-cyan-500/40'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // {msg.role}_protocol
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black border border-cyan-500/20 p-4 rounded-sm">
              <div className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-500 animate-[bounce_1s_infinite_0ms]" />
                <div className="w-1 h-1 bg-cyan-500 animate-[bounce_1s_infinite_200ms]" />
                <div className="w-1 h-1 bg-cyan-500 animate-[bounce_1s_infinite_400ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-black border-t border-white/10 space-y-4">
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-[9px] font-black uppercase tracking-widest">
                <FileText size={12} className="text-cyan-500" />
                {f.name}
                <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 hover:border-white/30 transition-all text-white/40"
          >
            <Paperclip size={18} />
          </button>
          <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFile} />
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Neural Directive Entry..."
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-cyan-500/50 font-mono text-xs text-white uppercase tracking-wider placeholder:text-white/10"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="px-6 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-cyan-500 transition-all active:scale-[0.98] disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

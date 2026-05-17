import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Send, User, Trash2, Shield, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function GroupChat() {
  const [messages] = useState([
    { user: 'Admin_Necro', content: 'Protocol Update V5.0 successfully deployed to all nodes.', time: '10:45', role: 'admin' },
    { user: 'Void_Seeker', content: 'Anyone has the latest JWT debugger patch?', time: '11:02', role: 'user' },
    { user: 'Shadow_Operator', content: 'Check the Dashboard > Security Node.', time: '11:15', role: 'user' },
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Community_Nexus_Mesh</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 text-[8px] font-black uppercase text-white/20">
             <Users size={12} /> 1.2K Active
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className="flex items-start gap-4"
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
              msg.role === 'admin' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-500" : "bg-white/5 border-white/10 text-white/20"
            )}>
              {msg.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
            </div>
            <div className="space-y-1 group">
               <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    msg.role === 'admin' ? "text-cyan-500" : "text-white/40"
                  )}>{msg.user}</span>
                  <span className="text-[8px] font-mono text-white/10">{msg.time}</span>
               </div>
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl rounded-tl-none text-sm text-white/70 max-w-xl group-hover:bg-white/[0.04] transition-colors">
                  {msg.content}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/40">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 opacity-40 pointer-events-none">
          <input
            placeholder="Broadcast restricted to verified nodes..."
            className="flex-1 bg-transparent border-none outline-none py-2 text-sm font-mono placeholder:text-white/10"
          />
          <button className="p-2 bg-white/10 text-white/20 rounded-lg">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

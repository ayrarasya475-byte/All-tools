import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Database, 
  Zap, 
  Activity, 
  ChevronRight, 
  Lock,
  Users,
  Globe,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Firewall } from '../core/Firewall';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigateTools: (tab: string) => void;
}

export default function Dashboard({ onNavigateTools }: DashboardProps) {
  const { profile } = useAuth();
  const [networkState, setNetworkState] = useState(Firewall.getActiveNetworkState());

  useEffect(() => {
    const timer = setInterval(() => {
      setNetworkState(Firewall.getActiveNetworkState());
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'System Uptime', value: '99.99%', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Security Layer', value: 'Active', icon: Shield, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'System Load', value: '12%', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Network Nodes', value: '1,284', icon: Globe, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const popularTools = [
    { name: 'JSON Formatter', id: 'json-fmt', icon: Database, desc: 'Syntax Beautifier' },
    { name: 'IP Lookup', id: 'ip-lookup', icon: Globe, desc: 'Geographic Data' },
    { name: 'PassGen', id: 'pass-gen', icon: Lock, desc: 'Security Keys' },
    { name: 'SHA-256', id: 'sha256', icon: Lock, desc: 'Cryptographic Hash' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Cortex Terminal</h2>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
            Welcome, <span className="text-cyan-500">{profile?.displayName?.split(' ')[0] || 'Node'}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
           <div className="text-right">
             <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Global Connectivity</p>
             <p className="text-xs font-mono text-cyan-500 uppercase font-bold tracking-tighter">Synchronized_01</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Zap size={18} className="animate-pulse" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Tools Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Expedited Access</h3>
            <button onClick={() => onNavigateTools('tools')} className="text-[8px] font-black text-cyan-500 uppercase flex items-center gap-1 group">
               Terminal_Suite <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {popularTools.map((tool, i) => (
               <button
                 key={i}
                 onClick={() => onNavigateTools('tools')}
                 className="glass-card p-6 flex flex-col gap-4 group hover:bg-white/[0.04] transition-all text-left border-white/5 hover:border-cyan-500/20"
               >
                 <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-cyan-500 transition-colors w-fit">
                    <tool.icon size={20} />
                 </div>
                 <div>
                   <p className="text-sm font-black uppercase tracking-tighter truncate">{tool.name}</p>
                   <p className="text-[8px] text-white/20 uppercase font-mono mt-1">{tool.desc}</p>
                 </div>
               </button>
             ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Audit Log</h3>
            <span className="text-[8px] font-mono text-cyan-500/50">Real-time Stream</span>
          </div>
          <div className="glass-card p-6 h-full min-h-[300px] flex flex-col">
             <div className="space-y-4 flex-1">
                {[
                  { time: '02:44:01', msg: 'User Auth Success', level: 'low' },
                  { time: '03:12:55', msg: 'Config Sync Ready', level: 'low' },
                  { time: '04:11:20', msg: 'Block CSRF attempt', level: 'high' }
                ].map((alert, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">
                    <div className={cn("w-1 h-8 rounded-full", alert.level === 'high' ? "bg-red-500" : "bg-cyan-500/20")} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                         <p className="text-[8px] font-mono text-white/20">{alert.time}</p>
                         {alert.level === 'high' && <span className="text-[6px] font-black bg-red-500/20 text-red-500 px-1 rounded">CRIT</span>}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-tight text-white/70 mt-0.5">{alert.msg}</p>
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-6 pt-6 border-t border-white/5">
                <button onClick={() => onNavigateTools('group')} className="w-full flex items-center justify-between p-4 bg-cyan-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 active:scale-95 transition-all">
                   <span>Multi-user Space</span>
                   <Users size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Connectivity Banner */}
      <div className="glass-card p-8 border-cyan-500/10 overflow-hidden relative">
         <Globe size={120} className="absolute -right-10 -bottom-10 text-cyan-500/5 rotate-12" />
         <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Global Node Connectivity</h3>
            <p className="text-[10px] text-white/30 uppercase font-mono max-w-sm leading-relaxed">
              Your identity is currently distributed across 1,284 active nodes. Synchronized data packets are being rotated every 2.4 seconds for maximum entropy and security.
            </p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Asia_SE_1</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Europe_West</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                 <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Active_Sync</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

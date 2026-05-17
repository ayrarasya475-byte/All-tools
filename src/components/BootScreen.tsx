import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Activity, Database, Lock } from 'lucide-react';

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "Initializing System BIOS V5.0.0...",
    "Checking Hardware Integrity...",
    "Loading Kernel Modules...",
    "Starting Security Subsystem...",
    "Mounting Secure Storage...",
    "Establishing Network Uplink...",
    "Allocating Virtual Memory...",
    "Decrypting Configuration...",
    "Synchronizing Database...",
    "System Ready."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
        setProgress((currentLog / bootLogs.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-6 font-mono">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex justify-center mb-12">
          <motion.div
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-2 border-cyan-500/50 rounded-lg flex items-center justify-center relative"
          >
            <Shield className="text-cyan-500" size={40} />
            <div className="absolute -inset-2 border border-cyan-500/20 rounded-lg animate-pulse" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-cyan-500/50 uppercase tracking-widest">
            <span>System Boot Sequence</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-black/50 border border-white/5 rounded-lg p-4 h-48 overflow-y-auto scrolling-touch no-scrollbar space-y-1">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] text-white/40 flex gap-2"
              >
                <span className="text-cyan-500/50">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-white/60">{log}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-6 opacity-20">
          <Cpu size={14} />
          <Activity size={14} />
          <Database size={14} />
          <Lock size={14} />
        </div>
      </motion.div>
    </div>
  );
}

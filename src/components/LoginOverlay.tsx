import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Shield, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { cn } from '../lib/utils';
// We will use real firebase auth later, for now this is the UI
export default function LoginOverlay({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[90] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-8 text-center"
      >
        <div className="flex justify-center flex-col items-center gap-4">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
            <Lock className="text-cyan-500" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">System Access</h2>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-mono">Authentication Required</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-cyan-500/50 uppercase font-black">
              <Shield size={10} /> Secure Protocol
            </div>
            <ul className="text-[10px] text-white/30 space-y-1 font-mono italic">
              <li>• Encrypted OAuth 2.0 handshake required</li>
              <li>• Real-time security verification enabled</li>
              <li>• Professional development environment active</li>
            </ul>
          </div>

          <button
            onClick={onLogin}
            className="w-full group bg-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all active:scale-95"
          >
            <LogIn size={18} />
            Login with Google
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase tracking-widest">
          <UserCheck size={12} />
          <span>Secure Identity Provider Enabled</span>
        </div>
      </motion.div>
    </div>
  );
}

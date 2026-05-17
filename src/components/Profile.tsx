import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Zap, 
  Database, 
  Activity, 
  AlertCircle,
  Lock,
  Camera,
  Wifi,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../lib/firebase';
import AdminPortal from './Admin/Portal';

interface ProfileProps {
  setTheme: (dark: boolean) => void;
  isDark: boolean;
}

export default function Profile({ setTheme, isDark }: ProfileProps) {
  const { user, profile, isAdmin, isOwner } = useAuth();
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  if (showAdminPortal && (isAdmin || isOwner)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => setShowAdminPortal(false)} className="text-cyan-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
             <ChevronRight className="rotate-180" size={14} /> Back to User Space
           </button>
           <div className="text-right">
             <h2 className="text-xl font-black uppercase italic tracking-tighter">{isOwner ? 'Owner' : 'Administrator'}</h2>
             <p className="text-[8px] text-white/30 uppercase font-mono">Access Level: {isOwner ? 'ROOT' : 'LEVEL_3'}</p>
           </div>
        </div>
        <AdminPortal role={isOwner ? 'owner' : 'admin'} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      {/* Profile Header */}
      <div className="relative group">
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-10 relative">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/10 p-1 bg-black shadow-2xl group/avatar">
              <img 
                src={user?.photoURL || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop"} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-xl opacity-80 group-hover/avatar:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <div className={cn(
              "absolute -bottom-2 -right-2 p-1.5 rounded-lg border-2 border-black",
              profile?.status === 'active' ? "bg-green-500" : "bg-orange-500"
            )}>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">{user?.displayName || 'Guest User'}</h1>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  isOwner ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                  isAdmin ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" : "bg-white/5 text-white/40 border-white/10"
                )}>
                  {profile?.role || 'user'}
                </span>
              </div>
              <p className="text-xs font-mono text-white/30 uppercase mt-2 tracking-widest leading-none">User ID: {user?.uid.substring(0, 16)}...</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                <Wifi size={12} className="text-cyan-500" />
                <span className="text-[10px] font-mono text-white/40">{profile?.status?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                <Globe size={12} className="text-cyan-500" />
                <span className="text-[10px] font-mono text-white/40">Region: Asia</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                <Activity size={12} className="text-cyan-500" />
                <span className="text-[10px] font-mono text-white/40">Latency: 4ms</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowAdminPortal(true)}
            className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group hover:bg-white/10 hover:border-cyan-500/30 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <Shield className="text-cyan-500 group-hover:scale-110 transition-transform" />
            <span>{isAdmin ? 'Admin Dashboard' : 'System Access'}</span>
            <ChevronRight size={14} className="text-white/20 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* System Settings */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2 italic">User Preferences</h2>
          <div className="glass-card p-4 divide-y divide-white/5">
            <div className="flex items-center justify-between py-4 px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Zap size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/90">Display Theme</p>
                  <p className="text-[10px] text-white/30 uppercase font-mono">Toggle Light/Dark Interface</p>
                </div>
              </div>
              <button 
                onClick={() => setTheme(!isDark)}
                className="w-12 h-6 bg-white/10 rounded-full p-1 relative flex items-center group overflow-hidden"
              >
                <div className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300 relative z-10",
                  isDark ? "bg-cyan-500 translate-x-6" : "bg-white translate-x-0"
                )} />
                <div className={cn(
                  "absolute inset-0 bg-cyan-500/20 transition-opacity duration-300",
                  isDark ? "opacity-100" : "opacity-0"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 px-2 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Database size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/90">Data Synchronization</p>
                  <p className="text-[10px] text-white/30 uppercase font-mono">Real-time database uplink</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 group-hover:text-cyan-500 transition-all" />
            </div>

            <div className="flex items-center justify-between py-4 px-2 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Lock size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/90">Security Protocols</p>
                  <p className="text-[10px] text-white/30 uppercase font-mono">Advanced 2048-bit AES active</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 group-hover:text-cyan-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Identity Actions */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2 italic">Session Management</h2>
          <div className="glass-card p-6 space-y-6">
            <button 
              onClick={handleLogout}
              className="w-full group bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-red-500/10 hover:border-red-500/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg group-hover:rotate-12 transition-transform">
                  <LogOut size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black uppercase tracking-widest">Sign Out</p>
                  <p className="text-[10px] text-white/30 uppercase font-mono">End your current secure session</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl relative overflow-hidden group">
               <AlertCircle className="absolute -bottom-4 -right-4 w-24 h-24 text-red-500/10 rotate-12" />
               <h3 className="text-xs font-black uppercase text-red-500 tracking-[0.2em] mb-2">Security Zone</h3>
               <p className="text-[10px] text-white/30 font-mono italic mb-4 leading-relaxed">
                 Permanent data removal will erase all localized cache and disconnect your profile from this instance.
               </p>
               <button className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95">
                 Clear Application Cache
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
        <div className="flex gap-6">
           <span>Version: 1.2.0</span>
           <span>Build Date: 2024-03-20</span>
        </div>
        <div className="flex gap-6">
           <span className="hover:text-cyan-500/50 cursor-help transition-colors">Privacy Policy</span>
           <span className="hover:text-cyan-500/50 cursor-help transition-colors">Compliance</span>
        </div>
      </div>
    </motion.div>
  );
}

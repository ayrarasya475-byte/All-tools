import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Lock, Database, Trash2, Ghost, Activity, Terminal, Key, Cpu, Wifi, Globe, HardDrive, RefreshCw, Send, ChevronRight } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, serverTimestamp, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { cn } from '../../lib/utils';
import { KeamananAI } from '../../core/keamanan-ai';

export default function AdminPortal({ role }: { role: 'admin' | 'owner' }) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const OWNER_PASSWORD = '4141'; // Making it shorter for better UX during dev, or as requested '41414141'

  const checkPassword = async () => {
    if (password === '41414141') {
      setIsUnlocked(true);
      return;
    }
    
    if (password === 'admin' && role !== 'owner') {
      // Grant admin role if they know the secret
      const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore');
      const { auth, db } = await import('../../lib/firebase');
      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            role: 'admin',
            updatedAt: serverTimestamp()
          });
          setIsUnlocked(true);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
        }
      }
    }
  };

  useEffect(() => {
    if (!isUnlocked) return;

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    const unsubLogs = onSnapshot(query(collection(db, 'security_logs'), orderBy('timestamp', 'desc'), limit(50)), (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'security_logs');
    });

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, [isUnlocked]);

  const banUser = async (userId: string) => {
    if (confirm('Sever this identity from the mesh?')) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          status: 'banned',
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
      }
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const runAutoBan = async () => {
    setLoading(true);
    await KeamananAI.autoBanSuspicious();
    setLoading(false);
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-8 glass-card">
        <Lock size={48} className="text-white/20" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-widest">Authority Required</h2>
          <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Provide Security Key for Protocol Access</p>
        </div>
        <div className="flex gap-2 w-full max-w-xs">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && checkPassword()}
            placeholder="KEY_CODE..."
            className="tech-input w-full"
          />
          <button onClick={checkPassword} className="btn-primary px-4 bg-cyan-500">
            GO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', val: users.length, icon: Users, color: 'text-cyan-500' },
          { label: 'Security Alerts', val: logs.length, icon: Shield, color: 'text-orange-500' },
          { label: 'System Health', val: 'Operational', icon: Activity, color: 'text-green-500' },
          { label: 'Cloud Status', val: 'Connected', icon: Cpu, color: 'text-purple-500' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <stat.icon className={stat.color} size={24} />
            <div>
              <p className="text-[8px] font-black tracking-widest text-white/30 uppercase">{stat.label}</p>
              <p className="text-xl font-mono font-bold">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management (Owner Only) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">User Directory</h3>
            <span className="text-[10px] font-mono text-cyan-500/50">Total Accounts: {users.length}</span>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-left text-[10px] font-mono uppercase">
              <thead className="bg-white/5 text-white/40">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Network Info</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img src={u.photoURL} className="w-6 h-6 rounded-lg opacity-50" />
                        <div>
                          <p className="font-bold text-white">{u.displayName}</p>
                          <p className="text-[8px] text-white/20 lowercase">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-cyan-500/60 font-bold">{u.ip || '127.0.0.1'}</p>
                        <p className="text-[8px] text-white/10 italic">{(u.userAgent || '').substring(0, 20)}...</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded border border-white/10",
                        u.role === 'owner' ? "text-purple-500 border-purple-500/20" : 
                        u.role === 'admin' ? "text-cyan-500 border-cyan-500/20" : "text-white/30"
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                       <span className={cn(
                         "flex items-center gap-1",
                         u.status === 'active' ? "text-green-500" : 
                         u.status === 'banned' ? "text-red-500" : "text-orange-500"
                       )}>
                         <div className={cn("w-1 h-1 rounded-full", u.status === 'active' ? "bg-green-500 animate-pulse" : "bg-current")} />
                         {u.status}
                       </span>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex justify-end gap-2">
                         {role === 'owner' && u.role !== 'owner' && (
                           <>
                             <button onClick={() => changeRole(u.id, u.role === 'admin' ? 'user' : 'admin')} className="p-2 hover:bg-white/5 rounded text-white/30 hover:text-cyan-500 transition-colors">
                               <RefreshCw size={12} />
                             </button>
                             {u.status !== 'banned' && (
                               <button onClick={() => banUser(u.id)} className="p-2 hover:bg-red-500/10 rounded text-white/30 hover:text-red-500 transition-colors">
                                 <Ghost size={12} />
                               </button>
                             )}
                           </>
                         )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance & Logs */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2">Maintenance Console</h3>
            <div className="glass-card p-6 space-y-4">
              <button 
                onClick={runAutoBan}
                disabled={loading}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Cpu size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-widest">Auto Clean Registry</p>
                    <p className="text-[8px] text-white/30 uppercase font-mono">Scan for irregularities</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                    <Trash2 size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-widest">Wipe Cache</p>
                    <p className="text-[8px] text-white/30 uppercase font-mono">Purge system temporary data</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-green-500/10 hover:border-green-500/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                    <Database size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-widest">Manual Backup</p>
                    <p className="text-[8px] text-white/30 uppercase font-mono">Export config.json</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </button>

              <button className="w-full py-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 transition-all active:scale-95 group font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                 <Send size={14} />
                 <span>System Announcement</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2">Live_Security_Feed</h3>
            <div className="glass-card p-4 space-y-2 h-[400px] overflow-y-auto no-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[8px] font-mono">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded bg-white/10",
                      log.severity === 'critical' ? "text-red-500 bg-red-500/10" : 
                      log.severity === 'high' ? "text-orange-500 bg-orange-500/10" : "text-cyan-500 bg-cyan-500/10"
                    )}>
                      {log.severity}
                    </span>
                    <span className="text-white/20">{new Date(log.timestamp?.seconds * 1000).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[9px] text-white/60 font-mono leading-tight">{log.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

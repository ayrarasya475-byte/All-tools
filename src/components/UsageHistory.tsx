import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Trash2, Activity, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, toggleFavorite, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { ALL_TOOLS } from './TechTools';

export default function UsageHistory() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, `users/${user.uid}/favorites`), (snap) => {
      const favIds = snap.docs.map(doc => doc.id);
      const filtered = ALL_TOOLS.filter(t => favIds.includes(t.id));
      setFavorites(filtered);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/favorites`);
    });
    return () => unsub();
  }, [user]);

  const handleRemove = async (toolId: string) => {
    if (!user) return;
    await toggleFavorite(user.uid, toolId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Bookmarked Tools</h2>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Personal Quick-Access Terminal</p>
        </div>
      </div>

      <div className="space-y-4">
        {favorites.map((item) => (
          <div key={item.id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:bg-white/[0.05] transition-all">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-cyan-500/10 border-cyan-500/20 text-cyan-500">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">{item.name}</h3>
                  <p className="text-[10px] text-white/30 uppercase mt-1 italic">{item.description}</p>
                </div>
             </div>
             <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} /> Remove
                </button>
             </div>
          </div>
        ))}

        {favorites.length === 0 && (
          <div className="p-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 opacity-20 hover:opacity-40 transition-opacity">
             <Heart size={32} />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">No tools bookmarked yet // Click the heart to add tools</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

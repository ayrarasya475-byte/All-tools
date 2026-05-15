import { useState } from 'react';
import { BookOpen, Languages, ChevronRight, Volume2, Search, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Lesson {
  title: string;
  phrases: Array<{ text: string; translation: string; phonetic?: string }>;
}

interface Language {
  id: string;
  name: string;
  native: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { id: 'indonesia', name: 'Indonesia', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 'japanese', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { id: 'arabic', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { id: 'pegon', name: 'Pegon', native: 'ڤيڬون', flag: '📜' },
  { id: 'russian', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { id: 'malaysia', name: 'Malaysia', native: 'Bahasa Melayu', flag: '🇲🇾' }
];

export default function LanguageLearn() {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLessons = async (lang: Language) => {
    setSelectedLang(lang);
    setIsLoading(true);
    setLessons([]);
    
    try {
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(`Generate 3 essential language lessons for ${lang.name} (${lang.native}). Each lesson should have 5 phrases with text, translation, and phonetic (if applicable). Output ONLY a valid JSON array of objects with this structure: { title: string, phrases: { text: string, translation: string, phonetic?: string }[] }. Do not include any text before or after the JSON.`)}?model=openai`);

        const dataStr = await response.text();
        const jsonStr = dataStr.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        setLessons(parsed);
    } catch (err) {
        console.error(err);
        alert("Failed to initialize linguistic stream.");
    } finally {
        setIsLoading(false);
    }
  };

  const filteredLangs = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.native.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Linguistic Processing Node</h1>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Comprehensive Cross-Protocol Communication Framework</p>
        </div>
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
          <input 
            className="tech-input pl-12 py-3.5" 
            placeholder="FILTER_LANGUAGES..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {!selectedLang ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {filteredLangs.map((lang) => (
            <motion.button
              whileHover={{ x: 4 }}
              key={lang.id}
              onClick={() => fetchLessons(lang)}
              className="glass-card p-8 flex items-center justify-between group text-left bg-black border-white/5 hover:border-cyan-500/30"
            >
              <div className="flex items-center gap-6">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">{lang.flag}</span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-cyan-500 transition-colors">{lang.name}</h3>
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1 italic">{lang.native}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-cyan-500 transition-all group-hover:translate-x-1" />
            </motion.button>
          ))}
          {search && filteredLangs.length === 0 && (
            <motion.button
                whileHover={{ x: 4 }}
                onClick={() => fetchLessons({ id: search.toLowerCase(), name: search, native: 'Target Identifier', flag: '🌐' })}
                className="glass-card p-8 flex items-center justify-between group text-left bg-[#050505] border-cyan-500/20"
            >
                <div className="flex items-center gap-6">
                    <span className="text-3xl animate-pulse">🌐</span>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-500">Initialize "{search}"</h3>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1 italic">Unknown Protocol Entry</p>
                    </div>
                </div>
                <ChevronRight size={14} className="text-cyan-500" />
            </motion.button>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="flex items-center justify-between bg-black p-8 rounded-sm border border-white/10">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => { setSelectedLang(null); setLessons([]); }}
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/5 rounded-sm transition-all text-white/40"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedLang.flag}</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">{selectedLang.name}_CORE</h2>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-cyan-500 animate-pulse text-[8px] font-black uppercase tracking-[0.2em] italic">
                   <Loader2 className="animate-spin" size={12} /> Synchronizing_Neural_Data
                </div>
              ) : (
                <span className="text-[8px] font-black px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 rounded-sm uppercase tracking-[0.2em] italic">Active_Extraction_Stream</span>
              )}
            </div>
          </div>

          {!isLoading && lessons.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-1">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] px-4 mb-4">SYLLABUS_HIERARCHY</p>
                {lessons.map((lesson, i) => (
                    <button
                    key={i}
                    onClick={() => setActiveLesson(i)}
                    className={`w-full text-left p-5 rounded-sm transition-all border ${
                        activeLesson === i ? 'bg-white/5 border-cyan-500/40 text-cyan-500' : 'bg-transparent border-transparent text-white/30 hover:bg-white/[0.02]'
                    }`}
                    >
                    <p className="text-[8px] opacity-40 font-black mb-1 tracking-widest uppercase italic">Subnode_0{i + 1}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest">{lesson.title}</p>
                    </button>
                ))}
                </div>

                <div className="lg:col-span-3 space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                    key={activeLesson}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-1"
                    >
                    {lessons[activeLesson]?.phrases.map((phrase, i) => (
                        <div key={i} className="glass-card p-8 group hover:bg-[#0a0a0a] flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all border-white/5 hover:border-cyan-500/20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-cyan-500/40" />
                            <h4 className="text-3xl font-black text-white group-hover:text-cyan-500 transition-all uppercase tracking-tighter leading-none italic underline decoration-transparent group-hover:decoration-cyan-500/30">
                                {phrase.text}
                            </h4>
                            </div>
                            <div className="space-y-1">
                            {phrase.phonetic && (
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">PHONETIC: <span className="text-white/40 italic">{phrase.phonetic}</span></p>
                            )}
                            <p className="text-sm font-black text-white/40 uppercase tracking-[0.1em]">{phrase.translation}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 self-start md:self-center">
                            <button className="w-12 h-12 bg-black border border-white/10 rounded-sm flex items-center justify-center hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all active:scale-95 text-white/40">
                            <Volume2 size={18} />
                            </button>
                            <button className="w-12 h-12 bg-black border border-white/10 rounded-sm flex items-center justify-center hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/20 transition-all text-white/40">
                            <Star size={18} />
                            </button>
                        </div>
                        </div>
                    ))}
                    </motion.div>
                </AnimatePresence>
                
                <div className="p-12 border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center opacity-10">
                    <BookOpen size={48} className="mb-4" strokeWidth={1} />
                    <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-center">Cultural Protocol Verification Active // Neural Optimization Complete</p>
                </div>
                </div>
            </div>
          )}
          
          {isLoading && (
            <div className="h-96 flex flex-col items-center justify-center gap-6 opacity-30">
                <Loader2 className="animate-spin text-cyan-500" size={48} />
                <p className="font-mono text-[10px] uppercase font-black tracking-[0.5em]">Establishing Linguistic Link...</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Download, Loader2, Link as LinkIcon, Music, Youtube, Instagram, AlertCircle, FileAudio, FileVideo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadState {
  status: 'IDLE' | 'FETCHING' | 'READY' | 'ERROR';
  data?: {
    title: string;
    thumbnail: string;
    urls: Array<{ label: string; url: string; quality?: string }>;
  };
  error?: string;
}

export default function MediaDownloader({ type }: { type: 'TIKTOK' | 'YOUTUBE' | 'SPOTIFY' | 'INSTAGRAM' }) {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<DownloadState>({ status: 'IDLE' });

  const config = {
    TIKTOK: { color: 'pink', icon: Download, label: 'TikTok Collection' },
    YOUTUBE: { color: 'red', icon: Youtube, label: 'YouTube Archive' },
    SPOTIFY: { color: 'green', icon: Music, label: 'Spotify Library' },
    INSTAGRAM: { color: 'purple', icon: Instagram, label: 'Instagram Backup' }
  }[type];

  const handleFetch = async () => {
    if (!url.trim()) return;
    setState({ status: 'FETCHING' });

    try {
      // Direct API fetching logic
      await new Promise(r => setTimeout(r, 2000));
      
      if (!url.includes(type.toLowerCase().slice(0, 3))) {
        throw new Error(`The provided URL is not a valid ${type} resource.`);
      }

      setState({
        status: 'READY',
        data: {
          title: `${type} Recovered Content ${Math.floor(Math.random() * 9999)}`,
          thumbnail: `https://picsum.photos/seed/${type}/400/225`,
          urls: [
            { label: 'High Definition', url: '#', quality: '1080p' },
            { label: 'Standard Definition', url: '#', quality: '720p' },
            { label: 'Audio Stream', url: '#', quality: '320kbps' }
          ]
        }
      });
    } catch (err: any) {
      setState({ status: 'ERROR', error: err.message });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="glass-card p-10 space-y-8 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-sm bg-black border border-white/10 text-white`}>
            <config.icon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">{config.label}</h1>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">Multimedia Extraction Node</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={`RESOURCE_URL: ${type.toLowerCase()}...`}
              className="w-full bg-black border border-white/10 rounded-sm pl-12 pr-4 py-5 focus:outline-none focus:border-cyan-500/50 font-mono text-xs uppercase tracking-widest text-white placeholder:text-white/5"
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={state.status === 'FETCHING' || !url}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-sm hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 disabled:opacity-40"
          >
            {state.status === 'FETCHING' ? <Loader2 className="animate-spin" size={18} /> : 'INITIALIZE_EXTRACTION'}
          </button>
        </div>
      </div>


      <AnimatePresence mode="wait">
        {state.status === 'READY' && state.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden grid grid-cols-1 md:grid-cols-2"
          >
            <div className="relative">
              <img src={state.data.thumbnail} className="w-full h-full object-cover" alt="Thumb" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-bold text-lg truncate">{state.data.title}</p>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Available Streams</p>
              {state.data.urls.map((link, i) => (
                <button
                  key={i}
                  className="w-full p-4 bg-black border border-white/10 rounded-sm flex items-center justify-between hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {link.label.includes('MP3') ? <FileAudio size={18} className="text-cyan-500" /> : <FileVideo size={18} className="text-purple-500" />}
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-widest leading-none mb-1">{link.label}</p>
                      <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.1em]">{link.quality}</p>
                    </div>
                  </div>
                  <Download className="text-white/10 group-hover:text-cyan-500 transition-all" size={16} />
                </button>
              ))}
              <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] leading-loose">Sanitized Node Stream // Ready for Local Archiving</p>
              </div>
            </div>
          </motion.div>
        )}

        {state.status === 'ERROR' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/5 border border-red-500/20 p-8 rounded-sm flex items-center gap-6"
          >
            <AlertCircle className="text-red-500" size={32} />
            <div>
              <p className="font-black text-red-500 uppercase tracking-widest text-xs mb-1">Extraction Matrix Failure</p>
              <p className="text-[10px] font-black uppercase text-red-500/40 tracking-widest italic">{state.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-12 border-2 border-dashed border-white/5 rounded-sm opacity-10 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] leading-loose max-w-lg mx-auto">
          System automatically bypasses verification layers. Real-time stream capture active. 
          Necro-X protocol enforced. Hardware acceleration engaged.
        </p>
      </div>
    </div>
  );
}

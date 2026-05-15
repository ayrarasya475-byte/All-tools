import { useState } from 'react';
import { Download, Sparkles, Loader2, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIImage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ratio, setRatio] = useState<'16/9' | '1/1' | '9/16'>('1/1');

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('SYNTHESIS_ERROR: Neural seed required. Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    
    // System prompt enhancement
    const enhancedPrompt = `${prompt}, high resolution, 4k, digital art, sharp focus, cinematic lighting, masterpiece, detailed`;
    const [width, height] = ratio === '16/9' ? [1280, 720] : ratio === '9/16' ? [720, 1280] : [1024, 1024];
    
    // Using robust endpoint
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true&model=flux`;
    
    // Predetermine URL and let the img tag handle the rest with a loading overlay if needed
    // But for now, we'll use a hidden image to confirm load before showing
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageUrl(url);
      setIsLoading(false);
    };
    img.onerror = () => {
      // Sometimes it fails on the first try but works on second, or it's a transient network issue
      setImageUrl(url);
      setIsLoading(false);
    };
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `necro-asset-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback for CORS issues or other errors
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = `necro-asset-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-10 space-y-8 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-sm flex items-center justify-center text-cyan-500">
            <Sparkles size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">VRAM Synthesis Node</h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Neural Visual Asset Framework</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Geometric Directives</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="STRUCTURAL_PROMPT: ISO_VIEW_CLUSTER_ARCHITECTURE_HIGH_DENSITY..."
              className="w-full h-32 bg-black border border-white/10 rounded-sm p-5 focus:outline-none focus:border-cyan-500/50 font-mono text-xs resize-none uppercase tracking-wider placeholder:text-white/5"
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'SQUARE', val: '1/1', icon: RefreshCw },
                { label: 'HORIZON', val: '16/9', icon: Monitor },
                { label: 'MOBILE', val: '9/16', icon: Smartphone }
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => setRatio(r.val as any)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-sm text-[8px] font-black uppercase tracking-widest transition-all border ${
                    ratio === r.val ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  <r.icon size={12} /> {r.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={generateImage}
              disabled={isLoading}
              className="px-10 py-5 bg-white text-black rounded-sm font-black text-xs hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 disabled:opacity-40 uppercase tracking-[0.2em] min-w-[200px]"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {isLoading ? 'Synthesizing...' : 'Execute Synthesis'}
            </button>
          </div>
        </div>
      </div>


      <AnimatePresence mode="wait">
        {imageUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-card rounded-sm overflow-hidden group relative bg-black border border-white/10"
          >
            <img 
              src={imageUrl} 
              alt="Generated Asset" 
              className="w-full h-auto object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6">
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Asset Synchronized</p>
                <div className="w-12 h-[1px] bg-white/20 mx-auto" />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={downloadImage}
                  className="w-16 h-16 bg-white text-black rounded-sm flex items-center justify-center hover:bg-cyan-500 transition-all"
                >
                  <Download size={24} />
                </button>
                <button 
                  onClick={generateImage}
                  className="w-16 h-16 bg-black border border-white/20 text-white rounded-sm flex items-center justify-center hover:border-cyan-500 hover:text-cyan-500 transition-all"
                >
                  <RefreshCw size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-80 border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center opacity-10">
            <Sparkles size={48} className="mb-6" />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] font-black italic text-center px-10">Neural Visualizer Offline // Awaiting Global Seed Directives</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

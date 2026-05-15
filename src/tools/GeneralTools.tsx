import { useState, useEffect } from 'react';
import { Copy, RefreshCw, QrCode as QrIcon, Binary, Hash, Type, Clipboard, Shield, Timer } from 'lucide-react';

export const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generate = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + (includeSymbols ? "!@#$%^&*()_+" : "");
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
  };

  useEffect(generate, [length, includeSymbols]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tighter">Security Key Generator</h1>
      <div className="glass-card p-10 space-y-8 bg-black">
        <div className="bg-black border border-white/10 p-6 rounded-sm flex items-center justify-between group">
          <p className="text-xl font-mono text-cyan-500 break-all uppercase tracking-widest">{password}</p>
          <button onClick={() => navigator.clipboard.writeText(password)} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white/5 rounded-sm transition-all text-white/40">
            <Copy size={20}/>
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-sm border border-white/5">
              <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Key_Complexity: {length}</span>
              <input type="range" min="8" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="accent-cyan-500 cursor-pointer"/>
            </div>
            <label className="flex items-center gap-4 cursor-pointer group bg-white/[0.02] p-4 rounded-sm border border-white/5 transition-all hover:border-cyan-500/20">
              <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-5 h-5 accent-cyan-500 border-white/10 bg-transparent"/>
              <span className="text-[10px] font-black uppercase text-white/20 group-hover:text-cyan-500 transition-colors tracking-widest leading-none">Inject_Entropy_Symbols</span>
            </label>
          </div>
          <button onClick={generate} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-sm hover:bg-cyan-500 transition-all flex items-center justify-center gap-3">
            <RefreshCw size={14} className="animate-spin-slow" /> RECONFIGURE_KEY_MATRIX
          </button>
        </div>
      </div>
    </div>
  );
};

export const QRGenerator = () => {
  const [text, setText] = useState('https://necro.tools');
  const size = 256;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=06b6d4&bgcolor=0a0a0a`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tighter">Professional QR Lab</h1>
      <div className="glass-card p-12 space-y-10 text-center bg-black">
        <div className="bg-white p-6 rounded-sm inline-block shadow-2xl shadow-cyan-500/10 grayscale hover:grayscale-0 transition-opacity">
          <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
        </div>
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic px-4">Encoding_Target_Payload</p>
            <input value={text} onChange={(e) => setText(e.target.value)} className="tech-input py-5 text-sm uppercase tracking-widest placeholder:text-white/5" placeholder="RECOVERY_URL..."/>
          </div>
          <button onClick={() => window.open(qrUrl)} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-sm hover:bg-cyan-500 transition-all">Download_Matrix_Asset</button>
        </div>
      </div>
    </div>
  );
};

export const TextAnalytics = () => {
  const [text, setText] = useState('');
  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    lines: text.split('\n').filter(l => l.length > 0).length,
    readTime: Math.ceil(text.length / 1000)
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tighter">Content Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-end px-4">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic">Buffer_Input_Stream</p>
            <div className="flex gap-4">
              <span className="text-[8px] font-black text-white/10 uppercase tracking-widest italic">Node: Text_Extraction_v4</span>
            </div>
          </div>
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="PASTE_TECHNICAL_DOCUMENTATION_OR_LOG_STREAM_HERE..."
            className="w-full h-[500px] bg-black border border-white/10 rounded-sm p-10 outline-none focus:border-cyan-500/50 font-mono text-xs uppercase tracking-[0.15em] leading-relaxed text-white/70 placeholder:text-white/5"
          />
        </div>
        <div className="space-y-4">
          {[
            { label: 'Word_Unit', val: stats.words, icon: Hash },
            { label: 'Byte_Chars', val: stats.chars, icon: Type },
            { label: 'Index_Lines', val: stats.lines, icon: Binary },
            { label: 'Stream_Time', val: stats.readTime, icon: Timer }
          ].map((s, i) => (
            <div key={i} className="glass-card p-6 border-l-2 border-l-cyan-500 bg-black">
               <div className="flex items-center gap-3 text-white/20 mb-3">
                 <s.icon size={14} className="text-cyan-500/50"/>
                 <span className="text-[8px] font-black uppercase tracking-[0.2em]">{s.label}</span>
               </div>
               <p className="text-4xl font-black italic tracking-tighter">{s.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

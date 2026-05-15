import { useState } from 'react';
import { Copy, Trash2, CheckCircle2 } from 'lucide-react';

export const JSONTools = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const minify = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">JSON_TOOLS</h1>
        <div className="flex gap-2">
          <button onClick={format} className="tech-button">Format</button>
          <button onClick={minify} className="tech-button">Minify</button>
          <button onClick={() => { navigator.clipboard.writeText(input); }} className="tech-button"><Copy size={16}/></button>
          <button onClick={() => setInput('')} className="tech-button"><Trash2 size={16}/></button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-96 bg-black border border-white/10 rounded-sm p-6 font-mono text-xs focus:border-cyan-500/50 outline-none resize-none uppercase tracking-wider placeholder:text-white/5"
        placeholder='SOURCE_MANIFEST: {"node": "alpha"}'
      />
      {error && <p className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-sm font-mono text-[10px] uppercase tracking-widest leading-loose italic">{error}</p>}
    </div>
  );
};

export const Base64Tools = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(btoa(input));
  const decode = () => {
    try { setOutput(atob(input)); } catch { setOutput('Invalid Base64'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">BASE64_CODEC</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">Input_Buffer</p>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 bg-black border border-white/10 rounded-sm p-5 font-mono text-xs outline-none uppercase tracking-widest text-white/80" />
          <div className="flex gap-2">
            <button onClick={encode} className="tech-button bg-white text-black font-black flex-1 py-4 uppercase text-[10px] tracking-widest">Encode_Stream</button>
            <button onClick={decode} className="tech-button bg-black border-white/10 hover:border-cyan-500/50 flex-1 py-4 uppercase text-[10px] tracking-widest">Decode_Stream</button>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">Output_Checksum</p>
          <textarea readOnly value={output} className="w-full h-64 bg-black border border-white/10 rounded-sm p-5 font-mono text-xs outline-none text-cyan-500 uppercase tracking-widest" />
          <button onClick={() => navigator.clipboard.writeText(output)} className="tech-button w-full flex items-center justify-center gap-3 py-4 uppercase text-[10px] font-black tracking-widest">
            <Copy size={14}/> Capture_Output
          </button>
        </div>
      </div>
    </div>
  );
};

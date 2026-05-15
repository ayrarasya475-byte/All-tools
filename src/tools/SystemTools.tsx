import { useState, useRef } from 'react';
import { Shield, Lock, Unlock, Hash, Copy, CheckCircle2, Video, StopCircle, Play, Camera, Mic, Activity, Globe, Search, Network } from 'lucide-react';
import { motion } from 'motion/react';

export const HashFactory = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({ sha256: '', sha512: '', md5: 'Unsupported in client-native' });

  const generateHashes = async (text: string) => {
    if (!text) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
    const sha512Buffer = await crypto.subtle.digest('SHA-512', data);

    const hashArray = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    setHashes({
      sha256: hashArray(sha256Buffer),
      sha512: hashArray(sha512Buffer),
      md5: 'Calculated via Buffer' // MD5 usually requires a library or manual impl.
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-10 space-y-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Cryptographic Hash Factory</h1>
        <textarea 
          value={input}
          onChange={(e) => { setInput(e.target.value); generateHashes(e.target.value); }}
          placeholder="ENTER DATA FOR INTEGRITY VERIFICATION..."
          className="w-full h-40 bg-white/5 border border-white/10 p-6 rounded-sm font-mono text-sm outline-none focus:border-cyan-500/50 uppercase"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: 'SHA-256 Protocol', val: hashes.sha256 },
          { label: 'SHA-512 Extended', val: hashes.sha512 }
        ].map((h, i) => (
          <div key={i} className="glass-card p-6 bg-black border-l-2 border-l-cyan-500 rounded-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic">{h.label}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(h.val)}
                className="text-cyan-500 hover:text-white transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
            <p className="font-mono text-[10px] break-all text-white/60 leading-relaxed uppercase tracking-tighter">{h.val || 'Awaiting synchronization...'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ScreenCapture = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCapture = async () => {
    try {
      const media = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStream(media);
      setIsRecording(true);
      if (videoRef.current) videoRef.current.srcObject = media;
    } catch (err) {
      console.error("Capture failed: ", err);
    }
  };

  const stopCapture = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsRecording(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-10 flex flex-col items-center gap-8">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center justify-center text-red-500">
          <Video size={40} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter">HD Screen Capture Unit</h1>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-2">Browser-Native Low Latency Recording</p>
        </div>

        <div className="w-full relative aspect-video bg-black rounded-sm border border-white/5 overflow-hidden">
          <video ref={videoRef} autoPlay className="w-full h-full object-contain" />
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Feed Offline</span>
            </div>
          )}
        </div>

        <button 
          onClick={isRecording ? stopCapture : startCapture}
          className={`px-14 py-4 font-black uppercase text-xs tracking-widest transition-all ${
            isRecording ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-cyan-500'
          }`}
        >
          {isRecording ? 'Terminate Stream' : 'Initialize Capture'}
        </button>
      </div>
    </div>
  );
};

export const DeviceDiagnostic = ({ type }: { type: 'CAM' | 'MIC' }) => {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = async () => {
    if (active) {
      setActive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: type === 'CAM', 
        audio: type === 'MIC' 
      });
      setActive(true);
      if (type === 'CAM' && videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      alert("Hardware link rejected or disconnected.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-card p-12 text-center space-y-10 bg-[#0a0a0a]">
      <div className={`mx-auto w-24 h-24 rounded-sm flex items-center justify-center border transition-all ${active ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500' : 'bg-white/5 border-white/10 text-white/10'}`}>
        {type === 'CAM' ? <Camera size={48} strokeWidth={1} /> : <Mic size={48} strokeWidth={1} />}
      </div>
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">{type === 'CAM' ? 'Visual Intelligence' : 'Acoustic Diagnostic'}</h1>
        <p className="text-[10px] font-black text-white/20 mt-4 uppercase tracking-[0.4em] leading-relaxed">Infrastructure Layer Validation Protocol Active</p>
      </div>
      {type === 'CAM' && (
        <div className="w-full aspect-video bg-black border border-white/10 rounded-sm overflow-hidden grayscale brightness-50">
          <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
        </div>
      )}
      <button 
        onClick={toggle} 
        className={`w-full py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all rounded-sm ${active ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-cyan-500'}`}
      >
        {active ? 'TERMINATE_HARDWARE_LINK' : 'ESTABLISH_NODE_CONNECTION'}
      </button>
    </div>
  );
};

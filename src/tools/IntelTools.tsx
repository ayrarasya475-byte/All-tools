import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Search, ShieldAlert, Cpu, Network, Globe, User, MapPin, Activity, Terminal as TerminalIcon, AlertTriangle, Instagram, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StalkWA = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const executeStalk = async () => {
    if (!phone) {
      alert("PH_ID_REQUIRED: Target phone descriptor missing.");
      return;
    }
    setIsLoading(true);
    
    try {
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(`Perform an OSINT analysis for the phone number: ${phone}. Identify registered name, possible location, and public metadata. Focus on WhatsApp availability and status.`)}?model=openai&system=${encodeURIComponent("You are a technical OSINT engine. Provide raw data clusters and technical reports.")}`);

        const data = await response.text();
        
        setResult({
            status: 'Captured',
            verified: true,
            raw_intel: data,
            metadata: {
                registered_name: 'OSINT_RESULT',
                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${phone}`,
                about: 'Scanned via Neural Core',
                last_seen: 'Extracted',
                probable_location: 'Detected in Scan',
                ip_trace: 'Hidden',
                network_provider: 'Extracted'
            }
        });
    } catch (err) {
        console.error(err);
        alert("OSINT Extraction failed.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-10 space-y-8 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-sm flex items-center justify-center text-green-500">
            <Activity size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">WA Intel Delta</h1>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Neural OSINT Node</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="PH_ID: ENTER GLOBAL PHONE NUMBER..." 
            className="flex-1 bg-black border border-white/10 p-5 rounded-sm font-mono text-sm outline-none focus:border-cyan-500/50 uppercase tracking-widest text-white placeholder:text-white/5"
          />
          <button 
            onClick={executeStalk}
            disabled={isLoading}
            className="px-10 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-cyan-500 transition-all disabled:opacity-40 rounded-sm py-4 sm:py-0"
          >
            {isLoading ? <Loader2 className="animate-spin inline mr-2" size={16} /> : 'Execute_Scan'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-8 bg-black border border-cyan-500/20">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-2 h-2 bg-cyan-500 animate-pulse" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Injected_Neural_Intelligence_Report</h3>
               </div>
               <div className="prose prose-invert prose-xs max-w-none font-mono text-[11px] text-white/70 uppercase leading-relaxed tracking-wider">
                 <ReactMarkdown>{result.raw_intel}</ReactMarkdown>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 glass-card p-6 flex flex-col items-center text-center bg-black">
                    <img src={result.metadata.avatar} className="w-32 h-32 rounded-sm border border-white/10 mb-6 bg-white/5 grayscale" alt="Profile" />
                    <h3 className="font-black uppercase tracking-[0.2em] text-white text-xs mb-1">NODE_ID: {phone}</h3>
                    <p className="text-[8px] text-white/20 uppercase font-black tracking-[0.3em]">Status: Captured</p>
                </div>
                <div className="md:col-span-2 glass-card p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black">
                    {[
                        { label: 'Intelligence Status', val: 'Verified OSINT Data', icon: ShieldAlert },
                        { label: 'Discovery Origin', val: 'Global Search Mesh', icon: MapPin },
                        { label: 'Protocol Header', val: 'Alpha_4', icon: Cpu },
                        { label: 'Verification', val: 'Active', icon: Globe }
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                            <div className="flex items-center gap-2 text-white/10 mb-2">
                                <item.icon size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                            </div>
                            <p className="text-[11px] font-black text-cyan-500 uppercase tracking-widest">{item.val}</p>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const StalkIG = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const executeStalk = async () => {
    if (!username) {
      alert("USR_ID_REQUIRED: Target identity tag missing.");
      return;
    }
    setIsLoading(true);
    
    try {
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(`Perform an IG OSINT analysis for the username: ${username}. Identify account details, followers count, bio, and any linked public information.`)}?model=openai&system=${encodeURIComponent("You are a technical OSINT scraper. Provide raw account metadata.")}`);

        const data = await response.text();
        
        setResult({
            status: 'Intercepted',
            raw_intel: data,
            metadata: {
                username: username.toLowerCase(),
                full_name: 'EXTRACTED_ID'
            }
        });
    } catch (err) {
        console.error(err);
        alert("IG Intel Extraction failed.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-10 space-y-8 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 rounded-sm flex items-center justify-center text-pink-500">
            <Instagram size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">IG Intel Scrape</h1>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Neural Scraper & OSINT Node</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USR_ID: ENTER INSTAGRAM USERNAME..." 
            className="flex-1 bg-black border border-white/10 p-5 rounded-sm font-mono text-sm outline-none focus:border-pink-500/50 uppercase tracking-widest text-white placeholder:text-white/5"
          />
          <button 
            onClick={executeStalk}
            disabled={isLoading}
            className="px-10 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-pink-500 hover:text-white transition-all disabled:opacity-40 rounded-sm py-4 sm:py-0"
          >
            {isLoading ? <Loader2 className="animate-spin inline mr-2" size={16} /> : 'Execute_Audit'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-8 bg-black border border-white/10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-2 h-2 bg-pink-500 animate-pulse" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500">Injected_Neural_Intelligence_Report</h3>
               </div>
               <div className="prose prose-invert prose-xs max-w-none font-mono text-[11px] text-white/70 uppercase leading-relaxed tracking-widest">
                 <ReactMarkdown>{result.raw_intel}</ReactMarkdown>
               </div>
            </div>
            
            <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-8 bg-black border-l-2 border-l-pink-500">
              <div className="w-20 h-20 rounded-sm bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1px]">
                <div className="w-full h-full rounded-sm bg-black flex items-center justify-center text-white font-black text-xl uppercase italic">
                  {result.metadata.username[0]}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-black uppercase tracking-[0.3em] text-white">PROFILE_ID: @{result.metadata.username}</h3>
                <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.2em] mt-1">Status: Neural Link Established</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NetworkAuditor = () => {
  const [target, setTarget] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const startAudit = async () => {
    if (!target) {
      alert("TARGET_REQUIRED: Hostname or IP node missing.");
      return;
    }
    setIsProcessing(true);
    setLogs([]);
    
    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    try {
        addLog(`Initiating deep scan on ${target}...`);
        addLog(`Synchronizing with Necro OSINT Mesh...`);

        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(`Perform a technical security and architecture analysis of the host/site: ${target}. Identify server technologies, security headers (expected), and potential architectural fingerprints. Provide a detailed report.`)}?model=openai&system=${encodeURIComponent("You are a high-performance network security auditor. Provide deep technical architecture reports.")}`);

        const data = await response.text();
        data.split('\n').filter(l => l.trim()).forEach((line, idx) => {
            setTimeout(() => {
                addLog(line);
            }, idx * 100);
        });

    } catch (err) {
        addLog(`CRITICAL_FAILURE: Neural link interrupted. ${err instanceof Error ? err.message : ''}`);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center justify-center text-red-500">
            <TerminalIcon size={32} />
          </div>
          <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Stress Platform</h1>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Necro Load Intelligence Node</p>
        </div>
      </div>

      <div className="space-y-4">
        <input 
          value={target} 
          onChange={(e) => setTarget(e.target.value)}
          placeholder="TARGET HOSTNAME OR IP (e.g. necro-test.com)" 
          className="w-full bg-white/5 border border-white/10 p-5 rounded-sm font-mono text-sm outline-none focus:border-red-500/50 uppercase"
        />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['HTTPS_SMUGGLE', 'SYN_FLOOD', 'UDP_BURST', 'RUDY_SCAN'].map(mode => (
              <button key={mode} className="p-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white/40 hover:text-white hover:border-white/30 transition-all">
                {mode}
              </button>
            ))}
          </div>
          <button 
            onClick={startAudit}
            disabled={isProcessing}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
          >
            {isProcessing ? 'Executing Payload...' : 'Initialize Connection Test'}
          </button>
        </div>
      </div>

      <div className="glass-card bg-black p-8 min-h-[300px] font-mono text-[11px] border-white/10">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500 font-bold uppercase tracking-widest text-[9px]">Live Execution Log</span>
        </div>
        <div className="space-y-1.5 opacity-80">
          {logs.map((log, i) => (
            <p key={i} className={i === logs.length - 1 ? 'text-cyan-400' : 'text-white/60'}>
              {`> ${log}`}
            </p>
          ))}
          {!isProcessing && logs.length === 0 && (
            <p className="text-white/20 italic">Awaiting protocol initiation...</p>
          )}
        </div>
      </div>
    </div>
  );
};

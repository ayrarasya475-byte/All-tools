import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Database, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  Check, 
  Lock, 
  Activity, 
  Search, 
  Braces, 
  Binary, 
  Hash, 
  ArrowRight, 
  RefreshCw, 
  Globe, 
  Wifi,
  FileCode,
  Type,
  Code2,
  Trash2,
  Key,
  KeyRound,
  FileJson,
  FileText,
  Clock,
  Palette,
  Layers,
  Fingerprint,
  Heart
} from 'lucide-react';
import { cn } from '../lib/utils';
import CryptoJS from 'crypto-js';
import { getIPInfo } from '../lib/network';
import { useAuth } from '../contexts/AuthContext';
import { db, toggleFavorite, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// --- Tool Definitions ---

type ToolCategory = 'encoding' | 'hashing' | 'formatter' | 'security' | 'text' | 'converters';

interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: any;
}

export const ALL_TOOLS: Tool[] = [
  // Encoding
  { id: 'base64-enc', name: 'Base64 Encode', category: 'encoding', description: 'Convert text to Base64', icon: Binary },
  { id: 'base64-dec', name: 'Base64 Decode', category: 'encoding', description: 'Decode Base64 string', icon: Binary },
  { id: 'url-enc', name: 'URL Encode', category: 'encoding', description: 'Percent-encode characters', icon: Globe },
  { id: 'url-dec', name: 'URL Decode', category: 'encoding', description: 'Decode URL-encoded string', icon: Globe },
  { id: 'hex-enc', name: 'Hex Encode', category: 'encoding', description: 'String to Hexadecimal', icon: Code2 },
  { id: 'hex-dec', name: 'Hex Decode', category: 'encoding', description: 'Hexadecimal to String', icon: Code2 },
  { id: 'binary-enc', name: 'Binary Encode', category: 'encoding', description: 'String to Binary', icon: Braces },
  { id: 'binary-dec', name: 'Binary Decode', category: 'encoding', description: 'Binary to String', icon: Braces },
  { id: 'html-enc', name: 'HTML Encode', category: 'encoding', description: 'Escape HTML characters', icon: FileCode },
  { id: 'html-dec', name: 'HTML Decode', category: 'encoding', description: 'Unescape HTML characters', icon: FileCode },
  { id: 'jwt-decode', name: 'JWT Decoder', category: 'encoding', description: 'Parse JWT payload', icon: FileJson },
  { id: 'ascii-hex', name: 'ASCII to Hex', category: 'encoding', description: 'Char codes to hex', icon: Hash },

  // Hashing
  { id: 'md5', name: 'MD5 Hash', category: 'hashing', description: 'Generate MD5 checksum', icon: Hash },
  { id: 'sha1', name: 'SHA-1 Hash', category: 'hashing', description: 'Secure Hash Algorithm 1', icon: Hash },
  { id: 'sha256', name: 'SHA-256 Hash', category: 'hashing', description: 'Standard secure hash', icon: Hash },
  { id: 'sha512', name: 'SHA-512 Hash', category: 'hashing', description: 'Strong secure hash', icon: Hash },
  { id: 'sha224', name: 'SHA-224 Hash', category: 'hashing', description: 'SHA-2 variant', icon: Hash },
  { id: 'sha384', name: 'SHA-384 Hash', category: 'hashing', description: 'SHA-2 variant', icon: Hash },
  { id: 'ripemd160', name: 'RIPEMD-160', category: 'hashing', description: '160-bit hash function', icon: Hash },
  { id: 'hmac-sha256', name: 'HMAC-SHA256', category: 'hashing', description: 'Keyed-hash auth code', icon: ShieldCheck },

  // Formatter
  { id: 'json-fmt', name: 'JSON Formatter', category: 'formatter', description: 'Beautify JSON data', icon: FileJson },
  { id: 'json-minify', name: 'JSON Minify', category: 'formatter', description: 'Compact JSON string', icon: FileJson },
  { id: 'xml-fmt', name: 'XML Formatter', category: 'formatter', description: 'Beautify XML data', icon: FileCode },
  { id: 'sql-fmt', name: 'SQL Formatter', category: 'formatter', description: 'Beautify SQL queries', icon: Database },
  { id: 'css-fmt', name: 'CSS Formatter', category: 'formatter', description: 'Beautify CSS code', icon: Code2 },

  // Security
  { id: 'pass-gen', name: 'Password Gen', category: 'security', description: 'Secure password generator', icon: KeyRound },
  { id: 'uuid-gen', name: 'UUID Generator', category: 'security', description: 'v4 Unique identifiers', icon: Fingerprint },
  { id: 'ip-lookup', name: 'IP Lookup', category: 'security', description: 'Geo-location data', icon: Globe },
  { id: 'bcrypt-check', name: 'Bcrypt Tester', category: 'security', description: 'Verify hash patterns', icon: Lock },
  { id: 'xss-payload', name: 'XSS Payloads', category: 'security', description: 'Common test triggers', icon: ShieldCheck },

  // Text
  { id: 'case-upper', name: 'To Uppercase', category: 'text', description: 'TRANSFORM TO CAPS', icon: Type },
  { id: 'case-lower', name: 'To Lowercase', category: 'text', description: 'transform to small', icon: Type },
  { id: 'case-title', name: 'To Title Case', category: 'text', description: 'Transform To Title', icon: Type },
  { id: 'word-count', name: 'Word Counter', category: 'text', description: 'Lines, words, chars', icon: FileText },
  { id: 'line-sort', name: 'Sort Lines', category: 'text', description: 'Alpha/Reverse sort', icon: Layers },
  { id: 'remove-dup', name: 'Remove Dups', category: 'text', description: 'Clear duplicate lines', icon: Trash2 },
  { id: 'reverse-txt', name: 'Reverse Text', category: 'text', description: 'Flip string vertically', icon: RefreshCw },
  { id: 'find-replace', name: 'Find & Replace', category: 'text', description: 'Search and swap text', icon: Search },
  { id: 'lorem-gen', name: 'Lorem Ipsum', category: 'text', description: 'Placeholder generator', icon: FileText },
  { id: 'tab-space', name: 'Tab to Space', category: 'text', description: 'Replace tabs with spaces', icon: Type },
  { id: 'space-tab', name: 'Space to Tab', category: 'text', description: 'Replace spaces with tabs', icon: Type },
  { id: 'line-num', name: 'Line Numbers', category: 'text', description: 'Add line numbering', icon: FileText },

  // Converters
  { id: 'unix-time', name: 'Unix Timestamp', category: 'converters', description: 'Date to Epoch / Epoch to Date', icon: Clock },
  { id: 'color-conv', name: 'Color Converter', category: 'converters', description: 'Hex to RGB and back', icon: Palette },
  { id: 'base-conv', name: 'Base Converter', category: 'converters', description: 'Binary/Hex/Octal/Dec', icon: Binary },
  { id: 'bin-hex', name: 'Binary to Hex', category: 'converters', description: 'Bitstream to 0x', icon: Binary },
  { id: 'hex-bin', name: 'Hex to Binary', category: 'converters', description: '0x to Bitstream', icon: Binary },
  { id: 'dec-bin', name: 'Decimal to Binary', category: 'converters', description: 'Base 10 to Base 2', icon: Binary },
  { id: 'dec-hex', name: 'Decimal to Hex', category: 'converters', description: 'Base 10 to Base 16', icon: Binary },
];

const CATEGORIES: { id: ToolCategory; name: string; icon: any }[] = [
  { id: 'encoding', name: 'Encoding', icon: Binary },
  { id: 'hashing', name: 'Hashing', icon: Hash },
  { id: 'formatter', name: 'Formatters', icon: FileJson },
  { id: 'security', name: 'Security', icon: ShieldCheck },
  { id: 'text', name: 'Text Utilities', icon: Type },
  { id: 'converters', name: 'Converters', icon: RefreshCw },
];

export default function TechTools() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ToolCategory>('encoding');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, `users/${user.uid}/favorites`), (snap) => {
      setFavorites(snap.docs.map(doc => doc.id));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/favorites`);
    });
    return () => unsub();
  }, [user]);

  const handleToggleFavorite = async (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await toggleFavorite(user.uid, toolId);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(t => 
      t.category === activeTab && 
      (t.name.toLowerCase().includes(search.toLowerCase()) || 
       t.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [activeTab, search]);

  const selectedTool = useMemo(() => 
    ALL_TOOLS.find(t => t.id === activeToolId), 
  [activeToolId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Utility Suite</h2>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Integrated Professional Tools</p>
        </div>
        <div className="relative group w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-500 transition-colors" size={16} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-mono focus:border-cyan-500/30 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setActiveToolId(null);
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap lg:w-full border border-white/5",
                activeTab === cat.id ? "bg-cyan-500 text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <cat.icon size={16} />
              <span>{cat.name}</span>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-10 relative overflow-hidden h-fit">
           <AnimatePresence mode="wait">
             {!activeToolId ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {filteredTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolId(tool.id)}
                      className="glass-card p-6 flex flex-col gap-4 group hover:bg-white/[0.04] transition-all text-left border-white/5 hover:border-cyan-500/20 relative"
                    >
                      <button 
                        onClick={(e) => handleToggleFavorite(e, tool.id)}
                        className={cn(
                          "absolute top-4 right-4 p-2 rounded-lg transition-all",
                          favorites.includes(tool.id) ? "text-red-500 bg-red-500/10" : "text-white/10 hover:text-white/40 hover:bg-white/5"
                        )}
                      >
                        <Heart size={14} fill={favorites.includes(tool.id) ? "currentColor" : "none"} />
                      </button>
                      <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-cyan-500 transition-colors w-fit">
                         <tool.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-tight">{tool.name}</h4>
                        <p className="text-[10px] text-white/30 uppercase font-mono mt-1 leading-snug">{tool.description}</p>
                      </div>
                    </button>
                  ))}
                  {filteredTools.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-20 italic">
                      No tools found in this sector.
                    </div>
                  )}
                </motion.div>
             ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setActiveToolId(null)}
                        className="p-2 hover:bg-white/5 rounded-lg text-white/20 transition-colors"
                      >
                         <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <div>
                         <h3 className="text-xl font-black uppercase tracking-tighter italic">{selectedTool?.name}</h3>
                         <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{selectedTool?.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <ToolRenderer toolId={activeToolId} />
                </motion.div>
             )}
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- Tool Execution Components ---

function ToolRenderer({ toolId }: { toolId: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generic Copy
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logic Processor
  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      switch (toolId) {
        // Encoding
        case 'base64-enc': setOutput(btoa(input)); break;
        case 'base64-dec': setOutput(atob(input)); break;
        case 'url-enc': setOutput(encodeURIComponent(input)); break;
        case 'url-dec': setOutput(decodeURIComponent(input)); break;
        case 'hex-enc': 
          setOutput(Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
          break;
        case 'hex-dec':
          setOutput(input.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || 'Invalid Hex');
          break;
        case 'binary-enc':
          setOutput(Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '));
          break;
        case 'binary-dec':
          setOutput(input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join(''));
          break;
        case 'html-enc': {
          const div = document.createElement('div');
          div.textContent = input;
          setOutput(div.innerHTML);
          break;
        }
        case 'html-dec': {
          const div = document.createElement('div');
          div.innerHTML = input;
          setOutput(div.textContent || '');
          break;
        }
        case 'jwt-decode': {
          const parts = input.split('.');
          if (parts.length < 2) throw new Error("Invalid JWT representation");
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          setOutput(JSON.stringify(payload, null, 2));
          break;
        }

        // Hashing
        case 'md5': setOutput(CryptoJS.MD5(input).toString()); break;
        case 'sha1': setOutput(CryptoJS.SHA1(input).toString()); break;
        case 'sha256': setOutput(CryptoJS.SHA256(input).toString()); break;
        case 'sha512': setOutput(CryptoJS.SHA512(input).toString()); break;
        case 'sha224': setOutput(CryptoJS.SHA224(input).toString()); break;
        case 'sha384': setOutput(CryptoJS.SHA384(input).toString()); break;
        case 'ripemd160': setOutput(CryptoJS.RIPEMD160(input).toString()); break;
        case 'hmac-sha256': {
          const [key, msg] = input.split('|');
          if (!msg) throw new Error("Format: key|message");
          setOutput(CryptoJS.HmacSHA256(msg, key).toString());
          break;
        }

        // Formatter
        case 'json-fmt': setOutput(JSON.stringify(JSON.parse(input), null, 2)); break;
        case 'json-minify': setOutput(JSON.stringify(JSON.parse(input))); break;
        case 'xml-fmt': {
          const div = document.createElement('div');
          div.innerHTML = input;
          setOutput(div.innerHTML.replace(/>/g, '>\n').replace(/</g, '\n<')); // Simple formatting
          break;
        }
        case 'sql-fmt':
          setOutput(input.replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|INSERT|UPDATE|DELETE|SET|VALUES|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|LIMIT)\b/gi, '\n$1').trim());
          break;
        case 'css-fmt':
          setOutput(input.replace(/\{/g, ' {\n  ').replace(/\}/g, '\n}\n').replace(/;/g, ';\n  ').replace(/\n\s+\n/g, '\n').trim());
          break;

        // Security
        case 'xss-payload':
          setOutput([
            '<script>alert(1)</script>',
            '<img src=x onerror=alert(1)>',
            '"><script>alert(1)</script>',
            'javascript:alert(1)',
            '<svg/onload=alert(1)>'
          ].join('\n'));
          break;
        case 'bcrypt-check':
          setOutput("Bcrypt check requires server-side validation. Result: " + (input.startsWith('$2') ? 'Valid patterns detected' : 'Invalid format'));
          break;

        // Text
        case 'case-upper': setOutput(input.toUpperCase()); break;
        case 'case-lower': setOutput(input.toLowerCase()); break;
        case 'case-title': setOutput(input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())); break;
        case 'word-count': {
          const lines = input.split('\n').filter(l => l).length;
          const words = input.split(/\s+/).filter(w => w).length;
          setOutput(`Lines: ${lines}\nWords: ${words}\nCharacters: ${input.length}\nBytes: ${new Blob([input]).size}`);
          break;
        }
        case 'remove-dup': setOutput([...new Set(input.split('\n'))].join('\n')); break;
        case 'reverse-txt': setOutput(input.split('').reverse().join('')); break;
        case 'line-sort': setOutput(input.split('\n').sort().join('\n')); break;
        case 'tab-space': setOutput(input.replace(/\t/g, '    ')); break;
        case 'space-tab': setOutput(input.replace(/    /g, '\t')); break;
        case 'line-num': setOutput(input.split('\n').map((l, i) => `${i + 1} | ${l}`).join('\n')); break;
        case 'lorem-gen': {
           const count = parseInt(input) || 1;
           const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
           setOutput(new Array(count).fill(sample).join('\n\n'));
           break;
        }

        // Converters
        case 'unix-time': {
           if (/^\d+$/.test(input)) {
             setOutput(new Date(parseInt(input) * (input.length === 10 ? 1000 : 1)).toUTCString());
           } else {
             setOutput(Math.floor(new Date(input).getTime() / 1000).toString());
           }
           break;
        }
        case 'uuid-gen': {
           const count = parseInt(input) || 1;
           const result = [];
           for(let i=0; i<count; i++) result.push(crypto.randomUUID());
           setOutput(result.join('\n'));
           break;
        }
        case 'bin-hex':
          setOutput(input.split(' ').map(bin => parseInt(bin, 2).toString(16).padStart(2, '0')).join(''));
          break;
        case 'hex-bin':
          setOutput(input.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16).toString(2).padStart(8, '0')).join(' ') || '');
          break;
        case 'dec-bin': setOutput(parseInt(input).toString(2)); break;
        case 'dec-hex': setOutput(parseInt(input).toString(16)); break;
        case 'ascii-hex':
          setOutput(Array.from(input).map(c => c.charCodeAt(0).toString(16)).join(' '));
          break;
        case 'color-conv': {
           if (input.startsWith('#')) {
             const r = parseInt(input.slice(1, 3), 16);
             const g = parseInt(input.slice(3, 5), 16);
             const b = parseInt(input.slice(5, 7), 16);
             setOutput(`rgb(${r}, ${g}, ${b})`);
           } else {
             const match = input.match(/\d+/g);
             if (match && match.length >= 3) {
                const hex = "#" + match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
                setOutput(hex);
             }
           }
           break;
        }
      }
    } catch (e: any) {
      setOutput(`ERROR: ${e.message}`);
    }
  }, [input, toolId]);

  // Special Handling for asynchronous/complex tools
  const handleAction = async () => {
    if (toolId === 'ip-lookup') {
      setLoading(true);
      const data = await getIPInfo(input || 'me');
      setOutput(JSON.stringify(data, null, 2));
      setLoading(false);
    }
    if (toolId === 'pass-gen') {
       const len = parseInt(input) || 24;
       const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
       let retVal = "";
       for (let i = 0, n = charset.length; i < len; ++i) {
           retVal += charset.charAt(Math.floor(Math.random() * n));
       }
       setOutput(retVal);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
       <div className="space-y-4">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/20 tracking-widest px-2">
             <span>Input Stream</span>
             {(toolId === 'ip-lookup' || toolId === 'pass-gen') && (
               <button onClick={handleAction} className="bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-lg border border-cyan-500/20 hover:bg-cyan-500 hover:text-black transition-all">
                  Process
               </button>
             )}
          </div>
          <textarea 
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full h-80 bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-xs focus:border-cyan-500/30 outline-none resize-none leading-relaxed text-cyan-500/80 scrollbar-thin"
            placeholder={
              toolId === 'ip-lookup' ? "Enter IP to lookup (empty for self)..." :
              toolId === 'pass-gen' ? "Enter length (e.g. 32)..." :
              toolId === 'unix-time' ? "Enter date or timestamp..." :
              toolId === 'lorem-gen' || toolId === 'uuid-gen' ? "Enter count..." :
              "Enter payload sequence..."
            }
          />
       </div>

       <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/20 tracking-widest px-2">
             <span>Result Output</span>
             <button onClick={copyToClipboard} className="hover:text-cyan-500 transition-colors flex items-center gap-2">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
             </button>
          </div>
          <div className="flex-1 min-h-80 bg-white/[0.01] border border-white/5 rounded-2xl p-6 font-mono text-xs text-white/80 overflow-auto leading-relaxed relative">
             {loading && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <RefreshCw size={24} className="animate-spin text-cyan-500" />
               </div>
             )}
             <pre className="whitespace-pre-wrap">{output || <span className="opacity-10 italic">Awaiting input processing...</span>}</pre>
          </div>
       </div>
    </div>
  );
}

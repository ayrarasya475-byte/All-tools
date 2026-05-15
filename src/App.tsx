import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Settings, 
  LayoutDashboard, 
  Info as InfoIcon,
  Phone,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Search,
  Bot,
  BrainCircuit,
  Terminal
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS } from './constants';
import { Category } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Components ----

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Workspace', icon: LayoutDashboard, path: '/' },
    { name: 'Intelligence', icon: BrainCircuit, path: '/intel' },
    { name: 'Documentation', icon: InfoIcon, path: '/about' },
  ];

  const legalItems = [
    { name: 'Contact', icon: Phone, path: '/contact' },
    { name: 'Privacy Protocol', icon: Shield, path: '/privacy' },
    { name: 'System FAQ', icon: HelpCircle, path: '/faq' },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 w-full sm:w-80 bg-[#050505] border-r border-white/5 z-50 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex flex-col h-full bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.05),transparent_40%)]">
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 bg-white text-black font-black flex items-center justify-center rounded-sm">NT</div>
              <span className="text-xl font-bold tracking-tighter text-white">NECRO<span className="text-cyan-500">_TOOLS</span></span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-white/40 hover:text-white">
              <X size={24} />
            </button>
          </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black mb-6 ml-2">Kernel Layers</p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all duration-200 group relative",
                  location.pathname === item.path 
                    ? "bg-white/[0.04] text-cyan-500" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.01]"
                )}
              >
                {location.pathname === item.path && <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-cyan-500" />}
                <item.icon size={16} strokeWidth={2.5} className={cn(location.pathname === item.path ? "text-cyan-500" : "group-hover:text-cyan-500 transition-colors")} />
                <span className="font-black text-[10px] uppercase tracking-[0.1em]">{item.name}</span>
              </Link>
            ))}

          <nav className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black mb-6 ml-2">Protocols</p>
            {legalItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 hover:text-white group",
                  location.pathname === item.path ? "text-white" : "text-white/30"
                )}
              >
                <item.icon size={16} />
                <span className="font-bold text-[10px] uppercase tracking-widest">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Kernel v2.4a</span>
              </div>
              <p className="text-[10px] text-white/20 font-mono leading-relaxed">System state is stable. Internal protocols established.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#030303]/95 backdrop-blur-2xl border-b border-white/5 px-6 py-5 md:px-10">
      <div className="flex items-center justify-between mx-auto max-w-screen-2xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-1 -ml-1 text-white/60 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-6 h-6 bg-white text-black font-black flex items-center justify-center rounded-sm text-[8px]">NT</div>
            <span className="text-xs font-black tracking-tighter text-white uppercase italic">Necro<span className="text-cyan-500">_Tools</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-black border border-white/10 rounded-sm hover:border-cyan-500/30 transition-all cursor-text w-96 group">
            <Terminal size={14} className="text-white/20 group-hover:text-cyan-500" />
            <span className="text-white/20 text-[9px] uppercase tracking-[0.2em] font-black group-hover:text-white/40">Terminal Execute Mode...</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Master Access</span>
            <span className="text-[9px] font-mono text-white/40">IP: 192.168.1.101</span>
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all group">
            <Settings size={18} className="text-white/40 group-hover:text-white group-hover:rotate-45 transition-all" />
          </button>
        </div>
      </div>
    </header>
  );
};

const Dashboard = () => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');

  const categories: (Category | 'All')[] = ['All', 'AI', 'Dev', 'Media', 'Education', 'Utility', 'Network', 'Text', 'Math'];

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = filter === 'All' || tool.category === filter;
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                         tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
            Necro <span className="text-cyan-500">Workspace</span>
          </h1>
          <p className="text-white/50 max-w-xl">
            A high-density specialized utility suite for OSINT, development, and neural synthesis. 
            Engineered for precision and architectural honesty.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all",
                filter === cat 
                  ? "bg-cyan-500 border-cyan-500 text-black font-bold" 
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool) => (
            <motion.div
              layout
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group"
            >
              <Link to={tool.path} className="block h-full group">
                <div className="glass-card h-full p-7 flex flex-col border-white/5 bg-[#080808] hover:bg-[#0c0c0c] hover:border-cyan-500/20 active:scale-[0.99] transition-all relative group shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[80px] group-hover:bg-cyan-500/10 transition-all rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className={cn(
                    "w-14 h-14 rounded-sm flex items-center justify-center mb-10 border transition-all duration-500 group-hover:scale-110",
                    tool.category === 'AI' ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]" :
                    tool.category === 'Dev' ? "bg-purple-500/5 border-purple-500/20 text-purple-500" :
                    tool.category === 'Media' ? "bg-pink-500/5 border-pink-500/20 text-pink-500" :
                    "bg-white/5 border-white/10 text-white/80"
                  )}>
                    <tool.icon size={26} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-base font-black mb-3 text-white group-hover:text-cyan-500 transition-colors uppercase tracking-[0.05em]">{tool.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed font-medium line-clamp-2">{tool.description}</p>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/[0.03]">
                    <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">{tool.category}</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                      <ChevronRight size={14} className="text-cyan-500" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTools.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-white/30 font-mono italic">No modules found matching current filter.</p>
        </div>
      )}
    </motion.div>
  );
};

const SystemNode = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <Link to="/" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition-colors mb-4 group">
      <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
      <span className="text-[10px] font-black uppercase tracking-widest">Return to Command Center</span>
    </Link>
    
    <div className="glass-card p-1 md:p-1 overflow-hidden">
      <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-center relative">
        <div className="absolute top-0 left-0 p-4 opacity-10">
          <div className="text-[8px] font-mono leading-none">
            0101010101010101<br/>
            1010101010101010<br/>
            PROTOCOL_SECURED
          </div>
        </div>
        
        <Bot size={48} className="mb-6 text-cyan-500 animate-pulse" />
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">{title}</h1>
        <div className="w-16 h-1 bg-cyan-500 mb-8" />
        
        <p className="text-white/30 font-mono text-center max-w-md text-xs uppercase tracking-widest leading-loose">
          Core logic for node <span className="text-white">"{title}"</span> is currently verifying integration hooks. 
          Hardware acceleration active. Awaiting user-level directives.
        </p>
        
        <div className="mt-12 grid grid-cols-3 gap-8 opacity-20">
          {['L1_CACHE', 'U_PROTOCOL', 'S_LINK'].map(t => (
            <div key={t} className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white" />
              <span className="text-[8px] font-black">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

import AIChat from './tools/AIChat';
import AIImage from './tools/AIImage';
import SmartQuiz from './tools/SmartQuiz';
import LanguageLearn from './tools/LanguageLearn';
import MediaDownloader from './tools/MediaDownloader';
import { JSONTools, Base64Tools } from './tools/DevTools';
import { PasswordGenerator, QRGenerator, TextAnalytics } from './tools/GeneralTools';

const AboutPage = () => (
  <div className="max-w-4xl mx-auto space-y-12">
    <div className="space-y-6">
      <h1 className="text-5xl font-black tracking-tighter uppercase">Necro <span className="text-cyan-500">Architecture</span></h1>
      <p className="text-xl text-white/60 leading-relaxed">
        NecroTools is a high-performance utility ecosystem designed for developers, engineers, and digital creative professionals. 
        Our philosophy centers on architectural honesty—providing real-time tools without synthetic delays or redundant overhead.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-card p-10 space-y-4">
        <h3 className="text-lg font-bold uppercase tracking-tight text-cyan-500">Core Principles</h3>
        <p className="text-sm text-white/50 leading-relaxed italic">
          "Zero latency in thought leads to excellence in execution. We provide the substrate for your digital workflows."
        </p>
      </div>
      <div className="glass-card p-10 space-y-4">
        <h3 className="text-lg font-bold uppercase tracking-tight text-white">Global Distribution</h3>
        <p className="text-sm text-white/50 leading-relaxed font-mono">
          Engineered as a Progressive Web Application (PWA) for native-feel deployment across any hardware interface.
        </p>
      </div>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto space-y-12 py-10">
    <h1 className="text-4xl font-black uppercase tracking-tighter">Privacy Protocol</h1>
    <div className="prose prose-invert max-w-none space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-bold border-b border-white/10 pb-2">1. Data Locality</h3>
        <p className="text-white/60">
          NecroTools prioritizes local data residency. Chat histories, configuration settings, and utility buffers are stored exclusively 
          within your browser's LocalStorage and SessionStorage. No user telemetry is harvested for commercial resale.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-xl font-bold border-b border-white/10 pb-2">2. Processing Logic</h3>
        <p className="text-white/60">
          Computational logic (Base64, Case Conversion, Password Generation) occurs client-side. OSINT lookups and neural modules 
          utilize secure encryption-in-transit (TLS 1.3) to interact with specialized API nodes.
        </p>
      </section>
      <section className="space-y-4 text-center py-10 border-2 border-dashed border-white/5 rounded-sm">
        <Shield className="mx-auto text-cyan-500 mb-4" size={48} />
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">Necro Privacy Guard Active</p>
      </section>
    </div>
  </div>
);

import { StalkWA, StalkIG, NetworkAuditor } from './tools/IntelTools';
import { HashFactory, ScreenCapture, DeviceDiagnostic } from './tools/SystemTools';

// ---- Main App Component ----

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/3 relative">
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="md:ml-80 flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <div className="flex-1 p-5 md:p-14 max-w-screen-2xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<SystemNode title="Enterprise Inquiries" />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/faq" element={<SystemNode title="Frequently Asked Questions" />} />
              
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/ai-image" element={<AIImage />} />
              <Route path="/quiz" element={<SmartQuiz />} />
              <Route path="/lang-learn" element={<LanguageLearn />} />
              
              <Route path="/tiktok-dl" element={<MediaDownloader type="TIKTOK" />} />
              <Route path="/youtube-dl" element={<MediaDownloader type="YOUTUBE" />} />
              <Route path="/spotify-dl" element={<MediaDownloader type="SPOTIFY" />} />
              <Route path="/ig-dl" element={<MediaDownloader type="INSTAGRAM" />} />

              <Route path="/json-format" element={<JSONTools />} />
              <Route path="/base64" element={<Base64Tools />} />
              <Route path="/hash" element={<HashFactory />} />
              
              <Route path="/pass-gen" element={<PasswordGenerator />} />
              <Route path="/qr-gen" element={<QRGenerator />} />
              <Route path="/word-count" element={<TextAnalytics />} />

              <Route path="/ip-info" element={<StalkWA />} />
              <Route path="/ig-stalk" element={<StalkIG />} />
              <Route path="/site-audit" element={<NetworkAuditor />} />
              
              <Route path="/capture" element={<ScreenCapture />} />
              <Route path="/cam-test" element={<DeviceDiagnostic type="CAM" />} />
              <Route path="/mic-test" element={<DeviceDiagnostic type="MIC" />} />

              {/* Dynamic routes for remaining tools */}
              {TOOLS.filter(t => ![
                'ai-chat', 'ai-image', 'quiz', 'lang-learn', 
                'tiktok-dl', 'youtube-dl', 'spotify-dl', 'ig-dl',
                'json-format', 'base64', 'hash', 'pass-gen', 'qr-gen', 'word-count',
                'ip-info', 'ig-stalk', 'site-audit', 'capture', 'cam-test', 'mic-test'
              ].includes(t.id)).map(tool => (
                <Route key={tool.id} path={tool.path} element={<SystemNode title={tool.name} />} />
              ))}
            </Routes>
          </div>


          <footer className="p-10 border-t border-white/5 bg-[#050505] mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                  <span className="text-black text-[10px] font-bold">NT</span>
                </div>
                <span className="text-sm font-bold tracking-tighter">NECROTOOLS © 2024</span>
              </div>
              <div className="flex gap-6 text-xs text-white/30 uppercase tracking-widest font-bold">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/faq" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
                <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">GitHub <ExternalLink size={12} /></a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
}


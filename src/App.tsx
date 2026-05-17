import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Users, 
  User, 
  Terminal, 
  Search as SearchIcon,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { loginWithGoogle } from './lib/firebase';

// Components
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import UsageHistory from './components/UsageHistory';
import GroupChat from './components/GroupChat';
import Profile from './components/Profile';
import TechTools from './components/TechTools';
import BootScreen from './components/BootScreen';
import LoginOverlay from './components/LoginOverlay';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai' | 'history' | 'group' | 'profile' | 'tools'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const { user, profile, loading, isAdmin, isOwner } = useAuth();

  // Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  if (profile?.status === 'banned') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6 animate-bounce" />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-red-500">Access Denied</h1>
        <p className="text-white/40 font-mono text-sm max-w-md">
          Account ID: {profile.uid.substring(0, 8)} has been restricted due to policy violations.
        </p>
        <div className="mt-8 pt-8 border-t border-white/5 w-full max-w-xs flex justify-between text-[10px] text-white/20 uppercase font-mono">
          <span>Policy Violation</span>
          <span>Code: 111</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 overflow-hidden flex flex-col",
      isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
    )}>
      <AnimatePresence>
        {!user && <LoginOverlay onLogin={handleLogin} />}
      </AnimatePresence>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 sm:pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" onNavigateTools={(tab) => setActiveTab(tab as any)} />}
          {activeTab === 'ai' && <AIChat key="ai" />}
          {activeTab === 'history' && <UsageHistory key="history" />}
          {activeTab === 'group' && <GroupChat key="group" />}
          {activeTab === 'profile' && <Profile key="profile" setTheme={setIsDarkMode} isDark={isDarkMode} />}
          {activeTab === 'tools' && <TechTools key="tools" />}
        </AnimatePresence>
      </main>

      {/* Floating Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 p-1.5 glass-card shadow-2xl shadow-cyan-500/20">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'ai', icon: MessageSquare, label: 'AI' },
          { id: 'history', icon: History, label: 'History' },
          { id: 'group', icon: Users, label: 'Group' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 group",
              activeTab === tab.id ? "bg-white/10 text-cyan-400" : "text-white/40 hover:text-white/70 hover:bg-white/5"
            )}
          >
            <tab.icon size={22} className={cn(activeTab === tab.id && "animate-pulse")} />
            {activeTab === tab.id && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-4">
                <SearchIcon className="text-white/20" size={20} />
                <input
                  autoFocus
                  placeholder="Search for tools or documentation..."
                  className="bg-transparent border-none outline-none w-full font-mono text-lg py-2"
                />
                <kbd className="hidden sm:block px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40">ESC</kbd>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                <div className="px-3 py-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Recommended Tools</div>
                {['JSON Formatter', 'Base64 Converter', 'Regex Tester', 'IP Lookup', 'Password Gen'].map((item, i) => (
                  <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left group">
                    <Terminal size={16} className="text-white/20 group-hover:text-cyan-500" />
                    <span className="text-sm font-medium">{item}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

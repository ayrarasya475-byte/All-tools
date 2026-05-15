import { useState, useEffect } from 'react';
import { Timer, Brain, CheckCircle2, XCircle, Trophy, RefreshCw, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  category: string;
}

export default function SmartQuiz() {
  const [gameState, setGameState] = useState<'IDLE' | 'SCRAPING' | 'PLAYING' | 'RESULT'>('IDLE');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [scrapedData, setScrapedData] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('RESULT');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const generateQuestions = async () => {
    setGameState('SCRAPING');
    setError(null);
    const addLog = (msg: string) => setScrapedData(prev => [...prev, msg]);
    
    try {
        addLog('Accessing core intelligence nodes...');
        addLog('Retrieving dynamic assessment curriculum...');
        
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent("Generate 15 challenging general knowledge and IQ questions. Each question must have exactly 4 options. Output ONLY a valid JSON array of objects with this structure: { id: number, question: string, options: string[], answer: number (index 0-3), category: string }. Mix categories like Math, Science, History, and Logic. Do not include any text before or after the JSON.")}?model=openai`);

        const dataStr = await response.text();
        // Clean potential markdown code blocks
        const jsonStr = dataStr.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        
        if (Array.isArray(parsed)) {
            setQuestions(parsed);
            addLog(`Successfully compiled ${parsed.length} logic nodes.`);
            setTimeout(() => setGameState('PLAYING'), 1500);
        } else {
            throw new Error("Invalid neural buffer format.");
        }
    } catch (err) {
        addLog(`CRITICAL_FAILURE: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setError("Failed to initialize intelligence matrix.");
    }
  };

  const handleAnswer = (idx: number) => {
    const newSelected = [...selectedAnswers];
    newSelected[currentIdx] = idx;
    setSelectedAnswers(newSelected);
    
    if (idx === questions[currentIdx].answer) {
      setScore(prev => prev + 1);
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameState('RESULT');
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {gameState === 'IDLE' && (
          <motion.div key="idle" className="glass-card p-12 text-center space-y-10 bg-[#0a0a0a]">
            <div className="w-24 h-24 bg-cyan-500/10 border border-cyan-500/20 rounded-sm flex items-center justify-center mx-auto text-cyan-500">
              <Brain size={48} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Logic Intelligence Audit</h1>
              <p className="text-[10px] text-white/30 font-black mt-4 uppercase tracking-[0.4em] leading-relaxed max-w-md mx-auto">
                Validated Evaluation Metric: Dynamic Complexity Matrix <br/>
                Temporal Constraint: 3600S Global Timer Active
              </p>
            </div>
            <button 
              onClick={generateQuestions}
              className="bg-white text-black font-black px-12 py-5 uppercase tracking-[0.3em] text-xs hover:bg-cyan-500 transition-all rounded-sm active:scale-[0.98]"
            >
              Initialize Audit
            </button>
          </motion.div>
        )}

        {gameState === 'SCRAPING' && (
          <motion.div key="scraping" className="glass-card p-12 space-y-6 min-h-[400px] flex flex-col justify-center">
            <div className="flex items-center gap-4 text-cyan-500 animate-pulse mb-6">
              <Globe size={24} />
              <span className="font-mono font-bold tracking-widest uppercase text-sm">Compiling Neural Modules...</span>
            </div>
            <div className="space-y-2">
              {scrapedData.map((log, i) => (
                <motion.p 
                  initial={{ x: -10, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  key={i} 
                  className="font-mono text-[10px] text-white/50 border-l-2 border-cyan-500/30 pl-4 py-1"
                >
                  {`> ${log}`}
                </motion.p>
              ))}
              {error && (
                <p className="text-red-500 font-mono text-[10px] uppercase mt-4">{error}</p>
              )}
            </div>
          </motion.div>
        )}

        {gameState === 'PLAYING' && questions[currentIdx] && (
          <motion.div key="playing" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-black p-6 rounded-sm border border-white/10 gap-6">
              <div className="flex items-center gap-4">
                <Timer size={18} className="text-cyan-500" />
                <span className="font-mono font-black text-xl tracking-tighter">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex-1 max-w-md space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[8px] uppercase font-black text-white/30 tracking-[0.3em]">Complexity_Sync</span>
                  <span className="font-mono text-[10px] text-cyan-500/60 font-black">{currentIdx + 1} // {questions.length}_NODES</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-sm overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentIdx / questions.length) * 100}%` }}
                    className="h-full bg-cyan-500" 
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-10 space-y-10 bg-[#0a0a0a]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-cyan-500" />
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">
                    Unit_{questions[currentIdx].category}_Processing
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter leading-tight text-white uppercase italic">
                  {questions[currentIdx].question}
                </h2>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="p-6 bg-black border border-white/10 rounded-sm text-left hover:border-cyan-500/50 transition-all group relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/30 group-hover:text-cyan-500 group-hover:border-cyan-500/30 transition-all">
                        0{i+1}
                      </div>
                      <span className="text-sm font-black uppercase tracking-wide group-hover:text-white transition-colors">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div key="result" className="glass-card p-12 text-center space-y-10 bg-[#0a0a0a]">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-sm border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-500">
              <Trophy size={48} strokeWidth={1} />
            </div>
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic">METRIC_REPORT_FINAL</h1>
              <p className="text-[10px] text-white/30 font-black mt-4 uppercase tracking-[0.4em]">Audit Termination Sequence Complete</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black p-8 rounded-sm border border-white/5">
                <p className="text-[8px] text-white/20 uppercase font-black tracking-[0.3em] mb-4">SUCCESS_RATIO</p>
                <p className="text-4xl font-black text-cyan-500 tracking-tighter">{score}<span className="text-white/20 text-xl italic underline">/{questions.length}</span></p>
              </div>
              <div className="bg-black p-8 rounded-sm border border-white/5">
                <p className="text-[8px] text-white/20 uppercase font-black tracking-[0.3em] mb-4">PRECISION_CORE</p>
                <p className="text-4xl font-black text-white tracking-tighter">{Math.round((score/questions.length)*100)}<span className="text-white/20 text-xl font-normal">%</span></p>
              </div>
              <div className="bg-black p-8 rounded-sm border border-white/5">
                <p className="text-[8px] text-white/20 uppercase font-black tracking-[0.3em] mb-4">TEMPORAL_RESIDUE</p>
                <p className="text-4xl font-black text-white/60 tracking-tighter">{formatTime(timeLeft)}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setGameState('IDLE');
                setCurrentIdx(0);
                setScore(0);
                setTimeLeft(3600);
                setSelectedAnswers([]);
                setQuestions([]);
              }}
              className="bg-white text-black font-black px-12 py-5 uppercase tracking-[0.4em] text-xs hover:bg-cyan-500 transition-all rounded-sm flex items-center justify-center gap-4 mx-auto"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
              REBOOT_AUDIT_PROTOCOL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  BookOpen, 
  Cpu, 
  Database, 
  Workflow, 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Award
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { TabType, ModuleContent } from "./types";
import { CONTENT, SIM_READ_STEPS, SIM_ARB_STEPS, QUIZ_QUESTIONS } from "./constants";

// --- UI Components ---

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }: any) => {
  const variants: any = {
    primary: "bg-primary-purple text-white shadow-purple hover:scale-105 active:scale-95",
    secondary: "bg-vibrant-green text-neutral-900 font-bold hover:scale-105 active:scale-95",
    outline: "border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white",
    ghost: "text-neutral-500 hover:text-neutral-900"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", bgColor = "bg-white" }: any) => (
  <div className={`rounded-xl-card p-8 ${bgColor} ${className}`}>
    {children}
  </div>
);

const FloatingDoodle = ({ color, className }: any) => (
  <motion.div
    animate={{ 
      y: [0, -10, 0],
      rotate: [0, 5, 0]
    }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute pointer-events-none opacity-20 ${className}`}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M5 20C5 20 10 5 20 5C30 5 35 20 35 20" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="30" r="3" fill={color} />
    </svg>
  </motion.div>
);

// --- Component Content Renderers ---

const IsometricChip = ({ label, color = "bg-neutral-800", active = false, status = "", subLabel = "" }: any) => (
  <motion.div
    animate={active ? { 
      y: -12, 
      scale: 1.1,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
    } : { 
      y: 0, 
      scale: 1,
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`relative w-28 h-28 md:w-32 md:h-32 ${color} rounded-2xl flex flex-col items-center justify-center text-white font-bold transition-all duration-500 overflow-hidden group`}
    style={{ transform: "rotateX(45deg) rotateZ(-45deg)" }}
  >
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <svg width="100%" height="100%" className="w-full h-full">
        <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 10 10 M 0 10 L 20 10" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="10" cy="10" r="1.5" fill="white" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>

    {active && (
      <motion.div
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute inset-0 bg-white"
      />
    )}

    <div className="relative z-10 [transform:rotateZ(45deg)rotateX(-45deg)] flex flex-col items-center">
      <span className="text-sm md:text-lg tracking-widest">{label}</span>
      {subLabel && <span className="text-[10px] opacity-60">{subLabel}</span>}
      {active && status && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[8px] bg-white text-neutral-900 px-2 py-0.5 rounded mt-2 uppercase font-black"
        >
          {status}
        </motion.span>
      )}
    </div>

    <div className="absolute bottom-0 left-0 w-full h-2 bg-black/40 translate-y-2 rounded-b-2xl -z-10" />
    <div className="absolute top-0 right-0 w-2 h-full bg-black/20 translate-x-2 rounded-r-2xl -z-10" />
  </motion.div>
);

const BusLane = ({ label, color, width, active, dataFlow }: any) => {
  const isToRight = dataFlow === 'toRight';
  
  // Stronger gradient with a light hot-core for better visibility
  const gradientClass = isToRight 
    ? `bg-gradient-to-r from-transparent via-white/50 ${color} to-transparent`
    : `bg-gradient-to-l from-transparent via-white/50 ${color} to-transparent`;

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl px-8">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? color.replace('bg-','text-') : 'text-neutral-400'}`}>{label}</span>
          {active && (
            <motion.div 
              animate={{ x: isToRight ? [0, 5, 0] : [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className={active ? color.replace('bg-','text-') : 'text-neutral-400'}
            >
              {isToRight ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
            </motion.div>
          )}
        </div>
        {active && <span className="text-[8px] font-mono animate-pulse uppercase tracking-widest opacity-90 text-white">Signal High</span>}
      </div>
      <div className={`h-${width} w-full rounded-2xl bg-black relative border-2 border-neutral-800 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
        {active && (
          <>
            {/* Directional BG Pattern */}
            <div className="absolute inset-0 opacity-30 flex">
               {Array.from({ length: 12 }).map((_, i) => (
                 <motion.div 
                  key={i} 
                  animate={{ opacity: [0.3, 0.7, 0.3] }} 
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  className="flex-1 flex justify-center items-center"
                 >
                   {isToRight ? <ChevronRight size={10} className="text-white/20" /> : <ChevronLeft size={10} className="text-white/20" />}
                 </motion.div>
               ))}
            </div>

            {/* High Intensity Pulses with Solid Core */}
            {[0, 1, 2].map((i) => (
              <motion.div 
                key={i}
                initial={{ left: isToRight ? "-40%" : "140%" }}
                animate={isToRight ? { left: ["-40%", "140%"] } : { left: ["140%", "-40%"] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  delay: i * 0.5,
                  ease: "linear"
                }}
                className={`absolute top-0 h-full w-56 opacity-100 ${gradientClass} flex items-center justify-center`} 
              >
                 {/* The "Hot Bit" Core - Sharp and Bright */}
                 <div className="w-1.5 h-full bg-white shadow-[0_0_15px_#fff,0_0_30px_rgba(255,255,255,0.5)]" />
                 <div className="absolute w-6 h-full bg-white/20 blur-md" />
              </motion.div>
            ))}
            
            {/* Active glow base */}
            <div className={`absolute inset-0 opacity-[0.2] ${color} animate-pulse`} />
          </>
        )}
      </div>
    </div>
  );
};

const Simulator = ({ steps, activeStep, type, onStepComplete }: { steps: string[], activeStep: number, type: 'read' | 'arb', onStepComplete?: () => void }) => {
  const isRead = type === 'read';
  const isFinalStep = activeStep === steps.length - 1;
  
  const getSignals = () => {
    if (isRead) {
      if (activeStep === 0) return ["FRAME# (LOW)", "AD (ADDR)", "C/BE# (READ)"];
      if (activeStep === 1) return ["IRDY# (READY)"];
      if (activeStep === 2) return ["DEVSEL# (CLAIM)", "AD (DATA-1)"];
      if (activeStep === 3) return ["TRDY# (VALID)"];
      if (activeStep === 4) return ["IDLE (DISCONNECT)"];
    } else {
      if (activeStep === 0) return ["REQ-A# (REQ)", "GNT-A# (GRANT)"];
      if (activeStep === 1) return ["REQ-B# (PENDING)"];
      if (activeStep === 2) return ["GNT-A (RESCIND)", "GNT-B (GRANT)"];
      if (activeStep === 3) return ["FRAME# (MASTER B)", "BUS BUSY"];
    }
    return [];
  };

  if (!isRead && isFinalStep) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-neutral-900 rounded-[40px] p-10 border-4 border-neutral-800 shadow-2xl overflow-hidden">
          <div className="flex flex-col gap-12 relative z-10">
            {/* Master Units */}
            <div className="flex justify-between items-center px-4">
              <IsometricChip label="MOD A" color="bg-neutral-800" active={false} subLabel="Master" />
              <IsometricChip label="MOD B" color="bg-primary-purple" active={true} subLabel="Master" />
              <IsometricChip label="MOD C" color="bg-neutral-800" active={false} subLabel="Master" />
            </div>

            {/* The Shared Bus */}
            <div className="relative w-full h-12 bg-neutral-800 rounded-2xl border-2 border-neutral-700 flex items-center px-6">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-vibrant-green tracking-[0.3em]">SHARED PCI PATHWAY</div>
              
              {/* Traffic visualization */}
              <div className="flex-1 flex justify-around">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                    className="w-1 h-4 bg-vibrant-green/40 rounded-full"
                  />
                ))}
              </div>

              {/* Data Flow from B to Bus */}
              <motion.div 
                animate={{ y: [-40, 0], opacity: [0, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute left-1/2 top-0 w-1.5 h-10 bg-vibrant-green blur-[2px]"
              />
            </div>

            {/* The Arbiter at the center bottom */}
            <div className="flex flex-col items-center">
              <div className="h-10 w-1 bg-neutral-700 border-dashed border-l-2" />
              <IsometricChip label="ARBITER" color="bg-vibrant-green" active={true} status="BUS MANAGER" />
              
              {/* Request lines connections visual */}
              <div className="flex gap-20 mt-4">
                <div className="text-[7px] font-mono text-neutral-500">REQ# A, B, C</div>
                <div className="text-[7px] font-mono text-vibrant-green">GNT# B (ACTIVE)</div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="mt-8 text-center max-w-lg">
          <p className="text-sm font-bold text-neutral-600 italic">"{steps[activeStep]}"</p>
          <div className="mt-4 flex gap-4">
            <Button variant="outline" onClick={() => onStepComplete && onStepComplete()} className="border-vibrant-green text-vibrant-green hover:bg-vibrant-green hover:text-black">
              Simulasi Selesai <CheckCircle2 size={16} className="inline ml-2" />
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()} className="bg-neutral-800 text-white">
              Ulangi Pembelajaran <RotateCcw size={16} className="inline ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center py-10 scale-95 md:scale-100">
      <div className="grid grid-cols-3 gap-8 md:gap-20 items-center justify-center perspective-1000">
        <IsometricChip 
          label={isRead ? "CPU" : "MOD A"} 
          color="bg-primary-purple" 
          active={isRead ? activeStep < 4 : activeStep === 0 || activeStep === 2} 
          status={isRead ? (activeStep < 4 ? "MASTER" : "IDLE") : (activeStep === 0 ? "OWNER" : "WAIT")} 
        />
        
        <div className="flex flex-col gap-4 items-center">
          <div className="h-3 w-40 bg-neutral-900 rounded-full relative overflow-hidden border-2 border-neutral-800 shadow-inner">
             {activeStep > 0 && activeStep < 4 && (
               <motion.div 
                 animate={{ left: isRead && activeStep > 1 ? ["100%", "0%"] : ["0%", "100%"] }}
                 transition={{ repeat: Infinity, duration: 1.2 }}
                 className="absolute top-0 h-full w-16 bg-vibrant-green shadow-[0_0_15px_#AAE500] blur-[1px]"
               />
             )}
          </div>
          <div className="flex flex-col gap-1 w-full">
             {getSignals().map((s, i) => (
               <motion.div 
                 key={activeStep + i} 
                 initial={{ opacity: 0, x: -10 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 className="text-[8px] bg-neutral-900 border border-vibrant-green/30 text-vibrant-green px-3 py-1 rounded-full font-mono text-center flex items-center justify-center gap-2"
               >
                 <div className="w-1 h-1 rounded-full bg-vibrant-green animate-pulse" />
                 {s}
               </motion.div>
             ))}
          </div>
        </div>

        <IsometricChip 
          label={isRead ? "MEMORY" : "MOD B"} 
          color={activeStep >= 2 ? (isRead ? "bg-hot-pink" : "bg-primary-purple") : "bg-neutral-800"} 
          active={isRead ? activeStep >= 2 && activeStep < 4 : activeStep >= 1} 
          status={isRead ? (activeStep >= 2 && activeStep < 4 ? "RESPONDING" : "IDLE") : (activeStep >= 3 ? "OWNER" : "REQ")} 
        />
      </div>

      {!isRead && (
        <div className="mt-12 flex flex-col items-center">
           <div className="h-10 w-0.5 bg-neutral-300 border-dashed border-l-2 mb-2" />
           <IsometricChip label="ARBITER" color="bg-vibrant-green" active={true} status="DECIDING" subLabel="Centralized" />
           <p className="text-[10px] font-black mt-4 text-neutral-400 tracking-widest">PCI BUS ARBITRATION</p>
        </div>
      )}

      <div className="mt-12 w-full max-w-lg bg-white border-2 border-neutral-100 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-purple via-vibrant-green to-hot-pink" />
        <p className="text-sm font-bold text-center italic text-neutral-700 leading-relaxed px-4">"{steps[activeStep]}"</p>
        <Button variant="secondary" onClick={onStepComplete} className="w-full shadow-lg">
           Lanjutkan Siklus Clock <Play size={16} className="inline ml-2" />
        </Button>
      </div>
    </div>
  );
};


// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INTERACTION);
  const [currentStep, setCurrentStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<Set<TabType>>(new Set());
  
  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const module = useMemo(() => CONTENT.find(c => c.id === activeTab), [activeTab]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPciDevice, setSelectedPciDevice] = useState<string | null>(null);

  const pciDevices = {
    graphics: {
      name: "Graphics Card",
      desc: "Memerlukan bandwidth tinggi. PCI Bridge mengalokasikan jalur data prioritas untuk transfer video frame yang cepat.",
      color: "bg-vibrant-green"
    },
    network: {
      name: "Network Card",
      desc: "Menangani paket data eksternal. PCI Bridge memastikan interupsi data jaringan tidak mengganggu CPU utama.",
      color: "bg-blue-400"
    },
    usb: {
      name: "USB Host",
      desc: "Menghubungkan berbagai perangkat lambat. PCI Bridge menggabungkan data dari banyak port USB ke satu aliran PCI.",
      color: "bg-hot-pink"
    }
  };

  const handleNext = () => {
    const totalSteps = activeTab === TabType.SIM_READ ? SIM_READ_STEPS.length : 
                      activeTab === TabType.SIM_ARB ? SIM_ARB_STEPS.length : 
                      (module?.steps.length || 0);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      const tabOrder = Object.values(TabType);
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex < tabOrder.length - 1) {
        setCompletedTabs(prev => new Set(prev).add(activeTab));
        // The Simulator component for Arbitration handles its own completion visual.
        setActiveTab(tabOrder[currentIndex + 1]);
        setCurrentStep(0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else {
      const tabOrder = Object.values(TabType);
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabOrder[currentIndex - 1]);
        setCurrentStep(0);
      }
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentStep(0);
    setSidebarOpen(false);
  };

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) score += 25;
    });
    setQuizScore(score);
    setQuizFinished(true);
    setCompletedTabs(prev => new Set(prev).add(TabType.QUIZ));
  };

  const getIcon = (type: TabType) => {
    switch (type) {
      case TabType.INTERACTION: return <Workflow size={20} />;
      case TabType.STRUCTURE: return <Database size={20} />;
      case TabType.DESIGN: return <Cpu size={20} />;
      case TabType.PCI: return <Zap size={20} />;
      case TabType.SIM_READ: return <Play size={20} />;
      case TabType.SIM_ARB: return <RotateCcw size={20} />;
      case TabType.QUIZ: return <Award size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row font-sans text-neutral-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white px-6 py-4 flex justify-between items-center border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-vibrant-green rounded-lg flex items-center justify-center font-bold">B</div>
          <span className="font-black text-xl">BusMaster</span>
        </div>
        <button onClick={() => setSidebarOpen(true)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 md:relative md:translate-x-0 w-80 flex-shrink-0 flex flex-col border-r border-neutral-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vibrant-green rounded-xl flex items-center justify-center font-black text-xl">B</div>
            <span className="font-black text-2xl tracking-tight">BusMaster</span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {Object.values(TabType).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab 
                  ? "bg-primary-purple text-white shadow-purple" 
                  : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              {getIcon(tab)}
              <span className="capitalize">{tab.replace('_', ' ')}</span>
              {completedTabs.has(tab) && <CheckCircle2 size={16} className="ml-auto text-vibrant-green" />}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="bg-neutral-900 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-sm text-neutral-400 mb-1">Your Progress</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black">{Math.round((completedTabs.size / 7) * 100)}%</span>
                <span className="text-neutral-500 text-xs mb-1">Completed</span>
              </div>
              <div className="mt-3 h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-vibrant-green transition-all duration-1000" 
                  style={{ width: `${(completedTabs.size / 7) * 100}%` }}
                />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-neutral-800 rounded-full opacity-50" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col gap-8 overflow-y-auto max-w-6xl mx-auto w-full">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
              {activeTab === TabType.QUIZ ? "Uji Pengetahuan" : module?.title || activeTab.replace('_', ' ').toUpperCase()}
            </h1>
            <p className="text-neutral-500 font-medium">{module?.description || "Simulasi interaktif sistem bus."}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          
          {/* Left Panel: Theory/Description */}
          <div className="lg:col-span-12 flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
              
              <Card className="flex-1 flex flex-col justify-between relative overflow-hidden" bgColor="bg-white">
                <FloatingDoodle color="#7452FF" className="top-10 right-10" />
                <div className="relative z-10">
                  {activeTab === TabType.QUIZ ? (
                    <div className="space-y-8">
                      {!quizStarted ? (
                        <div className="text-center py-12">
                          <Award size={64} className="mx-auto mb-6 text-primary-purple" />
                          <h2 className="text-3xl font-black mb-4">Siap untuk Kuis?</h2>
                          <p className="text-neutral-500 mb-8 max-w-md mx-auto">Selesaikan 4 pertanyaan untuk menguji pemahaman Anda tentang Sistem Bus.</p>
                          <Button onClick={() => setQuizStarted(true)}>Mulai Sekarang</Button>
                        </div>
                      ) : quizFinished ? (
                        <div className="text-center py-12">
                          <div className="text-7xl font-black text-vibrant-green mb-4">{quizScore}</div>
                          <h2 className="text-3xl font-black mb-2">Luar Biasa!</h2>
                          <p className="text-neutral-500 mb-8">Anda telah menyelesaikan materi Interkoneksi Bus.</p>
                          <Button onClick={() => { setQuizStarted(false); setQuizFinished(false); setUserAnswers({}); }}>Ulangi Kuis</Button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {QUIZ_QUESTIONS.map((q, idx) => (
                            <div key={q.id} className="space-y-4">
                              <h3 className="font-bold text-lg">{idx + 1}. {q.question}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                                    className={`p-4 rounded-2xl text-left border-2 transition-all font-medium ${
                                      userAnswers[q.id] === optIdx 
                                        ? "border-primary-purple bg-primary-purple/5" 
                                        : "border-neutral-100 hover:border-neutral-200"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div className="pt-8">
                            <Button onClick={submitQuiz} className="w-full md:w-auto">Submit Jawaban</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <span className="bg-vibrant-green/20 text-vibrant-green px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                          STEP {currentStep + 1}
                        </span>
                        <h2 className="text-3xl font-black mt-4 mb-4">
                          {activeTab.includes('sim') ? "Panduan Simulasi" : module?.steps[currentStep].title}
                        </h2>
                        <p className="text-neutral-600 text-lg leading-relaxed">
                          {activeTab === TabType.SIM_READ ? SIM_READ_STEPS[currentStep] : 
                           activeTab === TabType.SIM_ARB ? SIM_ARB_STEPS[currentStep] :
                           module?.steps[currentStep].content}
                        </p>
                      </div>
                      
                      {/* Interactive Visual Right Side if needed or Bottom */}
                      <div className="bg-neutral-50 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
                        {(() => {
                          const playState = isPlaying ? "running" : "paused";
                          switch (activeTab) {
                            case TabType.STRUCTURE:
                              if (currentStep === 1) {
                                return (
                                  <div className="w-full flex flex-col items-center gap-2 py-4">
                                    <div className="relative w-full max-w-xl bg-neutral-950 rounded-3xl p-6 shadow-2xl border-2 border-neutral-800">
                                       {/* Hierarchy structure */}
                                       <div className="flex flex-col gap-2">
                                          {/* Local Bus */}
                                          <div className="flex items-center gap-4">
                                             <div className="w-28 py-2 bg-primary-purple text-white text-[10px] font-black rounded text-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">LOCAL BUS</div>
                                             <div className="flex-1 h-1.5 bg-neutral-900 rounded-full relative overflow-hidden">
                                                {isPlaying && [0, 1].map(i => (
                                                  <motion.div 
                                                    key={i}
                                                    initial={{ left: "-20%" }}
                                                    animate={{ left: ["-20%", "120%"] }} 
                                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.4, ease: "linear" }} 
                                                    className="absolute top-0 h-full w-10 bg-primary-purple shadow-[0_0_10px_#A855F7] rounded-full" 
                                                  />
                                                ))}
                                             </div>
                                             <div className="px-3 py-1 bg-white/10 text-white text-[8px] rounded font-bold border border-white/20">CPU</div>
                                          </div>
                                          <div className="h-4 border-l-2 border-dashed border-neutral-700 ml-14"></div>
                                          
                                          {/* System Bus */}
                                          <div className="flex items-center gap-4">
                                             <div className="w-28 py-2 bg-vibrant-green text-black text-[10px] font-black rounded text-center shadow-[0_0_15px_rgba(170,229,0,0.4)]">SYSTEM BUS</div>
                                             <div className="flex-1 h-1.5 bg-neutral-900 rounded-full relative overflow-hidden">
                                                {isPlaying && [0, 1].map(i => (
                                                  <motion.div 
                                                    key={i}
                                                    initial={{ left: "-20%" }}
                                                    animate={{ left: ["-20%", "120%"] }} 
                                                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.6, ease: "linear" }} 
                                                    className="absolute top-0 h-full w-10 bg-vibrant-green shadow-[0_0_10px_#AAE500] rounded-full" 
                                                  />
                                                ))}
                                             </div>
                                             <div className="px-3 py-1 bg-white/10 text-white text-[8px] rounded font-bold border border-white/20">MEMORY</div>
                                          </div>
                                          <div className="h-4 border-l-2 border-dashed border-neutral-700 ml-14"></div>

                                          {/* High Speed Bus */}
                                          <div className="flex items-center gap-4">
                                             <div className="w-28 py-2 bg-blue-500 text-white text-[10px] font-black rounded text-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">HIGH-SPEED</div>
                                             <div className="flex-1 h-1.5 bg-neutral-900 rounded-full relative overflow-hidden">
                                                {isPlaying && [0, 1].map(i => (
                                                  <motion.div 
                                                    key={i}
                                                    initial={{ left: "-20%" }}
                                                    animate={{ left: ["-20%", "120%"] }} 
                                                    transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.9, ease: "linear" }} 
                                                    className="absolute top-0 h-full w-10 bg-blue-500 shadow-[0_0_10px_#3B82F6] rounded-full" 
                                                  />
                                                ))}
                                             </div>
                                             <div className="px-3 py-1 bg-white/10 text-white text-[8px] rounded font-bold border border-white/20">GPU</div>
                                          </div>
                                          <div className="h-4 border-l-2 border-dashed border-neutral-700 ml-14"></div>

                                          {/* Expansion Bus */}
                                          <div className="flex items-center gap-4">
                                             <div className="w-28 py-2 bg-hot-pink text-white text-[10px] font-black rounded text-center shadow-[0_0_15px_rgba(255,75,162,0.4)]">EXPANSION</div>
                                             <div className="flex-1 h-1.5 bg-neutral-900 rounded-full relative overflow-hidden">
                                                {isPlaying && [0, 1].map(i => (
                                                  <motion.div 
                                                    key={i}
                                                    initial={{ left: "-20%" }}
                                                    animate={{ left: ["-20%", "120%"] }} 
                                                    transition={{ repeat: Infinity, duration: 3, delay: i * 1.5, ease: "linear" }} 
                                                    className="absolute top-0 h-full w-10 bg-hot-pink shadow-[0_0_10px_#FF4BA2] rounded-full" 
                                                  />
                                                ))}
                                             </div>
                                             <div className="px-3 py-1 bg-white/10 text-white text-[8px] rounded font-bold border border-white/20">USB/I/O</div>
                                          </div>
                                       </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-neutral-400 mt-4 uppercase tracking-widest">Multiple Bus Hierarchy: Menghindari Bottleneck System</p>
                                  </div>
                                );
                              }
                              return (
                                <div className="w-full flex flex-col items-center gap-4 py-6">
                                  <div className="flex gap-16 md:gap-24 mb-10">
                                     <IsometricChip label="CPU" color="bg-primary-purple" active={isPlaying} status="Master" />
                                     <IsometricChip label="MEMORY" color="bg-neutral-800" status="Slave" />
                                  </div>
                                  <BusLane label="Bus Data (Data Transfer)" color="bg-primary-purple" width={6} active={isPlaying} dataFlow="toRight" />
                                  <BusLane label="Bus Alamat (Memory Address)" color="bg-vibrant-green" width={4} active={isPlaying} dataFlow="toRight" />
                                  <BusLane label="Bus Kontrol (Timing Signals)" color="bg-hot-pink" width={2} active={isPlaying} dataFlow="toLeft" />
                                  <div className="mt-6 p-4 bg-white rounded-2xl border-2 border-neutral-100 text-center">
                                     <p className="text-xs text-neutral-500 italic max-w-xs">Animasi menunjukkan aliran data bit-per-bit melalui tiga jalur sistem bus utama.</p>
                                  </div>
                                </div>
                              );
                            
                            case TabType.DESIGN:
                              return (
                                <div className="w-full flex flex-col items-center gap-12 py-10">
                                  <div className="flex flex-col md:flex-row gap-10 w-full max-w-2xl">
                                     {/* Synchronous Block */}
                                     <div className="flex-1 bg-white p-6 rounded-3xl border-2 border-neutral-100 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-6">
                                           <p className="text-[10px] font-black tracking-tighter text-primary-purple bg-primary-purple/10 px-3 py-1 rounded-full uppercase">Synchronous Timing</p>
                                           <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-vibrant-green animate-pulse' : 'bg-neutral-300'}`} />
                                        </div>
                                        <div className="h-24 flex items-end gap-1 px-4">
                                           {[1,2,3,4,5,6,7,8,9,10].map(i => (
                                             <motion.div 
                                                key={i} 
                                                animate={isPlaying ? { height: [10, 60, 10] } : {}} 
                                                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                                                className="flex-1 bg-primary-purple/20 border-t-2 border-primary-purple" 
                                             />
                                           ))}
                                        </div>
                                        <p className="text-[9px] text-neutral-400 mt-4 text-center font-medium italic">Data dikirim tepat pada setiap pulsa clock (Timing tetap).</p>
                                     </div>

                                     {/* Asynchronous Block */}
                                     <div className="flex-1 bg-white p-6 rounded-3xl border-2 border-neutral-100 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-6">
                                           <p className="text-[10px] font-black tracking-tighter text-hot-pink bg-hot-pink/10 px-3 py-1 rounded-full uppercase">Asynchronous Timing</p>
                                           <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-vibrant-green animate-pulse' : 'bg-neutral-300'}`} />
                                        </div>
                                        <div className="h-24 flex flex-col justify-center gap-4 relative">
                                           <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-lg relative">
                                              <span className="text-[8px] font-black">MASTER</span>
                                              <motion.div 
                                                animate={isPlaying ? { x: [0, 80, 0] } : {}} 
                                                transition={{ repeat: Infinity, duration: 3 }}
                                                className="w-12 h-1.5 bg-hot-pink rounded-full shadow-[0_0_8px_rgba(255,75,162,0.5)]" 
                                              />
                                              <span className="text-[8px] font-black">SLAVE</span>
                                              {isPlaying && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-mono text-hot-pink">SEND REQ</motion.div>}
                                           </div>
                                           <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-lg relative">
                                              <span className="text-[8px] font-black font-black">MASTER</span>
                                              <motion.div 
                                                animate={isPlaying ? { x: [80, 0, 80] } : { x: 80 }} 
                                                transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
                                                className="w-12 h-1.5 bg-vibrant-green rounded-full shadow-[0_0_8px_rgba(170,229,0,0.5)]" 
                                              />
                                              <span className="text-[8px] font-black">SLAVE</span>
                                              {isPlaying && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1.5 }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-mono text-vibrant-green">REPLY ACK</motion.div>}
                                           </div>
                                        </div>
                                        <p className="text-[9px] text-neutral-400 mt-4 text-center font-medium italic">Data dikirim berdasarkan "Handshaking" (Kapanpun siap).</p>
                                     </div>
                                  </div>
                                </div>
                              );

                            case TabType.PCI:
                              return (
                                <div className="w-full flex flex-col items-center gap-8 py-10">
                                   <div className="relative w-full max-w-2xl p-10 bg-white rounded-3xl border-2 border-neutral-100 shadow-xl overflow-hidden">
                                      <FloatingDoodle color="#AAE500" className="top-4 left-4" />
                                      
                                      <div className="flex flex-col items-center gap-12 relative z-10">
                                         {/* CPU Layer */}
                                         <div className="flex flex-col items-center">
                                            <div className="w-24 h-24 bg-primary-purple rounded-2xl flex items-center justify-center text-white font-black shadow-lg relative group">
                                               <span className="[transform:rotateX(20deg)]">CPU</span>
                                               <div className="absolute inset-0 bg-white/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="h-10 w-1 bg-neutral-200" />
                                         </div>

                                         {/* Bridge Layer - The Core Concept */}
                                         <div className="relative">
                                            <motion.div 
                                              animate={isPlaying ? { scale: [1, 1.05, 1], rotate: [0, 1, 0] } : {}}
                                              transition={{ repeat: Infinity, duration: 4 }}
                                              className="w-48 h-16 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-black tracking-[0.2em] relative shadow-2xl border-2 border-vibrant-green/50"
                                            >
                                               PCI BRIDGE
                                               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vibrant-green text-black px-2 py-0.5 rounded text-[7px] font-black">PROCESSOR INDEPENDENT LAYER</div>
                                            </motion.div>
                                            
                                            {/* Data Particles flowing down from bridge */}
                                            {isPlaying && [0, 1, 2].map(i => (
                                              <motion.div
                                                key={i}
                                                animate={{ y: [0, 60], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                                                className="absolute left-1/2 top-full w-1 h-3 bg-vibrant-green blur-sm"
                                                style={{ marginLeft: `${(i - 1) * 40}px` }}
                                              />
                                            ))}
                                         </div>

                                         {/* Device Row */}
                                         <div className="flex flex-wrap justify-center gap-4">
                                            {Object.entries(pciDevices).map(([id, device]) => (
                                              <button
                                                key={id}
                                                onClick={() => setSelectedPciDevice(selectedPciDevice === id ? null : id)}
                                                className={`w-32 h-14 rounded-xl flex items-center justify-center text-[9px] font-black uppercase italic transition-all duration-300 ${
                                                  selectedPciDevice === id 
                                                    ? `${device.color} text-white shadow-lg scale-110 ring-4 ring-white` 
                                                    : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                                                }`}
                                              >
                                                {device.name}
                                                {selectedPciDevice === id && (
                                                  <motion.div 
                                                    layoutId="pci-active"
                                                    className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                                                  >
                                                    <div className={`w-2 h-2 rounded-full ${device.color} animate-pulse`} />
                                                  </motion.div>
                                                )}
                                              </button>
                                            ))}
                                         </div>
                                      </div>
                                      
                                      {/* Background Grid Pattern */}
                                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                   </div>
                                   
                                   <div className="max-w-md text-center min-h-[60px] flex items-center">
                                      {selectedPciDevice ? (
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="p-4 bg-white rounded-2xl border-2 border-primary-purple/20 shadow-sm"
                                        >
                                          <p className="text-xs font-bold text-primary-purple mb-1">{pciDevices[selectedPciDevice as keyof typeof pciDevices].name}</p>
                                          <p className="text-[10px] text-neutral-600 leading-relaxed font-medium">
                                            {pciDevices[selectedPciDevice as keyof typeof pciDevices].desc}
                                          </p>
                                        </motion.div>
                                      ) : (
                                        <p className="text-xs font-medium text-neutral-500">Klik pada perangkat di atas untuk melihat bagaimana PCI Bridge menghubungkan CPU dengan hardware spesifik.</p>
                                      )}
                                   </div>
                                </div>
                              );

                            case TabType.SIM_READ:
                            case TabType.SIM_ARB:
                              return (
                                <Simulator 
                                  steps={activeTab === TabType.SIM_READ ? SIM_READ_STEPS : SIM_ARB_STEPS} 
                                  activeStep={currentStep} 
                                  type={activeTab === TabType.SIM_READ ? 'read' : 'arb'}
                                  onStepComplete={() => { setIsPlaying(true); handleNext(); }}
                                />
                              );

                            default:
                              return (
                                <div className="relative w-full h-full flex flex-col items-center justify-center gap-20 py-10">
                                   <div className="flex gap-16 md:gap-24">
                                      <IsometricChip label="CPU" color="bg-primary-purple" active={currentStep === 1} status="Master" subLabel="Initiator" />
                                      <IsometricChip label="MEM" color="bg-vibrant-green" status="Target" />
                                      <IsometricChip label="I/O" color="bg-hot-pink" status="Target" />
                                   </div>
                                   <div className="w-full max-w-xl h-6 bg-neutral-900 rounded-xl relative border-4 border-neutral-800">
                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-black text-neutral-400 tracking-widest uppercase">System Communication Bus</div>
                                      {currentStep > 0 && (
                                         <div className="absolute inset-0 flex justify-between px-4">
                                            <motion.div 
                                               animate={isPlaying ? { x: ["0%", "400%", "0%"] } : {}}
                                               transition={{ repeat: Infinity, duration: 3 }}
                                               className="h-full w-16 bg-vibrant-green shadow-[0_0_20px_#AAE500] blur-sm"
                                            />
                                         </div>
                                      )}
                                   </div>
                                </div>
                              );
                          }
                        })()}

                        {/* Playback Control Bar Removed as requested */}
                      </div>
                    </>
                  )}
                </div>

                {/* Navigation Buttons */}
                {!activeTab.includes('quiz') && (
                  <div className="mt-12 flex justify-between items-center">
                    <button 
                      onClick={handlePrev}
                      className="flex items-center gap-2 text-neutral-500 font-bold hover:text-neutral-900 transition-colors"
                    >
                      <ChevronLeft size={20} /> Kembali
                    </button>
                    <div className="hidden md:flex gap-2">
                       {(activeTab === TabType.SIM_READ || activeTab === TabType.SIM_ARB || module) && 
                        Array.from({ length: activeTab === TabType.SIM_READ ? SIM_READ_STEPS.length : (activeTab === TabType.SIM_ARB ? SIM_ARB_STEPS.length : module?.steps.length || 0 )}).map((_, i) => (
                          <div key={i} className={`h-2 rounded-full transition-all ${i === currentStep ? "w-8 bg-primary-purple" : "w-2 bg-neutral-200"}`} />
                        ))
                       }
                    </div>
                    <Button onClick={handleNext}>
                      {module?.steps && currentStep === module.steps.length - 1 ? "Lanjut ke Modul Next" : 
                       (activeTab.includes('sim') && (currentStep === (activeTab === TabType.SIM_READ ? SIM_READ_STEPS.length - 1 : SIM_ARB_STEPS.length - 1))) ? "Selesai Simulasi" :
                       "Lanjut Step"} <ChevronRight size={20} className="inline ml-1" />
                    </Button>
                  </div>
                )}
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

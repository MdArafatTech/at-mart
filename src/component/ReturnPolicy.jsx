import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaUndoAlt, FaSearchPlus, FaExchangeAlt, 
  FaFileInvoice, FaShieldVirus, FaExclamationCircle, FaUserShield,
  FaBoxOpen, FaClipboardCheck, FaCreditCard, FaHeadset, FaTruck, FaCity, FaGlobe
} from "react-icons/fa";

// Ensure this path matches your file structure exactly
import returnHubImage from '../assets/RETURN-01.jpg'; 
import ReturnProgress from "./ReturnProgress";

const ReturnPolicy = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const reclamationSteps = [
    { title: "Initiation", desc: "Request Auth-ID", icon: <FaFileInvoice /> },
    { title: "Encryption", desc: "Original Shell", icon: <FaBoxOpen /> },
    { title: "Transfer", desc: "Regional Hub", icon: <FaTruck /> },
    { title: "Validation", desc: "Integrity Scan", icon: <FaSearchPlus /> },
    { title: "Resolution", desc: "Credit/Sync", icon: <FaCreditCard /> }
  ];

  // Auto-stepping logic for the visual pipeline
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % reclamationSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reclamationSteps.length]);

  return (
    <div className={`min-h-screen pb-12 sm:pb-20 transition-colors duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* HERO SECTION 1 - DYNAMIC LOGISTICS VISUAL */}
      <div className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] relative overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5 }}
          src={returnHubImage}
          alt="AN-Shop Return Hub"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Advanced Gradient Overlay for Professional Depth */}
        <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? "from-[#05070a] via-[#05070a]/40 to-[#05070a]" : "from-slate-900/80 via-transparent to-slate-50"}`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center">
          <motion.button 
            onClick={() => navigate("/")} 
            className="self-start flex items-center gap-2 text-amber-400 font-black mb-12 hover:gap-4 transition-all uppercase tracking-[0.3em] text-xs sm:text-sm"
            whileHover={{ x: 5 }}
          >
            <FaArrowLeft /> Storefront Disconnect
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h1 className="lg:text-7xl sm:text-7xl md:text-8xl  font-black italic tracking-tighter uppercase leading-none drop-shadow-2xl">
              Return & <br />
              <span className="text-amber-400 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent italic">Exchange</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="h-[2px] w-20 bg-amber-400" />
               <p className="text-sm sm:text-lg font-mono tracking-[0.5em] uppercase font-bold text-slate-300">Protocol: AN-RECLAIM-2026</p>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* GLOBAL LOGISTICS GRID - INFO STRIP */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 md:p-12 rounded-[3rem] border backdrop-blur-xl mb-16 sm:mb-24 ${isDarkMode ? "bg-black/60 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "bg-white/90 border-slate-200 shadow-2xl"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
               <FaGlobe className="text-amber-400 text-3xl mx-auto mb-4" />
               <h4 className="font-black uppercase tracking-widest text-sm">247 Nodes</h4>
               <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Global Signal Coverage</p>
            </div>
            <div className={`md:border-x ${isDarkMode ? "border-slate-800" : "border-slate-200"} space-y-2`}>
               <FaShieldVirus className="text-amber-400 text-3xl mx-auto mb-4" />
               <h4 className="font-black uppercase tracking-widest text-sm">Full Encryption</h4>
               <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Secure Asset Recovery</p>
            </div>
            <div className="space-y-2">
               <FaCity className="text-amber-400 text-3xl mx-auto mb-4" />
               <h4 className="font-black uppercase tracking-widest text-sm">Automated Hubs</h4>
               <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Regional Processing</p>
            </div>
          </div>
        </motion.div>

        {/* RECLAMATION PIPELINE - STEPPER */}
        <section className="mb-20 sm:mb-32">
          <h2 className="font-black text-xl sm:text-xl uppercase tracking-[0.3em] mb-12 text-center text-amber-400 italic">Reclamation Pipeline</h2>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {reclamationSteps.map((step, idx) => (
              <motion.div 
                key={idx} 
                className="flex flex-col items-center group w-32 sm:w-40"
              >
                <motion.div 
                  animate={{ 
                    scale: idx === activeStep ? 1.15 : 1,
                    borderColor: idx === activeStep ? "#f59e0b" : "rgba(148, 163, 184, 0.2)",
                    boxShadow: idx === activeStep ? "0 0 30px rgba(245, 158, 11, 0.3)" : "none"
                  }}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center text-2xl mb-6 border-2 transition-all ${
                    idx === activeStep ? "bg-amber-500/10 text-amber-500" : "bg-transparent opacity-20"
                  }`}
                >
                  {step.icon}
                </motion.div>
                <p className={`text-xs sm:text-sm font-black uppercase tracking-widest text-center ${idx === activeStep ? "text-amber-400" : "opacity-30"}`}>{step.title}</p>
                <p className="text-[10px] opacity-40 text-center mt-2 font-bold uppercase tracking-tighter">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          
          {/* CORE POLICY SECTION */}
          <div className="lg:col-span-2 space-y-12">
            
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-amber-400 font-black text-2xl uppercase italic tracking-widest border-l-4 border-amber-400 pl-6">01. Reclamation Terms</h3>
              <p className="lg:text-xl md:text-md sm:text-sm leading-relaxed opacity-70 font-semibold font-sans">
                Every physical asset return requires a unique <span className="text-amber-400 font-black">AUTH-ID</span> verified by our grid. 
                Assets must be dispatched in their original shell. Tampering with internal logistics seals triggers an immediate <span className="text-rose-500 font-black">POLICY VIOLATION</span> status.
              </p>
              
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[3rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-400/50 shadow-2xl" : "bg-white shadow-xl border-slate-100"}`}
              >
                <FaClipboardCheck className="text-amber-400 text-4xl mb-8" />
                <h4 className="font-black text-xl uppercase mb-4 italic tracking-widest">Quality Control</h4>
                <p className="text-base opacity-60 leading-relaxed font-medium">3D biometrics match returned hardware to the original Digital Fingerprint registered at checkout.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[3rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-400/50 shadow-2xl" : "bg-white shadow-xl border-slate-100"}`}
              >
                <FaCreditCard className="text-amber-400 text-4xl mb-8" />
                <h4 className="font-black text-xl uppercase mb-4 italic tracking-widest">Credit Reversal</h4>
                <p className="text-base opacity-60 leading-relaxed font-medium">Refunds are processed to the original payment node. Standard synchronization: 5-7 business cycles.</p>
              </motion.div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              className={`p-10 sm:p-14 rounded-[3.5rem] border-4 border-dashed transition-all ${
                isDarkMode 
                  ? "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40" 
                  : "border-amber-500/20 bg-amber-50/50 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center gap-6 mb-8 text-amber-400">
                <FaExclamationCircle className="text-md animate-pulse" />
                <h3 className="font-black text-xl uppercase tracking-[0.2em] italic">DOA Protocol</h3>
              </div>
              <p className="text-md sm:text-sm  leading-relaxed opacity-80 italic font-bold">
                Report physical damage (Signal Failure) within 24 hours with photographic evidence to bypass the standard 7-day review queue.
              </p>
            </motion.div>
          </div>






<ReturnProgress></ReturnProgress>














          {/* SIDEBAR LOGISTICS */}
          <div className="space-y-10">
            
            {/* SECURITY CARD */}
            <div className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800 shadow-2xl" : "bg-white shadow-2xl border-slate-100"}`}>
              <h3 className="font-black text-xs uppercase tracking-[0.4em] opacity-40 mb-10">Security Clearance</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-sm font-bold opacity-60 uppercase">Eligibility</span>
                  <span className="text-sm font-black text-emerald-400 tracking-widest">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-sm font-bold opacity-60 uppercase">Auth-ID Check</span>
                  <span className="text-sm font-black text-amber-400 tracking-widest">REQUIRED</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-bold opacity-60 uppercase">Grid Signal</span>
                  <span className="text-sm font-black text-emerald-400 tracking-widest">VERIFIED</span>
                </div>
              </div>
            </div>

            {/* RESTRICTED LIST */}
            <div className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-red-500/5 border-red-500/10" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-center gap-4 mb-8 text-red-500">
                <FaShieldVirus className="text-2xl" />
                <h4 className="font-black text-sm uppercase tracking-widest leading-none">Restricted Assets</h4>
              </div>
              <ul className="text-sm font-black uppercase space-y-4 opacity-70 italic tracking-wider">
                <li>• Digital License Keys</li>
                <li>• Custom Visual Branding</li>
                <li>• Hygiene Wearables</li>
                <li>• Flash Sale Acquisitions</li>
              </ul>
            </div>

            {/* LIVE SUPPORT */}
            <div className={`p-10 rounded-[3.5rem] border border-amber-500/20 text-center ${isDarkMode ? "bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]" : "bg-amber-50 shadow-xl"}`}>
              <FaHeadset className="text-amber-400 text-2xl mx-auto mb-8" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-40">Support Node Signal</p>
              <p className="text-md font-black text-amber-400 tracking-tighter mb-8">SUPPORT@AN-SHOP.DEV</p>
              <button className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all shadow-lg shadow-amber-500/20 cursor-pointer">
                Initialize Chat
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 py-16 border-t border-slate-800/20 text-center">
        <p className="text-md sm:text-base font-mono font-black uppercase tracking-[0.8em] opacity-20">
          --- SYSTEM END: RECLAIM PROTOCOL ---
        </p>
      </footer>
    </div>
  );
};

export default ReturnPolicy;
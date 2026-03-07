import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaChevronDown, FaTerminal, FaFingerprint, 
  FaCreditCard, FaTruck, FaShieldAlt, FaMicrochip,
  FaServer, FaLink, FaDatabase, FaSatelliteDish
} from "react-icons/fa";

const FAQ = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [pulse, setPulse] = useState(true);

  // Simulated heartbeat for the "Professional" feel
  useEffect(() => {
    const interval = setInterval(() => setPulse(!pulse), 2000);
    return () => clearInterval(interval);
  }, [pulse]);

  const faqData = [
    {
      id: 0,
      icon: <FaFingerprint />,
      category: "SECURITY",
      question: "WHAT IS AN 'AUTH-ID' AND WHY IS IT REQUIRED?",
      answer: "The AUTH-ID is a unique 16-digit encrypted string generated for every successful acquisition. It serves as your digital handshake for all support and reclamation protocols. Without a verified AUTH-ID, our logistics nodes cannot authorize asset returns or status overrides."
    },
    {
      id: 1,
      icon: <FaTruck />,
      category: "LOGISTICS",
      question: "HOW DO ELECTION RESTRICTIONS AFFECT MY DELIVERY?",
      answer: "Due to the February 2026 National Election protocols in Bangladesh, certain logistics channels may experience 'Signal Latency.' Vehicle movement restrictions often result in a 48-72 hour delay for remote Upazila nodes. Please monitor your real-time tracking interface for status updates."
    },
    {
      id: 2,
      icon: <FaCreditCard />,
      category: "FINANCIAL",
      question: "HOW ARE 'CREDIT REVERSALS' PROCESSED?",
      answer: "Refunds are transmitted as 'Credit Reversals' directly to your original payment node. While our system executes the transfer immediately upon 'Validation' of the returned asset, global banking synchronizations typically require 5-7 business cycles to reflect in your terminal."
    },
    {
      id: 3,
      icon: <FaShieldAlt />,
      category: "QUALITY",
      question: "WHAT HAPPENS IF I FAIL THE 'INTEGRITY SCAN'?",
      answer: "Every returned hardware asset undergoes a high-fidelity 3D integrity scan. If the physical 'Digital Fingerprint' does not match the original ship-out state (due to tampering or unauthorized repairs), the reclamation protocol is suspended and the asset is flagged for manual review."
    },
    {
      id: 4,
      icon: <FaSatelliteDish />,
      category: "PREMIUM",
      question: "DO YOU OFFER 'WHITE-GLOVE' PRIORITY DISPATCH?",
      answer: "Yes. For Tier-1 acquisitions, we offer 'White-Glove' synchronization. This includes a dedicated logistics courier, real-time GPS signal sharing, and on-site unboxing to ensure the asset's 'Zero-Hour' integrity is maintained."
    },
    {
      id: 5,
      icon: <FaLink />,
      category: "NETWORK",
      question: "CAN I MERGE MULTIPLE ACQUISITIONS INTO ONE SIGNAL?",
      answer: "To ensure maximum asset safety, our system defaults to 'Single-Stream' logistics. However, if multiple acquisitions are initiated within a 4-hour window to the same coordinates, our hub may 'Bundle' the signals to optimize the transfer pipeline."
    },
    {
      id: 6,
      icon: <FaDatabase />,
      category: "DATA",
      question: "HOW LONG IS MY ACQUISITION DATA RETAINED?",
      answer: "In compliance with Global Privacy Protocols, your acquisition data is stored in our encrypted 'Cold-Vault' for 365 days. After this cycle, the data is purged, and only a hashed summary of the transaction remains for warranty validation."
    }
  ];

  return (
    <div className={`min-h-screen pt-4 sm:pt-20 pb-20 transition-colors duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* HEADER SECTION */}
        <div className="mb-20">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-amber-500 mb-12 font-black cursor-pointer hover:gap-4 transition-all text-[10px] uppercase tracking-[0.4em]"
          >
            <FaArrowLeft /> Storefront Disconnect
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <FaTerminal className="text-amber-500 text-3xl animate-pulse" />
                  <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                    System <span className="text-amber-500">FAQ</span>
                  </h1>
               </div>
               <p className="text-[10px] font-mono tracking-[0.5em] uppercase font-bold text-slate-400 border-l-4 border-amber-500 pl-6">
                 Knowledge Base // Signal-ID: AN-884-KB
               </p>
            </div>

            {/* LIVE SYSTEM HEALTH DASHBOARD */}
            <div className={`p-6 rounded-[2rem] border hidden md:block ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}>
               <div className="flex items-center gap-6">
                  <div className="text-center">
                     <p className="text-[8px] font-black opacity-40 uppercase mb-1">Database</p>
                     <p className="text-xs font-mono text-emerald-500 font-black">STABLE</p>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-800" />
                  <div className="text-center">
                     <p className="text-[8px] font-black opacity-40 uppercase mb-1">Network</p>
                     <p className="text-xs font-mono text-emerald-500 font-black">99.9%</p>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-800" />
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${pulse ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-amber-900'}`} />
                     <p className="text-[9px] font-black uppercase tracking-widest">Live Signal</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-6">
          {faqData.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200 shadow-2xl"
              } ${expanded === item.id ? "ring-2 ring-amber-500/20" : ""}`}
            >
              <button
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="w-full p-8 md:p-10 flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-8">
                  <div className={`p-4 rounded-2xl transition-all ${expanded === item.id ? "bg-amber-500 text-black scale-110" : "bg-slate-800/20 text-slate-500"}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[8px] font-black tracking-[0.3em] text-amber-500 mb-2 opacity-60">[{item.category}]</p>
                    <h3 className="text-sm md:text-lg font-black uppercase tracking-widest leading-tight group-hover:text-amber-400 transition-colors italic">
                      {item.question}
                    </h3>
                  </div>
                </div>
                <div className={`text-xl transition-transform duration-500 ${expanded === item.id ? "rotate-180 text-amber-400" : "text-slate-700"}`}>
                  <FaChevronDown />
                </div>
              </button>

              <AnimatePresence>
                {expanded === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`border-t ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
                  >
                    <div className="p-10 md:p-14 pt-8 text-base md:text-lg leading-relaxed font-semibold opacity-70 italic font-sans pr-12">
                      <FaServer className="inline mr-4 text-amber-500/40 text-sm" />
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* SUPPORT ACTION PANEL */}
        <div className={`mt-24 p-12 rounded-[4rem] border-2 border-dashed relative overflow-hidden transition-all ${
          isDarkMode ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40" : "bg-amber-50 border-amber-500/20 shadow-2xl"
        }`}>
          <div className="relative z-10 flex flex-col items-center text-center">
            <FaSatelliteDish className="text-amber-500 text-5xl mb-8 animate-bounce" />
            <h3 className="text-2xl font-black uppercase tracking-[0.3em] mb-4 italic">Encrypted Uplink</h3>
            <p className="text-lg font-bold opacity-60 mb-10 max-w-xl">
              If your inquiry requires direct technician intervention, initiate a secure channel below.
            </p>
           <a href="/about"> <button  className="px-20 py-6 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-3xl text-xs uppercase tracking-[0.4em] transition-all cursor-pointer shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95">
              Initialize Support Signal
            </button></a>
          </div>
          {/* Background decorative text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black opacity-[0.02] pointer-events-none select-none italic">
            AN
          </div>
        </div>

        <footer className="mt-32 text-center">
          <p className="text-[10px] font-mono font-black uppercase tracking-[1em] opacity-20 mb-4">--- SYSTEM STATUS: OPTIMAL ---</p>
          <div className="w-16 h-1 bg-amber-500 mx-auto opacity-20" />
        </footer>
      </main>
    </div>
  );
};

export default FAQ;
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaGlobe, FaMapMarkerAlt, 
  FaShieldAlt, FaClock, FaExclamationTriangle, FaChartLine 
} from "react-icons/fa";
import { FaCity } from "react-icons/fa6";

// Ensure this path matches your assets directory
import hubImage from '../assets/shipingimg.png'; 

const ShippingPolicy = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const iconVariants = {
    hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
  };

  const policyManifests = [
    {
      icon: <FaChartLine className="text-amber-500" />,
      title: "Logistic Protocol: Hub Distribution",
      content: "All physical acquisitions are initiated through our Primary Central Processing Hub. Upon verification, assets are disaggregated and routed through dedicated logistics channels to your specified District and Upazila coordinates. This multi-nodal system ensures asset integrity and data encryption throughout the entire transfer process."
    },
    {
      icon: <FaMapMarkerAlt className="text-amber-500" />,
      title: "Coordinate Accuracy & Validation",
      content: "Delivery signal integrity relies on precise input data. Ensure your Address, Upazila, and District parameters match legalized identification to prevent 'Dropped Signal' status (failed acquisition). We enforce end-to-end data encryption for all unique drop-off coordinates. Any mismatch flags the asset for immediate manual verification."
    },
    {
      icon: <FaShieldAlt className="text-amber-500" />,
      title: "Contact Signal & Authentication",
      content: "A confirmed 'Contact Signal' (Phone Line) is absolute mandatory for the final 'Drop-Off' synchronization phase. Our logistic nodes must establish connection with the target recipient 12-24 hours prior to final asset transfer. Failure to establish a connection will suspend the transfer protocol and return the asset to the nearest regional node."
    }
  ];

  return (
    <div className={`min-h-screen pt-4 sm:pt-20 pb-20 transition-colors duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. HERO SECTION */}
      <div 
        className="w-full h-80 sm:h-96 relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${hubImage})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? "from-[#05070a]/90 via-[#05070a]/50" : "from-slate-900/70 via-transparent"} to-transparent`} />
        
        <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10 flex flex-col justify-end h-full pb-10">
          <button 
            onClick={() => navigate("/")} 
            className="self-start flex items-center gap-2 text-amber-500 mb-8 font-black cursor-pointer hover:text-amber-400 transition-colors text-[10px] uppercase tracking-[0.3em] shadow-lg"
          >
            <FaArrowLeft /> Storefront Disconnect
          </button>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-2 uppercase leading-none text-white drop-shadow-2xl">
              Shipping <span className="text-amber-500">Protocol</span>
            </h1>
            <p className="text-[10px] font-mono tracking-[0.5em] uppercase font-bold text-slate-300">AN-SHOP LOGISTICS COMMAND | VER: LOG-2026.1</p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* 2. POLICY MANIFESTS */}
          <div className="lg:col-span-3 space-y-8">
            <h2 className="font-black text-[10px] uppercase tracking-[0.5em] mb-6 opacity-40">System Core Manifests</h2>
            
            {policyManifests.map((manifest, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-[2.5rem] border group transition-all duration-500 ${
                  isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/30 shadow-2xl" : "bg-white shadow-xl border-slate-100"
                }`}
              >
                <div className="flex items-center gap-5 mb-6 border-b border-slate-800/10 pb-5">
                  <motion.div variants={iconVariants} whileHover="hover" className="text-3xl text-amber-500">
                    {manifest.icon}
                  </motion.div>
                  <h3 className={`font-black text-sm sm:text-base uppercase italic tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"} group-hover:text-amber-500 transition-colors`}>
                    {manifest.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed opacity-60 font-medium font-sans">
                  {manifest.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 3. LOGISTICS SIDEBAR */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-black text-[10px] uppercase tracking-[0.5em] mb-6 opacity-40">Logistics Metrics</h2>
            
            {/* HUB STATUS */}
            <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800 shadow-2xl" : "bg-white shadow-xl border-slate-100"}`}>
              <div className="flex gap-4 items-center mb-8 text-amber-500">
                <FaClock className="text-xl" />
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] leading-none">Hub Status: Live Signal</h3>
              </div>
              
              <div className="h-1 w-full bg-slate-800 rounded-full mb-8 relative overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} 
                  className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" 
                />
              </div>
              
              <div className="space-y-4 opacity-60 font-mono text-[10px] uppercase tracking-wider leading-relaxed">
                <p>Central Hub Nodes (Dhaka/CT): <span className="text-emerald-500 font-black">Active</span></p>
                <p>Peripheral Nodes (Remote): <span className="text-amber-500 font-black">Optimal</span></p>
              </div>
            </div>

            {/* RATE TABLE */}
            <div className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-black/40 border-slate-800 shadow-inner" : "bg-slate-100 border-slate-200"}`}>
               <h3 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-amber-500 italic">Transfer Rates by Hub Zone</h3>
               
               <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800/20 pb-4">
                      <span className="text-[11px] font-bold uppercase opacity-60 flex gap-3 items-center"><FaCity className="text-amber-500" /> Dhaka City Core</span>
                      <span className="text-2xl text-emerald-500 font-mono font-black">0.5 <span className="text-[10px]">Cr</span></span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800/20 pb-4">
                      <span className="text-[11px] font-bold uppercase opacity-60 flex gap-3 items-center"><FaMapMarkerAlt className="text-amber-500" /> Regional Centers</span>
                      <span className="text-2xl text-emerald-500 font-mono font-black">1.0 <span className="text-[10px]">Cr</span></span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                      <span className="text-[11px] font-bold uppercase opacity-60 flex gap-3 items-center"><FaGlobe className="text-amber-400" /> Remote Upazila</span>
                      <span className="text-2xl text-emerald-500 font-mono font-black">1.5 <span className="text-[10px]">Cr</span></span>
                  </div>
               </div>
            </div>

            {/* LATENCY ALERT - ELECTION SPECIFIC */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex gap-6 p-8 border-l-4 border-amber-500 bg-amber-500/5 rounded-r-[2.5rem] shadow-2xl shadow-amber-500/5"
            >
              <FaExclamationTriangle className="text-amber-500 shrink-0 text-3xl" />
              <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Latency Alert [Protocol Update]</p>
                  <p className="text-xs leading-relaxed opacity-80 font-mono font-bold tracking-tighter">
                    NATIONAL ELECTION NOTICE: Due to transport restrictions for the February 2026 National Election, expect delivery signal latency of 48-72 hours across all peripheral nodes.
                  </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-24 text-center border-t border-slate-800/20 pt-16">
            <p className="text-[9px] font-black font-mono uppercase tracking-[1em] opacity-20 mb-12">--- End of Transfer Protocol Manifest ---</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/")}
              className={`px-16 py-6 bg-transparent border-2 cursor-pointer ${isDarkMode ? "border-slate-800" : "border-slate-200"} hover:border-amber-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all`}
            >
                Disconnect From Command Center
            </motion.button>
        </footer>
      </main>
    </div>
  );
};

export default ShippingPolicy;